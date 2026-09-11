import { useEffect } from "react";
import Recruiters from "../components/sections/Recruiters";

// The home is the recruiter wall — one screen, explored by drag and scroll.
// Everything else lives on the audience pages it links to.
export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-lock");
    return () => root.classList.remove("home-lock");
  }, []);

  return (
    <main className="home">
      <Recruiters />
    </main>
  );
}
