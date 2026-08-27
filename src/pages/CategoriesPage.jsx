import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Info,
  X,
  Check,
  AlertTriangle,
  ArrowUpDown,
  Layers,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("terlaris"); // 'terlaris' | 'terbanyak' | 'az'
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // New Category Form State
  const [newCat, setNewCat] = useState({
    name: "",
    code: "",
    slug: "",
    description: "",
    productsCount: 10,
    unitsSold: 0,
    share: 5,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Compute Summary Statistics
  const totalCategories = categories.length;
  const totalProducts = categories.reduce(
    (acc, curr) => acc + (Number(curr.productsCount) || 0),
    0
  );
  const totalUnitsSold = categories.reduce(
    (acc, curr) => acc + (Number(curr.unitsSold) || 0),
    0
  );

  // Find Top Category by Units Sold
  const topCategory = categories.reduce(
    (max, curr) =>
      (Number(curr.unitsSold) || 0) > (Number(max?.unitsSold) || 0)
        ? curr
        : max,
    categories[0] || { name: "Sneakers", unitsSold: 4820 }
  );

  // Filter & Sort Categories
  const filteredCategories = categories
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.slug && c.slug.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "terlaris") {
        return (Number(b.unitsSold) || 0) - (Number(a.unitsSold) || 0);
      }
      if (sortBy === "terbanyak") {
        return (Number(b.productsCount) || 0) - (Number(a.productsCount) || 0);
      }
      if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Handle Add Category
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    setActionLoading(true);
    try {
      const code =
        newCat.code.trim() || `C-0${categories.length + 1}`;
      const slug =
        newCat.slug.trim() || `/${newCat.name.toLowerCase().replace(/\s+/g, "-")}`;

      await api.saveCategory({
        ...newCat,
        code,
        slug,
      });
      await fetchCategories();
      setIsAddModalOpen(false);
      setNewCat({
        name: "",
        code: "",
        slug: "",
        description: "",
        productsCount: 10,
        unitsSold: 0,
        share: 5,
      });
      showToast(`Category "${newCat.name}" successfully created!`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Category
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    setActionLoading(true);
    try {
      await api.saveCategory(editingCategory);
      await fetchCategories();
      setEditingCategory(null);
      showToast(`Category "${editingCategory.name}" updated!`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Category
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setActionLoading(true);
    try {
      await api.deleteCategory(deletingCategory.id);
      await fetchCategories();
      const name = deletingCategory.name;
      setDeletingCategory(null);
      showToast(`Category "${name}" deleted.`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-ink pb-12 relative">
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
      {/* HEADER: Title & New Category Button                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-ink tracking-tight">
            Categories
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-0.5">
            {totalCategories} kategori • {totalProducts} produk •{" "}
            {totalUnitsSold.toLocaleString()} unit terjual
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-neutral-800 active:scale-95 text-white text-[13px] font-medium transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New category</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* INFORMATION CALLOUT BANNER                                                */}
      {/* ========================================================================= */}
      <div className="bg-[#F6F7F9] border border-gray-200/80 rounded-xl p-4 flex items-start gap-3 text-[12.5px] text-gray-600 leading-relaxed shadow-sm">
        <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p>
          Kategori mengelompokkan produk di etalase. <strong>Produk</strong> =
          jumlah SKU aktif di kategori itu, <strong>Unit terjual</strong> =
          total pasang terjual, dan <strong>Share</strong> = kontribusi
          kategori terhadap seluruh penjualan. Kategori dengan share besar
          layak diprioritaskan untuk restock & promo.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SUMMARY METRIC CARDS ROW (3 CARDS)                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: TOTAL KATEGORI */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            TOTAL KATEGORI
          </p>
          <p className="text-3xl font-extrabold text-ink tracking-tight pt-1">
            {totalCategories}
          </p>
          <p className="text-xs text-gray-400">grup produk aktif</p>
        </div>

        {/* Card 2: TOTAL PRODUK */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            TOTAL PRODUK
          </p>
          <p className="text-3xl font-extrabold text-ink tracking-tight pt-1">
            {totalProducts}
          </p>
          <p className="text-xs text-gray-400">SKU di semua kategori</p>
        </div>

        {/* Card 3: KATEGORI TERLARIS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            KATEGORI TERLARIS
          </p>
          <p className="text-3xl font-extrabold text-ink tracking-tight pt-1 truncate">
            {topCategory?.name || "Sneakers"}
          </p>
          <p className="text-xs text-gray-400">
            {(topCategory?.unitsSold || 4820).toLocaleString()} unit terjual
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONTROLS ROW: Search & Sort Buttons                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori..."
            className="w-full bg-[#F2F3F5] rounded-xl pl-9 pr-4 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent transition-all"
          />
        </div>

        {/* Sort Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            <span>URUTKAN</span>
          </span>

          <div className="flex items-center bg-gray-100 p-0.5 rounded-full text-xs">
            <button
              type="button"
              onClick={() => setSortBy("terlaris")}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                sortBy === "terlaris"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Terlaris
            </button>
            <button
              type="button"
              onClick={() => setSortBy("terbanyak")}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                sortBy === "terbanyak"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Produk terbanyak
            </button>
            <button
              type="button"
              onClick={() => setSortBy("az")}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                sortBy === "az"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              A–Z
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORIES GRID CARDS (3 COLUMNS)                                         */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">
          <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-black mb-2" />
          <p className="text-xs">Memuat daftar kategori...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
          <p className="text-sm">Tidak ada kategori yang sesuai dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const sharePercent = cat.share || 0;
            return (
              <div
                key={cat.id || cat.code}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Top: Code & Action Icons */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-semibold text-gray-400">
                    {cat.code || "C-00"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Edit category"
                      onClick={() => setEditingCategory({ ...cat })}
                      className="p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete category"
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Category Name & URL */}
                <div>
                  <h3 className="text-lg font-bold text-ink leading-tight group-hover:text-black">
                    {cat.name}
                  </h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    URL etalase: {cat.slug || `/${cat.name.toLowerCase()}`}
                  </p>
                </div>

                {/* Share Penjualan Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">
                      Share penjualan
                    </span>
                    <span className="text-gray-700 font-bold">
                      {sharePercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-black transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(3, sharePercent))}%` }}
                    />
                  </div>
                </div>

                {/* Bottom 2 Metrics: Produk SKU & Unit Terjual */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      PRODUK (SKU)
                    </p>
                    <p className="text-[17px] font-extrabold text-ink mt-0.5">
                      {cat.productsCount || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      UNIT TERJUAL
                    </p>
                    <p className="text-[17px] font-extrabold text-ink mt-0.5">
                      {(cat.unitsSold || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Add New Category                                                   */}
      {/* ========================================================================= */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-ink">Add New Category</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-ink p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCat.name}
                      onChange={(e) =>
                        setNewCat({
                          ...newCat,
                          name: e.target.value,
                          slug: `/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`,
                        })
                      }
                      placeholder="e.g. Running Shoes"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Code
                    </label>
                    <input
                      type="text"
                      value={newCat.code}
                      onChange={(e) =>
                        setNewCat({ ...newCat, code: e.target.value })
                      }
                      placeholder={`C-0${categories.length + 1}`}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Storefront URL Slug
                  </label>
                  <input
                    type="text"
                    value={newCat.slug}
                    onChange={(e) =>
                      setNewCat({ ...newCat, slug: e.target.value })
                    }
                    placeholder="/running-shoes"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newCat.description}
                    onChange={(e) =>
                      setNewCat({ ...newCat, description: e.target.value })
                    }
                    placeholder="Brief description of the footwear category..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Initial SKUs
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={newCat.productsCount}
                      onChange={(e) =>
                        setNewCat({
                          ...newCat,
                          productsCount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Est. Share (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newCat.share}
                      onChange={(e) =>
                        setNewCat({ ...newCat, share: Number(e.target.value) })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !newCat.name.trim()}
                    className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Category                                                      */}
      {/* ========================================================================= */}
      {editingCategory &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setEditingCategory(null)}
            />
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-ink">Edit Category</h3>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-400 hover:text-ink p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Code
                    </label>
                    <input
                      type="text"
                      value={editingCategory.code}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          code: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Storefront URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        slug: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      SKU Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingCategory.productsCount || 0}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          productsCount: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Units Sold
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingCategory.unitsSold || 0}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          unitsSold: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Share (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingCategory.share || 0}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          share: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
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
      {/* MODAL: Delete Category Confirmation                                       */}
      {/* ========================================================================= */}
      {deletingCategory &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setDeletingCategory(null)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Delete Category?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to remove <strong>{deletingCategory.name}</strong> ({deletingCategory.code})? Products in this category may need reassigning.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDeleteConfirm}
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

export default CategoriesPage;
