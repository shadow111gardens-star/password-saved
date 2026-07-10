/*import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ૧. import કરો
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> {/* ૨. App ને BrowserRouter માં wrap કરો }
      <App />
    </BrowserRouter>
  </StrictMode>
);*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ૧. બધા જરૂરી કમ્પોનન્ટ્સ import કરો
import SuccessPage from './SuccessPage';
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ૨. BrowserRouter સૌથી બહાર રાખો */}
    <BrowserRouter>
      <Routes>
        {/* ૩. તમારા બધા પેજીસ અહીં ડિફાઇન કરો */}
        <Route path="/" element={<App />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);