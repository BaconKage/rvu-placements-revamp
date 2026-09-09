import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/sections/Hero";
import Record from "./components/sections/Record";
import WhyRecruit from "./components/sections/WhyRecruit";
import Cohort from "./components/sections/Cohort";
import Spread from "./components/sections/Spread";
import Process from "./components/sections/Process";
import Recruit from "./components/sections/Recruit";

export default function App() {
  useSmoothScroll();
  return (
    <>
      <Atmosphere />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Record />
        <WhyRecruit />
        <Cohort />
        <Spread />
        <Process />
        <Recruit />
      </main>
    </>
  );
}
