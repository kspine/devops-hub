import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LiveTail from "../LiveTail";
import { 
  Terminal, 
  Search, 
  Info, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Play,
  Pause,
  Trash2,
  ArrowDown,
  Download,
  Clock,
  FileJson,
  FileText,
  Code,
  Pin,
  GitCompare,
  History,
  Bell,
  Plus,
  X,
  Settings,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  Flame,
  Sliders,
  ShieldCheck
} from "lucide-react";
import { useToast } from "../ToastContext";
import { ProjectType } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts";

interface LogEntry {
  id: string;
  type: "error" | "critical" | "warning" | "info";
  msg: string;
  msgZh: string;
  timestamp: string;
  category: string;
  createdTime: number; // millisecond timestamp
}

interface LogViewProps {
  isZh: boolean;
  projectType: ProjectType;
}

const INITIAL_LOGS = (projectType: ProjectType): LogEntry[] => {
  const now = Date.now();
  const entries: LogEntry[] = [
    {
      id: "log-init-1",
      type: "info",
      category: "System",
      timestamp: "14:19:02",
      createdTime: now - 350000,
      msg: `Initializing ${projectType === "unity" ? "Unity" : "Unreal"} build pipeline environment...`,
      msgZh: `正在初始化 ${projectType === "unity" ? "Unity" : "Unreal"} 构建流水线环境...`
    },
    {
      id: "log-init-2",
      type: "info",
      category: "Git",
      timestamp: "14:19:35",
      createdTime: now - 290000,
      msg: "Cloning repository: github.com/game-studio/core-engine.git (branch: main)...",
      msgZh: "正在克隆存储库: github.com/game-studio/core-engine.git (分支: main)..."
    },
    {
      id: "log-init-3",
      type: "error",
      category: "Build",
      timestamp: "14:20:11",
      createdTime: now - 220000,
      msg: "Failed to sign the application. No matching keystore or provisioning profile found in /certs/release.keystore",
      msgZh: "打包签名失败。在指定路径 /certs/release.keystore 中找不到匹配的密钥库或配置文件"
    },
    {
      id: "log-init-4",
      type: "warning",
      category: "Shader",
      timestamp: "14:21:05",
      createdTime: now - 160000,
      msg: "Redundant shader keywords detected: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT. Performance may be impacted.",
      msgZh: "检测到冗余着色器关键字: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT。运行时渲染性能可能会受到影响。"
    },
    {
      id: "log-init-5",
      type: "info",
      category: "Git",
      timestamp: "14:22:30",
      createdTime: now - 110000,
      msg: "Branch 'release/v1.2.0' successfully pulled from origin. 42 files updated.",
      msgZh: "分支 'release/v1.2.0' 已成功从远程仓库拉取。42 个文件已更新。"
    },
    {
      id: "log-init-6",
      type: "error",
      category: "IL2CPP",
      timestamp: "14:25:44",
      createdTime: now - 40000,
      msg: "C++ compiler link error: 'undefined reference to GooglePlayServices_Init' in libgamecore.so",
      msgZh: "C++ 编译器链接错误: 共享库 libgamecore.so 中 'GooglePlayServices_Init' 未定义引用"
    }
  ];
  return entries.sort((a, b) => a.createdTime - b.createdTime);
};

const STREAM_TEMPLATES = [
  { type: "info" as const, category: "AssetPipeline", msg: "Optimizing 142 texture resources for multi-platform WebGL/Mobile high-fidelity compression...", msgZh: "正在为多平台 WebGL/移动端高保真压缩优化 142 个纹理资源..." },
  { type: "info" as const, category: "Compiler", msg: "Generating modern C++ code from assemblies. Estimated compilation duration: 120 seconds.", msgZh: "正在从程序集生成现代化 C++ 代码。预计编译链接耗时: 120 秒。" },
  { type: "warning" as const, category: "Build", msg: "Target SDK version 34 requires granular photo and video media permissions implementation.", msgZh: "目标 SDK 版本 34 需要声明细粒度的照片与视频媒体读取权限。" },
  { type: "info" as const, category: "Gradle", msg: "Resolving external dependencies and downloading plugin packages for package :com.google.android.gms...", msgZh: "正在解析外部依赖并下载 :com.google.android.gms 插件包..." },
  { type: "critical" as const, category: "Compiler", msg: "CRITICAL FAILURE: Memory limit exceeded (OOM) during IL2CPP linkage heap optimization.", msgZh: "关键性错误: 在 IL2CPP 链接堆优化期间内存超限 (OOM)。" },
  { type: "info" as const, category: "Linker", msg: "Linking dynamic shared objects: libil2cpp.so.debug", msgZh: "正在打包链接动态共享库: libil2cpp.so.debug" },
  { type: "warning" as const, category: "Graphics", msg: "Vulkan API fallback activated on older devices lack hardware Ray-Tracing support.", msgZh: "在缺乏硬件光线追踪支持的旧款设备上，已启用 Vulkan API 兼容回退。" },
  { type: "error" as const, category: "Manifest", msg: "Malformed XML element structure detected in AndroidManifest.xml: line 44 col 12.", msgZh: "在 AndroidManifest.xml 中检测到畸形的 XML 标签结构: 第 44 行第 12 列。" },
  { type: "critical" as const, category: "Signing", msg: "CRITICAL FAILURE: Keychain verification failed. Private keystore signature mismatch.", msgZh: "关键性错误: 密钥链验证失败。私有密钥库签名不匹配。" },
  { type: "info" as const, category: "System", msg: "Build completed successfully. Compression savings: 154.2 MB (34.2% reduction).", msgZh: "构建编译圆满成功。文件压缩节省: 154.2 MB (减少达 34.2%)。" },
];

const GITHUB_TEMPLATES = [
  { type: "info" as const, category: "Action", msg: "Run actions/checkout@v4", msgZh: "正在运行 actions/checkout@v4" },
  { type: "info" as const, category: "Workflow", msg: "Setting up job: build-deploy-production", msgZh: "正在设置作业: build-deploy-production" },
  { type: "warning" as const, category: "Runner", msg: "GitHub-hosted runner is running low on disk space (5GB remaining).", msgZh: "GitHub 托管的运行器磁盘空间不足 (剩余 5GB)。" },
  { type: "info" as const, category: "Secret", msg: "Masking sensitive variable: DEPLOY_TOKEN", msgZh: "正在掩码敏感变量: DEPLOY_TOKEN" },
];

const JENKINS_TEMPLATES = [
  { type: "info" as const, category: "Master", msg: "Jenkins pipeline starting: GamePipeline #142", msgZh: "Jenkins 流水线启动: GamePipeline #142" },
  { type: "info" as const, category: "Agent", msg: "Executing on agent: build-node-aws-01", msgZh: "正在运行器节点 build-node-aws-01 上执行" },
  { type: "error" as const, category: "Groovy", msg: "Groovy script error: Caught: groovy.lang.MissingPropertyException", msgZh: "Groovy 脚本错误: 捕获异常: groovy.lang.MissingPropertyException" },
];

function formatLogTime(createdTime: number, isRelative: boolean, isZh: boolean): string {
  if (!isRelative) {
    return new Date(createdTime).toISOString();
  }
  const diff = Date.now() - createdTime;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return isZh ? "刚刚" : "just now";
  if (seconds < 60) return isZh ? `${seconds} 秒前` : `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isZh ? `${minutes} 分钟前` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return isZh ? `${hours} 小时前` : `${hours}h ago`;
}

export interface AlertRule {
  id: string;
  name: string;
  pattern: string;
  highlightClass: string;
  textColor: string;
  action: "toast" | "highlight" | "none";
  isActive: boolean;
}

export const SESSION_A_LOGS: LogEntry[] = [
  { id: "sa-1", type: "info", category: "System", timestamp: "10:00:01", createdTime: Date.now() - 350000, msg: "Initializing build environment on container ID x84a2...", msgZh: "正在容器 ID x84a2 上初始化构建环境..." },
  { id: "sa-2", type: "info", category: "Git", timestamp: "10:00:03", createdTime: Date.now() - 340000, msg: "Cloning repository: github.com/game-studio/core-engine.git (branch: main)...", msgZh: "正在克隆存储库: github.com/game-studio/core-engine.git (分支: main)..." },
  { id: "sa-3", type: "info", category: "Git", timestamp: "10:00:05", createdTime: Date.now() - 330000, msg: "HEAD is now at 8fa1b2d: Implement dynamic shader loading rules", msgZh: "HEAD 当前指向 8fa1b2d: 实现动态着色器加载规则" },
  { id: "sa-4", type: "info", category: "AssetPipeline", timestamp: "10:00:10", createdTime: Date.now() - 320000, msg: "Scanning 1,420 asset dependencies in project structure...", msgZh: "正在扫描项目结构中的 1,420 个资源依赖项..." },
  { id: "sa-5", type: "warning", category: "Graphics", timestamp: "10:00:15", createdTime: Date.now() - 310000, msg: "Texture format 'ASTC_8x8' is uncompressed. Performance may degrade on low-end devices.", msgZh: "纹理格式 'ASTC_8x8' 未被压缩。低端设备上的运行性能可能会下降。" },
  { id: "sa-6", type: "info", category: "Shader", timestamp: "10:00:22", createdTime: Date.now() - 300000, msg: "Compiling 256 shader variants (Vulkan / OpenGL ES 3.1)...", msgZh: "正在编译 256 个着色器变体 (Vulkan / OpenGL ES 3.1)..." },
  { id: "sa-7", type: "info", category: "Compiler", timestamp: "10:00:30", createdTime: Date.now() - 290000, msg: "Compiling C# assemblies into C++ via IL2CPP backend...", msgZh: "正在通过 IL2CPP 后端将 C# 程序集编译为 C++..." },
  { id: "sa-8", type: "info", category: "Compiler", timestamp: "10:00:35", createdTime: Date.now() - 280000, msg: "Generating modern C++ code from assemblies. Estimated compilation duration: 120 seconds.", msgZh: "正在从程序集生成现代化 C++ 代码。预计编译链接耗时: 120 秒。" },
  { id: "sa-9", type: "warning", category: "Compiler", timestamp: "10:00:41", createdTime: Date.now() - 270000, msg: "Redundant shader keywords detected: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT.", msgZh: "检测到冗余着色器关键字: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT。" },
  { id: "sa-10", type: "error", category: "Linker", timestamp: "10:00:48", createdTime: Date.now() - 260000, msg: "C++ compiler link error: 'undefined reference to SteamAPI_Init' in libgamecore.so", msgZh: "C++ 编译器链接错误: 共享库 libgamecore.so 中 'SteamAPI_Init' 未定义引用" },
  { id: "sa-11", type: "critical", category: "Build", timestamp: "10:00:52", createdTime: Date.now() - 250000, msg: "CRITICAL FAILURE: Memory limit exceeded (OOM) during IL2CPP linkage heap optimization.", msgZh: "关键性错误: 在 IL2CPP 链接堆优化期间内存超限 (OOM)。" }
];

export const SESSION_B_LOGS: LogEntry[] = [
  { id: "sb-1", type: "info", category: "System", timestamp: "10:00:01", createdTime: Date.now() - 350000, msg: "Initializing build environment on container ID x84a2...", msgZh: "正在容器 ID x84a2 上初始化构建环境..." },
  { id: "sb-2", type: "info", category: "Git", timestamp: "10:00:03", createdTime: Date.now() - 340000, msg: "Cloning repository: github.com/game-studio/core-engine.git (branch: release/v1.2.0)...", msgZh: "正在克隆存储库: github.com/game-studio/core-engine.git (分支: release/v1.2.0)..." },
  { id: "sb-3", type: "info", category: "Git", timestamp: "10:00:05", createdTime: Date.now() - 330000, msg: "HEAD is now at 92ab1f5: Resolve unresolved external linkers for SteamAPI and optimize renderer", msgZh: "HEAD 当前指向 92ab1f5: 解决 SteamAPI 的未定义链接，并优化渲染器" },
  { id: "sb-4", type: "info", category: "AssetPipeline", timestamp: "10:00:10", createdTime: Date.now() - 320000, msg: "Scanning 1,420 asset dependencies in project structure...", msgZh: "正在扫描项目结构中的 1,420 个资源依赖项..." },
  { id: "sb-5", type: "warning", category: "Graphics", timestamp: "10:00:15", createdTime: Date.now() - 310000, msg: "Texture format 'ASTC_8x8' is uncompressed. Performance may degrade on low-end devices.", msgZh: "纹理格式 'ASTC_8x8' 未被压缩。低端设备上的运行性能可能会下降。" },
  { id: "sb-6", type: "info", category: "Shader", timestamp: "10:00:22", createdTime: Date.now() - 300000, msg: "Compiling 256 shader variants (Vulkan / OpenGL ES 3.1)...", msgZh: "正在编译 256 个着色器变体 (Vulkan / OpenGL ES 3.1)..." },
  { id: "sb-7", type: "info", category: "Compiler", timestamp: "10:00:30", createdTime: Date.now() - 290000, msg: "Compiling C# assemblies into C++ via IL2CPP backend...", msgZh: "正在通过 IL2CPP 后端将 C# 程序集编译为 C++..." },
  { id: "sb-8", type: "info", category: "Compiler", timestamp: "10:00:35", createdTime: Date.now() - 280000, msg: "Generating modern C++ code from assemblies. Estimated compilation duration: 120 seconds.", msgZh: "正在从程序集生成现代化 C++ 代码。预计编译链接耗时: 120 秒。" },
  { id: "sb-9", type: "warning", category: "Compiler", timestamp: "10:00:41", createdTime: Date.now() - 270000, msg: "Redundant shader keywords detected: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT.", msgZh: "检测到冗余着色器关键字: _LIGHT_COOKIES, _DIRECTIONAL_LIGHT。" },
  { id: "sb-10", type: "info", category: "Linker", timestamp: "10:00:46", createdTime: Date.now() - 260000, msg: "SteamAPI references dynamically resolved. Library loaded successfully from plugins.", msgZh: "SteamAPI 引用已被动态解析。库文件已成功从插件中加载。" },
  { id: "sb-11", type: "info", category: "Signing", timestamp: "10:00:50", createdTime: Date.now() - 250000, msg: "Package signed successfully using /certs/release.keystore profile.", msgZh: "打包签名已成功，已使用 /certs/release.keystore 的配置文件。" },
  { id: "sb-12", type: "info", category: "System", timestamp: "10:00:55", createdTime: Date.now() - 240000, msg: "Build completed successfully. File size: 142.5 MB.", msgZh: "构建圆满成功。打包生成文件大小: 142.5 MB。" }
];

export default function LogView({ isZh, projectType }: LogViewProps) {
  const { mode } = useTheme();
  const platform = projectType.toUpperCase();
  const { addToast } = useToast();

  const [logs, setLogs] = useState<LogEntry[]>(() => INITIAL_LOGS(projectType));
  const [ciSource, setCiSource] = useState<"local" | "github" | "jenkins" | "gitlab">("local");
  const [search, setSearch] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [levelFilter, setLevelFilter] = useState<"all" | "error" | "critical" | "warning" | "info">("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  
  // Real-time stream state
  const [isStreaming, setIsStreaming] = useState(true);
  // Auto-scroll state
  const [autoScroll, setAutoScroll] = useState(true);

  // --- NEW FEATURES STATES ---
  // Playback Mode State
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);
  const [playbackSession, setPlaybackSession] = useState<"A" | "B">("A");
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaybackPlaying, setIsPlaybackPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // in ms per frame

  // Custom Alert Rules State
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "rule-oom",
      name: "Out of Memory (OOM)",
      pattern: "(OOM|Memory limit exceeded|out of memory)",
      highlightClass: "border-rose-500 bg-rose-950/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
      textColor: "text-rose-300",
      action: "toast",
      isActive: true
    },
    {
      id: "rule-signing",
      name: "App Signing / Certs",
      pattern: "(keystore|signing|signature|profile)",
      highlightClass: "border-amber-500 bg-amber-950/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      textColor: "text-amber-200",
      action: "highlight",
      isActive: true
    },
    {
      id: "rule-assets",
      name: "Asset Compression",
      pattern: "(texture|compression|Optimizing)",
      highlightClass: "border-sky-500 bg-sky-950/20 shadow-[0_0_12px_rgba(14,165,233,0.15)]",
      textColor: "text-sky-200",
      action: "highlight",
      isActive: false
    }
  ]);
  const [showRulesPanel, setShowRulesPanel] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRulePattern, setNewRulePattern] = useState("");
  const [newRuleColor, setNewRuleColor] = useState("rose");
  const [newRuleAction, setNewRuleAction] = useState<"toast" | "highlight" | "none">("highlight");

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "CRITICAL FAILURE",
    "\\b(error|critical)\\b",
    "texture \\d+",
    "lib.*\\.so",
    "AndroidManifest",
    "Vulkan"
  ]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Compare Logs State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareSessionLeft, setCompareSessionLeft] = useState<"A" | "B">("A");
  const [compareSessionRight, setCompareSessionRight] = useState<"A" | "B">("B");

  // Pulsing pinned states
  const [pulsingPins, setPulsingPins] = useState<Record<string, boolean>>({});
  // ----------------------------
  
  // Settings: use relative time vs absolute ISO
  const [useRelativeTime, setUseRelativeTime] = useState(true);

  // Settings: active tabs in expandable rows (id -> "json" | "stack")
  const [rowTabs, setRowTabs] = useState<Record<string, "json" | "stack">>({});

  // Export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Show/Hide statistics panel
  const [showStats, setShowStats] = useState(true);

  const activeLogsSource = useMemo(() => {
    if (isPlaybackMode) {
      const playbackLogs = playbackSession === "A" ? SESSION_A_LOGS : SESSION_B_LOGS;
      return playbackLogs.slice(0, playbackIndex + 1);
    }
    return logs;
  }, [isPlaybackMode, playbackSession, playbackIndex, logs]);

  // Regular expression validity check
  const isRegexValid = useMemo(() => {
    if (!isRegex || !search) return true;
    try {
      new RegExp(search, "i");
      return true;
    } catch (e) {
      return false;
    }
  }, [search, isRegex]);

  // Close export dropdown and search history on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setShowExportDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Sync log templates if project type shifts
  useEffect(() => {
    setLogs(INITIAL_LOGS(projectType));
  }, [projectType]);

  // Handle stream simulation and Toast notifications
  useEffect(() => {
    if (!isStreaming || isPlaybackMode) return;

    const interval = setInterval(() => {
      let activeTemplates = STREAM_TEMPLATES;
      if (ciSource === "github") activeTemplates = GITHUB_TEMPLATES;
      if (ciSource === "jenkins") activeTemplates = JENKINS_TEMPLATES;
      if (ciSource === "gitlab") activeTemplates = STREAM_TEMPLATES; // fallback

      const template = activeTemplates[Math.floor(Math.random() * activeTemplates.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      
      const newLog: LogEntry = {
        ...template,
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        createdTime: Date.now()
      };

      setLogs(prev => [...prev, newLog]);

      // Trigger Toast notification if it's an error or critical level
      if (newLog.type === "error" || newLog.type === "critical") {
        const severityLabel = newLog.type === "critical" 
          ? (isZh ? "关键故障" : "CRITICAL") 
          : (isZh ? "构建错误" : "ERROR");
        const msgText = isZh ? newLog.msgZh : newLog.msg;
        addToast(
          `[${severityLabel}] [${newLog.category}] ${msgText}`, 
          "error"
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming, isPlaybackMode, isZh, addToast]);

  // Handle Auto-scroll whenever active logs source is modified
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [activeLogsSource, autoScroll]);

  // Playback Mode auto-advance interval loop
  useEffect(() => {
    if (!isPlaybackMode || !isPlaybackPlaying) return;

    const currentSessionLogs = playbackSession === "A" ? SESSION_A_LOGS : SESSION_B_LOGS;

    const interval = setInterval(() => {
      setPlaybackIndex(prev => {
        if (prev >= currentSessionLogs.length - 1) {
          setIsPlaybackPlaying(false);
          addToast(
            isZh ? "回放结束！构建过程已完成。" : "Playback finished! Build process completed.",
            "success"
          );
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaybackMode, isPlaybackPlaying, playbackSession, playbackSpeed, isZh, addToast]);

  // Monitor additions for Alert Rules toasts and Pin Pulse animations
  useEffect(() => {
    if (activeLogsSource.length === 0) return;
    const latestLog = activeLogsSource[activeLogsSource.length - 1];

    // Only alert on logs that are "brand new" (e.g. within last 2 seconds) to avoid spamming on start/reset
    const isBrandNew = Date.now() - latestLog.createdTime < 2500 || isPlaybackMode;
    if (!isBrandNew) return;

    // 1. Check Custom Alert Rules for Toasts
    alertRules.forEach(rule => {
      if (rule.isActive && rule.action === "toast") {
        try {
          const regex = new RegExp(rule.pattern, "i");
          if (regex.test(latestLog.msg) || regex.test(latestLog.msgZh)) {
            addToast(
              isZh 
                ? `🚨 [规则匹配: ${rule.name}] ${latestLog.msgZh}`
                : `🚨 [Alert Rule: ${rule.name}] ${latestLog.msg}`,
              "warning"
            );
          }
        } catch (e) {}
      }
    });

    // 2. Pulse matching pinned items
    const matchesToPulse: string[] = [];
    pinnedIds.forEach(id => {
      const pinnedLog = activeLogsSource.find(l => l.id === id);
      if (pinnedLog && pinnedLog.id !== latestLog.id) {
        const categoryMatch = pinnedLog.category === latestLog.category;
        const typeMatch = pinnedLog.type === latestLog.type;
        const isErrorMatch = (pinnedLog.type === "error" || pinnedLog.type === "critical") && 
                             (latestLog.type === "error" || latestLog.type === "critical");
        if (categoryMatch || typeMatch || isErrorMatch) {
          matchesToPulse.push(id);
        }
      }
    });

    if (matchesToPulse.length > 0) {
      setPulsingPins(prev => {
        const next = { ...prev };
        matchesToPulse.forEach(id => {
          next[id] = true;
        });
        return next;
      });

      const timeout = setTimeout(() => {
        setPulsingPins(prev => {
          const next = { ...prev };
          matchesToPulse.forEach(id => {
            next[id] = false;
          });
          return next;
        });
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [activeLogsSource.length, isPlaybackMode, alertRules, pinnedIds, isZh, addToast]);

  const filteredLogs = useMemo(() => {
    return activeLogsSource.filter(log => {
      const matchesLevel = levelFilter === "all" || log.type === levelFilter;
      const content = (log.msg + " " + log.msgZh + " " + log.category + " " + log.type + " " + log.timestamp);
      
      let matchesSearch = false;
      if (!search) {
        matchesSearch = true;
      } else if (isRegex) {
        try {
          const regex = new RegExp(search, "i");
          matchesSearch = regex.test(content);
        } catch (e) {
          // Fallback to substring matching if regex is invalid
          matchesSearch = content.toLowerCase().includes(search.toLowerCase());
        }
      } else {
        matchesSearch = content.toLowerCase().includes(search.toLowerCase());
      }
      return matchesLevel && matchesSearch;
    });
  }, [activeLogsSource, search, levelFilter, isRegex]);

  const sortedFilteredLogs = useMemo(() => {
    const pinned = filteredLogs.filter(log => pinnedIds.has(log.id));
    const unpinned = filteredLogs.filter(log => !pinnedIds.has(log.id));
    return [...pinned, ...unpinned];
  }, [filteredLogs, pinnedIds]);

  const stats = useMemo(() => {
    let criticalCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;

    activeLogsSource.forEach(log => {
      if (log.type === "critical") criticalCount++;
      else if (log.type === "error") errorCount++;
      else if (log.type === "warning") warningCount++;
      else if (log.type === "info") infoCount++;
    });

    return {
      total: activeLogsSource.length,
      critical: criticalCount,
      error: errorCount,
      warning: warningCount,
      info: infoCount
    };
  }, [activeLogsSource]);

  const chartData = useMemo(() => {
    return [
      { name: isZh ? "信息" : "Info", count: stats.info, fill: "#38bdf8" },
      { name: isZh ? "警告" : "Warning", count: stats.warning, fill: "#fbbf24" },
      { name: isZh ? "错误" : "Error", count: stats.error, fill: "#f87171" },
      { name: isZh ? "严重" : "Critical", count: stats.critical, fill: "#f43f5e" }
    ];
  }, [stats, isZh]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const togglePin = (id: string) => {
    const next = new Set(pinnedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPinnedIds(next);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resetLogs = () => {
    setLogs(INITIAL_LOGS(projectType));
  };

  const exportFilteredLogs = (format: "json" | "txt") => {
    let content = "";
    let filename = `build-logs-${projectType}-${Date.now()}`;
    
    if (format === "json") {
      content = JSON.stringify(filteredLogs, null, 2);
      filename += ".json";
    } else {
      content = filteredLogs
        .map(log => {
          const time = useRelativeTime 
            ? formatLogTime(log.createdTime, true, isZh) 
            : new Date(log.createdTime).toISOString();
          const messageStr = isZh ? log.msgZh : log.msg;
          return `[${time}] [${log.type.toUpperCase()}] [${log.category}] ${messageStr}`;
        })
        .join("\n");
      filename += ".txt";
    }
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

  const getLogDetails = (log: LogEntry) => {
    const fakeStackTrace = [
      `at PipelineExecutor.executeStep(Pipeline.cs:182)`,
      `at BuildRunner.startBuild(${log.category}Process.cs:44)`,
      `at BuildService.runPipelineAsync(BuildService.cs:1055)`,
      `at System.Threading.Tasks.Task.Execute()`,
      `at System.Runtime.CompilerServices.TaskAwaiter.GetResult()`
    ];

    const fakeJsonPayload = {
      id: log.id,
      timestamp_iso: new Date(log.createdTime).toISOString(),
      timestamp_raw: log.timestamp,
      severity: log.type.toUpperCase(),
      subsystem: log.category,
      thread_id: "0x7f" + log.createdTime.toString(16).slice(-8),
      engine: projectType === "unity" ? "Unity 2022.3.12f1" : "Unreal Engine 5.3.2",
      parameters: {
        force_clean: true,
        optimization_level: "O3",
        target_platform: projectType === "unity" ? "iOS" : "Windows",
        sign_applet: true,
      },
      message: log.msg,
      message_zh: log.msgZh,
      error_code: log.type === "error" || log.type === "critical" ? "ERR_BUILD_SIGN_FAILED_0x" + log.createdTime.toString(16).slice(-4).toUpperCase() : undefined
    };

    return {
      stackTrace: fakeStackTrace.join("\n"),
      jsonPayload: JSON.stringify(fakeJsonPayload, null, 2)
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-full border rounded-xl overflow-hidden shadow-2xl transition-all ${mode === 'dark' ? 'bg-[#000000] border-white/10' : 'bg-white border-gray-100'}`}
    >
      {/* Header / Toolbar */}
      <div className={`p-4 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors ${mode === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between xl:justify-start gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all ${mode === 'dark' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-accent/5 border-accent/10 text-accent'}`}>
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select 
                  value={ciSource}
                  onChange={(e) => {
                    const source = e.target.value as any;
                    setCiSource(source);
                    addToast(isZh ? `已连接至 ${source.toUpperCase()} API 实时流` : `Connected to ${source.toUpperCase()} API live stream`, "success");
                    clearLogs();
                  }}
                  className={`border text-[10px] font-bold rounded px-1.5 py-0.5 focus:outline-none focus:border-accent transition-all uppercase tracking-tight ${
                    mode === 'dark' ? 'bg-[#050505] border-white/10 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <option value="local">Local Hub</option>
                  <option value="github">GitHub Actions</option>
                  <option value="jenkins">Jenkins Master</option>
                  <option value="gitlab">GitLab Runner</option>
                </select>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  isStreaming ? "bg-emerald-500/10 text-emerald-400 animate-pulse border border-emerald-500/20" : "bg-gray-800 text-gray-500 border border-gray-700/50"
                }`}>
                  {isStreaming ? "LIVE" : "PAUSED"}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 font-mono">
                {ciSource === "local" ? "Internal Engine Logs" : `API: api.${ciSource}.com/v3/logs/stream`}
              </p>
            </div>
          </div>

          {/* Quick Clear, Pause & Reset Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center gap-1 ${
                isStreaming 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
              }`}
              title={isStreaming ? (isZh ? "暂停接收实时日志" : "Pause Live Stream") : (isZh ? "恢复接收实时日志" : "Resume Live Stream")}
            >
              {isStreaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            
            {/* EXPLICIT CLEAR BUTTON */}
            <button
              onClick={clearLogs}
              className="px-3 py-1.5 rounded-lg border border-red-950 bg-red-950/20 text-red-400 hover:text-red-300 hover:bg-red-950/45 cursor-pointer transition-all flex items-center gap-1.5 text-xs font-semibold"
              title={isZh ? "清空当前显示的日志" : "Clear all currently visible logs"}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isZh ? "清空" : "Clear"}</span>
            </button>

            <button
              onClick={resetLogs}
              className="px-2.5 py-1.5 rounded-lg border border-gray-850 bg-gray-900/60 text-[10px] font-mono text-gray-400 hover:text-gray-200 cursor-pointer transition-all"
              title={isZh ? "重置默认日志" : "Reset default logs"}
            >
              RESET
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Playback Mode Toggle */}
          <button
            onClick={() => {
              const nextMode = !isPlaybackMode;
              setIsPlaybackMode(nextMode);
              if (nextMode) {
                setIsStreaming(false); // pause live streaming
                setPlaybackIndex(0);
                setIsPlaybackPlaying(false);
                addToast(
                  isZh ? "已启用构建回放模式。实时流已暂停。" : "Build Playback Mode enabled. Live stream paused.",
                  "info"
                );
              } else {
                setIsStreaming(true);
                addToast(
                  isZh ? "已恢复实时日志流。" : "Live logs stream resumed.",
                  "info"
                );
              }
            }}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isPlaybackMode 
                ? "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-sm shadow-purple-500/5" 
                : "bg-gray-900 border-gray-850 text-gray-400 hover:text-gray-200"
            }`}
            title={isZh ? "切换构建回放模式" : "Toggle Build Playback Mode"}
          >
            <History className={`h-3.5 w-3.5 ${isPlaybackMode ? "text-purple-400" : "text-gray-500"}`} />
            <span className="hidden md:inline">{isZh ? "回放模式" : "Playback"}</span>
            <span className="md:hidden">{isZh ? "回放" : "Play"}</span>
          </button>

          {/* Alert Rules Toggle */}
          <button
            onClick={() => setShowRulesPanel(!showRulesPanel)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              showRulesPanel 
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400" 
                : "bg-gray-900 border-gray-850 text-gray-400 hover:text-gray-200"
            }`}
            title={isZh ? "自定义告警规则" : "Custom Alert Rules"}
          >
            <Bell className={`h-3.5 w-3.5 ${showRulesPanel ? "text-amber-400" : "text-gray-500"}`} />
            <span className="hidden md:inline">{isZh ? "告警规则" : "Alert Rules"}</span>
            <span className="md:hidden">{isZh ? "规则" : "Alerts"}</span>
            {alertRules.filter(r => r.isActive).length > 0 && (
              <span className="bg-amber-500 text-gray-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[15px] text-center">
                {alertRules.filter(r => r.isActive).length}
              </span>
            )}
          </button>

          {/* Compare Sessions Trigger */}
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-850 hover:border-indigo-500/40 text-gray-300 hover:text-gray-100 rounded-lg text-xs font-semibold cursor-pointer transition-all"
            title={isZh ? "对比日志会话" : "Compare Log Sessions"}
          >
            <GitCompare className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden md:inline">{isZh ? "会话对比" : "Compare"}</span>
            <span className="md:hidden">{isZh ? "对比" : "Diff"}</span>
          </button>

          {/* Stats toggle button */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              showStats 
                ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" 
                : "bg-gray-900 border-gray-850 text-gray-500 hover:text-gray-400 hover:bg-gray-900/80"
            }`}
            title={isZh ? "显示/隐藏统计面板" : "Toggle Stats Panel"}
          >
            <Zap className={`h-3.5 w-3.5 ${showStats ? "text-indigo-400" : "text-gray-500"}`} />
            <span className="hidden md:inline">{isZh ? "统计面板" : "Statistics"}</span>
            <span className="md:hidden">{isZh ? "统计" : "Stats"}</span>
          </button>

          {/* Time mode setting toggle */}
          <button
            onClick={() => setUseRelativeTime(!useRelativeTime)}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              useRelativeTime 
                ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" 
                : "bg-gray-900 border-gray-850 text-gray-400 hover:text-gray-200 hover:bg-gray-900/80"
            }`}
            title={isZh ? "切换相对/绝对时间格式" : "Switch between relative and absolute ISO timestamps"}
          >
            <Clock className={`h-3.5 w-3.5 ${useRelativeTime ? "text-indigo-400" : "text-gray-500"}`} />
            <span className="hidden md:inline">{useRelativeTime ? (isZh ? "相对时间" : "Relative Time") : (isZh ? "绝对 ISO" : "Absolute ISO")}</span>
            <span className="md:hidden">{useRelativeTime ? "Rel" : "ISO"}</span>
          </button>

          {/* Auto-scroll toggle switch */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              autoScroll 
                ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" 
                : "bg-gray-900 border-gray-850 text-gray-500 hover:text-gray-400 hover:bg-gray-900/80"
            }`}
          >
            <ArrowDown className={`h-3.5 w-3.5 transition-transform duration-200 ${autoScroll ? "translate-y-0.5 animate-bounce text-indigo-400" : "text-gray-500"}`} />
            <span className="hidden md:inline">{isZh ? "自动滚动" : "Auto-scroll"}</span>
            <div className={`w-6 h-3.5 rounded-full p-0.5 transition-colors duration-200 ml-1.5 flex items-center ${autoScroll ? "bg-indigo-500" : "bg-gray-850"}`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${autoScroll ? "translate-x-2.5" : "translate-x-0"}`} />
            </div>
          </button>

          {/* TESTABILITY & QUALITY LINK */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 hover:border-rose-500/50 text-gray-300 hover:text-rose-400 rounded-lg text-xs font-semibold cursor-pointer transition-all"
            title={isZh ? "工程质量与可测性" : "Quality & Testability"}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{isZh ? "质量度量" : "Testability"}</span>
          </button>

          {/* EXPORT LOGS BUTTON */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 text-gray-300 hover:text-gray-100 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              title={isZh ? "导出日志文件" : "Export logs to a file"}
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>{isZh ? "导出" : "Export"}</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
            <AnimatePresence>
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-1.5 w-44 bg-gray-950 border border-gray-850 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => exportFilteredLogs("json")}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:bg-gray-900 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FileJson className="h-3.5 w-3.5 text-indigo-400" />
                    <span>JSON Format (.json)</span>
                  </button>
                  <button
                    onClick={() => exportFilteredLogs("txt")}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:bg-gray-900 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Plain Text (.txt)</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search bar with Regex Mode */}
          <div className="relative flex items-center gap-1 flex-1 sm:flex-initial" ref={searchContainerRef}>
            <div className="relative group w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text"
                placeholder={isRegex ? (isZh ? "Regex 过滤..." : "Regex Filter...") : (isZh ? "实时过滤日志..." : "Filter logs real-time...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowRecentSearches(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search && !recentSearches.includes(search)) {
                    setRecentSearches(prev => [search, ...prev]);
                    setShowRecentSearches(false);
                    addToast(isZh ? "查询历史已保存" : "Query history saved", "success");
                  } else if (e.key === "Escape") {
                    setShowRecentSearches(false);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className={`pl-8 pr-16 py-1.5 bg-gray-900 border rounded-lg text-xs text-gray-300 focus:outline-none focus:ring-1 transition-all w-full sm:w-44 lg:w-52 ${
                  !isRegexValid 
                    ? "border-red-500/70 focus:ring-red-500/50 text-red-200" 
                    : isRegex 
                    ? "border-indigo-500/50 focus:ring-indigo-500/50" 
                    : "border-gray-800 focus:ring-indigo-500/50"
                }`}
              />
              {/* Inside-input Action group: Regex Mode toggle and History toggle */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowRecentSearches(!showRecentSearches)}
                  className={`p-0.5 rounded text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors cursor-pointer`}
                  title={isZh ? "历史搜索查询" : "View Recent Search History"}
                >
                  <History className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setIsRegex(!isRegex)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer select-none ${
                    isRegex 
                      ? "bg-indigo-600 text-white border border-indigo-500 shadow-sm" 
                      : "bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700 border border-transparent"
                  }`}
                  title={isZh ? "正则表达式模式" : "Toggle Regular Expression Mode"}
                >
                  .*
                </button>
              </div>
            </div>
            {!isRegexValid && (
              <span className="text-[10px] text-red-400 font-sans font-medium" title={isZh ? "无效的正则表达式" : "Invalid Regex"}>
                ⚠️ Err
              </span>
            )}
            
            {/* Recent Searches Dropdown */}
            <AnimatePresence>
              {showRecentSearches && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-1.5 w-full min-w-[280px] sm:w-80 md:w-96 bg-gray-950 border border-gray-850 rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-2 font-sans text-xs"
                >
                  <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 select-none">
                      <History className="h-3 w-3 text-indigo-400" />
                      {isZh ? "最近查询与匹配规则" : "Recent & Regex Queries"}
                    </span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        addToast(isZh ? "搜索历史已清空" : "Search history cleared", "info");
                      }}
                      className="text-[9px] font-mono text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      CLEAR ALL
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                    {recentSearches.length === 0 ? (
                      <span className="text-[10px] text-gray-600 italic block py-1.5 text-center">{isZh ? "暂无搜索历史记录" : "No search history"}</span>
                    ) : (
                      recentSearches.map((term, i) => (
                        <div key={i} className="flex items-center justify-between group rounded hover:bg-gray-900/60 transition-colors px-1 py-0.5">
                          <button
                            onClick={() => {
                              setSearch(term);
                              if (term.includes("\\") || term.includes("|") || term.includes("(")) {
                                setIsRegex(true);
                              } else {
                                setIsRegex(false);
                              }
                              setShowRecentSearches(false);
                            }}
                            className="flex-1 text-left font-mono text-[10px] text-gray-300 hover:text-indigo-400 break-all select-none cursor-pointer"
                          >
                            {term}
                          </button>
                          <button
                            onClick={() => {
                              setRecentSearches(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-850 cursor-pointer transition-all"
                            title="Remove from history"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Regex Helpers section */}
                  <div className="border-t border-gray-900 pt-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block mb-1.5 px-0.5 select-none">
                      {isZh ? "正则表达式速查 / 常用过滤" : "Useful Regex Helpers"}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setSearch("\\b(compiler|shader)\\b");
                          setIsRegex(true);
                          setShowRecentSearches(false);
                        }}
                        className="p-1 border border-gray-850 hover:border-indigo-500/40 hover:bg-indigo-950/10 rounded font-mono text-[9px] text-left text-gray-400 hover:text-indigo-300 cursor-pointer"
                      >
                        Compiler / Shaders
                      </button>
                      <button
                        onClick={() => {
                          setSearch("\\b(OOM|Memory)\\b");
                          setIsRegex(true);
                          setShowRecentSearches(false);
                        }}
                        className="p-1 border border-gray-850 hover:border-indigo-500/40 hover:bg-indigo-950/10 rounded font-mono text-[9px] text-left text-gray-400 hover:text-indigo-300 cursor-pointer"
                      >
                        Memory Issues (OOM)
                      </button>
                    </div>
                  </div>

                  {/* Custom save current query */}
                  {search && !recentSearches.includes(search) && (
                    <button
                      onClick={() => {
                        setRecentSearches(prev => [search, ...prev]);
                        addToast(isZh ? "搜索查询已保存" : "Current search query saved", "success");
                      }}
                      className="w-full mt-1.5 py-1 text-[10px] font-bold text-indigo-400 border border-dashed border-indigo-950 hover:border-indigo-500/50 bg-indigo-950/10 rounded hover:text-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{isZh ? "保存当前搜索" : "Save Current Search"}</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Level filters */}
          <div className="flex bg-gray-900 p-0.5 rounded-lg border border-gray-800 overflow-hidden shrink-0">
            {(["all", "error", "critical", "warning", "info"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  levelFilter === l 
                    ? (l === "critical" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                       l === "error" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
                       l === "warning" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                       l === "info" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                       "bg-gray-800 text-gray-100 border border-gray-700")
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playback Controls Panel */}
      {isPlaybackMode && (
        <div className="bg-purple-950/10 border-b border-purple-900/30 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">{isZh ? "当前模式: 构建日志回放" : "Active: Build Playback Mode"}</span>
            <span className="h-3 w-px bg-purple-900/40" />
            <div className="flex items-center bg-purple-950/40 border border-purple-900/30 rounded px-1.5 py-0.5">
              <span className="text-gray-400 mr-1">{isZh ? "回放源:" : "Source:"}</span>
              <select
                value={playbackSession}
                onChange={(e) => {
                  setPlaybackSession(e.target.value as "A" | "B");
                  setPlaybackIndex(0);
                  setIsPlaybackPlaying(false);
                }}
                className="bg-transparent border-none text-purple-300 font-bold focus:outline-none cursor-pointer text-[10px]"
              >
                <option value="A" className="bg-gray-950 text-gray-200">{isZh ? "会话 A (构建失败流程)" : "Session A (Failed Build)"}</option>
                <option value="B" className="bg-gray-950 text-gray-200">{isZh ? "会话 B (构建成功流程)" : "Session B (Success Build)"}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback Action Buttons */}
            <div className="flex items-center bg-gray-950 border border-purple-900/40 rounded-lg p-0.5">
              <button
                onClick={() => setPlaybackIndex(0)}
                disabled={playbackIndex === 0}
                className="p-1 rounded text-purple-400 hover:bg-purple-950/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title={isZh ? "重置到开头" : "Skip to Start"}
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={() => setPlaybackIndex(prev => Math.max(0, prev - 1))}
                disabled={playbackIndex === 0}
                className="p-1 rounded text-purple-400 hover:bg-purple-950/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title={isZh ? "上一个日志帧" : "Previous Log Frame"}
              >
                <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              </button>

              <button
                onClick={() => setIsPlaybackPlaying(!isPlaybackPlaying)}
                className={`p-1.5 px-2.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
                  isPlaybackPlaying 
                    ? "bg-purple-600 text-white hover:bg-purple-500 shadow shadow-purple-600/30" 
                    : "bg-purple-950/40 text-purple-400 hover:bg-purple-950/70"
                }`}
              >
                {isPlaybackPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                <span>{isPlaybackPlaying ? (isZh ? "暂停" : "PAUSE") : (isZh ? "播放" : "PLAY")}</span>
              </button>

              <button
                onClick={() => {
                  const maxLogs = playbackSession === "A" ? SESSION_A_LOGS.length : SESSION_B_LOGS.length;
                  setPlaybackIndex(prev => Math.min(maxLogs - 1, prev + 1));
                }}
                disabled={playbackIndex >= (playbackSession === "A" ? SESSION_A_LOGS.length : SESSION_B_LOGS.length) - 1}
                className="p-1 rounded text-purple-400 hover:bg-purple-950/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title={isZh ? "下一个日志帧" : "Next Log Frame"}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => {
                  const maxLogs = playbackSession === "A" ? SESSION_A_LOGS.length : SESSION_B_LOGS.length;
                  setPlaybackIndex(maxLogs - 1);
                }}
                disabled={playbackIndex >= (playbackSession === "A" ? SESSION_A_LOGS.length : SESSION_B_LOGS.length) - 1}
                className="p-1 rounded text-purple-400 hover:bg-purple-950/40 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title={isZh ? "跳到结尾" : "Skip to End"}
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Speed Adjust */}
            <div className="flex items-center gap-1.5 text-[10px] bg-purple-950/20 border border-purple-900/20 rounded-lg px-2 py-1">
              <span className="text-purple-400 font-bold">SPEED:</span>
              <div className="flex items-center gap-1">
                {([1500, 800, 300] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                      playbackSpeed === spd 
                        ? "bg-purple-600 text-white" 
                        : "text-purple-400/80 hover:text-purple-300"
                    }`}
                  >
                    {spd === 1500 ? "1x" : spd === 800 ? "2x" : "4x"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="flex items-center gap-2.5 flex-1 md:max-w-xs w-full">
            <span className="font-mono text-[10px] text-purple-400 min-w-[28px] text-right">{playbackIndex + 1} / {(playbackSession === "A" ? SESSION_A_LOGS : SESSION_B_LOGS).length}</span>
            <input
              type="range"
              min="0"
              max={(playbackSession === "A" ? SESSION_A_LOGS : SESSION_B_LOGS).length - 1}
              value={playbackIndex}
              onChange={(e) => setPlaybackIndex(parseInt(e.target.value))}
              className="flex-1 accent-purple-500 h-1 rounded-lg bg-purple-950 border border-purple-900/30 cursor-pointer"
            />
            <button
              onClick={() => {
                setIsPlaybackMode(false);
                setIsStreaming(true);
              }}
              className="text-purple-400 hover:text-purple-200 hover:bg-purple-950/35 p-1 rounded"
              title={isZh ? "返回实时日志流" : "Return to Live Stream"}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Alert Rules Manager Panel */}
      <AnimatePresence>
        {showRulesPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-900 bg-gray-900/40"
          >
            <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
              {/* Left Side: Rule List */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                  <span className="font-bold text-gray-300 uppercase tracking-wider text-[10px] flex items-center gap-1 select-none">
                    <Sliders className="h-3 w-3 text-amber-400" />
                    {isZh ? "当前告警触发规则" : "Current Trigger Rules"}
                  </span>
                  <span className="text-[10px] text-gray-500">{alertRules.length} {isZh ? "条已定义规则" : "defined rules"}</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {alertRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 bg-gray-950 transition-all ${
                        rule.isActive ? "border-gray-800" : "border-gray-900/40 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={rule.isActive}
                          onChange={() => {
                            setAlertRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
                            addToast(
                              isZh 
                                ? `规则 [${rule.name}] 已${!rule.isActive ? "启用" : "停用"}` 
                                : `Rule [${rule.name}] ${!rule.isActive ? "enabled" : "disabled"}`,
                              "info"
                            );
                          }}
                          className="rounded accent-indigo-500 h-3.5 w-3.5 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-100">{rule.name}</span>
                            <span className="px-1 rounded text-[9px] font-mono bg-gray-900 text-gray-400 border border-gray-850">
                              /{rule.pattern}/i
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500 select-none">
                            <span>Action:</span>
                            <span className={`font-semibold uppercase text-[9px] ${
                              rule.action === "toast" ? "text-amber-400" : rule.action === "highlight" ? "text-indigo-400" : "text-gray-500"
                            }`}>
                              {rule.action}
                            </span>
                            <span className="h-1 w-1 bg-gray-750 rounded-full" />
                            <span className="flex items-center gap-1">
                              Style: <span className="h-2 w-2 rounded" style={{ backgroundColor: rule.highlightClass.includes("rose") ? "#f43f5e" : rule.highlightClass.includes("amber") ? "#d97706" : rule.highlightClass.includes("sky") ? "#0284c7" : "#8b5cf6" }} />
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setAlertRules(prev => prev.filter(r => r.id !== rule.id));
                          addToast(
                            isZh ? `规则 [${rule.name}] 已删除` : `Rule [${rule.name}] deleted`,
                            "warning"
                          );
                        }}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                        title={isZh ? "删除规则" : "Delete rule"}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Add Custom Rule */}
              <div className="lg:col-span-5 bg-gray-950/60 border border-gray-850 rounded-xl p-3 space-y-2.5">
                <div className="border-b border-gray-850 pb-1.5 flex items-center justify-between">
                  <span className="font-bold text-gray-300 text-[10px] flex items-center gap-1 uppercase select-none">
                    <Plus className="h-3.5 w-3.5 text-indigo-400" />
                    {isZh ? "添加自定义告警规则" : "Add Custom Alert Rule"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 block select-none">{isZh ? "规则名称" : "Rule Name"}</label>
                    <input
                      type="text"
                      placeholder="e.g. Vulkan Shader Compiler"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 block select-none">
                      {isZh ? "匹配表达式 (Regex Pattern)" : "Regex Pattern"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. (Shader|Compiler|variant)"
                      value={newRulePattern}
                      onChange={(e) => setNewRulePattern(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-indigo-500/50 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 block select-none">{isZh ? "高亮颜色" : "Highlight Color"}</label>
                      <select
                        value={newRuleColor}
                        onChange={(e) => setNewRuleColor(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="rose">🔴 Red / Rose</option>
                        <option value="amber">🟡 Amber / Yellow</option>
                        <option value="sky">🔵 Sky Blue</option>
                        <option value="purple">🟣 Purple</option>
                        <option value="emerald">🟢 Emerald Green</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 block select-none">{isZh ? "触发动作" : "Trigger Action"}</label>
                      <select
                        value={newRuleAction}
                        onChange={(e) => setNewRuleAction(e.target.value as "toast" | "highlight" | "none")}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="highlight">{isZh ? "高亮行" : "Highlight Row"}</option>
                        <option value="toast">{isZh ? "发出系统 Toast 弹窗" : "System Toast Alert"}</option>
                        <option value="none">{isZh ? "无 (仅高亮)" : "None"}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newRuleName || !newRulePattern) {
                        addToast(isZh ? "请填写完整的名称与表达式！" : "Please fill out both Name and Pattern!", "error");
                        return;
                      }
                      try {
                        new RegExp(newRulePattern);
                      } catch (err) {
                        addToast(isZh ? "无效的正则表达式！" : "Invalid Regex syntax!", "error");
                        return;
                      }

                      const colors: Record<string, { bg: string, text: string }> = {
                        rose: { bg: "border-rose-500 bg-rose-950/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]", text: "text-rose-300" },
                        amber: { bg: "border-amber-500 bg-amber-950/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]", text: "text-amber-200" },
                        sky: { bg: "border-sky-500 bg-sky-950/20 shadow-[0_0_12px_rgba(14,165,233,0.15)]", text: "text-sky-200" },
                        purple: { bg: "border-purple-500 bg-purple-950/25 shadow-[0_0_12px_rgba(168,85,247,0.15)]", text: "text-purple-300" },
                        emerald: { bg: "border-emerald-500 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]", text: "text-emerald-200" }
                      };

                      const highlight = colors[newRuleColor] || colors.rose;

                      const rule: AlertRule = {
                        id: `rule-${Date.now()}`,
                        name: newRuleName,
                        pattern: newRulePattern,
                        highlightClass: highlight.bg,
                        textColor: highlight.text,
                        action: newRuleAction,
                        isActive: true
                      };

                      setAlertRules(prev => [...prev, rule]);
                      setNewRuleName("");
                      setNewRulePattern("");
                      addToast(
                        isZh ? `新规则 [${rule.name}] 已成功添加` : `New Alert Rule [${rule.name}] added successfully`,
                        "success"
                      );
                    }}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors shadow shadow-indigo-600/30 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isZh ? "创建规则" : "Create Rule"}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Logs side-by-side dialog overlay */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-50 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gray-950 border border-gray-850 rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Compare Modal Header */}
              <div className="p-4 border-b border-gray-850 bg-gray-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                    <GitCompare className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wide">
                      {isZh ? "双构建日志会话对照分析 (Diff Analysis)" : "Side-by-Side Build Sessions Comparison"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                      {isZh ? "对比运行历史中的差异与链接/签名等构建失败原因" : "Compare discrepancies, signature issues, and linker failures between separate build runs."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white border border-gray-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Compare Sub-Header */}
              <div className="grid grid-cols-2 bg-gray-950 border-b border-gray-900 text-xs text-gray-400 font-sans font-bold uppercase select-none">
                <div className="p-3 border-r border-gray-900 flex items-center justify-between bg-red-950/5">
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {isZh ? "会话 A - 失败构建流 (Failed)" : "Session A - Failed Build"}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">{SESSION_A_LOGS.length} entries</span>
                </div>
                <div className="p-3 flex items-center justify-between bg-emerald-950/5">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {isZh ? "会话 B - 成功构建流 (Fixed)" : "Session B - Successful Build"}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">{SESSION_B_LOGS.length} entries</span>
                </div>
              </div>

              {/* Compare Content Grid */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-[10.5px]">
                {Array.from({ length: Math.max(SESSION_A_LOGS.length, SESSION_B_LOGS.length) }).map((_, idx) => {
                  const logA = SESSION_A_LOGS[idx];
                  const logB = SESSION_B_LOGS[idx];
                  
                  // Decide if there is a discrepancy
                  const isDiff = !logA || !logB || logA.msg !== logB.msg;

                  return (
                    <div key={idx} className="grid grid-cols-2 gap-4">
                      {/* Left: Session A Column */}
                      {logA ? (
                        <div className={`p-2 rounded-lg border transition-all ${
                          isDiff 
                            ? "bg-red-950/15 border-red-900/35 text-red-300" 
                            : "bg-gray-900/20 border-gray-900/50 text-gray-500"
                        }`}>
                          <div className="flex items-center gap-2 mb-1 text-[9px] text-gray-500 justify-between">
                            <span className="font-semibold">[{logA.category}]</span>
                            <span>{logA.timestamp}</span>
                          </div>
                          <p className={`break-all ${isDiff ? "font-semibold text-red-400" : "text-gray-400"}`}>
                            {isDiff ? "- " : ""}{isZh ? logA.msgZh : logA.msg}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg border border-dashed border-gray-900/40 bg-gray-950/20 text-gray-700 italic flex items-center justify-center">
                          Empty Frame
                        </div>
                      )}

                      {/* Right: Session B Column */}
                      {logB ? (
                        <div className={`p-2 rounded-lg border transition-all ${
                          isDiff 
                            ? "bg-emerald-950/15 border-emerald-900/35 text-emerald-300" 
                            : "bg-gray-900/20 border-gray-900/50 text-gray-500"
                        }`}>
                          <div className="flex items-center gap-2 mb-1 text-[9px] text-gray-500 justify-between">
                            <span className="font-semibold">[{logB.category}]</span>
                            <span>{logB.timestamp}</span>
                          </div>
                          <p className={`break-all ${isDiff ? "font-semibold text-emerald-400" : "text-gray-400"}`}>
                            {isDiff ? "+ " : ""}{isZh ? logB.msgZh : logB.msg}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg border border-dashed border-gray-900/40 bg-gray-950/20 text-gray-700 italic flex items-center justify-center">
                          Empty Frame
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Compare Footer */}
              <div className="p-3 border-t border-gray-850 bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-sans gap-2">
                <span className="flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-indigo-400" />
                  {isZh 
                    ? "通过对比可发现 Session B 在链接阶段应用了 Steamworks.NET 原生插件库动态加载，成功绕过 Linker 缺陷。"
                    : "Analysis: Session B resolved the undefined SteamAPI references by using Steamworks.NET plugins, avoiding Linker crash."}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = SESSION_A_LOGS.map((log, i) => {
                        const other = SESSION_B_LOGS[i];
                        return `A: ${log.msg}\nB: ${other ? other.msg : "N/A"}`;
                      }).join("\n---\n");
                      navigator.clipboard.writeText(text);
                      addToast(isZh ? "差异对照已拷贝" : "Diff output copied to clipboard", "success");
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors cursor-pointer"
                  >
                    {isZh ? "复制对比数据" : "Copy Diff Data"}
                  </button>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="px-3 py-1 bg-gray-900 hover:bg-gray-850 text-gray-400 border border-gray-800 rounded hover:text-white transition-colors cursor-pointer"
                  >
                    {isZh ? "关闭" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Statistics summary card */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-900 bg-gray-900/10"
          >
            <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Metrics Cards */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* Total Logs */}
                <div className="p-3 rounded-xl bg-gray-900/40 border border-gray-850 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-500 text-[10px] font-bold tracking-wider uppercase">
                    <span>{isZh ? "总日志" : "Total Logs"}</span>
                    <Terminal className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-gray-100 font-mono">{stats.total}</span>
                    <span className="text-[9px] text-gray-500">{isZh ? "条" : "entries"}</span>
                  </div>
                </div>

                {/* Critical Failures */}
                <div className="p-3 rounded-xl bg-rose-950/10 border border-rose-950/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-rose-400/80 text-[10px] font-bold tracking-wider uppercase">
                    <span>{isZh ? "严重" : "Critical"}</span>
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-rose-400 font-mono">{stats.critical}</span>
                    {stats.critical > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Errors */}
                <div className="p-3 rounded-xl bg-red-950/10 border border-red-950/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-red-400/80 text-[10px] font-bold tracking-wider uppercase">
                    <span>{isZh ? "错误" : "Errors"}</span>
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-red-400 font-mono">{stats.error}</span>
                  </div>
                </div>

                {/* Warnings */}
                <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-950/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-amber-400/80 text-[10px] font-bold tracking-wider uppercase">
                    <span>{isZh ? "警告" : "Warnings"}</span>
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-amber-400 font-mono">{stats.warning}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 rounded-xl bg-sky-950/10 border border-sky-950/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-sky-400/80 text-[10px] font-bold tracking-wider uppercase">
                    <span>{isZh ? "信息" : "Info"}</span>
                    <Info className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-sky-400 font-mono">{stats.info}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Recharts Visualization */}
              <div className="lg:col-span-5 h-24 sm:h-28 bg-gray-900/20 border border-gray-850 rounded-xl p-2 flex flex-col">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1 flex items-center justify-between">
                  <span>{isZh ? "日志严重级别分布" : "Severity Distribution"}</span>
                  <span className="text-[8px] font-mono lowercase text-gray-650">{isZh ? "实时更新" : "live updates"}</span>
                </span>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#4b5563" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#4b5563" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#030712", 
                          borderColor: "#1f2937", 
                          borderRadius: "8px",
                          fontSize: "10px"
                        }}
                        itemStyle={{ color: "#f3f4f6" }}
                        labelStyle={{ color: "#9ca3af", fontWeight: "bold" }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={30}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Body */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {sortedFilteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 py-16">
              <span className="text-xl">📭</span>
              <span className="font-sans text-xs">{isZh ? "没有匹配当前过滤器的日志条目" : "No matching log entries found"}</span>
            </div>
          ) : (
            sortedFilteredLogs.map((log) => {
              const isExpanded = expandedIds.has(log.id);
              const isPinned = pinnedIds.has(log.id);
              const isError = log.type === "error";
              const isCritical = log.type === "critical";
              const isWarning = log.type === "warning";
              const activeRowTab = rowTabs[log.id] || "json";

              const details = getLogDetails(log);

              const matchedRule = alertRules.find(r => {
                if (!r.isActive) return false;
                try {
                  const regex = new RegExp(r.pattern, "i");
                  return regex.test(log.msg) || regex.test(log.msgZh);
                } catch(e) {
                  return false;
                }
              });

              let rowBorderBgClass = "";
              if (isPinned) {
                rowBorderBgClass = pulsingPins[log.id]
                  ? "bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.7)] scale-[1.01]"
                  : "bg-indigo-950/20 border-indigo-500/50 shadow-sm shadow-indigo-500/10";
              } else if (matchedRule) {
                rowBorderBgClass = `${matchedRule.highlightClass} border-l-4`;
              } else if (isCritical) {
                rowBorderBgClass = "bg-rose-950/10 border-rose-900/30 hover:bg-rose-950/15 hover:border-rose-900/50";
              } else if (isError) {
                rowBorderBgClass = "bg-red-950/10 border-red-900/20 hover:bg-red-950/15 hover:border-red-900/40";
              } else if (isWarning) {
                rowBorderBgClass = "bg-amber-950/10 border-amber-900/20 hover:bg-amber-950/15 hover:border-amber-900/40";
              } else {
                rowBorderBgClass = "bg-gray-900/10 border-gray-900/40 hover:bg-gray-900/20 hover:border-indigo-950/40";
              }

              return (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`group rounded-lg border transition-all duration-200 ${rowBorderBgClass}`}
                >
                  {/* Clickable Header Row */}
                  <div 
                    onClick={() => toggleExpand(log.id)}
                    className="flex items-start gap-3 p-2.5 cursor-pointer select-none"
                  >
                    <div className="mt-0.5 flex-shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors">
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </div>
                    
                    {/* Timestamp formatted depending on user settings toggle */}
                    <span className="text-gray-500 whitespace-nowrap shrink-0 text-[10px] font-medium font-mono min-w-[70px] flex items-center gap-1">
                      {isPinned && <Pin className={`h-3 w-3 text-indigo-400 fill-indigo-400 shrink-0 ${pulsingPins[log.id] ? "animate-bounce" : ""}`} />}
                      {formatLogTime(log.createdTime, useRelativeTime, isZh)}
                    </span>
                    
                    {/* Log type badge with specific color branding */}
                    <div className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" :
                      isError ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      isWarning ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {log.type}
                    </div>

                    <span className="text-gray-500 font-bold shrink-0 text-[10px]">[{log.category}]</span>

                    {matchedRule && (
                      <div className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 animate-pulse flex items-center gap-1 ${matchedRule.textColor}`}>
                        <Bell className="h-2 w-2 text-amber-400" />
                        <span>{matchedRule.name}</span>
                      </div>
                    )}
                    
                    {/* Color-Coded Log Text */}
                    <p className={`flex-1 break-all ${
                      isCritical ? "text-rose-400 font-extrabold" :
                      isError ? "text-red-400 font-medium font-semibold" : 
                      isWarning ? "text-amber-400 font-medium" : 
                      "text-sky-300"
                    }`}>
                      {isZh ? log.msgZh : log.msg}
                    </p>

                    <div className="hidden sm:flex opacity-0 group-hover:opacity-100 items-center gap-1.5 shrink-0 transition-all ml-2">
                      {/* Highlight & Pin action button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePin(log.id); }}
                        className={`p-1 rounded cursor-pointer border transition-all ${
                          isPinned 
                            ? "bg-indigo-600 text-white border-indigo-500 shadow" 
                            : "bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white"
                        }`}
                        title={isPinned ? (isZh ? "取消固定/高亮" : "Unpin Highlight") : (isZh ? "高亮并固定到顶部" : "Highlight & Pin to Top")}
                      >
                        <Pin className={`h-3 w-3 ${isPinned ? "fill-current" : ""}`} />
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(log.msg, log.id); }}
                        className="p-1 rounded bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Log message"
                      >
                        {copiedId === log.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                      {(isError || isCritical) && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            let plat = "general";
                            if (projectType === "unity") {
                              plat = "android";
                            } else if (projectType === "unreal") {
                              plat = "standalone";
                            }
                            window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "troubleshooter" }));
                            window.dispatchEvent(new CustomEvent("diagnose-log", { detail: { log: log.msg, platform: plat } }));
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/90 hover:bg-indigo-600 text-white shadow shadow-indigo-600/30 transition-all cursor-pointer"
                        >
                          <Zap className="h-2.5 w-2.5 text-yellow-300" />
                          <span className="text-[9px] font-bold">AI FIX</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable detailed payload drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-4 pt-1.5 border-t border-gray-900/60 space-y-3">
                          {/* Inner Tabs Selector (Structured JSON Payload vs Stack Trace) */}
                          <div className="flex items-center gap-2 border-b border-gray-900 pb-1.5">
                            <button
                              onClick={() => setRowTabs(prev => ({ ...prev, [log.id]: "json" }))}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono tracking-wide font-bold transition-all cursor-pointer ${
                                activeRowTab === "json"
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : "text-gray-500 hover:text-gray-300 border border-transparent"
                              }`}
                            >
                              <FileJson className="h-3 w-3" />
                              <span>JSON PAYLOAD</span>
                            </button>
                            <button
                              onClick={() => setRowTabs(prev => ({ ...prev, [log.id]: "stack" }))}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono tracking-wide font-bold transition-all cursor-pointer ${
                                activeRowTab === "stack"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "text-gray-500 hover:text-gray-300 border border-transparent"
                              }`}
                            >
                              <Code className="h-3 w-3" />
                              <span>STACK TRACE</span>
                            </button>
                            <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-600">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Absolute ISO: {new Date(log.createdTime).toISOString()}</span>
                            </div>
                          </div>

                          {/* Dynamic Drawer content */}
                          <div className="relative">
                            <button
                              onClick={() => copyToClipboard(activeRowTab === "json" ? details.jsonPayload : details.stackTrace, log.id)}
                              className="absolute top-2 right-2 p-1 rounded bg-gray-950 border border-gray-800 text-gray-500 hover:text-gray-300 transition-colors z-10 cursor-pointer"
                              title={isZh ? "复制此段内容" : "Copy block to clipboard"}
                            >
                              {copiedId === log.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>

                            {activeRowTab === "json" ? (
                              <pre className="p-3 bg-black/60 rounded-lg border border-gray-900 text-[10px] leading-relaxed text-indigo-300 overflow-x-auto font-mono scrollbar-thin">
                                {details.jsonPayload}
                              </pre>
                            ) : (
                              <pre className="p-3 bg-black/60 rounded-lg border border-gray-900 text-[10px] leading-relaxed text-emerald-400/90 overflow-x-auto font-mono scrollbar-thin whitespace-pre">
                                {details.stackTrace}
                              </pre>
                            )}
                          </div>

                          {isZh && (
                            <div className="p-3 bg-indigo-950/15 rounded-lg border border-indigo-900/25 text-indigo-300 leading-relaxed italic text-xs font-sans">
                              翻译: {log.msgZh}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-gray-600 font-sans">
                            <span className="flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Pipeline Agent Thread ID: 0x7f4a13c</span>
                            <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Module category: {log.category} subsystem</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-900 bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-sans gap-2 select-none">
        <div className="flex items-center gap-3">
          <span>{isZh ? `正在显示 ${filteredLogs.length} / ${logs.length} 条日志` : `Showing ${filteredLogs.length} of ${logs.length} entries`}</span>
          {pinnedIds.size > 0 && (
            <>
              <span className="h-1.5 w-px bg-gray-800" />
              <span className="text-indigo-400 font-semibold">{isZh ? `${pinnedIds.size} 条已高亮` : `${pinnedIds.size} highlighted`}</span>
            </>
          )}
          <span className="h-1.5 w-px bg-gray-800" />
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${isStreaming ? "bg-emerald-500 animate-pulse" : "bg-gray-600"}`} />
            <span className="text-[9px] font-mono tracking-wide uppercase">{isStreaming ? (isZh ? "实时流启动" : "Streaming Active") : (isZh ? "暂停接收" : "Streaming Paused")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-gray-300 transition-colors cursor-pointer">{isZh ? "文档" : "Documentation"}</button>
          <span>•</span>
          <button className="hover:text-gray-300 transition-colors cursor-pointer">{isZh ? "技术支持" : "Support"}</button>
        </div>
      </div>
    </motion.div>
  );
}
