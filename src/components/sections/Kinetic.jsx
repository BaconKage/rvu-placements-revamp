import { useEffect, useRef } from "react";
import "./Kinetic.css";

const WORDS = ["This", "is", "where", "four", "years", "becomes", "one", "morning", "in", "a", "room", "with", "a", "stranger."];
const HI = new Set([5, 6, 7]); // "becomes one morning"

export default function Kinetic() {
  const secRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current, line = lineRef.current;
    if (!sec || !line) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = sec.getBoundingClientRect();
        const vh = innerHeight;
        const p = 1 - (r.top - vh * 0.16) / (vh * 0.66);
        line.style.setProperty("--k", Math.max(0, Math.min(1, p)).toFixed(3));
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="kinetic" ref={secRef}>
      <p className="kin serif" ref={lineRef}>
        {WORDS.map((w, i) => (
          <span className={`kw ${HI.has(i) ? "hi" : ""}`} key={i}>{w}</span>
        ))}
      </p>
    </section>
  );
}
