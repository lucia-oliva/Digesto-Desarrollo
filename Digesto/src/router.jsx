import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/layout/Header";
import Table from "./components/layout/Table";
import Prueba from "./pages/Prueba";
// TODO : Agregar rutas y realizar el layout (la sidebar)
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="tabla" element={<Prueba/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
