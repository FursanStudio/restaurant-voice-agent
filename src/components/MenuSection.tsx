"use client";

const items = [
  { id: 1, emoji: "🦪", tag: "Starter", name: "Oyster & Ember Foam", desc: "Kumamoto oyster, smoked cream, charred leek oil, golden caviar.", price: 34 },
  { id: 2, emoji: "🌿", tag: "Starter", name: "Garden Veil", desc: "Burrata, heirloom tomatoes, basil oil pearls, aged balsamic dust.", price: 28 },
  { id: 3, emoji: "🔥", tag: "Signature", name: "Salt-Crust Lamb", desc: "48-hour lamb rack, herb salt crust, smoked jus, ember-roasted root.", price: 89 },
  { id: 4, emoji: "🐟", tag: "Main", name: "Dry-Aged Halibut", desc: "Line-caught, 5-day dry-aged, saffron beurre blanc, micro herbs.", price: 74 },
  { id: 5, emoji: "🥩", tag: "Signature", name: "A5 Wagyu Coal", desc: "Japanese A5 sirloin, coal-fired, black truffle butter, fleur de sel.", price: 145 },
  { id: 6, emoji: "🍮", tag: "Dessert", name: "Dark Caramel Orb", desc: "72% Valrhona sphere, salted caramel, smoked hazelnut, edible gold.", price: 24 },
];

export default function MenuSection() {
  return (
    <section id="menu" style={{ padding: "5rem 1.5rem", background: "linear-gradient(to bottom, #0a0705, #110d0a 50%, #0a0705)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p style={{ color: "#c9a96e", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Tonight&apos;s Selection</p>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, color: "#f5ede0" }}>
          The <em style={{ fontStyle: "italic", color: "#e8c98a" }}>Tasting Menu</em>
        </h2>
      </div>

      <div className="menu-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1px", maxWidth: "1200px", margin: "0 auto", background: "rgba(201,169,110,0.1)" }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: "#110d0a", padding: "2rem 1.5rem", position: "relative", transition: "transform 0.3s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
            <span style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7a6140", border: "1px solid rgba(201,169,110,0.15)", background: "rgba(201,169,110,0.04)", backdropFilter: "blur(8px)", padding: "0.2rem 0.5rem" }}>
              {item.tag}
            </span>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>{item.emoji}</span>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#f5ede0", marginBottom: "0.5rem", fontWeight: 600 }}>{item.name}</h3>
            <p style={{ color: "#7a6e62", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>{item.desc}</p>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "#c9a96e" }}>${item.price}</span>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .menu-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .menu-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}