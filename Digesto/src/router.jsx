import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/layout/Header";
import Prueba from "./pages/Prueba";
import DocumentView from "./pages/documentView";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import RequireAuth from "./services/RequireAuth";
import Logout from "./pages/auth/Logout";
import EditarUsuario from "./pages/admin/editUser"
import PaginaPruebaLogin from "./pages/PaginaPruebaLogin";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="busqueda" element={<Prueba />} />
          <Route path="document/:id" element={<DocumentView />} />
        </Route>
        <Route path="login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="logout" element={<Logout />} />
            <Route path="usuario" element={<EditarUsuario />} />
            <Route path="test" element={<PaginaPruebaLogin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
