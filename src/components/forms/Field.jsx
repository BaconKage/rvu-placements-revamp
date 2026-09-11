// Label + control + error, wired for aria. `field` is the key shared with the
// letter so focusing here highlights the matching blank there.
export function TextField({ field, label, value, onChange, error, onFocus, onBlur, optional, as = "input", ...rest }) {
  const id = `f-${field}`;
  const Control = as;
  return (
    <div className={`fm-field ${error ? "invalid" : ""}`} data-field={field}>
      <label htmlFor={id} className="fm-label">
        {label}{optional && <span className="fm-opt">optional</span>}
      </label>
      <Control
        id={id}
        className="fm-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocus?.(field)}
        onBlur={() => onBlur?.()}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error && <span className="fm-err" id={`${id}-err`}>{error}</span>}
    </div>
  );
}

// Wrapper for chip groups, checkbox grids and other composite controls.
export function FieldGroup({ field, label, error, hint, children, onFocus, onBlur }) {
  return (
    <fieldset
      className={`fm-field fm-group ${error ? "invalid" : ""}`}
      data-field={field}
      onFocus={() => onFocus?.(field)}
      onBlur={() => onBlur?.()}
      aria-describedby={error ? `f-${field}-err` : undefined}
    >
      <legend className="fm-label">{label}</legend>
      {hint && <span className="fm-hint">{hint}</span>}
      {children}
      {error && <span className="fm-err" id={`f-${field}-err`}>{error}</span>}
    </fieldset>
  );
}
