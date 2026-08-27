import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Download,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import useProducts from "../hooks/useProducts";
import api from "../services/api";
import { formatNumber } from "../config/constants";

export const ProductsPage = () => {
  const { products, loading, refresh } = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter products by status & search term
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || p.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const activeCount = products.filter(
    (p) => p.status?.toLowerCase() === "active"
  ).length;

  // Handle Export Products Catalog to CSV
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dateStr = new Date().toISOString().split("T")[0];
      let csv = "data:text/csv;charset=utf-8,";
      csv += "SKU,Product Name,Brand,Category,Price ($),Stock Left,Stock Total,Status\r\n";

      products.forEach((p) => {
        csv += `"${p.sku || p.id}","${p.name}","${p.brand || 'Nike'}","${p.category || 'Sneakers'}",${p.price},${p.stockLeft || p.stock || 0},${p.stockTotal || 100},"${p.status || 'Active'}"\r\n`;
      });

      const encodedUri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `shoesmu_products_catalog_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      showToast("Products catalog exported successfully!");
    }, 400);
  };

  // Handle Edit Product Submission
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setActionLoading(true);
    try {
      await api.saveProduct(editingProduct);
      await refresh();
      setEditingProduct(null);
      showToast(`Product "${editingProduct.name}" updated successfully!`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Product Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      await api.deleteProduct(deletingProduct.id);
      await refresh();
      const deletedName = deletingProduct.name;
      setDeletingProduct(null);
      showToast(`Product "${deletedName}" removed from catalog.`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status = "Active") => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "archived":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 font-sans text-ink pb-12 relative">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-extrabold text-xs shrink-0">
            ✓
          </div>
          <div>
            <p className="text-[13px] font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER: Title, SKU Count & Actions (Export / Add product)                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-ink tracking-tight">
            Products
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-0.5">
            {products.length} SKUs in catalog · {activeCount} active
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 active:scale-95 text-[13px] font-medium text-ink transition-all bg-white shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-gray-600" />
            )}
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </button>

          <Link
            to="/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 active:scale-95 text-white text-[13px] font-medium transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add product</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATALOG CONTAINER: Filter Pills, Search Bar & Products Table             */}
      {/* ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
        {/* Card Header & Filter Status Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-bold text-ink">Catalog</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Filter, edit, or remove SKUs.
            </p>
          </div>

          {/* Status Tabs: All, Active, Draft, Archived */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-full text-xs self-start sm:self-auto">
            {["All", "Active", "Draft", "Archived"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, brand, category..."
              className="w-full bg-gray-100/90 rounded-lg pl-9 pr-4 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table of Products */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">PRODUCT</th>
                <th className="pb-3 font-semibold">CATEGORY</th>
                <th className="pb-3 font-semibold">PRICE</th>
                <th className="pb-3 font-semibold">STOCK</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-black mb-2" />
                    <p className="text-xs">Loading products catalog...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const stockLeft = prod.stockLeft ?? prod.stock ?? 10;
                  const stockTotal = prod.stockTotal ?? 100;
                  const isLow = prod.isLowStock || stockLeft <= 10;
                  const percent = Math.min(100, Math.max(0, (stockLeft / stockTotal) * 100));

                  return (
                    <tr key={prod.id || prod.sku} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Product Name & Real Shoe Photo */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F4F4F6] shrink-0 border border-gray-200/60 relative group-hover:scale-105 transition-transform flex items-center justify-center">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-gray-500">
                                {prod.badge || prod.name?.charAt(0) || "P"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[13.5px] text-ink block leading-tight truncate max-w-[220px]">
                              {prod.name}
                            </span>
                            <span className="text-[11.5px] text-gray-400 font-medium block leading-tight mt-0.5">
                              {prod.sku || `P-00${prod.id}`} · {prod.brand || "Nike"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 text-gray-700 font-medium">
                        {prod.category || "Sneakers"}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 font-bold text-ink">
                        ${prod.price}
                      </td>

                      {/* Stock Bar */}
                      <td className="py-3.5">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-500 font-medium">
                              {stockLeft} left
                            </span>
                            {isLow ? (
                              <span className="text-rose-600 font-bold">Low stock</span>
                            ) : (
                              <span className="text-gray-400 font-normal">of {stockTotal}</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isLow ? "bg-rose-500" : "bg-black"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            prod.status
                          )}`}
                        >
                          {prod.status || "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            title="Edit product"
                            onClick={() => setEditingProduct({ ...prod })}
                            className="p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Delete product"
                            onClick={() => setDeletingProduct(prod)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Quick Edit Product                                                 */}
      {/* ========================================================================= */}
      {editingProduct &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setEditingProduct(null)}
            />
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-ink">Edit Product SKU</h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-ink p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Stock Left
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stockLeft ?? editingProduct.stock ?? 10}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stockLeft: Number(e.target.value),
                          stock: Number(e.target.value),
                          isLowStock: Number(e.target.value) <= 10,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={editingProduct.status}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            status: e.target.value,
                          })
                        }
                        className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* MODAL: Confirm Delete Product                                             */}
      {/* ========================================================================= */}
      {deletingProduct &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setDeletingProduct(null)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Delete Product?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to remove <strong>{deletingProduct.name}</strong> ({deletingProduct.sku}) from the catalog? This cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProductsPage;
