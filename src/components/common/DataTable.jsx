import React from "react";
import clsx from "clsx";

export const DataTable = ({
  columns = [],
  data = [],
  keyExtractor = (item, index) => item.id || index,
  emptyMessage = "No records found.",
  isLoading = false,
  className = "",
}) => {
  return (
    <div className={clsx("w-full overflow-x-auto bg-canvas border border-gray-200", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={clsx(
                  "py-3.5 px-6 text-caption font-semibold text-gray-700 uppercase tracking-wider",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-text2">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-mute">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-ink mb-2"></div>
                <p>Loading data...</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-mute">
                <p>{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr key={keyExtractor(item, rowIdx)} className="hover:bg-gray-50/70 transition-colors">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={clsx(
                      "py-4 px-6 text-ink",
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                      col.cellClassName
                    )}
                  >
                    {col.render ? col.render(item, rowIdx) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
