import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/layout/Header";
import Prueba from "./pages/Prueba";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="busqueda" element={<Prueba/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
