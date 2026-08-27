import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Search,
  Eye,
  ArrowRight,
  X,
  Check,
  Package,
  Calendar,
  DollarSign,
  User,
  Clock,
  Truck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Save,
  RotateCcw,
} from "lucide-react";
import useOrders from "../hooks/useOrders";
import api from "../services/api";
import OrderDetailModal from "../components/orders/OrderDetailModal";

const ORDER_STEPS = [
  { key: "Pending", label: "Pending", desc: "Order placed, awaiting confirmation" },
  { key: "Processing", label: "Processing", desc: "Items picked & packed in warehouse" },
  { key: "Shipped", label: "Shipped", desc: "Handed over to courier service" },
  { key: "Delivered", label: "Delivered", desc: "Package successfully arrived at customer" },
];

export const OrdersPage = () => {
  const { orders, loading, updateStatus, refresh } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Detail & Process Management Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalForm, setModalForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter orders by search & status
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "All" ||
      o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter(
    (o) => o.status.toLowerCase() === "pending"
  ).length;

  // Open Details Modal and clone order into editable form
  const handleOpenDetail = (order, e) => {
    e?.stopPropagation();
    setSelectedOrder(order);
    setModalForm({
      ...order,
      status: order.status,
      paymentStatus: order.paymentStatus || "Paid",
      trackingNumber: order.trackingNumber || `SM-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      courier: order.courier || "FedEx Express",
    });
  };

  // Handle Export Orders to CSV
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dateStr = new Date().toISOString().split("T")[0];
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Order ID,Customer Name,Customer Email,Total ($),Status,Payment,Date\r\n";

      orders.forEach((o) => {
        csv += `"${o.id}","${o.customer?.name || ''}","${o.customer?.email || ''}",${o.total},"${o.status}","${o.paymentStatus || 'Paid'}","${o.date || ''}"\r\n`;
      });

      const encodedUri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `shoesmu_orders_report_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      showToast("Orders report exported successfully!");
    }, 400);
  };

  // Save Modal Changes (Process / Status / Logistics)
  const handleSaveModalChanges = async (updatedOrder) => {
    if (!updatedOrder) return;
    setIsSaving(true);
    try {
      await api.updateOrder(updatedOrder);
      await refresh();
      setSelectedOrder(null);
      setModalForm(null);
      showToast(`Order ${updatedOrder.id} successfully updated to "${updatedOrder.status}"!`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update order. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status = "Pending") => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "processing":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
      case "canceled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadge = (payment = "Paid") => {
    switch (payment.toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "unpaid":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "refunded":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  // Get current step index (0 to 3)
  const getCurrentStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return -1;
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
      {/* HEADER: Title & Export Action                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-ink tracking-tight">
            Orders
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-0.5">
            {orders.length} total · {pendingCount} pending
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 active:scale-95 text-[13px] font-medium text-ink transition-all bg-white shadow-sm disabled:opacity-60 self-start sm:self-auto cursor-pointer"
        >
          {isExporting ? (
            <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-gray-600" />
          )}
          <span>{isExporting ? "Exporting..." : "Export"}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ALL ORDERS CARD CONTAINER                                                 */}
      {/* ========================================================================= */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
        {/* Card Header & Filter Status Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-bold text-ink">All orders</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Click view detail to manage customer fulfillment process.
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-full text-xs self-start sm:self-auto overflow-x-auto">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
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
              placeholder="Search order id, customer..."
              className="w-full bg-gray-100/90 rounded-lg pl-9 pr-4 h-9 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/10 border border-transparent transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">ORDER</th>
                <th className="pb-3 font-semibold">CUSTOMER</th>
                <th className="pb-3 font-semibold">TOTAL</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold">PAYMENT</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-black mb-2" />
                    <p className="text-xs">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={(e) => handleOpenDetail(ord, e)}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 font-bold text-ink">
                      {ord.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5">
                      <div>
                        <span className="font-bold text-[13.5px] text-ink block leading-tight">
                          {ord.customer?.name || "Anonymous Customer"}
                        </span>
                        <span className="text-[11.5px] text-gray-400 font-medium block leading-tight mt-0.5">
                          {ord.customer?.email || "customer@shoesmu.com"}
                        </span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 font-bold text-ink">
                      ${ord.total}
                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentBadge(
                          ord.paymentStatus || "Paid"
                        )}`}
                      >
                        {ord.paymentStatus || "Paid"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-gray-500 font-medium text-[12.5px]">
                      {ord.date}
                    </td>

                    {/* Actions: View detail button */}
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleOpenDetail(ord, e)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white hover:border-black hover:bg-black hover:text-white text-gray-700 text-xs font-semibold transition-all shadow-2xs group-hover:border-gray-400 cursor-pointer active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Comprehensive Modern Order Process & Details Management           */}
      {/* ========================================================================= */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => {
          setSelectedOrder(null);
          setModalForm(null);
        }}
        onSave={handleSaveModalChanges}
        isSaving={isSaving}
      />
    </div>
  );
};

export default OrdersPage;
