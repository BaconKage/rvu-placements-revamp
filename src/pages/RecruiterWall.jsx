import { useEffect } from "react";
import Recruiters from "../components/sections/Recruiters";

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
    </main>
  );
}
