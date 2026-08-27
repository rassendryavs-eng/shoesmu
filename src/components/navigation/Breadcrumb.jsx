import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const Breadcrumb = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-caption text-mute">
      <Link to="/dashboard" className="hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-ink">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
