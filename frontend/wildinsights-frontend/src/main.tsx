import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./components/Themes/Theme.tsx";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
