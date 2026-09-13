import { Link } from "react-router-dom";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { useMagnetic } from "../../hooks/useMagnetic";
import { INTERNSHIPS, CONTACT, COPY } from "../../data/placements";
import "./Recruit.css";

export default function Recruit() {
  const ref = useReveal();
  const mag = useMagnetic(0.1); // gentle enough that the wide email button stays inside its card
  return (
    <section className="recruit" id="recruit">
      <div className="wrap">
        <div className="recruit-cta reveal" ref={ref}>
          <div>
            <span className="mono" style={{ color: "var(--brass-2)" }}>Corporate &amp; Alumni Relations</span>
            <h2 className="serif recruit-h">
              <Words text="Recruit at RV University." hi={new Set([1, 2])} />
            </h2>
            <p className="recruit-sub">{COPY.carIntro}</p>
            <div className="chips">
              {INTERNSHIPS.map((i) => <span className="chip" key={i}>{i}</span>)}
            </div>
          </div>
          <div className="recruit-card">
            <span className="mono recruit-card-k">{CONTACT.office}</span>
            <address className="recruit-addr">
              {CONTACT.lines.map((l) => <span key={l}>{l}</span>)}
            </address>
            <a className="btn recruit-mail magnetic" ref={mag} href={`mailto:${CONTACT.email}`}>
              {CONTACT.email} <span className="arrow">→</span>
            </a>
            <Link className="btn ghost recruit-form" to="/forms">
              Register to recruit <span className="arrow">→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
