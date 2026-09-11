import { useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { useMagnetic } from "../../hooks/useMagnetic";
import { SKILLS, ROLES, DEFAULT_STUDENT } from "../../data/fit";
import { profileColour, rankRoles } from "../../lib/fitModel";
import "./FitTeaser.css";

const TEASER_AXES = [0, 1, 3]; // Programming, Data, Communication

export default function FitTeaser() {
  const ref = useReveal({ threshold: 0.15 });
  const mag = useMagnetic(0.3);
  const [student, setStudent] = useState(DEFAULT_STUDENT);
  const top = rankRoles(student, ROLES).slice(0, 3);
  const colour = profileColour(student);
  const set = (i, x) => setStudent((s) => s.map((y, j) => (j === i ? x : y)));

  return (
    <section className="section fit-teaser" id="fit">
      <div className="wrap">
        <Eyebrow idx="For students">Fit Space</Eyebrow>
        <div className="ft-grid reveal" ref={ref}>
          <div>
            <h2 className="serif ft-h"><Words text="Which roles fit you today?" hi={new Set([2])} /></h2>
            <p className="lede ft-lede">
              Slide three of your six skills and watch the roles RV students were actually hired into re-rank.
              The full model turns your profile into a colour, a fit field and a readiness curve.
            </p>
            <div className="ft-sliders">
              {TEASER_AXES.map((i) => (
                <label className="ft-row" key={SKILLS[i].key}>
                  <span className="ft-name">{SKILLS[i].name}</span>
                  <input className="fs-range" type="range" min="0" max="1" step="0.01" value={student[i]}
                    onChange={(e) => set(i, +e.target.value)} />
                  <span className="ft-val">{student[i].toFixed(2)}</span>
                </label>
              ))}
            </div>
            <Link className="btn magnetic ft-cta" ref={mag} to={`/fit?s=${student.map((x) => x.toFixed(2)).join(",")}`}>
              Open Fit Space <span className="arrow">→</span>
            </Link>
          </div>

          <div className="ft-card">
            <div className="ft-card-top">
              <span className="ft-chip" style={{ background: colour }} aria-hidden="true" />
              <div>
                <span className="mono ft-k">Your spectrum</span>
                <div className="ft-hex">{colour.toUpperCase()}</div>
              </div>
            </div>
            <ol className="ft-top">
              {top.map(({ role, C }, i) => (
                <li key={role.id} className="ft-role">
                  <span className="num ft-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ft-role-body">
                    <span className="serif ft-role-name">{role.name}</span>
                    <span className="ft-bar"><span style={{ width: `${C * 100}%` }} /></span>
                  </span>
                  <span className="ft-c">{C.toFixed(2)}</span>
                </li>
              ))}
            </ol>
            <p className="ft-note mono">Illustrative model · role names from real RV offers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
