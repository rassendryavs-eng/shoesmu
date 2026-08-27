import React from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

export const SearchPill = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  size = "md",
}) => {
  return (
    <div
      className={clsx(
        "relative flex items-center bg-soft-cloud text-ink rounded-full transition-all border border-transparent focus-within:border-ink focus-within:bg-canvas focus-within:ring-4 focus-within:ring-soft-cloud",
        size === "sm" ? "h-8 px-3 text-caption" : "h-10 px-3.5 text-text2",
        className
      )}
    >
      <Search className="w-4 h-4 text-mute mr-2 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-ink placeholder-gray-500 font-sans"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-mute hover:text-ink p-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchPill;
