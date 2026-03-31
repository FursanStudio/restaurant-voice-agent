"use client";
import { useEffect, useRef, Suspense, lazy } from "react";
const HeroRing3D = lazy(() => import("./HeroRing3D"));

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", overflow: "hidden" }}>

      {/* Parallax glow */}
      <Suspense fallback={null}>
  <HeroRing3D />
</Suspense>
      {/* Rings */}
      {[500, 700, 950].map((size, i) => (
        <div key={size} style={{
          position: "absolute", borderRadius: "50%",
          border: `1px ${i === 1 ? "dashed" : "solid"} rgba(201,169,110,0.08)`,
          width: size, height: size,
          top: "50%", left: "50%",
          animation: `spin ${[40, 65, 95][i]}s linear infinite ${i % 2 === 1 ? "reverse" : ""}`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ color: "#c9a96e", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1.5rem", animation: "fadeUp 1s ease both" }}>
          Est. 2019 · Fine Dining · New York
        </p>

        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(3.5rem,9vw,8rem)", lineHeight: 0.95, color: "#f5ede0", fontWeight: 400, animation: "fadeUp 1s ease 0.15s both" }}>
          Where Fire<br />Meets <em style={{ fontStyle: "italic", color: "#e8c98a" }}>Salt</em>
        </h1>

        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem,2vw,1.35rem)", color: "#7a6e62", fontWeight: 300, marginTop: "1.5rem", animation: "fadeUp 1s ease 0.3s both" }}>
          A journey through bold flavours, refined craft,<br />and the warmth of living fire.
        </p>

        <div style={{ width: 56, height: 1, background: "#7a6140", margin: "2rem auto", animation: "fadeUp 1s ease 0.4s both" }} />

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s ease 0.5s both" }}>
          <button onClick={() => scrollTo("#reserve")} style={{ background: "#c9a96e", color: "#0a0705", border: "none", padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}>
            Reserve a Table
          </button>
          <button onClick={() => scrollTo("#voice")} style={{ background: "transparent", color: "#c9a96e", border: "1px solid #7a6140", padding: "1rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🎤 Ask Our AI Host
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", animation: "fadeUp 1s ease 1s both" }}>
        <span style={{ color: "#7a6e62", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Discover</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #7a6140, transparent)" }} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}