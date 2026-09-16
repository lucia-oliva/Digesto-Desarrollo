import { useContext } from "react";
import { FiltersContext } from "../context/filtersContext";

export function useFiltersContext() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFiltersContext must be used within FiltersProvider");
  }

  return context;
}
