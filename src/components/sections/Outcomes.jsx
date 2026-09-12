import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { WallPeek } from "./Recruiters";
import "./Recruiters.css";
import "./Outcomes.css";

// a teaser only — the full list lives on the recruiter wall
const FEATURED = [
  "Dell Technologies", "Société Générale", "Commonwealth Bank", "EY",
  "Infosys", "Thomson Reuters", "State Street", "Acko",
];

// The recruiter wall peek, used inside the Recruiters section of the student &
// parent page. Clicking it opens the full wall.
export function RecruiterPeek() {
  const navigate = useNavigate();

  // the wall grows out of the click point as a circle, where the browser supports it
  const toWall = (e) => {
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--vt-x", `${e.clientX || r.left + r.width / 2}px`);
    root.style.setProperty("--vt-y", `${e.clientY || r.top + r.height / 2}px`);
    root.classList.add("vt-wall");
    const t = document.startViewTransition(() => {
      flushSync(() => navigate("/recruiters"));
      window.scrollTo(0, 0);
    });
    t.finished.finally(() => root.classList.remove("vt-wall"));
  };

  return <WallPeek cos={FEATURED} onClick={toWall} />;
}
