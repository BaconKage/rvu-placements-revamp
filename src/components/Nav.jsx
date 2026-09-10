import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import "./Nav.css";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const { toggle, resolved } = useTheme();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${stuck ? "stuck" : ""}`}>
      <a className="brandmark" href="#top">
        <span className="rv serif">R<em>V</em> University</span>
        <span className="divider" />
        <span className="dept mono">Placements</span>
      </a>
      <div className="nav-right">
        <a className="nav-link mono" href="#recruiters">Recruiters</a>
        <a className="nav-link mono" href="#outcomes">Outcomes</a>
        <a className="nav-link mono" href="#cohort">Cohort</a>
        <a className="nav-link mono" href="#process">Process</a>
        <button className="theme-btn" onClick={toggle} aria-label="Toggle colour theme" title="Toggle theme">
          {resolved === "dark" ? "☾" : "☀"}
        </button>
        <a className="nav-cta mono" href="#recruit">Recruit with us</a>
      </div>
    </nav>
  );
}
