import { Link } from "react-router";
import {
  FiSearch,
  FiFileText,
  FiShield,
  FiZap,
  FiBookOpen,
  FiUsers,
} from "react-icons/fi";

function About() {
  return (
    <div className="bg-base-100">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-base-200 to-base-100">
        {/* adornos suaves */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container mx-auto px-4 py-14 md:py-24">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10">
            {/* texto */}
            <div className="w-full md:w-1/2 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <FiBookOpen />
                Acerca de
              </span>

              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Digesto
                </span>{" "}
                ayuda a los administrativos a gestionar y revisar las
                normativas de la institución.
              </h1>

              <p className="mt-4 text-base md:text-lg text-slate-700">
                Una aplicación web para consultar, filtrar y resguardar
                resoluciones, ordenanzas, actas y convenios de forma simple y
                rápida.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/busqueda" className="btn btn-primary">
                  <FiSearch className="mr-2" />
                  Búsqueda avanzada
                </Link>
                <Link to="/document/1" className="btn btn-outline">
                  <FiFileText className="mr-2" />
                  Ver un ejemplo
                </Link>
              </div>
            </div>

            {/* imagen – grande en mobile, mitad en desktop */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="https://www.cellmark.com/wp-content/uploads/2019/10/office-papers.jpg"
                alt="Gestión de documentos"
                className="w-full max-w-md sm:max-w-lg md:max-w-xl aspect-[4/3] object-cover rounded-3xl shadow-2xl ring-1 ring-black/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
          Características de Digesto
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={<FiFileText />}
            title="Acceso a Normativas"
            text="Consultá Ordenanzas, Resoluciones y Actas. Todo en un solo lugar."
          />
          <Feature
            icon={<FiShield />}
            title="Resguardo Digital"
            text="Conserva y consulta documentación histórica con respaldo centralizado."
          />
          <Feature
            icon={<FiSearch />}
            title="Búsqueda Inteligente"
            text="Filtros por año, emisor y dependencia para encontrar en segundos."
          />
          <Feature
            icon={<FiZap />}
            title="Interfaz ágil"
            text="Diseñada para uso cotidiano, clara y sin vueltas."
          />
          <Feature
            icon={<FiUsers />}
            title="Dependencias"
            text="Navegá por facultades y sedes con accesos rápidos."
          />
          <Feature
            icon={<FiBookOpen />}
            title="Convenios"
            text="Consulta acuerdos y convenios institucionales de forma simple."
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-base-200 to-base-100 p-6 md:p-10 border border-base-300 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                  Empezá a consultar normativas ahora
                </h3>
                <p className="text-slate-600">
                  Búsqueda rápida por dependencia, emisor, año y otros filtros.
                </p>
              </div>
              <Link to="/busqueda" className="btn btn-primary btn-lg">
                Abrir Búsqueda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-gradient-to-br from-white to-base-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="text-lg">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}

export default About;
