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
    const { message } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
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

    const prompt = `You are a helpful AI Host for Ember & Salt restaurant.
Use this info to answer: ${menuContext}

Rules:
- Keep answers short (2-3 sentences)
- If asked to book, collect: Name, Date, Time, Party Size one by one
- Once you have all 4 details, reply with EXACTLY this format:
  BOOKING_CONFIRMED: name=[Name] date=[Date] time=[Time] guests=[Guests]
- Only answer restaurant related questions
- Be warm and professional

Customer says: ${message}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ reply: "Gemini API error. Check your API key." });
    }

    const data = await res.json();
    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't process that.";

    // Detect booking confirmation from Gemini
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

      reply = `Your table is confirmed! We look forward to welcoming ${name} on ${date} at ${time} for ${guests}. See you soon! 🍽️`;
    }

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ reply: "Server error. Please try again." }, { status: 500 });
  }
}