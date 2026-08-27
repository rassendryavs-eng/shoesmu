import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  Tag,
  DollarSign,
  Boxes,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import Breadcrumb from "../components/navigation/Breadcrumb";
import api from "../services/api";
import { BRANDS, CATEGORIES, formatNumber } from "../config/constants";

const PRESET_IMAGES = [
  {
    id: "img-1",
    label: "Nike Sport Red",
    brand: "Nike",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "img-2",
    label: "Ultraboost White",
    brand: "Adidas",
    url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "img-3",
    label: "Puma Suede Teal",
    brand: "Puma",
    url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "img-4",
    label: "NB 550 Retro Grey",
    brand: "New Balance",
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "img-5",
    label: "Vans Classic Black",
    brand: "Vans",
    url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "img-6",
    label: "Lifestyle Pastel Gold",
    brand: "Nike",
    url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800",
  },
];

const AVAILABLE_SIZES = [
  "US 6.0",
  "US 6.5",
  "US 7.0",
  "US 7.5",
  "US 8.0",
  "US 8.5",
  "US 9.0",
  "US 9.5",
  "US 10.0",
  "US 10.5",
  "US 11.0",
  "US 12.0",
];

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "Nike",
    category: "Sneakers",
    gender: "Unisex",
    price: 150,
    costPrice: 65,
    compareAtPrice: 180,
    sku: `SM-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: `884920${Math.floor(100000 + Math.random() * 900000)}`,
    stock: 45,
    lowStockThreshold: 10,
    status: "Active",
    description:
      "Crafted with premium materials and aerodynamic cushioning to deliver supreme all-day comfort and athletic distinction.",
    image: PRESET_IMAGES[0].url,
    customImageUrl: "",
    selectedSizes: ["US 8.0", "US 8.5", "US 9.0", "US 9.5", "US 10.0", "US 10.5"],
  });

  // Calculate Profit & Margin
  const profit = Math.max(0, form.price - form.costPrice);
  const margin = form.price > 0 ? ((profit / form.price) * 100).toFixed(1) : 0;

  // Toggle Size in list
  const toggleSize = (size) => {
    if (form.selectedSizes.includes(size)) {
      setForm({
        ...form,
        selectedSizes: form.selectedSizes.filter((s) => s !== size),
      });
    } else {
      setForm({
        ...form,
        selectedSizes: [...form.selectedSizes, size],
      });
    }
  };

  // Generate New Random SKU
  const generateNewSku = () => {
    const brandPrefix = form.brand.substring(0, 2).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setForm({ ...form, sku: `${brandPrefix}-${rand}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      const finalImage = form.customImageUrl.trim() || form.image;
      await api.saveProduct({
        ...form,
        image: finalImage,
        stockLeft: form.stock,
        stockTotal: Math.max(100, form.stock + 20),
        isLowStock: form.stock <= form.lowStockThreshold,
        badge: form.name.charAt(0).toUpperCase() || "P",
        rating: 5.0,
        reviewsCount: 0,
      });
      navigate("/products");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-ink pb-16">
      {/* Top Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Products", path: "/products" },
          { label: "Add New Product" },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-3.5">
          <Link
            to="/products"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-black flex items-center justify-center text-gray-600 hover:text-black transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Create a shoe model, assign pricing, variants, and stock.
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/products"
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all cursor-pointer"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.name.trim()}
            className="px-5 py-2 rounded-full bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? "Publishing..." : "Save Product"}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Specifications, Pricing, Stock & Sizes (7 Cols / ~60%)       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: General Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                  Product Information
                </h2>
              </div>
              <span className="text-[11px] font-medium text-gray-400">
                Required fields are marked with *
              </span>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Nike Air Max 270 'Triple Black'"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-ink focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Description & Narrative
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe product materials, performance technology, and styling..."
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-[13.5px] text-ink focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed"
              />
            </div>

            {/* Brand, Category & Gender Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Brand *
                </label>
                <div className="relative">
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
                  >
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Audience / Gender
                </label>
                <div className="relative">
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-ink focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men's Footwear</option>
                    <option value="Women">Women's Footwear</option>
                    <option value="Kids">Kids / Junior</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Profit Calculations */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                  Pricing & Profit Margins
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Selling Price ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-[14px] font-bold text-ink focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Cost per Item ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({ ...form, costPrice: Number(e.target.value) })
                    }
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-[14px] font-medium text-gray-700 focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Compare-at Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.compareAtPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        compareAtPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-[14px] font-medium text-gray-400 focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Live Profit Banner */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-emerald-900">
                  Est. Profit per Unit: <strong>${profit}</strong>
                </span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                {margin}% Margin
              </span>
            </div>
          </div>

          {/* Card 3: Inventory, SKU & Barcode */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-gray-400" />
                <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                  Inventory & Identification
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    SKU Code *
                  </label>
                  <button
                    type="button"
                    onClick={generateNewSku}
                    className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-ink focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Barcode / EAN
                </label>
                <input
                  type="text"
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-700 focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Total Stock Units *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-ink focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Low Stock Alert Level
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lowStockThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-700 focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Interactive Size Availability Picker */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                  Available Sizes ({form.selectedSizes.length} Selected)
                </h2>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Select which footwear sizes will be in stock for this SKU:
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = form.selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Media Selector, Storefront Preview & Publish (5 Cols / ~40%) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Media & Image Preset Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">
                  Product Image
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                HD Ready
              </span>
            </div>

            {/* Big Active Preview Frame */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group shadow-inner">
              <img
                src={form.customImageUrl.trim() || form.image}
                alt="Product Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {form.brand} · {form.category}
              </div>
            </div>

            {/* Custom Image URL Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Custom Image Link (Optional)
              </label>
              <input
                type="url"
                value={form.customImageUrl}
                onChange={(e) =>
                  setForm({ ...form, customImageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-ink focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Preset Shoe Gallery */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Or Pick a High-Res Preset:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_IMAGES.map((preset) => {
                  const isCurrent =
                    !form.customImageUrl && form.image === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          image: preset.url,
                          customImageUrl: "",
                          brand: preset.brand || form.brand,
                        })
                      }
                      className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                        isCurrent
                          ? "border-black ring-2 ring-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <div className="w-full h-14 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 block truncate mt-1">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Live Storefront Card Preview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Storefront Card Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                Customer View
              </span>
            </div>

            {/* Live Inventory Preview Card */}
            {(() => {
              const stock = Number(form.stock) || 0;
              const total = Math.max(100, stock + 20);
              const isLow = stock <= (Number(form.lowStockThreshold) || 10) && stock > 0;
              const isOut = stock === 0;
              const percent = Math.min(100, Math.max(3, (stock / total) * 100));

              return (
                <div className="border border-gray-100 rounded-xl p-3.5 bg-gray-50/60 space-y-3">
                  <div className="flex gap-3.5 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 shadow-2xs">
                      <img
                        src={form.customImageUrl.trim() || form.image}
                        alt="Tiny Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block truncate">
                          {form.brand || "NIKE"}
                        </span>

                        {/* Status Badge matching Inventory Page */}
                        {isOut ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] shrink-0">
                            Out of stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] shrink-0">
                            Low ({stock})
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#D1FADF] shrink-0">
                            In Stock ({stock})
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] font-bold text-ink truncate leading-tight mt-0.5">
                        {form.name || "Untitled Shoe Model"}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-extrabold text-ink">
                          ${form.price}
                        </span>
                        {form.compareAtPrice > form.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ${form.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Bar & Live Counter (Matching Inventory Layout) */}
                  <div className="pt-2 border-t border-gray-200/70 space-y-1.5">
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-200/90 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOut ? "bg-gray-300" : isLow ? "bg-[#D92D21]" : "bg-black"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Stock Subtext */}
                    <div className="flex items-center justify-between text-[11px] leading-none">
                      <span
                        className={`font-medium ${
                          isLow || isOut
                            ? "text-[#D92D21] font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {stock} left
                      </span>
                      <span
                        className={`font-normal ${
                          isLow || isOut
                            ? "text-[#D92D21] font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {isOut ? "0 left" : isLow ? "Low stock" : `of ${total}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Card: Publishing Controls */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-gray-100 pb-3">
              Visibility & Publishing
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Catalog Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Active", "Draft", "Archived"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setForm({ ...form, status: st })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      form.status === st
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Publishing..." : "Save & Publish Product"}</span>
              </button>

              <Link to="/products" className="block">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  Cancel & Back to Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;
