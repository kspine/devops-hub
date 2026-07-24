import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";
import CommandPaletteModal from "./components/CommandPaletteModal";
import { Activity, CheckCircle2 } from "lucide-react";
import Sidebar from "./components/Sidebar";
import SigningHelper from "./components/SigningHelper";
import BuildTroubleshooter from "./components/BuildTroubleshooter";
import ScriptArchitect from "./components/ScriptArchitect";
import ProductionSuite from "./components/ProductionSuite";
import SSHKeyManager from "./components/SSHKeyManager";
import DevOpsHubView from "./components/views/DevOpsHubView";
import PipelineView from "./components/views/PipelineView";
import KnowledgeBaseView from "./components/KnowledgeBaseView";
import { LocalizedQuickIssue } from "./data";
import { BuildPlatform } from "./types";
import LogView from "./components/views/LogView";
import TelemetryView from "./components/views/TelemetryView";
import PipelineTopology from "./components/views/PipelineTopology";
import RunnerPools from "./components/views/RunnerPools";
import DeploymentCenter from "./components/views/DeploymentCenter";
import ArtifactLibrary from "./components/views/ArtifactLibrary";
import WorkspaceManager from "./components/views/WorkspaceManager";
import ProjectPortfolioView from "./components/views/ProjectPortfolioView";
import ProjectGovernanceView from "./components/views/ProjectGovernanceView";
import ResourceQuotaView from "./components/views/ResourceQuotaView";
import ProjectDashboardView from "./components/views/ProjectDashboardView";
import EngineeringCollaborationView from "./components/views/EngineeringCollaborationView";
import EngineeringQualityView from "./components/views/EngineeringQualityView";
import ExtensibilityView from "./components/views/ExtensibilityView";
import BackendServices from "./components/views/BackendServices";
import PipelineBuilder from "./components/PipelineBuilder";
import LandingPage from "./components/LandingPage";
import { useWorkspace } from "./WorkspaceContext";
import { useLanguage } from "./LanguageContext";
import { useToast } from "./components/ToastContext";

import { PrimaryGroup, ActiveTab, SECONDARY_TABS, getPrimaryGroupForTab, PRIMARY_GROUPS } from "./navigation";

import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const { mode } = useTheme();
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [customIssues, setCustomIssues] = useState<LocalizedQuickIssue[]>([]);
  const activePrimary = getPrimaryGroupForTab(activeTab);

  const [isCompact, setIsCompact] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleOpenShortcuts = () => setIsShortcutsOpen(true);
    const handleNavigateTab = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveTab>;
      setActiveTab(customEvent.detail);
      setShowLanding(false);
    };
    const handleTriggerConfetti = () => {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
          disableForReducedMotion: true,
          scalar: 0.85
        });
      } catch (err) {
        console.error("Confetti error:", err);
      }
    };
    
    window.addEventListener("open-shortcuts-modal", handleOpenShortcuts);
    window.addEventListener("navigate-tab", handleNavigateTab);
    window.addEventListener("trigger-confetti", handleTriggerConfetti);
    
    return () => {
      window.removeEventListener("open-shortcuts-modal", handleOpenShortcuts);
      window.removeEventListener("navigate-tab", handleNavigateTab);
      window.removeEventListener("trigger-confetti", handleTriggerConfetti);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Direct question mark listener (if not typing in any input/textarea)
      if (e.key === "?" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      if ((e.ctrlKey || e.metaKey)) {
        const key = e.key.toLowerCase();
        if (key === "k") {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        } else if (key === "b") {
          e.preventDefault();
          setIsCompact(prev => !prev);
        } else if (key === "/") {
          e.preventDefault();
          setIsShortcutsOpen(prev => !prev);
        } else if (key === "1") {
          e.preventDefault();
          setActiveTab("dashboard");
        } else if (key === "2") {
          e.preventDefault();
          setActiveTab("designer");
        } else if (key === "l") {
          e.preventDefault();
          setActiveTab("logs");
        } else if (key === "3") {
          e.preventDefault();
          setActiveTab("troubleshooter");
        } else if (key === "4") {
          e.preventDefault();
          setActiveTab("architect");
        } else if (key === "5") {
          e.preventDefault();
          setActiveTab("production");
        } else if (key === "6") {
          e.preventDefault();
          setActiveTab("signing");
        } else if (key === "7") {
          e.preventDefault();
          setActiveTab("sshKeys");
        } else if (key === "8") {
          e.preventDefault();
          setActiveTab("telemetry");
        } else if (key === "p") {
          e.preventDefault();
          setActiveTab("artifacts");
        } else if (key === "d") {
          e.preventDefault();
          setActiveTab("deployments");
        } else if (key === "9") {
          e.preventDefault();
          setActiveTab("blueprints");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);



  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className={`min-h-screen flex font-sans selection:bg-accent/30 transition-colors duration-500 theme-card-bg ${mode === 'dark' ? 'bg-[#000000] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar 
        activePrimary={activePrimary} 
        setActivePrimary={(groupId) => setActiveTab(PRIMARY_GROUPS.find(g => g.id === groupId)?.defaultTab || "dashboard")} 
        isCompact={isCompact} 
        onToggleCompact={() => setIsCompact(!isCompact)}
        onOpenSDKModal={() => {}}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        onGoToLanding={() => setShowLanding(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTab={activeTab} 
          isCompact={isCompact}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
          onGoToLanding={() => setShowLanding(true)}
        />

        
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 w-full flex flex-col min-h-0">
          {/* Secondary Tab Navigation */}
          {SECONDARY_TABS[activePrimary].length > 1 && (
            <div className={`flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 border-b pb-1 overflow-x-auto no-scrollbar ${mode === 'dark' ? 'border-gray-900/50' : 'border-gray-200'}`}>
            {SECONDARY_TABS[activePrimary].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all relative whitespace-nowrap shrink-0 ${
                    isActive 
                      ? "text-accent" 
                      : (mode === 'dark' ? "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30 rounded-t-lg" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-t-lg")
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {isZh ? tab.labelZh : tab.labelEn}
                  {isActive && (
                    <motion.div
                      layoutId="secondaryTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="w-full">
                {activeTab === "dashboard" && (
                  <PipelineView 
                    isZh={isZh} 
                    projectType={projectType} 
                    t={t} 
                    isCompact={isCompact}
                    addToast={addToast}
                  />
                )}

                {activeTab === "workspaces" && (
                  <WorkspaceManager />
                )}

                {activeTab === "services" && (
                  <BackendServices />
                )}

                {activeTab === "designer" && (
                  <PipelineBuilder />
                )}
                
                {activeTab === "logs" && (
                  <LogView isZh={isZh} projectType={projectType} />
                )}

                {activeTab === "telemetry" && <TelemetryView isZh={isZh} />}
                {activeTab === "runners" && <RunnerPools />}
                {activeTab === "signing" && <SigningHelper />}
                {activeTab === "troubleshooter" && <BuildTroubleshooter />}
                {activeTab === "architect" && <ScriptArchitect />}
                {activeTab === "blueprints" && <PipelineTopology />}
                {activeTab === "production" && <ProductionSuite />}
                {activeTab === "artifacts" && <ArtifactLibrary />}
                {activeTab === "deployments" && <DeploymentCenter />}
                {activeTab === "sshKeys" && <SSHKeyManager />}
                {activeTab === "governance" && <ProjectGovernanceView />}
                {activeTab === "quotas" && <ResourceQuotaView />}
                {activeTab === "projectDashboard" && <ProjectDashboardView />}
                {activeTab === "collaboration" && <EngineeringCollaborationView />}
                {activeTab === "quality" && <EngineeringQualityView />}
                {activeTab === "extensibility" && <ExtensibilityView />}
                {activeTab === "hub" && <DevOpsHubView />}
                {activeTab === "knowledge" && (
                  <KnowledgeBaseView
                    isZh={isZh}
                    customIssues={customIssues}
                    setCustomIssues={setCustomIssues}
                    onSelectIssue={(id) => setActiveTab("troubleshooter")}
                    onLoadSample={(sample, platform) => setActiveTab("troubleshooter")}
                    showToast={(msg) => addToast(msg, "info")}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </main>

        
        <footer className={`border-t mt-auto py-2 px-6 text-[10px] font-mono backdrop-blur-md sticky bottom-0 z-20 transition-colors ${mode === 'dark' ? 'border-white/5 text-gray-500 bg-black/80' : 'border-gray-100 text-gray-400 bg-white/80'}`}>
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-left ${mode === 'dark' ? 'bg-gray-900/50 border-gray-800/50 hover:bg-gray-900/80 hover:border-accent/40' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-accent/40'}`}
              title={isZh ? "点击查看详细日志 analysis" : "Click to view detailed log analysis"}
            >
              <span className={`flex items-center gap-1.5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Activity className="w-3 h-3 text-accent" />
                {isZh ? "最近构建流水线状态" : "Latest Pipeline Status"}
              </span>
              <div className={`h-3 w-px ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {isZh ? "成功" : "Success"} (iOS-Release-v1.2.0)
              </span>
              <span className="text-gray-400 hidden md:inline-block">
                • {isZh ? "2分钟前" : "2 mins ago"}
              </span>
            </button>
            <div className="flex items-center gap-4">
              <span>{t("footerLine1")}</span>
            </div>
          </div>
        </footer>
  
        </div>
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <CommandPaletteModal />
    </div>
  );
}
