import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/router.tsx";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./components/Themes/Theme.tsx";


createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </StrictMode>,
)
