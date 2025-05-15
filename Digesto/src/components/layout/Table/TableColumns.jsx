//Este componente maneja el contexto de Table segun las rutas y modifca las columnas.
import { useTableContext } from "./useTableContext";

function TableColumns() {
  const { ocultarVisitas, isNuevaNormativa, isAdminList } = useTableContext();

  return (
    <thead>
      <tr className="bg-primary text-white">
        <th className="py-4">Número</th>
        <th className="py-4">Título</th>
        <th className="py-4">Fecha</th>
        <th className="py-4">Dependencia</th>
        <th className="py-4">Emisor</th>
        <th className="py-4">Tipo</th>
        {!ocultarVisitas && <th className="py-4">Visitas</th>}
        <th className="py-4">
          {isNuevaNormativa ? "Seleccionar" : isAdminList ? "Acciones" : "Archivo PDF"}
        </th>
      </tr>
    </thead>
  );
}

export default TableColumns;
