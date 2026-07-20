"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { AuthScreen } from "@/components/auth-screen";

interface AuthUser {
  email?: string;
  phone?: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, logout: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return <AuthScreen onLogin={(u) => setUser(u)} />;
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
}
