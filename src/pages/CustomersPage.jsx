import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SearchPill from "../components/common/SearchPill";
import DataTable from "../components/common/DataTable";
import Badge from "../components/common/Badge";
import api from "../services/api";
import { formatCurrency, formatDate } from "../config/constants";

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Customer",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <div>
            <Link
              to={`/customers/${item.id}`}
              className="font-semibold text-text2 text-ink hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-caption text-mute">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Total Orders",
      accessor: "ordersCount",
      cellClassName: "font-semibold text-ink",
    },
    {
      header: "Lifetime Value",
      render: (item) => (
        <span className="font-semibold text-ink">{formatCurrency(item.lifetimeSpend)}</span>
      ),
    },
    {
      header: "Tier",
      render: (item) => (
        <Badge variant={item.status === "VIP" ? "ink" : "neutral"} size="sm">
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Member Since",
      render: (item) => <span className="text-caption text-mute">{formatDate(item.joinedDate)}</span>,
    },
    {
      header: "Action",
      align: "right",
      render: (item) => (
        <Link to={`/customers/${item.id}`}>
          <Button variant="ghost" size="sm">
            Profile
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-ink">Customers Directory</h2>
          <p className="text-caption text-mute">
            View customer order histories, lifetime value, and member tiers.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="w-full sm:w-80">
          <SearchPill
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search by name or email..."
          />
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        isLoading={loading}
        emptyMessage="No customers found."
      />
    </div>
  );
};

export default CustomersPage;
