import React from "react";
import Badge from "./Badge";

export const StatusBadge = ({ status, type = "order", className = "" }) => {
  if (!status) return null;

  // Order status mapping
  if (type === "order") {
    switch (status.toLowerCase()) {
      case "delivered":
      case "paid":
        return (
          <Badge variant="success" dot className={className}>
            {status}
          </Badge>
        );
      case "shipped":
      case "processing":
        return (
          <Badge variant="info" dot className={className}>
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" dot className={className}>
            {status}
          </Badge>
        );
      case "cancelled":
      case "failed":
      case "refunded":
        return (
          <Badge variant="error" dot className={className}>
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" dot className={className}>
            {status}
          </Badge>
        );
    }
  }

  // Stock status mapping
  if (type === "stock") {
    switch (status.toLowerCase()) {
      case "in stock":
      case "active":
        return (
          <Badge variant="success" dot className={className}>
            {status}
          </Badge>
        );
      case "low stock":
        return (
          <Badge variant="warning" dot className={className}>
            {status}
          </Badge>
        );
      case "out of stock":
      case "archived":
        return (
          <Badge variant="error" dot className={className}>
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" dot className={className}>
            {status}
          </Badge>
        );
    }
  }

  return <Badge className={className}>{status}</Badge>;
};

export default StatusBadge;
