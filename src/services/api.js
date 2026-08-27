/**
 * Asynchronous Mock API Client for Shoesmu Admin
 * Reads and persists state in localStorage so vibe coding and live interactions work smoothly
 */

import {
  MOCK_KPIS,
  MOCK_MONTHLY_SALES,
  MOCK_CATEGORY_SALES,
  MOCK_SALES_DISTRIBUTION,
  MOCK_DAILY_REVENUE,
  MOCK_BEST_SELLING_PRODUCTS,
  MOCK_RECENT_ORDERS,
  MOCK_SALES_GOAL,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_INVENTORY_ALERTS,
  MOCK_PROMOTIONS,
  MOCK_ACTIVITIES,
  MOCK_NOTIFICATIONS,
  MOCK_CATEGORIES_DETAILED,
  MOCK_MESSAGES,
} from "../data/mockData";

// Initialize localStorage if empty
const initStorage = () => {
  if (!localStorage.getItem("shoesmu_products_v3")) {
    localStorage.setItem("shoesmu_products", JSON.stringify(MOCK_PRODUCTS));
    localStorage.setItem("shoesmu_products_v3", "true");
  }
  if (!localStorage.getItem("shoesmu_categories_v2")) {
    localStorage.setItem("shoesmu_categories", JSON.stringify(MOCK_CATEGORIES_DETAILED));
    localStorage.setItem("shoesmu_categories_v2", "true");
  }
  if (!localStorage.getItem("shoesmu_orders_v3")) {
    localStorage.setItem("shoesmu_orders", JSON.stringify(MOCK_ORDERS));
    localStorage.setItem("shoesmu_orders_v3", "true");
  }
  if (!localStorage.getItem("shoesmu_promotions_v2")) {
    localStorage.setItem("shoesmu_promotions", JSON.stringify(MOCK_PROMOTIONS));
    localStorage.setItem("shoesmu_promotions_v2", "true");
  }
  if (!localStorage.getItem("shoesmu_messages_v2")) {
    localStorage.setItem("shoesmu_messages", JSON.stringify(MOCK_MESSAGES));
    localStorage.setItem("shoesmu_messages_v2", "true");
  }
};

initStorage();

// Artificial small latency to simulate live data fetching
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Dashboard Endpoints
  async getDashboardKpis() {
    await delay();
    return { ...MOCK_KPIS };
  },

  async getDashboardCharts() {
    await delay();
    return {
      monthlySales: MOCK_MONTHLY_SALES,
      categorySales: MOCK_CATEGORY_SALES,
      salesDistribution: MOCK_SALES_DISTRIBUTION,
      dailyRevenue: MOCK_DAILY_REVENUE,
      bestSellingProducts: MOCK_BEST_SELLING_PRODUCTS,
      recentOrders: MOCK_RECENT_ORDERS,
      salesGoal: MOCK_SALES_GOAL,
      recentActivities: MOCK_ACTIVITIES,
    };
  },

  // Products Endpoints
  async getProducts() {
    await delay();
    const stored = localStorage.getItem("shoesmu_products");
    return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
  },

  async getProductById(id) {
    await delay();
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async saveProduct(product) {
    await delay();
    const products = await this.getProducts();
    let updated;
    if (product.id) {
      updated = products.map((p) => (p.id === product.id ? product : p));
    } else {
      const newProduct = {
        ...product,
        id: `prod-${Date.now()}`,
        sku: product.sku || `P-00${products.length + 1}`,
        stockLeft: product.stock || 25,
        stockTotal: 100,
        status: product.status || "Active",
        badge: product.name ? product.name.charAt(0).toUpperCase() : "P",
        rating: 5.0,
        reviewsCount: 0,
      };
      updated = [newProduct, ...products];
    }
    localStorage.setItem("shoesmu_products", JSON.stringify(updated));
    return product;
  },

  async deleteProduct(id) {
    await delay();
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== id && p.sku !== id);
    localStorage.setItem("shoesmu_products", JSON.stringify(updated));
    return true;
  },

  // Categories Endpoints
  async getCategories() {
    await delay();
    const stored = localStorage.getItem("shoesmu_categories");
    return stored ? JSON.parse(stored) : MOCK_CATEGORIES_DETAILED;
  },

  async saveCategory(category) {
    await delay();
    const categories = await this.getCategories();
    let updated;
    if (category.id) {
      updated = categories.map((c) => (c.id === category.id ? category : c));
    } else {
      const newCategory = {
        ...category,
        id: `cat-${Date.now()}`,
        code: category.code || `C-0${categories.length + 1}`,
        slug: category.slug || `/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
        share: category.share || 5,
        productsCount: category.productsCount || 0,
        unitsSold: category.unitsSold || 0,
      };
      updated = [...categories, newCategory];
    }
    localStorage.setItem("shoesmu_categories", JSON.stringify(updated));
    return category;
  },

  async deleteCategory(id) {
    await delay();
    const categories = await this.getCategories();
    const updated = categories.filter((c) => c.id !== id && c.code !== id);
    localStorage.setItem("shoesmu_categories", JSON.stringify(updated));
    return true;
  },

  // Orders Endpoints
  async getOrders() {
    await delay();
    const stored = localStorage.getItem("shoesmu_orders");
    return stored ? JSON.parse(stored) : MOCK_ORDERS;
  },

  async getOrderById(id) {
    await delay();
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id) || null;
  },

  async updateOrderStatus(orderId, newStatus) {
    await delay();
    const orders = await this.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("shoesmu_orders", JSON.stringify(updated));
    return updated.find((o) => o.id === orderId);
  },

  async updateOrder(updatedOrder) {
    await delay();
    const orders = await this.getOrders();
    const updated = orders.map((o) =>
      o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
    );
    localStorage.setItem("shoesmu_orders", JSON.stringify(updated));
    return updatedOrder;
  },

  // Customers Endpoints
  async getCustomers() {
    await delay();
    return [...MOCK_CUSTOMERS];
  },

  async getCustomerById(id) {
    await delay();
    return MOCK_CUSTOMERS.find((c) => c.id === id) || null;
  },

  // Inventory Endpoints
  async getInventoryAlerts() {
    await delay();
    return [...MOCK_INVENTORY_ALERTS];
  },

  async adjustStock(productId, sku, delta, reason = "") {
    await delay();
    const products = await this.getProducts();
    const updated = products.map((p) => {
      if (p.id === productId) {
        const updatedVariants = (p.variants || []).map((v) => {
          if (v.sku === sku) {
            return { ...v, stock: Math.max(0, v.stock + delta) };
          }
          return v;
        });
        const totalStock = updatedVariants.reduce((acc, curr) => acc + curr.stock, 0);
        return {
          ...p,
          variants: updatedVariants,
          stock: totalStock,
        };
      }
      return p;
    });
    localStorage.setItem("shoesmu_products", JSON.stringify(updated));
    return true;
  },

  // Promotions Endpoints
  async getPromotions() {
    await delay();
    const stored = localStorage.getItem("shoesmu_promotions");
    return stored ? JSON.parse(stored) : MOCK_PROMOTIONS;
  },

  async createPromotion(promo) {
    await delay();
    const current = await this.getPromotions();
    const newPromo = {
      id: "promo-" + Date.now(),
      used: 0,
      status: "Active",
      ...promo,
    };
    const updated = [newPromo, ...current];
    localStorage.setItem("shoesmu_promotions", JSON.stringify(updated));
    return newPromo;
  },

  async updatePromotionStatus(id, newStatus) {
    await delay();
    const current = await this.getPromotions();
    const updated = current.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    localStorage.setItem("shoesmu_promotions", JSON.stringify(updated));
    return updated;
  },

  async deletePromotion(id) {
    await delay();
    const current = await this.getPromotions();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem("shoesmu_promotions", JSON.stringify(updated));
    return updated;
  },

  // Messages Endpoints
  async getMessages() {
    await delay();
    const stored = localStorage.getItem("shoesmu_messages");
    return stored ? JSON.parse(stored) : MOCK_MESSAGES;
  },

  async sendMessage(conversationId, text) {
    await delay();
    const current = await this.getMessages();
    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "me",
      text,
      time: "just now",
    };
    const updated = current.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          time: "just now",
          read: true,
          conversation: [...(c.conversation || []), newMsg],
        };
      }
      return c;
    });
    localStorage.setItem("shoesmu_messages", JSON.stringify(updated));
    return updated;
  },

  async receiveCustomerReply(conversationId, text) {
    await delay(50);
    const current = await this.getMessages();
    const newMsg = {
      id: "reply-" + Date.now(),
      sender: "them",
      text,
      time: "just now",
    };
    const updated = current.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          time: "just now",
          conversation: [...(c.conversation || []), newMsg],
        };
      }
      return c;
    });
    localStorage.setItem("shoesmu_messages", JSON.stringify(updated));
    return updated;
  },

  async deleteConversation(id) {
    await delay();
    const current = await this.getMessages();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem("shoesmu_messages", JSON.stringify(updated));
    return updated;
  },

  async markAllMessagesRead() {
    await delay();
    const current = await this.getMessages();
    const updated = current.map((c) => ({ ...c, read: true }));
    localStorage.setItem("shoesmu_messages", JSON.stringify(updated));
    return updated;
  },

  // Notifications Endpoints
  async getNotifications() {
    await delay();
    return [...MOCK_NOTIFICATIONS];
  },
};

export default api;
