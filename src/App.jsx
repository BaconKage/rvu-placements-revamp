import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Atmosphere from "./components/Atmosphere";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import FitSpace from "./pages/FitSpace";
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
        <Route path="/fit" element={<FitSpace />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
