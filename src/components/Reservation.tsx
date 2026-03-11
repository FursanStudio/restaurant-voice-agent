"use client";
import { useState } from "react";

export default function Reservation() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "7:00 PM", guests: "2 Guests" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const input = { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(201,169,110,0.12)", color: "#d6c4aa", padding: "0.75rem 1rem", fontSize: "0.85rem", outline: "none", width: "100%", fontFamily: "inherit" };
  const label = { fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#7a6140", display: "block", marginBottom: "0.4rem" };

  return (
    <section id="reserve" style={{ padding: "6rem 4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

        {/* Left text */}
        <div>
          <p style={{ color: "#c9a96e", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Reserve Your Evening</p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, color: "#f5ede0", lineHeight: 1.2, marginBottom: "1.2rem" }}>
            An evening<br />worth remembering.
          </h2>
          <p style={{ color: "#7a6e62", lineHeight: 1.8, fontSize: "0.95rem" }}>
            Tables are intimate and limited. We recommend booking at least a week in advance. Private dining available for groups of 8 or more.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {[{ icon: "📍", text: "147 West 57th Street, New York" }, { icon: "📞", text: "+1 (212) 555-0147" }, { icon: "🕐", text: "Tue–Sun: 6:00 PM – 11:00 PM" }].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: "0.75rem", color: "#7a6e62", fontSize: "0.875rem" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Glassmorphism form */}
        <div style={{ border: "1px solid rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.04)", backdropFilter: "blur(12px)", padding: "2.5rem" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", color: "#f5ede0", marginBottom: "0.5rem" }}>Confirmed!</h3>
              <p style={{ color: "#7a6e62", fontSize: "0.875rem" }}>We&apos;ll see you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={label}>Full Name *</label><input required style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
                <div><label style={label}>Phone</label><input style={input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={label}>Date *</label><input required type="date" style={input} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div>
                  <label style={label}>Time</label>
                  <select style={input} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                    {["6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={label}>Party Size</label>
                <select style={input} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                  {["2 Guests","3 Guests","4 Guests","5 Guests","6 Guests","7 Guests","8+ Private Dining"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <button type="submit" disabled={status === "loading"} style={{ background: "#c9a96e", color: "#0a0705", border: "none", padding: "1rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", marginTop: "0.5rem" }}>
                {status === "loading" ? "Confirming..." : "Confirm Reservation"}
              </button>
              {status === "error" && <p style={{ color: "#f87171", fontSize: "0.75rem", textAlign: "center" }}>Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}