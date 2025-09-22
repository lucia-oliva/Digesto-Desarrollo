import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/authProvider";
import Router from "./router";
import "./index.css";
import ReferenciasProvider from "./context/ReferenciasProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ReferenciasProvider>
        <Router />
      </ReferenciasProvider>
    </AuthProvider>
  </StrictMode>
);
