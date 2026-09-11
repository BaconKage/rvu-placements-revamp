import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./Nav.css";

const PATHS = [
  ["/students", "Students"],
  ["/partners", "Corporate partners"],
  ["/parents", "Parents"],
];

export default function Nav() {
  const { pathname } = useLocation();
  const onDark = pathname === "/";
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
    <nav className={`nav ${stuck ? "stuck" : ""} ${onDark ? "on-dark" : ""} ${open ? "open" : ""}`}>
      <Link className="brandmark" to="/">
        <span className="rv serif glow-cycle">R<em>V</em> University</span>
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
        <Link to="/">Recruiter wall</Link>
        {PATHS.map(([to, label]) => <Link key={to} to={to}>For {label.toLowerCase()}</Link>)}
        <Link to="/forms">Register to recruit →</Link>
      </div>
    </nav>
  );
}
