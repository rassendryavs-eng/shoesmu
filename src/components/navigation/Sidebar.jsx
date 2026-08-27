import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingBag,
  Users,
  MessageSquare,
  Boxes,
  Tag,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { NAV_ITEMS } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

const iconMap = {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingBag,
  Users,
  MessageSquare,
  Boxes,
  Tag,
  BarChart3,
  Settings,
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();
  const location = useLocation();

  const visibleNavItems = NAV_ITEMS.filter((item) => hasPermission(item.roles));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed top-0 left-0 bottom-0 z-40 w-60 bg-canvas border-r border-gray-200 flex flex-col justify-between lg:translate-x-0 font-sans",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-1.5"
            >
              <span className="font-extrabold text-xl tracking-tight text-ink lowercase">
                shoesmu.
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">
                ADMIN
              </span>
            </NavLink>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-mute hover:text-ink p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-5 px-3.5 space-y-1.5 select-none">
            {visibleNavItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive =
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard" || location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm",
                    isActive
                      ? "bg-[#111111] text-white font-bold"
                      : "text-gray-600 hover:text-ink hover:bg-gray-100/70 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon
                      className={clsx(
                        "w-5 h-5 shrink-0",
                        isActive ? "text-white" : "text-gray-500"
                      )}
                    />
                    <span className="truncate leading-tight">
                      {item.title}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      className={clsx(
                        "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Version Tag */}
        <div className="p-4 px-6 text-[11px] text-gray-400 font-mono tracking-tight border-t border-gray-100">
          v1.0 - Single Warehouse
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
