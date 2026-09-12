import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import logoBlue from "../assets/rvu-logo-blue-nav.webp";
import logoGold from "../assets/rvu-logo-gold.avif";
import "./Nav.css";

const PATHS = [
  ["/students", "Students & Parents"],
  ["/partners", "Recruiters"],
  ["/recruiters", "Who recruits"],
];

export default function Nav() {
  const { pathname } = useLocation();
  const onDark = pathname === "/recruiters";
  const onHero = pathname === "/";
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { toggle, resolved } = useTheme();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav className={`nav ${stuck ? "stuck" : ""} ${onDark ? "on-dark" : ""} ${onHero ? "on-hero" : ""} ${open ? "open" : ""}`}>
      <Link className="brandmark" to="/">
        {/* RVU logo, as in the rvu.edu.in header: blue on light, gold on dark */}
        <img className="brand-logo logo-light" src={logoBlue} alt="RV University" width="336" height="168" />
        <img className="brand-logo logo-dark" src={logoGold} alt="RV University" width="512" height="258" />
        <span className="divider" />
        <span className="dept mono">Placements</span>
      </Link>
      <div className="nav-right">
        {PATHS.map(([to, label]) => (
          <NavLink key={to} className="nav-link mono" to={to}>{label}</NavLink>
        ))}
        <button className="theme-btn" onClick={toggle} aria-label="Toggle colour theme" title="Toggle theme">
          {resolved === "dark" ? "☾" : "☀"}
        </button>
        <Link className="nav-cta mono" to="/forms">Recruit with us</Link>
        <button
          type="button"
          className="nav-menu mono"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div className="nav-sheet" id="nav-sheet" hidden={!open}>
        <Link to="/">Home</Link>
        <Link to="/students">For students &amp; parents</Link>
        <Link to="/partners">For recruiters</Link>
        <Link to="/recruiters">Who recruits</Link>
        <Link to="/forms">Register to recruit →</Link>
      </div>
    </nav>
  );
}
