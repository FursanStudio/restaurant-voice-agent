"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 3rem", height: "80px",
        background: scrolled ? "rgba(10,7,5,0.97)" : "linear-gradient(to bottom, rgba(10,7,5,0.8), transparent)",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.1)" : "none",
        transition: "all 0.4s ease",
      }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", color: "#e8c98a" }}>
          Ember &amp; Salt
        </span>

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}
          className="hidden-mobile">
          {links.map((l) => (
            <li key={l.href}>
              <button onClick={() => scrollTo(l.href)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#7a6e62", fontSize: "0.75rem", letterSpacing: "0.2em",
                textTransform: "uppercase", fontWeight: 500,
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7a6e62")}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={() => scrollTo("#reserve")} style={{
          border: "1px solid #7a6140", background: "transparent", color: "#c9a96e",
          fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase",
          padding: "0.6rem 1.5rem", cursor: "pointer", transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.color = "#0a0705"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9a96e"; }}>
          Book a Table
        </button>
      </nav>
      <style>{`.hidden-mobile { display: flex; } @media(max-width:768px){ .hidden-mobile { display: none; } }`}</style>
    </>
  );
}