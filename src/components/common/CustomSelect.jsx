import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

export const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  variant = "default", // "default" | "status"
  statusColor = null, // "emerald" | "amber" | "rose" | "indigo"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find(
    (opt) => (opt.value ?? opt) === (value?.value ?? value)
  );

  const handleSelect = (opt) => {
    const val = opt.value !== undefined ? opt.value : opt;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={clsx("relative w-full text-left", className)} ref={selectRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none outline-none",
          isOpen ? "ring-2 ring-black/10 border-black" : "hover:border-gray-400",
          buttonClassName || "bg-gray-50/90 border-gray-200 text-gray-900 focus:bg-white"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
          )}
          {selectedOption?.badge && (
            <span className={clsx("shrink-0", selectedOption.badgeClass)}>
              {selectedOption.badge}
            </span>
          )}
          <span className="truncate">
            {selectedOption?.label || selectedOption?.name || selectedOption?.value || value || placeholder}
          </span>
        </div>

        <ChevronDown
          className={clsx(
            "w-4 h-4 shrink-0 transition-transform duration-200 text-gray-400",
            isOpen && "rotate-180 text-gray-800"
          )}
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div
          className={clsx(
            "absolute z-50 mt-1.5 w-full bg-white border border-gray-200/90 rounded-2xl shadow-xl shadow-black/10 p-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto",
            menuClassName
          )}
        >
          <div className="space-y-0.5">
            {options.map((option, idx) => {
              const optValue = option.value !== undefined ? option.value : option;
              const isSelected = optValue === (value?.value ?? value);
              const IconComp = option.icon;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={clsx(
                    "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer group",
                    isSelected
                      ? "bg-neutral-900 text-white font-bold shadow-xs"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-black font-semibold"
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Option Icon */}
                    {option.iconNode ? (
                      <span className="mt-0.5 shrink-0">{option.iconNode}</span>
                    ) : option.icon ? (
                      <span
                        className={clsx(
                          "w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        )}
                      >
                        {option.icon}
                      </span>
                    ) : null}

                    {/* Option Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate leading-tight block">
                          {option.label || option.name || option.value || option}
                        </span>
                        {option.tag && (
                          <span
                            className={clsx(
                              "text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            {option.tag}
                          </span>
                        )}
                      </div>

                      {option.desc && (
                        <p
                          className={clsx(
                            "text-[10.5px] font-normal leading-tight mt-0.5",
                            isSelected ? "text-gray-300" : "text-gray-400"
                          )}
                        >
                          {option.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
