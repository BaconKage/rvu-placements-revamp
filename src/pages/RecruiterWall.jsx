import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Recruiters from "../components/sections/Recruiters";
import "./RecruiterWall.css";

// A short "how to explore" hint over the wall. It appears once the loader has lifted and the
// cards have flown in, then leaves after 5 seconds or at the first scroll, drag, swipe or key.
function WallGuide() {
  const [phase, setPhase] = useState("wait"); // wait -> show -> hide -> done
  const touch = matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (phase !== "wait") return;
    let t;
    const start = () => { t = setTimeout(() => setPhase("show"), 900); };
    if (window.__rvuPreloaded) start();
    else addEventListener("rvu:preloaded", start, { once: true });
    return () => { clearTimeout(t); removeEventListener("rvu:preloaded", start); };
  }, [phase]);

  useEffect(() => {
    if (phase === "hide") {
      const t = setTimeout(() => setPhase("done"), 450); // after the fade-out (also covers reduced motion)
      return () => clearTimeout(t);
    }
    if (phase !== "show") return;
    const hide = () => setPhase("hide");
    const t = setTimeout(hide, 5000);
    const events = ["wheel", "pointerdown", "touchstart", "keydown"];
    events.forEach((ev) => addEventListener(ev, hide, { passive: true }));
    return () => { clearTimeout(t); events.forEach((ev) => removeEventListener(ev, hide, { passive: true })); };
  }, [phase]);

  if (phase === "wait" || phase === "done") return null;
  return (
    <div className={`wall-guide${phase === "hide" ? " is-leaving" : ""}`} role="status">
      <span className="wall-guide-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 7v34M7 24h34" />
          <path d="M18 13l6-6 6 6M18 35l6 6 6-6M13 18l-6 6 6 6M35 18l6 6-6 6" />
        </svg>
      </span>
      <span className="wall-guide-t">{touch ? "Swipe to explore" : "Scroll or drag to explore"}</span>
      <span className="wall-guide-s mono">{touch ? "Tap any card for details" : "Move up, down and across · open any card"}</span>
    </div>
  );
}

// The recruiter wall — one screen, explored by drag and scroll.
export default function RecruiterWall() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-lock");
    return () => root.classList.remove("home-lock");
  }, []);

  return (
    <main className="wall-page">
      <Recruiters />
      <WallGuide />
      {/* for people who'd rather read than explore: the same organisations as a plain list */}
      <Link className="wall-list-btn" to="/recruiters/list">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M5.5 4h8M5.5 8h8M5.5 12h8" /><circle cx="2.5" cy="4" r=".6" /><circle cx="2.5" cy="8" r=".6" /><circle cx="2.5" cy="12" r=".6" />
        </svg>
        View all companies as a list <span className="arrow" aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
