import { Link } from "react-router-dom";
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
export function PageHead({ kicker, title, hi = [], lede, facts = [], links = [], actions = [] }) {
  const ref = useReveal();
  return (
    <header className="ph">
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
export function InternshipsSection({ idx, title = "Experience that counts before placement.", hi = [3], lede }) {
  return (
    <section className="section aud-sec" id="internships">
      <div className="wrap">
        <Eyebrow idx={idx}>Internships &amp; industry exposure</Eyebrow>
        <h2 className="serif aud-h"><Words text={title} hi={new Set(hi)} /></h2>
        {lede && <p className="lede aud-lede">{lede}</p>}
        <div className="int-grid">
          {INTERNSHIPS.map((t, i) => (
            <div className="int-cell" key={t}><span className="num">{pad(i)}</span><span className="int-name">{t}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- recruiters by sector (parents, partners) ----
export function SectorsSection({ idx, title = "Who recruits, by sector.", hi = [2] }) {
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
        <div className="sec-foot">
          <p className="sec-pipe">
            <b>{total} organisations</b> recruited through RV drives in the published sheets, with <b>{UPCOMING.length} more</b> in the pipeline.
          </p>
          <Link className="btn ghost" to="/recruiters">Explore the recruiter wall <span className="arrow">→</span></Link>
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
        <h2 className="serif aud-h"><Words text="A process with clear rules and one accountable office." hi={new Set([4])} /></h2>
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
              <p className="sf-p">Write to or visit the Corporate &amp; Alumni Relations office — the university’s single point of contact for students, parents and recruiters.</p>
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
          <Link to="/students">For students</Link>
          <Link to="/partners">For recruiters</Link>
          <Link to="/parents">For parents</Link>
          <Link to="/forms">Register to recruit</Link>
        </nav>
        <div className="sf-bar">
          <span className="sf-brand serif">R<em>V</em> University · Placements</span>
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
