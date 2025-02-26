import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

// TODO : Agregar rutas y realizar el layout (la sidebar)
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
