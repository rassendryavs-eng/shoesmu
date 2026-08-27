import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Package,
  ChevronRight,
  Truck,
  Clock,
  CheckCircle2,
  Copy,
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  Save,
  RotateCcw,
} from "lucide-react";
import Breadcrumb from "../components/navigation/Breadcrumb";
import CustomSelect from "../components/common/CustomSelect";
import Toast from "../components/common/Toast";
import api from "../services/api";

const ORDER_STEPS = [
  {
    key: "Pending",
    label: "Pending",
    desc: "Awaiting confirmation",
    icon: Clock,
  },
  {
    key: "Processing",
    label: "Processing",
    desc: "Picking & packaging in warehouse",
    icon: Package,
  },
  {
    key: "Shipped",
    label: "Shipped",
    desc: "In transit with courier",
    icon: Truck,
  },
  {
    key: "Delivered",
    label: "Delivered",
    desc: "Delivered to customer doorstep",
    icon: CheckCircle2,
  },
];

const COURIER_OPTIONS = [
  {
    value: "FedEx Express",
    label: "FedEx Express (Standard Air)",
    tag: "Express",
    desc: "Fast 2-3 business days air delivery",
    iconNode: (
      <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-black text-[9.5px]">
        FX
      </span>
    ),
  },
  {
    value: "DHL Express",
    label: "DHL Express Worldwide",
    tag: "Priority",
    desc: "Global priority air courier with tracking",
    iconNode: (
      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-black text-[9.5px]">
        DHL
      </span>
    ),
  },
  {
    value: "UPS Ground",
    label: "UPS Ground Logistics",
    tag: "Ground",
    desc: "Reliable overland road freight & handling",
    iconNode: (
      <span className="w-5 h-5 rounded-md bg-amber-950/10 text-amber-950 flex items-center justify-center font-black text-[9.5px]">
        UPS
      </span>
    ),
  },
  {
    value: "USPS Priority",
    label: "USPS Priority Mail",
    tag: "Postal",
    desc: "Domestic postal priority mail service",
    iconNode: (
      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[9.5px]">
        US
      </span>
    ),
  },
  {
    value: "J&T Express",
    label: "J&T Express International",
    tag: "Global",
    desc: "Cross-border parcel & courier dispatch",
    iconNode: (
      <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[9.5px]">
        J&T
      </span>
    ),
  },
];

const PAYMENT_OPTIONS = [
  {
    value: "Paid",
    label: "Paid & Settled (Stripe)",
    tag: "Settled",
    desc: "Funds captured & verified via 3D Secure",
    iconNode: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  },
  {
    value: "Unpaid",
    label: "Unpaid (Awaiting Payment)",
    tag: "Pending",
    desc: "Awaiting customer checkout settlement",
    iconNode: <Clock className="w-4 h-4 text-amber-600" />,
  },
  {
    value: "Refunded",
    label: "Refunded (Returned to Customer)",
    tag: "Returned",
    desc: "Transaction reversed & refunded to customer",
    iconNode: <RotateCcw className="w-4 h-4 text-rose-600" />,
  },
];

const getCurrentStepIndex = (status) => {
  const s = status?.toLowerCase() || "";
  if (s === "pending") return 0;
  if (s === "processing") return 1;
  if (s === "shipped") return 2;
  if (s === "delivered") return 3;
  return -1;
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (toastData) => {
    const formatted =
      typeof toastData === "string" ? { message: toastData } : toastData;
    setToastMessage(formatted);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrder = async () => {
    setLoading(true);
    const data = await api.getOrderById(id);
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast({
      type: "copy",
      code: text,
      title: "Copied to clipboard!",
      message: `${fieldName || "Code"} copied successfully.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.updateOrderStatus(order.id, newStatus);
      await fetchOrder();
      showToast(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateField = async (field, value) => {
    if (!order) return;
    const updated = { ...order, [field]: value };
    try {
      await api.updateOrder(updated);
      setOrder(updated);
      showToast(`Updated ${field} successfully!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintInvoice = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = (order.items || [
      {
        name: order.productSummary || "Nike Air Max 270",
        brand: "Nike",
        size: "US 9.0",
        price: order.total,
        quantity: 1,
      },
    ])
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0;">
            <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
            <div style="font-size: 12px; color: #707072;">Brand: ${item.brand || "Nike"} | Size: ${item.size || "US 9.0"}</div>
          </td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px;">${item.quantity || 1}</td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px;">$${item.price}</td>
          <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 14px;">$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.id} — Shoesmu</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.03em; }
          .invoice-title { font-size: 20px; font-weight: bold; text-align: right; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 10px 0; border-bottom: 1px solid #ddd; font-size: 12px; color: #707072; text-transform: uppercase; }
          .totals { margin-left: auto; width: 280px; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .grand-total { border-top: 2px solid #111; padding-top: 10px; margin-top: 6px; font-size: 18px; font-weight: 900; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SHOESMU.</div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">Official Footwear Distribution Admin</p>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div style="font-size: 13px; color: #666; margin-top: 4px;">Order ID: <strong>${order.id}</strong></div>
            <div style="font-size: 12px; color: #888;">Date: ${order.date}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <strong style="color: #666; text-transform: uppercase; font-size: 11px;">Billed To / Ship To:</strong>
            <div style="font-weight: bold; font-size: 15px; margin-top: 4px;">${order.customer?.name || "Customer"}</div>
            <div style="color: #555; margin-top: 2px;">${order.customer?.email || "email@domain.com"}</div>
            <div style="color: #555;">${order.customer?.phone || "+1 (555) 000-0000"}</div>
            <div style="color: #555; margin-top: 4px; max-width: 250px;">${order.customer?.address || "Address not provided"}</div>
          </div>
          <div style="text-align: right;">
            <strong style="color: #666; text-transform: uppercase; font-size: 11px;">Order & Shipping Details:</strong>
            <div style="margin-top: 4px;">Fulfillment Status: <strong>${order.status}</strong></div>
            <div>Payment: <strong>${order.paymentStatus || "Paid"} (${order.paymentMethod || "Card"})</strong></div>
            <div>Courier: <strong>${order.courier || "FedEx Express"}</strong></div>
            <div>Tracking: <code style="font-family: monospace; background: #f0f0f0; padding: 2px 4px; border-radius: 4px;">${order.trackingNumber || "N/A"}</code></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Item & Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Subtotal:</span><strong>$${(order.subtotal || order.total * 0.9).toFixed(2)}</strong></div>
          <div class="totals-row"><span>Shipping & Handling:</span><strong>$${(order.shippingFee || 0).toFixed(2)}</strong></div>
          <div class="totals-row"><span>Estimated Tax:</span><strong>$0.00 (Included)</strong></div>
          <div class="totals-row grand-total"><span>Total Paid:</span><span>$${order.total}</span></div>
        </div>

        <div class="footer">
          Thank you for choosing Shoesmu. For customer support, visit support@shoesmu.com.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-black mb-3" />
        <p className="text-xs font-semibold">Loading order #{id}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-lg font-bold text-gray-900">Order not found</p>
        <Link to="/orders" className="inline-block">
          <button className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold shadow-sm">
            Back to Orders
          </button>
        </Link>
      </div>
    );
  }

  const stepIdx = getCurrentStepIndex(order.status);

  const customerInitials = order.customer?.name
    ? order.customer.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CU";

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-ink pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-[13px] font-bold">{toastMessage}</p>
        </div>
      )}

      <Breadcrumb
        items={[{ label: "Orders", path: "/orders" }, { label: order.id }]}
      />

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-7">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <Link to="/orders">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer active:scale-95">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                  Order {order.id}
                </h3>
                <button
                  type="button"
                  title="Copy Order ID"
                  onClick={() => handleCopy(order.id, "orderId")}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer p-0.5"
                >
                  {copiedField === "orderId" ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white shadow-xs">
                  {order.status}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {order.paymentStatus || "Paid"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {order.date} · Paid via {order.paymentMethod || "Credit Card"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            {stepIdx >= 0 && stepIdx < ORDER_STEPS.length - 1 && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(ORDER_STEPS[stepIdx + 1].key)}
                className="bg-neutral-950 hover:bg-black text-white px-5 py-2.5 rounded-full font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>Advance to {ORDER_STEPS[stepIdx + 1].label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Fulfillment Stepper */}
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50/60 border border-gray-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-700" />
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Fulfillment Stage
              </h4>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Click stage to update
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ORDER_STEPS.map((step, idx) => {
              const isPassed = stepIdx >= idx;
              const isCurrent =
                order.status.toLowerCase() === step.key.toLowerCase();
              const IconComp = step.icon;

              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => handleUpdateStatus(step.key)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative group cursor-pointer flex flex-col justify-between min-h-[95px] ${
                    isCurrent
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-black/10 scale-[1.02]"
                      : isPassed
                      ? "bg-emerald-50/60 border-emerald-300/80 text-emerald-950 hover:bg-emerald-50"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isCurrent
                          ? "bg-white/15 text-white"
                          : isPassed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isCurrent
                          ? "bg-white/20 text-white"
                          : isPassed
                          ? "bg-emerald-200/80 text-emerald-800"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      Step {idx + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold leading-tight truncate">
                      {step.label}
                    </p>
                    <p
                      className={`text-[10.5px] mt-0.5 leading-tight line-clamp-1 ${
                        isCurrent
                          ? "text-gray-300"
                          : isPassed
                          ? "text-emerald-700 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Customer & Recipient
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/60">
                Verified Buyer
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                {customerInitials}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-extrabold text-sm text-gray-900 truncate">
                  {order.customer?.name || "Customer"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{order.customer?.email || "customer@shoesmu.com"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer?.email, "email")}
                    className="text-gray-400 hover:text-black cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="truncate">{order.customer?.phone || "+1 (555) 234-8910"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.customer?.phone, "phone")}
                    className="text-gray-400 hover:text-black cursor-pointer"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                <MapPin className="w-3 h-3 text-neutral-600" />
                <span>Shipping Address</span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {order.customer?.address || "742 Evergreen Terrace, Springfield, OR 97477"}
              </p>
            </div>
          </div>

          {/* Logistics & Payment Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Logistics & Settlement
                </span>
              </div>
              <span className="text-[10.5px] font-semibold text-gray-400">
                Interactive Controls
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Courier Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Courier Provider
                </label>
                <CustomSelect
                  value={order.courier || "FedEx Express"}
                  onChange={(val) => handleUpdateField("courier", val)}
                  options={COURIER_OPTIONS}
                />
              </div>

              {/* Tracking Number */}
              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-gray-500 font-medium">Tracking Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900">
                    {order.trackingNumber || "SM-TRK-9902"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.trackingNumber || "SM-TRK-9902", "tracking")}
                    className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedField === "tracking" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Payment Status Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Payment Status
                </label>
                <CustomSelect
                  value={order.paymentStatus || "Paid"}
                  onChange={(val) => handleUpdateField("paymentStatus", val)}
                  options={PAYMENT_OPTIONS}
                  buttonClassName={
                    (order.paymentStatus || "Paid").toLowerCase() === "paid"
                      ? "bg-emerald-50/80 border-emerald-300/80 text-emerald-900"
                      : (order.paymentStatus || "Paid").toLowerCase() === "refunded"
                      ? "bg-rose-50/80 border-rose-300/80 text-rose-900"
                      : "bg-amber-50/80 border-amber-300/80 text-amber-900"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Footwear Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
              Purchased Footwear ({order.items?.length || 1})
            </h4>
          </div>

          <div className="border border-gray-200/90 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white shadow-2xs">
            {(order.items || [
              {
                name: order.productSummary || "Nike Air Max 270",
                brand: "Nike",
                size: "US 9.0",
                price: order.total,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
              },
            ]).map((item, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/80 shrink-0">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-white font-black text-[10px] uppercase tracking-wider">
                        {item.brand || "Nike"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold">
                        Size: {item.size || "US 9.0"}
                      </span>
                      <span>Qty: <strong className="text-gray-900">{item.quantity || 1}</strong></span>
                      <span>•</span>
                      <span>${item.price} each</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-gray-900 block">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <span className="text-[10.5px] text-emerald-600 font-semibold block">
                    In Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-gradient-to-br from-gray-50 to-neutral-100/80 border border-gray-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
            <span className="font-medium">Items Subtotal</span>
            <span className="font-bold text-gray-900">
              ${(order.subtotal || order.total * 0.9).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
            <span className="font-medium">Shipping & Logistics</span>
            <span className="font-bold text-gray-900">
              {order.shippingFee ? `$${order.shippingFee}.00` : "Free Delivery"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
            <span className="font-medium">Estimated Taxes & Duties</span>
            <span className="font-bold text-emerald-700">Included ($0.00)</span>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">
                Total Order Amount
              </span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Settled via {order.paymentMethod || "Card"}</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight block">
                ${order.total}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Modern Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default OrderDetailPage;
