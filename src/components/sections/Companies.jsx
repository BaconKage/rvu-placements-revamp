import { useState } from "react";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import { RECRUITERS, UPCOMING } from "../../data/placements";
import "./Companies.css";

// one marquee track; speed reacts to scroll velocity via the global --vel var
function Marquee({ items, dir = 1, speed = 42 }) {
  const doubled = [...items, ...items];
  return (
    <div className={`mq ${dir === -1 ? "mq-rev" : ""}`} style={{ "--dur": `${speed}s` }}>
      <div className="mq-row">
        {doubled.map((c, i) => (
          <span className="chip-co" key={i}>
            <span className="chip-dot" />{c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Companies() {
  const ref = useReveal({ threshold: 0.12 });
  const [tab, setTab] = useState("here");
  return (
    <section className="section companies" id="companies">
      <div className="wrap">
        <Eyebrow idx="03">Recruiters</Eyebrow>
        <h2 className="serif comp-h">
          <Words text="The companies our students walk into." hi={new Set([2])} />
        </h2>
        <p className="lede comp-lede">
          From global banks to deep-tech startups — a snapshot of who has recruited
          on campus, and who is lined up next.
        </p>
      </div>

      <div className="mq-wrap reveal" ref={ref}>
        <div className="mq-tabs wrap">
          <button className={`mq-tab ${tab === "here" ? "on" : ""}`} onClick={() => setTab("here")} data-hot>
            <span className="mq-tab-dot live" /> On campus
          </button>
          <button className={`mq-tab ${tab === "next" ? "on" : ""}`} onClick={() => setTab("next")} data-hot>
            <span className="mq-tab-dot" /> In the pipeline
          </button>
          <span className="mq-count mono">
            {tab === "here" ? `${RECRUITERS.length}+ this cycle` : `${UPCOMING.length} lined up`}
          </span>
        </div>

        {tab === "here" ? (
          <>
            <Marquee items={RECRUITERS.slice(0, 18)} dir={1} speed={46} />
            <Marquee items={RECRUITERS.slice(18)} dir={-1} speed={52} />
          </>
        ) : (
          <>
            <Marquee items={UPCOMING.slice(0, 10)} dir={-1} speed={44} />
            <Marquee items={UPCOMING.slice(10)} dir={1} speed={50} />
          </>
        )}
      </div>
    </section>
  );
}
