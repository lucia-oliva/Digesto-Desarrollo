import {renderResumen} from "./ResumeRender";

export const normativaColumns = [
  { key: "fecha", label: "Fecha",className:"text-center text-gray-700 font-[Raleway] text-md sm:text-sm" },
  { key: "titulo", label: "Título",className:"text-center text-gray-700 font-[Raleway]  text-md sm:text-md " },
  { key: "dependencia", label: "Dependencia",className:"text-center text-gray-700 font-[Raleway] text-lg sm:text-md" },
  { key: "tipo_normativa", label: "Tipo",className:"text-center text-gray-700 font-[Raleway] text-lg sm:text-md" },
   {
    key: "resumen",
    label: "Resumen",
    className: "text-left font-[Raleway] text-gray-700 text-md max-w-[300px]",
    render: renderResumen,
  },
  { key: "visitas", label: "Visitas",className:"text-center text-gray-700 font-[Raleway] text-lg sm:text-md" },
];

export const usuarioColumns = [
  { key: "nombre", label: "Nombre",className:"text-center font-[Raleway] text-gray-700  text-md sm:text-md" },
  { key: "email", label: "Email",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
  { key: "rol", label: "Rol",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
  { key: "estado", label: "Estado",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
];

export const depenColumns = [
  { key: "nombre", label: "Nombre",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
  { key: "estado", label: "Estado",className:"text-center font-[Raleway] text-gray-700  text-md sm:text-md" },
]

export const emisorColumns = [
  { key: "nombre", label: "Nombre",className:"text-center font-[Raleway] text-gray-700  text-md sm:text-md" },
  { key: "estado", label: "Estado",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
]

export const tagsColumns = [
  { key: "id", label: "ID",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
  { key: "nombre", label: "Nombre",className:"text-center font-[Raleway] text-gray-700  text-md sm:text-md" },
  { key: "cantidad_usos", label: "Cantidad de Usos",className:"text-center font-[Raleway] text-gray-700 text-md sm:text-md" },
]

export const sesionesColumns = [
  { key: "fecha_sesion", label: "Fecha", className: "text-center font-[Raleway] text-gray-700 text-md" },
  { key: "nombre_orden", label: "Orden del Día", className: "text-center font-[Raleway] text-gray-700 text-md" },
  { key: "nombre_acta", label: "Acta", className: "text-center font-[Raleway] text-gray-700 text-md" },
];

export const auditoriaColums = [
{key: "fecha", label: "Fecha", className: "text-center font-[Raleway] text-gray-700 text-md"},
{key: "tipo", label: "Accion", className: "text-center font-[Raleway] text-gray-700 text-md"},
{key: "numero_normativa", label: "Numero", className: "font-[Raleway] text-gray-700 text-md"},
{key: "titulo_normativa", label: "Titulo", className: "font-[Raleway] text-gray-700 text-md"},
{key: "nombre_usuario", label: "Usuario", className: "font-[Raleway] text-gray-700 text-md"},
{key: "email", label: "Email", className: "font-[Raleway] text-gray-700 text-md"},
{key: "nombre_dependencia", label: "Dependencia", className: "font-[Raleway] text-gray-700 text-md"},
]


