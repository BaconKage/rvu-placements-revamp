import { useEffect, useRef, useState } from "react";
import Eyebrow from "../components/ui/Eyebrow";
import Words from "../components/ui/Words";
import RecruiterForm from "../components/forms/RecruiterForm";
import RecruitDocument from "../components/forms/RecruitDocument";
import { CONTACT } from "../data/placements";
import { EMPTY, DRAFT_KEY, validate, completion, makeRef, summary } from "../data/recruitForm";
import "./Forms.css";

const ENDPOINT = import.meta.env.VITE_RECRUIT_ENDPOINT;

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
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [refNo, setRefNo] = useState("");
  const [submittedOn, setSubmittedOn] = useState("");
  const [sheet, setSheet] = useState(false);
  const blurTimer = useRef(null);

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));

  useEffect(() => { if (tried) setErrors(validate(data)); }, [data, tried]);
  useEffect(() => {
    if (status === "done") return;
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
    setStatus("sending");
    const ref = makeRef();
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, ref, submittedAt: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 700)); // concept demo: nothing leaves the browser
      }
      setRefNo(ref);
      setSubmittedOn(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
      setStatus("done");
      setActive(null);
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      if (matchMedia("(max-width: 900px)").matches) setSheet(true);
      else if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setData(EMPTY); setErrors({}); setTried(false); setStatus("idle"); setRefNo(""); setSubmittedOn(""); setSheet(false);
  };

  const { done, total } = completion(data);
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Recruiter registration — ${data.org} (${refNo})`)}&body=${encodeURIComponent(summary(data, refNo))}`;

  return (
    <main className="fm">
      <header className="wrap fm-head">
        <Eyebrow>Forms · Corporate &amp; Alumni Relations</Eyebrow>
        <div className="fm-head-row">
          <div>
            <h1 className="serif fm-title"><Words text="Register to recruit." hi={new Set([2])} /></h1>
            <p className="lede fm-dek">
              Fill in the form and watch your letter of intent write itself. When it's complete, sign it and
              CAR stamps it received. It takes about four minutes.
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
                Your letter of intent from <b>{data.org}</b> is on file with the Corporate &amp; Alumni Relations
                office. The team will contact you at <b>{data.email}</b> to confirm the drive.
              </p>
              {!ENDPOINT && (
                <p className="fm-hint">
                  Concept build: no data left this browser. Use “Email a copy” to send the letter to CAR.
                </p>
              )}
              <div className="fm-done-actions">
                <button type="button" className="btn" onClick={() => window.print()}>Print / save PDF <span className="arrow">→</span></button>
                <a className="btn ghost" href={mailto}>Email a copy</a>
                <button type="button" className="btn ghost" onClick={reset}>Start another</button>
              </div>
            </div>
          ) : (
            <>
              <RecruiterForm data={data} set={set} errors={errors} onFocus={onFocus} onBlur={onBlur}
                onSubmit={onSubmit} sending={status === "sending"} />
              {status === "error" && (
                <p className="fm-err fm-send-err" role="alert">
                  We couldn't send that. Check your connection and try again, or <a href={mailto}>email the letter to CAR</a>.
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
              refNo={refNo} submittedOn={status === "done" ? submittedOn : ""} />
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
