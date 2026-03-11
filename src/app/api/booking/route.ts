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
    const body = await req.json();
    const { name, phone, date, time, guests, notes } = body;

    if (!name || !date || !time || !guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("bookings")
      .insert([{ name, phone, date, time, guests, notes }]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    // Send email via Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.MANAGER_EMAIL!,
      subject: `New Booking — ${name}`,
      html: `
        <h2>New Table Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Notes:</strong> ${notes || "None"}</p>
      `,
    });

    return NextResponse.json({ success: true, message: `Booking confirmed for ${name}!` });

  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}