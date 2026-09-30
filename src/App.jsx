import { useEffect, useState } from "react";
import { initSmoothScroll } from "./lib/smoothScroll";
import Preloader from "./components/Preloader/Preloader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Marquee from "./components/Marquee/Marquee";
import Intersection from "./components/Intersection/Intersection";
import SelectedWork from "./components/SelectedWork/SelectedWork";
import Tech from "./components/Tech/Tech";
import ScrollMarquee from "./components/ScrollMarquee/ScrollMarquee";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import StartProject from "./components/StartProject/StartProject";
import About from "./components/About/About";
import NotificationSetup from "./components/NotificationSetup/NotificationSetup";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import "./App.css";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  useEffect(() => {
    const lenis = window.__imanLenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", loading);
    const fallback = window.setTimeout(() => setLoading(false), 2200);
    return () => {
      window.clearTimeout(fallback);
      document.documentElement.classList.remove("is-loading");
    };
  }, [loading]);

  if (path === "/start-a-project")
    return (
      <div className="site-shell">
        <Navbar />
        <StartProject />
        <Footer />
      </div>
    );

  if (path === "/about")
    return (
      <div className="site-shell">
        <Navbar />
        <About />
        <Footer />
      </div>
    );

  if (path === "/iman-notifications/reset-password")
    return <ResetPassword />;

  if (path === "/iman-notifications")
    return (
      <div className="site-shell">
        <Navbar />
        <NotificationSetup />
        <Footer />
      </div>
    );

  return (
    <div className="site-shell">
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Intersection />
        <SelectedWork />
        <Tech />
        <ScrollMarquee />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
