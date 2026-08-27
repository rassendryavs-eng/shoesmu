import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Copy,
  Check,
  Trash2,
  Tag,
  Calendar,
  Sparkles,
  Percent,
  Truck,
  X,
  ChevronDown,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";
import Toast from "../components/common/Toast";
import clsx from "clsx";

const STATUS_CONFIG = {
  Active: {
    label: "Active",
    badgeClass: "bg-[#E8F8EE] text-[#0E8A38] hover:bg-[#D7F3E0] border border-[#B7EBCA]/60",
    dotClass: "bg-[#0E8A38]",
  },
  Scheduled: {
    label: "Scheduled",
    badgeClass: "bg-[#EAF3FF] text-[#1E70EB] hover:bg-[#D5E7FF] border border-[#BBD8FF]/60",
    dotClass: "bg-[#1E70EB]",
  },
  Ended: {
    label: "Ended",
    badgeClass: "bg-[#F1F3F5] text-[#6C757D] hover:bg-[#E5E8EB] border border-[#D9DDE1]/60",
    dotClass: "bg-[#6C757D]",
  },
};

const StatusDropdown = ({ currentStatus, onSelectStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 120;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setCoords({
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 160)),
    });
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isOpen) updatePosition();
    };

    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Active;

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 select-none ${config.badgeClass}`}
        title="Click to change status"
      >
        <span>{config.label}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="w-36 bg-white border border-gray-200/90 rounded-xl shadow-2xl z-[9999] p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {["Active", "Scheduled", "Ended"].map((st) => {
              const itemConfig = STATUS_CONFIG[st];
              const isSelected = st === currentStatus;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStatus(st);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-gray-100 text-gray-900 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${itemConfig.dotClass}`}
                    />
                    <span>{itemConfig.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-black shrink-0" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

export const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State for New Promotion Modal
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "percent",
    discountValue: "20",
    customDiscount: "",
    ends: "2026-12-31",
    status: "Active",
  });

  const toastTimeoutRef = useRef(null);

  const fetchPromos = async () => {
    setLoading(true);
    const data = await api.getPromotions();
    setPromotions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (toastData) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    const formatted =
      typeof toastData === "string" ? { message: toastData } : toastData;
    setToastMessage(formatted);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyCode = async (code, id) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopiedId(id);
    showToast({
      type: "copy",
      code,
      title: "Code Copied!",
      message: `Code "${code}" copied to clipboard`,
    });
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleUpdateStatus = async (id, newStatus, name) => {
    const updated = await api.updatePromotionStatus(id, newStatus);
    setPromotions(updated);
    showToast(`Campaign "${name}" status changed to ${newStatus}`);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPromotion) return;
    setActionLoading(true);
    try {
      const updated = await api.deletePromotion(deletingPromotion.id);
      setPromotions(updated);
      const name = deletingPromotion.name;
      setDeletingPromotion(null);
      showToast(`Promotion campaign "${name}" deleted.`);
    } catch (err) {
      console.error("Failed to delete promotion:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    let discountString = "-20%";
    if (formData.discountType === "percent") {
      discountString = `-${formData.discountValue}%`;
    } else if (formData.discountType === "shipping") {
      discountString = "Free ship";
    } else if (formData.discountType === "fixed") {
      discountString = `-$${formData.discountValue}`;
    } else {
      discountString = formData.customDiscount || "-10%";
    }

    const newPromo = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      discount: discountString,
      type: formData.discountType,
      used: 0,
      status: formData.status,
      ends: formData.ends || "2026-12-31",
    };

    await api.createPromotion(newPromo);
    await fetchPromos();
    setIsModalOpen(false);
    showToast(`Promotion "${newPromo.name}" created successfully!`);

    // Reset Form
    setFormData({
      name: "",
      code: "",
      discountType: "percent",
      discountValue: "20",
      customDiscount: "",
      ends: "2026-12-31",
      status: "Active",
    });
  };

  // Counts for Subtitle
  const activeCount = promotions.filter((p) => p.status === "Active").length;
  const scheduledCount = promotions.filter((p) => p.status === "Scheduled").length;

  return (
    <div className="space-y-6 font-sans">
      {/* Modern Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Header: Title, Subtitle, & "+ New promotion" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-ink tracking-tight leading-tight">
            Promotions
          </h1>
          <p className="text-[13.5px] text-gray-500 font-medium mt-1">
            {loading ? "Loading..." : `${activeCount} active · ${scheduledCount} scheduled`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111111] hover:bg-black text-white px-4 py-2.5 rounded-full font-bold text-[13px] inline-flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New promotion</span>
        </button>
      </div>

      {/* Main Promotions Card Container */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-[15px] font-bold text-ink leading-tight">
            All promotions
          </h2>
          <p className="text-[13px] text-gray-400 font-normal mt-0.5">
            Toggle to activate or end each campaign.
          </p>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
            <colgroup>
              <col className="w-[23%]" />
              <col className="w-[17%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-bold">CAMPAIGN</th>
                <th className="py-3 px-4 font-bold">CODE</th>
                <th className="py-3 px-4 font-bold">DISCOUNT</th>
                <th className="py-3 px-4 font-bold">USED</th>
                <th className="py-3 px-4 font-bold">STATUS</th>
                <th className="py-3 px-4 font-bold">ENDS</th>
                <th className="py-3 px-6 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13.5px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 text-sm">
                    Loading promotions data...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No promotions found. Click "+ New promotion" to create your first campaign.
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => (
                  <tr
                    key={promo.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* CAMPAIGN */}
                    <td className="py-4 px-6 font-bold text-ink truncate">
                      {promo.name}
                    </td>

                    {/* CODE with Modern Sleek Copy Pill */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyCode(promo.code, promo.id);
                        }}
                        className={clsx(
                          "inline-flex items-center justify-between gap-2 min-w-[100px] max-w-[125px] px-3 py-1.5 rounded-full font-mono text-[12px] font-bold tracking-wider border select-none cursor-pointer transition-all active:scale-95 group/btn",
                          copiedId === promo.id
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                            : "bg-gray-100/90 hover:bg-gray-200/80 text-gray-800 border-gray-200/90 hover:border-gray-300"
                        )}
                        title="Click to copy code"
                      >
                        <span className="truncate">{promo.code}</span>
                        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          {copiedId === promo.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-black transition-colors" />
                          )}
                        </span>
                      </button>
                    </td>

                    {/* DISCOUNT */}
                    <td className="py-4 px-4 font-semibold text-gray-900 truncate">
                      {promo.discount}
                    </td>

                    {/* USED */}
                    <td className="py-4 px-4 text-gray-600 font-medium truncate">
                      {promo.used !== undefined ? promo.used : 0}
                    </td>

                    {/* STATUS DROPDOWN */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusDropdown
                        currentStatus={promo.status}
                        onSelectStatus={(newStatus) =>
                          handleUpdateStatus(promo.id, newStatus, promo.name)
                        }
                      />
                    </td>

                    {/* ENDS */}
                    <td className="py-4 px-4 text-gray-500 font-medium truncate">
                      {promo.ends || "2026-12-31"}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end">
                        {/* Trash Delete Icon Only */}
                        <button
                          type="button"
                          onClick={() => setDeletingPromotion(promo)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete promotion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW PROMOTION (Matches Add Category Style)                      */}
      {/* ========================================================================= */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-ink">Add New Promotion</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-ink p-1 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Campaign Name & Code */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Summer Runners"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      placeholder="RUN20"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none font-mono uppercase transition-all"
                    />
                  </div>
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({ ...formData, discountType: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none cursor-pointer"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="shipping">Free Shipping</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      {formData.discountType === "percent"
                        ? "Percentage Off (%)"
                        : formData.discountType === "fixed"
                        ? "Amount Off ($)"
                        : "Value"}
                    </label>
                    {formData.discountType === "shipping" ? (
                      <input
                        type="text"
                        disabled
                        value="Free Shipping"
                        className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                      />
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max={formData.discountType === "percent" ? "100" : "1000"}
                        value={formData.discountValue}
                        onChange={(e) =>
                          setFormData({ ...formData, discountValue: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none transition-all"
                      />
                    )}
                  </div>
                </div>

                {/* End Date & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.ends}
                      onChange={(e) => setFormData({ ...formData, ends: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Initial Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink focus:bg-white focus:border-black outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Ended">Ended</option>
                    </select>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim() || !formData.code.trim()}
                    className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    Create Promotion
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* MODAL: Confirm Delete Promotion                                           */}
      {/* ========================================================================= */}
      {deletingPromotion &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setDeletingPromotion(null)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Delete Promotion?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Are you sure you want to remove promotion campaign <strong>{deletingPromotion.name}</strong> ({deletingPromotion.code})? Active discounts with this code will no longer apply.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPromotion(null)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-all active:scale-95 shadow-sm"
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

export default PromotionsPage;
