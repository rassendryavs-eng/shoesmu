import { useState, useEffect } from "react";
import api from "../services/api";

export const useDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [kpiData, chartData] = await Promise.all([
        api.getDashboardKpis(),
        api.getDashboardCharts(),
      ]);
      setKpis(kpiData);
      setCharts(chartData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { kpis, charts, loading, error, refresh: fetchDashboardData };
};

export default useDashboard;
