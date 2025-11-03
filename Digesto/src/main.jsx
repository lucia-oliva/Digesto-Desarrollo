import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProviders from "./context/AppProviders";
import Router from "./router";
import "./index.css";
import {Worker} from "@react-pdf-viewer/core";

createRoot(document.getElementById("root")).render(
   <StrictMode>
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <AppProviders>
        <Router />
      </AppProviders>
    </Worker>
   </StrictMode>
);
