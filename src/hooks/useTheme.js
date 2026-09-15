import { useEffect, useState } from "react";

// Explicit light/dark toggle. Every visit starts in light; a switch to dark lasts
// for that visit only (sessionStorage), so a new visit is light again.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      localStorage.removeItem("rvu-theme"); // older builds remembered the theme across visits
      return sessionStorage.getItem("rvu-theme") || "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { sessionStorage.setItem("rvu-theme", theme); } catch {}
  }, [theme]);

  // The CSS only goes dark on [data-theme="dark"], so "system" renders light.
  // Resolve to what's on screen, otherwise a visitor whose OS is in dark mode
  // needs two clicks the first time (system → light → dark).
  const resolved = theme === "dark" ? "dark" : "light";
  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");
  return { theme, toggle, resolved };
}
