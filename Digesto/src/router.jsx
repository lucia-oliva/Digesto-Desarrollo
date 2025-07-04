import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/layout/Header";
import Prueba from "./pages/Prueba";
import DocumentView from "./pages/documentView";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import RequireAuth from "./services/RouteGuard";
import Logout from "./pages/auth/Logout";
import EditarUsuario from "./pages/admin/editUser";
import { VistaAdministrativa } from "./pages/admin/VistaAdministrativa";
import GenericCarga from "./pages/admin/Carga/GenericCarga";
import RouteGuard from "./services/RouteGuard";

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

        <Route element={<RouteGuard mode="guest" />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RouteGuard mode="auth" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="logout" element={<Logout />} />
            <Route path="usuario" element={<EditarUsuario />} />
            <Route path="ListadoNormativa" element={<VistaAdministrativa />} />
            <Route path="ListadoUsuarios" element={<VistaAdministrativa />} />
            <Route
              path="ListadoDependencias"
              element={<VistaAdministrativa />}
            />
            <Route path="ListadoEmisores" element={<VistaAdministrativa />} />
            <Route
              path="ListadoPalabrasClave"
              element={<VistaAdministrativa />}
            />
            <Route path="NuevaNormativa" element={<GenericCarga />} />
            <Route path="NuevoUsuario" element={<GenericCarga />} />
            <Route path="NuevaDependencia" element={<GenericCarga />} />
            <Route path="NuevoEmisor" element={<GenericCarga />} />
            <Route path="NuevaPalabraClave" element={<GenericCarga />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
