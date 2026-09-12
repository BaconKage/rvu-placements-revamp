import { PageHead, TrainingSection, InternshipsSection, SectorsSection, GovernanceSection, SiteFooter } from "../components/sections/Audience";
import Process from "../components/sections/Process";
import Record from "../components/sections/Record";
import Cohort from "../components/sections/Cohort";
import { RecruiterPeek } from "../components/sections/Outcomes";
import { CONTACT, ELIGIBILITY } from "../data/placements";

// Students & parents — one path: the placement process and resources students
// need, followed by the numbers, recruiters and governance parents look for.
export default function Students() {
  return (
    <main className="aud">
      <PageHead
        kicker="For students & parents"
        title="Your route to a placement."
        hi={[4]}
        lede="RV University brings the RV Group’s legacy to six schools in Bengaluru, from engineering and business to design, law and film. Its placement office connects 1,600+ graduates with 50+ recruiters on campus. Here’s how students get there, and what parents should know."
        facts={[
          [String(ELIGIBILITY.length), "conditions to sit a placement drive"],
          ["80%", "minimum attendance in pre-placement training"],
          ["425+", "offers facilitated by CAR"],
        ]}
        actions={[
          { href: `mailto:${CONTACT.email}`, label: "Ask CAR a question", primary: true },
          { to: "/recruiters", label: "Explore recruiters" },
        ]}
        links={[
          ["#process", "Eligibility"],
          ["#training", "Training & conduct"],
          ["#internships", "Internships"],
          ["#record", "The numbers"],
          ["#sectors", "Recruiters"],
          ["#cohort", "Who is eligible"],
          ["#governance", "Governance & support"],
          ["#contact", "Contact CAR"],
        ]}
      />
      <Process idx="01" />
      <TrainingSection idx="02" />
      <InternshipsSection idx="03" />
      <Record idx="04" />
      <SectorsSection idx="05" title="Who recruits from RV University." hi={[3, 4]} peek={<RecruiterPeek />} />
      <Cohort idx="06" />
      <GovernanceSection idx="07" />
      <SiteFooter />
    </main>
  );
}
