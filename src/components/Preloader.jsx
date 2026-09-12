import { useEffect, useState } from "react";
import "./Preloader.css";

// Lets the home wall start its fly-in exactly as the loader dissolves.
function markPreloaded() {
  window.__rvuPreloaded = true;
  window.dispatchEvent(new Event("rvu:preloaded"));
}

// The loader plays on a first visit only. Any page opened within the next hour
// (in any tab) skips it; each visit pushes the hour forward.
const SEEN_KEY = "rvu-preloader-seen";
const SKIP_MS = 60 * 60 * 1000;
function seenRecently() {
  try { return Date.now() - Number(localStorage.getItem(SEEN_KEY) || 0) < SKIP_MS; }
  catch { return false; }
}

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [skip] = useState(seenRecently);
  const [phase, setPhase] = useState(skip ? "gone" : "run"); // run -> exit -> gone

  useEffect(() => {
    try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch { /* storage blocked: loader just plays */ }
    if (skip) {
      // after this commit's effects, so the home entrance and wall fly-in are listening
      const t = setTimeout(markPreloaded, 0);
      return () => clearTimeout(t);
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("gone"); markPreloaded(); return; }
    document.documentElement.classList.add("loading");
    const dur = 1300, t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => { setPhase("exit"); markPreloaded(); }, 1550);
    const t2 = setTimeout(() => { setPhase("gone"); document.documentElement.classList.remove("loading"); }, 2350);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); document.documentElement.classList.remove("loading"); };
  }, [skip]);

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
