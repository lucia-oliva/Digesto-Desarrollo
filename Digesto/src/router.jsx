import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

// TODO : Agregar rutas y realizar el layout (la sidebar)
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
      <Routes>
        <Route path="about" element={<About/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
