import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { RECRUITER_SECTORS, UPCOMING } from "../../data/placements";
import "./Recruiters.css";

export default function Recruiters() {
  const total = RECRUITER_SECTORS.reduce((a, g) => a + g.cos.length, 0);
  return (
    <section className="section recruiters" id="recruiters">
      <div className="wrap">
        <Eyebrow idx="02">Recruiters</Eyebrow>
        <h2 className="serif rec-h">
          <Words text="Who recruits from RV University." />
        </h2>
        <p className="lede rec-lede">
          {total} organisations across six sectors engaged with our students this cycle —
          from global banks and consulting firms to deep-tech startups.
        </p>

        <div className="rec-dir">
          {RECRUITER_SECTORS.map((g, i) => <SectorRow key={g.sector} g={g} i={i} />)}
        </div>

        <div className="rec-upcoming">
          <span className="mono rec-up-label"><span className="rec-up-dot" /> In the pipeline</span>
          <p className="rec-up-list">
            {UPCOMING.map((c, i) => (
              <span className="rec-up-co" key={c}>{c}{i < UPCOMING.length - 1 ? <span className="sep">·</span> : null}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function SectorRow({ g, i }) {
  const ref = useReveal({ threshold: 0.15 });
  return (
    <div className="sector reveal" ref={ref} style={{ "--d": `${i * 60}ms` }}>
      <div className="sector-head">
        <h3 className="sector-name">{g.sector}</h3>
        <span className="sector-count mono">{String(g.cos.length).padStart(2, "0")}</span>
      </div>
      <ul className="sector-cos">
        {g.cos.map((c) => <li className="co-cell" key={c} data-hot>{c}</li>)}
      </ul>
    </div>
  );
}
