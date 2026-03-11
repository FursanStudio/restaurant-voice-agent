export default function VoiceTeaser() {
  const features = [
    { icon: "📋", title: "Menu Help", desc: "Ask about any dish or allergens" },
    { icon: "📅", title: "Reservations", desc: "Book your table instantly" },
    { icon: "🌙", title: "24 / 7", desc: "Always available after hours" },
    { icon: "⚡", title: "Instant", desc: "No waiting. Just answers." },
  ];

  return (
    <section id="voice" style={{ padding: "7rem 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, background: "radial-gradient(circle,rgba(201,169,110,0.07),transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <p style={{ color: "#c9a96e", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.8rem" }}>AI-Powered Hospitality</p>
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, color: "#f5ede0" }}>
        Meet Your<br />Digital Host
      </h2>
      <p style={{ color: "#7a6e62", maxWidth: 480, margin: "1rem auto 0", lineHeight: 1.8, fontSize: "0.95rem" }}>
        Ask about our menu, make reservations, or get recommendations — all with your voice or by typing.
      </p>

      {/* Orb with ripples */}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "4rem 0 1rem" }}>
        {[160, 210, 265].map((size, i) => (
          <div key={size} style={{
            position: "absolute", borderRadius: "50%",
            border: "1px solid rgba(201,169,110,0.2)",
            width: size, height: size,
            animation: `ripple 3s ease-out ${i * 0.8}s infinite`,
          }} />
        ))}
        <div style={{ position: "relative", zIndex: 1, width: 120, height: 120, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", border: "1px solid rgba(201,169,110,0.2)", background: "radial-gradient(circle at 40% 35%, rgba(201,169,110,0.2), transparent 70%)", cursor: "pointer" }}>
          🎤
        </div>
      </div>

      {/* Live badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "4rem" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
        <p style={{ color: "#4ade80", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: 0 }}>
          Live — Click the 🎤 button at the bottom right!
        </p>
      </div>

      {/* Features */}
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} style={{ textAlign: "center", width: 140 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", marginBottom: "0.3rem" }}>{title}</div>
            <div style={{ fontSize: "0.75rem", color: "#7a6e62", lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ripple {
          0%   { opacity: 0.5; transform: scale(0.85); }
          100% { opacity: 0;   transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}