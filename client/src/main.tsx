import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/login/login.page.js';
import Dashboard from './pages/dashboard/dashboard.page.js';

const Router = createBrowserRouter([
    { path: "/login", element: <LoginPage />},
    { path: "/dashboard", element: <Dashboard /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
