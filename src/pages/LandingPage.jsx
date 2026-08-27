import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  Boxes,
  Tag,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Clock,
  Truck,
  Check,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MOCK_KPIS, MOCK_MONTHLY_SALES, MOCK_SALES_GOAL } from "../data/mockData";

const BRANDS = [
  { name: "Nike", tag: "Sneakers & Performance" },
  { name: "Adidas", tag: "Originals & Boost" },
  { name: "Puma", tag: "Sportstyle & Suede" },
  { name: "Vans", tag: "Skate & Classics" },
  { name: "Reebok", tag: "Club C & Vintage" },
  { name: "Converse", tag: "Chuck 70 & High" },
  { name: "New Balance", tag: "990v & 550 Lifestyle" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Analitik penjualan real-time",
    description:
      "Pantau revenue harian, margin laba kotor, dan tren pergerakan 7 brand dalam satu grafik interaktif.",
    badge: "Live Data",
  },
  {
    icon: Boxes,
    title: "Katalog & stok terkendali",
    description:
      "Peringatan otomatis saat stok varian menipis (<10 unit). Sinkronisasi multi-ukuran bebas selisih.",
    badge: "Auto-Alert",
  },
  {
    icon: ShoppingBag,
    title: "Fulfillment pesanan",
    description:
      "Alur status dari Pending hingga Delivered lengkap dengan pelacakan nomor resi dan invoice cetak.",
    badge: "One-Click",
  },
  {
    icon: Lock,
    title: "Akses berbasis peran",
    description:
      "Lindungi laporan finansial sensitif. Berikan staf akses operasional harian tanpa melihat margin laba.",
    badge: "RBAC Security",
  },
  {
    icon: Tag,
    title: "Promosi & kupon",
    description:
      "Jalankan flash sale dan kampanye diskon terjadwal dengan format salin kode promo instan.",
    badge: "Campaigns",
  },
  {
    icon: MessageSquare,
    title: "Layanan siap respons",
    description:
      "Pusat notifikasi dan percakapan pelanggan untuk memastikan setiap pesanan ditangani tanpa tertunda.",
    badge: "Inbox",
  },
];

const PRICING_PLANS = [
  {
    id: "starter",
    name: "Gratis",
    tagline: "Untuk toko yang baru mulai",
    price: "$0",
    period: "selamanya",
    featured: false,
    buttonText: "Mulai sekarang",
    features: [
      "Hingga 100 pesanan / bulan",
      "1 akun Staff operasional",
      "Katalog hingga 50 SKU",
      "Laporan penjualan dasar",
      "Dukungan komunitas",
    ],
  },
  {
    id: "pro",
    name: "Bisnis",
    tagline: "Paling populer untuk toko aktif",
    price: "$49",
    period: "/ bulan",
    featured: true,
    badge: "PILIHAN POPULER",
    buttonText: "Mulai Uji Coba Gratis →",
    features: [
      "Pesanan tanpa batas",
      "Hingga 5 akun Staff & Admin",
      "Katalog SKU tanpa batas",
      "Analitik & ekspor laporan lengkap",
      "Sistem kupon & promosi terjadwal",
      "Peringatan stok menipis otomatis",
    ],
  },
  {
    id: "enterprise",
    name: "Custom",
    tagline: "Untuk jaringan multi-cabang",
    price: "Kustom",
    period: "sesuai kebutuhan",
    featured: false,
    buttonText: "Hubungi Sales",
    features: [
      "Akses API kustom",
      "Multi-gudang / warehouse",
      "Akun staf tak terbatas",
      "Dukungan SLA 24/7",
      "Onboarding & training khusus",
    ],
  },
];

const RECENT_ORDERS_PREVIEW = [
  {
    customer: "Rina Okamoto",
    sku: "Nike Dunk Low",
    price: "$220",
    status: "Pending",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    customer: "Marcus Green",
    sku: "Adidas Ultraboost",
    price: "$180",
    status: "Processing",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    customer: "Alix Boyer",
    sku: "Vans Old Skool",
    price: "$140",
    status: "Shipped",
    statusColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    customer: "David Chu",
    sku: "New Balance 550",
    price: "$180",
    status: "Delivered",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const MONTHLY_SALES_2026 = [
  { month: "Jan", revenue: 58000, orders: 380 },
  { month: "Feb", revenue: 64000, orders: 410 },
  { month: "Mar", revenue: 62000, orders: 390 },
  { month: "Apr", revenue: 76000, orders: 490 },
  { month: "May", revenue: 74000, orders: 470 },
  { month: "Jun", revenue: 86000, orders: 560 },
  { month: "Jul", revenue: 95000, orders: 610 },
  { month: "Aug", revenue: 92000, orders: 590 },
  { month: "Sep", revenue: 102000, orders: 660 },
  { month: "Oct", revenue: 106000, orders: 690 },
  { month: "Nov", revenue: 112000, orders: 730 },
  { month: "Dec", revenue: 124000, orders: 810 },
];

const MONTHLY_SALES_2025 = [
  { month: "Jan", revenue: 42000, orders: 280 },
  { month: "Feb", revenue: 48000, orders: 310 },
  { month: "Mar", revenue: 45000, orders: 290 },
  { month: "Apr", revenue: 52000, orders: 340 },
  { month: "May", revenue: 58000, orders: 380 },
  { month: "Jun", revenue: 64000, orders: 410 },
  { month: "Jul", revenue: 70000, orders: 450 },
  { month: "Aug", revenue: 68000, orders: 430 },
  { month: "Sep", revenue: 75000, orders: 480 },
  { month: "Oct", revenue: 80000, orders: 510 },
  { month: "Nov", revenue: 86000, orders: 550 },
  { month: "Dec", revenue: 95000, orders: 600 },
];

export const LandingPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2026");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased selection:bg-[#111111] selection:text-white relative overflow-hidden">
      {/* Background Ambient Lighting Spotlights (Black Monochromatic Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-spotlight pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-black/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -left-40 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 group cursor-pointer select-none"
          >
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-ink lowercase">
              shoesmu.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-semibold text-gray-600">
            <button
              type="button"
              onClick={() => scrollToSection("brands")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Brands
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("analytics")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Our Promise
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Drops
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Right Action CTA: Sign in & Sign up */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-700 hover:text-black font-semibold text-[14px] px-3.5 py-2 transition-colors cursor-pointer"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] shadow-[0_4px_14px_rgba(17,17,17,0.35)] hover:shadow-[0_6px_20px_rgba(17,17,17,0.45)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 bg-white px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg">
            <div className="flex flex-col space-y-3 text-[15px] font-semibold text-gray-800">
              <button
                type="button"
                onClick={() => scrollToSection("brands")}
                className="text-left py-1 hover:text-black"
              >
                Brands
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("analytics")}
                className="text-left py-1 hover:text-black"
              >
                Our Promise
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-left py-1 hover:text-black"
              >
                Drops
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="text-left py-1 hover:text-black"
              >
                Pricing
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <Link
                to="/register"
                className="w-full text-center bg-[#111111] hover:bg-black text-white font-bold py-3 rounded-full text-sm shadow-md"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="w-full text-center bg-gray-100 hover:bg-gray-200 text-ink font-semibold py-2.5 rounded-full text-sm"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO HEADER SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Subtle radial light spotlight behind text */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-black/[0.04] via-black/[0.015] to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Est. 2024 Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/90 text-[12.5px] font-semibold text-gray-800 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_18px_-2px_rgba(0,0,0,0.12)] transition-all">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
            <span>Est. 2024 — Jakarta</span>
          </div>

          {/* Main Hero Display Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-ink tracking-tight leading-[1.08]">
            Sneakers worth <br className="hidden sm:inline" />
            stepping out in.
          </h1>

          {/* Subheadline Copy */}
          <p className="text-base sm:text-lg lg:text-[19px] text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
            A tightly curated marketplace of seven legendary brands. Every pair verified, every release tracked, every order shipped within a day.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full font-extrabold text-[15px] shadow-black-glow hover:shadow-[0_16px_40px_-8px_rgba(17,17,17,0.5)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Browse the edit</span>
              <ArrowRight className="w-4 h-4 text-gray-300" />
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-gray-50 text-ink border border-gray-300 hover:border-black px-7 py-3.5 rounded-full font-bold text-[14.5px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_22px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
            >
              Why Shoesmu
            </button>
          </div>

          {/* Three Key Metrics Row */}
          <div className="pt-8 sm:pt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-gray-200/80 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink">7</div>
              <div className="text-[12px] sm:text-[13px] text-gray-500 font-medium mt-0.5">
                Brands
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink">1.2K</div>
              <div className="text-[12px] sm:text-[13px] text-gray-500 font-medium mt-0.5">
                Pairs in stock
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ink">100%</div>
              <div className="text-[12px] sm:text-[13px] text-gray-500 font-medium mt-0.5">
                Authentic
              </div>
            </div>
          </div>
        </div>

        {/* Sneaker Showcase Hero Card + KPI Floating Cards */}
        <div className="mt-14 sm:mt-18 relative max-w-5xl mx-auto">
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-black/10 via-gray-400/20 to-black/10 rounded-[36px] blur-xl opacity-70 pointer-events-none" />

          <div className="bg-gradient-to-b from-white via-[#F8F8F8] to-[#EDEDED] rounded-3xl p-6 sm:p-12 border border-gray-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 group">
            {/* Background Ambient Lighting Spotlights inside Card */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-black/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-black/[0.03] rounded-full blur-3xl pointer-events-none" />

            {/* Left Content info */}
            <div className="max-w-md space-y-4 text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-gray-700 uppercase tracking-wider shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-200">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Konsol Operasional Toko</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-snug">
                Jalankan seluruh toko sneaker dari satu layar.
              </h2>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Shoesmu Admin menyatukan revenue, pesanan, stok, dan pelanggan dari 7 brand menjadi satu sistem pencatatan yang rapi — menggantikan spreadsheet yang tercecer.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-[13px] inline-flex items-center gap-1.5 shadow-[0_4px_15px_rgba(17,17,17,0.35)] hover:shadow-[0_8px_25px_rgba(17,17,17,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Buka dashboard langsung</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Sneaker Showcase & Floating Status Card */}
            <div className="relative w-full lg:w-1/2 flex items-center justify-center z-10">
              {/* Radial Lighting Glow Behind Shoe Container */}
              <div className="absolute inset-0 bg-radial from-black/[0.08] via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.12)] border border-gray-200/80 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                {/* Pedestal Cast Shadow underneath shoe */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-black/25 rounded-[100%] blur-md pointer-events-none group-hover:scale-110 group-hover:bg-black/35 transition-all duration-300" />

                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=700"
                  alt="Nike Dunk Low Retro"
                  className="relative z-10 w-full h-48 sm:h-56 object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300"
                />

                {/* Floating Top Selling Badge */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      TOP SELLING PRODUCT
                    </span>
                    <span className="text-[13.5px] font-bold text-ink block">
                      Nike Dunk Low Retro
                    </span>
                    <span className="text-[11.5px] text-gray-500 font-medium">
                      128 orders · $14,080 gross
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-2xs">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick 4 KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-black/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                TOTAL REVENUE
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-ink mt-1">
                $118,400
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                +18.4% vs last month
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-black/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                TOTAL ORDERS
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-ink mt-1">
                831
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                +8.1% vs last month
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-black/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                TOTAL CUSTOMERS
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-ink mt-1">
                2,148
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                +12.3% vs last month
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-black/30 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                AVERAGE ORDER
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-ink mt-1">
                $38,620
              </div>
              <div className="text-[11px] text-gray-500 font-bold mt-0.5">
                -1.4% vs last month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SUPPORTED BRANDS STRIP                                                 */}
      {/* ========================================================================= */}
      <section
        id="brands"
        className="py-12 border-y border-gray-200/80 bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F5] to-[#FAFAFA] relative shadow-inner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
              MENDUKUNG OPERASI 7 BRAND TERNAMA
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="group flex flex-col items-center cursor-default transition-transform hover:-translate-y-1"
              >
                <span className="text-xl sm:text-2xl font-black text-gray-800 tracking-tighter group-hover:text-black transition-colors drop-shadow-2xs">
                  {brand.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-600 transition-colors">
                  {brand.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE DASHBOARD ANALYTICS PREVIEW SECTION                                */}
      {/* ========================================================================= */}
      <section id="analytics" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle Ambient Backing Spotlight */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-black/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mb-12 text-left">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            OVERVIEW OPERASIONAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            Kondisi bisnis, terbaca dalam sekali lihat.
          </h2>
          <p className="text-[15px] text-gray-600 mt-2.5">
            Satu dashboard menyatukan KPI, grafik penjualan bulanan, target penjualan, dan pesanan terbaru — bersih tanpa spreadsheet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Monthly Sales Interactive Bar Chart Preview (2 Cols) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-card-elevated hover:shadow-card-hover hover:border-gray-300 transition-all duration-300 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-ink">Monthly Sales</h3>
                <p className="text-[12.5px] text-gray-400 font-normal">
                  Grafik volume penjualan 12 bulan terakhir
                </p>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-[11px] font-bold text-gray-600 border border-gray-200/70 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSelectedYear("2026")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer select-none ${
                    selectedYear === "2026"
                      ? "bg-white text-black shadow-xs font-extrabold"
                      : "text-gray-500 hover:text-black font-semibold"
                  }`}
                >
                  2026
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear("2025")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer select-none ${
                    selectedYear === "2025"
                      ? "bg-white text-black shadow-xs font-extrabold"
                      : "text-gray-500 hover:text-black font-semibold"
                  }`}
                >
                  2025
                </button>
              </div>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-gray-100">
              {(selectedYear === "2026" ? MONTHLY_SALES_2026 : MONTHLY_SALES_2025).map((item, idx, arr) => {
                const maxVal = 180000;
                const heightPercent = Math.round((item.revenue / maxVal) * 100);
                const isHovered = hoveredBar === idx;
                const isCurrent = idx === arr.length - 1;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 z-20 bg-[#111111] text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap border border-white/10">
                        ${(item.revenue / 1000).toFixed(0)}k ({item.orders} ord)
                      </div>
                    )}

                    <div className="w-full bg-gray-100 rounded-t-md h-52 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isCurrent
                            ? "bg-[#111111] shadow-[0_4px_14px_rgba(17,17,17,0.4)]"
                            : isHovered
                            ? "bg-black shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
                            : "bg-gray-300 group-hover:bg-black"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 group-hover:text-black">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shadow-2xs" />
                  {selectedYear === "2026" ? "Tahun 2026 (Peak)" : "Tahun 2025 (Peak)"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  Volume Penjualan
                </span>
              </div>
              <div className="bg-gray-100/80 border border-gray-200/80 px-3 py-1 rounded-full text-[11px] font-bold text-ink shadow-2xs">
                Total Revenue {selectedYear}: {selectedYear === "2026" ? "$1,054,000" : "$798,000"}
              </div>
            </div>
          </div>

          {/* Right Column: Goal Progress & Recent Orders (1 Col) */}
          <div className="space-y-6">
            {/* Sales Goal Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-card-elevated hover:shadow-card-hover hover:border-gray-300 transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-ink">Sales Goal</h3>
                <span className="text-[11px] font-bold text-black bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 shadow-2xs">
                  Desember 2026
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-ink tracking-tight">
                  68%
                </div>
                <div className="text-[12px] text-gray-500 font-medium mt-0.5">
                  $10,200 tercapai dari target $15,000
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#111111] rounded-full w-[68%] shadow-[0_2px_8px_rgba(17,17,17,0.4)]" />
              </div>

              <p className="text-[11.5px] text-gray-400">
                Tersisa 11 hari lagi untuk mencapai bonus kuartal.
              </p>
            </div>

            {/* Recent Orders Preview Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-card-elevated hover:shadow-card-hover hover:border-gray-300 transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-ink">Recent Orders</h3>
                <Link
                  to="/login"
                  className="text-[12px] font-bold text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  Lihat semua →
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {RECENT_ORDERS_PREVIEW.map((ord, idx) => (
                  <div
                    key={idx}
                    className="py-2.5 flex items-center justify-between text-xs hover:bg-gray-50/80 px-1 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-bold text-ink">{ord.customer}</div>
                      <div className="text-gray-400 font-normal text-[11px]">
                        {ord.sku}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2.5">
                      <span className="font-bold text-ink">{ord.price}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${ord.statusColor}`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OPERATIONS CAPABILITIES GRID SECTION                                   */}
      {/* ========================================================================= */}
      <section
        id="features"
        className="py-20 bg-[#FBFBFB] border-t border-gray-200/80 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              KAPABILITAS LENGKAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
              Semua operasi harian, tanpa spreadsheet.
            </h2>
            <p className="text-[15px] text-gray-600 mt-2.5">
              Didesain khusus untuk ritel sneaker dengan kecepatan, presisi stok, dan kontrol peran tanpa kompromi.
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] hover:border-black/30 hover:-translate-y-1 transition-all duration-300 space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 text-ink flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white group-hover:shadow-[0_6px_20px_rgba(17,17,17,0.35)] transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md shadow-2xs">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-ink group-hover:text-black transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[13.5px] text-gray-500 font-normal leading-relaxed mt-1.5">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3 Step Process Workflow */}
          <div className="mt-16 pt-12 border-t border-gray-200/70 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-gray-400">
                01
              </span>
              <h4 className="text-[16px] font-bold text-ink">Hubungkan katalog</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Impor atau input SKU 7 brand sneaker dengan varian ukuran dan stok awal.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-gray-400">
                02
              </span>
              <h4 className="text-[16px] font-bold text-ink">Baca performanya</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                KPI dan grafik otomatis terisi saat pesanan pertama masuk secara live.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-gray-400">
                03
              </span>
              <h4 className="text-[16px] font-bold text-ink">Jalankan operasinya</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Proses pesanan, update nomor resi pengiriman, dan kelola promosi instan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENT PRICING SECTION                                            */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle Ambient Backdrop Glow */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-black/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mb-14 text-left">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            PAKET LANGGANAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
            Harga yang ikut ukuran toko.
          </h2>
          <p className="text-[15px] text-gray-600 mt-2.5">
            Mulai gratis saat toko Anda masih kecil, naikkan saat volume pesanan bertambah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? "bg-[#111111] text-white border border-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] scale-[1.02] relative overflow-hidden group"
                  : "bg-white/90 backdrop-blur-sm text-ink border border-gray-200/90 shadow-card-elevated hover:shadow-card-hover hover:border-gray-400"
              }`}
            >
              {plan.featured && (
                <>
                  {/* Internal Ambient Lighting Spotlights inside dark card */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/15 transition-all duration-500" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />
                </>
              )}

              <div className="relative z-10">
                {/* Header & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      plan.featured ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {plan.name}
                  </span>
                  {plan.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-ink text-[10px] font-extrabold tracking-wider border border-white/20 shadow-md">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`text-[13px] font-medium ${
                      plan.featured ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  className={`text-[13px] mb-6 ${
                    plan.featured ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {plan.tagline}
                </p>

                {/* Feature List */}
                <ul className="space-y-3 pt-6 border-t border-gray-200/20 text-[13.5px]">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          plan.featured ? "text-white" : "text-black"
                        }`}
                      />
                      <span
                        className={
                          plan.featured ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button: Links directly to Sign In (/login) */}
              <div className="pt-8 relative z-10">
                <Link
                  to="/login"
                  className={`w-full text-center py-3 rounded-full font-bold text-[13.5px] block transition-all active:scale-95 cursor-pointer ${
                    plan.featured
                      ? "bg-white hover:bg-gray-100 text-ink shadow-[0_8px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
                      : "bg-gray-100 hover:bg-gray-200 text-ink hover:shadow-xs"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH IMPACT BOTTOM CTA BANNER                                          */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden border border-black/80 group">
          {/* Ambient Lighting Background Accents inside Banner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-white/[0.06] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.08] rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all duration-500" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto relative z-10 drop-shadow-sm">
            Siap melihat performa Shoesmu hari ini?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto relative z-10 font-normal">
            Buka Shoesmu Admin dan kelola seluruh operasional toko sneaker Anda dalam satu layar rapi.
          </p>

          <div className="pt-3 relative z-10">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-ink px-8 py-3.5 rounded-full font-extrabold text-[15px] shadow-[0_10px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>Buka Shoesmu Admin</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="border-t border-gray-200 bg-white py-12 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-ink lowercase">
              shoesmu.
            </span>
            <span className="text-xs text-gray-400">
              — Designed with Shoesmu Design System
            </span>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-medium text-gray-600">
            <Link to="/login" className="hover:text-black">
              Sign In
            </Link>
            <Link to="/dashboard" className="hover:text-black">
              Admin Console
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("brands")}
              className="hover:text-black cursor-pointer"
            >
              Brands
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pricing")}
              className="hover:text-black cursor-pointer"
            >
              Pricing
            </button>
          </div>

          <div className="text-xs text-gray-400">
            © 2026 Shoesmu Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

