import { useEffect, useRef } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { ELIGIBILITY } from "../../data/placements";
import "./Process.css";

export default function Process() {
  const secRef = useRef(null);
  const spineRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const sec = secRef.current, spine = spineRef.current;
    if (!sec || !spine) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spine.style.transform = "scaleY(1)";
      rowsRef.current.forEach((r) => r?.classList.add("lit"));
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = sec.getBoundingClientRect();
        const vh = innerHeight;
        const p = (vh * 0.62 - r.top) / (r.height * 0.82);
        const prog = Math.max(0, Math.min(1, p));
        spine.style.transform = `scaleY(${prog.toFixed(3)})`;
        rowsRef.current.forEach((row) => {
          if (!row) return;
          const rr = row.getBoundingClientRect();
          row.classList.toggle("lit", rr.top < vh * 0.66);
        });
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="section process" id="process" ref={secRef}>
      <div className="wrap">
        <Eyebrow idx="04">Student eligibility</Eyebrow>
        <h2 className="serif process-h">
          <Words text="What it takes to sit a drive." hi={new Set([4])} />
        </h2>

        <div className="timeline">
          <div className="tl-track"><span className="tl-fill" ref={spineRef} /></div>
          <ol className="tl-list">
            {ELIGIBILITY.map((req, i) => (
              <li className="tl-row" key={i} ref={(el) => (rowsRef.current[i] = el)} data-hot>
                <span className="tl-node"><span className="tl-node-dot" /></span>
                <span className="tl-n num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tl-req">{req}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="process-foot mono">
          Governed by Corporate &amp; Alumni Relations. Pre-placement training attendance is mandatory.
        </p>
      </div>
    </section>
  );
}
