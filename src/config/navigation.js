/**
 * Sidebar & Top navigation configuration with role permissions
 */

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Products",
    path: "/products",
    icon: "Package",
    roles: ["super_admin", "staff"],
    badge: null,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: "Grid",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Orders",
    path: "/orders",
    icon: "ShoppingBag",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Messages",
    path: "/messages",
    icon: "MessageSquare",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: "Boxes",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Promotions",
    path: "/promotions",
    icon: "Tag",
    roles: ["super_admin", "staff"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: "Settings",
    roles: ["super_admin", "staff"],
  },
];
