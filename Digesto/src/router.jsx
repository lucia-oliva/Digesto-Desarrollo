import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/layout/Header";
import Prueba from "./pages/Prueba";
import DocumentView  from "./pages/documentView";

// TODO : Agregar rutas y realizar el layout (la sidebar)
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="busqueda" element={<Prueba/>}/>
          <Route path="document/:id" element={<DocumentView/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
