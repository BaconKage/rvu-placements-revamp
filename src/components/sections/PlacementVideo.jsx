import { useEffect, useRef, useState } from "react";
import poster from "../../assets/placement-office-walkthrough.webp";
import "./PlacementVideo.css";

// RV University's own "Placement Office Walkthrough", the video embedded on rvu.edu.in/placements.
// Until it's pressed the tile is just an image: the YouTube player only loads inside the open dialog.
const VIDEO_ID = "oV5zD2mh40A";

export default function PlacementVideo() {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  // the play button leans toward the pointer while the poster drifts the other way (mouse only)
  const lean = (e) => {
    if (e.pointerType !== "mouse") return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    t.style.setProperty("--px", `${(dx * 14).toFixed(1)}px`);
    t.style.setProperty("--py", `${(dy * 10).toFixed(1)}px`);
  };
  const settle = (e) => {
    e.currentTarget.style.setProperty("--px", "0px");
    e.currentTarget.style.setProperty("--py", "0px");
  };

  // the player opens as a circle growing from where the tile was pressed, like the wall transition
  const play = (e) => {
    const d = dialogRef.current;
    if (!d) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2; // keyboard presses report 0,0: grow from the tile centre
    const y = e.clientY || r.top + r.height / 2;
    d.style.setProperty("--vx", `${x}px`);
    d.style.setProperty("--vy", `${y}px`);
    setOpen(true);
    d.showModal();
    window.__lenis?.stop();
  };
  const close = () => dialogRef.current?.close();

  // Esc, the close button and a click outside all end in the dialog's close event
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      window.__lenis?.start();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className="pv-tile"
        onClick={play}
        onPointerMove={lean}
        onPointerLeave={settle}
        aria-haspopup="dialog"
        aria-label="Play the placement office walkthrough video, 1 minute 15 seconds"
      >
        <span className="pv-media" aria-hidden="true">
          <img src={poster} alt="" width="1280" height="720" loading="lazy" decoding="async" />
        </span>
        <span className="pv-corner tl" aria-hidden="true" />
        <span className="pv-corner br" aria-hidden="true" />
        <span className="pv-chip mono" aria-hidden="true"><i />Inside the CAR office</span>
        <span className="pv-play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5.2v13.6L19 12 8 5.2Z" /></svg>
        </span>
        <span className="pv-cap" aria-hidden="true">
          <span className="pv-k mono">Placement office walkthrough · 1:15</span>
          <span className="pv-t">Take a walk through the office that runs placements.</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="pv-dialog"
        aria-label="RV University placement office walkthrough"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <button type="button" className="pv-close" onClick={close} aria-label="Close video">
          <span aria-hidden="true">×</span>
        </button>
        <div className="pv-frame">
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="RV University placement office walkthrough"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </dialog>
    </>
  );
}
