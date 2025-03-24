import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { ResultPage } from "./pages/ResultPage.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ResultPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/measurement" element={<App />} />
        <Route path="/result" element={<LoginPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
