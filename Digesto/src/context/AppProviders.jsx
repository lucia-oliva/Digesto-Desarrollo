import PropTypes from "prop-types";
import { AuthProvider } from "./authProvider";
import ReferenciasProvider from "./ReferenciasProvider";
import { FiltersProvider } from "./FiltersProvider";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ReferenciasProvider>
        <FiltersProvider>{children}</FiltersProvider>
      </ReferenciasProvider>
    </AuthProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
