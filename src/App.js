import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initCookieConsent } from "./cookieConsent";
import { trackPageView } from "./analytics";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Merch from "./components/Merch";
import Albums from "./components/Albums";
import Tracks from "./components/Tracks";
import Videos from "./components/Videos";
import News from "./components/News";
import Footer from "./components/Footer";
import MerchItem from "./components/MerchItem";
import Cart from "./components/Cart";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Home() {
  return (
    <main>
      <Hero />
      <Merch />
      <Albums />
      <Tracks />
      <Videos />
      <News />
    </main>
  );
}

export default function App() {
  useEffect(() => {
    initCookieConsent();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageTracker />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merch/:slug" element={<MerchItem />} />
        </Routes>
        <Footer />
        <Cart />
      </BrowserRouter>
    </CartProvider>
  );
}
