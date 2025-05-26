import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import useAxios from "axios-hooks";
import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function EditarUsuario() {
  const user = useAuth().auth.user;
  const userId = user.id;
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    clave_actual: "",
    clave_nueva: "",
    tipo_usuario_id: "",

  });

  
    const [{ data: usuario2 }] = useAxios({
      url: `http://localhost:3000/api/usuarios/${userId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(usuario2);
    console.log(userId);
    
    
    useEffect(() => {
    if (usuario2) {
      setUsuario((prev) => ({
        ...prev,
        nombre: usuario2[0].nombre || "",
        email: usuario2[0].email || "",
        telefono: usuario2[0].telefono || "",
        tipo_usuario_id: usuario2.tipo_usuario_id || "",
        // clave se deja vacío por seguridad
      }));
    }
  }, [usuario2]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono,
  };

  // Solo enviar claves si el usuario quiere cambiar la contraseña
  if (usuario.clave_actual && usuario.clave_nueva) {
    payload.clave_actual = usuario.clave_actual;
    payload.clave = usuario.clave_nueva;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Usuario actualizado correctamente");
      // Opcional: limpiar campos de contraseña
      setUsuario((prev) => ({
        ...prev,
        clave_actual: "",
        clave_nueva: "",
      }));
    } else {
      alert(data.error || "Error al actualizar usuario");
    }
  } catch (e) {
    alert("Error de red o servidor",e);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">
           <FaUserCircle className="mx-auto text-5xl text-primary mb-4"/>
          Editar Perfil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Nombre completo</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Teléfono</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

           <div>
            <label className="label">
              <span className="label-text">Contraseña actual</span>
            </label>
            <input
              type="password"
              name="clave_actual"
              value={usuario.clave_actual}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="********"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Nueva contraseña</span>
            </label>
            <input
              type="password"
              name="clave_nueva"
              value={usuario.clave_nueva}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="********"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
