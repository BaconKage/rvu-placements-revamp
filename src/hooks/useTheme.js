import { useEffect, useState } from "react";

// Explicit light/dark toggle. Defaults to system (no attribute) until the
// visitor chooses, then persists the choice.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("rvu-theme") || "system"; }
    catch { return "system"; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try { localStorage.setItem("rvu-theme", theme); } catch {}
  }, [theme]);

  // The CSS only goes dark on [data-theme="dark"], so "system" renders light.
  // Resolve to what's on screen, otherwise a visitor whose OS is in dark mode
  // needs two clicks the first time (system → light → dark).
  const resolved = theme === "dark" ? "dark" : "light";
  const toggle = () => setTheme(resolved === "dark" ? "light" : "dark");
  return { theme, toggle, resolved };
}
