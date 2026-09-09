import Eyebrow from "../ui/Eyebrow";
import { useReveal } from "../../hooks/useReveal";
import { PROCESS } from "../../data/placements";
import "./Process.css";

export default function Process() {
  const ref = useReveal();
  return (
    <section className="section process" id="process">
      <div className="wrap">
        <Eyebrow idx="04">How a student gets there</Eyebrow>
        <h2 className="serif process-h">Five gates, in order.</h2>
        <div className="steps reveal" ref={ref}>
          {PROCESS.map((s, i) => (
            <div className="step" key={s.h} style={{ "--d": `${i * 80}ms` }}>
              <div className="step-n num">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="step-h">{s.h}</h3>
              <p className="step-p">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
