import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import Thanks from "./components/Thanks";
import NotFound from "./components/NotFound";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

// Nom du site utilisé dans les titres et les données structurées.
// Change-le ici pour l'harmoniser partout (ex. "LocsLightman").
const SITE_NAME = "Locs Lightman";

const musicGroupSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: SITE_NAME,
  url: "https://locslightman.com/",
  image: "https://locslightman.com/og-cover.jpg",
  genre: "Rap",
  // Profils officiels : permettent à Google de relier ces comptes à ce site.
  sameAs: [
    "https://open.spotify.com/artist/5swMP0C4FElOE8szcRRVos",
    "https://www.youtube.com/@locslightman",
    "https://www.instagram.com/locs.lightman/",
  ],
};

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
      <Helmet>
        <title>{`${SITE_NAME} — Artiste rap indépendant à Strasbourg`}</title>
        <meta
          name="description"
          content="Site officiel de LocsLightman. Découvre l'EP L'Iceberg de Magma, les derniers clips, le merch et les dates à venir."
        />
        <link rel="canonical" href="https://locslightman.com/" />
        <script type="application/ld+json">{JSON.stringify(musicGroupSchema)}</script>
      </Helmet>
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
          <Route path="/merci" element={<Thanks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Cart />
      </BrowserRouter>
    </CartProvider>
  );
}
