import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "@/lib/amplify-config.ts";
import "@aws-amplify/ui-react/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
