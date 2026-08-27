/**
 * System Constants & Enums for Shoesmu Admin
 */

export const BRANDS = [
  { id: "nike", name: "Nike" },
  { id: "adidas", name: "Adidas" },
  { id: "puma", name: "Puma" },
  { id: "vans", name: "Vans" },
  { id: "reebok", name: "Reebok" },
  { id: "converse", name: "Converse" },
  { id: "new-balance", name: "New Balance" },
];

export const CATEGORIES = [
  { id: "sneakers", name: "Sneakers" },
  { id: "running", name: "Running Shoes" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "basketball", name: "Basketball" },
  { id: "flats", name: "Flats" },
  { id: "sandals", name: "Sandals" },
  { id: "heels", name: "Heels" },
];

export const ORDER_STATUSES = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const PAYMENT_STATUSES = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const STOCK_STATUSES = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
