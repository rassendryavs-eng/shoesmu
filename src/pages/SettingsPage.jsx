import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Store,
  CreditCard,
  Bell,
  User,
  Save,
  Check,
  Plus,
  Trash2,
  Wallet,
  Landmark,
  Banknote,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DEFAULT_SETTINGS = {
  store: {
    storeName: "Shoesmu",
    currency: "USD",
    supportEmail: "hello@shoesmu.com",
    address: "Jakarta, ID",
  },
  payments: {
    methods: [
      {
        id: "pm-1",
        name: "Credit / debit card",
        details: "Visa, Mastercard, JCB, Amex",
        fee: "FEE 2.9% + $0.30",
        active: true,
        type: "card",
      },
      {
        id: "pm-2",
        name: "E-wallet",
        details: "GoPay, OVO, DANA, ShopeePay",
        fee: "FEE 1.5%",
        active: true,
        type: "wallet",
      },
      {
        id: "pm-3",
        name: "Bank transfer / VA",
        details: "BCA, Mandiri, BNI, BRI",
        fee: "FEE $0.25 FLAT",
        active: true,
        type: "bank",
      },
      {
        id: "pm-4",
        name: "Cash on delivery",
        details: "Pay the courier on arrival",
        fee: "FEE NO FEE",
        active: false,
        type: "cash",
      },
    ],
    payout: {
      bank: "BCA",
      accountNumber: "•••• 4821",
      accountHolder: "PT Shoesmu Indonesia",
      schedule: "Weekly", // Daily, Weekly, Monthly
    },
  },
  notifications: {
    newOrders: true,
    lowStock: true,
    promotionActivity: false,
    weeklyDigest: true,
  },
  account: {
    fullName: "Alex Rivera",
    email: "alex@shoesmu.com",
    role: "Super Admin",
  },
};

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange && onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out select-none focus:outline-none ${
        checked ? "bg-black" : "bg-gray-200"
      }`}
    >
      <span className="sr-only">{label || "Toggle"}</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam && ["store", "payments", "notifications", "account"].includes(tabParam)
      ? tabParam
      : "store";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newMethodInput, setNewMethodInput] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Sync tab with search parameters if changed from navigation
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["store", "payments", "notifications", "account"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Load from localStorage or defaults with active currentUser
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("shoesmu_settings");
    let base = DEFAULT_SETTINGS;
    if (saved) {
      try {
        base = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      ...base,
      account: {
        fullName: currentUser?.name || base.account?.fullName || "Alex Rivera",
        email: currentUser?.email || base.account?.email || "alex@shoesmu.com",
        role: currentUser?.roleLabel || base.account?.role || "Super Admin",
      },
    };
  });

  useEffect(() => {
    if (currentUser) {
      setSettings((prev) => ({
        ...prev,
        account: {
          ...prev.account,
          fullName: currentUser.name || prev.account.fullName,
          email: currentUser.email || prev.account.email,
          role: currentUser.roleLabel || prev.account.role,
        },
      }));
    }
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("shoesmu_settings", JSON.stringify(settings));
      setIsSaving(false);
      showToast("Settings saved successfully!");
    }, 400);
  };

  // Toggle Payment Method Active
  const handleTogglePaymentMethod = (id) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        payments: {
          ...prev.payments,
          methods: prev.payments.methods.map((m) =>
            m.id === id ? { ...m, active: !m.active } : m
          ),
        },
      };
      localStorage.setItem("shoesmu_settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Delete Payment Method
  const handleDeletePaymentMethod = (id, name) => {
    if (window.confirm(`Delete payment method "${name}"?`)) {
      setSettings((prev) => {
        const updated = {
          ...prev,
          payments: {
            ...prev.payments,
            methods: prev.payments.methods.filter((m) => m.id !== id),
          },
        };
        localStorage.setItem("shoesmu_settings", JSON.stringify(updated));
        return updated;
      });
      showToast(`Payment method "${name}" removed`);
    }
  };

  // Add Custom Payment Method
  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    if (!newMethodInput.trim()) return;

    const newMethod = {
      id: "pm-" + Date.now(),
      name: newMethodInput.trim(),
      details: "Custom payment gateway integration",
      fee: "FEE STANDARD",
      active: true,
      type: "card",
    };

    setSettings((prev) => {
      const updated = {
        ...prev,
        payments: {
          ...prev.payments,
          methods: [...prev.payments.methods, newMethod],
        },
      };
      localStorage.setItem("shoesmu_settings", JSON.stringify(updated));
      return updated;
    });

    showToast(`Added "${newMethod.name}" payment method`);
    setNewMethodInput("");
  };

  // Toggle Notification Preference
  const handleToggleNotification = (key) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key],
        },
      };
      localStorage.setItem("shoesmu_settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Set Payout Schedule
  const handleSetPayoutSchedule = (schedule) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        payments: {
          ...prev.payments,
          payout: {
            ...prev.payments.payout,
            schedule,
          },
        },
      };
      localStorage.setItem("shoesmu_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case "wallet":
        return <Wallet className="w-4 h-4 text-gray-700" />;
      case "bank":
        return <Landmark className="w-4 h-4 text-gray-700" />;
      case "cash":
        return <Banknote className="w-4 h-4 text-gray-700" />;
      case "card":
      default:
        return <CreditCard className="w-4 h-4 text-gray-700" />;
    }
  };

  const TABS = [
    { id: "store", label: "Store" },
    { id: "payments", label: "Payments" },
    { id: "notifications", label: "Notifications" },
    { id: "account", label: "Account" },
  ];

  return (
    <div className="space-y-6 font-sans text-ink pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-[13px] font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-gray-800">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header: Title, Subtitle, and Save changes Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-ink tracking-tight">
            Settings
          </h1>
          <p className="text-[13.5px] text-gray-500 mt-1 font-normal">
            Configure store, notifications, and account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full font-bold text-[13px] inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save changes"}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 flex items-center gap-8 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 text-[14px] font-semibold relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-black font-bold"
                  : "text-gray-500 hover:text-black font-medium"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* ========================================================================= */}
        {/* TAB 1: STORE PROFILE                                                      */}
        {/* ========================================================================= */}
        {activeTab === "store" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div>
            <h2 className="text-[16px] font-bold text-ink">Store profile</h2>
            <p className="text-[13px] text-gray-400 font-normal mt-0.5">
              Public information about your store.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            {/* Store Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                STORE NAME
              </label>
              <input
                type="text"
                value={settings.store.storeName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    store: { ...settings.store, storeName: e.target.value },
                  })
                }
                className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Shoesmu"
              />
            </div>

            {/* Currency & Support Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  CURRENCY
                </label>
                <input
                  type="text"
                  value={settings.store.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: { ...settings.store, currency: e.target.value },
                    })
                  }
                  className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  SUPPORT EMAIL
                </label>
                <input
                  type="email"
                  value={settings.store.supportEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      store: {
                        ...settings.store,
                        supportEmail: e.target.value,
                      },
                    })
                  }
                  className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="hello@shoesmu.com"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                ADDRESS
              </label>
              <input
                type="text"
                value={settings.store.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    store: { ...settings.store, address: e.target.value },
                  })
                }
                className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Jakarta, ID"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAYMENTS (Payment methods & Payout account)                        */}
      {/* ========================================================================= */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          {/* Card 1: Payment Methods */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Payment methods</h2>
              <p className="text-[13px] text-gray-400 font-normal mt-0.5">
                Choose which methods customers can use at checkout.
              </p>
            </div>

            {/* Methods List */}
            <div className="divide-y divide-gray-100">
              {settings.payments.methods.map((method) => (
                <div
                  key={method.id}
                  className="py-5 sm:py-5.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-1 last:pb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      {getPaymentIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[14.5px] text-ink">
                          {method.name}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            method.active
                              ? "bg-[#E8F8EE] text-[#0E8A38]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {method.active ? "Active" : "Off"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {method.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-7">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {method.fee}
                    </span>

                    {/* Toggle Switch Turn On / Off */}
                    <ToggleSwitch
                      checked={method.active}
                      onChange={() => handleTogglePaymentMethod(method.id)}
                      label={`Toggle ${method.name}`}
                    />

                    {/* Delete Icon */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDeletePaymentMethod(method.id, method.name)
                      }
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                      title="Delete payment method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Method Bar */}
            <form
              onSubmit={handleAddPaymentMethod}
              className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3"
            >
              <input
                type="text"
                value={newMethodInput}
                onChange={(e) => setNewMethodInput(e.target.value)}
                placeholder="Add custom method (e.g. PayPal)"
                className="w-full sm:max-w-md h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!newMethodInput.trim()}
                className="w-full sm:w-auto h-11 px-5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Card 2: Payout Account */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Payout account</h2>
              <p className="text-[13px] text-gray-400 font-normal mt-0.5">
                Where your settled balance is sent.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              {/* Bank & Account Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    BANK
                  </label>
                  <input
                    type="text"
                    value={settings.payments.payout.bank}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          payout: {
                            ...settings.payments.payout,
                            bank: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="BCA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    ACCOUNT NUMBER
                  </label>
                  <input
                    type="text"
                    value={settings.payments.payout.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          payout: {
                            ...settings.payments.payout,
                            accountNumber: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all font-mono"
                    placeholder="•••• 4821"
                  />
                </div>
              </div>

              {/* Account Holder & Payout Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    ACCOUNT HOLDER
                  </label>
                  <input
                    type="text"
                    value={settings.payments.payout.accountHolder}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          payout: {
                            ...settings.payments.payout,
                            accountHolder: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="PT Shoesmu Indonesia"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    PAYOUT SCHEDULE
                  </label>
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-full border border-gray-200/80">
                    {["Daily", "Weekly", "Monthly"].map((sch) => {
                      const isSelected =
                        settings.payments.payout.schedule === sch;
                      return (
                        <button
                          key={sch}
                          type="button"
                          onClick={() => handleSetPayoutSchedule(sch)}
                          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-black text-white shadow-xs"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          {sch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NOTIFICATIONS                                                      */}
      {/* ========================================================================= */}
      {activeTab === "notifications" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div>
            <h2 className="text-[16px] font-bold text-ink">
              Notification preferences
            </h2>
            <p className="text-[13px] text-gray-400 font-normal mt-0.5">
              Choose which events send alerts.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {/* New orders */}
            <div className="py-5 sm:py-5.5 flex items-center justify-between gap-4 first:pt-1">
              <div>
                <h4 className="font-bold text-[14.5px] text-ink">New orders</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Alert when a new order is placed.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.notifications.newOrders}
                onChange={() => handleToggleNotification("newOrders")}
                label="New orders alert"
              />
            </div>

            {/* Low stock */}
            <div className="py-5 sm:py-5.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[14.5px] text-ink">Low stock</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Alert when a SKU falls below 10 units.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.notifications.lowStock}
                onChange={() => handleToggleNotification("lowStock")}
                label="Low stock alert"
              />
            </div>

            {/* Promotion activity */}
            <div className="py-5 sm:py-5.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[14.5px] text-ink">
                  Promotion activity
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Alert on promotion redemptions.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.notifications.promotionActivity}
                onChange={() => handleToggleNotification("promotionActivity")}
                label="Promotion activity alert"
              />
            </div>

            {/* Weekly digest */}
            <div className="py-5 sm:py-5.5 flex items-center justify-between gap-4 last:pb-2">
              <div>
                <h4 className="font-bold text-[14.5px] text-ink">Weekly digest</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Every Monday, revenue + top movers.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.notifications.weeklyDigest}
                onChange={() => handleToggleNotification("weeklyDigest")}
                label="Weekly digest alert"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACCOUNT (Profile, Security, 2FA, & Active Sessions)                */}
      {/* ========================================================================= */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Card 1: Profile Information & Avatar */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Account Profile</h2>
              <p className="text-[13px] text-gray-400 font-normal mt-0.5">
                Your personal administrator identity and contact details.
              </p>
            </div>

            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-black text-white font-extrabold text-xl flex items-center justify-center shadow-sm shrink-0 select-none">
                    {currentUser?.initials ||
                      (settings.account.fullName
                        ? settings.account.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "AR")}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-ink leading-tight">
                      {settings.account.fullName || currentUser?.name || "Alex Rivera"}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#0E8A38] border border-[#B7EBCA]/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0E8A38] animate-pulse" />
                      <span>{settings.account.role || currentUser?.roleLabel || "Super Admin"}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.account.email || currentUser?.email || "alex@shoesmu.com"} • Administrator Access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast("Avatar photo upload ready")}
                  className="px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={settings.account.fullName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: {
                          ...settings.account,
                          fullName: e.target.value,
                        },
                      })
                    }
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="Alex Rivera"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={settings.account.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, email: e.target.value },
                      })
                    }
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="alex@shoesmu.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    defaultValue="+62 812-9988-7766"
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all font-mono"
                    placeholder="+62 812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    ROLE & ACCESS
                  </label>
                  <input
                    type="text"
                    disabled
                    value={settings.account.role || "Super Admin"}
                    className="w-full h-11 px-4 bg-gray-100/90 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-700 cursor-not-allowed outline-none select-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Password Management */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Password & Security</h2>
              <p className="text-[13px] text-gray-400 font-normal mt-0.5">
                Manage your credentials and protect your administrator account.
              </p>
            </div>

            {/* Password Fields */}
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    CURRENT PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    className="w-full h-11 px-4 bg-gray-50/60 border border-gray-200 rounded-xl text-[13.5px] font-medium text-gray-900 focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              {/* 2FA Toggle Row */}
              <div className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13.5px] text-ink">
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Protect your admin console using Google Authenticator or SMS OTP.
                    </p>
                  </div>
                </div>

                <ToggleSwitch
                  checked={twoFactorEnabled}
                  onChange={(val) => {
                    setTwoFactorEnabled(val);
                    showToast(
                      val ? "Two-Factor Authentication enabled" : "Two-Factor Authentication disabled"
                    );
                  }}
                  label="Two-factor authentication"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Active Sessions & Devices */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-ink">Active Sessions</h2>
              <p className="text-[13px] text-gray-400 font-normal mt-0.5">
                Devices currently authenticated into this Shoesmu account.
              </p>
            </div>

            <div className="divide-y divide-gray-100 max-w-2xl">
              {/* Session 1: Current */}
              <div className="py-3.5 flex items-center justify-between gap-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    💻
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[13.5px] text-ink">
                        Chrome on Windows PC
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#0E8A38]">
                        This Device
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Jakarta, Indonesia • IP 182.253.14.9 • Active now
                    </p>
                  </div>
                </div>
              </div>

              {/* Session 2 */}
              <div className="py-3.5 flex items-center justify-between gap-4 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    📱
                  </div>
                  <div>
                    <h4 className="font-bold text-[13.5px] text-ink">
                      Safari on iPhone 15 Pro
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Jakarta, Indonesia • Last active 2 hours ago
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Device session revoked")}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SettingsPage;
