import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShoppingBag,
  AlertTriangle,
  CreditCard,
  User,
  Sparkles,
  X,
  Clock,
  Inbox,
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "../../data/mockData";

export const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("shoesmu_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_NOTIFICATIONS;
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem("shoesmu_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "orders") return n.type === "order";
    if (activeFilter === "alerts") return n.type === "stock" || n.type === "payment";
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case "stock":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "customer":
        return <User className="w-4 h-4 text-purple-600" />;
      case "system":
      default:
        return <Sparkles className="w-4 h-4 text-ink" />;
    }
  };

  const getTypeBadgeBg = (type) => {
    switch (type) {
      case "order":
        return "bg-emerald-50 border-emerald-200/60";
      case "stock":
        return "bg-amber-50 border-amber-200/60";
      case "payment":
        return "bg-blue-50 border-blue-200/60";
      case "customer":
        return "bg-purple-50 border-purple-200/60";
      case "system":
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-full border border-gray-200/80 bg-white hover:bg-gray-100 text-gray-700 active:scale-95 flex items-center justify-center transition-all shadow-2xs"
      >
        <Bell className={`w-4 h-4 text-gray-700 transition-transform ${isOpen ? "rotate-12" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E53E3E] text-white text-[9.5px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in duration-150">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div className="fixed sm:absolute top-16 sm:top-full right-2 sm:right-0 mt-1 w-[calc(100vw-16px)] sm:w-[380px] max-w-[400px] bg-white border border-gray-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] text-ink">Notifications</span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#D92D21]/10 text-[#D92D21] text-[11px] font-bold">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">
                    All caught up
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-ink hover:bg-gray-200/70 transition-colors flex items-center gap-1 text-[11px] font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-gray-600" />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "All" },
                { id: "unread", label: `Unread (${unreadCount})` },
                { id: "orders", label: "Orders" },
                { id: "alerts", label: "Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    activeFilter === tab.id
                      ? "bg-black text-white shadow-xs"
                      : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-[13px] font-bold text-gray-800">No notifications found</p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {activeFilter === "unread"
                    ? "You have marked all notifications as read."
                    : "There are no notifications in this filter."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-all flex items-start gap-3 cursor-pointer group relative ${
                    item.read
                      ? "bg-white hover:bg-gray-50/80 opacity-80 hover:opacity-100"
                      : "bg-blue-50/20 hover:bg-blue-50/40"
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 absolute left-2 top-4 shadow-sm" />
                  )}

                  {/* Category Icon Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${getTypeBadgeBg(
                      item.type
                    )} ${!item.read ? "ml-2" : ""}`}
                  >
                    {getTypeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-[13px] leading-tight truncate ${
                          item.read ? "font-semibold text-gray-800" : "font-bold text-ink"
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-snug line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10.5px] text-gray-400 font-medium">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span>{item.time}</span>
                      {item.link && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
                            View details <ExternalLink className="w-2.5 h-2.5 inline" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Hover Actions: Dismiss */}
                  <div className="absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        title="Mark as read"
                        className="p-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => deleteNotification(item.id, e)}
                      title="Delete"
                      className="p-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 shadow-2xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-2.5 px-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear all notifications
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate("/settings");
                  setIsOpen(false);
                }}
                className="text-ink font-bold hover:underline"
              >
                Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
