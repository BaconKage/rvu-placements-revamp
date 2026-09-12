import { PageHead, EngageSection, SectorsSection, SiteFooter } from "../components/sections/Audience";
import WhyRecruit from "../components/sections/WhyRecruit";
import Cohort from "../components/sections/Cohort";
import Recruit from "../components/sections/Recruit";
import { COPY, CONTACT } from "../data/placements";
import buildingColour from "../assets/rvu-building-colour.webp";
import buildingDark from "../assets/rvu-building-dark.webp";

// Corporate partners — efficient interaction, engagement and relevant information.
export default function Partners() {
  return (
    <main className="aud">
      <PageHead
        kicker="For corporate partners"
        title="Hire from RV University."
        hi={[2, 3]}
        lede={COPY.carIntro}
        bg={buildingColour}
        bgDark={buildingDark}
        facts={[
          ["1,600+", "industry-ready graduates"],
          ["17", "programmes across 6 schools"],
          ["50+", "recruiters on campus"],
        ]}
        actions={[
          { to: "/forms", label: "Register to recruit", primary: true },
          { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
        ]}
        links={[
          ["#why", "Why RV University"],
          ["#cohort", "Talent pool"],
          ["#engage", "How to engage"],
          ["#sectors", "Current recruiters"],
          ["#recruit", "Contact"],
        ]}
      />
      <WhyRecruit idx="01" />
      <Cohort idx="02" />
      <EngageSection idx="03" />
      <SectorsSection idx="04" title="Organisations already recruiting here." hi={[2]} />
      <Recruit />
      <SiteFooter contact={false} />
    </main>
  );
}
