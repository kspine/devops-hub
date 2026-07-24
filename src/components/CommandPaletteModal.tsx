import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Search, 
  Workflow, 
  Play, 
  Terminal, 
  Key, 
  Wrench, 
  Layout, 
  Layers, 
  Zap, 
  RotateCcw, 
  Trash2, 
  RefreshCw, 
  FileCode, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  X,
  Sparkles,
  Command,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "./ToastContext";
import { SECONDARY_TABS, ActiveTab } from "../navigation";

export interface PaletteItem {
  id: string;
  category: "command" | "navigation" | "config" | "action";
  icon: any;
  titleEn: string;
  titleZh: string;
  subtitleEn: string;
  subtitleZh: string;
  shortcut?: string;
  badge?: string;
  action: () => void;
}

export default function CommandPaletteModal() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle or open via custom event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    };

    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  const allTabs = useMemo(() => Object.values(SECONDARY_TABS).flat(), []);

  const paletteItems = useMemo<PaletteItem[]>(() => {
    // 1. Navigation items
    const navItems: PaletteItem[] = allTabs.map((tab) => ({
      id: `nav-${tab.id}`,
      category: "navigation",
      icon: tab.icon,
      titleEn: `Navigate to ${tab.labelEn}`,
      titleZh: `跳转至 ${tab.labelZh}`,
      subtitleEn: `View ${tab.labelEn} dashboard module`,
      subtitleZh: `进入 ${tab.labelZh} 模块页面`,
      badge: "VIEW",
      action: () => {
        window.dispatchEvent(new CustomEvent("navigate-tab", { detail: tab.id }));
        addToast(isZh ? `已跳转至 ${tab.labelZh}` : `Navigated to ${tab.labelEn}`, "info");
      }
    }));

    // 2. Pipeline Config files (Fuzzy search targets)
    const configItems: PaletteItem[] = [
      {
        id: "cfg-github-ci",
        category: "config",
        icon: FileCode,
        titleEn: ".github/workflows/ci.yml",
        titleZh: ".github/workflows/ci.yml (GitHub Actions)",
        subtitleEn: "Production GitHub Actions workflow for Unity/Unreal compilation",
        subtitleZh: "用于 Unity/Unreal 自动构建打包的 GitHub Actions 主流程",
        badge: "CONFIG",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "designer" }));
          addToast(isZh ? "已打开 GitHub Actions 构建配置" : "Opened GitHub Actions workflow config", "info");
        }
      },
      {
        id: "cfg-gitlab-ci",
        category: "config",
        icon: FileCode,
        titleEn: ".gitlab-ci.yml",
        titleZh: ".gitlab-ci.yml (GitLab CI/CD)",
        subtitleEn: "GitLab multi-stage runner pipeline manifest",
        subtitleZh: "GitLab 多阶段 Runner 构建配置文件",
        badge: "CONFIG",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "designer" }));
          addToast(isZh ? "已加载 GitLab CI/CD 配置" : "Loaded GitLab CI config", "info");
        }
      },
      {
        id: "cfg-build-sh",
        category: "config",
        icon: Terminal,
        titleEn: "scripts/build_android_apk.sh",
        titleZh: "scripts/build_android_apk.sh (Shell)",
        subtitleEn: "Automated Android Gradle & keystore signing script",
        subtitleZh: "Android 自动化打包与签名 Shell 脚本",
        badge: "SCRIPT",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "architect" }));
          addToast(isZh ? "已载入 Android 构建脚本" : "Loaded Android build script", "info");
        }
      },
      {
        id: "cfg-fastfile",
        category: "config",
        icon: FileCode,
        titleEn: "fastlane/Fastfile",
        titleZh: "fastlane/Fastfile (iOS TestFlight Delivery)",
        subtitleEn: "Automated iOS app signing and TestFlight deployment lane",
        subtitleZh: "iOS 描述文件管理与 TestFlight 自动分发 Lane",
        badge: "CONFIG",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "signing" }));
          addToast(isZh ? "已导航至 Fastfile 签署界面" : "Navigated to Fastfile signing lane", "info");
        }
      }
    ];

    // 3. Quick Commands
    const commandItems: PaletteItem[] = [
      {
        id: "cmd-run-latest",
        category: "command",
        icon: Play,
        titleEn: "Run Latest Build",
        titleZh: "立即触发最新版本构建",
        subtitleEn: "Trigger immediate execution on main branch runner",
        subtitleZh: "在主分支 runner 上立即运行打包流水线",
        shortcut: "⌘R",
        badge: "ACTION",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "designer" }));
          addToast(isZh ? "🚀 已开始运行最新构建！" : "🚀 Triggered latest build pipeline execution!", "success");
        }
      },
      {
        id: "cmd-rollback",
        category: "command",
        icon: RotateCcw,
        titleEn: "Trigger Emergency Rollback",
        titleZh: "触发紧急版本回滚 (Emergency Rollback)",
        subtitleEn: "Rollback production cluster to last verified green artifact",
        subtitleZh: "将生产环境快速回滚至上一稳定基线版本",
        badge: "DANGER",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "deployments" }));
          addToast(isZh ? "⚠️ 已发起紧急回滚审批流程" : "⚠️ Initiated emergency cluster rollback workflow", "warning");
        }
      },
      {
        id: "cmd-sync-scm",
        category: "command",
        icon: RefreshCw,
        titleEn: "Sync SCM Repositories",
        titleZh: "全量同步 GitHub/GitLab 仓库分支与配置",
        subtitleEn: "Re-fetch directory structures and webhook tokens",
        subtitleZh: "重新拉取远端构建配置与 Webhook 事件凭据",
        badge: "SYNC",
        action: () => {
          addToast(isZh ? "✨ 仓库配置同步成功！" : "✨ SCM repositories synced successfully!", "success");
        }
      },
      {
        id: "cmd-clear-cache",
        category: "command",
        icon: Trash2,
        titleEn: "Purge Runner Build Caches",
        titleZh: "清理所有 Runner 构建与 Asset Bundle 缓存",
        subtitleEn: "Clear Unity Library, DDC, and npm caches across cluster",
        subtitleZh: "清除集群内缓存文件夹以强制全量干净构建",
        badge: "MAINTAIN",
        action: () => {
          addToast(isZh ? "🧹 所有 Runner 节点缓存已强行清空！" : "🧹 Cleared build runner caches across node pool!", "info");
        }
      },
      {
        id: "cmd-generate-ai-script",
        category: "command",
        icon: Sparkles,
        titleEn: "Generate AI Automation Script (Gemini 3.5)",
        titleZh: "用 Gemini 生成 CI/CD 自动化脚本",
        subtitleEn: "Launch AI Script Architect to draft C#, Python or Shell hooks",
        subtitleZh: "唤起 AI 架构师生成 C# / Python / Shell 构建钩子",
        badge: "AI",
        action: () => {
          window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "architect" }));
          addToast(isZh ? "已唤起 AI 自动化脚本生成器" : "Opened AI Script Architect", "info");
        }
      }
    ];

    return [...commandItems, ...configItems, ...navItems];
  }, [allTabs, isZh, addToast]);

  // Fuzzy filter
  const filteredItems = useMemo(() => {
    if (!query.trim()) return paletteItems.slice(0, 8);

    const q = query.toLowerCase();
    return paletteItems.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleZh.toLowerCase().includes(q) ||
        item.subtitleEn.toLowerCase().includes(q) ||
        item.subtitleZh.toLowerCase().includes(q)
    );
  }, [paletteItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.15 }}
          className={`w-full max-w-2xl rounded-3xl border shadow-2xl relative z-10 overflow-hidden flex flex-col ${
            mode === "dark" ? "bg-[#09090b] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {/* Top Search Bar Input */}
          <div className={`flex items-center gap-3 px-5 py-4 border-b relative ${
            mode === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <Search className="w-5 h-5 text-indigo-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isZh
                  ? "搜索流水线配置, 快速指令 (如: '运行构建') 或导航页面..."
                  : "Type a command, search pipeline configs (e.g. '.github/workflows') or navigate..."
              }
              className={`w-full bg-transparent text-sm font-sans placeholder-gray-400 focus:outline-none ${
                mode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className={`p-1 rounded-lg text-gray-400 cursor-pointer ${
                  mode === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded border ${
              mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-2 max-h-96 overflow-y-auto space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 font-sans italic">
                {isZh ? "未找到符合条件的指令或配置文件" : "No matching commands or configuration files found"}
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
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? mode === 'dark'
                          ? "bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-transparent border border-indigo-500/30 text-white"
                          : "bg-indigo-50/80 border border-indigo-200 text-indigo-950"
                        : mode === 'dark'
                          ? "hover:bg-white/5 text-gray-300 border border-transparent"
                          : "hover:bg-gray-100 text-gray-800 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : mode === 'dark'
                              ? "bg-white/5 text-gray-400 border border-white/5"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${
                            isSelected ? (mode === 'dark' ? 'text-white' : 'text-indigo-950') : (mode === 'dark' ? 'text-gray-200' : 'text-gray-900')
                          }`}>
                            {isZh ? item.titleZh : item.titleEn}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${
                                item.badge === "DANGER"
                                  ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                                  : item.badge === "ACTION"
                                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                  : "bg-indigo-500/20 text-indigo-500 border border-indigo-500/30"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] truncate mt-0.5 font-medium ${
                          mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {isZh ? item.subtitleZh : item.subtitleEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.shortcut && (
                        <kbd className={`px-2 py-0.5 text-[9px] font-mono rounded border ${
                          mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
                        }`}>
                          {item.shortcut}
                        </kbd>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? "text-indigo-500 translate-x-0.5" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className={`px-5 py-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
            mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            <div className="flex items-center gap-4">
              <span>↑↓ {isZh ? "导航" : "Navigate"}</span>
              <span>↵ {isZh ? "选择" : "Execute"}</span>
              <span>ESC {isZh ? "关闭" : "Close"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-500 font-bold">
              <Command className="w-3 h-3" />
              <span>DevOps Hub Palette</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
