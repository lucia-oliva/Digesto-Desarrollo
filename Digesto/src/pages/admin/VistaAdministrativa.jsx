import NormativaTable from "../../components/Table/NormativasTable";
import { useLocation } from "react-router";
import GenericFilterSearch from "../../components/SearchFilter/SearchFilter";
import { useNamespacedFilters } from "../../hooks/useNamespacedFilters";
import { getWithCancel } from "../../api/cancellable";
import {useAuth} from "../../context/useAuth";
function VistaAdministrativa() {
  const location = useLocation();
  const {auth} = useAuth();
  const user = auth?.user;
  const tipoUser = user?.tipo_usuario;
  const depName = user?.dependencia;
  const type = location.pathname.split("/")[2];
  const modo = "admin";

  const { ns, state, setFilters } = useNamespacedFilters({
    scope: "admin",
    type,
    initial: {},
    urlSync: false,
    nsStrategy: "byType",
    persist: false,
    resetOnUnmount: false,
    resetOnNsChange: true,
    onHydrated: (f) => void fetchData(f),
  });

  async function fetchData(filtros) {
    const res = await getWithCancel(ns, "/normativas", { params: filtros });
    if (res?.cancelled) return;
  }

  const handleSearch = (formData) => {
    const next = formData || {};
    setFilters(next);
    fetchData(next);
  };
const isSuperAdmin = tipoUser === "SuperAdministrador";
  const isAdminDependencia = tipoUser === "Administrador de Dependencia";
  const isSupervisor = tipoUser === "Supervisor";

  const lockDependencia =
    !isSuperAdmin &&
    (isAdminDependencia || isSupervisor) &&
    !!depName;

  return (
    <div className="container">
      <GenericFilterSearch
        type={type}
        scope="admin"
        initialState={state.filters}
        autoSearch
        onSearch={handleSearch}
        disabledFields={{
          dependencia: lockDependencia,
        }}
      />
      <NormativaTable type={type} filtros={state.filters} modo={modo} />
    </div>
  );
}

export { VistaAdministrativa };
