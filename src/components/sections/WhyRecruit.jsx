import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { WHY } from "../../data/placements";
import "./WhyRecruit.css";

export default function WhyRecruit() {
  return (
    <section className="section why" id="why">
      <div className="wrap">
        <Eyebrow idx="05">Why recruit here</Eyebrow>
        <h2 className="serif why-h">
          <Words text="Why organisations recruit here." />
        </h2>
        <div className="why-grid">
          {WHY.map((b, i) => <WhyCell key={b.h} b={b} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function WhyCell({ b, i }) {
  const ref = useReveal({ threshold: 0.2 });
  return (
    <article className="why-cell" ref={ref} style={{ "--d": `${(i % 3) * 90}ms` }} data-hot>
      <div className="why-head">
        <span className="why-idx num">{String(i + 1).padStart(2, "0")}</span>
        <span className="why-rule" />
      </div>
      <h3 className="serif why-name">{b.h}</h3>
      <p className="why-p">{b.p}</p>
    </article>
  );
}
