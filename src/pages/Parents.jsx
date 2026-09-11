import { PageHead, SectorsSection, GovernanceSection, SiteFooter } from "../components/sections/Audience";
import Record from "../components/sections/Record";
import Cohort from "../components/sections/Cohort";
import Outcomes from "../components/sections/Outcomes";
import { COHORT_TOTAL } from "../data/placements";

// Parents — clear, meaningful insight into the placement ecosystem.
export default function Parents() {
  return (
    <main className="aud">
      <PageHead
        kicker="For parents"
        title="A clear view of placements."
        hi={[4]}
        lede="How placements work at RV University: what the numbers say, who recruits, which students are eligible, and how the process is governed and supported."
        facts={[
          ["425", "offers facilitated by CAR"],
          ["25%", "of students held more than one offer"],
          [COHORT_TOTAL.toLocaleString("en-IN"), "students eligible across 6 schools"],
        ]}
        actions={[{ to: "/recruiters", label: "See who recruits", primary: true }]}
        links={[
          ["#record", "The numbers"],
          ["#sectors", "Recruiters"],
          ["#cohort", "Who is eligible"],
          ["#governance", "Governance & support"],
          ["#outcomes", "Outcomes"],
          ["#contact", "Contact"],
        ]}
      />
      <Record idx="01" />
      <SectorsSection idx="02" />
      <Cohort idx="03" />
      <GovernanceSection idx="04" />
      <Outcomes idx="05" />
      <SiteFooter />
    </main>
  );
}
