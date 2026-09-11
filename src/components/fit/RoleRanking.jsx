import { profileColour } from "../../lib/fitModel";

export default function RoleRanking({ ranked, selectedId, c0, onSelect }) {
  return (
    <ol className="fs-rank">
      {ranked.map(({ role, C, floorsOk }, i) => {
        const clears = C >= c0 && floorsOk;
        return (
          <li key={role.id}>
            <button
              type="button"
              className={`fs-rank-row ${role.id === selectedId ? "on" : ""}`}
              onClick={() => onSelect(role.id)}
              aria-pressed={role.id === selectedId}
            >
              <span className="fs-rank-n num">{String(i + 1).padStart(2, "0")}</span>
              <span className="fs-rank-chip" style={{ background: profileColour(role.need) }} aria-hidden="true" />
              <span className="fs-rank-name">
                <span className="serif">{role.name}</span>
                <span className="fs-rank-cos">
                  {role.recruiters.slice(0, 4).join(" · ") || "—"}
                </span>
              </span>
              <span className="fs-rank-bar" aria-hidden="true">
                <span className="fs-rank-fill" style={{ width: `${C * 100}%` }} />
                <span className="fs-rank-c0" style={{ left: `${c0 * 100}%` }} />
              </span>
              <span className="fs-rank-c">{C.toFixed(2)}</span>
              <span className={`fs-rank-flag ${clears ? "ok" : floorsOk ? "near" : "no"}`}>
                {clears ? "clears" : floorsOk ? "below C₀" : "under floor"}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
