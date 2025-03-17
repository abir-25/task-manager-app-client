import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import NiceModal from "@ebay/nice-modal-react";
import "./index.css";
import { appQueryClient } from "./lib/reactQueryClient";
import { Routes } from "./routes/Routes";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={appQueryClient}>
      <NiceModal.Provider>
        <Routes />
      </NiceModal.Provider>
      <ToastContainer position="top-right" style={{ zIndex: 99999 }} />
    </QueryClientProvider>
  </StrictMode>
);
