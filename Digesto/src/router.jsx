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
import ConsejoPage from "./pages/consejo-superior/consejoPage.jsx";
import ConsejoComisiones from "./pages/consejo-superior/ConsejoComisiones.jsx";
import ConsejoIntegrantes from "./pages/consejo-superior/ConsejoIntegrantes.jsx";
import ConsejoNormativas from "./pages/consejo-superior/ConsejoNormativas.jsx";
import ConsejoReglamento from "./pages/consejo-superior/ConsejoReglamento.jsx";
import ConsejoSesiones from "./pages/consejo-superior/ConsejoSesiones.jsx";
import ConsejoInicio from "./pages/consejo-superior/ConsejoInicio.jsx";
import GenericEdit from "./pages/admin/Edit/EditGeneric.jsx";
import AgregarSesion from "./pages/consejo-superior/AgregarSesion.jsx"
import EditarSesion from "./pages/consejo-superior/EditarSesion.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="busqueda" element={<Prueba />} />
          <Route path="document/:id" element={<DocumentView />} />
          <Route path="/consejo-superior" element={<ConsejoPage />}>
            <Route index element={<ConsejoInicio />}/>
            <Route path="normativas" element={<ConsejoNormativas />} />
            <Route path="sesiones" element={<ConsejoSesiones />} />
            <Route path="integrantes" element={<ConsejoIntegrantes />} />
            <Route path="reglamento" element={<ConsejoReglamento />} />
            <Route path="comisiones" element={<ConsejoComisiones />} />
            <Route path="addsesion" element={<AgregarSesion />} />
            <Route path="EditarSesion/:id" element={<EditarSesion />} />
            <Route path="document/:id" element={<DocumentView />} />
          </Route>
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
            <Route path="ListadoAuditoria" element={<VistaAdministrativa />} />
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
            <Route path="EditarUsuario/:id" element={<GenericEdit />} />
            <Route path="EditarDependencia/:id" element={<GenericEdit />} />
            <Route path="EditarEmisor/:id" element={<GenericEdit />} />
            <Route path="EditarNormativa/:id" element={ <GenericEdit /> } />
            <Route path="EditarPalabraClave/:id" element={ <GenericEdit /> } />
            <Route path="document/:id" element={<DocumentView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
