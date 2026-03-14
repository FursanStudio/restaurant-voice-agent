import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: "API key not configured." }, { status: 500 });
    }

    const menuContext = `
Restaurant: Ember & Salt, New York.
Hours: Tue-Sun 6PM-11PM. Closed Mondays.
Phone: +1 (212) 555-0147

MENU:
Starters: Oyster & Ember Foam $34, Garden Veil $28
Mains: Salt-Crust Lamb $89, Dry-Aged Halibut $74, A5 Wagyu Coal $145
Desserts: Dark Caramel Orb $24

Booking times: 6:00PM, 6:30PM, 7:00PM, 7:30PM, 8:00PM, 8:30PM, 9:00PM
`;

    const conversationMessages = (history || []).map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI Host for Ember & Salt restaurant.
Use this info to answer: ${menuContext}

Rules:
- Keep answers short (2-3 sentences max)
- For bookings, collect Name, Date, Time, Party Size one by one
- Once you have ALL 4 details confirmed, reply with EXACTLY this format on its own line:
  BOOKING_CONFIRMED: name=[ActualName] date=[ActualDate] time=[ActualTime] guests=[ActualNumber]
- Example: BOOKING_CONFIRMED: name=[John] date=[March 20th] time=[7 PM] guests=[2]
- Always use square brackets around each value, no exceptions
- Only answer restaurant related questions
- Be warm and professional`,
          },
          ...conversationMessages,
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", err);
      return NextResponse.json({ reply: "AI error. Please try again." });
    }

    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't process that.";

    // Detect booking confirmation
    if (reply.includes("BOOKING_CONFIRMED:")) {
      const nameMatch = reply.match(/name=\[([^\]]+)\]/);
      const dateMatch = reply.match(/date=\[([^\]]+)\]/);
      const timeMatch = reply.match(/time=\[([^\]]+)\]/);
      const guestsMatch = reply.match(/guests=\[([^\]]+)\]/);

      const name = nameMatch?.[1] || "Guest";
      const date = dateMatch?.[1] || "TBD";
      const time = timeMatch?.[1] || "TBD";
      const guests = guestsMatch?.[1] || "2";

      // Save to Supabase
      const { error: dbError } = await supabase
        .from("bookings")
        .insert([{ name, date, time, guests }]);

      if (dbError) console.error("Supabase error:", dbError);

      // Send email
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.MANAGER_EMAIL!,
        subject: `New Booking — ${name}`,
        html: `
          <h2>🍽️ New Booking at Ember & Salt</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Guests:</strong> ${guests}</p>
        `,
      });

      reply = `Your table is confirmed! We look forward to welcoming ${name} on ${date} at ${time} for ${guests} guests. See you soon! 🍽️`;
    }

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ reply: "Server error. Please try again." }, { status: 500 });
  }
}