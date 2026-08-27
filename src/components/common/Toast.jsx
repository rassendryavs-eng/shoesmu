import React, { useEffect, useState } from "react";
import { Check, Copy, Sparkles, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import clsx from "clsx";

/**
 * Modern Toast Notification Component
 * Supports rich code-copied layout, success, info, and warning states.
 */
export const Toast = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || 2800;
    const interval = 20;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast]);

  if (!toast) return null;

  // Determine if this is a copy-code toast
  const isCopyCode = toast.type === "copy" || Boolean(toast.code);
  const code = toast.code;
  const message = typeof toast === "string" ? toast : toast.message;
  const title = toast.title || (isCopyCode ? "Code Copied!" : "Notification");

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-full pointer-events-auto select-none"
    >
      <div className="relative overflow-hidden bg-[#121212]/95 backdrop-blur-xl border border-white/12 text-white rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] flex items-start gap-3.5">
        {/* Left Icon Badge */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
          {isCopyCode ? (
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          ) : toast.type === "warning" ? (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          ) : toast.type === "info" ? (
            <Info className="w-4 h-4 text-blue-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        {/* Middle Content Area */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h4 className="text-[13.5px] font-bold text-white tracking-tight">
              {title}
            </h4>
            {isCopyCode && code && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-white/10 text-emerald-300 border border-white/10 tracking-wider">
                {code}
              </span>
            )}
          </div>

          <p className="text-[12.5px] text-gray-300 font-normal leading-relaxed mt-0.5 truncate">
            {isCopyCode
              ? "Promo code copied to clipboard & ready to use."
              : message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="shrink-0 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
