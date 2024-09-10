import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/router.tsx"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
