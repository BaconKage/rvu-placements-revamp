import { useState } from "react";
import SpectrumCanvas from "./SpectrumCanvas";
import Range from "./Range";
import { SKILLS, ROLES, DEFAULT_STUDENT } from "../../data/fit";
import { DOMAINS } from "../../data/placements";
import { profileColour } from "../../lib/fitModel";

const PRESETS = [
  { label: "Builder", v: [0.86, 0.5, 0.32, 0.45, 0.3, 0.42] },
  { label: "Analyst", v: [0.52, 0.84, 0.35, 0.6, 0.62, 0.45] },
  { label: "Communicator", v: [0.4, 0.5, 0.56, 0.86, 0.72, 0.76] },
  { label: "Reset", v: DEFAULT_STUDENT },
];

const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;

function Swatch({ v, title, sub }) {
  const colour = profileColour(v);
  return (
    <div className="fs-ptop">
      <span className="fs-chip" style={{ background: colour }} aria-hidden="true" />
      <div className="fs-pid">
        <h3 className="serif">{title}</h3>
        <div className="fs-hex">{colour.toUpperCase()} · mean {mean(v).toFixed(2)}</div>
        {sub && <div className="fs-lbl fs-pid-sub">{sub}</div>}
      </div>
    </div>
  );
}

export function YouCard({ student, setStudent }) {
  const set = (i, x) => setStudent((s) => s.map((y, j) => (j === i ? x : y)));
  return (
    <article className="fs-card">
      <Swatch v={student} title="You" sub="your skill spectrum" />
      <SpectrumCanvas v={student} label="Your skill spectrum" />
      <div className="fs-presets">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="fs-preset" onClick={() => setStudent(p.v)}>{p.label}</button>
        ))}
      </div>
      <div className="fs-traits">
        {SKILLS.map((sk, i) => (
          <Range key={sk.key} compact label={sk.name} value={student[i]} onChange={(x) => set(i, x)} />
        ))}
      </div>
    </article>
  );
}

function CompanyChip({ co }) {
  const domain = DOMAINS[co];
  const [failed, setFailed] = useState(!domain);
  const mono = co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  return (
    <span className="fs-co">
      {failed ? (
        <span className="fs-co-mono" aria-hidden="true">{mono}</span>
      ) : (
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" loading="lazy"
          onError={() => setFailed(true)} />
      )}
      {co}
    </span>
  );
}

export function RoleCard({ role, student, onRole }) {
  return (
    <article className="fs-card">
      <Swatch v={role.need} title={role.name} sub="what the role asks for" />
      <SpectrumCanvas v={role.need} label={`${role.name} requirement spectrum`} />
      <label className="fs-ctl">
        <span className="fs-lbl">Role archetype</span>
        <select className="fs-select" value={role.id} onChange={(e) => onRole(e.target.value)}>
          {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
      <div className="fs-needs" role="list">
        {SKILLS.map((sk, i) => {
          const short = student[i] < role.need[i];
          return (
            <div className="fs-need" role="listitem" key={sk.key}>
              <span className="fs-tn">{sk.name}</span>
              <span className="fs-bar" aria-hidden="true">
                <span className="fs-bar-need" style={{ width: `${role.need[i] * 100}%` }} />
                {role.floors[i] > 0 && <span className="fs-bar-floor" style={{ left: `${role.floors[i] * 100}%` }} />}
                <span className={`fs-bar-you ${short ? "short" : ""}`} style={{ left: `${student[i] * 100}%` }} />
              </span>
              <span className="fs-tv">{role.need[i].toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="fs-keys">
        <span><i className="fs-k-need" /> requirement</span>
        <span><i className="fs-k-you" /> you</span>
        <span><i className="fs-k-floor" /> floor (cut-off)</span>
      </div>
      <div>
        <span className="fs-lbl">Hired for this role through RV · 2023 sheets</span>
        <div className="fs-cos">
          {role.recruiters.length
            ? role.recruiters.map((co) => <CompanyChip key={co} co={co} />)
            : <span className="fs-hint">No matching offers in the published sheets.</span>}
        </div>
      </div>
    </article>
  );
}
