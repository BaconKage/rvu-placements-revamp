import { useEffect } from "react";
import Lenis from "lenis";

// nk.studio's smooth-scroll layer. Publishes normalised scroll velocity to a
// CSS var (--vel) for velocity-reactive marquees, and routes in-page anchor
// clicks through Lenis. Disabled entirely for reduced-motion.
export function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo-out
    });
    window.__lenis = lenis;

    const root = document.documentElement;
    lenis.on("scroll", ({ velocity }) => {
      const v = Math.min(3, Math.abs(velocity) / 14);
      root.style.setProperty("--vel", v.toFixed(3));
    });

    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -70, duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
