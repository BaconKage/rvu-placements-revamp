import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import RecruiterWall from "./pages/RecruiterWall";
// Keep the home and wall ready for their entrance/view-transition effects.
// Load the document pages and form editor only when their route is visited.
const Students = lazy(() => import("./pages/Students"));
const Partners = lazy(() => import("./pages/Partners"));
const Forms = lazy(() => import("./pages/Forms"));

export default function App() {
  useSmoothScroll();
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Atmosphere />
      <Preloader />
      <Nav />
      <Suspense fallback={null}>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recruiters" element={<RecruiterWall />} />
          <Route path="/students" element={<Students />} />
          <Route path="/partners" element={<Partners />} />
          {/* students and parents share one page; old /parents links land there */}
          <Route path="/parents" element={<Navigate to="/students" replace />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
