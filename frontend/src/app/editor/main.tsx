'use client';

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./page";
import "../../styles/globals_vite.css";
import "../../styles/index.css";
import { ThemeProvider } from "../../components/player/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
