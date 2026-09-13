import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { useCountUp } from "../../hooks/useCountUp";
import { STATS } from "../../data/placements";
import "./Record.css";

function StatTile({ s }) {
  // count-up only for the plain integer tiles
  const isInt = /^[\d,]+$/.test(s.v);
  const target = isInt ? Number(s.v.replace(/,/g, "")) : 0;
  const [ref, count] = useCountUp(target);
  return (
    <div className={`stat ${s.hero ? "stat-hero" : ""}`}>
      <div className="stat-v num" ref={isInt ? ref : null}>
        {isInt ? count : s.v}
        {s.unit && <em>{s.unit}</em>}
      </div>
      <span className="stat-k mono">{s.k}</span>
      <p className="stat-note">{s.note}</p>
    </div>
  );
}

export default function Record({ idx = "01" }) {
  const ref = useReveal();
  return (
    <section className="section record" id="record">
      <div className="wrap">
        <Eyebrow idx={idx}>The record</Eyebrow>
        <h2 className="serif record-h"><Words text="Placements, by the numbers." hi={new Set([3])} /></h2>
      </div>
      <div className="wrap record-grid-wrap">
        <div className="stat-grid reveal" ref={ref}>
          {STATS.map((s) => <StatTile key={s.k} s={s} />)}
        </div>
      </div>
    </section>
  );
}
