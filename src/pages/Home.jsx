import Hero from "../components/sections/Hero";
import Recruiters from "../components/sections/Recruiters";
import Cohort from "../components/sections/Cohort";
import Process from "../components/sections/Process";
import FitTeaser from "../components/sections/FitTeaser";
import WhyRecruit from "../components/sections/WhyRecruit";
import Recruit from "../components/sections/Recruit";

export default function Home() {
  return (
    <main>
      <Hero />
      <Recruiters />
      <Cohort />
      <Process />
      <FitTeaser />
      <WhyRecruit />
      <Recruit />
    </main>
  );
}
