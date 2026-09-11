import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Partners from "./pages/Partners";
import Parents from "./pages/Parents";
import Forms from "./pages/Forms";

export default function App() {
  useSmoothScroll();
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollManager />
      <Atmosphere />
      <Preloader />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
