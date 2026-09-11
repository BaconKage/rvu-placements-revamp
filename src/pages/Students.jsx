import { PageHead, TrainingSection, InternshipsSection, SiteFooter } from "../components/sections/Audience";
import Process from "../components/sections/Process";
import Outcomes from "../components/sections/Outcomes";
import { CONTACT, ELIGIBILITY } from "../data/placements";

// Students — easy access to the placement process, information and resources.
export default function Students() {
  return (
    <main className="aud">
      <PageHead
        kicker="For students"
        title="Your route to a placement."
        hi={[4]}
        lede="Everything you need to take part in campus placements at RV University — who can sit a drive, the training you complete first, how you’re expected to conduct yourself, and where RV students have been hired."
        facts={[
          [String(ELIGIBILITY.length), "conditions to sit a placement drive"],
          ["80%", "minimum attendance in pre-placement training"],
          ["425", "offers facilitated by CAR"],
        ]}
        actions={[
          { href: `mailto:${CONTACT.email}`, label: "Ask CAR a question", primary: true },
          { to: "/", label: "Explore recruiters" },
        ]}
        links={[
          ["#process", "Eligibility"],
          ["#training", "Training & conduct"],
          ["#internships", "Internships"],
          ["#outcomes", "Where students landed"],
          ["#contact", "Contact CAR"],
        ]}
      />
      <Process idx="01" />
      <TrainingSection idx="02" />
      <InternshipsSection idx="03" />
      <Outcomes idx="04" />
      <SiteFooter />
    </main>
  );
}
