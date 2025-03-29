import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Auth/LoginPage.js";
import { RegisterPage } from "../pages/Auth/RegisterPage.js";
import { ResultPage } from "../pages/ResultPage.js";
import DashboardPage from "@/pages/DashboardPage.js";
import MeasurementPage from "@/pages/MeasurementPage.js";
import { PatientPage } from "@/pages/PatientPage.js";
import { PatientMeasurements } from "@/pages/PatientMeasurementPage.js";
import SettingsPage from "@/pages/SettingsPage.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ResultPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/measurement" element={<MeasurementPage />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/patient-measurement" element={<PatientMeasurements />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
