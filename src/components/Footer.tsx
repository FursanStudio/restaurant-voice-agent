export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(201,169,110,0.1)", padding: "3rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
      <div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.3rem", color: "#e8c98a", marginBottom: "0.4rem" }}>Ember &amp; Salt</div>
        <div style={{ color: "#7a6e62", fontSize: "0.75rem", lineHeight: 1.8 }}>
          147 West 57th Street, New York, NY 10019<br />
          reservations@emberandsalt.com · +1 (212) 555-0147
        </div>
      </div>
      <div style={{ color: "#7a6e62", fontSize: "0.75rem", textAlign: "center", lineHeight: 1.8 }}>
        Tue–Sun: 6:00 PM – 11:00 PM<br />Closed Mondays
      </div>
      <div style={{ color: "#7a6140", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
        © {new Date().getFullYear()} Ember &amp; Salt. All rights reserved.
      </div>
    </footer>
  );
}