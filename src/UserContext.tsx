import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, UserContextType } from "./types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: UserRole }>({
    name: "Alex Oper",
    role: "ops"
  });

  const setRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  const hasPermission = (permission: string) => {
    if (user.role === "admin") return true;
    
    switch (permission) {
      case "trigger_build":
        return ["ops", "developer"].includes(user.role);
      case "manage_nodes":
      case "terminate_high_priority":
        return ["ops"].includes(user.role);
      case "view_logs":
        return true;
      default:
        return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, hasPermission, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
