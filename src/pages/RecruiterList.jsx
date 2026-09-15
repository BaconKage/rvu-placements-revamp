import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../components/ui/Eyebrow";
import Words from "../components/ui/Words";
import Logo from "../components/ui/Logo";
import { SiteFooter } from "../components/sections/Audience";
import { OFFERS, UPCOMING } from "../data/placements";
import "./RecruiterList.css";

// The recruiter wall's organisations as a plain, searchable list (reached only from the wall).
const CHANNEL = { RVU: "RV University campus drive", RVCE: "RV group drive (RVCE)" };

// one row per organisation, with every role, sector, offer type and channel it appears with
const HIRED = Object.values(
  OFFERS.reduce((acc, o) => {
    const r = (acc[o.co] ||= { co: o.co, roles: [], sectors: new Set(), types: new Set(), via: new Set() });
    r.roles.push(o.role);
    r.sectors.add(o.sector);
    r.types.add(o.type);
    r.via.add(o.via);
    return acc;
  }, {})
)
  .map((r) => ({ ...r, sectors: [...r.sectors], types: [...r.types], via: [...r.via] }))
  .sort((a, b) => a.co.localeCompare(b.co));
const SECTORS = [...new Set(HIRED.flatMap((r) => r.sectors))].sort((a, b) => a.localeCompare(b));
const PIPELINE = [...UPCOMING].sort((a, b) => a.localeCompare(b));

export default function RecruiterList() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const needle = q.trim().toLowerCase();

  const rows = useMemo(
    () => HIRED.filter((r) =>
      (sector === "All" || r.sectors.includes(sector)) &&
      (!needle || r.co.toLowerCase().includes(needle) || r.roles.some((x) => x.toLowerCase().includes(needle)))),
    [needle, sector]
  );
  const pipe = useMemo(() => PIPELINE.filter((co) => !needle || co.toLowerCase().includes(needle)), [needle]);

  return (
    <main className="aud rl">
      <header className="wrap rl-head">
        <Eyebrow>Who recruits · 2025–26</Eyebrow>
        <h1 className="serif rl-title"><Words text="Every organisation, in one list." hi={new Set([1])} /></h1>
        <p className="lede rl-lede">
          The same {HIRED.length + PIPELINE.length} organisations as the recruiter wall: {HIRED.length} that hired
          through RV drives, with the roles they hired for, and {PIPELINE.length} lined up for upcoming campus drives.
        </p>
        <div className="rl-tools">
          <label className="rl-search">
            <span className="mono">Search</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Company or role" />
          </label>
          <Link className="btn ghost rl-back" to="/recruiters">Back to the wall <span className="arrow">→</span></Link>
        </div>
        <div className="rl-chips" role="group" aria-label="Filter by sector">
          {["All", ...SECTORS].map((s) => (
            <button key={s} type="button" className={`rl-chip${sector === s ? " on" : ""}`} aria-pressed={sector === s} onClick={() => setSector(s)}>
              {s}
            </button>
          ))}
        </div>
      </header>

      <section className="wrap rl-sec" aria-labelledby="rl-hired">
        <h2 id="rl-hired" className="mono rl-sub">Hired through RV <b>{rows.length}</b></h2>
        {rows.length ? (
          <div className="rl-table" role="table" aria-label="Organisations that hired through RV drives">
            <div className="rl-row rl-row-head" role="row">
              <span role="columnheader">Organisation</span>
              <span role="columnheader">Roles</span>
              <span role="columnheader">Sector</span>
              <span role="columnheader">Offer</span>
              <span role="columnheader">Channel</span>
            </div>
            {rows.map((r) => (
              <div className="rl-row" role="row" key={r.co}>
                <span role="cell" className="rl-co"><span className="rl-logo" aria-hidden="true"><Logo co={r.co} /></span>{r.co}</span>
                <span role="cell" className="rl-roles">{r.roles.join(", ")}</span>
                <span role="cell" data-k="Sector">{r.sectors.join(", ")}</span>
                <span role="cell" data-k="Offer">{r.types.join(", ")}</span>
                <span role="cell" data-k="Channel">{r.via.map((v) => CHANNEL[v]).join(", ")}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rl-empty">No organisations match that search.</p>
        )}
      </section>

      <section className="wrap rl-sec" aria-labelledby="rl-pipe">
        <div className="rl-sec-head">
          <h2 id="rl-pipe" className="mono rl-sub">In the pipeline <b>{pipe.length}</b></h2>
          <p className="rl-note">Lined up with Corporate &amp; Alumni Relations for upcoming campus drives this cycle.</p>
        </div>
        {pipe.length ? (
          <ul className="rl-pipe">
            {pipe.map((co) => (
              <li key={co}><span className="rl-logo" aria-hidden="true"><Logo co={co} /></span>{co}</li>
            ))}
          </ul>
        ) : (
          <p className="rl-empty">No upcoming drives match that search.</p>
        )}
      </section>

      <SiteFooter contact={false} />
    </main>
  );
}
