import Words from "../ui/Words";
import { STATS, COPY } from "../../data/placements";
import "./Hero.css";

export default function Hero() {
  return (
    <header className="masthead" id="top">
      <div className="wrap mh-wrap">
        <div className="mh-rule mh-rule-top" />
        <p className="mono mh-kicker">
          <span>RV University · Bengaluru</span>
          <span>Placement Record · 2024–25</span>
        </p>

        <div className="mh-body">
          <div className="mh-lead">
            <h1 className="serif mh-title">
              <Words text="Career Development &amp; Corporate Relations" hi={new Set([])} />
            </h1>
            <p className="mh-intro">{COPY.carIntro}</p>
            <div className="mh-actions">
              <a className="mh-link" href="#recruiters">Read the record <span aria-hidden="true">↓</span></a>
              <a className="mh-link muted" href="#recruit">Recruit with us <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <dl className="mh-figures">
            {STATS.slice(0, 4).map((s) => (
              <div className="mh-fig" key={s.k}>
                <dt className="num mh-fig-v">{s.v}<em>{s.unit}</em></dt>
                <dd className="mh-fig-k mono">{s.k}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mh-rule mh-rule-bottom" />
      </div>
    </header>
  );
}
