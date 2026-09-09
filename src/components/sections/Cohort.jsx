import Eyebrow from "../ui/Eyebrow";
import { useReveal } from "../../hooks/useReveal";
import { SCHOOLS, COHORT_TOTAL } from "../../data/placements";
import "./Cohort.css";

export default function Cohort() {
  const ref = useReveal();
  const summed = SCHOOLS.reduce((a, s) => a + s.programmes.reduce((b, p) => b + p.n, 0), 0);
  return (
    <section className="cohort" id="cohort">
      <div className="band reveal" ref={ref}>
        <Eyebrow idx="02">Who is on the wall</Eyebrow>
        <h2 className="serif band-h">Six schools. Seventeen programmes.<br />One eligibility list.</h2>
        <p className="lede band-lede">
          A recruiter picking a slot is really picking a cohort. This is that
          cohort, as filed with Corporate &amp; Alumni Relations.
        </p>

        <div className="ledger-scroll">
          <table className="ledger">
            <thead>
              <tr><th>Programme</th><th className="r">Eligible</th></tr>
            </thead>
            <tbody>
              {SCHOOLS.map((s) => (
                <SchoolRows key={s.name} school={s} />
              ))}
              <tr className="total">
                <td>Total eligible cohort</td>
                <td className="r">{COHORT_TOTAL.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="band-foot mono">
          Figures as published on rvu.edu.in. Programme rows sum to {summed.toLocaleString("en-IN")};
          the published cohort total is {COHORT_TOTAL.toLocaleString("en-IN")} — to reconcile with CAR.
        </p>
      </div>
    </section>
  );
}

function SchoolRows({ school }) {
  return (
    <>
      <tr className="school"><td colSpan={2}>{school.name}</td></tr>
      {school.programmes.map((p) => (
        <tr key={p.p}>
          <td>{p.p}</td>
          <td className="r">{p.n}</td>
        </tr>
      ))}
    </>
  );
}
