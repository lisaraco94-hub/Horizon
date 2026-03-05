"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { DEMO_USERS, MOCK_LABS } from "./constants";
import type { AppUser, Laboratory } from "./types";

interface UserContextValue {
  user: AppUser | null;
  login: (username: string) => boolean;
  logout: () => void;
  getVisibleLabs: () => Laboratory[];
}

const UserCtx = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = useCallback((username: string): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const getVisibleLabs = useCallback((): Laboratory[] => {
    if (!user) return [];

    switch (user.role) {
      case "global_manager":
        return MOCK_LABS;
      case "regional_manager":
        return MOCK_LABS.filter((lab) => lab.region === user.region);
      case "distributor":
        return MOCK_LABS.filter(
          (lab) =>
            lab.distributor === user.distributor && lab.country === user.country
        );
      default:
        return [];
    }
  }, [user]);

  return (
    <UserCtx.Provider value={{ user, login, logout, getVisibleLabs }}>
      {children}
    </UserCtx.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
