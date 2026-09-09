import { useEffect, useState } from "react";
import "./Preloader.css";

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); return; }
    const t1 = setTimeout(() => setExit(true), 1450);
    const t2 = setTimeout(() => setGone(true), 2150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;
  return (
    <div className={`preloader ${exit ? "exit" : ""}`} aria-hidden="true">
      <div className="pre-inner">
        <span className="pre-kicker mono">RV University</span>
        <span className="pre-title serif">Placements</span>
        <span className="pre-rule" />
        <span className="pre-count mono">2 0 2 5</span>
      </div>
    </div>
  );
}
