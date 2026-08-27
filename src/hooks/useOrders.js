import { useState, useEffect } from "react";
import api from "../services/api";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      return true;
    } catch (err) {
      setError(err.message || "Failed to update order status");
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, updateStatus, refresh: fetchOrders };
};

export default useOrders;
