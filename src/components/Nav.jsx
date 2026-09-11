import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./Nav.css";

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const { toggle, resolved } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 20);
      // go dark while the pinned recruiter wall sits under the bar
      const wall = document.querySelector(".rw-stage");
      const r = wall?.getBoundingClientRect();
      setOnDark(!!r && r.top <= 1 && r.bottom > 60);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${stuck ? "stuck" : ""} ${onDark ? "on-dark" : ""}`}>
      <Link className="brandmark" to="/">
        <span className="rv serif glow-cycle">R<em>V</em> University</span>
        <span className="divider" />
        <span className="dept mono">Placements</span>
      </Link>
      <div className="nav-right">
        <Link className="nav-link mono" to="/#recruiters">Recruiters</Link>
        <Link className="nav-link mono" to="/#cohort">Cohort</Link>
        <Link className="nav-link mono" to="/#process">Process</Link>
        <span className="nav-sep" aria-hidden="true" />
        <NavLink className="nav-link nav-page mono" to="/fit">Fit Space</NavLink>
        <NavLink className="nav-link nav-page mono" to="/forms">Forms</NavLink>
        <button className="theme-btn" onClick={toggle} aria-label="Toggle colour theme" title="Toggle theme">
          {resolved === "dark" ? "☾" : "☀"}
        </button>
        <Link className="nav-cta mono" to="/forms">Recruit with us</Link>
      </div>
    </nav>
  );
}
