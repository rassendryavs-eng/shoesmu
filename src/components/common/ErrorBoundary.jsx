import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 text-2xl font-bold border border-rose-100">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Something went wrong</h2>
          <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this page."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
