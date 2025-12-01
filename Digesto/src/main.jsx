import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProviders from "./context/AppProviders";
import Router from "./router";
import "./index.css";


createRoot(document.getElementById("root")).render(
   <StrictMode>
      <AppProviders>
        <Router />
      </AppProviders>
   </StrictMode>
);
