import { useReveal } from "../../hooks/useReveal";

// Splits text into words, each masked and rising on the nk expo ease. `hi` is a
// Set of word indices to render in brass italic. Reveals on scroll — or on load
// when already in view (the hero showpiece).
export default function Words({ text, as: Tag = "span", className = "", delay = 0, hi }) {
  const ref = useReveal({ threshold: 0.35 });
  const parts = text.split(" ");
  return (
    <Tag ref={ref} className={`words ${className}`} style={{ "--d": `${delay}ms` }}>
      {parts.map((w, i) => (
        <span className="w" key={i} style={{ "--i": i }}>
          <span className={hi?.has(i) ? "w-hi" : ""}>{w}{i < parts.length - 1 ? " " : ""}</span>
        </span>
      ))}
    </Tag>
  );
}
