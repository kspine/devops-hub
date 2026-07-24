import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectType } from "./types";

export interface Workspace {
  id: string;
  name: string;
  projectType: ProjectType;
  engineVersion: string;
  targetPlatform: string;
  status: "Active" | "Building" | "Idle" | "Error";
  lastAccessed: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace: Workspace | null;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (ws: Omit<Workspace, "id" | "lastAccessed" | "status">) => void;
  deleteWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: "ws-004",
    name: "Enterprise-Core-Platform",
    projectType: "fullstack",
    engineVersion: "Node.js v20 / K8s",
    targetPlatform: "Cloud Native",
    status: "Active",
    lastAccessed: new Date().toISOString(),
  },
  {
    id: "ws-001",
    name: "Project-Aura-RPG",
    projectType: "unity",
    engineVersion: "2022.3.15f1",
    targetPlatform: "iOS",
    status: "Active",
    lastAccessed: new Date().toISOString(),
  },
  {
    id: "ws-002",
    name: "NextGen-Engine-Core",
    projectType: "unreal",
    engineVersion: "5.3.2",
    targetPlatform: "Windows",
    status: "Idle",
    lastAccessed: new Date().toISOString(),
  },
  {
    id: "ws-003",
    name: "Ops-Dashboard-Web",
    projectType: "web",
    engineVersion: "v18.17.0",
    targetPlatform: "Production",
    status: "Active",
    lastAccessed: new Date().toISOString(),
  }
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem("ais_workspaces");
    return saved ? JSON.parse(saved) : DEFAULT_WORKSPACES;
  });
  
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return localStorage.getItem("ais_active_ws_id") || workspaces[0]?.id || "";
  });

  useEffect(() => {
    localStorage.setItem("ais_workspaces", JSON.stringify(workspaces));
    localStorage.setItem("ais_active_ws_id", activeWorkspaceId);
  }, [workspaces, activeWorkspaceId]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;

  const createWorkspace = (ws: Omit<Workspace, "id" | "lastAccessed" | "status">) => {
    const newWs: Workspace = {
      ...ws,
      id: `ws-${Math.random().toString(36).substr(2, 9)}`,
      status: "Idle",
      lastAccessed: new Date().toISOString(),
    };
    setWorkspaces(prev => [newWs, ...prev]);
    setActiveWorkspaceId(newWs.id);
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(workspaces.find(w => w.id !== id)?.id || "");
    }
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  return (
    <WorkspaceContext.Provider value={{ 
      workspaces, 
      activeWorkspaceId, 
      activeWorkspace,
      setActiveWorkspaceId,
      createWorkspace,
      deleteWorkspace,
      updateWorkspace
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
