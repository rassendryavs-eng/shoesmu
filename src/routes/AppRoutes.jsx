import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import DashboardPage from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductCreatePage from "../pages/ProductCreatePage";
import CategoriesPage from "../pages/CategoriesPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import CustomersPage from "../pages/CustomersPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import InventoryPage from "../pages/InventoryPage";
import MessagesPage from "../pages/MessagesPage";
import PromotionsPage from "../pages/PromotionsPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Root Redirects to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
      </Route>

      {/* Authenticated Admin Console Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
