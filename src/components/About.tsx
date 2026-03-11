export default function About() {
  return (
    <section id="about" style={{ padding: "6rem 4rem", maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
      
      {/* Visual */}
      <div style={{ position: "relative", aspectRatio: "4/5", background: "linear-gradient(135deg,#1a1208,#0d0904)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 40%, rgba(201,169,110,0.15), transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>🍽️</div>
        {/* Glassmorphism badge */}
        <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", border: "1px solid rgba(201,169,110,0.18)", background: "rgba(201,169,110,0.06)", backdropFilter: "blur(12px)", padding: "1rem 1.5rem", textAlign: "center" }}>
          <span style={{ display: "block", fontFamily: "var(--font-playfair)", fontSize: "2rem", color: "#c9a96e" }}>12</span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a6e62" }}>Years of Craft</span>
        </div>
      </div>

      {/* Text */}
      <div>
        <p style={{ color: "#c9a96e", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Our Story</p>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, color: "#f5ede0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
          Crafted with intention,<br />served with soul.
        </h2>
        <p style={{ color: "#7a6e62", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" }}>
          Ember &amp; Salt was born from a simple belief — that the finest meals are an act of care. Each dish is a conversation between fire, time, and the land&apos;s finest ingredients.
        </p>
        <p style={{ color: "#7a6e62", lineHeight: 1.8, fontSize: "0.95rem" }}>
          Our kitchen is led by Chef Marina Voss, whose philosophy is rooted in the alchemy of restraint. Nothing superfluous. Every element earned.
        </p>
        {/* Stats */}
        <div style={{ display: "flex", gap: "2.5rem", marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
          {[{ val: "4.9", label: "Guest Rating" }, { val: "38", label: "Seasonal Dishes" }, { val: "2★", label: "Michelin Stars" }].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: "2.2rem", color: "#c9a96e" }}>{val}</div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a6e62", marginTop: "0.2rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}