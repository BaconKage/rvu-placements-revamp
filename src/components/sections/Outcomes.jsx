import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { OUTCOMES } from "../../data/placements";
import "./Outcomes.css";

export default function Outcomes({ idx = "03" }) {
  return (
    <section className="section outcomes" id="outcomes">
      <div className="wrap">
        <Eyebrow idx={idx}>Where they landed</Eyebrow>
        <h2 className="serif out-h">
          <Words text="A sample of the class of 2024." />
        </h2>
        <p className="lede out-lede">
          Real placements from the graduating cohort — programme, employer and role.
          Names and packages withheld.
        </p>

        <ol className="out-list">
          {OUTCOMES.map((o, i) => <Row key={i} o={o} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

function Row({ o, i }) {
  const ref = useReveal({ threshold: 0.6 });
  return (
    <li className="out-row reveal" ref={ref} style={{ "--d": `${(i % 8) * 40}ms` }} data-hot>
      <span className="out-prog mono">{o.prog}</span>
      <span className="out-arrow" aria-hidden="true">→</span>
      <span className="out-co serif">{o.co}</span>
      <span className="out-role">{o.role}</span>
    </li>
  );
}
