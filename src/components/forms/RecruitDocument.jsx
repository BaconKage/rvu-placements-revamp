import { createContext, useContext } from "react";
import Stamp from "./Stamp";
import { CONTACT } from "../../data/placements";
import { programmeOf, eligibleCount, formatDate, roleKey } from "../../data/recruitForm";

const Ctx = createContext(null);

// An inline blank in the letter. Empty: an underlined placeholder. Filled: the
// value, re-inked (keyed remount restarts the flash) whenever it changes.
function Blank({ k, value, ph }) {
  const { errors, active, onPick, locked } = useContext(Ctx);
  const filled = value !== undefined && value !== null && String(value).trim() !== "";
  const cls = ["rd-blank", filled ? "filled" : "empty", errors[k] ? "err" : "", active === k ? "active" : ""].join(" ");
  if (locked) return <span className={cls}>{filled ? value : ph}</span>;
  // a span, not a <button>: inline boxes let long values wrap mid-sentence
  return (
    <span
      role="button"
      tabIndex={0}
      className={cls}
      onClick={() => onPick(k)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(k); } }}
      title={`Edit ${ph}`}
    >
      {filled ? <span key={String(value)} className="rd-ink">{value}</span> : ph}
    </span>
  );
}

const list = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const MODE_PHRASE = { "On campus": "on campus", Virtual: "virtually", Hybrid: "in hybrid mode" };

export default function RecruitDocument({ data: d, errors, active, onPick, refNo, submittedOn, demo }) {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const progs = d.programmes.map(programmeOf).filter(Boolean);
  const pool = eligibleCount(d.programmes);
  // Keep each role's position in d.roles: blanks link by it, so hiding an empty
  // role in the letter must not shift the ones after it. A role with an error
  // stays visible so its red blank can lead back to the field.
  const roles = d.roles
    .map((r, i) => ({ ...r, i }))
    .filter((r) => r.i === 0 || r.title || r.openings || errors[roleKey(r.i, "title")] || errors[roleKey(r.i, "openings")]);
  const locked = !!submittedOn;

  return (
    <Ctx.Provider value={{ errors, active, onPick, locked }}>
      <article className={`rd-paper ${locked ? "locked" : ""}`} aria-label="Letter of intent preview">
        <header className="rd-head">
          <div>
            <div className="rd-brand serif">R<em>V</em> University</div>
            <div className="rd-office mono">{CONTACT.office}</div>
          </div>
          <address className="rd-addr">
            {CONTACT.lines.map((l) => <span key={l}>{l}</span>)}
            <span>{CONTACT.email}</span>
          </address>
        </header>

        <div className="rd-metarow mono">
          <span>Ref. {refNo || "RVU-CAR-DRAFT"}</span>
          <span>{submittedOn || today}</span>
        </div>

        <p className="rd-to">
          To,<br />The Head, Corporate &amp; Alumni Relations<br />RV University, Bengaluru
        </p>

        <p className="rd-subject">
          <b>Subject:</b> Letter of intent to recruit — <Blank k="engagement" value={list(d.engagement)} ph="type of engagement" />
        </p>

        <p>
          <Blank k="org" value={d.org} ph="Organisation" />, a{" "}
          <Blank k="sector" value={d.sector} ph="sector" /> organisation based in{" "}
          <Blank k="location" value={d.location} ph="city" />
          {d.website && <> ({d.website})</>}, intends to engage students of RV University
          {d.engagement.length ? <> for {list(d.engagement.map((x) => x.toLowerCase()))}</> : null}.
        </p>

        <p>We propose to recruit for the following role{roles.length > 1 ? "s" : ""}:</p>
        <table className="rd-table">
          <thead><tr><th>Role</th><th>Openings</th><th>CTC / stipend</th><th>Location</th></tr></thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.i}>
                <td><Blank k={roleKey(r.i, "title")} value={r.title} ph="role title" /></td>
                <td><Blank k={roleKey(r.i, "openings")} value={r.openings} ph="—" /></td>
                <td>{r.ctc || <span className="rd-muted">not stated</span>}</td>
                <td>{r.place || <span className="rd-muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          We wish to recruit from{" "}
          <Blank k="programmes" value={list(progs.map((p) => `${p.p} (${p.abbr})`))} ph="programmes" />
          {progs.length > 0 && <>, a pool of <b className="rd-pool">{pool.toLocaleString("en-IN")}</b> eligible students</>}.
          {" "}Candidates should hold a minimum CGPA of{" "}
          <Blank k="cgpa" value={d.cgpa} ph="no stated minimum" />
          {d.backlogs ? ", with active backlogs permitted." : ", with no active backlogs."}
        </p>

        <p>Our selection process will run in {d.stages.length ? d.stages.length : "the following"} stage{d.stages.length === 1 ? "" : "s"}:</p>
        {d.stages.length ? (
          <ol className="rd-stages">{d.stages.map((s) => <li key={s}><span key={s} className="rd-ink">{s}</span></li>)}</ol>
        ) : (
          <p className="rd-stages-empty"><Blank k="stages" value="" ph="selection stages" /></p>
        )}

        <p>
          We would like to conduct the drive{" "}
          <Blank k="mode" value={MODE_PHRASE[d.mode]} ph="on campus / virtually" /> on or around{" "}
          <Blank k="driveDate" value={formatDate(d.driveDate)} ph="date" />.
          {d.jd && <> The job description is available at <span className="rd-link">{d.jd}</span>.</>}
        </p>
        {d.notes && <p className="rd-notes">{d.notes}</p>}

        <div className="rd-sign">
          <span>Yours sincerely,</span>
          <span className="rd-signature"><Blank k="contact" value={d.contact} ph="Your name" /></span>
          <span><Blank k="designation" value={d.designation} ph="designation" />, {d.org || "organisation"}</span>
          <span className="mono rd-sign-contact">
            <Blank k="email" value={d.email} ph="work email" />{d.phone && <> · {d.phone}</>}
          </span>
        </div>

        {locked && <Stamp refNo={refNo} date={submittedOn} demo={demo} />}
      </article>
    </Ctx.Provider>
  );
}
