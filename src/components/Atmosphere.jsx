import { useLocation } from "react-router-dom";
import "./Atmosphere.css";

// A single faint paper grain for the document pages. Skipped on the home wall:
// a full-screen blend layer over moving 3D cards costs a recomposite per frame.
export default function Atmosphere() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return <div className="grain" aria-hidden="true" />;
}
