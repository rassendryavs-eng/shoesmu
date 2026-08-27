import React from "react";
import clsx from "clsx";

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footer,
}) => {
  return (
    <div className={clsx("bg-canvas border border-gray-200 rounded-none", className)}>
      {(title || action) && (
        <div
          className={clsx(
            "flex items-center justify-between px-6 py-4 border-b border-gray-200",
            headerClassName
          )}
        >
          <div>
            {title && <h3 className="font-semibold text-text1 text-ink">{title}</h3>}
            {subtitle && <p className="text-caption text-mute mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={clsx("p-6", bodyClassName)}>{children}</div>
      {footer && <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">{footer}</div>}
    </div>
  );
};

export default Card;
