import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import "./Nav.css";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const { toggle, resolved } = useTheme();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${stuck ? "stuck" : ""}`}>
      <a className="brandmark" href="#top">
        <span className="rv alt">R<em>V</em> University</span>
        <span className="divider" />
        <span className="dept mono">Corporate &amp; Alumni Relations</span>
      </a>
      <div className="nav-right">
        <a className="nav-link mono" href="#record">Record</a>
        <a className="nav-link mono" href="#why">Why RVU</a>
        <a className="nav-link mono" href="#cohort">Cohort</a>
        <a className="nav-link mono" href="#process">Process</a>
        <button className="theme-btn" onClick={toggle} aria-label="Toggle colour theme" title="Toggle theme">
          {resolved === "dark" ? "☾" : "☀"}
        </button>
        <a className="btn nav-cta" href="#recruit">Recruit now <span className="arrow">→</span></a>
      </div>
    </nav>
  );
}
