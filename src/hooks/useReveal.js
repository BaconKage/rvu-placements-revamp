import { useEffect, useRef } from "react";

// Adds `.in` when the element scrolls into view. Reveals immediately if it is
// already within (or near) the viewport at mount, so anchor jumps and fast
// loads never land on an invisible section. Visible at rest for reduced motion.
export function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const near = () => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight * 1.1 && r.bottom > -innerHeight * 0.1;
    };
    if (near()) { el.classList.add("in"); return; }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options.threshold, options.rootMargin]);
  return ref;
}
