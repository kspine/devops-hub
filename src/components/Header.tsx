import { 
  Sun, 
  Moon, 
  Search,
  Activity,
  Menu,
  ChevronDown,
  HelpCircle,
  Terminal,
  Key,
  Wrench,
  Globe
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";
import { useUser } from "../UserContext";
import { PrimaryGroup, ActiveTab, PRIMARY_GROUPS, SECONDARY_TABS, getPrimaryGroupForTab } from "../navigation";
import { LanguageSelector } from "./LanguageSelector";

interface HeaderProps {
  activeTab: ActiveTab;
  isCompact: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onGoToLanding?: () => void;
}

const UNITY_VERSIONS = ["2022.3 LTS", "2023.2", "6000.0 (Unity 6)"];
const UNITY_PLATFORMS = ["iOS", "Android", "WebGL", "Windows"];

const UNREAL_VERSIONS = ["5.1", "5.2", "5.3", "5.4"];
const UNREAL_PLATFORMS = ["Windows", "PlayStation 5", "Xbox Series X", "iOS", "Android"];

const WEB_VERSIONS = ["Node.js 18", "Node.js 20", "Node.js 22", "Next.js 14", "Vite 5"];
const WEB_PLATFORMS = ["Chrome/Edge", "Safari", "Firefox", "Vercel", "Netlify"];

const MOBILE_VERSIONS = ["Flutter 3.16", "Flutter 3.19", "React Native 0.73", "SwiftUI", "Jetpack Compose"];
const MOBILE_PLATFORMS = ["iOS", "Android", "HarmonyOS", "Tablet", "Foldable"];

const BACKEND_VERSIONS = ["Go 1.21", "Rust 1.75", "Java 21", "Python 3.12", "Node.js 20"];
const BACKEND_PLATFORMS = ["Linux/K8s", "AWS Lambda", "Google Cloud Run", "Azure Functions", "On-Premise"];

const SEARCH_ITEMS = [
  // Troubleshooting articles
  {
    id: "ios-signing",
    type: "troubleshooter",
    titleEn: "No Matching Provisioning Profile (iOS)",
    titleZh: "找不到匹配的 iOS 描述文件",
    descEn: "Xcode compilation or archive failures caused by missing provisioning profiles.",
    descZh: "由缺失 Provisioning Profile 导致的 Xcode 归档或编译失败。"
  },
  {
    id: "android-multidex",
    type: "troubleshooter",
    titleEn: "Android 64K Dex Method Limit Exceeded",
    titleZh: "Android 64K Dex 方法数超限",
    descEn: "Dalvik compilation limits exceeded when integrating multiple SDKs.",
    descZh: "集成多个 SDK 导致 Dalvik 编译器方法数限制溢出。"
  },
  {
    id: "unity-editor-ref",
    type: "troubleshooter",
    titleEn: "UnityEditor API Reference Compiler Error",
    titleZh: "UnityEditor 命名空间编译报错",
    descEn: "Compiling standalones with references to editor-only scripts.",
    descZh: "非编辑器模式下包含 UnityEditor 专属脚本引用导致打包报错。"
  },
  {
    id: "il2cpp-ndk",
    type: "troubleshooter",
    titleEn: "IL2CPP Compilation Failure (Missing NDK)",
    titleZh: "IL2CPP 编译失败 / NDK 缺失",
    descEn: "Unity failing to locate a compatible Android NDK toolchain.",
    descZh: "Unity 无法定位兼容的 Android NDK 路径导致 C++ 编译失败。"
  },
  // CI/CD Templates
  {
    id: "gitlab",
    type: "pipeline",
    titleEn: "GitLab CI Workflow Template",
    titleZh: "GitLab CI 工作流模板",
    descEn: "Pre-configured .gitlab-ci.yml for automated packaging pipelines.",
    descZh: "预制的 .gitlab-ci.yml 配置文件，用于自动化打包流水线。"
  },
  {
    id: "bitbucket",
    type: "pipeline",
    titleEn: "Bitbucket Pipelines Template",
    titleZh: "Bitbucket Pipelines 配置文件",
    descEn: "Pre-configured bitbucket-pipelines.yml build configurations.",
    descZh: "预配置的 bitbucket-pipelines.yml 编译工作流。"
  },
  {
    id: "circleci",
    type: "pipeline",
    titleEn: "CircleCI Workflow Config",
    titleZh: "CircleCI 配置文件模板",
    descEn: "Pre-configured .circleci/config.yml for dockerized build executors.",
    descZh: "针对容器化执行环境预配置的 .circleci/config.yml 脚本。"
  },
  // Platforms / Features
  {
    id: "ios-signing-portal",
    type: "signing",
    titleEn: "Signing & Credentials Portal (iOS/Android)",
    titleZh: "签署凭据与信任机构 (iOS/Android)",
    descEn: "Configure Bundle IDs, Apple Team IDs, Android Keystore details, Gradle configurations and signing tools.",
    descZh: "配置 Bundle ID、苹果 Team ID、Android 密钥库别名密码、Gradle 配置及签名自查工具。"
  },
  {
    id: "ai-script-architect",
    type: "architect",
    titleEn: "AI Script Architect (Gemini 3.5)",
    titleZh: "AI 自动化脚本架构师",
    descEn: "Automate custom tasks (versioning, asset bundle copy, manifest sync).",
    descZh: "使用 AI 自动生成并架构自定义构建和分发脚本。"
  }
];

import { useTheme } from "../context/ThemeContext";

export default function Header({ activeTab, isCompact, isOpenMobile, setIsOpenMobile, onGoToLanding }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const { 
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    setActiveWorkspaceId,
    updateWorkspace
  } = useWorkspace();
  const { user } = useUser();
  
  const isZh = language === "zh";

  // Alias fields for backward compatibility or ease of use
  const projectType = activeWorkspace?.projectType || 'web';
  const engineVersion = activeWorkspace?.engineVersion || 'v1.0';
  const targetPlatform = activeWorkspace?.targetPlatform || 'Web';

  const setEngineVersion = (v: string) => {
    if (activeWorkspaceId) updateWorkspace(activeWorkspaceId, { engineVersion: v });
  };

  // Background Runner Status Monitor with simulated ping
  const [runnerMonitor, setRunnerMonitor] = useState({
    online: 4,
    total: 4,
    latency: 18,
    status: "healthy" as "healthy" | "warning" | "error"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRunnerMonitor(prev => {
        const nextLatency = Math.floor(12 + Math.random() * 12);
        const warningChance = Math.random() > 0.90;
        return {
          online: warningChance ? 3 : 4,
          total: 4,
          latency: nextLatency,
          status: warningChance ? "warning" : "healthy"
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const setTargetPlatform = (p: string) => {
    if (activeWorkspaceId) updateWorkspace(activeWorkspaceId, { targetPlatform: p });
  };

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  const versionRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Focus the input when receiving 'open-command-palette' event (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleOpenCommand = () => {
      searchInputRef.current?.focus();
      setIsDropdownOpen(true);
    };
    window.addEventListener("open-command-palette", handleOpenCommand);
    return () => window.removeEventListener("open-command-palette", handleOpenCommand);
  }, []);

  const allTabs = useMemo(() => Object.values(SECONDARY_TABS).flat(), []);

  const allItems = useMemo(() => {
    const TABS_ITEMS = allTabs.map(tab => ({
      id: `tab-${tab.id}`,
      type: "tab",
      icon: tab.icon,
      titleEn: `Go to ${tab.labelEn}`,
      titleZh: `跳转到 ${tab.labelZh}`,
      descEn: `Switch to the ${tab.labelEn} tab`,
      descZh: `切换到 ${tab.labelZh} 标签页`,
      action: () => {
        window.dispatchEvent(new CustomEvent("navigate-tab", { detail: tab.id }));
      }
    }));

    const ACTION_ITEMS = [
      {
        id: "action-generate-script",
        type: "action",
        icon: Terminal,
        titleEn: "Generate Script",
        titleZh: "生成构建脚本",
        descEn: "Open Architect to generate CI/CD scripts",
        descZh: "打开架构设计生成 CI/CD 脚本",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "architect" }));
        }
      },
      {
        id: "action-check-provisioning",
        type: "action",
        icon: Key,
        titleEn: "Check Provisioning",
        titleZh: "检查描述文件",
        descEn: "Open Code Signing to check provisioning profiles",
        descZh: "打开代码签名检查描述文件",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "signing" }));
        }
      }
    ];

    const TROUBLESHOOT_ITEMS = SEARCH_ITEMS.map(item => ({
      ...item,
      icon: Wrench,
      action: () => {
        window.dispatchEvent(new CustomEvent("navigate-tab", { detail: item.type }));
        if (item.type === "troubleshooter") {
          window.dispatchEvent(new CustomEvent("select-troubleshoot-issue", { detail: item.id }));
        } else if (item.type === "pipeline") {
          window.dispatchEvent(new CustomEvent("select-pipeline-template", { detail: item.id }));
        }
      }
    }));

    return [...TABS_ITEMS, ...ACTION_ITEMS, ...TROUBLESHOOT_ITEMS];
  }, [allTabs]);

  const filteredItems = useMemo(() => {
    if (searchQuery.trim() === "") {
      // Suggest top tabs and action items by default
      return allItems.slice(0, 7);
    }
    return allItems.filter(item => 
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.titleZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.descZh.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (versionRef.current && !versionRef.current.contains(e.target as Node)) {
        setShowVersionDropdown(false);
      }
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setShowPlatformDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  

  

  

  

  

  return (
    <header className={`border-b backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 py-4 transition-colors duration-500 ${mode === 'dark' ? 'border-white/5 bg-black/70' : 'border-gray-200 bg-white/80'}`}>
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className={`md:hidden p-1.5 rounded-lg border transition-colors ${mode === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-100' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900'}`}
          >
            <Menu className="h-4 w-4" />
          </button>
          
          
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-100 hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="h-4 w-4 flex items-center justify-center">
                  <Search className="h-3 w-3 opacity-50" />
                </div>
                <span className="text-xs font-bold truncate max-w-[120px]">
                  {activeWorkspace?.name || t('header.selectWorkspace')}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showWorkspaceDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute top-full left-0 mt-2 w-64 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                      mode === 'dark' ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                      <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {t('header.activeWorkspaces')}
                      </div>
                      {workspaces.map(ws => (
                        <button
                          key={ws.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveWorkspaceId(ws.id);
                            setShowWorkspaceDropdown(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl flex flex-col gap-1 transition-all group ${
                            activeWorkspaceId === ws.id 
                              ? (mode === 'dark' ? 'bg-accent/10 border border-accent/20' : 'bg-accent/5 border border-accent/10')
                              : (mode === 'dark' ? 'hover:bg-white/5 border border-transparent' : 'hover:bg-gray-50 border border-transparent')
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${activeWorkspaceId === ws.id ? 'text-accent' : (mode === 'dark' ? 'text-gray-200' : 'text-gray-900')}`}>
                              {ws.name}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              ws.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                            }`}>
                              {ws.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-gray-500">
                            <span className="uppercase">{ws.projectType}</span>
                            <span className="opacity-30">•</span>
                            <span>{ws.targetPlatform}</span>
                          </div>
                        </button>
                      ))}
                      <div className="p-2 border-t border-white/5 mt-1">
                        <button 
                          onClick={() => {
                            setShowWorkspaceDropdown(false);
                            window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "workspaces" }));
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent("open-create-workspace-modal"));
                            }, 50);
                          }}
                          className={`w-full p-2 rounded-xl border border-dashed text-[10px] font-bold uppercase transition-all ${
                          mode === 'dark' ? 'border-white/10 text-gray-500 hover:border-accent hover:text-accent' : 'border-gray-200 text-gray-400 hover:border-accent hover:text-accent'
                        }`}>
                          {t('header.createWorkspace')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-gray-900/50 hidden md:block" />

            <div className="hidden md:flex items-center text-[10px] font-mono">
               <span className="text-gray-500">{t('header.workspaceLabel')}</span>
               <span className={`mx-2 ${mode === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>/</span>
               <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                 {t(`nav.groups.${getPrimaryGroupForTab(activeTab)}`)}
               </span>
            </div>
          </div>

        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md w-full relative" ref={searchContainerRef}>
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-accent transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex(prev => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex(prev => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (filteredItems[selectedIndex]) {
                    filteredItems[selectedIndex].action();
                    setIsDropdownOpen(false);
                    searchInputRef.current?.blur();
                  }
                } else if (e.key === "Escape") {
                  setIsDropdownOpen(false);
                  searchInputRef.current?.blur();
                }
              }}
              className={`w-full pl-9 pr-12 py-2 border rounded-xl text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all font-sans ${mode === 'dark' ? 'bg-gray-900/40 focus:bg-gray-900/70 border-gray-800/60 focus:border-accent/50 text-gray-200' : 'bg-gray-50 focus:bg-white border-gray-200 focus:border-accent text-gray-900'}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none pointer-events-none">
              <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${mode === 'dark' ? 'bg-gray-900/80 text-gray-500 border-gray-800' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Adaptive Search Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className={`absolute left-0 right-0 top-full mt-2 w-full border rounded-xl shadow-2xl p-1.5 max-h-80 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin z-[60] ${mode === 'dark' ? 'bg-gray-950 border-gray-850' : 'bg-white border-gray-200'}`}
              >
                {searchQuery.trim() === "" && (
                  <div className="px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-wider select-none">
                    {t('header.suggestedShortcuts')}
                  </div>
                )}
                {filteredItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500 font-sans italic">
                    {t('header.noResults')}
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          item.action();
                          setIsDropdownOpen(false);
                          searchInputRef.current?.blur();
                        }}
                        className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left cursor-pointer ${
                          isSelected 
                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                            : "text-gray-300 hover:bg-gray-900/40 hover:text-gray-200 border border-transparent"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-indigo-400" : "text-gray-500"}`} />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className="text-xs font-semibold truncate">
                            {isZh ? item.titleZh : item.titleEn}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate mt-0.5">
                            {isZh ? item.descZh : item.descEn}
                          </span>
                        </div>
                        <span className="shrink-0 text-[8px] font-mono font-bold text-gray-600 uppercase bg-gray-900/60 px-1 py-0.5 rounded border border-gray-850 self-center">
                          {item.type}
                        </span>
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Global Controls */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          {/* System Status & Engine Version & Selectors */}
          <div className="hidden md:flex items-center gap-3 bg-gray-900/30 rounded-lg px-3 py-1.5 mr-1 border border-gray-900/40 relative">
            {/* Background Status Monitor / Runner Health */}
            <div className="flex items-center gap-1.5 relative group cursor-pointer">
              <span className="text-[9px] text-gray-500 uppercase tracking-tight">{isZh ? "运行集群" : "RUNNERS"}</span>
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                <div className={`h-1.5 w-1.5 rounded-full ${runnerMonitor.status === "healthy" ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                <span className="text-[9px] text-emerald-400 font-mono font-bold">
                  {runnerMonitor.online}/{runnerMonitor.total} OK
                </span>
              </div>
              <div className="text-[9px] text-gray-600 font-mono">
                ({runnerMonitor.latency}ms)
              </div>
              {/* Tooltip on Hover */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-gray-950 border border-gray-850 rounded-lg shadow-2xl p-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[60] text-left">
                <div className="font-bold text-[10px] text-gray-300 border-b border-gray-900 pb-1.5 mb-1.5 uppercase tracking-wider flex justify-between">
                  <span>{isZh ? "执行机状态监视器" : "Runner Pool Status"}</span>
                  <span className="text-emerald-400 font-mono">{isZh ? "健康度 100%" : "Health 100%"}</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-gray-400">
                  <div className="flex justify-between">
                    <span>r-prod-01 (High CPU)</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>r-stage-02 (Unity)</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>r-bake-03 (GPU)</span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="flex justify-between pt-1 text-[8px] text-gray-500 border-t border-gray-900">
                    <span>{isZh ? "上次心跳刷新" : "Last Heartbeat Check"}</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-3 w-px bg-gray-800" />
            
            {/* Tech Stack (Synced with Sidebar/Context) */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-500 uppercase tracking-tight">{t('header.techStackLabel')}</span>
              <span className="text-[9px] text-indigo-400 font-bold capitalize">
                {projectType}
              </span>
            </div>
            
            <div className="h-3 w-px bg-gray-800" />
 
            {/* Version Selector Dropdown */}
            <div className="relative" ref={versionRef}>
              <button
                onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-900/40 border border-gray-800/60 hover:bg-gray-900/80 hover:border-indigo-500/30 rounded text-[9px] font-bold text-gray-200 cursor-pointer transition-all"
              >
                <span className="text-gray-500 font-normal">{t('header.versionLabel')}: </span>
                <span className="text-indigo-400">{engineVersion}</span>
                <ChevronDown className="h-2.5 w-2.5 text-gray-500 shrink-0 ml-0.5" />
              </button>

              <AnimatePresence>
                {showVersionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-1 w-36 bg-gray-950 border border-gray-850 rounded-lg shadow-2xl p-1 z-50 flex flex-col gap-0.5"
                  >
                    {(projectType === "unity" 
                      ? UNITY_VERSIONS 
                      : projectType === "unreal" 
                      ? UNREAL_VERSIONS 
                      : projectType === "web"
                      ? WEB_VERSIONS
                      : projectType === "mobile"
                      ? MOBILE_VERSIONS
                      : BACKEND_VERSIONS).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setEngineVersion(v);
                          setShowVersionDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[9px] font-mono transition-colors cursor-pointer ${
                          engineVersion === v
                            ? "bg-indigo-500/15 text-indigo-400 font-bold"
                            : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-3 w-px bg-gray-800" />

            {/* Platform Selector Dropdown */}
            <div className="relative" ref={platformRef}>
              <button
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-900/40 border border-gray-800/60 hover:bg-gray-900/80 hover:border-indigo-500/30 rounded text-[9px] font-bold text-gray-200 cursor-pointer transition-all"
              >
                <span className="text-gray-500 font-normal">{t('header.platformLabel')}: </span>
                <span className="text-emerald-400">{targetPlatform}</span>
                <ChevronDown className="h-2.5 w-2.5 text-gray-500 shrink-0 ml-0.5" />
              </button>

              <AnimatePresence>
                {showPlatformDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-1 w-40 bg-gray-950 border border-gray-850 rounded-lg shadow-2xl p-1 z-50 flex flex-col gap-0.5"
                  >
                    {(projectType === "unity" 
                      ? UNITY_PLATFORMS 
                      : projectType === "unreal" 
                      ? UNREAL_PLATFORMS 
                      : projectType === "web"
                      ? WEB_PLATFORMS
                      : projectType === "mobile"
                      ? MOBILE_PLATFORMS
                      : BACKEND_PLATFORMS).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setTargetPlatform(p);
                          setShowPlatformDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[9px] font-mono transition-colors cursor-pointer ${
                          targetPlatform === p
                            ? "bg-emerald-500/15 text-emerald-400 font-bold"
                            : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-3 w-px bg-gray-800" />
            
            <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
              <span className="text-[9px] text-gray-500 font-mono">Gemini</span>
              <Activity className="h-2.5 w-2.5 text-indigo-500 animate-pulse" />
            </div>

            <div className="h-3 w-px bg-gray-800" />

            {/* SSO / User Identity Status */}
            <div className="flex items-center gap-2">
              <div className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase flex items-center gap-1.5 ${
                user.role === 'ops' 
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}>
                <div className={`h-1 w-1 rounded-full ${user.role === 'ops' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                {user.role}
              </div>
              <span className="text-[8px] text-gray-600 font-mono hidden lg:inline-block">SSO: AUTHENTICATED</span>
            </div>
          </div>

          {/* Floating Theme Toggle Component */}
          <button 
            onClick={toggleMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-sm transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 ${
              mode === 'dark' 
                ? 'bg-gray-950/80 border-white/10 text-indigo-300 hover:border-indigo-500/50 shadow-black/40' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-amber-400/50 shadow-gray-200/50'
            }`}
            title={isZh ? `当前模式: ${mode === 'dark' ? '深色模式' : '浅色模式'} - 点击切换` : `Current Mode: ${mode === 'dark' ? 'Dark Mode' : 'Light Mode'} - Click to Switch`}
          >
            <div className={`p-1 rounded-lg transition-transform duration-300 group-hover:rotate-12 ${
              mode === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-600'
            }`}>
              {mode === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </div>
            <span className="text-[10px] font-mono font-bold tracking-tight hidden sm:inline-block">
              {mode === 'dark' 
                ? (isZh ? "深色模式" : "Dark Mode") 
                : (isZh ? "浅色模式" : "Light Mode")}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${
              mode === 'dark' ? 'bg-indigo-400 animate-pulse' : 'bg-amber-500 animate-pulse'
            }`} />
          </button>

          {/* Help & Shortcuts Button */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-shortcuts-modal"))}
            className={`p-2 rounded-xl border transition-colors ${mode === 'dark' ? 'border-white/10 text-gray-400 hover:bg-gray-900 hover:text-gray-100' : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            title={t('header.shortcutsHelp')}
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* High-End Glassmorphic Language Switcher */}
          <LanguageSelector variant="segmented" />
        </div>
      </div>
    </header>
  );
}
