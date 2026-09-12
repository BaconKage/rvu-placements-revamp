import { useEffect, useRef } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { ELIGIBILITY } from "../../data/placements";
import "./Process.css";

export default function Process({ idx = "03" }) {
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
    let raf = 0;
    let visible = false;
    let lastProgress;
    const update = () => {
      raf = 0;
      // Finish all layout reads before changing a class or inline style.
      const r = sec.getBoundingClientRect();
      const vh = innerHeight;
      const lit = rowsRef.current.map((row) => row && row.getBoundingClientRect().top < vh * 0.66);
      const prog = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / (r.height * 0.82))).toFixed(3);
      if (prog !== lastProgress) {
        spine.style.transform = `scaleY(${prog})`;
        lastProgress = prog;
      }
      rowsRef.current.forEach((row, i) => {
        if (row && row.classList.contains("lit") !== lit[i]) row.classList.toggle("lit", lit[i]);
      });
    };
    const onScroll = () => {
      if (!raf && visible) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Also settle the final state when an anchor jumps past the section.
      if (!raf) raf = requestAnimationFrame(update);
    }, { rootMargin: "100px" });
    io.observe(sec);
    const ro = new ResizeObserver(onScroll);
    ro.observe(sec);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <section className="section process" id="process" ref={secRef}>
      <div className="wrap">
        <Eyebrow idx={idx}>Student eligibility</Eyebrow>
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
