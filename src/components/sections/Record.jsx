import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { useCountUp } from "../../hooks/useCountUp";
import { STATS, PACKAGES, PACKAGE_BANDS } from "../../data/placements";
import "./Record.css";

function StatTile({ s }) {
  // count up any plain number, keeping its decimals (43.5 stays 43.5)
  const isNum = /^[\d,]+(\.\d+)?$/.test(s.v);
  const decimals = isNum && s.v.includes(".") ? s.v.split(".")[1].length : 0;
  const target = isNum ? Number(s.v.replace(/,/g, "")) : 0;
  const [ref, count] = useCountUp(target, { decimals });
  return (
    <div className={`stat ${s.hero ? "stat-hero" : ""}`}>
      <div className="stat-v num" ref={isNum ? ref : null}>
        {s.pre && <span className="stat-pre">{s.pre}</span>}
        {isNum ? count : s.v}
        {/* symbols (+, %) sit at the number's size; word units (LPA) stay a small label */}
        {s.unit && <em className={/^[+%]$/.test(s.unit) ? "sym" : undefined}>{s.unit}</em>}
      </div>
      <span className="stat-k mono">{s.k}</span>
      <p className="stat-note">{s.note}</p>
    </div>
  );
}

// Offers by package band. CAR reports approximate ranges ("80–90"), so each bar
// is drawn to the low count with a lighter extension up to the high count.
function PackageBands() {
  const ref = useReveal({ threshold: 0.3 });
  const max = Math.max(...PACKAGE_BANDS.map((b) => b.hi));
  return (
    <div className="pk-bands reveal" ref={ref}>
      <div className="pk-bands-head">
        <h3 className="mono pk-sub">Offers by package band</h3>
        <span className="pk-caption">Approximate counts, as reported by Corporate &amp; Alumni Relations</span>
      </div>
      <ol className="pk-list">
        {PACKAGE_BANDS.map((b, i) => (
          <li className="pk-row" key={b.band} style={{ "--d": `${i * 90}ms` }}>
            <span className="pk-band">{b.band}</span>
            <span className="pk-track" aria-hidden="true">
              <span className="pk-range" style={{ width: `${(b.hi / max) * 100}%` }} />
              <span className="pk-fill" style={{ width: `${Math.max(b.lo / max, 0.012) * 100}%` }} />
            </span>
            <span className="pk-count num">
              {b.lo === b.hi ? (b.lo === 1 ? "1 offer" : `≈${b.lo}`) : `${b.lo}–${b.hi}`}
            </span>
            {b.note && <span className="pk-note mono">{b.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Record({ idx = "01" }) {
  const ref = useReveal();
  const pkRef = useReveal();
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

        <div className="pk-head">
          <h3 className="serif pk-h">What the offers were worth.</h3>
          <p className="pk-lede">
            The packages behind those offers, as published by the university’s Corporate &amp; Alumni Relations office.
          </p>
        </div>
        <div className="stat-grid pk-grid reveal" ref={pkRef}>
          {PACKAGES.map((s) => <StatTile key={s.k} s={s} />)}
        </div>
        <PackageBands />
      </div>
    </section>
  );
}
