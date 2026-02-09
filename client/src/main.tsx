import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/login/login.page.js';
import DashboardPage from './pages/dashboard/dashboard.page.js';
import axios from 'axios';
import Dashboard from './pages/dashboard/components/dashboard.js';
import POSPage from './pages/pos/pos.page.js';
import ProductsPage from './pages/products/products.page.js';
import InventoryPage from './pages/inventory/inventory.page.js';
import UsersPage from './pages/users/users.page.js';

axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path="dashboard" element={<DashboardPage />}>
                <Route index element={<Dashboard />} />
                <Route path="pos" element={<POSPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="users" element={<UsersPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
