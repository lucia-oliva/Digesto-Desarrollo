import { useEffect, useRef, useState } from "react";
import useAxios from "axios-hooks";
import PropTypes from "prop-types";
import { API_BASE } from "../../api/axiosPrivate";

function TagFilterHero({ value, onSearch, onClear }) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [{ data, loading }] = useAxios(`${API_BASE}/tag/tags`);
  const tags = data?.tags ?? [];

  // Mantener sincronizado si el padre cambia value (por urlSync, etc.)
  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);

    if (v.trim().length >= 2) {
      const filtered = tags.filter((t) =>
        t.nombre.toLowerCase().includes(v.toLowerCase()),
      );
      setFilteredOptions(filtered.slice(0, 10));
    } else {
      setFilteredOptions([]);
    }
    setIsListVisible(true);
  };

  const doSearch = (v) => {
    const next = (v ?? "").trim();
    onSearch(next);
    setIsListVisible(false);
  };

  const handleSelect = (tag) => {
    setInputValue(tag.nombre);
    doSearch(tag.nombre);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Si hay sugerencias, usa la primera (más rápido)
      if (filteredOptions.length > 0) return handleSelect(filteredOptions[0]);
      doSearch(inputValue);
    }
    if (e.key === "Escape") setIsListVisible(false);
  };

  const handleClickOutside = (e) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      listRef.current &&
      !listRef.current.contains(e.target)
    ) {
      setIsListVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* “Toolbar” destacada */}
      <div className="w-full rounded-xl border border-base-300 bg-base-200/70 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          {/* Texto guía (protagonismo) */}
          <div className="flex-1">
            <div className="text-sm font-semibold opacity-80"></div>
            <div className="text-lg font-bold leading-tight">
              Buscar por TAGS
            </div>
            <div className="text-xs opacity-60">Escribe 2+ letras.</div>
          </div>

          <div className="w-full sm:w-[520px]">
            <label className="input input-bordered input-lg flex items-center gap-3 w-full">
              <span className="text-lg">🏷️</span>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsListVisible(true)}
                onKeyDown={handleKeyDown}
                placeholder="Ej: resolucion, becas, carrera…"
                className="grow text-base-content placeholder:text-base-content/50"
              />

              {loading ? (
                <span className="loading loading-spinner loading-sm opacity-70" />
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => doSearch(inputValue)}
                  disabled={inputValue.trim() === ""}
                  title="Buscar"
                >
                  Buscar
                </button>
              )}

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setInputValue("");
                  setFilteredOptions([]);
                  setIsListVisible(false);
                  onClear?.();
                  onSearch("");
                  inputRef.current?.focus();
                }}
                disabled={inputValue.trim() === ""}
                title="Limpiar"
              >
                Limpiar
              </button>
            </label>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isListVisible && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          className="menu mt-2 w-full sm:w-[520px] sm:ml-auto rounded-box bg-base-100 border border-base-300 shadow-lg absolute z-50 max-h-72 overflow-auto"
        >
          {filteredOptions.map((tag) => (
            <li key={tag.id}>
              <button type="button" onClick={() => handleSelect(tag)}>
                {tag.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

TagFilterHero.propTypes = {
  value: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func,
};

export default TagFilterHero;
