import { useState } from "react";
import { domainOf } from "../../data/recruiterWall";

// logo: unavatar -> favicon -> monogram
export default function Logo({ co }) {
  const domain = domainOf(co);
  const sources = domain
    ? [`https://unavatar.io/${domain}?fallback=false`, `https://www.google.com/s2/favicons?domain=${domain}&sz=128`]
    : [];
  const [idx, setIdx] = useState(0);
  if (idx >= sources.length) {
    return <span className="rw-mono">{co.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}</span>;
  }
  return (
    <img src={sources[idx]} alt="" draggable="false" loading="lazy" decoding="async"
      onError={() => setIdx((i) => i + 1)} />
  );
}
