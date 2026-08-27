import React, { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "../data/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const val = localStorage.getItem("shoesmu_is_authenticated");
    if (val === null) {
      localStorage.setItem("shoesmu_is_authenticated", "true");
      return true;
    }
    return val === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("shoesmu_current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name === "Rassendrya Vikya Syauqi" || parsed?.id === "u-1") {
          localStorage.setItem("shoesmu_current_user", JSON.stringify(MOCK_USERS.super_admin));
          return MOCK_USERS.super_admin;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    const savedRole = localStorage.getItem("shoesmu_active_role");
    return savedRole && MOCK_USERS[savedRole] ? MOCK_USERS[savedRole] : MOCK_USERS.super_admin;
  });

  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      const user = MOCK_USERS[roleKey];
      setCurrentUser(user);
      localStorage.setItem("shoesmu_active_role", roleKey);
      localStorage.setItem("shoesmu_current_user", JSON.stringify(user));
    }
  };

  const isSuperAdmin = currentUser?.role === "super_admin";
  const isStaff = currentUser?.role === "staff";

  const hasPermission = (allowedRoles = []) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(currentUser?.role);
  };

  const login = (roleOrUser = "super_admin", customEmail = "") => {
    setIsAuthenticated(true);
    localStorage.setItem("shoesmu_is_authenticated", "true");

    let userToSet;
    if (typeof roleOrUser === "string" && MOCK_USERS[roleOrUser]) {
      userToSet = { ...MOCK_USERS[roleOrUser] };
      if (customEmail && customEmail.trim() && customEmail !== "dummy@gmail.com") {
        userToSet.email = customEmail.trim();
      }
      localStorage.setItem("shoesmu_active_role", roleOrUser);
    } else if (typeof roleOrUser === "object" && roleOrUser !== null) {
      userToSet = roleOrUser;
      localStorage.setItem("shoesmu_active_role", roleOrUser.role || "super_admin");
    } else {
      userToSet = MOCK_USERS.super_admin;
      localStorage.setItem("shoesmu_active_role", "super_admin");
    }

    setCurrentUser(userToSet);
    localStorage.setItem("shoesmu_current_user", JSON.stringify(userToSet));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("shoesmu_is_authenticated");
    localStorage.removeItem("shoesmu_current_user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        switchRole,
        isSuperAdmin,
        isStaff,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

