import React from "react";
import clsx from "clsx";

export const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center gap-1.5 font-medium rounded-full select-none";

  const variants = {
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    success: "bg-success-50 text-success-700 border border-success-200",
    warning: "bg-warning-50 text-warning-700 border border-warning-200",
    error: "bg-error-50 text-error-700 border border-error-200",
    info: "bg-info-50 text-info-700 border border-info-200",
    sale: "bg-error-50 text-sale font-semibold border border-error-100",
    ink: "bg-ink text-white",
  };

  const dotColors = {
    neutral: "bg-gray-500",
    success: "bg-success-600",
    warning: "bg-warning-600",
    error: "bg-error-600",
    info: "bg-info-600",
    sale: "bg-sale",
    ink: "bg-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-l1",
    md: "px-2.5 py-1 text-caption",
    lg: "px-3.5 py-1.5 text-text2",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
