import { useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { SCHOOLS, COHORT_TOTAL } from "../../data/placements";
import "./Cohort.css";

// one hue, largest programme darkest
const SHADES = [1, 0.62, 0.42, 0.3, 0.22];

const byN = (a, b) => b.n - a.n;
const ROWS = SCHOOLS
  .map((s) => ({
    name: s.name.replace("School of ", ""),
    total: s.programmes.reduce((a, p) => a + p.n, 0),
    programmes: [...s.programmes].sort(byN),
  }))
  .sort((a, b) => b.total - a.total);
const MAX = ROWS[0].total;
const share = (n) => {
  const pct = (n / COHORT_TOTAL) * 100;
  return pct < 1 ? "<1%" : `${Math.round(pct)}%`;
};

export default function Cohort({ idx = "02" }) {
  const ref = useReveal({ threshold: 0.12 });
  const [active, setActive] = useState(null);

  return (
    <section className="cohort" id="cohort">
      <div className="band reveal" ref={ref}>
        <Eyebrow idx={idx}>Schools eligible for recruitment</Eyebrow>
        <h2 className="serif band-h"><Words text="The 2024 cohort." hi={new Set([1])} /></h2>
        <p className="lede band-lede">
          Students eligible for recruitment, by school and programme.
        </p>

        <ol className="rank">
          {ROWS.map((s) => (
            <li className="rank-row" key={s.name}>
              <div className="rank-label">
                <span className="rank-name">{s.name}</span>
                <span className="rank-v">
                  <span className="num">{s.total}</span>
                  <span className="rank-share">{share(s.total)} of cohort</span>
                </span>
              </div>

              <div className="rank-bar" style={{ width: `${(s.total / MAX) * 100}%` }} aria-hidden="true">
                {s.programmes.map((p, j) => {
                  const key = `${s.name}|${p.p}`;
                  return (
                    <span
                      key={p.p}
                      className={`rank-seg ${active === key ? "on" : ""} ${active && active !== key && active.startsWith(s.name) ? "dim" : ""}`}
                      style={{ flexGrow: p.n, "--o": SHADES[j] }}
                      title={`${p.p}: ${p.n}`}
                      onMouseEnter={() => setActive(key)}
                      onMouseLeave={() => setActive(null)}
                    />
                  );
                })}
              </div>

              <ul className="rank-progs">
                {s.programmes.map((p, j) => {
                  const key = `${s.name}|${p.p}`;
                  return (
                    <li
                      key={p.p}
                      className={active === key ? "on" : ""}
                      onMouseEnter={() => setActive(key)}
                      onMouseLeave={() => setActive(null)}
                    >
                      <i style={{ "--o": SHADES[j] }} aria-hidden="true" />
                      {p.p} <b className="num">{p.n}</b>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>

        <div className="band-legend">
          <span className="mono">{COHORT_TOTAL.toLocaleString("en-IN")} students eligible · 6 schools · 17 programmes</span>
        </div>
      </div>
    </section>
  );
}
