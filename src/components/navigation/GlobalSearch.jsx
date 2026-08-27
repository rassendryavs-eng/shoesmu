import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Package,
  ShoppingCart,
  Users,
  LayoutDashboard,
  FolderTree,
  Warehouse,
  Tag,
  MessageSquare,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
  Command,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
} from "../../data/mockData";
import { formatCurrency } from "../../config/constants";

export const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Quick navigation items
  const NAV_PAGES = [
    { name: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard, category: "Pages" },
    { name: "Products Catalog", path: "/products", icon: Package, category: "Pages" },
    { name: "Add New Product", path: "/products/new", icon: PlusCircle, category: "Pages" },
    { name: "Categories Management", path: "/categories", icon: FolderTree, category: "Pages" },
    { name: "Orders & Shipments", path: "/orders", icon: ShoppingCart, category: "Pages" },
    { name: "Customers Directory", path: "/customers", icon: Users, category: "Pages" },
    { name: "Messages Inbox", path: "/messages", icon: MessageSquare, category: "Pages" },
    { name: "Inventory Tracking", path: "/inventory", icon: Warehouse, category: "Pages" },
    { name: "Discounts & Promotions", path: "/promotions", icon: Tag, category: "Pages" },
    { name: "Reports & Analytics", path: "/reports", icon: BarChart3, category: "Pages" },
    { name: "Store Settings", path: "/settings", icon: Settings, category: "Pages" },
  ];

  // Load latest data from localStorage or mock
  const getProducts = () => {
    try {
      const saved = localStorage.getItem("shoesmu_products");
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  };

  const getOrders = () => {
    try {
      const saved = localStorage.getItem("shoesmu_orders");
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  };

  const getCustomers = () => {
    try {
      const saved = localStorage.getItem("shoesmu_customers");
      return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
    } catch {
      return MOCK_CUSTOMERS;
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        if (window.innerWidth < 768) {
          setIsMobileSearchOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 50);
        } else {
          inputRef.current?.focus();
        }
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Compute search results
  const q = query.trim().toLowerCase();

  const matchedProducts = q
    ? getProducts()
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.sku?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedOrders = q
    ? getOrders()
        .filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.customer?.name?.toLowerCase().includes(q) ||
            o.trackingNumber?.toLowerCase().includes(q) ||
            o.items?.some((it) => it.name.toLowerCase().includes(q))
        )
        .slice(0, 3)
    : [];

  const matchedCustomers = q
    ? getCustomers()
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];

  const matchedPages = q
    ? NAV_PAGES.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.path.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  // Flat array of all results for keyboard selection
  const flatResults = [
    ...matchedPages.map((p) => ({ ...p, type: "page" })),
    ...matchedProducts.map((p) => ({ ...p, type: "product", targetPath: `/products/${p.id}` })),
    ...matchedOrders.map((o) => ({ ...o, type: "order", targetPath: `/orders/${o.id.replace('#', '')}` })),
    ...matchedCustomers.map((c) => ({ ...c, type: "customer", targetPath: `/customers/${c.id}` })),
  ];

  const totalResultsCount = flatResults.length;

  const handleSelectResult = (item) => {
    let target = item.path || item.targetPath;
    if (target) {
      navigate(target);
    }
    setIsOpen(false);
    setIsMobileSearchOpen(false);
    setQuery("");
  };

  const handleKeyDownInput = (e) => {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flatResults.length) {
        handleSelectResult(flatResults[selectedIndex]);
      } else if (flatResults.length > 0) {
        handleSelectResult(flatResults[0]);
      }
    }
  };

  const handleQuickTagClick = (tagQuery) => {
    setQuery(tagQuery);
    setIsOpen(true);
    inputRef.current?.focus();
    mobileInputRef.current?.focus();
  };

  // Status color helper for orders
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "processing":
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="relative flex-1 flex justify-center max-w-[340px] sm:max-w-[360px] mx-auto px-1 sm:px-2" ref={containerRef}>
      {/* ========================================================================= */}
      {/* DESKTOP / TABLET CENTERED SEARCH PILL */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center w-full relative">
        <div
          className={`flex items-center w-full h-9 px-3 bg-gray-100/90 rounded-full border transition-all ${
            isOpen
              ? "bg-white border-black ring-3 ring-black/5 shadow-md"
              : "border-transparent hover:bg-gray-100 hover:border-gray-200"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDownInput}
            placeholder="Search products, orders, customers..."
            className="w-full bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          {/* Right Clear Icon (only when text is entered) */}
          {query && (
            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE SEARCH TRIGGER BUTTON (Visible on mobile only) */}
      {/* ========================================================================= */}
      <div className="md:hidden flex items-center">
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen(true);
            setIsOpen(true);
            setTimeout(() => mobileInputRef.current?.focus(), 60);
          }}
          className="flex items-center gap-2 h-9 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 text-[12.5px] font-medium transition-all active:scale-95"
        >
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <span className="truncate max-w-[120px]">
            {query || "Search store..."}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE EXPANDED SEARCH BAR OVERLAY */}
      {/* ========================================================================= */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col font-sans animate-in fade-in duration-150 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center h-11 px-3.5 bg-gray-100 rounded-xl border border-gray-200 focus-within:border-black focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, orders, customers..."
                className="w-full bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setIsOpen(false);
              }}
              className="px-3 py-2 text-[13px] font-bold text-gray-700 hover:text-black"
            >
              Cancel
            </button>
          </div>

          {/* Results inside Mobile overlay */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-white p-2">
            {renderResultsContent()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET FLOATING LIVE RESULTS DROPDOWN */}
      {/* ========================================================================= */}
      {isOpen && !isMobileSearchOpen && (
        <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-[360px] sm:w-[400px] mt-2 bg-white border border-gray-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150 max-h-[460px] overflow-y-auto">
          {renderResultsContent()}
        </div>
      )}
    </div>
  );

  // Helper to render suggestions and result sections
  function renderResultsContent() {
    // 1. Initial State: Suggestions & Popular Tags
    if (!q) {
      return (
        <div className="p-4 space-y-4">
          {/* Quick Tags */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Air Jordan",
                "Nike",
                "Ultraboost",
                "Pending Orders",
                "VIP Customers",
                "Promotions",
                "Revenue",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-[12px] font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Navigation Pages */}
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Quick Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_PAGES.slice(0, 6).map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => handleSelectResult(page)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-left text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[12.5px] font-semibold truncate">{page.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Shortcuts hint */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Navigation: <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">↓</kbd> to select</span>
            <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Enter</kbd> to open</span>
          </div>
        </div>
      );
    }

    // 2. Empty State
    if (totalResultsCount === 0) {
      return (
        <div className="py-10 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-2.5">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-[13.5px] font-bold text-gray-800">
            No matches found for "{query}"
          </p>
          <p className="text-[12px] text-gray-500 mt-1 max-w-xs mx-auto">
            Try searching by shoe model, brand (Nike, Adidas), order ID (#ORD-9281), or customer name.
          </p>
        </div>
      );
    }

    // 3. Matched Results List (Grouped by Category)
    let runningIndex = 0;

    return (
      <div className="divide-y divide-gray-100 text-left">
        {/* Navigation Pages */}
        {matchedPages.length > 0 && (
          <div className="p-2">
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pages & Views
            </div>
            {matchedPages.map((page) => {
              const Icon = page.icon;
              const idx = runningIndex++;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={page.path}
                  onClick={() => handleSelectResult(page)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-black text-white" : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-semibold truncate">{page.name}</span>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Products */}
        {matchedProducts.length > 0 && (
          <div className="p-2">
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Products ({matchedProducts.length})</span>
              <button
                type="button"
                onClick={() => {
                  navigate("/products");
                  setIsOpen(false);
                  setIsMobileSearchOpen(false);
                }}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {matchedProducts.map((prod) => {
              const idx = runningIndex++;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={prod.id}
                  onClick={() =>
                    handleSelectResult({ targetPath: `/products/${prod.id}` })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-black text-white" : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs shrink-0">
                        {prod.badge || "P"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-[13px] font-bold truncate leading-tight ${
                          isSelected ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {prod.name}
                      </p>
                      <div
                        className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${
                          isSelected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        <span>{prod.brand}</span>
                        <span>•</span>
                        <span>{prod.category}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">
                          ${prod.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${
                      prod.stockLeft <= 10
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {prod.stockLeft} in stock
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Orders */}
        {matchedOrders.length > 0 && (
          <div className="p-2">
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Orders ({matchedOrders.length})</span>
              <button
                type="button"
                onClick={() => {
                  navigate("/orders");
                  setIsOpen(false);
                  setIsMobileSearchOpen(false);
                }}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {matchedOrders.map((ord) => {
              const idx = runningIndex++;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={ord.id}
                  onClick={() =>
                    handleSelectResult({ targetPath: `/orders/${ord.id.replace('#', '')}` })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-black text-white" : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[13px] font-bold ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {ord.id}
                        </span>
                        <span
                          className={`text-[11px] ${
                            isSelected ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          ({ord.customer?.name || "Customer"})
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-gray-300" : "text-gray-400"
                        }`}
                      >
                        Total ${ord.total} • {ord.items?.length || 1} items
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 ml-2 ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    {ord.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Customers */}
        {matchedCustomers.length > 0 && (
          <div className="p-2">
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Customers ({matchedCustomers.length})</span>
              <button
                type="button"
                onClick={() => {
                  navigate("/customers");
                  setIsOpen(false);
                  setIsMobileSearchOpen(false);
                }}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            {matchedCustomers.map((cust) => {
              const idx = runningIndex++;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cust.id}
                  onClick={() =>
                    handleSelectResult({ targetPath: `/customers/${cust.id}` })
                  }
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-black text-white" : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {cust.avatar ? (
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {cust.name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-[13px] font-bold truncate leading-tight ${
                          isSelected ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {cust.name}
                      </p>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-gray-300" : "text-gray-400"
                        }`}
                      >
                        {cust.email} • {cust.ordersCount || 0} orders
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${
                      cust.status === "VIP"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cust.status || "Customer"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
};

export default GlobalSearch;
