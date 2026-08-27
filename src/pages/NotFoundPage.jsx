import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export const NotFoundPage = () => {
  return (
    <div className="py-24 text-center max-w-md mx-auto">
      <h1 className="text-display2 font-bold text-ink">404</h1>
      <p className="text-h4 font-semibold text-ink mt-2">Page Not Found</p>
      <p className="text-caption text-mute mt-1 mb-6">
        The requested admin module does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
