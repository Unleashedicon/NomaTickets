"use client";

// context/UserContext.tsx
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";

interface UserContextType {
  user: NonNullable<ReturnType<typeof useSession>["data"]>["user"] | null;
  isLoading: boolean;
  logout: () => void;
  // add any custom user logic or helpers here
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Add any extra user-related helpers here, e.g. logout function
  const logout = () => signOut();

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isLoading,
      logout,
    }),
    [session, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
