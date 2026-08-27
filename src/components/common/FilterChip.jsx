import React from "react";
import clsx from "clsx";

export const FilterChip = ({
  label,
  count,
  active = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-caption font-medium transition-all select-none cursor-pointer active:scale-95",
        active
          ? "bg-ink text-white border border-ink"
          : "bg-canvas text-ink border border-hairline hover:border-gray-400",
        className
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={clsx(
            "text-l1 px-1.5 py-0.2 rounded-full",
            active ? "bg-white/20 text-white" : "bg-gray-100 text-mute"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterChip;
