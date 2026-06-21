import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import "./assets/css/responsive.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
