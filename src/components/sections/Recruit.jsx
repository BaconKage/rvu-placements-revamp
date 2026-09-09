import { useReveal } from "../../hooks/useReveal";
import { INTERNSHIPS, CONTACT } from "../../data/placements";
import "./Recruit.css";

export default function Recruit() {
  const ref = useReveal();
  return (
    <footer className="recruit" id="recruit">
      <div className="wrap">
        <div className="recruit-cta reveal" ref={ref}>
          <div>
            <span className="mono" style={{ color: "var(--brass)" }}>Recruit at RVU</span>
            <h2 className="serif recruit-h">Take a slot on the wall.</h2>
            <p className="recruit-sub">
              Summer to international — the ways a student plugs into industry before they graduate.
            </p>
            <div className="chips">
              {INTERNSHIPS.map((i) => <span className="chip" key={i}>{i}</span>)}
            </div>
          </div>
          <div className="recruit-card">
            <span className="mono recruit-card-k">{CONTACT.office}</span>
            <address className="recruit-addr">
              {CONTACT.lines.map((l) => <span key={l}>{l}</span>)}
            </address>
            <a className="btn recruit-mail" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email} <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="foot-bar">
          <span className="brandmark-foot alt">R<em>V</em> University · Placements</span>
          <p className="disclaimer mono">
            Design concept for the RV University Placement Website Revamp Competition.
            All statistics, programme names, cohort figures and process rules are taken
            from the placements page published on rvu.edu.in. Recruiter names are left as
            empty slots the office fills — the wall is a template, not a claim about who
            recruits here. Aviatrix appears because RVU publishes it as the ₹43.5 LPA source.
          </p>
        </div>
      </div>
    </footer>
  );
}
