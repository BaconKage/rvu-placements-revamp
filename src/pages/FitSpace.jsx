import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../components/ui/Eyebrow";
import Words from "../components/ui/Words";
import { YouCard, RoleCard } from "../components/fit/ProfileCards";
import FitField from "../components/fit/FitField";
import ReadinessCurve from "../components/fit/ReadinessCurve";
import RoleRanking from "../components/fit/RoleRanking";
import Range from "../components/fit/Range";
import { SKILLS, ROLES, DEFAULT_STUDENT, roleById } from "../data/fit";
import { d2, meetsFloors, medianMonths, rate, readiness, regionShare, rankRoles } from "../lib/fitModel";
import "./FitSpace.css";

function readStudentParam() {
  try {
    const q = new URLSearchParams(window.location.search).get("s");
    const v = q?.split(",").map(Number);
    if (v?.length === SKILLS.length && v.every((x) => x >= 0 && x <= 1)) return v;
  } catch {}
  return DEFAULT_STUDENT;
}

export default function FitSpace() {
  const [student, setStudent] = useState(readStudentParam);
  const [roleId, setRoleId] = useState("sde");
  const role = roleById(roleId);
  const [floors, setFloors] = useState(role.floors);
  const [k, setK] = useState(6);
  const [c0, setC0] = useState(0.6);
  const [asymmetric, setAsymmetric] = useState(true);
  const [axX, setAxX] = useState(0);
  const [axY, setAxY] = useState(3);
  const [r0, setR0] = useState(0.06);
  const [kappa, setKappa] = useState(2.4);
  const [t, setT] = useState(6);

  const selectRole = (id) => { setRoleId(id); setFloors(roleById(id).floors); };
  const opts = { k, asymmetric };
  const floored = { ...role, floors };

  const D = Math.sqrt(d2(student, role, opts));
  const C = Math.exp(-k * D * D);
  const floorsOk = meetsFloors(student, floors);
  const under = SKILLS.filter((_, i) => student[i] < floors[i]).map((s) => s.short);
  const share = useMemo(() => regionShare(role, floors, { c0, k, asymmetric }), [role, floors, c0, k, asymmetric]);
  const ranked = rankRoles(student, ROLES, opts);
  const clearing = ranked.filter((r) => r.C >= c0 && r.floorsOk).length;
  const curveOpts = { r0, kappa };

  return (
    <main className="fs">
      <header className="wrap fs-head">
        <Eyebrow>Fit Space · illustrative model</Eyebrow>
        <h1 className="serif fs-title"><Words text="Find where you fit." hi={new Set([3])} /></h1>
        <p className="lede fs-dek">
          Six skills, each scored from 0 to 1. Your profile becomes a spectrum, the spectrum becomes a colour,
          and the gap between you and a role becomes a fit score and a readiness curve. Move anything and the
          whole chain re-solves.
        </p>
        <div className="fs-meta">
          <span>dimensions <b>n = 6</b></span>
          <span>metric <b>role-weighted distance</b></span>
          <span>encoding <b>SPD → CIE 1931 → sRGB</b></span>
          <span>roles <b>{ROLES.length} archetypes from real offers</b></span>
        </div>
      </header>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">01 · Profiles</h2><span className="fs-note">s = (s₁ … s₆), 0 ≤ sᵢ ≤ 1</span></div>
        <div className="fs-people">
          <YouCard student={student} setStudent={setStudent} />
          <RoleCard role={floored} student={student} onRole={selectRole} />
        </div>
      </section>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">02 · Readout</h2><span className="fs-note">gap → fit → readiness</span></div>
        <div className="fs-readout">
          <div className="fs-stat"><span className="fs-lbl">Gap D</span><span className="fs-v">{D.toFixed(3)}</span><span className="fs-u">weighted by what {role.name} needs</span></div>
          <div className="fs-stat hi"><span className="fs-lbl">Fit C</span><span className="fs-v">{C.toFixed(3)}</span>
            <span className={`fs-u ${floorsOk ? "ok" : "bad"}`}>{floorsOk ? "all floors met" : `under floor: ${under.join(", ")}`}</span></div>
          <div className="fs-stat"><span className="fs-lbl">Median to offer-ready</span><span className="fs-v">{medianMonths(C, curveOpts).toFixed(1)}</span><span className="fs-u">months, ln2 / rate(C)</span></div>
          <div className="fs-stat"><span className="fs-lbl">Region share</span><span className="fs-v">{(share * 100).toFixed(1)}%</span><span className="fs-u">of profiles above the floors clearing C₀ = {c0.toFixed(2)}</span></div>
        </div>
        <div className="fs-eqs">
          <span>D = √Σ wᵢ·eᵢ² = <b>{D.toFixed(4)}</b></span>
          <span>C = e^(−kD²) = <b>{C.toFixed(4)}</b></span>
          <span>rate = r₀e^(κC) = <b>{rate(C, curveOpts).toFixed(3)}</b> /mo</span>
          <span>P(ready by 6 mo) = <b>{readiness(C, 6, curveOpts).toFixed(3)}</b></span>
          <span>roles clearing C₀ = <b>{clearing} of {ROLES.length}</b></span>
        </div>
      </section>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">03 · The field around you</h2><span className="fs-note">every "you" across two skills; the other four held where you are</span></div>
        <div className="fs-grid">
          <div className="fs-canvwrap">
            <FitField student={student} role={role} axX={axX} axY={axY} k={k} c0={c0} floors={floors} asymmetric={asymmetric} />
            <div className="fs-axl"><span>→ {SKILLS[axX].name}</span><span>↑ {SKILLS[axY].name}</span></div>
            <div className="fs-keys fs-field-keys">
              <span><i className="fs-k-dot" /> You</span>
              <span><i className="fs-k-sq" /> Role requirement</span>
              <span><i className="fs-k-dash" /> C = C₀ contour</span>
              <span>washed + hatched = under a floor</span>
            </div>
          </div>
          <div className="fs-panel">
            <label className="fs-ctl"><span className="fs-lbl">Horizontal skill</span>
              <select className="fs-select" value={axX} onChange={(e) => setAxX(+e.target.value)}>
                {SKILLS.map((s, i) => <option key={s.key} value={i} disabled={i === axY}>{s.name}</option>)}
              </select>
            </label>
            <label className="fs-ctl"><span className="fs-lbl">Vertical skill</span>
              <select className="fs-select" value={axY} onChange={(e) => setAxY(+e.target.value)}>
                {SKILLS.map((s, i) => <option key={s.key} value={i} disabled={i === axX}>{s.name}</option>)}
              </select>
            </label>
            <Range label="Falloff k" value={k} onChange={setK} min={0.5} max={20} step={0.1} format={(x) => x.toFixed(1)} hint="How fast fit decays with the gap." />
            <Range label="Threshold C₀" value={c0} onChange={setC0} min={0.05} max={0.95} hint="Bounds the region {s : C(s, role) ≥ C₀}." />
            <label className="fs-toggle">
              <input type="checkbox" checked={asymmetric} onChange={(e) => setAsymmetric(e.target.checked)} />
              Don't penalise exceeding a requirement
            </label>
            <div>
              <span className="fs-lbl">Floors Ω — the role's cut-off per skill</span>
              <div className="fs-floors">
                {SKILLS.map((s, i) => (
                  <Range key={s.key} compact label={s.short} value={floors[i]} min={0} max={0.9}
                    onChange={(x) => setFloors((f) => f.map((y, j) => (j === i ? x : y)))}
                    format={(x) => (x === 0 ? "free" : `≥${x.toFixed(2)}`)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">04 · Getting offer-ready</h2><span className="fs-note">P(ready by t) = 1 − exp(−r₀e^(κC) · t)</span></div>
        <div className="fs-grid">
          <div className="fs-canvwrap">
            <ReadinessCurve C={C} r0={r0} kappa={kappa} t={t} />
          </div>
          <div className="fs-panel">
            <Range label="Base rate r₀" value={r0} onChange={setR0} min={0.01} max={0.3} step={0.005} format={(x) => x.toFixed(3)} hint="Chance per month of becoming offer-ready at C = 0." />
            <Range label="Sensitivity κ" value={kappa} onChange={setKappa} min={0} max={5} step={0.1} format={(x) => x.toFixed(1)} hint="What fit buys you. At κ = 0 the curve stops caring about C." />
            <Range label="Horizon t" value={t} onChange={setT} min={0.5} max={12} step={0.5} format={(x) => `${x.toFixed(1)} mo`} />
            <div className="fs-keys">
              <span><i className="fs-k-line" /> you, for {role.name}</span>
              <span>dashed = C at 0.25 / 0.50 / 0.75</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">05 · Every role, ranked for you</h2><span className="fs-note">click a row to load it above</span></div>
        <RoleRanking ranked={ranked} selectedId={roleId} c0={c0} onSelect={selectRole} />
      </section>

      <section className="wrap fs-sec">
        <div className="fs-sechead"><h2 className="mono">06 · What this does and doesn't say</h2></div>
        <div className="fs-prose">
          <div className="fs-chain">you, role → <b>skills</b> → <b>D</b> → <b>C</b> → within <b>floors Ω</b> → <b>P(ready by t)</b> &nbsp;‖&nbsp; you → SPD(λ) → XYZ → <b>colour</b></div>
          <div>
            <h3 className="serif">Why a spectrum instead of a radar chart</h3>
            <p>Each skill gets a Gaussian lobe at its own wavelength between 420 and 660 nm, weighted by your score. Summing the lobes gives a spectrum; integrating it against the CIE 1931 colour-matching functions gives the chip. Two different profiles can land on the same colour — <em>metamerism</em> — which is an honest picture of what any one-line summary of a candidate does.</p>
          </div>
          <div>
            <h3 className="serif">The region, not the point</h3>
            <p>The best possible profile for a role is trivial: meet every requirement. The more useful number is the share of all profiles above the role's floors that clear C₀. A large share means the cut-offs are doing the selecting; near zero means the fit threshold is.</p>
          </div>
          <div className="fs-caveat">
            <span className="fs-lbl">Asymmetry, on by default</span>
            <p>In the original model any gap costs, in either direction. For hiring that is wrong: being a stronger coder than an SDE role asks for shouldn't lower your fit. With the toggle on, only shortfalls count, so the bright region in the field opens up and to the right of the role marker. Turn it off to see the symmetric model.</p>
          </div>
          <div className="fs-caveat muted">
            <span className="fs-lbl">Standing caveats</span>
            <p>The role vectors, weights, floors and rates are illustrative dials, not published by CAR or any recruiter — only the role names and the companies attached to them come from real RV offers. The readiness rate is constant in time, and nothing here is fitted to outcomes. Use it to see where to grow, not to predict an offer. <Link to="/#process" className="fs-link">See the real eligibility rules →</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
