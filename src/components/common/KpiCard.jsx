import React from "react";
import { ArrowUpRight, ArrowDownRight, Lock } from "lucide-react";
import clsx from "clsx";

export const KpiCard = ({
  title,
  value,
  formattedValue,
  change,
  isPositive = true,
  isRestricted = false,
  period = "vs last month",
  icon: Icon,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "bg-canvas border border-gray-200 p-6 flex flex-col justify-between transition-colors relative",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-caption font-medium text-mute tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-soft-cloud flex items-center justify-center text-ink">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        {isRestricted ? (
          <div className="flex items-center gap-2 py-1 text-mute">
            <Lock className="w-4 h-4" />
            <span className="text-text2 font-medium">Restricted (Admin only)</span>
          </div>
        ) : (
          <div className="font-semibold text-h2 text-ink tracking-tight">
            {formattedValue || value}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {!isRestricted && change && (
          <span
            className={clsx(
              "inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-full",
              isPositive ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </span>
        )}
        <span className="text-caption text-gray-500">{period}</span>
      </div>
    </div>
  );
};

export default KpiCard;
