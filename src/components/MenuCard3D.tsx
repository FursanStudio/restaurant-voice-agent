"use client";

// Using HTML overlay on top of Canvas for crisp text
export default function MenuCard3D() {
  const cards = [
    { emoji: "🔥", title: "Salt-Crust Lamb", desc: "48-hour lamb rack, herb salt crust", price: "$89", tag: "Signature" },
    { emoji: "🥩", title: "A5 Wagyu Coal", desc: "Japanese A5 sirloin, black truffle butter", price: "$145", tag: "Signature" },
    { emoji: "🐟", title: "Dry-Aged Halibut", desc: "Line-caught, saffron beurre blanc", price: "$74", tag: "Main" },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", padding: "2rem 1rem", flexWrap: "wrap" }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            width: 200,
            background: "linear-gradient(135deg, #1a1208, #0d0904)",
            border: "1px solid rgba(201,169,110,0.3)",
            padding: "2rem 1.5rem",
            textAlign: "center",
            position: "relative",
            cursor: "pointer",
            transition: "all 0.4s ease",
            animation: `floatCard 3s ease-in-out ${i * 0.5}s infinite`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.8)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(201,169,110,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          }}
        >
          {/* Tag */}
          <span style={{
            position: "absolute", top: "0.8rem", right: "0.8rem",
            fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#7a6140", border: "1px solid rgba(201,169,110,0.2)",
            padding: "0.15rem 0.4rem", background: "rgba(201,169,110,0.05)"
          }}>
            {card.tag}
          </span>

          {/* Top gold line */}
          <div style={{ width: "40px", height: "1px", background: "#c9a96e", margin: "0 auto 1.2rem" }} />

          {/* Emoji */}
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{card.emoji}</div>

          {/* Title */}
          <h3 style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.1rem", color: "#f5ede0",
            fontWeight: 600, marginBottom: "0.6rem", lineHeight: 1.3
          }}>
            {card.title}
          </h3>

          {/* Desc */}
          <p style={{
            fontSize: "0.7rem", color: "#7a6e62",
            lineHeight: 1.5, marginBottom: "1.2rem"
          }}>
            {card.desc}
          </p>

          {/* Bottom gold line */}
          <div style={{ width: "40px", height: "1px", background: "#c9a96e", margin: "0 auto 0.8rem" }} />

          {/* Price */}
          <span style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.3rem", color: "#c9a96e"
          }}>
            {card.price}
          </span>
        </div>
      ))}

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}