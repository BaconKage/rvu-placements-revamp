import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoBlue from "../../assets/rvu-logo-blue-nav.webp";
import logoGold from "../../assets/rvu-logo-gold.avif";
import imgSummer from "../../assets/internships/summer.webp";
import imgWinter from "../../assets/internships/winter.webp";
import imgLive from "../../assets/internships/live-projects.webp";
import imgMentoring from "../../assets/internships/mentoring.webp";
import imgCapstone from "../../assets/internships/capstone.webp";
import imgInternational from "../../assets/internships/international.webp";
import imgCollaboration from "../../assets/internships/collaboration.webp";
import Eyebrow from "../ui/Eyebrow";
import Words from "../ui/Words";
import { useReveal } from "../../hooks/useReveal";
import {
  CONTACT, GOVERNANCE, TRAINING, TRAINING_NOTES, RESPONSIBILITIES, INTERNSHIPS,
  RECRUITER_SECTORS, RECRUITER_CATEGORIES, UPCOMING, ELIGIBILITY,
} from "../../data/placements";
import "./Audience.css";

const MAIL = `mailto:${CONTACT.email}`;
const pad = (i) => String(i + 1).padStart(2, "0");

function Action({ a }) {
  const cls = `btn ${a.primary ? "" : "ghost"}`;
  const body = <>{a.label} <span className="arrow">→</span></>;
  return a.to ? <Link className={cls} to={a.to}>{body}</Link> : <a className={cls} href={a.href}>{body}</a>;
}

// ---- page header: who this page is for, the three facts that matter, jump links ----
// True while the site's dark theme is on (the toggle sets data-theme on <html>).
// Only watches when asked, so pages without dark artwork add no observer.
function useDarkTheme(watch) {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useState(read);
  useEffect(() => {
    if (!watch) return;
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    setDark(read());
    return () => mo.disconnect();
  }, [watch]);
  return dark;
}

export function PageHead({ kicker, title, hi = [], lede, facts = [], links = [], actions = [], bg, bgDark, bgAlign }) {
  const ref = useReveal();
  const dark = useDarkTheme(!!bgDark);
  // only the current theme's artwork is in the page, so the other one is never downloaded early
  const art = bgDark && dark ? bgDark : bg;
  return (
    <header className={`ph${bg ? " ph-has-bg" : ""}`}>
      {bg && (
        <div className={`ph-bg${bgDark ? " has-dark" : ""}${bgAlign === "right" ? " ph-bg-right" : ""}`} aria-hidden="true">
          <img key={art} src={art} alt="" width="1600" height="845" decoding="async" />
        </div>
      )}
      <div className="wrap">
        <Eyebrow>{kicker}</Eyebrow>
        <div className="ph-body">
          <div>
            <h1 className="serif ph-title"><Words text={title} hi={new Set(hi)} /></h1>
            <p className="lede ph-lede">{lede}</p>
            {actions.length > 0 && <div className="ph-actions">{actions.map((a) => <Action key={a.label} a={a} />)}</div>}
          </div>
          {facts.length > 0 && (
            <dl className="ph-facts reveal" ref={ref}>
              {facts.map(([v, k]) => (
                <div className="ph-fact" key={k}><dt className="num">{v}</dt><dd className="mono">{k}</dd></div>
              ))}
            </dl>
          )}
        </div>
        {links.length > 0 && (
          <nav className="ph-links" aria-label="On this page">
            {links.map(([href, label], i) => (
              <a key={href} href={href} className="ph-link"><span className="mono">{pad(i)}</span>{label}</a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

// ---- students: mandatory training + responsibilities ----
export function TrainingSection({ idx }) {
  return (
    <section className="section aud-sec" id="training">
      <div className="wrap">
        <Eyebrow idx={idx}>Pre-placement training &amp; conduct</Eyebrow>
        <h2 className="serif aud-h"><Words text="Prepared before the first interview." hi={new Set([1])} /></h2>
        <div className="aud-two">
          <div>
            <h3 className="mono aud-sub">Mandatory training</h3>
            <ol className="tr-list">
              {TRAINING.map((t, i) => (
                <li key={t} className="tr-card"><span className="num">{pad(i)}</span><span>{t}</span></li>
              ))}
            </ol>
            <ul className="aud-notes">{TRAINING_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
          <div>
            <h3 className="mono aud-sub">Student responsibilities</h3>
            <ul className="tick-list">{RESPONSIBILITIES.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="aud-note">
              Any action resulting in reputational, institutional, or peer-level impact may be referred to STDC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- internships & industry exposure ----
// Photos and wording from rvu.edu.in/placements (Industry Collaboration has no
// photo there, so it uses the placements page's industry-session photo).
const INTERNSHIP_DETAILS = {
  "Summer Internship": { img: imgSummer, text: "Gain hands-on industry experience through structured summer internships that help students apply classroom learning to real-world business and technology challenges." },
  "Winter Internship": { img: imgWinter, text: "Utilize the winter break to work on short-term industry assignments, develop practical skills, and strengthen professional exposure." },
  "Live Projects": { img: imgLive, text: "Collaborate with industry partners on real business problems, delivering innovative solutions while gaining practical experience throughout the academic year." },
  "Industry Mentoring": { img: imgMentoring, text: "Learn directly from experienced industry professionals who provide career guidance, technical insights, and mentorship to prepare students for the workplace." },
  "Capstone Projects": { img: imgCapstone, text: "Work on multidisciplinary, industry-relevant capstone projects that integrate academic knowledge with practical problem-solving and innovation." },
  "International Internship Opportunities": { img: imgInternational, text: "Explore global internship opportunities that provide cross-cultural exposure, international work experience, and a broader perspective on industry practices." },
  "Industry Collaboration": { img: imgCollaboration, text: "Through the Corporate & Alumni Relations office, students work alongside industry, alumni and startups on sessions, projects and hiring." },
};

export function InternshipsSection({ idx, title = "Experience that counts before placement.", hi = [3], lede }) {
  const cellRefs = useRef([]);
  const closeRef = useRef(null);
  const [pop, setPop] = useState(null); // { i, rowEnd }: open card and the last card of its row

  // open the card's panel directly under its row (the grid grows, nothing is covered);
  // clicking the open card closes it
  const toggle = (i) => {
    if (pop?.i === i) { setPop(null); return; }
    const cells = cellRefs.current;
    const top = (el) => Math.round(el.getBoundingClientRect().top);
    let rowEnd = i;
    while (rowEnd + 1 < cells.length && top(cells[rowEnd + 1]) === top(cells[i])) rowEnd++;
    setPop({ i, rowEnd });
  };
  const closeAndRefocus = () => {
    if (pop) cellRefs.current[pop.i]?.focus({ preventScroll: true });
    setPop(null);
  };

  // while open: Escape / outside click / resize close it; listeners exist only then
  useEffect(() => {
    if (!pop) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      cellRefs.current[pop.i]?.focus({ preventScroll: true });
      setPop(null);
    };
    const onDown = (e) => { if (!e.target.closest?.(".int-pop, .int-cell")) setPop(null); };
    const onResize = () => setPop(null);
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
      removeEventListener("resize", onResize);
    };
  }, [pop]);

  const name = pop ? INTERNSHIPS[pop.i] : null;
  const detail = name ? INTERNSHIP_DETAILS[name] : null;

  return (
    <section className="section aud-sec" id="internships">
      <div className="wrap">
        <Eyebrow idx={idx}>Internships &amp; industry exposure</Eyebrow>
        <h2 className="serif aud-h"><Words text={title} hi={new Set(hi)} /></h2>
        {lede && <p className="lede aud-lede">{lede}</p>}
        <div className="int-grid">
          {INTERNSHIPS.map((t, i) => (
            <Fragment key={t}>
              <button
                type="button"
                ref={(el) => (cellRefs.current[i] = el)}
                className={`int-cell${i >= 4 ? " wide" : ""}${i === INTERNSHIPS.length - 1 ? " last" : ""}${pop?.i === i ? " on" : ""}`}
                aria-expanded={pop?.i === i}
                aria-controls="int-pop"
                onClick={() => toggle(i)}
              >
                <span className="int-cell-top">
                  <span className="num">{pad(i)}</span>
                  <span className="int-plus" aria-hidden="true" />
                </span>
                <span className="int-name">{t}</span>
              </button>
              {detail && pop.rowEnd === i && (
                <div key={`pop-${pop.i}`} id="int-pop" className="int-pop" role="region" aria-label={name}>
                  <img className="int-pop-img" src={detail.img} alt={name} width="400" height="380" decoding="async" />
                  <div className="int-pop-body">
                    <span className="num">{pad(pop.i)}</span>
                    <h3 className="int-pop-name">{name}</h3>
                    <p className="int-pop-text">{detail.text}</p>
                  </div>
                  <button ref={closeRef} type="button" className="int-pop-close" aria-label="Close" onClick={closeAndRefocus}>×</button>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- recruiters by sector (students & parents, partners) ----
// `peek`, when given, takes the place of the sector cards (and the wall button,
// since the peek links to the wall itself).
export function SectorsSection({ idx, title = "Who recruits, by sector.", hi = [2], peek }) {
  const total = RECRUITER_SECTORS.reduce((a, s) => a + s.cos.length, 0);
  return (
    <section className="section aud-sec" id="sectors">
      <div className="wrap">
        <Eyebrow idx={idx}>Recruiters</Eyebrow>
        <h2 className="serif aud-h"><Words text={title} hi={new Set(hi)} /></h2>
        <div className="sec-cats">
          <span className="mono aud-sub inline">Recruiter categories</span>
          {RECRUITER_CATEGORIES.map((c) => <span key={c} className="aud-chip">{c}</span>)}
        </div>
        {peek ?? (
          <div className="sec-grid">
            {RECRUITER_SECTORS.map((s) => (
              <article className="sec-card" key={s.sector}>
                <div className="sec-card-head">
                  <span className="sec-name">{s.sector}</span>
                  <span className="sec-count">{s.cos.length}</span>
                </div>
                <p className="sec-cos">{s.cos.join(" · ")}</p>
              </article>
            ))}
          </div>
        )}
        <div className="sec-foot">
          <p className="sec-pipe">
            <b>{total} organisations</b> recruited through RV drives in the published sheets, with <b>{UPCOMING.length} more</b> in the pipeline.
          </p>
          {!peek && <Link className="btn ghost" to="/recruiters">Explore the recruiter wall <span className="arrow">→</span></Link>}
        </div>
      </div>
    </section>
  );
}

// ---- parents: governance + support ----
export function GovernanceSection({ idx }) {
  return (
    <section className="section aud-sec gov" id="governance">
      <div className="wrap">
        <Eyebrow idx={idx}>Governance &amp; support</Eyebrow>
        <h2 className="serif aud-h"><Words text="The people behind your placements." hi={new Set([3])} /></h2>
        <div className="aud-two">
          <div>
            <h3 className="mono aud-sub">Placement governance</h3>
            <ul className="tick-list">{GOVERNANCE.map((g) => <li key={g}>{g}</li>)}</ul>
          </div>
          <div className="gov-cards">
            <Link className="gov-card" to="/students#process">
              <span className="gov-card-k">Eligibility</span>
              <span className="gov-card-v">{ELIGIBILITY.length} conditions before any drive</span>
              <span className="gov-card-p">No backlogs, training attendance, a signed declaration, experiential components and a clean disciplinary record.</span>
            </Link>
            <Link className="gov-card" to="/students#training">
              <span className="gov-card-k">Preparation</span>
              <span className="gov-card-v">Mandatory pre-placement training</span>
              <span className="gov-card-p">Technical, soft-skills and behavioural training, with minimum 80% attendance across all components.</span>
            </Link>
            <a className="gov-card" href={MAIL}>
              <span className="gov-card-k">Contact</span>
              <span className="gov-card-v">{CONTACT.office}</span>
              <span className="gov-card-p">{CONTACT.email} · {CONTACT.lines.join(", ")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- corporate partners: how to engage ----
const STEPS = [
  { h: "Register your interest", p: "Tell CAR about your organisation, the roles and the programmes you want to hire from. It takes about four minutes.", link: { to: "/forms", label: "Open the form" } },
  { h: "CAR gets in touch", p: "The Corporate & Alumni Relations office confirms the details, the eligible headcount and a drive window with you." },
  { h: "Meet the students", p: "Run the drive on campus, virtually or hybrid — tests, group discussions and interviews, in the order you choose." },
  { h: "Offer and onboard", p: "Make offers for full-time roles, internships, intern-to-FTE tracks or live projects." },
];
export function EngageSection({ idx }) {
  return (
    <section className="section aud-sec" id="engage">
      <div className="wrap">
        <Eyebrow idx={idx}>How to engage</Eyebrow>
        <h2 className="serif aud-h"><Words text="From first contact to offers, in four steps." hi={new Set([5])} /></h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.h}>
              <span className="num step-n">{pad(i)}</span>
              <h3 className="step-h">{s.h}</h3>
              <p className="step-p">{s.p}</p>
              {s.link && <Link className="step-link" to={s.link.to}>{s.link.label} →</Link>}
            </li>
          ))}
        </ol>
        <div className="engage-formats">
          <span className="mono aud-sub inline">Ways to engage</span>
          {["Campus placements", ...INTERNSHIPS].map((t) => <span key={t} className="aud-chip">{t}</span>)}
        </div>
      </div>
    </section>
  );
}

// ---- shared footer: contact, the other paths, disclaimer ----
export function SiteFooter({ contact = true }) {
  return (
    <footer className="site-foot" id="contact">
      <div className="wrap">
        {contact && (
          <div className="sf-contact">
            <div>
              <span className="mono sf-k">{CONTACT.office}</span>
              <h2 className="serif sf-h">Questions about placements?</h2>
              <p className="sf-p">Write to or visit the Corporate &amp; Alumni Relations office, the university’s single point of contact for students, parents and recruiters.</p>
            </div>
            <div className="sf-card">
              <span className="mono sf-k">Visit</span>
              <address className="sf-addr">{CONTACT.lines.map((l) => <span key={l}>{l}</span>)}</address>
              <a className="btn" href={MAIL}>{CONTACT.email} <span className="arrow">→</span></a>
            </div>
          </div>
        )}
        <nav className="sf-links" aria-label="Site">
          <Link to="/">Home</Link>
          <Link to="/recruiters">Who recruits</Link>
          <Link to="/students">For students &amp; parents</Link>
          <Link to="/partners">For recruiters</Link>
          <Link to="/forms">Register to recruit</Link>
        </nav>
        <div className="sf-bar">
          {/* same lockup as the nav: blue logo on light, gold in dark mode */}
          <span className="sf-brand">
            <img className="sf-logo logo-light" src={logoBlue} alt="RV University" width="336" height="168" />
            <img className="sf-logo logo-dark" src={logoGold} alt="RV University" width="512" height="258" />
            <span className="sf-divider" />
            <span className="sf-dept mono">Placements</span>
          </span>
          <p className="sf-disclaimer mono">
            Design concept for the RV University Placement Website Revamp Competition. Statistics, programme names,
            benefit descriptions, eligibility rules and governance text are taken from rvu.edu.in/placements. Company
            names, roles and channels are drawn from the student-maintained RVU / RVCE 2023-batch placement sheets.
          </p>
        </div>
      </div>
    </footer>
  );
}
