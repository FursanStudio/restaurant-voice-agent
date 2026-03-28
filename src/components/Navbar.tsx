"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const links = [
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Voice AI", href: "#voice" },
    { label: "Reserve", href: "#reserve" },
  ];

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "0.8rem 1.5rem" : "1.2rem 1.5rem", background: scrolled ? "rgba(10,7,5,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

      {/* Logo */}
      <div onClick={() => scrollTo("#")} style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", color: "#e8c98a", cursor: "pointer" }}>
        Ember &amp; Salt
      </div>

      {/* Desktop links */}
      <div className="nav-links" style={{ display: "flex", gap: "2.5rem" }}>
        {links.map(({ label, href }) => (
          <button key={label} onClick={() => scrollTo(href)} style={{ background: "none", border: "none", color: "#7a6e62", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
            onMouseLeave={e => (e.currentTarget.style.color = "#7a6e62")}>
            {label}
          </button>
        ))}
      </div>

      {/* Book button */}
      <button className="nav-book" onClick={() => scrollTo("#reserve")} style={{ background: "transparent", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.4)", padding: "0.5rem 1.2rem", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
        Book a Table
      </button>

      {/* Mobile hamburger */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: "1.5rem", cursor: "pointer", display: "none" }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10,7,5,0.98)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "#c9a96e", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
          {links.map(({ label, href }) => (
            <button key={label} onClick={() => scrollTo(href)} style={{ background: "none", border: "none", color: "#f5ede0", fontSize: "1.5rem", fontFamily: "var(--font-playfair)", cursor: "pointer" }}>
              {label}
            </button>
          ))}
          <button onClick={() => scrollTo("#reserve")} style={{ background: "#c9a96e", color: "#0a0705", border: "none", padding: "0.8rem 2rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", marginTop: "1rem" }}>
            Book a Table
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-book { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}