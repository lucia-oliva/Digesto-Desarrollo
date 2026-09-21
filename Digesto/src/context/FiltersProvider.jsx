import PropTypes from "prop-types";
import { useMemo, useReducer } from "react";
import { FiltersContext } from "./filtersContext";

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const { ns, filters } = action;
      return { ...state, [ns]: { filters, version: 0 } };
    }
    case "SET": {
      const { ns, filters } = action;
      const curr = state[ns] || { filters: {}, version: 0 };
      return { ...state, [ns]: { filters, version: curr.version + 1 } };
    }
    case "RESET": {
      const { ns } = action;
      const next = { ...state };
      delete next[ns];
      return next;
    }
    default:
      return state;
  }
}

export function FiltersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {});
  const api = useMemo(
    () => ({
      init(ns, filters = {}) {
        dispatch({ type: "INIT", ns, filters });
      },
      set(ns, filters = {}) {
        dispatch({ type: "SET", ns, filters });
      },
      reset(ns) {
        dispatch({ type: "RESET", ns });
      },
      get(ns) {
        return state[ns] || { filters: {}, version: 0 };
      },
    }),
    [state]
  );

  return (
    <FiltersContext.Provider value={api}>{children}</FiltersContext.Provider>
  );
}

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
