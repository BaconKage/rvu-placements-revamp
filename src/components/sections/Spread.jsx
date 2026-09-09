import Eyebrow from "../ui/Eyebrow";
import { useReveal } from "../../hooks/useReveal";
import { SPREAD, SPREAD_PEAK } from "../../data/placements";
import "./Spread.css";

export default function Spread() {
  const ref = useReveal({ threshold: 0.3 });
  const max = Math.max(...SPREAD.map((d) => d.n));
  return (
    <section className="section spread" id="spread">
      <div className="wrap">
        <Eyebrow idx="03">The spread</Eyebrow>
        <h2 className="serif spread-h">
          The highest package is <em>one</em> offer.<br />Here is the shape of the rest.
        </h2>

        <div className="dist reveal" ref={ref}>
          {SPREAD.map((d, i) => (
            <div className="drow" key={d.band} style={{ "--d": `${i * 90}ms` }}>
              <span className="drow-band mono">{d.band}</span>
              <span className="track">
                <span className="fill" style={{ "--w": `${Math.round((d.n / max) * 100)}%` }} />
              </span>
              <span className="drow-hint">{d.hint}</span>
              <span className="drow-n mono">≈{d.n}</span>
            </div>
          ))}
          <div className="drow peak" style={{ "--d": `${SPREAD.length * 90}ms` }}>
            <span className="drow-band mono">{SPREAD_PEAK.band}</span>
            <span className="track"><span className="fill" style={{ "--w": "2%" }} /></span>
            <span className="drow-hint">{SPREAD_PEAK.who}</span>
            <span className="drow-n mono">{SPREAD_PEAK.n}</span>
          </div>
        </div>

        <p className="spread-foot mono">
          Counts read from the salary-distribution chart published on rvu.edu.in and rounded.
          Minimum recorded offer ≈ ₹4 LPA. Exact figures to be supplied by CAR.
        </p>
      </div>
    </section>
  );
}
