import { AuthProvider } from "./authProvider";
import ReferenciasProvider from "./ReferenciasProvider";
import { FiltersProvider } from "./FiltersContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ReferenciasProvider>
        <FiltersProvider>{children}</FiltersProvider>
      </ReferenciasProvider>
    </AuthProvider>
  );
}
