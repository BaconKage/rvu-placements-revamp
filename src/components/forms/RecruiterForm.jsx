import { TextField, FieldGroup } from "./Field";
import { SCHOOLS } from "../../data/placements";
import {
  SECTORS, ENGAGEMENTS, STAGES, MODES, SECTIONS, SCHOOL_ABBR, eligibleCount, roleKey, todayIso,
} from "../../data/recruitForm";

function Section({ id, n, title, children }) {
  return (
    <section className="fm-sec" id={`sec-${id}`}>
      <h2 className="fm-sec-h"><span className="mono">{String(n).padStart(2, "0")}</span>{title}</h2>
      {children}
    </section>
  );
}

export default function RecruiterForm({ data: d, set, errors, onFocus, onBlur, onSubmit, sending, demo }) {
  const bind = (field) => ({ field, value: d[field], onChange: (v) => set(field, v), error: errors[field], onFocus, onBlur });
  const toggleIn = (key, item) => set(key, d[key].includes(item) ? d[key].filter((x) => x !== item) : [...d[key], item]);

  const setRole = (i, k, v) => set("roles", d.roles.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const addRole = () => set("roles", [...d.roles, { title: "", openings: "", ctc: "", place: "" }]);
  const dropRole = (i) => set("roles", d.roles.filter((_, j) => j !== i));

  const moveStage = (i, dir) => {
    const s = [...d.stages], j = i + dir;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    set("stages", s);
  };

  const jump = (id) => {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -150, duration: 1 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const pool = eligibleCount(d.programmes);

  return (
    <form className="fm-form" onSubmit={onSubmit} noValidate>
      <nav className="fm-tabs" aria-label="Form sections">
        {SECTIONS.map((s, i) => (
          <button type="button" key={s.id} className="fm-tab mono" onClick={() => jump(s.id)}>
            <span>{String(i + 1).padStart(2, "0")}</span> {s.label}
          </button>
        ))}
      </nav>

      <Section id="organisation" n={1} title="Your organisation">
        <TextField {...bind("org")} label="Organisation name" placeholder="e.g. Acko" autoComplete="organization" />
        <div className="fm-two">
          <div className={`fm-field ${errors.sector ? "invalid" : ""}`} data-field="sector">
            <label className="fm-label" htmlFor="f-sector">Sector</label>
            <select id="f-sector" className="fm-input" value={d.sector} onChange={(e) => set("sector", e.target.value)}
              onFocus={() => onFocus("sector")} onBlur={onBlur} aria-invalid={!!errors.sector}
              aria-describedby={errors.sector ? "f-sector-err" : undefined}>
              <option value="">Select…</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
            {errors.sector && <span className="fm-err" id="f-sector-err">{errors.sector}</span>}
          </div>
          <TextField {...bind("location")} label="Headquarters / city" placeholder="Bengaluru" optional />
        </div>
        <TextField {...bind("website")} label="Website" placeholder="acko.com" optional inputMode="url" />
      </Section>

      <Section id="contact" n={2} title="Who CAR should talk to">
        <div className="fm-two">
          <TextField {...bind("contact")} label="Full name" autoComplete="name" />
          <TextField {...bind("designation")} label="Designation" placeholder="Campus Hiring Lead" />
        </div>
        <div className="fm-two">
          <TextField {...bind("email")} label="Work email" type="email" autoComplete="email" />
          <TextField {...bind("phone")} label="Phone" type="tel" autoComplete="tel" optional />
        </div>
      </Section>

      <Section id="roles" n={3} title="What you're hiring for">
        <FieldGroup field="engagement" label="Type of engagement" error={errors.engagement} onFocus={onFocus} onBlur={onBlur}>
          <div className="fm-chips">
            {ENGAGEMENTS.map((x) => (
              <button type="button" key={x} className={`fm-chip ${d.engagement.includes(x) ? "on" : ""}`}
                aria-pressed={d.engagement.includes(x)} onClick={() => toggleIn("engagement", x)}>{x}</button>
            ))}
          </div>
        </FieldGroup>

        <div className="fm-roles">
          {d.roles.map((r, i) => (
            <div className="fm-role" key={i}>
              <div className="fm-role-head mono">
                <span>Role {i + 1}</span>
                {i > 0 && <button type="button" className="fm-x" onClick={() => dropRole(i)} aria-label={`Remove role ${i + 1}`}>Remove</button>}
              </div>
              <div className="fm-two">
                <TextField field={roleKey(i, "title")} label="Role title" value={r.title}
                  onChange={(v) => setRole(i, "title", v)} error={errors[roleKey(i, "title")]}
                  onFocus={onFocus} onBlur={onBlur} placeholder="SDE-1" />
                <TextField field={roleKey(i, "openings")} label="Openings" value={r.openings}
                  type="number" min="1" step="1" inputMode="numeric"
                  onChange={(v) => setRole(i, "openings", v)} error={errors[roleKey(i, "openings")]}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div className="fm-two">
                <TextField field={roleKey(i, "ctc")} label="CTC / stipend" value={r.ctc} optional placeholder="₹12 LPA"
                  onChange={(v) => setRole(i, "ctc", v)} onFocus={() => onFocus(roleKey(i, "title"))} onBlur={onBlur} />
                <TextField field={roleKey(i, "place")} label="Work location" value={r.place} optional placeholder="Bengaluru / remote"
                  onChange={(v) => setRole(i, "place", v)} onFocus={() => onFocus(roleKey(i, "title"))} onBlur={onBlur} />
              </div>
            </div>
          ))}
          {d.roles.length < 5 && <button type="button" className="fm-add mono" onClick={addRole}>+ Add another role</button>}
        </div>
      </Section>

      <Section id="talent" n={4} title="Who you want to hire">
        <FieldGroup field="programmes" label="Schools & programmes" error={errors.programmes} onFocus={onFocus} onBlur={onBlur}
          hint="Headcounts are the published eligible strength for the current cohort.">
          <div className="fm-schools">
            {SCHOOLS.map((s, si) => {
              const keys = s.programmes.map((_, pi) => `${si}:${pi}`);
              const all = keys.every((k) => d.programmes.includes(k));
              return (
                <div className="fm-school" key={s.name}>
                  <div className="fm-school-head">
                    <span className="fm-school-name">{s.name.replace("School of ", "")} <span className="mono">{SCHOOL_ABBR[s.name]}</span></span>
                    <button type="button" className="fm-x" onClick={() =>
                      set("programmes", all ? d.programmes.filter((k) => !keys.includes(k)) : [...new Set([...d.programmes, ...keys])])}>
                      {all ? "Clear" : "All"}
                    </button>
                  </div>
                  <div className="fm-progs">
                    {s.programmes.map((p, pi) => {
                      const k = `${si}:${pi}`;
                      return (
                        <label key={k} className={`fm-prog ${d.programmes.includes(k) ? "on" : ""}`}>
                          <input type="checkbox" checked={d.programmes.includes(k)} onChange={() => toggleIn("programmes", k)} />
                          <span>{p.p}</span><span className="fm-prog-n mono">{p.n}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="fm-pool" aria-live="polite">
            <span className="num">{pool.toLocaleString("en-IN")}</span>
            <span className="mono">eligible students in your selection</span>
          </div>
        </FieldGroup>

        <div className="fm-two">
          <TextField {...bind("cgpa")} label="Minimum CGPA" type="number" step="0.1" min="0" max="10" placeholder="7.0" optional />
          <div className="fm-field" data-field="backlogs">
            <span className="fm-label">Active backlogs</span>
            <label className="fm-switch">
              <input type="checkbox" checked={d.backlogs} onChange={(e) => set("backlogs", e.target.checked)}
                onFocus={() => onFocus("cgpa")} onBlur={onBlur} />
              <span className="fm-switch-track" aria-hidden="true"><span /></span>
              {d.backlogs ? "Permitted" : "Not permitted"}
            </label>
          </div>
        </div>
      </Section>

      <Section id="process" n={5} title="Your selection process">
        <FieldGroup field="stages" label="Stages, in order" error={errors.stages} onFocus={onFocus} onBlur={onBlur}
          hint="Tap to add in the order candidates meet them.">
          <div className="fm-chips">
            {STAGES.filter((s) => !d.stages.includes(s)).map((s) => (
              <button type="button" key={s} className="fm-chip" onClick={() => set("stages", [...d.stages, s])}>+ {s}</button>
            ))}
          </div>
          {d.stages.length > 0 && (
            <ol className="fm-stages">
              {d.stages.map((s, i) => (
                <li key={s} className="fm-stage">
                  <span className="num fm-stage-n">{i + 1}</span>
                  <span className="fm-stage-name">{s}</span>
                  <span className="fm-stage-ctl">
                    <button type="button" onClick={() => moveStage(i, -1)} disabled={i === 0} aria-label={`Move ${s} earlier`}>↑</button>
                    <button type="button" onClick={() => moveStage(i, 1)} disabled={i === d.stages.length - 1} aria-label={`Move ${s} later`}>↓</button>
                    <button type="button" onClick={() => set("stages", d.stages.filter((x) => x !== s))} aria-label={`Remove ${s}`}>×</button>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </FieldGroup>
      </Section>

      <Section id="drive" n={6} title="The drive">
        <div className="fm-two">
          <TextField {...bind("driveDate")} label="Preferred date" type="date" min={todayIso()} />
          <FieldGroup field="mode" label="Mode" error={errors.mode} onFocus={onFocus} onBlur={onBlur}>
            <div className="fm-seg" role="radiogroup">
              {MODES.map((m) => (
                <label key={m} className={`fm-seg-opt ${d.mode === m ? "on" : ""}`}>
                  <input type="radio" name="mode" value={m} checked={d.mode === m} onChange={() => set("mode", m)} />{m}
                </label>
              ))}
            </div>
          </FieldGroup>
        </div>
        <TextField {...bind("jd")} label="Job description link" placeholder="https://…" optional inputMode="url" />
        <TextField {...bind("notes")} label="Anything else CAR should know" as="textarea" rows={3} optional />

        <div className={`fm-field fm-consent ${errors.consent ? "invalid" : ""}`} data-field="consent">
          <label>
            <input type="checkbox" checked={d.consent} onChange={(e) => set("consent", e.target.checked)}
              aria-describedby={errors.consent ? "f-consent-err" : undefined} />
            I confirm these details are accurate and agree to be contacted by RV University's Corporate &amp; Alumni Relations office.
          </label>
          {errors.consent && <span className="fm-err" id="f-consent-err">{errors.consent}</span>}
        </div>
      </Section>

      <div className="fm-submit">
        <button type="submit" className="btn fm-submit-btn" disabled={sending}>
          {sending ? "Sending…" : demo ? "Sign & prepare the letter" : "Sign & send the letter"} <span className="arrow">→</span>
        </button>
        <span className="fm-hint">
          {demo
            ? "Demo site: this prepares your letter but does not send it to CAR. You can email it to them on the next step. Your draft saves in this browser as you type."
            : "Your draft saves in this browser as you type."}
        </span>
      </div>
    </form>
  );
}
