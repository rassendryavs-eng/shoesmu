import React, { useState } from "react";
import { Download, FileText, Lock, Calendar } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export const ReportsPage = () => {
  const { isSuperAdmin } = useAuth();
  const [downloading, setDownloading] = useState(false);

  if (!isSuperAdmin) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-error-50 text-error-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-h3 font-bold text-ink">Access Restricted</h2>
        <p className="text-caption text-mute mt-2">
          Financial and sales reporting is only accessible to Store Owners and Super Admins.
        </p>
      </div>
    );
  }

  const handleExport = (reportName) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Exporting ${reportName} (CSV) for current period.`);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h3 font-bold text-ink">Financial & Sales Reports</h2>
        <p className="text-caption text-mute">
          Export revenue summaries, inventory turnover, and reconciliation logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Monthly Sales Report"
          subtitle="Order-level breakdown with gross & net revenue"
          footer={
            <Button
              variant="primary"
              icon={Download}
              className="w-full"
              disabled={downloading}
              onClick={() => handleExport("Monthly Sales Report")}
            >
              Export CSV
            </Button>
          }
        >
          <div className="space-y-2 text-caption text-mute py-2">
            <p>• Gross revenue & discounts</p>
            <p>• Refund logs & cancellations</p>
            <p>• Payment gateway fees & net payout</p>
          </div>
        </Card>

        <Card
          title="Inventory Valuation Report"
          subtitle="Stock counts multiplied by cost & retail price"
          footer={
            <Button
              variant="outline"
              icon={Download}
              className="w-full"
              disabled={downloading}
              onClick={() => handleExport("Inventory Valuation Report")}
            >
              Export CSV
            </Button>
          }
        >
          <div className="space-y-2 text-caption text-mute py-2">
            <p>• Total warehouse asset value</p>
            <p>• Low-stock items risk analysis</p>
            <p>• Brand inventory breakdown</p>
          </div>
        </Card>

        <Card
          title="Customer Lifetime Report"
          subtitle="Customer segment metrics and average order value"
          footer={
            <Button
              variant="outline"
              icon={Download}
              className="w-full"
              disabled={downloading}
              onClick={() => handleExport("Customer Lifetime Report")}
            >
              Export CSV
            </Button>
          }
        >
          <div className="space-y-2 text-caption text-mute py-2">
            <p>• VIP member counts</p>
            <p>• Repurchase rate & cohort analysis</p>
            <p>• Customer acquisition trends</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
