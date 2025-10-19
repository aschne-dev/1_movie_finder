import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter wires up history handling for the entire app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
