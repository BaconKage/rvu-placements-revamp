import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { ELIGIBILITY } from "../../data/placements";
import "./Process.css";

export default function Process() {
  return (
    <section className="section process" id="process">
      <div className="wrap">
        <Eyebrow idx="06">Student eligibility</Eyebrow>
        <h2 className="serif process-h">
          <Words text="What it takes to sit a drive." hi={new Set([4])} />
        </h2>
        <ol className="gates">
          {ELIGIBILITY.map((req, i) => <Gate key={i} i={i} req={req} />)}
        </ol>
        <p className="process-foot mono">
          Governed by Corporate &amp; Alumni Relations. Pre-placement training attendance is mandatory.
        </p>
      </div>
    </section>
  );
}

function Gate({ i, req }) {
  const ref = useReveal({ threshold: 0.4 });
  return (
    <li className="gate rise" ref={ref} style={{ "--d": `${i * 70}ms` }} data-hot>
      <span className="gate-n num">{String(i + 1).padStart(2, "0")}</span>
      <span className="gate-line" />
      <span className="gate-req">{req}</span>
    </li>
  );
}
