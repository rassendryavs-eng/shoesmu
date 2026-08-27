import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import clsx from "clsx";

export const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "Low" | "Healthy"
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Stock Adjustment Handler (Increment / Decrement)
  const handleAdjustStock = async (product, delta) => {
    const currentStock = product.stockLeft ?? product.stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    const isLow = newStock <= 10;
    const updatedProduct = {
      ...product,
      stockLeft: newStock,
      stock: newStock,
      isLowStock: isLow,
    };

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? updatedProduct : p))
    );

    try {
      await api.saveProduct(updatedProduct);
    } catch (err) {
      console.error("Failed to save stock update:", err);
      showToast("Error updating stock");
      loadProducts();
    }
  };

  // Metrics Calculations
  const totalUnits = products.reduce(
    (sum, p) => sum + (p.stockLeft ?? p.stock ?? 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => (p.stockLeft ?? p.stock ?? 0) <= 10
  ).length;
  const healthyCount = products.filter(
    (p) => (p.stockLeft ?? p.stock ?? 0) > 10
  ).length;

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const stock = p.stockLeft ?? p.stock ?? 0;
    const isLow = stock <= 10;

    // Filter tab
    if (activeFilter === "Low" && !isLow) return false;
    if (activeFilter === "Healthy" && isLow) return false;

    // Search query
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans text-ink pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-[13px] font-bold">{toastMessage}</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PAGE TITLE & SUBTITLE                                                  */}
      {/* ========================================================================= */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-ink tracking-tight">
          Inventory
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1">
          {totalUnits} units across {products.length} SKUs
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE-COLUMN KPI CARD (Total Units | Low-Stock | Healthy)              */}
      {/* ========================================================================= */}
      <div className="bg-white border border-gray-200/90 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 shadow-2xs overflow-hidden">
        {/* Total Units */}
        <div className="p-5 sm:p-6 space-y-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            TOTAL UNITS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-black block tracking-tight">
            {totalUnits}
          </span>
        </div>

        {/* Low-Stock SKUs */}
        <div className="p-5 sm:p-6 space-y-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            LOW-STOCK SKUS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#D92D21] block tracking-tight">
            {lowStockCount}
          </span>
        </div>

        {/* Healthy SKUs */}
        <div className="p-5 sm:p-6 space-y-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            HEALTHY SKUS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#079455] block tracking-tight">
            {healthyCount}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STOCK LEVELS TABLE CONTAINER                                           */}
      {/* ========================================================================= */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
        
        {/* Header Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              Stock levels
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Increase or decrease inventory per SKU.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {["All", "Low", "Healthy"].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={clsx(
                    "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-black text-white shadow-2xs font-bold"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search SKU Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU..."
            className="w-full sm:max-w-xs bg-gray-50/90 border border-gray-200/70 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black outline-none transition-all"
          />
        </div>

        {/* Inventory SKUs Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-black mb-2.5" />
              <p className="text-xs font-semibold">Loading inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-14 text-center text-gray-400 space-y-1">
              <p className="text-sm font-bold text-gray-700">No SKUs found</p>
              <p className="text-xs">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1 font-semibold w-[38%]">PRODUCT</th>
                  <th className="pb-3 px-6 font-semibold w-[32%]">STOCK</th>
                  <th className="pb-3 px-4 font-semibold w-[15%] text-center">STATUS</th>
                  <th className="pb-3 pr-1 text-right font-semibold w-[15%]">ADJUST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/90 text-xs font-sans">
                {filteredProducts.map((prod) => {
                  const stock = prod.stockLeft ?? prod.stock ?? 0;
                  const total = prod.stockTotal || 100;
                  const isLow = stock <= 10;
                  const percent = Math.min(100, Math.max(3, (stock / total) * 100));

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Product Name & SKU */}
                      <td className="py-4 pl-1 pr-4 align-middle">
                        <div className="min-w-0">
                          <p className="font-bold text-[13.5px] text-gray-900 leading-snug truncate">
                            {prod.name}
                          </p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                            {prod.sku} · {prod.brand}
                          </p>
                        </div>
                      </td>

                      {/* Stock Bar & Counter */}
                      <td className="py-4 px-6 align-middle">
                        <div className="space-y-1.5 max-w-[260px]">
                          {/* Progress Bar Container */}
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={clsx(
                                "h-full rounded-full transition-all duration-300",
                                isLow ? "bg-[#D92D21]" : "bg-black"
                              )}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          {/* Stock Subtext */}
                          <div className="flex items-center justify-between text-[11.5px] leading-none">
                            <span
                              className={clsx(
                                "font-medium",
                                isLow ? "text-[#D92D21] font-semibold" : "text-gray-500"
                              )}
                            >
                              {stock} left
                            </span>
                            <span
                              className={clsx(
                                "font-normal",
                                isLow
                                  ? "text-[#D92D21] font-semibold"
                                  : "text-gray-400"
                              )}
                            >
                              {isLow ? "Low stock" : `of ${total}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge (Centered) */}
                      <td className="py-4 px-4 align-middle text-center">
                        <div className="flex items-center justify-center">
                          {isLow ? (
                            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
                              Low
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF]">
                              Healthy
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Adjust Stepper (− count +) */}
                      <td className="py-4 pr-1 pl-4 align-middle text-right">
                        <div className="inline-flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(prod, -1)}
                            disabled={stock <= 0}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-sm transition-colors rounded hover:bg-gray-100 active:scale-90 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Decrease Stock"
                          >
                            −
                          </button>

                          <span className="font-bold text-xs sm:text-[13px] text-gray-900 min-w-[20px] text-center select-none">
                            {stock}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAdjustStock(prod, 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-sm transition-colors rounded hover:bg-gray-100 active:scale-90 cursor-pointer"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
