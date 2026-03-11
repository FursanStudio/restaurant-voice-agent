import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MenuSection from "@/components/MenuSection";
import VoiceTeaser from "@/components/VoiceTeaser";
import Reservation from "@/components/Reservation";
import Footer from "@/components/Footer";
import VoiceWidget from "@/components/VoiceWidget";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <VoiceTeaser />
      <Reservation />
      <Footer />
      <VoiceWidget />
    </main>
  );
}