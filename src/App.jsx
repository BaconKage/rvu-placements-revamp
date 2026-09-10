import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/sections/Hero";
import Recruiters from "./components/sections/Recruiters";
import Outcomes from "./components/sections/Outcomes";
import Cohort from "./components/sections/Cohort";
import Process from "./components/sections/Process";
import WhyRecruit from "./components/sections/WhyRecruit";
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
        <Recruiters />
        <Outcomes />
        <Cohort />
        <Process />
        <WhyRecruit />
        <Recruit />
      </main>
    </>
  );
}
