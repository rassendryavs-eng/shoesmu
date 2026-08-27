import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, ShoppingBag } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Breadcrumb from "../components/navigation/Breadcrumb";
import api from "../services/api";
import { formatCurrency, formatDate } from "../config/constants";

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      const data = await api.getCustomerById(id);
      setCustomer(data);
      setLoading(false);
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-mute">Loading customer profile...</div>;
  }

  if (!customer) {
    return (
      <div className="py-12 text-center">
        <p className="text-h4 text-ink font-semibold">Customer not found</p>
        <Link to="/customers" className="mt-4 inline-block">
          <Button variant="secondary">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Customers", path: "/customers" }, { label: customer.name }]} />

      <div className="flex items-center gap-3">
        <Link to="/customers">
          <button className="btn-icon-circular">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-h3 font-bold text-ink">{customer.name}</h2>
            <Badge variant={customer.status === "VIP" ? "ink" : "neutral"} size="sm">
              {customer.status}
            </Badge>
          </div>
          <p className="text-caption text-mute">Member since {formatDate(customer.joinedDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Contact & Profile" className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="font-semibold text-ink">{customer.name}</p>
              <p className="text-caption text-mute">{customer.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-caption">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-mute" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-mute" />
              <span>{customer.phone || "Not provided"}</span>
            </div>
          </div>
        </Card>

        <Card title="Lifetime Metrics" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 border border-gray-200">
              <span className="text-caption text-mute">Total Orders Completed</span>
              <p className="text-h2 font-bold text-ink mt-1">{customer.ordersCount}</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200">
              <span className="text-caption text-mute">Lifetime Spend</span>
              <p className="text-h2 font-bold text-ink mt-1">
                {formatCurrency(customer.lifetimeSpend)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
