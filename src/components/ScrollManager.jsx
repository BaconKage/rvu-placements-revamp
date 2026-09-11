import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll on route change, and honours /#section links arriving from
// another page (the in-page Lenis handler only covers bare "#id" hrefs).
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = window.__lenis;
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      return;
    }
    // wait a frame so the target page has mounted
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
      else el.scrollIntoView();
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
