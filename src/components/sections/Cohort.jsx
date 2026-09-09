import { useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import { useReveal } from "../../hooks/useReveal";
import { SCHOOLS, COHORT_TOTAL } from "../../data/placements";
import "./Cohort.css";

const total = (s) => s.programmes.reduce((a, p) => a + p.n, 0);

export default function Cohort() {
  const ref = useReveal({ threshold: 0.12 });
  const [active, setActive] = useState(null);
  const summed = SCHOOLS.reduce((a, s) => a + total(s), 0);

  return (
    <section className="cohort" id="cohort">
      <div className="band reveal" ref={ref}>
        <Eyebrow idx="02">Who is on the wall</Eyebrow>
        <h2 className="serif band-h">1,608 students.<br />Every block is a programme.</h2>
        <p className="lede band-lede">
          Width is a school, height is a programme, area is headcount. You can
          see B.Tech carry the year — no table needed.
        </p>

        <div className="mosaic" role="list">
          {SCHOOLS.map((s) => (
            <div className="col" key={s.name} style={{ flexGrow: total(s) }}>
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
          <span className="mono">{COHORT_TOTAL.toLocaleString("en-IN")} eligible · 6 schools · 17 programmes</span>
          <span className="mono foot-note">
            Rows sum to {summed.toLocaleString("en-IN")}; published total {COHORT_TOTAL.toLocaleString("en-IN")} — to reconcile with CAR.
          </span>
        </div>
      </div>
    </section>
  );
}
