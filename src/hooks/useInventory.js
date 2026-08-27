import { useState, useEffect } from "react";
import api from "../services/api";

export const useInventory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.getInventoryAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.message || "Failed to load inventory alerts");
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (productId, sku, delta, reason) => {
    try {
      await api.adjustStock(productId, sku, delta, reason);
      await fetchInventory();
      return true;
    } catch (err) {
      setError(err.message || "Failed to adjust stock");
      return false;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { alerts, loading, error, adjustStock, refresh: fetchInventory };
};

export default useInventory;
