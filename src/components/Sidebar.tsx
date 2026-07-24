import React, { useState, useRef, useEffect } from "react";
import { 
  Gamepad2, 
  Boxes, 
  Globe,
  Smartphone,
  Server,
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";
import { useUser } from "../UserContext";
import { PrimaryGroup, PRIMARY_GROUPS } from "../navigation";
import { UserRole } from "../types";

interface SidebarProps {
  activePrimary: PrimaryGroup;
  setActivePrimary: (group: PrimaryGroup) => void;
  isCompact: boolean;
  onToggleCompact: () => void;
  onOpenSDKModal: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onGoToLanding: () => void;
}

import { useTheme } from "../context/ThemeContext";
import { useToast } from "./ToastContext";

export default function Sidebar({ 
  activePrimary, 
  setActivePrimary, 
  isCompact,
  onToggleCompact,
  onOpenSDKModal,
  isOpenMobile,
  setIsOpenMobile,
  onGoToLanding
}: SidebarProps) {
  const { language, t } = useLanguage();
  const { mode } = useTheme();
  const { addToast } = useToast();
  const { workspaces, activeWorkspace, activeWorkspaceId, setActiveWorkspaceId, updateWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const setProjectType = (type: any) => {
    if (activeWorkspaceId) updateWorkspace(activeWorkspaceId, { projectType: type });
  };
  const { user, setRole } = useUser();
  const isZh = language === "zh";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (groupId: PrimaryGroup) => {
    setActivePrimary(groupId);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Sidebar Container */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCompact ? 80 : 256
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed inset-y-0 left-0 z-50 md:sticky md:z-30
          border-r flex flex-col h-screen transition-colors duration-500
          ${mode === 'dark' ? 'bg-[#000000] border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)]' : 'bg-[#ffffff] border-gray-100 shadow-sm shadow-gray-200/50'}
          ${isOpenMobile ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Border Toggle Button (Straddling the border) */}
        <button
          onClick={onToggleCompact}
          className={`hidden md:flex absolute -right-3 top-24 h-6 w-6 items-center justify-center rounded-full border transition-all z-50 shadow-lg group ${mode === 'dark' ? 'border-gray-800 bg-gray-900 text-gray-400 hover:text-gray-100 hover:border-accent/50 shadow-black/50' : 'border-gray-200 bg-white text-gray-400 hover:text-accent hover:border-accent/50 shadow-gray-200/50'}`}
          title={isCompact ? "Expand (Ctrl+B)" : "Collapse (Ctrl+B)"}
        >
          {isCompact ? (
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          )}
        </button>

        {/* Sidebar Header / Branding */}
        <div className={`p-4 flex items-center ${isCompact ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onGoToLanding}
              className={`h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center border transition-colors ${mode === 'dark' ? 'bg-gray-900 border-gray-800 shadow-accent/10 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 shadow-gray-200/50 hover:bg-gray-100'}`}
            >
              <img 
                src="/src/assets/images/toolkit_logo_1783990888706.jpg" 
                alt="Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
            <AnimatePresence mode="wait">
              {!isCompact && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <h1 className={`font-sans font-bold text-sm tracking-tight ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      DevOps Hub
                    </h1>
                    <span className={`text-[8px] border px-1 rounded font-mono ${mode === 'dark' ? 'bg-accent/10 text-accent border-accent/40' : 'bg-accent/5 text-accent border-accent/20'}`}>
                      v1.2.0
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {t('sidebar.oneStopPlatform')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setIsOpenMobile(false)}
            className={`md:hidden p-1 transition-colors ${mode === 'dark' ? 'text-gray-500 hover:text-gray-100' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Engine Switcher Section */}
        <div className={`px-3 pb-3 relative`} ref={dropdownRef}>
          <AnimatePresence mode="wait">
            {!isCompact && (
              <motion.span 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold block mb-2 overflow-hidden"
              >
                {t('sidebar.currentWorkspace')}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Trigger Button */}
          <button
            onClick={() => {
              if (isCompact) {
                setIsDropdownOpen(!isDropdownOpen);
              } else {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
            className={`w-full flex items-center justify-between gap-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
              isCompact 
                ? (mode === 'dark' ? "p-2.5 justify-center bg-gray-900/60 border-gray-800/50 hover:bg-gray-900 hover:border-accent/30" : "p-2.5 justify-center bg-gray-50 border-gray-200 hover:bg-white hover:border-accent/30") 
                : (mode === 'dark' ? "px-3.5 py-2 bg-gray-900/40 border-gray-900/60 hover:bg-gray-900/80 hover:border-accent/30" : "px-3.5 py-2 bg-gray-50/50 border-gray-100 hover:bg-white hover:border-accent/30")
            }`}
            title={isCompact ? (activeWorkspace?.name || projectType) : undefined}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Colored active indicator icon */}
              <div className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
                projectType === "unity"
                  ? (mode === 'dark' ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-500")
                  : projectType === "unreal"
                  ? (mode === 'dark' ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-500")
                  : projectType === "web"
                  ? (mode === 'dark' ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-500")
                  : projectType === "mobile"
                  ? (mode === 'dark' ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-500")
                  : projectType === "fullstack"
                  ? (mode === 'dark' ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-500")
                  : (mode === 'dark' ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-500")
              }`}>
                {projectType === "unity" ? (
                  <Gamepad2 className="h-4 w-4" />
                ) : projectType === "unreal" ? (
                  <Boxes className="h-4 w-4" />
                ) : projectType === "web" ? (
                  <Globe className="h-4 w-4" />
                ) : projectType === "mobile" ? (
                  <Smartphone className="h-4 w-4" />
                ) : projectType === "fullstack" ? (
                  <Layers className="h-4 w-4" />
                ) : (
                  <Server className="h-4 w-4" />
                )}
              </div>
              
              {!isCompact && (
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-semibold capitalize ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {activeWorkspace?.name || projectType}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">
                    {projectType} • {activeWorkspace?.targetPlatform || 'Unknown'}
                  </span>
                </div>
              )}
            </div>

            {!isCompact && (
              <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 shrink-0 ${
                isDropdownOpen ? "rotate-180 text-gray-300" : ""
              }`} />
            )}
          </button>

          {/* Dropdown Options */}
          <AnimatePresence>
            {!isCompact && isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className={`absolute left-3 right-3 mt-1.5 border rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 max-h-[300px] overflow-y-auto ${
                  mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                }`}
              >
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      setIsDropdownOpen(false);
                      addToast(
                        language === "zh" 
                          ? `已成功切换工作空间至: ${ws.name}` 
                          : `Successfully switched workspace to: ${ws.name}`, 
                        "success"
                      );
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      activeWorkspaceId === ws.id
                        ? (mode === 'dark' ? "bg-accent/10 text-accent" : "bg-accent/10 text-accent")
                        : (mode === 'dark' ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50")
                    }`}
                  >
                    {ws.projectType === "unity" ? (
                      <Gamepad2 className="h-4 w-4 flex-shrink-0" />
                    ) : ws.projectType === "unreal" ? (
                      <Boxes className="h-4 w-4 flex-shrink-0" />
                    ) : ws.projectType === "web" ? (
                      <Globe className="h-4 w-4 flex-shrink-0" />
                    ) : ws.projectType === "mobile" ? (
                      <Smartphone className="h-4 w-4 flex-shrink-0" />
                    ) : ws.projectType === "fullstack" ? (
                      <Layers className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Server className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className={`font-semibold truncate ${mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{ws.name}</span>
                      <span className="text-[9px] text-gray-500 uppercase">{ws.projectType}</span>
                    </div>
                    {activeWorkspaceId === ws.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </button>
                ))}
                
                <div className={`mt-1 pt-1 border-t ${mode === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "workspaces" }));
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      mode === 'dark' ? 'text-accent hover:bg-accent/10' : 'text-accent hover:bg-accent/10'
                    }`}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    {t('sidebar.manageWorkspaces')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {PRIMARY_GROUPS.map((group) => {
            const Icon = group.icon;
            const isActive = activePrimary === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleNavClick(group.id)}
                title={t(`nav.groups.${group.id}`)}
                className={`w-full flex items-center ${isCompact ? "justify-center px-1 py-3" : "justify-between px-3 py-3"} rounded-xl text-sm font-medium tracking-wide transition-all cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? (mode === 'dark' ? "bg-accent/15 text-accent font-semibold shadow-sm" : "bg-accent/10 text-accent font-semibold shadow-sm")
                    : (mode === 'dark' ? "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900")
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePrimaryTabIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-105 flex-shrink-0 ${isActive ? "text-accent" : (mode === 'dark' ? "text-gray-400 group-hover:text-accent" : "text-gray-500 group-hover:text-accent")}`} />
                  <AnimatePresence mode="wait">
                    {!isCompact && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="animate-in fade-in whitespace-nowrap"
                      >
                        {t(`nav.groups.${group.id}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            );
        })}
      </nav>

      {/* Cluster Status Widget at the bottom */}
      <div className={`p-4 border-t ${mode === 'dark' ? 'border-gray-900/50' : 'border-gray-100'} ${isCompact ? "flex justify-center" : ""}`}>
          <div className={`rounded-xl border transition-all ${isCompact ? "p-2" : "p-3"} ${mode === 'dark' ? 'bg-gray-900/30 border-gray-900/60' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`flex items-center gap-3 ${isCompact ? "justify-center" : ""}`}>
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              {!isCompact && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{t('sidebar.clusterStatus')}</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">100% UP</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <div key={i} className="h-1 flex-1 bg-emerald-500/60 rounded-full" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile & Role Switcher */}
        <div className={`mt-auto p-4 border-t transition-colors ${mode === 'dark' ? 'border-white/5 bg-black/50' : 'border-gray-100 bg-gray-50/50'} backdrop-blur-md`}>
          <div className={`flex items-center gap-3 ${isCompact ? "justify-center" : ""}`}>
             <div className="relative group">
              <div className={`h-9 w-9 rounded-full border flex items-center justify-center text-xs font-bold ring-2 transition-colors ${mode === 'dark' ? 'bg-accent/20 border-accent/30 text-accent ring-accent/5' : 'bg-accent/10 border-accent/20 text-accent ring-accent/5'}`}>
                {user.name[0]}
              </div>
              <div className={`absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 ${mode === 'dark' ? 'border-gray-950' : 'border-white'}`} />
            </div>
            
            {!isCompact && (
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1 w-1 rounded-full ${user.role === 'ops' ? 'bg-accent' : 'bg-emerald-400'}`} />
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {!isCompact && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["ops", "developer"] as UserRole[]).map(r => (
                <button 
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-2 py-1.5 rounded-lg border text-[8px] font-bold uppercase transition-all ${
                    user.role === r 
                      ? (mode === 'dark' ? "bg-accent/20 border-accent/40 text-accent shadow-lg shadow-accent/10" : "bg-accent/10 border-accent/30 text-accent shadow-md shadow-accent/5")
                      : (mode === 'dark' ? "bg-gray-900/40 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600")
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.aside>

      {/* Overlay backdrop for mobile */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className={`md:hidden fixed inset-0 z-40 backdrop-blur-sm transition-colors ${mode === 'dark' ? 'bg-gray-950/60' : 'bg-gray-400/20'}`}
        />
      )}
    </>
  );
}
