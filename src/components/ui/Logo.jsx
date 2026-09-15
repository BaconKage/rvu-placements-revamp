import { useState } from "react";
import { domainOf } from "../../data/recruiterWall";
import infosys from "../../assets/logos/infosys.svg";

// companies whose site icon is a crop of the wordmark ("Info"), so both services show it cut off;
// these use the full logo (Infosys: Wikimedia Commons, File:Infosys_logo.svg)
const LOCAL = { Infosys: infosys };

// logo: local full logo -> unavatar -> favicon -> monogram
export default function Logo({ co }) {
  const domain = domainOf(co);
  const sources = [
    ...(LOCAL[co] ? [LOCAL[co]] : []),
    ...(domain ? [`https://unavatar.io/${domain}?fallback=false`, `https://www.google.com/s2/favicons?domain=${domain}&sz=128`] : []),
  ];
  const [idx, setIdx] = useState(0);
  if (idx >= sources.length) {
    return <span className="rw-mono">{co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}</span>;
  }
  return (
    <img src={sources[idx]} alt="" draggable="false" loading="lazy" decoding="async"
      onError={() => setIdx((i) => i + 1)} />
  );
}
