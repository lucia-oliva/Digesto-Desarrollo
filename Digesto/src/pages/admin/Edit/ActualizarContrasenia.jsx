// components/Usuarios/ActualizarContrasenia.jsx
import PropTypes from "prop-types";

export default function ActualizarContrasenia({ formData, setFormData, errores = {} }) {
  const active = !!formData?._passwordEdited;

  const toggle = () => {
    setFormData(prev => ({
      ...prev,
      _passwordEdited: !prev?._passwordEdited,
      password: "",
      confirmPassword: ""
    }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card bg-base-200/70 border border-base-300/60 mb-3">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Contraseña</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={toggle}>
            {active ? "Cancelar cambio" : "Actualizar contraseña"}
          </button>
        </div>

        {active && (
          <div className="grid gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
                value={formData.password ?? ""}
                onChange={onChange}
                aria-invalid={!!errores.password}
              />
              {errores.password && <p className="text-error text-sm mt-1">{errores.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
                value={formData.confirmPassword ?? ""}
                onChange={onChange}
                aria-invalid={!!errores.confirmPassword}
              />
              {errores.confirmPassword && <p className="text-error text-sm mt-1">{errores.confirmPassword}</p>}
            </div>

            <p className="text-xs opacity-70">
              Si no cambiás la contraseña, se conservará la actual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

ActualizarContrasenia.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errores: PropTypes.object,
};
