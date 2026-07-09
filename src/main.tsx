import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ૧. import કરો
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> {/* ૨. App ને BrowserRouter માં wrap કરો */}
      <App />
    </BrowserRouter>
  </StrictMode>
);