import { useEffect, useRef } from "react";
import "./Atmosphere.css";

// A soft trailing cursor orb + a fixed film-grain veil. Both are pure decoration
// and disabled for touch / reduced-motion. This is the "expensive" layer.
export default function Atmosphere() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target;
      const hot = t.closest("a, button, .wall, [data-hot]");
      ring.current?.classList.toggle("hot", !!hot);
      dot.current?.classList.toggle("hot", !!hot);
    };
    addEventListener("pointermove", onMove, { passive: true });

    let raf;
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    if (!reduced) raf = requestAnimationFrame(loop);
    else if (ring.current) ring.current.style.transform = `translate(${mx}px,${my}px)`;

    return () => {
      removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cur-ring" ref={ring} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
