import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll on route change, and honours /#section links arriving from
// another page (the in-page Lenis handler only covers bare "#id" hrefs).
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      const lenis = window.__lenis;
      lenis?.resize();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      return;
    }

    let raf = 0;
    let observer;
    const scroll = () => {
      const el = document.querySelector(hash);
      if (!el) return;
      const lenis = window.__lenis;
      // Lazy routes and the loader's scroll lock change the document height.
      // Measure the mounted, unlocked page before resolving the destination.
      lenis?.resize();
      if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
      else el.scrollIntoView();
    };
    const whenUnlocked = () => {
      if (document.documentElement.classList.contains("loading")) return;
      observer?.disconnect();
      if (!raf) raf = requestAnimationFrame(scroll);
    };
    observer = new MutationObserver(whenUnlocked);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    whenUnlocked();
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [pathname, hash]);

  return null;
}
