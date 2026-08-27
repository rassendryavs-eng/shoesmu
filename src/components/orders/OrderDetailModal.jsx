import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
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
  Copy,
  Printer,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  Building,
} from "lucide-react";
import CustomSelect from "../common/CustomSelect";

export const ORDER_STEPS = [
  {
    key: "Pending",
    label: "Pending",
    desc: "Awaiting confirmation",
    icon: Clock,
    color: "amber",
  },
  {
    key: "Processing",
    label: "Processing",
    desc: "Picking & packaging in warehouse",
    icon: Package,
    color: "sky",
  },
  {
    key: "Shipped",
    label: "Shipped",
    desc: "Handed over to courier service",
    icon: Truck,
    color: "indigo",
  },
  {
    key: "Delivered",
    label: "Delivered",
    desc: "Delivered to customer doorstep",
    icon: CheckCircle2,
    color: "emerald",
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

export const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "timeline"
  const [staffNote, setStaffNote] = useState("");

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        status: order.status || "Pending",
        paymentStatus: order.paymentStatus || "Paid",
        trackingNumber:
          order.trackingNumber ||
          `SM-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
        courier: order.courier || "FedEx Express",
        notes: order.notes || "",
      });
      setStaffNote(order.notes || "");
    }
  }, [order]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !formData) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  const currentStepIdx = getCurrentStepIndex(formData.status);

  // Status Badge Colors & Glow
  const getStatusTheme = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200/80",
          dot: "bg-amber-500",
          pulse: "bg-amber-400/40",
        };
      case "processing":
        return {
          badge: "bg-sky-50 text-sky-700 border-sky-200/80",
          dot: "bg-sky-500",
          pulse: "bg-sky-400/40",
        };
      case "shipped":
        return {
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
          dot: "bg-indigo-500",
          pulse: "bg-indigo-400/40",
        };
      case "delivered":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
          dot: "bg-emerald-500",
          pulse: "bg-emerald-400/40",
        };
      case "cancelled":
      case "canceled":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200/80",
          dot: "bg-rose-500",
          pulse: "bg-rose-400/40",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
          pulse: "bg-gray-300",
        };
    }
  };

  const statusTheme = getStatusTheme(formData.status);

  // Advance stage helper
  const handleAdvanceStep = () => {
    if (currentStepIdx < ORDER_STEPS.length - 1) {
      const nextStep = ORDER_STEPS[currentStepIdx + 1].key;
      setFormData((prev) => ({ ...prev, status: nextStep }));
    }
  };

  // Print Invoice Generator
  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = (formData.items || [
      {
        name: formData.productSummary || "Nike Air Max 270",
        brand: "Nike",
        size: "US 9.0",
        price: formData.total,
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
        <title>Invoice ${formData.id} — Shoesmu</title>
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
            <div style="font-size: 13px; color: #666; margin-top: 4px;">Order ID: <strong>${formData.id}</strong></div>
            <div style="font-size: 12px; color: #888;">Date: ${formData.date}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <strong style="color: #666; text-transform: uppercase; font-size: 11px;">Billed To / Ship To:</strong>
            <div style="font-weight: bold; font-size: 15px; margin-top: 4px;">${formData.customer?.name || "Customer"}</div>
            <div style="color: #555; margin-top: 2px;">${formData.customer?.email || "email@domain.com"}</div>
            <div style="color: #555;">${formData.customer?.phone || "+1 (555) 000-0000"}</div>
            <div style="color: #555; margin-top: 4px; max-width: 250px;">${formData.customer?.address || "Address not provided"}</div>
          </div>
          <div style="text-align: right;">
            <strong style="color: #666; text-transform: uppercase; font-size: 11px;">Order & Shipping Details:</strong>
            <div style="margin-top: 4px;">Fulfillment Status: <strong>${formData.status}</strong></div>
            <div>Payment: <strong>${formData.paymentStatus} (${formData.paymentMethod || "Card"})</strong></div>
            <div>Courier: <strong>${formData.courier || "FedEx Express"}</strong></div>
            <div>Tracking: <code style="font-family: monospace; background: #f0f0f0; padding: 2px 4px; border-radius: 4px;">${formData.trackingNumber || "N/A"}</code></div>
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
          <div class="totals-row"><span>Subtotal:</span><strong>$${(formData.subtotal || formData.total * 0.9).toFixed(2)}</strong></div>
          <div class="totals-row"><span>Shipping & Handling:</span><strong>$${(formData.shippingFee || 0).toFixed(2)}</strong></div>
          <div class="totals-row"><span>Estimated Tax:</span><strong>$0.00 (Included)</strong></div>
          <div class="totals-row grand-total"><span>Total Paid:</span><span>$${formData.total}</span></div>
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      notes: staffNote,
    });
  };

  const customerInitials = formData.customer?.name
    ? formData.customer.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CU";

  const totalItemsCount = (formData.items || []).reduce(
    (sum, item) => sum + (item.quantity || 1),
    formData.items ? 0 : 1
  );

  const modalNode = (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop Click Listener */}
      <div
        className="fixed inset-0 -z-10 bg-transparent"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 my-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] relative z-10">
        
        {/* ================================================================= */}
        {/* MODAL HEADER: Sleek Modern Branding & Quick Actions               */}
        {/* ================================================================= */}
        <div className="px-6 py-5 sm:px-7 border-b border-gray-100 bg-gradient-to-b from-gray-50/70 to-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Order ID Tag with Copy Button */}
              <div className="flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1 rounded-xl shadow-xs">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-tight">
                  {formData.id}
                </span>
                <button
                  type="button"
                  title="Copy Order ID"
                  onClick={() => handleCopy(formData.id, "orderId")}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  {copiedField === "orderId" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Pulsing Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${statusTheme.badge}`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusTheme.pulse}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${statusTheme.dot}`}
                  />
                </span>
                <span>{formData.status}</span>
              </div>

              {/* Payment Pill */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100/90 border border-gray-200/70 text-[11px] font-semibold text-gray-700">
                <CreditCard className="w-3 h-3 text-gray-500" />
                <span>{formData.paymentStatus}</span>
              </div>
            </div>

            {/* Sub-meta */}
            <p className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
              <span>Placed on <strong className="text-gray-700 font-semibold">{formData.date}</strong></span>
              <span>•</span>
              <span>Method: <strong className="text-gray-700 font-semibold">{formData.paymentMethod || "Credit Card"}</strong></span>
              <span>•</span>
              <span>{totalItemsCount} {totalItemsCount > 1 ? "items" : "item"}</span>
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrintInvoice}
              title="Print Invoice / Receipt"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:border-gray-300 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 hover:text-black flex items-center justify-center text-gray-500 transition-all cursor-pointer active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB CONTROLS (Overview vs Timeline/Notes)                          */}
        {/* ================================================================= */}
        <div className="px-6 sm:px-7 pt-3 pb-0 border-b border-gray-100 flex items-center gap-6 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 transition-all relative cursor-pointer ${
              activeTab === "overview"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Order Details & Fulfillment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`pb-2.5 transition-all relative flex items-center gap-1.5 cursor-pointer ${
              activeTab === "timeline"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>Activity Log & Staff Notes</span>
            {staffNote && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
        </div>

        {/* ================================================================= */}
        {/* SCROLLABLE MODAL CONTENT BODY                                     */}
        {/* ================================================================= */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {activeTab === "overview" ? (
            <>
              {/* ============================================================= */}
              {/* 1. VISUAL WORKFLOW FULFILLMENT PIPELINE STEPPER               */}
              {/* ============================================================= */}
              <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50/60 border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                        Fulfillment Pipeline
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {currentStepIdx >= 0 && currentStepIdx < ORDER_STEPS.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAdvanceStep}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900 hover:bg-black text-white text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span>Advance to {ORDER_STEPS[currentStepIdx + 1].label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                    <span className="text-[11px] text-gray-400 font-medium">
                      (Click any stage to update)
                    </span>
                  </div>
                </div>

                {/* Interactive Connected Step Pipeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {ORDER_STEPS.map((step, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    const isCurrent =
                      formData.status.toLowerCase() === step.key.toLowerCase();
                    const IconComp = step.icon;

                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, status: step.key })
                        }
                        className={`p-3 rounded-xl border text-left transition-all relative group cursor-pointer flex flex-col justify-between min-h-[90px] ${
                          isCurrent
                            ? "bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-black/10 scale-[1.02]"
                            : isPassed
                            ? "bg-emerald-50/60 border-emerald-300/80 text-emerald-950 hover:bg-emerald-50"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50/80"
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

                {/* Cancel / Refund Quick Action */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-200/60 text-xs">
                  <span className="text-gray-400 text-[11.5px] font-medium">
                    Exceptions & Overrides:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status:
                          formData.status.toLowerCase() === "cancelled"
                            ? "Pending"
                            : "Cancelled",
                        paymentStatus:
                          formData.status.toLowerCase() === "cancelled"
                            ? "Paid"
                            : "Refunded",
                      })
                    }
                    className={`px-3 py-1 rounded-full font-bold text-xs border transition-all cursor-pointer ${
                      formData.status.toLowerCase() === "cancelled"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                    }`}
                  >
                    {formData.status.toLowerCase() === "cancelled"
                      ? "✓ Order is Cancelled (Click to Restore)"
                      : "Cancel & Refund Order"}
                  </button>
                </div>
              </div>

              {/* ============================================================= */}
              {/* 2. BENTO GRID: Customer Info & Logistics / Payment Management  */}
              {/* ============================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Bento Card 1: Customer & Destination */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Customer & Recipient
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200/60">
                      Verified Buyer
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                      {customerInitials}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-extrabold text-sm text-gray-900 truncate">
                        {formData.customer?.name || "Customer"}
                      </p>
                      
                      {/* Email with copy */}
                      <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{formData.customer?.email || "customer@shoesmu.com"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(formData.customer?.email, "email")}
                          className="text-gray-400 hover:text-black transition-colors ml-1 cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedField === "email" ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Phone with copy */}
                      <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{formData.customer?.phone || "+1 (555) 234-8910"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(formData.customer?.phone, "phone")}
                          className="text-gray-400 hover:text-black transition-colors ml-1 cursor-pointer"
                          title="Copy Phone"
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

                  {/* Shipping Address Box */}
                  <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      <MapPin className="w-3 h-3 text-neutral-600" />
                      <span>Shipping Address</span>
                    </div>
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {formData.customer?.address || "742 Evergreen Terrace, Springfield, OR 97477"}
                    </p>
                  </div>
                </div>

                {/* Bento Card 2: Logistics & Payment Controls */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Logistics & Settlement
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-gray-400">
                      Editable Dispatch
                    </span>
                  </div>

                  {/* Courier Provider Custom Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">
                      Courier Provider
                    </label>
                    <CustomSelect
                      value={formData.courier}
                      onChange={(val) => setFormData({ ...formData, courier: val })}
                      options={COURIER_OPTIONS}
                      placeholder="Select Courier"
                    />
                  </div>

                  {/* Tracking Number with Copy & Live Simulation */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-600">
                        Tracking Number
                      </label>
                      <button
                        type="button"
                        onClick={() => handleCopy(formData.trackingNumber, "tracking")}
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        {copiedField === "tracking" ? "✓ Copied" : "Copy Code"}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.trackingNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trackingNumber: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-black outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Payment Status Custom Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">
                      Payment Settlement Status
                    </label>
                    <CustomSelect
                      value={formData.paymentStatus}
                      onChange={(val) => setFormData({ ...formData, paymentStatus: val })}
                      options={PAYMENT_OPTIONS}
                      placeholder="Select Payment Status"
                      buttonClassName={
                        formData.paymentStatus?.toLowerCase() === "paid"
                          ? "bg-emerald-50/80 border-emerald-300/80 text-emerald-900 focus:bg-white"
                          : formData.paymentStatus?.toLowerCase() === "refunded"
                          ? "bg-rose-50/80 border-rose-300/80 text-rose-900 focus:bg-white"
                          : "bg-amber-50/80 border-amber-300/80 text-amber-900 focus:bg-white"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* 3. ORDERED FOOTWEAR ITEMS BREAKDOWN                           */}
              {/* ============================================================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      Purchased Items ({formData.items?.length || 1})
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Total Qty: <strong>{totalItemsCount} units</strong>
                  </span>
                </div>

                <div className="border border-gray-200/90 rounded-2xl divide-y divide-gray-100 overflow-hidden bg-white shadow-2xs">
                  {(formData.items || [
                    {
                      name: formData.productSummary || "Nike Air Max 270",
                      brand: "Nike",
                      size: "US 9.0",
                      price: formData.total,
                      quantity: 1,
                      image:
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
                    },
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Sneaker Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/80 shrink-0 relative">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title & Tags */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-white font-black text-[10px] uppercase tracking-wider">
                              {item.brand || "Nike"}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">
                              #SKU-{1000 + idx * 42}
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
                            <span className="font-medium text-gray-600">
                              ${item.price} each
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Line Item Total */}
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

              {/* ============================================================= */}
              {/* 4. FINANCIAL BREAKDOWN RECEIPT CARD                            */}
              {/* ============================================================= */}
              <div className="bg-gradient-to-br from-gray-50 to-neutral-100/80 border border-gray-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
                  <span className="font-medium">Items Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${(formData.subtotal || formData.total * 0.9).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
                  <span className="font-medium">Shipping & Logistics</span>
                  <span className="font-bold text-gray-900">
                    {formData.shippingFee ? `$${formData.shippingFee}.00` : "Free Delivery"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pb-2 border-b border-gray-200/60">
                  <span className="font-medium">Estimated Taxes & Duties</span>
                  <span className="font-bold text-emerald-700">Included ($0.00)</span>
                </div>

                {/* Grand Total */}
                <div className="pt-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">
                      Total Order Amount
                    </span>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Settled via {formData.paymentMethod || "Card"}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight block">
                      ${formData.total}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* =============================================================== */
            /* TAB 2: TIMELINE ACTIVITY & STAFF INTERNAL NOTES                 */
            /* =============================================================== */
            <div className="space-y-6">
              {/* Activity Timeline */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Order Event Log
                  </h4>
                </div>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-gray-900">
                      Order #{formData.id} created successfully
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formData.date} · Automatic confirmation sent to customer
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-gray-900">
                      Payment Settled (${formData.total})
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Processed through Stripe Merchant · Verified 3D Secure
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                        currentStepIdx >= 1 ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                    <p className="text-xs font-bold text-gray-900">
                      Warehouse Packing & Quality Check
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Shoe inspection complete · Packed in eco-friendly shoe box
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                        currentStepIdx >= 2 ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    />
                    <p className="text-xs font-bold text-gray-900">
                      Dispatched with {formData.courier || "FedEx Express"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Tracking: {formData.trackingNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Staff Notes Box */}
              <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-700" />
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Internal Staff Notes (Admin Only)
                  </h4>
                </div>
                <textarea
                  rows={3}
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="Add any packaging notes, special delivery instructions, or customer requests..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-black outline-none transition-all resize-none font-medium"
                />
                <p className="text-[11px] text-gray-400">
                  These notes will only be visible to Shoesmu operations staff.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* MODAL FOOTER: Actions & Save Process                              */}
        {/* ================================================================= */}
        <div className="px-6 py-4 sm:px-7 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleFormSubmit}
              className="px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-black disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Update Process</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default OrderDetailModal;
