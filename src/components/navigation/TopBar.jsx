import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  Shield,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from "../common/Dropdown";
import NotificationDropdown from "./NotificationDropdown";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

export const TopBar = ({ onOpenSidebar, title = "Dashboard" }) => {
  const { currentUser, switchRole, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      navigate("/login");
    }, 250);
  };

  useEffect(() => {
    const updateUnread = async () => {
      try {
        const msgs = await api.getMessages();
        setUnreadMessagesCount(msgs.filter((m) => !m.read).length);
      } catch {}
    };
    updateUnread();
  }, [location.pathname]);

  const isMessagesActive = location.pathname.startsWith("/messages");

  return (
    <header className="sticky top-0 z-30 h-16 bg-canvas border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 lg:px-8 font-sans gap-2 sm:gap-4">
      {/* Left Area: Mobile Menu + Page Category & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-full text-mute hover:text-ink hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">
            OVERVIEW
          </span>
          <h1 className="text-[16px] sm:text-[17px] font-bold text-ink leading-none whitespace-nowrap">
            {title}
          </h1>
        </div>
      </div>

      {/* Center Area: Global Search Bar */}
      <GlobalSearch />

      {/* Right Area: Notifications, Messages, User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* Messages Direct Link Button */}
          <button
            type="button"
            onClick={() => navigate("/messages")}
            aria-label="Messages"
            title="Messages"
            className="relative w-9 h-9 rounded-full border border-gray-200/80 bg-white hover:bg-gray-100 text-gray-700 active:scale-95 flex items-center justify-center transition-all shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-gray-700" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E53E3E] text-white text-[9.5px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in duration-150">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        {/* User Dropdown */}
        <Dropdown
          align="right"
          width="w-[290px]"
          trigger={({ isOpen }) => (
            <button
              type="button"
              className={`flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full border transition-all select-none cursor-pointer ${
                isOpen
                  ? "bg-gray-100/90 border-gray-300 shadow-xs"
                  : "bg-white hover:bg-gray-50 border-gray-200/90 hover:border-gray-300 shadow-2xs active:scale-98"
              }`}
            >
              <div className="relative shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200 shadow-2xs"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {currentUser?.initials || currentUser?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[12.5px] font-bold text-ink block leading-tight truncate max-w-[110px]">
                  {currentUser?.name || "Alex Rivera"}
                </span>
                <span className="text-[10.5px] font-semibold text-gray-400 block leading-tight">
                  {currentUser?.roleLabel || (isSuperAdmin ? "Super Admin" : "Staff")}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ml-0.5 ${
                  isOpen ? "rotate-180 text-ink" : ""
                }`}
              />
            </button>
          )}
        >
          {/* User Profile Card Header */}
          <div className="p-3 bg-gradient-to-br from-gray-50 via-gray-50/90 to-gray-100/60 rounded-xl border border-gray-200/70 mb-1.5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {currentUser?.initials || currentUser?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold text-ink truncate leading-tight">
                  {currentUser?.name || "Alex Rivera"}
                </p>
                <p className="text-[11.5px] text-gray-500 truncate leading-tight mt-0.5">
                  {currentUser?.email || "alex@shoesmu.com"}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold tracking-wide uppercase ${
                      isSuperAdmin
                        ? "bg-black text-white shadow-2xs"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isSuperAdmin && <Sparkles className="w-2.5 h-2.5 text-amber-300" />}
                    {currentUser?.roleLabel || (isSuperAdmin ? "Super Admin" : "Staff")}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <DropdownItem
              icon={User}
              label="Profile Settings"
              description="Personal info & preferences"
              showChevron
              onClick={() => navigate("/settings?tab=account")}
            />
            <DropdownItem
              icon={Settings}
              label="Store Settings"
              description="Store configs, taxes & policies"
              showChevron
              onClick={() => navigate("/settings?tab=store")}
            />

            <DropdownDivider />

            <DropdownItem
              icon={Shield}
              label={`Switch to ${isSuperAdmin ? "Staff Role" : "Super Admin"}`}
              description={
                isSuperAdmin
                  ? "Preview limited staff permissions"
                  : "Restore full super admin controls"
              }
              badge={isSuperAdmin ? "Staff" : "Admin"}
              badgeClassName={
                isSuperAdmin
                  ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                  : "bg-black text-white"
              }
              onClick={() => switchRole(isSuperAdmin ? "staff" : "super_admin")}
            />

            <DropdownDivider />

            <DropdownItem
              icon={LogOut}
              variant="danger"
              label="Log Out"
              description="End current dashboard session"
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
        </Dropdown>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Confirm Log Out                                                    */}
      {/* ========================================================================= */}
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
                <LogOut className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Log Out of Shoesmu?</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Are you sure you want to end your active session as <strong>{currentUser?.name || "Alex Rivera"}</strong>? You will need to sign in again to access the dashboard.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleConfirmLogout}
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isLoggingOut && (
                    <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  <span>{isLoggingOut ? "Logging out..." : "Yes, Log Out"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default TopBar;
