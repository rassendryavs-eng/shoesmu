import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

const renderDropdownIcon = (Icon) => {
  if (!Icon) return null;
  if (React.isValidElement(Icon)) return Icon;
  const IconComponent = Icon;
  return <IconComponent className="w-4 h-4" />;
};

export const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "",
  menuClassName = "",
  width = "w-72",
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (value) => {
    if (!isControlled) {
      setUncontrolledIsOpen(value);
    }
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = {
    right: "right-0 origin-top-right",
    left: "left-0 origin-top-left",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div className={clsx("relative inline-block text-left", className)} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {typeof trigger === "function" ? trigger({ isOpen }) : trigger}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={clsx(
            "absolute z-50 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] p-1.5 focus:outline-none animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 font-sans",
            width,
            alignmentClasses[align] || alignmentClasses.right,
            menuClassName
          )}
          onClick={(e) => {
            // Close dropdown when item is clicked, unless explicitly prevented
            if (!e.defaultPrevented) {
              setIsOpen(false);
            }
          }}
        >
          {typeof children === "function" ? children({ close: () => setIsOpen(false) }) : children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  label,
  description,
  onClick,
  active = false,
  disabled = false,
  icon: Icon,
  badge,
  badgeClassName = "bg-gray-100 text-gray-600",
  rightElement,
  showChevron = false,
  variant = "default", // "default" | "danger" | "success"
  className = "",
}) => {
  const isDanger = variant === "danger";
  const isSuccess = variant === "success";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "w-full text-left p-2 rounded-xl flex items-center justify-between gap-3 transition-all duration-150 group select-none cursor-pointer outline-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        !disabled && !active && !isDanger && !isSuccess && "text-gray-700 hover:bg-gray-100/80 hover:text-black",
        !disabled && isDanger && "text-red-600 hover:bg-red-50/80 hover:text-red-700",
        !disabled && isSuccess && "text-emerald-700 hover:bg-emerald-50/80 hover:text-emerald-800",
        active && "bg-neutral-900 text-white font-medium shadow-2xs",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {Icon && (
          <div
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150",
              active
                ? "bg-white/20 text-white"
                : isDanger
                ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white"
                : isSuccess
                ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                : "bg-gray-100/90 text-gray-500 group-hover:bg-black group-hover:text-white"
            )}
          >
            {renderDropdownIcon(Icon)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "text-[13px] leading-snug truncate block",
                active ? "font-bold text-white" : isDanger ? "font-semibold text-red-600 group-hover:text-red-700" : "font-semibold text-gray-800 group-hover:text-black"
              )}
            >
              {label || children}
            </span>
            {badge && (
              <span
                className={clsx(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0",
                  active ? "bg-white/20 text-white" : badgeClassName
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p
              className={clsx(
                "text-[11px] leading-tight truncate mt-0.5",
                active ? "text-gray-300" : "text-gray-400 group-hover:text-gray-500"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right side elements */}
      {rightElement ? (
        <div className="shrink-0">{rightElement}</div>
      ) : showChevron ? (
        <ChevronRight
          className={clsx(
            "w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5",
            active ? "text-white/70" : "text-gray-400 group-hover:text-gray-700"
          )}
        />
      ) : null}
    </button>
  );
};

export const DropdownHeader = ({ children, title, subtitle, className = "" }) => {
  if (children) {
    return <div className={clsx("p-2", className)}>{children}</div>;
  }

  return (
    <div className={clsx("px-3 py-2", className)}>
      {title && (
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-0.5">
          {title}
        </p>
      )}
      {subtitle && <p className="text-[12px] text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );
};

export const DropdownDivider = ({ className = "" }) => {
  return <div className={clsx("my-1.5 border-t border-gray-100", className)} />;
};

export const DropdownGroup = ({ children, title, className = "" }) => {
  return (
    <div className={clsx("py-0.5", className)}>
      {title && (
        <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          {title}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};

export default Dropdown;
