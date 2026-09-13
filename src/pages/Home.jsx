import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT } from "../data/placements";
import logoBlue from "../assets/rvu-logo-blue.png";
import logoGold from "../assets/rvu-logo-gold.avif";
import "./Home.css";

// Line-art marks inside a crest-like shield, echoing the RVU emblem.
function Mark({ children }) {
  return (
    <svg className="choice-mark" viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 2.5 43.5 9v19c0 12.6-8.6 21.6-19.5 25.5C13.1 49.6 4.5 40.6 4.5 28V9Z" />
      <path d="M24 7.5 39 12.5v15.3c0 9.9-6.6 17-15 20.2-8.4-3.2-15-10.3-15-20.2V12.5Z" opacity=".45" />
      <g transform="translate(12 15)">{children}</g>
    </svg>
  );
}

const CHOICES = [
  {
    to: "/students", word: "Student / Parent", tag: "Go, find your placement.",
    mark: (
      <>
        <path d="M1 8.5 12 3l11 5.5L12 14Z" />
        <path d="M5.5 11v5c0 1.4 2.9 3.2 6.5 3.2s6.5-1.8 6.5-3.2v-5" />
        <path d="M23 8.5v6" />
      </>
    ),
  },
  {
    to: "/partners", word: "Recruiter", tag: "Go, hire top-tier talent.",
    mark: (
      <>
        <rect x="1.5" y="7" width="21" height="14" rx="2" />
        <path d="M8 7V4.8C8 3.8 8.8 3 9.8 3h4.4c1 0 1.8.8 1.8 1.8V7" />
        <path d="M1.5 13h21" />
        <path d="M10.5 13v2h3v-2" />
      </>
    ),
  },
];

// The front door: RVU's own words, then one question — who are you?
export default function Home() {
  const [ready, setReady] = useState(() => !!window.__rvuPreloaded);

  // rise in as the loader curtain lifts
  useEffect(() => {
    if (ready) return;
    const on = () => setReady(true);
    addEventListener("rvu:preloaded", on);
    return () => removeEventListener("rvu:preloaded", on);
  }, [ready]);

  return (
    <main className={`hero ${ready ? "in" : ""}`}>
      {/* RVU's campus gate in line art, a faint backdrop behind the front door */}
      <div className="hero-gate" aria-hidden="true" />
      <div className="hero-inner">
        <span className="hero-corner tl" aria-hidden="true" />
        <span className="hero-corner br" aria-hidden="true" />

        {/* the frame opens (corners slide out) and unveils everything in here */}
        <div className="hero-content">
          {/* blue in light mode, gold in dark — only one is ever displayed */}
          <span className="hero-logo rise" style={{ "--d": "0ms" }}>
            <img className="logo-light" src={logoBlue} alt="RV University" width="783" height="391" />
            <img className="logo-dark" src={logoGold} alt="RV University" width="512" height="258" />
          </span>
          <span className="hero-kicker rise" style={{ "--d": "40ms" }}>
            <a href="https://rvu.edu.in" target="_blank" rel="noopener noreferrer">RV University</a> · Placements
          </span>
          <h1 className="hero-title rise" style={{ "--d": "80ms" }}>Career Development and Corporate Relations</h1>
          <p className="hero-sub rise" style={{ "--d": "160ms" }}>Empowering Industry Innovators with Top-Tier Talent</p>
          <p className="hero-para rise" style={{ "--d": "220ms" }}>
            Access a multidisciplinary talent pool of 1,600+ industry-ready graduates trained in cutting-edge
            technologies, design, business, filmmaking, psychology and law.
          </p>

          <p className="hero-ask rise" style={{ "--d": "300ms" }}><span>Tell us who you are</span></p>

          <nav className="hero-choices" aria-label="Choose your path">
            {CHOICES.map((c, i) => (
              <Link key={c.to} to={c.to} className="choice rise" style={{ "--d": `${380 + i * 90}ms` }}>
                <Mark>{c.mark}</Mark>
                <span className="choice-lock">
                  <span className="choice-top">I’m a</span>
                  <span className="choice-word">{c.word}</span>
                  <span className="choice-rule" aria-hidden="true" />
                  <span className="choice-tag">{c.tag}</span>
                </span>
                <span className="choice-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <footer className="hero-foot rise" style={{ "--d": "700ms" }}>
        <Link to="/recruiters">Explore who recruits →</Link>
        <Link to="/forms">Register to recruit</Link>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </footer>
    </main>
  );
}
