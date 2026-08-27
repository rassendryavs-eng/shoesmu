import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Plus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import useDashboard from "../hooks/useDashboard";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatNumber } from "../config/constants";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Custom Floating Tooltip for Monthly Sales Line Chart
const MonthlySalesTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.isPositive !== false;
    return (
      <div className="bg-white px-4 py-3 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-gray-100/90 text-left pointer-events-none min-w-[140px] animate-in fade-in duration-150">
        <p className="text-[12.5px] font-bold text-gray-900 leading-tight">
          {data.fullMonth || `${data.month} 2026`}
        </p>
        <p className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
          {data.sublabel || "Monthly Performance"}
        </p>
        <p className="text-[20px] font-bold text-ink tracking-tight leading-tight my-1">
          ${formatNumber(data.revenue || 0)}
        </p>
        <div
          className={`inline-flex items-center gap-0.5 text-[11.5px] font-bold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>{data.growth || "+8.4%"}</span>
          <span>{isPositive ? "↗" : "↘"}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Dark Tooltip for Category Bar Chart
const CategoryBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#111111] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-neutral-800 pointer-events-none min-w-[130px] animate-in fade-in duration-150">
        <p className="text-[13px] font-bold text-white leading-tight">
          {data.category}
        </p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {data.sublabel || "Category"}
        </p>
        <p className="text-[18px] font-extrabold text-white tracking-tight my-0.5 leading-tight">
          {formatNumber(data.count || 0)} <span className="text-xs font-normal text-gray-400">pairs</span>
        </p>
        <div className="flex items-center justify-between text-[11px] pt-1 mt-1 border-t border-neutral-800 gap-3">
          <span className="text-gray-400">Share: <strong className="text-white">{data.share || "13.0%"}</strong></span>
          <span className={data.isPositive !== false ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            {data.growth || "+5.1%"} {data.isPositive !== false ? "↗" : "↘"}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Floating Tooltip for Daily Revenue Area Chart
const DailyRevenueTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.isPositive !== false;
    return (
      <div className="bg-white px-4 py-3 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-gray-100/90 text-left pointer-events-none min-w-[135px] animate-in fade-in duration-150">
        <p className="text-[12.5px] font-bold text-gray-900 leading-tight">
          {data.fullDate || `Day ${data.day} · Aug 2026`}
        </p>
        <p className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
          Daily Revenue
        </p>
        <p className="text-[20px] font-bold text-ink tracking-tight leading-tight my-1">
          ${formatNumber(data.revenue || 0)}
        </p>
        <div
          className={`inline-flex items-center gap-0.5 text-[11.5px] font-bold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>{data.growth || "+12.7%"}</span>
          <span>{isPositive ? "↗" : "↘"}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Helper for status badge styling matching Figma
const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Processing":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "Shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Canceled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentBadge = (payment) => {
  switch (payment) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Refunded":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const DashboardPage = () => {
  const { kpis, charts, loading, error, refresh } = useDashboard();
  const { currentUser } = useAuth();
  const [salesTimeframe, setSalesTimeframe] = useState("12M");
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  const firstName = currentUser?.name ? currentUser.name.split(" ")[0] : "Alex";

  // Top KPI Metric Array
  const kpiCards = [
    {
      title: "TOTAL REVENUE",
      value: "$118,400",
      change: "12.4%",
      subtext: "vs last month",
      isPositive: true,
    },
    {
      title: "TOTAL ORDERS",
      value: "831",
      change: "8.3%",
      subtext: "vs last month",
      isPositive: true,
    },
    {
      title: "CUSTOMERS",
      value: "2,148",
      change: "3.2%",
      subtext: "new this month",
      isPositive: true,
    },
    {
      title: "PRODUCTS SOLD",
      value: "1,942",
      change: "1.2%",
      subtext: "vs last month",
      isPositive: false,
    },
    {
      title: "MONTHLY PROFIT",
      value: "$38,620",
      change: "9.6%",
      subtext: "margin 32.6%",
      isPositive: true,
    },
  ];

  // Handle Export Dashboard Data to CSV
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dateStr = new Date().toISOString().split("T")[0];
      let csv = "data:text/csv;charset=utf-8,";
      
      csv += "=== SHOESMU ADMIN DASHBOARD OVERVIEW REPORT ===\r\n";
      csv += `Generated On: ${new Date().toLocaleString()}\r\n`;
      csv += `Generated By: ${currentUser?.name || "Alex Rivera"} (${currentUser?.roleLabel || "Super Admin"})\r\n\r\n`;

      csv += "--- STORE KPIS ---\r\n";
      csv += "KPI,Value,Change,Comparison\r\n";
      kpiCards.forEach((c) => {
        csv += `"${c.title}","${c.value}","${c.change}","${c.subtext}"\r\n`;
      });
      csv += "\r\n";

      csv += "--- MONTHLY SALES ---\r\n";
      csv += "Month,Revenue ($),Growth Rate\r\n";
      (charts?.monthlySales || []).forEach((m) => {
        csv += `"${m.month}",${m.revenue},"${m.growth || 'N/A'}"\r\n`;
      });
      csv += "\r\n";

      csv += "--- BEST-SELLING PRODUCTS ---\r\n";
      csv += "Product,Brand,Price ($),Units Sold,Stock Status\r\n";
      (charts?.bestSellingProducts || []).forEach((p) => {
        csv += `"${p.name}","${p.brand}",${p.price},${p.sold},"${p.stockLeft} left of ${p.stockTotal}"\r\n`;
      });
      csv += "\r\n";

      csv += "--- RECENT ORDERS ---\r\n";
      csv += "Order ID,Customer,Total ($),Status,Payment\r\n";
      (charts?.recentOrders || []).forEach((o) => {
        csv += `"${o.id}","${o.customer}",${o.total},"${o.status}","${o.payment}"\r\n`;
      });

      const encodedUri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `shoesmu_overview_report_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportToast(true);
      setTimeout(() => setExportToast(false), 4000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-mute font-sans">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-ink mb-3" />
        <p className="text-[13px] font-medium text-gray-500">Loading Dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center font-sans space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <p className="text-base font-bold text-gray-900">Failed to load dashboard metrics</p>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold shadow-sm hover:bg-neutral-800 transition-all cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  // Filter monthly sales data according to timeframe selection
  const getFilteredMonthlySales = () => {
    const allData = charts?.monthlySales || [];
    if (salesTimeframe === "1M") return allData.slice(-2);
    if (salesTimeframe === "3M") return allData.slice(-3);
    if (salesTimeframe === "6M") return allData.slice(-6);
    return allData;
  };

  return (
    <div className="space-y-6 font-sans text-ink pb-12 relative">
      {/* Toast Notification when Export is Complete */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-gray-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-extrabold text-xs shrink-0">
            ✓
          </div>
          <div>
            <p className="text-[13px] font-bold">Report Exported Successfully</p>
            <p className="text-[11px] text-gray-400">CSV file downloaded to your computer</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER: Greeting & Quick Action Buttons                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-ink tracking-tight">
            Good morning, {firstName}.
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-0.5">
            Here's how Shoesmu is performing this month — updated moments ago.
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
      {/* ROW 1: 5 Top KPI Cards                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              {card.title}
            </span>
            <div className="my-2.5">
              <span className="text-2xl sm:text-[26px] font-bold text-ink tracking-tight">
                {card.value}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  card.isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {card.isPositive ? "▲" : "▼"} {card.change}
              </span>
              <span className="text-gray-400 font-normal">{card.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: Monthly Sales Line Chart & Brand Mix Donut Chart                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Sales (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-ink">Monthly Sales</h2>
              <p className="text-[12px] text-gray-400">Revenue by month — last 12 months</p>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center bg-gray-100/70 p-0.5 rounded-full text-xs">
              {["1M", "3M", "6M", "12M"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSalesTimeframe(tab)}
                  className={`px-3 py-0.5 rounded-full font-semibold transition-all ${
                    salesTimeframe === tab
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <AreaChart
                data={getFilteredMonthlySales()}
                margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  {/* Subtle soft gradient fade under the line */}
                  <linearGradient id="monthlySalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111111" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#111111" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F2" />
                <XAxis
                  dataKey="month"
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <YAxis
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 130000]}
                  ticks={[0, 30000, 60000, 90000, 120000]}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  content={<MonthlySalesTooltip />}
                  cursor={{ stroke: "#111111", strokeWidth: 1.5, strokeDasharray: "3 3" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111111"
                  strokeWidth={2.2}
                  fill="url(#monthlySalesGradient)"
                  dot={{ fill: "#111111", r: 3.5, strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#FFFFFF",
                    stroke: "#111111",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Mix Donut Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-ink">Brand Mix</h2>
            <p className="text-[12px] text-gray-400">Share of units sold this month</p>
          </div>

          <div className="flex items-center justify-between gap-2 my-auto py-2">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <PieChart>
                  <Pie
                    data={charts?.salesDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="percentage"
                  >
                    {(charts?.salesDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(val) => [`${val}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2 text-xs">
              {(charts?.salesDistribution || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700 font-medium">{item.brand}</span>
                  </div>
                  <span className="font-bold text-ink">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: Best-Selling Categories Bar Chart & Daily Revenue Spline Area Chart */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Best-Selling Categories */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-[15px] font-bold text-ink">Best-Selling Categories</h2>
            <p className="text-[12px] text-gray-400">Units sold this month</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <BarChart
                data={charts?.categorySales || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F2" />
                <XAxis
                  dataKey="category"
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <YAxis
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 6000]}
                  ticks={[0, 1500, 3000, 4500, 6000]}
                />
                <Tooltip
                  content={<CategoryBarTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.08)", radius: [4, 4, 0, 0] }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar
                  dataKey="count"
                  fill="#111111"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-[15px] font-bold text-ink">Daily Revenue</h2>
            <p className="text-[12px] text-gray-400">Last 14 days</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <AreaChart
                data={charts?.dailyRevenue || []}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dailyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111111" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#111111" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F2" />
                <XAxis
                  dataKey="day"
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E5E5" }}
                />
                <YAxis
                  stroke="#9E9EA0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 3200]}
                  ticks={[0, 800, 1600, 2400, 3200]}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  content={<DailyRevenueTooltip />}
                  cursor={{ stroke: "#111111", strokeWidth: 1.5, strokeDasharray: "3 3" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111111"
                  strokeWidth={2.2}
                  fill="url(#dailyRevenueGradient)"
                  dot={{ fill: "#111111", r: 3, strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    fill: "#FFFFFF",
                    stroke: "#111111",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: Best-Selling Products Table & Monthly Sales Goal Gauge Card        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Best-Selling Products Table (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-ink">Best-Selling Products</h2>
                <p className="text-[12px] text-gray-400">Top 5 by units sold this month</p>
              </div>

              <Link
                to="/products"
                className="text-[12px] font-semibold text-gray-600 hover:text-ink flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">PRODUCT</th>
                    <th className="pb-3 font-semibold">BRAND</th>
                    <th className="pb-3 font-semibold">PRICE</th>
                    <th className="pb-3 font-semibold">SOLD</th>
                    <th className="pb-3 font-semibold">STOCK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(charts?.bestSellingProducts || []).map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-bold text-ink flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#F4F4F6] flex items-center justify-center shrink-0 border border-gray-200/60">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-[11px] font-bold text-gray-600">
                              {prod.badge || prod.name?.charAt(0) || "P"}
                            </span>
                          )}
                        </div>
                        <span className="truncate max-w-[200px]">{prod.name}</span>
                      </td>
                      <td className="py-3 text-gray-500 font-medium">{prod.brand}</td>
                      <td className="py-3 font-bold text-ink">${prod.price}</td>
                      <td className="py-3 font-bold text-ink">{prod.sold}</td>
                      <td className="py-3">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-500 font-medium">
                              {prod.stockLeft} left
                            </span>
                            {prod.isLowStock ? (
                              <span className="text-rose-600 font-bold">Low stock</span>
                            ) : (
                              <span className="text-gray-400 font-normal">of {prod.stockTotal}</span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prod.isLowStock ? "bg-rose-500" : "bg-black"
                              }`}
                              style={{ width: `${(prod.stockLeft / prod.stockTotal) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monthly Sales Goal Gauge Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-ink">Monthly Sales Goal</h2>
            <p className="text-[12px] text-gray-400">
              {charts?.salesGoal?.targetMonth || "December"} target: ${formatNumber(charts?.salesGoal?.target || 150000)}
            </p>
          </div>

          {/* Radial Circular Progress Display */}
          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#EFEFEF"
                  strokeWidth="9"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#111111"
                  strokeWidth="9"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - (charts?.salesGoal?.percentage || 68) / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-ink leading-none">
                  {charts?.salesGoal?.percentage || 68}%
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  OF GOAL
                </span>
              </div>
            </div>

            <p className="text-center text-[12px] text-gray-500 mt-3 px-2 leading-relaxed">
              You've hit <span className="font-bold text-ink">{charts?.salesGoal?.percentage || 68}%</span> of this month's goal. About ${formatNumber(charts?.salesGoal?.remaining || 48000)} to go with {charts?.salesGoal?.remainingDays || 11} days left.
            </p>
          </div>

          {/* Target Split Statistics */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-center">
            <div className="p-2 bg-gray-50 rounded-lg">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                ACHIEVED
              </span>
              <span className="text-base font-extrabold text-ink">
                ${formatNumber(charts?.salesGoal?.current || 102000)}
              </span>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                REMAINING
              </span>
              <span className="text-base font-extrabold text-ink">
                ${formatNumber(charts?.salesGoal?.remaining || 48000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 5: Recent Orders Table & Recent Activities Timeline                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders Table (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-ink">Recent Orders</h2>
                <p className="text-[12px] text-gray-400">Latest 5 orders across the store</p>
              </div>

              <Link
                to="/orders"
                className="text-[12px] font-semibold text-gray-600 hover:text-ink flex items-center gap-1 transition-colors"
              >
                <span>Go to Orders</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">ORDER</th>
                    <th className="pb-3 font-semibold">CUSTOMER</th>
                    <th className="pb-3 font-semibold">TOTAL</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold">PAYMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(charts?.recentOrders || []).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-bold text-ink">{order.id}</td>
                      <td className="py-3 text-gray-700 font-medium">{order.customer}</td>
                      <td className="py-3 font-bold text-ink">${order.total}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentBadge(
                            order.payment
                          )}`}
                        >
                          {order.payment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-ink">Recent Activities</h2>
            <p className="text-[12px] text-gray-400 mb-4">Store-wide operational events</p>

            <div className="space-y-4">
              {(charts?.recentActivities || []).map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-black mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-ink leading-snug">
                      {act.title}
                    </p>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER: Design System & Preview Tag                                       */}
      {/* ========================================================================= */}
      <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 font-mono">
        <div>
          Shoesmu Admin v1.0 · Design System: Nike Umbro · ink · canvas · soft-cloud · hairline
        </div>
        <div>Sample data for preview</div>
      </div>
    </div>
  );
};

export default DashboardPage;
