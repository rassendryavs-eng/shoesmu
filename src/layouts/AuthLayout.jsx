import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
