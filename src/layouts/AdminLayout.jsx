import React, { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";
import { useAuth } from "../context/AuthContext";

// Map pathname to Page Title
const getPageTitle = (pathname) => {
  if (pathname.startsWith("/products/new")) return "Add New Product";
  if (pathname.startsWith("/products/")) return "Product Details";
  if (pathname.startsWith("/products")) return "Products Catalog";
  if (pathname.startsWith("/categories")) return "Categories Management";
  if (pathname.startsWith("/orders/")) return "Order Details";
  if (pathname.startsWith("/orders")) return "Orders & Fulfillment";
  if (pathname.startsWith("/customers/")) return "Customer Profile";
  if (pathname.startsWith("/customers")) return "Customers";
  if (pathname.startsWith("/messages")) return "Messages";
  if (pathname.startsWith("/inventory")) return "Inventory";
  if (pathname.startsWith("/promotions")) return "Promotions";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/settings")) return "Store Settings";
  return "Overview Dashboard";
};

export const AdminLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Persistent / Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} title={pageTitle} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FBFBFB] overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
