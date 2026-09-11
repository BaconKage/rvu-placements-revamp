import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { WallPeek } from "./Recruiters";
import "./Recruiters.css";
import "./Outcomes.css";

// a teaser only — the full list lives on the recruiter wall
const FEATURED = [
  "Dell Technologies", "Société Générale", "Commonwealth Bank", "EY",
  "Infosys", "Thomson Reuters", "State Street", "Acko",
];

export default function Outcomes({ idx = "03" }) {
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

  return (
    <section className="section outcomes" id="outcomes">
      <div className="wrap">
        <Eyebrow idx={idx}>Where they landed</Eyebrow>
        <h2 className="serif out-h">
          <Words text="A sample of the class of 2024." />
        </h2>
        <p className="lede out-lede">
          B.Tech CSE graduates went on to roles like cybersecurity analyst at Société Générale, software
          engineer at Dell Technologies and graduate engineer at Commonwealth Bank — across banking,
          consulting, analytics and product engineering. Names and packages withheld.
        </p>

        <WallPeek cos={FEATURED} onClick={toWall} />
      </div>
    </section>
  );
}
