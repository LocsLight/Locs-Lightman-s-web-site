import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Albums from "./components/Albums";
import Tracks from "./components/Tracks";
import Videos from "./components/Videos";
import News from "./components/News";
import Footer from "./components/Footer";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis pilote le défilement, GSAP/ScrollTrigger le suivent.
    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Albums />
        <Tracks />
        <Videos />
        <News />
      </main>
      <Footer />
    </>
  );
}
