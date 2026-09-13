import { useEffect, useRef, useState } from "react";
import Eyebrow from "../components/ui/Eyebrow";
import Words from "../components/ui/Words";
import RecruiterForm from "../components/forms/RecruiterForm";
import RecruitDocument from "../components/forms/RecruitDocument";
import { CONTACT } from "../data/placements";
import { EMPTY, DRAFT_KEY, validate, completion, makeRef, summary } from "../data/recruitForm";
import "./Forms.css";

// Where registrations go. Unset (this demo build): nothing is sent, and the page
// says so. Set: the letter counts as received only after the endpoint confirms.
const ENDPOINT = import.meta.env.VITE_RECRUIT_ENDPOINT;
const DEMO = !ENDPOINT;

function loadDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved && typeof saved === "object") return { ...EMPTY, ...saved };
  } catch {}
  return EMPTY;
}

const scrollToEl = (el, offset = -190) => {
  if (window.__lenis) window.__lenis.scrollTo(el, { offset, duration: 0.9 });
  else el.scrollIntoView({ behavior: "smooth", block: "center" });
};

export default function Forms() {
  const [data, setData] = useState(loadDraft);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | done (received) | prepared (demo) | error
  const [refNo, setRefNo] = useState("");
  const [submittedOn, setSubmittedOn] = useState("");
  const [sheet, setSheet] = useState(false);
  const blurTimer = useRef(null);

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));

  useEffect(() => { if (tried) setErrors(validate(data)); }, [data, tried]);
  useEffect(() => {
    if (status === "done") return; // cleared on confirmed receipt; don't write it back
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
  }, [data, status]);

  const onFocus = (key) => { clearTimeout(blurTimer.current); setActive(key); };
  const onBlur = () => { blurTimer.current = setTimeout(() => setActive(null), 120); };

  // clicking a blank in the letter jumps to its control
  const onPick = (key) => {
    const el = document.querySelector(`.fm-form [data-field="${key}"]`);
    if (!el) return;
    setSheet(false);
    scrollToEl(el);
    el.querySelector("input, select, textarea, button")?.focus({ preventScroll: true });
    setActive(key);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(data);
    setErrors(errs);
    const first = [...document.querySelectorAll(".fm-form [data-field]")].find((n) => errs[n.dataset.field]);
    if (first) {
      scrollToEl(first);
      first.querySelector("input, select, textarea, button")?.focus({ preventScroll: true });
      return;
    }
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const showLetter = () => {
      setActive(null);
      if (matchMedia("(max-width: 900px)").matches) setSheet(true);
      else if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Demo: no fake send. The letter is signed and ready to email; the draft stays saved.
    if (DEMO) {
      setRefNo("");
      setSubmittedOn(today);
      setStatus("prepared");
      showLetter();
      return;
    }

    setStatus("sending");
    const ref = makeRef();
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ref, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // receipt confirmed: only now is it "Received", and only now is the draft cleared
      setRefNo(ref);
      setSubmittedOn(today);
      setStatus("done");
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      showLetter();
    } catch {
      setStatus("error"); // draft kept, nothing claimed
    }
  };

  const reset = () => {
    setData(EMPTY); setErrors({}); setTried(false); setStatus("idle"); setRefNo(""); setSubmittedOn(""); setSheet(false);
  };

  const { done, total } = completion(data);
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Recruiter registration — ${data.org}${refNo ? ` (${refNo})` : ""}`)}&body=${encodeURIComponent(summary(data, refNo || "not yet assigned"))}`;
  const signed = status === "done" || status === "prepared";

  return (
    <main className="fm">
      <header className="wrap fm-head">
        <Eyebrow>Forms · Corporate &amp; Alumni Relations</Eyebrow>
        <div className="fm-head-row">
          <div>
            <h1 className="serif fm-title"><Words text="Register to recruit." hi={new Set([2])} /></h1>
            <p className="lede fm-dek">
              Fill in the form and watch your letter of intent write itself. When it's complete, sign it
              {DEMO ? " and email it to CAR." : " and send it to CAR."} It takes about four minutes.
            </p>
          </div>
          <div className="fm-meter" aria-live="polite">
            <span className="mono">Letter {done} / {total} complete</span>
            <span className="fm-meter-bar"><span style={{ transform: `scaleX(${done / total})` }} /></span>
          </div>
        </div>
      </header>

      <div className="wrap fm-split">
        <div className="fm-left">
          {status === "done" ? (
            <div className="fm-done">
              <span className="mono fm-done-k">Received · {refNo}</span>
              <h2 className="serif fm-done-h">Thank you, {data.contact.split(" ")[0]}.</h2>
              <p>
                Your letter of intent from <b>{data.org}</b> reached the Corporate &amp; Alumni Relations office.
                The team will contact you at <b>{data.email}</b> to confirm the drive.
              </p>
              <div className="fm-done-actions">
                <button type="button" className="btn" onClick={() => window.print()}>Print / save PDF <span className="arrow">→</span></button>
                <button type="button" className="btn ghost" onClick={reset}>Start another</button>
              </div>
            </div>
          ) : status === "prepared" ? (
            <div className="fm-done">
              <span className="mono fm-done-k demo">Demo · not sent to CAR</span>
              <h2 className="serif fm-done-h">Your letter is ready, {data.contact.split(" ")[0]}.</h2>
              <p>
                This is a demonstration site, so <b>nothing has been sent</b> and CAR has not received this
                registration. To register <b>{data.org}</b>, email the letter to <b>{CONTACT.email}</b>.
              </p>
              <div className="fm-done-actions">
                <a className="btn" href={mailto}>Email the letter to CAR <span className="arrow">→</span></a>
                <button type="button" className="btn ghost" onClick={() => window.print()}>Print / save PDF</button>
                <button type="button" className="btn ghost" onClick={() => setStatus("idle")}>Edit the letter</button>
              </div>
              <p className="fm-hint">Your draft stays saved in this browser.</p>
            </div>
          ) : (
            <>
              <RecruiterForm data={data} set={set} errors={errors} onFocus={onFocus} onBlur={onBlur}
                onSubmit={onSubmit} sending={status === "sending"} demo={DEMO} />
              {status === "error" && (
                <p className="fm-err fm-send-err" role="alert">
                  We couldn't confirm that CAR received it, so nothing has been marked as sent. Try again, or <a href={mailto}>email the letter to CAR</a>.
                </p>
              )}
            </>
          )}
        </div>

        <aside className={`fm-doc ${sheet ? "open" : ""}`} aria-label="Letter preview">
          <div className="fm-doc-inner" data-lenis-prevent>
            <div className="fm-doc-bar mono">
              <span>Live preview</span>
              <button type="button" className="fm-doc-close" onClick={() => setSheet(false)} aria-label="Close preview">×</button>
            </div>
            <RecruitDocument data={data} errors={errors} active={active} onPick={onPick}
              refNo={refNo} submittedOn={signed ? submittedOn : ""} demo={status === "prepared"} />
          </div>
        </aside>
      </div>

      {!sheet && (
        <button type="button" className="fm-doc-toggle mono" onClick={() => setSheet(true)} aria-expanded={false}>
          Preview letter · {done}/{total}
        </button>
      )}

      <p className="wrap fm-foot mono">
        Replaces the “Recruit Now” Google Form on rvu.edu.in/placements. Programme headcounts are the published eligible strength.
      </p>
    </main>
  );
}
