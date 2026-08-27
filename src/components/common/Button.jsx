import React from "react";
import clsx from "clsx";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

  const variants = {
    primary: "bg-ink text-white hover:bg-black rounded-full shadow-none",
    secondary: "bg-soft-cloud text-ink hover:bg-gray-200 rounded-full shadow-none",
    outline: "bg-canvas text-ink border border-hairline hover:bg-soft-cloud hover:border-gray-400 rounded-full shadow-none",
    danger: "bg-error-50 text-error-600 border border-error-200 hover:bg-error-100 rounded-full shadow-none",
    ghost: "bg-transparent text-ink hover:bg-soft-cloud rounded-full",
    "icon-circular": "bg-soft-cloud text-ink hover:bg-gray-200 rounded-full p-0 flex items-center justify-center",
  };

  const sizes = {
    sm: variant === "icon-circular" ? "w-8 h-8" : "h-8 px-3.5 text-caption",
    md: variant === "icon-circular" ? "w-10 h-10" : "h-10 px-5 text-text2",
    lg: variant === "icon-circular" ? "w-12 h-12" : "h-12 px-7 text-text1",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-1.5 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-1.5 shrink-0" />}
    </button>
  );
};

export default Button;
