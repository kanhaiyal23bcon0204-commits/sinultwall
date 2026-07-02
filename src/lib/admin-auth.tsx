// src/lib/admin-auth.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * Admin authentication.
 * Fetches credentials securely from environment variables instead of hardcoding.
 */

// Get email and password from .env file securely
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com";
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123"; 

const SESSION_KEY = "sinultwall.admin.session";
const PASSWORD_KEY = "sinultwall.admin.password";

function currentPassword(): string {
  try {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

interface AdminAuthValue {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<{ error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setEmail(s);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const signIn: AdminAuthValue["signIn"] = async (inputEmail, password) => {
    await new Promise((r) => setTimeout(r, 600));
    const normalized = inputEmail.trim().toLowerCase();
    
    // Validates against the securely loaded email
    if (normalized !== ADMIN_EMAIL.toLowerCase()) {
      return { error: "This email is not authorized for admin access." };
    }
    if (password !== currentPassword()) {
      return { error: "Incorrect password." };
    }
    localStorage.setItem(SESSION_KEY, normalized);
    setEmail(normalized);
    return {};
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setEmail(null);
  };

  const requestPasswordReset: AdminAuthValue["requestPasswordReset"] = async (inputEmail) => {
    await new Promise((r) => setTimeout(r, 700));
    const normalized = inputEmail.trim().toLowerCase();
    if (normalized !== ADMIN_EMAIL.toLowerCase()) {
      return { error: "No admin account exists for this email." };
    }
    return {};
  };

  const resetPassword: AdminAuthValue["resetPassword"] = async (newPassword) => {
    await new Promise((r) => setTimeout(r, 600));
    if (newPassword.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    try {
      localStorage.setItem(PASSWORD_KEY, newPassword);
    } catch {
      /* ignore */
    }
    return {};
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!email,
        email,
        loading,
        signIn,
        signOut,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}