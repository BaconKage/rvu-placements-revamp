import { useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { SCHOOLS, COHORT_TOTAL } from "../../data/placements";
import "./Cohort.css";

const total = (s) => s.programmes.reduce((a, p) => a + p.n, 0);

export default function Cohort() {
  const ref = useReveal({ threshold: 0.12 });
  const [active, setActive] = useState(null);

  return (
    <section className="cohort" id="cohort">
      <div className="band reveal" ref={ref}>
        <Eyebrow idx="03">Schools eligible for recruitment</Eyebrow>
        <h2 className="serif band-h"><Words text="Every block is a programme." hi={new Set([1])} /></h2>
        <p className="lede band-lede">
          Width is a school, height a programme, area the headcount eligible for
          recruitment. B.Tech carries the year.
        </p>

        <div className="mosaic" role="list">
          {SCHOOLS.map((s) => (
            <div className="col" key={s.name}>
              <span className="col-name">{s.name.replace("School of ", "")}</span>
              <div className="col-cells">
                {s.programmes.map((p) => (
                  <div
                    role="listitem"
                    key={p.p}
                    className={`cell ${p.n >= 500 ? "giant" : ""} ${active === p.p ? "active" : ""}`}
                    style={{ flexGrow: p.n }}
                    onMouseEnter={() => setActive(p.p)}
                    onMouseLeave={() => setActive(null)}
                    data-hot
                  >
                    <span className="cell-n num">{p.n}</span>
                    <span className="cell-p">{p.p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="band-legend">
          <span className="mono">{COHORT_TOTAL.toLocaleString("en-IN")} students eligible · 6 schools · 17 programmes</span>
        </div>
      </div>
    </section>
  );
}
