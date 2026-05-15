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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-base-200 to-base-100">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container mx-auto px-4 py-14 md:py-24">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <FiBookOpen />
                Acerca de
              </span>

              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                El Digesto UNLaR
                </span>{" "}
                es una aplicación web que permite consultar, filtrar y acceder a resoluciones, ordenanzas y convenios de forma simple y rápida.
              </h1>
            
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/busqueda" className="btn btn-primary">
                  <FiSearch className="mr-2" />
                  Búsqueda avanzada
                </Link>
                <Link to="/document/3" className="btn btn-outline">
                  <FiFileText className="mr-2" />
                  Ver un ejemplo
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="src/assets/AcercaDeImage.jpg"
                alt="Mujer buscando documentacion en una estanteria"
                className="w-full max-w-md sm:max-w-lg md:max-w-xl aspect-[4/3] object-cover rounded-3xl shadow-2xl ring-1 ring-black/5"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
          Características del Digesto
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={<FiFileText />}
            title="Acceso a Normativas"
            text="Consulta ordenanzas, resoluciones y convenios. Todo en un solo lugar."
          />
          <Feature
            icon={<FiShield />}
            title="Resguardo Digital"
            text="Conserva documentación normativa con respaldo centralizado."
          />
          <Feature
            icon={<FiSearch />}
            title="Búsqueda Agil"
            text="Filtra por año, emisor y dependencia garantizando la experiencia de usuario."
          />
          <Feature
            icon={<FiUsers />}
            title="Dependencias"
            text="Navega por la documentacion de todas las dependencias de la universidad."
          />
        </div>
      </section>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-base-200 to-base-100 p-6 md:p-10 border border-base-300 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-800">
                  Empieza a consultar normativas ahora
                </h3>
              </div>
              <Link to="/busqueda" className="btn btn-primary btn-lg">
                Abrir búsqueda
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
