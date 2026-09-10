import { useEffect, useState } from "react";
import "./Preloader.css";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("run"); // run -> exit -> gone

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("gone"); return; }
    document.documentElement.classList.add("loading");
    const dur = 1300, t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase("exit"), 1550);
    const t2 = setTimeout(() => { setPhase("gone"); document.documentElement.classList.remove("loading"); }, 2350);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); document.documentElement.classList.remove("loading"); };
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={`pre ${phase === "exit" ? "exit" : ""}`} aria-hidden="true">
      <div className="pre-grid">
        <span className="pre-kicker mono">Corporate &amp; Alumni Relations</span>
        <span className="pre-brand serif">R<em>V</em> University</span>
        <span className="pre-word serif">Placements</span>
      </div>
      <div className="pre-bottom">
        <span className="pre-count num">{String(count).padStart(3, "0")}</span>
        <div className="pre-bar"><span className="pre-bar-fill" style={{ transform: `scaleX(${count / 100})` }} /></div>
      </div>
      <span className="pre-curtain" aria-hidden="true" />
    </div>
  );
}
