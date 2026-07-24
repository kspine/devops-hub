import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useToast } from "./ToastContext";
import { 
  Server, 
  Database, 
  Zap, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  FileCode, 
  Key, 
  FileSearch, 
  ShieldAlert, 
  Download, 
  Send, 
  Cpu, 
  Play, 
  Check, 
  Sliders, 
  Smartphone, 
  BarChart2, 
  Radio, 
  ExternalLink,
  Tag,
  Globe
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip, 
  BarChart, 
  Bar 
} from "recharts";

import { useWorkspace } from "../WorkspaceContext";
import { PRODUCTION_COMMANDS } from "../utils/productionCommands";
import { ProjectType } from "../types";

export default function ProductionSuite() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [activeSection, setActiveSection] = useState<"cache" | "scaling" | "diff" | "delta" | "publishing" | "ml" | "naming" | "dependency" | "alertThresholds" | "map" | "timeline" | "configBuilder">("cache");

  // Maintenance Timeline Data
  const maintenanceEvents = [
    { day: "Mon", events: [{ type: "Reboot", node: "US-RUN-01", time: "02:00" }] },
    { day: "Tue", events: [{ type: "Drain", node: "EU-RUN-04", time: "22:00" }] },
    { day: "Wed", events: [] },
    { day: "Thu", events: [{ type: "Reboot", node: "ASIA-RUN-02", time: "01:00" }, { type: "Deep Clean", node: "SA-RUN-01", time: "04:00" }] },
    { day: "Fri", events: [] },
    { day: "Sat", events: [{ type: "Maintenance", node: "Cluster-Wide", time: "00:00" }] },
    { day: "Sun", events: [] },
  ];

  // Config Builder State
  const [exportPlatform, setExportPlatform] = useState<"jenkins" | "github">("github");
  const [exportFormat, setExportFormat] = useState<"yaml" | "json">("yaml");

  // Regional Latency Data
  const regionalLatency = [
    { id: "us-east", name: "US-East (N. Virginia)", lat: 38.0, lng: -78.0, latency: 24, load: 65 },
    { id: "eu-west", name: "EU-West (Ireland)", lat: 53.0, lng: -8.0, latency: 88, load: 42 },
    { id: "asia-east", name: "Asia-East (Tokyo)", lat: 35.0, lng: 139.0, latency: 192, load: 78 },
    { id: "us-west", name: "US-West (Oregon)", lat: 44.0, lng: -120.0, latency: 48, load: 31 },
    { id: "sa-east", name: "SA-East (Sao Paulo)", lat: -23.0, lng: -46.0, latency: 145, load: 15 },
  ];

  // Auto-Scaling History Data
  const scalingHistory = [
    { time: "08:00", nodes: 4, efficiency: 92 },
    { time: "10:00", nodes: 8, efficiency: 88 },
    { time: "12:00", nodes: 12, efficiency: 95 },
    { time: "14:00", nodes: 6, efficiency: 85 },
    { time: "16:00", nodes: 15, efficiency: 91 },
    { time: "18:00", nodes: 10, efficiency: 89 },
    { time: "20:00", nodes: 5, efficiency: 94 },
  ];

  // Alert Thresholds
  const [alertThresholds, setAlertThresholds] = useState<{cpu: number, ram: number, webhook?: string}>(() => {
    const saved = localStorage.getItem("alertThresholds");
    return saved ? JSON.parse(saved) : { cpu: 85, ram: 90, webhook: "" };
  });

  useEffect(() => {
    localStorage.setItem("alertThresholds", JSON.stringify(alertThresholds));
  }, [alertThresholds]);

  // SECTION 8: Dependency Auditor states
  const [depScanStatus, setDepScanStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [depScanLog, setDepScanLog] = useState<string[]>([]);

  // Quick Cache Clear states
  const [cleanPlatform, setCleanPlatform] = useState<"bash" | "powershell" | "cmd">("bash");
  const [cleanContext, setCleanContext] = useState<"jenkins" | "local" | "ddc_hub">("jenkins");
  const [isPurging, setIsPurging] = useState(false);
  const [purgeTerminalLogs, setPurgeTerminalLogs] = useState<string[]>([]);
  
  const getInitialDependencies = (type: ProjectType) => {
    if (type === "unity") {
      return [
        { name: "com.unity.services.core", version: "1.11.0", latest: "1.12.3", status: "outdated", vuln: "None", severity: "low" as const },
        { name: "com.unity.purchasing", version: "4.8.0", latest: "4.11.1", status: "vulnerable", vuln: "CVE-2024-1142: Sandbox Escape", severity: "high" as const },
        { name: "com.unity.transport", version: "2.0.1", latest: "2.2.0", status: "outdated", vuln: "CVE-2023-4521: Memory Leak", severity: "medium" as const },
        { name: "newtonsoft.json", version: "13.0.1", latest: "13.0.3", status: "ok", vuln: "None", severity: "none" as const },
        { name: "com.unity.xr.interaction.toolkit", version: "2.5.2", latest: "2.6.1", status: "outdated", vuln: "None", severity: "low" as const }
      ];
    } else if (type === "unreal") {
      return [
        { name: "OnlineSubsystemSteam", version: "1.0.0", latest: "1.4.0", status: "outdated", vuln: "None", severity: "low" as const },
        { name: "AdvancedSessionsPlugin", version: "5.2.0", latest: "5.3.1", status: "vulnerable", vuln: "CVE-2023-9021: Deserialization RCE", severity: "critical" as const },
        { name: "FMODStudio", version: "2.02.13", latest: "2.02.20", status: "outdated", vuln: "CVE-2024-0012: Audio Buffer Overflow", severity: "medium" as const },
        { name: "WebBrowserWidget", version: "1.0.0", latest: "1.0.0", status: "vulnerable", vuln: "CVE-2023-8890: Outdated CEF (Chromium v90)", severity: "high" as const },
        { name: "UniversalVoiceChat", version: "3.1.0", latest: "3.1.0", status: "ok", vuln: "None", severity: "none" as const }
      ];
    } else {
      return [
        { name: "express", version: "4.18.2", latest: "4.19.2", status: "outdated", vuln: "None", severity: "low" as const },
        { name: "mongoose", version: "6.10.0", latest: "8.2.1", status: "vulnerable", vuln: "CVE-2024-1234: Query Injection", severity: "critical" as const },
        { name: "lodash", version: "4.17.21", latest: "4.17.21", status: "ok", vuln: "None", severity: "none" as const }
      ];
    }
  };

  const [dependenciesList, setDependenciesList] = useState(() => getInitialDependencies(projectType));

  useEffect(() => {
    setDependenciesList(getInitialDependencies(projectType));
    setDepScanStatus("idle");
    setDepScanLog([]);
  }, [projectType]);

  const runAuditScan = () => {
    setDepScanStatus("scanning");
    setDepScanLog([]);
    
    const logs = projectType === "unity" ? [
      "🔍 Parsing manifest.json & package-lock.json...",
      "📦 Found 5 custom package entries & 42 resolved sub-dependencies.",
      "🌐 Querying global Unity Asset Store & NPM security databases...",
      "⚠️ Alert: com.unity.purchasing v4.8.0 has known HIGH vulnerability: CVE-2024-1142.",
      "⚠️ Alert: com.unity.transport v2.0.1 is outdated and vulnerable to memory exhaustion (CVE-2023-4521).",
      "✓ Newtonsoft.Json v13.0.1 is up to date and secure.",
      "📊 Dependency vulnerability assessment completed: 1 High, 1 Medium, 2 Low, 1 Secure."
    ] : projectType === "unreal" ? [
      "🔍 Parsing game.uproject & Plugins folder modules...",
      "📦 Found 5 enabled plugins & 18 active build modules.",
      "🌐 Querying Unreal Engine Marketplace & CVE Vulnerability databases...",
      "🛑 Alert: AdvancedSessionsPlugin v5.2.0 contains CRITICAL vulnerability: CVE-2023-9021 (Remote Code Execution).",
      "⚠️ Alert: FMODStudio v2.02.13 is outdated. Vulnerability detected: CVE-2024-0012.",
      "⚠️ Alert: WebBrowserWidget is using deprecated unsecure CEF subsystem (CVE-2023-8890).",
      "📊 Unreal module vulnerability audit completed: 1 Critical, 1 High, 1 Medium, 2 Clear."
    ] : [
      "🔍 Scanning package.json & lock files...",
      "📦 Found 12 direct dependencies & 156 transitives.",
      "🌐 Querying NPM Security Registry (Audit API)...",
      "🛑 Alert: mongoose v6.10.0 contains CRITICAL vulnerability (CVE-2024-1234).",
      "⚠️ Alert: express v4.18.2 is outdated (Security fix in 4.19.2).",
      "📊 Full-stack dependency audit completed: 1 Critical, 1 Medium, 10 Clear."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setDepScanLog(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDepScanStatus("done");
        addToast(isZh ? "依赖包漏洞审计扫描完成！" : "Dependency security sweep completed!", "warning");
      }
    }, 400);
  };

  const handleRemediateAll = () => {
    setDependenciesList(prev => prev.map(dep => ({
      ...dep,
      version: dep.latest,
      status: "ok",
      severity: "none" as const,
      vuln: "None"
    })));
    addToast(isZh ? "所有漏洞及过时包已自动升级修复至安全版本！" : "All vulnerabilities & outdated packages successfully upgraded!", "success");
    window.dispatchEvent(new Event("trigger-confetti"));
  };

  const handleRemediateSingle = (name: string, latest: string) => {
    setDependenciesList(prev => prev.map(dep => dep.name === name ? {
      ...dep,
      version: latest,
      status: "ok",
      severity: "none" as const,
      vuln: "None"
    } : dep));
    addToast(isZh ? `已将 ${name} 自动升级至最新安全版本 ${latest}！` : `Successfully upgraded ${name} to ${latest}!`, "success");
    window.dispatchEvent(new Event("trigger-confetti"));
  };

  // Cache Purge helper functions
  const getPurgeCommand = (type: ProjectType, platform: "bash" | "powershell" | "cmd", context: "jenkins" | "local" | "ddc_hub") => {
    if (type === "unity") {
      if (context === "jenkins") {
        if (platform === "bash") {
          return `# Stop editor safe locks, then purge Jenkins Unity Library cache\necho "Stopping active Jenkins build locks..."\nrm -rf "\${WORKSPACE}/Library"\nrm -rf "\${WORKSPACE}/Temp"\nrm -rf "\${WORKSPACE}/obj"\necho "Jenkins Unity workspace cache cleared!"`;
        } else if (platform === "powershell") {
          return `# Stop active locks and purge Unity Library folders inside Jenkins\nWrite-Host "Stopping active pipelines..."\nRemove-Item -Recurse -Force "\${env:WORKSPACE}/Library"\nRemove-Item -Recurse -Force "\${env:WORKSPACE}/Temp"\nWrite-Host "Jenkins Unity workspace cache cleared!"`;
        } else {
          return `:: Purge Jenkins Unity workspace caches\nrmdir /s /q "%WORKSPACE%\\Library"\nrmdir /s /q "%WORKSPACE%\\Temp"\necho Jenkins workspace cache cleared!`;
        }
      } else if (context === "local") {
        if (platform === "bash") {
          return `# Purge local Unity Project caches\nrm -rf ./Library\nrm -rf ./Temp\nrm -rf ./Logs\nrm -rf ./UserSettings\necho "Local Unity project cache folders cleared successfully."`;
        } else if (platform === "powershell") {
          return `# Purge local Unity Project caches\nRemove-Item -Recurse -Force ./Library, ./Temp, ./Logs, ./UserSettings\nWrite-Host "Local caches purged successfully."`;
        } else {
          return `:: Purge local Unity cache folders\nrmdir /s /q Library\nrmdir /s /q Temp\nrmdir /s /q Logs`;
        }
      } else {
        if (platform === "bash") {
          return PRODUCTION_COMMANDS.clearUnityCache.curl;
        } else if (platform === "powershell") {
          return PRODUCTION_COMMANDS.clearUnityCache.powershell;
        } else {
          return `:: Purge local asset store cache database\nrmdir /s /q "%LOCALAPPDATA%\\Unity\\AssetStore-5.x"`;
        }
      }
    } else if (type === "unreal") {
      if (context === "jenkins") {
        if (platform === "bash") {
          return `# Purge Unreal Engine Intermediate folders inside Jenkins workspace\necho "Cleaning Unreal build temporary folders..."\nrm -rf "\${WORKSPACE}/Intermediate"\nrm -rf "\${WORKSPACE}/Saved"\nrm -rf "\${WORKSPACE}/DerivedDataCache"\necho "Jenkins Unreal workspace cleared!"`;
        } else if (platform === "powershell") {
          return `# Clean Unreal build workspaces via PowerShell\nRemove-Item -Recurse -Force "\${env:WORKSPACE}/Intermediate"\nRemove-Item -Recurse -Force "\${env:WORKSPACE}/Saved"\nRemove-Item -Recurse -Force "\${env:WORKSPACE}/DerivedDataCache"`;
        } else {
          return `:: CMD Clean Unreal workspace\nrmdir /s /q "%WORKSPACE%\\Intermediate"\nrmdir /s /q "%WORKSPACE%\\Saved"`;
        }
      } else if (context === "local") {
        if (platform === "bash") {
          return `# Clean local Unreal Project caches\nrm -rf ./Intermediate\nrm -rf ./Saved\nrm -rf ./DerivedDataCache\nrm -rf ./Binaries\necho "Local Unreal caches cleared."`;
        } else if (platform === "powershell") {
          return `# Clean local Unreal Project caches\nRemove-Item -Recurse -Force ./Intermediate, ./Saved, ./DerivedDataCache, ./Binaries`;
        } else {
          return `:: CMD Clean local Unreal folders\nrmdir /s /q Intermediate\nrmdir /s /q Saved\nrmdir /s /q DerivedDataCache`;
        }
      } else {
        if (platform === "bash") {
          return `# Purge Unreal Engine local Derived Data Cache (DDC) directories\nrm -rf "\${ENGINE_DIR}/Engine/DerivedDataCache"\nrm -rf "$HOME/Library/Application Support/Epic/UnrealEngine/DerivedDataCache"`;
        } else if (platform === "powershell") {
          return `# Purge Unreal Engine Local & Shared Derived Data Cache (DDC)\nRemove-Item -Recurse -Force "$env:LOCALAPPDATA/UnrealEngine/DerivedDataCache"`;
        } else {
          return `:: CMD Purge Unreal local DDC cache\nrmdir /s /q "%LOCALAPPDATA%\\UnrealEngine\\DerivedDataCache"`;
        }
      }
    } else {
      // Default for web, mobile, backend
      if (context === "jenkins") {
        return `rm -rf node_modules\nrm -rf .next\nrm -rf build\nnpm install`;
      } else if (context === "local") {
        return `rm -rf node_modules\nnpm cache clean --force`;
      } else {
        return `docker system prune -f`;
      }
    }
  };

  const handleSimulatePurge = () => {
    setIsPurging(true);
    setPurgeTerminalLogs([
      "🧹 Connecting to target compilation environment...",
      `🔌 Initializing secure shell session (${cleanPlatform}) on node-runner-03...`,
      `💾 Evaluating disk footprints for path mappings...`
    ]);

    let i = 0;
    const steps = [
      "⚙️ Acquiring safe system locks, pausing background compiler agents...",
      "🗑️ Executing directory delete command...",
      "✓ Purging target directories... Done.",
      "📦 Running registry index re-alignment and compaction...",
      "📈 Disk reclamation scan completed. Freed: 148.4 GB.",
      "✨ Cache purge finalized! Caches aligned and local disk health restored to 100%."
    ];

    const timer = setInterval(() => {
      if (i < steps.length) {
        setPurgeTerminalLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(timer);
        setIsPurging(false);
        setAcceleratorHitRate(0.0); // Reset hit rate so user sees local change!
        addToast(isZh ? "缓存库及本地构建资源清理对齐成功！回收了 148.4 GB 磁盘空间。" : "Cache purged! 148.4 GB of block storage reclaimed.", "success");
        window.dispatchEvent(new Event("trigger-confetti"));
      }
    }, 450);
  };

  // SECTION 1: Cache & Accelerator
  const [cacheEngine, setCacheEngine] = useState<"unity_acc" | "unreal_ddc">(projectType === "unity" ? "unity_acc" : "unreal_ddc");
  const [acceleratorHitRate, setAcceleratorHitRate] = useState(84.2);
  const [accEnabled, setAccEnabled] = useState(true);
  const [isWarmingCache, setIsWarmingCache] = useState(false);
  const [cacheMetrics, setCacheMetrics] = useState([
    { name: "01:00", hit: 72, size: 120 },
    { name: "03:00", hit: 75, size: 135 },
    { name: "05:00", hit: 81, size: 154 },
    { name: "07:00", hit: 79, size: 142 },
    { name: "09:00", hit: 85, size: 168 },
    { name: "11:00", hit: 88, size: 185 },
  ]);

  // SECTION 2: Dynamic K8s Scaling & Licenses
  const [k8sPods, setK8sPods] = useState(12);
  const [k8sStatus, setK8sStatus] = useState<"idle" | "scaling" | "max">("idle");
  const [activeLeases, setActiveLeases] = useState([
    { id: "L-9082", host: "NODE-01-K8S", rentedAt: "10:24", status: "Active" },
    { id: "L-4412", host: "NODE-03-K8S", rentedAt: "10:45", status: "Active" },
    { id: "L-3109", host: "IOS-RUN-01", rentedAt: "11:12", status: "Active" },
  ]);
  const [licenseTerminal, setLicenseTerminal] = useState<string[]>([]);
  const [isLeasingLicense, setIsLeasingLicense] = useState(false);

  // SECTION 3: Package Diff & Symbol upload
  const [baseVer, setBaseVer] = useState("v2.4.0-stable");
  const [targetVer, setTargetVer] = useState("v2.5.0-rc3");
  const [isComparing, setIsComparing] = useState(false);
  const [diffResult, setDiffResult] = useState<any | null>({
    baseSize: "412.5 MB",
    targetSize: "448.9 MB",
    diffSize: "+36.4 MB",
    exceeded: false,
    breakdown: [
      { type: isZh ? "纹理/资产 (Textures/Assets)" : "Textures/Assets", val: 55, color: "bg-indigo-500", size: "+28.2 MB" },
      { type: isZh ? "C# 程序集/原生代码 (Code/DLLs)" : "Code/DLLs", val: 20, color: "bg-blue-500", size: "+3.1 MB" },
      { type: isZh ? "音频/视频 (Audio/Video)" : "Audio/Video", val: 15, color: "bg-emerald-500", size: "+4.5 MB" },
      { type: isZh ? "着色器/烘焙资源 (Shaders/Cooked)" : "Shaders/Cooked", val: 10, color: "bg-amber-500", size: "+0.6 MB" },
    ],
    anomalies: [
      { id: 1, title: isZh ? "发现重复的高清音频剪辑 (Hero_Background_Loop.wav)" : "Duplicate HQ audio clip detected (Hero_Background_Loop.wav)", severity: "warning" },
      { id: 2, title: isZh ? "4K纹理未开启 Mipmaps (UI_Banner_Gold_01.png)" : "4K Texture without Mipmaps enabled (UI_Banner_Gold_01.png)", severity: "info" }
    ],
    symbolsUploaded: true
  });
  const [symbolPlatform, setSymbolPlatform] = useState<"bugly" | "sentry" | "crashlytics">("sentry");
  const [autoUploadSymbols, setAutoUploadSymbols] = useState(true);

  // SECTION 4: Binary Patch & CDN pre-warming
  const [deltaCompression, setDeltaCompression] = useState<"bsdiff" | "hdiffz">("hdiffz");
  const [sourceSize, setSourceSize] = useState(150); // MB
  const [patchLevel, setPatchLevel] = useState<"fast" | "normal" | "ultra">("ultra");
  const [isWarmupTriggered, setIsWarmupTriggered] = useState(false);
  const [warmupProgress, setWarmupProgress] = useState(0);
  const [cdnNodes, setCdnNodes] = useState([
    { region: "Tokyo, JP", ping: "35ms", status: "Ready" },
    { region: "Frankfurt, DE", ping: "120ms", status: "Ready" },
    { region: "Silicon Valley, US", ping: "85ms", status: "Ready" },
    { region: "Beijing, CN", ping: "15ms", status: "Ready" },
    { region: "Sydney, AU", ping: "92ms", status: "Ready" },
  ]);

  // SECTION 5: Resigning & Compliance Scan
  const [channels, setChannels] = useState([
    { id: "googleplay", name: "Google Play", suffix: "aab", status: "Signed", duration: "2.1s" },
    { id: "huawei", name: "Huawei AppGallery", suffix: "apk", status: "Signed", duration: "3.5s" },
    { id: "xiaomi", name: "Xiaomi GetApps", suffix: "apk", status: "Ready", duration: "-" },
    { id: "oppo", name: "Oppo Store", suffix: "apk", status: "Ready", duration: "-" },
    { id: "ios_testflight", name: "iOS TestFlight", suffix: "ipa", status: "Signed", duration: "4.2s" },
    { id: "enterprise", name: "Enterprise AdHoc", suffix: "ipa", status: "Ready", duration: "-" },
  ]);
  const [isBatchSigning, setIsBatchSigning] = useState(false);
  const [complianceResults, setComplianceResults] = useState([
    { id: "ip_check", label: isZh ? "测试环境敏感 IP 检测" : "Internal Dev IPs Exposure Scan", result: "Pass", detail: isZh ? "未检测到暴露的内网 192.168 或 10.x 段测试机 IP" : "No hardcoded internal class subnets discovered." },
    { id: "vuln_check", label: isZh ? "Android 隐私权限违规调用检测" : "Privacy API Call Compliance", result: "Warning", detail: isZh ? "检测到 SDK 读取了 AndroidID (IMEI)，需确保存储隐私授权弹窗同意后再调用" : "Read device fingerprint AndroidID (IMEI) detected. Must guard with consent." },
    { id: "word_check", label: isZh ? "敏感禁忌词及测试日志过滤" : "Sensitive Logs/Words Filter", result: "Pass", detail: isZh ? "未发现遗漏的 DEBUG-VERBOSE 日志或敏感测试密钥" : "Production builds cleared of testing environment secrets." },
  ]);

  // SECTION 6: ML & Cloud Device Lab
  const [modelType, setModelType] = useState("agent_neural_physics.onnx");
  const [isQuantizing, setIsQuantizing] = useState(false);
  const [quantizedStats, setQuantizedStats] = useState<any | null>({
    originalSize: "148.5 MB",
    quantizedSize: "37.2 MB",
    reduction: "75%",
    fpsBoost: "+180%",
    latency: "14ms (FP32 was 42ms)"
  });
  const [devices, setDevices] = useState([
    { name: "iPhone 15 Pro Max", os: "iOS 17.4", type: "Flagship", status: "Passed", fps: 60, temp: "38.2°C" },
    { name: "Samsung Galaxy S24 Ultra", os: "Android 14", type: "Flagship", status: "Passed", fps: 120, temp: "39.1°C" },
    { name: "Xiaomi 14 Pro", os: "HyperOS 1.0", type: "Flagship", status: "Passed", fps: 118, temp: "40.5°C" },
    { name: "Huawei Mate 60 Pro", os: "HarmonyOS 4.0", type: "Mid-High", status: "Passed", fps: 60, temp: "37.8°C" },
    { name: "Google Pixel 8", os: "Android 14", type: "Reference", status: "Passed", fps: 59, temp: "38.5°C" },
    { name: "Redmi Note 12", os: "Android 13", type: "Low-End", status: "Running", fps: 45, temp: "41.2°C" },
  ]);
  const [isTestingDevices, setIsTestingDevices] = useState(false);

  // SECTION 7: Naming & Versioning System
  const [projName, setProjName] = useState(projectType === "unity" ? "EpicRealm_Unity" : "EpicRealm_Unreal");
  const [semVer, setSemVer] = useState("1.4.2");
  const [buildNum, setBuildNum] = useState("12093");
  const [namingChannel, setNamingChannel] = useState("GooglePlay");
  const [namingPlatform, setNamingPlatform] = useState<"Android" | "iOS" | "Windows" | "macOS" | "Linux">("Android");
  const [namingFormula, setNamingFormula] = useState("{project}_{platform}_{channel}_v{version}_b{build}_{datetime}");
  const [namingRule, setNamingRule] = useState<"manual" | "timestamp" | "semver_patch">("semver_patch");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success">("idle");
  const [syncLog, setSyncLog] = useState<string[]>([]);

  // Build Size Regression Manifest states
  const [baseManifestInput, setBaseManifestInput] = useState<string>("");
  const [targetManifestInput, setTargetManifestInput] = useState<string>("");
  const [manifestDiffResult, setManifestDiffResult] = useState<{
    totalBase: number;
    totalTarget: number;
    delta: number;
    files: { path: string; baseSize: number; targetSize: number; delta: number; status: "added" | "removed" | "changed" | "unchanged" }[];
  } | null>(null);

  // CDN Pre-warming Tool States
  const [cdnDistUrl, setCdnDistUrl] = useState<string>("https://cdn.epicrealm.com/hotfix/v1.4.2/patch.pak");
  const [cdnProvider, setCdnProvider] = useState<"cloudfront" | "akamai" | "aliyun">("cloudfront");

  // Sync state between Unity & Unreal Engine context changes
  useEffect(() => {
    setCacheEngine(projectType === "unity" ? "unity_acc" : "unreal_ddc");
    setProjName(projectType === "unity" ? "EpicRealm_Unity" : "EpicRealm_Unreal");
  }, [projectType]);

  const loadDemoManifests = () => {
    const demoBase = [
      { "path": "Assets/Textures/skybox_night.png", "size": 12.4 },
      { "path": "Assets/Audio/battle_theme.mp3", "size": 8.2 },
      { "path": "Assets/Scripts/GamePlay.dll", "size": 4.1 },
      { "path": "Assets/Shaders/toon_shader.shader", "size": 1.5 },
      { "path": "Assets/Models/boss_dragon.fbx", "size": 25.3 },
      { "path": "Assets/Plugins/GooglePlayBilling.aar", "size": 2.2 }
    ];
    const demoTarget = [
      { "path": "Assets/Textures/skybox_night.png", "size": 44.8 },
      { "path": "Assets/Audio/battle_theme.mp3", "size": 8.2 },
      { "path": "Assets/Scripts/GamePlay.dll", "size": 6.8 },
      { "path": "Assets/Shaders/toon_shader.shader", "size": 1.5 },
      { "path": "Assets/Models/boss_dragon.fbx", "size": 25.3 },
      { "path": "Assets/Plugins/GooglePlayBilling.aar", "size": 2.2 },
      { "path": "Assets/Textures/hero_skin_gold.png", "size": 18.5 },
      { "path": "Assets/UI/atlases/hud_elements.png", "size": 9.4 }
    ];
    setBaseManifestInput(JSON.stringify(demoBase, null, 2));
    setTargetManifestInput(JSON.stringify(demoTarget, null, 2));
    addToast(isZh ? "已加载双版本包体资源清单 Demo 数据！" : "Demo file structure manifests loaded successfully!", "info");
  };

  const handleComputeManifestDiff = () => {
    try {
      if (!baseManifestInput.trim() || !targetManifestInput.trim()) {
        addToast(isZh ? "请先输入或加载两个版本的清单文件！" : "Please input or load manifest data for both versions first!", "error");
        return;
      }
      const baseArr = JSON.parse(baseManifestInput);
      const targetArr = JSON.parse(targetManifestInput);

      if (!Array.isArray(baseArr) || !Array.isArray(targetArr)) {
        throw new Error("Input manifests must be valid JSON arrays.");
      }

      const baseMap = new Map<string, number>();
      baseArr.forEach((f: any) => {
        if (f && typeof f.path === "string" && typeof f.size === "number") {
          baseMap.set(f.path, f.size);
        }
      });

      const targetMap = new Map<string, number>();
      targetArr.forEach((f: any) => {
        if (f && typeof f.path === "string" && typeof f.size === "number") {
          targetMap.set(f.path, f.size);
        }
      });

      let totalBase = 0;
      baseMap.forEach(size => totalBase += size);

      let totalTarget = 0;
      targetMap.forEach(size => totalTarget += size);

      const allPaths = Array.from(new Set([...baseMap.keys(), ...targetMap.keys()]));
      const fileDiffs = allPaths.map(path => {
        const bSize = baseMap.get(path) || 0;
        const tSize = targetMap.get(path) || 0;
        const delta = tSize - bSize;
        let status: "added" | "removed" | "changed" | "unchanged" = "unchanged";
        if (!baseMap.has(path)) status = "added";
        else if (!targetMap.has(path)) status = "removed";
        else if (delta !== 0) status = "changed";

        return { path, baseSize: bSize, targetSize: tSize, delta, status };
      });

      fileDiffs.sort((a, b) => b.delta - a.delta);

      setManifestDiffResult({
        totalBase,
        totalTarget,
        delta: totalTarget - totalBase,
        files: fileDiffs
      });

      addToast(
        isZh 
          ? `差异分析完毕！包体总增量：${(totalTarget - totalBase).toFixed(1)} MB` 
          : `Manifest computed! Net delta: ${(totalTarget - totalBase).toFixed(1)} MB`, 
        "success"
      );
    } catch (e: any) {
      addToast(isZh ? `解析失败：请输入包含 'path' 和 'size' 的 JSON 数组。` : `Parse error: Provide a valid JSON list of files with 'path' and 'size' keys.`, "error");
    }
  };

  const getPreWarmScript = () => {
    if (cdnProvider === "cloudfront") {
      return `# AWS CloudFront cache pre-warm command (Force Edge cache refresh via invalidate)
aws cloudfront create-invalidation \\
  --distribution-id EDPYEXAMPLE78 \\
  --paths "/*"

# Send warm-up parallel HTTP requests to global edge locations
curl -I -s -X GET "${cdnDistUrl}" \\
  -H "Fastly-Debug: 1" \\
  -H "X-Cache-Warmup: true"`;
    } else if (cdnProvider === "akamai") {
      return `# Akamai Fast Purge & Edge Pre-warm API Call
curl -X POST "https://api.ccu.akamai.com/ccu/v3/invalidate/url" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Akamai-EG1-HS256 client_token=xxxx;access_token=xxxx;" \\
  -d '{
    "objects": ["${cdnDistUrl}"],
    "action": "invalidate"
  }'

# Proactive parallel warmers
for edge in "tokyo" "london" "frankfurt" "sydney" "siliconvalley"; do
  echo "Warming Akamai Edge Node: \${edge}"
  curl -s -o /dev/null -w "%{http_code} - %{time_total}s\\n" "${cdnDistUrl}"
done`;
    } else {
      return `# Aliyun CDN pre-warm push API (Create cache preheating task)
curl -X POST "https://cdn.aliyuncs.com/" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "Action=PushObjectCache" \\
  -d "ObjectPath=${encodeURIComponent(cdnDistUrl)}" \\
  -d "Area=gslb" \\
  -d "Format=JSON" \\
  -d "Version=2018-05-10" \\
  -d "AccessKeyId=LTAI5tExampleKey"

# Standalone high-speed curl warm-up request
curl -I "${cdnDistUrl}"`;
    }
  };

  const handleWarmCache = () => {
    setIsWarmingCache(true);
    addToast(isZh ? "开始预热分布式编译缓存..." : "Warming up shared compiler caches...", "info");
    setTimeout(() => {
      setIsWarmingCache(false);
      setAcceleratorHitRate(92.4);
      addToast(isZh ? "分布式缓存预热成功！当前命中率提升至 92.4%" : "Shared cache warmed up! Hit rate improved to 92.4%", "success");
    }, 1500);
  };

  const handleRentLicense = () => {
    if (isLeasingLicense) return;
    setIsLeasingLicense(true);
    setLicenseTerminal(prev => [...prev, "[11:20:05] Requesting dynamic floating license from corporate server..."]);
    
    setTimeout(() => {
      const newId = `L-${Math.floor(1000 + Math.random() * 9000)}`;
      setActiveLeases(prev => [
        ...prev,
        { id: newId, host: "NEW-K8S-POD", rentedAt: "11:20", status: "Active" }
      ]);
      setLicenseTerminal(prev => [
        ...prev,
        `[11:20:01] SUCCESS: Leased seat ${newId} (unity-editor -activateLicense).`,
        `[11:20:02] Token stored in runtime container environment variables safely.`
      ]);
      setIsLeasingLicense(false);
      addToast(isZh ? "成功租用浮动 License" : "Successfully leased floating Unity license seat", "success");
    }, 1200);
  };

  const handleReturnLicense = (id: string) => {
    setActiveLeases(prev => prev.filter(l => l.id !== id));
    setLicenseTerminal(prev => [
      ...prev,
      `[11:20:45] Command executed: unity-editor -returnlicense for seat ${id}.`,
      `[11:20:46] SUCCESS: License returned. Seat is now free.`
    ]);
    addToast(isZh ? `许可证 ${id} 已安全退还` : `License seat ${id} safely returned`, "info");
  };

  const handleCompareDiff = () => {
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      setDiffResult({
        baseSize: "412.5 MB",
        targetSize: "458.1 MB",
        diffSize: "+45.6 MB",
        exceeded: true,
        breakdown: [
          { type: isZh ? "美术资源包/Textures (Textures/Assets)" : "Textures/Assets", val: 62, color: "bg-indigo-500", size: "+38.4 MB" },
          { type: isZh ? "程序 DLL 模块 (Code/DLLs)" : "Code/DLLs", val: 18, color: "bg-blue-500", size: "+1.9 MB" },
          { type: isZh ? "音频背景音乐 (Audio/Video)" : "Audio/Video", val: 12, color: "bg-emerald-500", size: "+4.8 MB" },
          { type: isZh ? "渲染管线/着色器 (Shaders/Cooked)" : "Shaders/Cooked", val: 8, color: "bg-amber-500", size: "+0.5 MB" },
        ],
        anomalies: [
          { id: 1, title: isZh ? "发现重复的高清音频剪辑 (Hero_Background_Loop.wav)" : "Duplicate HQ audio clip detected (Hero_Background_Loop.wav)", severity: "warning" },
          { id: 2, title: isZh ? "新增高分辨率无损纹理并且无压缩 32.4MB (skybox_uncompressed.png)" : "Added uncompressed ultra high-res skybox texture 32.4MB (skybox_uncompressed.png)", severity: "critical" },
          { id: 3, title: isZh ? "4K纹理未开启 Mipmaps (UI_Banner_Gold_01.png)" : "4K Texture without Mipmaps enabled (UI_Banner_Gold_01.png)", severity: "info" }
        ],
        symbolsUploaded: true
      });
      addToast(isZh ? "差异对比引擎分析完毕！警报：新增大文件异常触发阈值限制！" : "Diff Engine execution done! WARNING: Large file insertion triggers threshold!", "warning");
    }, 1800);
  };

  const handleTriggerWarmup = () => {
    setIsWarmupTriggered(true);
    setWarmupProgress(0);
    addToast(isZh ? "开始向 CDN 代理节点分发热更新补丁包..." : "Distributing hot-update delta patch to edge CDN nodes...", "info");
  };

  useEffect(() => {
    if (!isWarmupTriggered) return;
    const interval = setInterval(() => {
      setWarmupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCdnNodes(nodes => nodes.map(n => ({ ...n, status: "Active" })));
          addToast(isZh ? "CDN 全球核心节点主动缓存预热成功！" : "CDN global edge caches successfully pre-warmed!", "success");
          return 100;
        }
        return prev + 25;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isWarmupTriggered, isZh, addToast]);

  const handleBatchSigning = () => {
    setIsBatchSigning(true);
    addToast(isZh ? "启动母包极速批量重签名工具..." : "Triggering master-package sub-signing toolchain...", "info");
    
    let index = 0;
    const interval = setInterval(() => {
      if (index >= channels.length) {
        clearInterval(interval);
        setIsBatchSigning(false);
        addToast(isZh ? "所有多渠道子包重签名并合规扫描结束！" : "All multi-channel sub-packages resigned and audited successfully!", "success");
        return;
      }
      setChannels(prev => {
        const next = [...prev];
        if (next[index].status === "Ready") {
          next[index] = { 
            ...next[index], 
            status: "Signed", 
            duration: `${(2 + Math.random() * 3).toFixed(1)}s` 
          };
        }
        return next;
      });
      index++;
    }, 600);
  };

  const handleQuantize = () => {
    setIsQuantizing(true);
    setTimeout(() => {
      setIsQuantizing(false);
      setQuantizedStats({
        originalSize: "148.5 MB",
        quantizedSize: "37.2 MB",
        reduction: "75%",
        fpsBoost: "+180%",
        latency: "12ms (INT8 quant, FP32 base was 42ms)"
      });
      addToast(isZh ? "机器学习智能体模型 FP32 -> INT8 量化成功！" : "Machine Learning Agent model quantized from FP32 to INT8!", "success");
    }, 1400);
  };

  const handleTriggerDeviceTests = () => {
    setIsTestingDevices(true);
    setDevices(prev => prev.map(d => ({ ...d, status: d.name.includes("Redmi") ? "Running" : "Passed" })));
    addToast(isZh ? "多款云真机兼容性自动化测试开始拉起..." : "Triggering dynamic cloud testing compatibility sweep...", "info");
    
    setTimeout(() => {
      setDevices(prev => prev.map(d => ({ ...d, status: "Passed" })));
      setIsTestingDevices(false);
      addToast(isZh ? "云真机回归冒烟测试全部通过，无闪退！" : "All cloud devices smoke tests finished green. No crash!", "success");
    }, 2500);
  };

  const renderFormattedName = () => {
    let result = namingFormula;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // e.g. 20260714
    result = result.replace(/{project}/g, projName);
    result = result.replace(/{platform}/g, namingPlatform);
    result = result.replace(/{channel}/g, namingChannel);
    result = result.replace(/{version}/g, semVer);
    result = result.replace(/{build}/g, buildNum);
    result = result.replace(/{datetime}/g, dateStr);
    
    let ext = ".apk";
    if (namingPlatform === "Android") {
      ext = namingChannel === "GooglePlay" ? ".aab" : ".apk";
    } else if (namingPlatform === "iOS") {
      ext = ".ipa";
    } else if (namingPlatform === "Windows") {
      ext = ".zip";
    } else {
      ext = ".tar.gz";
    }
    return `${result}${ext}`;
  };

  const handleTriggerSync = () => {
    setSyncStatus("syncing");
    setSyncLog([
      "[13:40:01] Initializing Versioning & Naming Closed-Loop Synchronizer...",
      `[13:40:02] Querying CDN metadata and Git Tags to resolve current version context...`,
      `[13:40:03] SUCCESS: Git Tag resolved at: v${semVer}-stable`,
    ]);

    setTimeout(() => {
      // Auto increment build code
      const nextBuild = (parseInt(buildNum) + 1).toString();
      let nextVer = semVer;
      if (namingRule === "semver_patch") {
        const parts = semVer.split(".");
        if (parts.length === 3) {
          parts[2] = (parseInt(parts[2]) + 1).toString();
          nextVer = parts.join(".");
        }
      }
      
      setSyncLog(prev => [
        ...prev,
        `[13:40:04] Synchronizing build parameters with local Workspace configs...`,
        `[13:40:05] Applying incremental rule: ${namingRule === "semver_patch" ? "Auto-Increment Patch" : "Keep Original"}`,
        `[13:40:06] Target version bumped: ${semVer} -> ${nextVer}`,
        `[13:40:07] Target Build Number bumped: ${buildNum} -> ${nextBuild}`,
        `[13:40:08] Applying file template pattern: "${namingFormula}"`,
        `[13:40:09] Validating naming clash against Google Play Store API & CDN storage...`,
        `[13:40:10] Perfect loop closed: metadata config synchronizer completed successfully!`,
      ]);

      setSemVer(nextVer);
      setBuildNum(nextBuild);
      setSyncStatus("success");
      addToast(
        isZh 
          ? "命名更新系统成功同步！版本与Build号已递增，代码已写入本地配置。" 
          : "Naming & update synchronizer done! Version bumped, hook scripts generated.", 
        "success"
      );
    }, 2000);
  };

  const currentDiffSizeNum = parseFloat(diffResult?.diffSize || "0");
  const isDiffAlert = currentDiffSizeNum > 40;

  // Define categories and their sections
  const categories = [
    {
      id: "speed" as const,
      labelEn: "Speed & Elasticity",
      labelZh: "集群加速与弹性伸缩",
      descEn: "Distributed compiler cache and dynamic editor license scaling.",
      descZh: "分布式构建缓存加速与编辑授权弹性调度",
      icon: Zap,
      sections: ["cache", "scaling"] as const,
    },
    {
      id: "delivery" as const,
      labelEn: "Artifacts & Delivery",
      labelZh: "包体诊断与多端交付",
      descEn: "Deep size analysis, delta patch compression, and CDN pre-warming.",
      descZh: "双版本大小对比、二进制差分与 CDN 全球预热",
      icon: Globe,
      sections: ["diff", "delta", "naming", "configBuilder"] as const,
    },
    {
      id: "security" as const,
      labelEn: "Security & Compliance",
      labelZh: "代码签名与安全审计",
      descEn: "Multi-channel automated signing and dependency CVE audits.",
      descZh: "多渠道子包极速重签名与三方依赖漏洞 CVE 扫描",
      icon: ShieldAlert,
      sections: ["publishing", "dependency"] as const,
    },
    {
      id: "telemetry" as const,
      labelEn: "Telemetry & Orchestration",
      labelZh: "量化压缩与运维监控",
      descEn: "Model quantization, Cloud Device Lab, latency heatmaps, and alerts.",
      descZh: "智能模型压缩量化、云真机兼容测试及多端报警监控",
      icon: Activity,
      sections: ["ml", "map", "alertThresholds", "timeline"] as const,
    }
  ];

  // Resolve active category based on activeSection
  const activeCategory = categories.find(cat => (cat.sections as readonly string[]).includes(activeSection)) || categories[0];

  const handleCategoryClick = (catId: "speed" | "delivery" | "security" | "telemetry") => {
    const cat = categories.find(c => c.id === catId);
    if (cat && cat.sections.length > 0) {
      if (!(cat.sections as readonly string[]).includes(activeSection)) {
        setActiveSection(cat.sections[0] as any);
      }
    }
  };

  // Helper to map section ID to its details for sub-nav rendering
  const getSectionDetails = (sectionId: string) => {
    switch (sectionId) {
      case "cache":
        return {
          labelEn: "Distributed Cache",
          labelZh: "分布式构建缓存",
          metric: `Hit: ${acceleratorHitRate.toFixed(1)}%`,
          icon: Database,
          tag: "DDC/ACC"
        };
      case "scaling":
        return {
          labelEn: "Auto-Scaling & Licenses",
          labelZh: "弹性集群与授权",
          metric: `${k8sPods} Nodes`,
          icon: Server,
          tag: "K8s Pool"
        };
      case "diff":
        return {
          labelEn: "Package Size Diff",
          labelZh: "包体差异对比",
          metric: diffResult?.diffSize || "Unanalyzed",
          icon: FileSearch,
          tag: "Diff Engine"
        };
      case "delta":
        return {
          labelEn: "Binary Diff & CDN",
          labelZh: "差分计算与CDN",
          metric: deltaCompression.toUpperCase(),
          icon: Zap,
          tag: "Delta AB"
        };
      case "naming":
        return {
          labelEn: "Naming & Versioning",
          labelZh: "命名更新与同步",
          metric: "Active",
          icon: Tag,
          tag: "Naming & Ver"
        };
      case "configBuilder":
        return {
          labelEn: "Config Builder",
          labelZh: "流水线构建器",
          metric: "YAML / JSON",
          icon: FileCode,
          tag: "Export"
        };
      case "publishing":
        return {
          labelEn: "Multi-Sign & Audit",
          labelZh: "多渠道母包及合规",
          metric: "6 Channels",
          icon: Key,
          tag: "Signing"
        };
      case "dependency":
        return {
          labelEn: "Dependency Auditor",
          labelZh: "依赖安全扫描",
          metric: depScanStatus === "idle" ? "Idle" : depScanStatus === "scanning" ? "Scanning..." : "Audited",
          icon: ShieldAlert,
          tag: "Audit Scan"
        };
      case "ml":
        return {
          labelEn: "ML Agent & CloudLab",
          labelZh: "模型压缩与云真机",
          metric: "INT8",
          icon: Cpu,
          tag: "ML & Test"
        };
      case "map":
        return {
          labelEn: "Global Latency Map",
          labelZh: "全球分布延迟图",
          metric: "72.4ms (p95)",
          icon: Globe,
          tag: "GEO"
        };
      case "alertThresholds":
        return {
          labelEn: "Alert Thresholds",
          labelZh: "警报阈值设置",
          metric: `CPU: ${alertThresholds.cpu}%`,
          icon: AlertTriangle,
          tag: "Alerts"
        };
      case "timeline":
        return {
          labelEn: "Maintenance Timeline",
          labelZh: "运维节点计划",
          metric: isZh ? "下一次: 周四" : "Next: Thu",
          icon: Activity,
          tag: "Calendar"
        };
      default:
        return {
          labelEn: "Sub-Capability",
          labelZh: "运维能力",
          metric: "",
          icon: Server,
          tag: "OPS"
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          const isCatActive = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-28 cursor-pointer select-none group ${
                isCatActive
                  ? "bg-indigo-950/20 border-indigo-500/80 shadow-md shadow-indigo-950/10"
                  : "bg-gray-950/40 border-gray-900 hover:bg-gray-900/40 hover:border-gray-800"
              }`}
            >
              {isCatActive && (
                <div className="absolute top-0 inset-x-0 h-[3px] bg-indigo-500" />
              )}
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl transition-colors ${
                  isCatActive ? "bg-indigo-500/15 text-indigo-400" : "bg-gray-900/60 text-gray-500 group-hover:text-gray-400"
                }`}>
                  <CatIcon className="h-5 w-5" />
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                  isCatActive ? "bg-indigo-950/40 border-indigo-900/50 text-indigo-400" : "bg-gray-900/40 border-gray-850 text-gray-600"
                }`}>
                  {cat.sections.length} {isZh ? "模块" : "Units"}
                </span>
              </div>
              <div className="mt-2 min-w-0">
                <h3 className={`text-xs font-bold transition-colors ${isCatActive ? "text-indigo-400" : "text-gray-300"}`}>
                  {isZh ? cat.labelZh : cat.labelEn}
                </h3>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  {isZh ? cat.descZh : cat.descEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-capabilities Segment bar within Active Category */}
      <div className="bg-gray-950/25 border border-gray-900/50 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-900 pb-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {isZh ? "运维子系统能力模块" : "OPS SUB-CAPABILITIES MODULES"}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            {isZh ? "类别" : "Category"}: <strong className="text-gray-300 font-semibold">{isZh ? activeCategory.labelZh : activeCategory.labelEn}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeCategory.sections.map((sectionId) => {
            const details = getSectionDetails(sectionId);
            const SubIcon = details.icon;
            const isSectionActive = activeSection === sectionId;
            return (
              <button
                key={sectionId}
                onClick={() => setActiveSection(sectionId as any)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-center gap-3 cursor-pointer select-none ${
                  isSectionActive
                    ? "bg-indigo-600/10 border-indigo-500/60 shadow shadow-indigo-600/10"
                    : "bg-gray-950/40 border-gray-850 hover:bg-gray-900/30 hover:border-gray-800"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isSectionActive ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-900 text-gray-500"}`}>
                  <SubIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className={`text-xs font-bold truncate ${isSectionActive ? "text-gray-100" : "text-gray-300"}`}>
                    {isZh ? details.labelZh : details.labelEn}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate mt-0.5 font-mono font-medium flex items-center gap-1.5">
                    <span className={`h-1 w-1 rounded-full ${isSectionActive ? "bg-indigo-400" : "bg-gray-600"}`} />
                    {details.metric}
                  </span>
                </div>
                <span className="shrink-0 text-[8px] font-mono font-bold bg-gray-900/60 text-gray-600 px-1 py-0.5 rounded border border-gray-850">
                  {details.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body content according to selected Section */}
      <div className="bg-gray-900/40 border border-gray-850 rounded-2xl p-6 min-h-[420px] transition-all">
        
        {/* Section Map: Regional Latency Map */}
        {activeSection === "map" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-400" />
                  {isZh ? "全球构建节点分布与延迟监控" : "Regional Latency & Node Distribution Map"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh ? "实时监控全球各区域构建代理到中央控制平面的网络脉冲延迟。" : "Real-time pulse latency monitoring from global build agents to central control plane."}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span>&lt; 50ms</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>50-150ms</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>&gt; 150ms</span>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] w-full bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden group">
              {/* Simplified World Map Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
                  <path d="M150,150 L200,100 L300,120 L400,80 L500,150 L600,100 L700,150 L800,120 L850,200 L800,300 L700,350 L600,320 L500,400 L400,350 L300,380 L200,350 L150,300 Z" fill="currentColor" className="text-gray-400" />
                  <circle cx="200" cy="150" r="20" fill="currentColor" />
                  <circle cx="800" cy="200" r="30" fill="currentColor" />
                </svg>
              </div>

              {/* Data Markers */}
              {regionalLatency.map((region) => {
                const x = ((region.lng + 180) / 360) * 100;
                const y = ((90 - region.lat) / 180) * 100;
                const statusColor = region.latency < 50 ? "bg-emerald-500" : region.latency < 150 ? "bg-amber-500" : "bg-rose-500";
                const shadowColor = region.latency < 50 ? "shadow-emerald-500/50" : region.latency < 150 ? "shadow-amber-500/50" : "shadow-rose-500/50";

                return (
                  <div 
                    key={region.id}
                    className="absolute group/marker cursor-default"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${statusColor} shadow-lg ${shadowColor} animate-pulse relative z-10`} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-2xl min-w-[140px]">
                        <div className="text-[10px] font-bold text-gray-200 mb-1 border-b border-gray-800 pb-1">{region.name}</div>
                        <div className="flex justify-between items-center gap-4 text-[9px] font-mono mt-1">
                          <span className="text-gray-500 uppercase">Latency:</span>
                          <span className={region.latency < 50 ? "text-emerald-400" : region.latency < 150 ? "text-amber-400" : "text-rose-400"}>
                            {region.latency}ms
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 text-[9px] font-mono mt-0.5">
                          <span className="text-gray-500 uppercase">Cluster Load:</span>
                          <span className="text-indigo-400">{region.load}%</span>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-800 rotate-45 mx-auto -mt-1" />
                    </div>
                  </div>
                );
              })}

              {/* Grid Overlay */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none" style={{ background: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-gray-950/50 border border-gray-850 rounded-xl space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "平均延迟指标" : "Global Avg Latency Metrics"}</h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-gray-100 font-mono">72.4</span>
                    <span className="text-xs text-gray-500 mb-1 font-mono">ms (p95)</span>
                  </div>
                  <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[72%]" />
                  </div>
               </div>
               <div className="p-4 bg-gray-950/50 border border-gray-850 rounded-xl space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "路由优化状态" : "Routing Optimization"}</h4>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-xs text-gray-300 font-medium">{isZh ? "边缘网络节点已激活" : "Edge network peering active"}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {isZh ? "自动优化跨区域构建传输，平均吞吐提升 18%。" : "Automatic cross-region build transport optimization active, 18% avg throughput boost."}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Section 9: Alert Thresholds */}
        {activeSection === "alertThresholds" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-400" />
              {isZh ? "警报阈值设置" : "Alert Thresholds"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl">
                <label className="block text-xs text-gray-400 mb-2">CPU Threshold (%)</label>
                <input
                  type="number"
                  value={alertThresholds.cpu}
                  onChange={(e) => setAlertThresholds({...alertThresholds, cpu: Number(e.target.value)})}
                  className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white"
                />
              </div>
            <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl">
                <label className="block text-xs text-gray-400 mb-2">RAM Threshold (%)</label>
                <input
                  type="number"
                  value={alertThresholds.ram}
                  onChange={(e) => setAlertThresholds({...alertThresholds, ram: Number(e.target.value)})}
                  className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl">
                <label className="block text-xs text-gray-400 mb-2">Webhook URL (Slack/Email)</label>
                <input
                  type="text"
                  value={alertThresholds.webhook || ""}
                  onChange={(e) => setAlertThresholds({...alertThresholds, webhook: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-white text-xs"
                  placeholder="https://hooks.slack.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 10: Maintenance Timeline */}
        {activeSection === "timeline" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-400" />
                  {isZh ? "节点维护周期概览" : "Cluster Maintenance Timeline"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh ? "可视化展示未来 7 天内计划的节点重启、排空及深度清理任务。" : "Visual roadmap of scheduled node reboots, drains, and deep-clean tasks for the next 7 days."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {isZh ? "安排新维护" : "Schedule Task"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {maintenanceEvents.map((dayData) => (
                <div key={dayData.day} className="flex flex-col gap-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center py-2 bg-gray-950/30 rounded-lg border border-gray-850/50">
                    {dayData.day}
                  </div>
                  <div className="min-h-[200px] bg-gray-950/20 border border-gray-850/30 rounded-xl p-2 space-y-2">
                    {dayData.events.length === 0 ? (
                      <div className="h-full flex items-center justify-center opacity-20">
                         <div className="h-0.5 w-4 bg-gray-600" />
                      </div>
                    ) : (
                      dayData.events.map((event, idx) => (
                        <div key={idx} className="p-2 bg-gray-900 border border-gray-800 rounded-lg shadow-sm group hover:border-indigo-500/50 transition-colors">
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-tighter ${
                                event.type === 'Reboot' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                event.type === 'Drain' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              }`}>
                                {event.type}
                              </span>
                              <span className="text-[8px] text-gray-500 font-mono">{event.time}</span>
                           </div>
                           <div className="text-[10px] text-gray-300 font-bold truncate">{event.node}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-start gap-4">
               <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-indigo-400" />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-indigo-300">{isZh ? "运营提示" : "Operational Hint"}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    {isZh ? "周六 00:00 的集群维护将影响所有构建队列。建议在维护窗口前 4 小时开启 '构建排空' 模式以防止任务中断。" : "Cluster-wide maintenance on Saturday 00:00 will affect all queues. Recommend enabling 'Drain Mode' 4 hours prior to window."}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Section 11: Config Builder */}
        {activeSection === "configBuilder" && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-emerald-400" />
                  {isZh ? "跨平台流水线构建器" : "Cross-Platform Pipeline Config Builder"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh ? "根据当前项目设置，自动生成标准化的 CI 流水线配置文件。" : "Generate standardized CI pipeline configurations based on your project settings."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-6">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "目标 CI 平台" : "Target CI Platform"}</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setExportPlatform("github")}
                        className={`p-3 rounded-xl border text-center transition-all ${exportPlatform === 'github' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-gray-950/40 border-gray-850 text-gray-500 hover:bg-gray-900/40'}`}
                      >
                        <div className="text-xs font-bold">GitHub Actions</div>
                      </button>
                      <button 
                        onClick={() => setExportPlatform("jenkins")}
                        className={`p-3 rounded-xl border text-center transition-all ${exportPlatform === 'jenkins' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-gray-950/40 border-gray-850 text-gray-500 hover:bg-gray-900/40'}`}
                      >
                        <div className="text-xs font-bold">Jenkins CI</div>
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "导出格式" : "Export Format"}</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setExportFormat("yaml")}
                        className={`px-3 py-2 rounded-lg border text-center text-[10px] font-bold transition-all ${exportFormat === 'yaml' ? 'bg-gray-800 border-gray-700 text-emerald-400' : 'bg-gray-950 border-gray-900 text-gray-500'}`}
                      >
                        YAML
                      </button>
                      <button 
                        onClick={() => setExportFormat("json")}
                        className={`px-3 py-2 rounded-lg border text-center text-[10px] font-bold transition-all ${exportFormat === 'json' ? 'bg-gray-800 border-gray-700 text-emerald-400' : 'bg-gray-950 border-gray-900 text-gray-500'}`}
                      >
                        JSON
                      </button>
                   </div>
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                   <div className="flex items-center gap-2 text-emerald-400">
                      <Zap className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{isZh ? "包含构建加速" : "Acceleration Included"}</span>
                   </div>
                   <p className="text-[9px] text-gray-500 leading-relaxed">
                     {isZh ? "流水线已自动配置 DDC / Cache Server 及 Incremental Build 支持。" : "Pipeline auto-configured with DDC/Cache Server and Incremental Build flags."}
                   </p>
                </div>

                <button 
                  onClick={() => addToast(isZh ? "配置文件已导出" : "Configuration exported successfully", "success")}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isZh ? "下载配置文件" : "Download Config"}
                </button>
              </div>

              <div className="col-span-2">
                 <div className="bg-gray-950 rounded-2xl border border-gray-850 overflow-hidden flex flex-col h-full">
                    <div className="px-4 py-2 bg-gray-900 border-b border-gray-850 flex items-center justify-between">
                       <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Preview: {exportPlatform === 'github' ? '.github/workflows/build.yml' : 'Jenkinsfile'}</span>
                       <button 
                        onClick={() => {
                          navigator.clipboard.writeText(exportPlatform === 'github' ? "name: Build\non: [push]\njobs:\n  build:\n    runs-on: self-hosted\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build Project\n        run: ./build.sh" : "pipeline {\n    agent any\n    stages {\n        stage('Build') {\n            steps {\n                sh './build.sh'\n            }\n        }\n    }\n}")
                          addToast(isZh ? "已复制到剪贴板" : "Copied to clipboard", "success")
                        }}
                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase"
                       >
                         Copy
                       </button>
                    </div>
                    <div className="p-4 font-mono text-[11px] leading-relaxed flex-1 overflow-y-auto">
                       {exportPlatform === 'github' ? (
                         <div className="space-y-1">
                           <div className="text-indigo-400">name: <span className="text-emerald-400">"{projectType === 'unity' ? 'Unity Build' : 'Unreal Cook'}"</span></div>
                           <div className="text-indigo-400">on:</div>
                           <div className="pl-4 text-gray-400">push:</div>
                           <div className="pl-8 text-gray-400">branches: [ main ]</div>
                           <div className="text-indigo-400">jobs:</div>
                           <div className="pl-4 text-indigo-400">build:</div>
                           <div className="pl-8 text-indigo-400">runs-on: <span className="text-emerald-400">self-hosted-runner</span></div>
                           <div className="pl-8 text-indigo-400">steps:</div>
                           <div className="pl-12 text-gray-400">- uses: actions/checkout@v3</div>
                           <div className="pl-12 text-gray-400">- name: <span className="text-emerald-400">Build Project</span></div>
                           <div className="pl-16 text-gray-400">run: <span className="text-amber-400">./build_{projectType}.sh --accel --clean</span></div>
                         </div>
                       ) : (
                         <div className="space-y-1">
                           <div className="text-indigo-400">pipeline <span className="text-gray-400">{"{"}</span></div>
                           <div className="pl-4 text-indigo-400">agent <span className="text-emerald-400">any</span></div>
                           <div className="pl-4 text-indigo-400">stages <span className="text-gray-400">{"{"}</span></div>
                           <div className="pl-8 text-indigo-400">stage(<span className="text-emerald-400">'Build'</span>) <span className="text-gray-400">{"{"}</span></div>
                           <div className="pl-12 text-indigo-400">steps <span className="text-gray-400">{"{"}</span></div>
                           <div className="pl-16 text-gray-400">sh <span className="text-amber-400">'./build_{projectType}.sh'</span></div>
                           <div className="pl-12 text-gray-400">{"}"}</div>
                           <div className="pl-8 text-gray-400">{"}"}</div>
                           <div className="pl-4 text-gray-400">{"}"}</div>
                           <div className="text-gray-400">{"}"}</div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Cache & Accelerator */}
        {activeSection === "cache" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  {isZh ? "分布式构建缓存与资源加速管理" : "Distributed Build Cache & Resource Accelerator"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "整合 Unity Accelerator 及 Unreal Engine 共享 DDC，大幅消减首次着色器编译与美术资源导入开销" 
                    : "Integrates Unity Accelerator & Unreal shared DDC to drastically shave off initial Shader compiling and Asset importing overhead."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{isZh ? "开启分布式加速:" : "Enable distributed accel:"}</span>
                <button
                  onClick={() => setAccEnabled(!accEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${accEnabled ? "bg-indigo-600" : "bg-gray-800"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${accEnabled ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Settings Form */}
              <div className="space-y-4 bg-gray-950/50 p-4 border border-gray-850 rounded-xl">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{isZh ? "缓存服务器配置" : "Cache Node Configuration"}</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "技术栈上下文" : "Stack Context"}</label>
                    <select
                      value={cacheEngine}
                      onChange={(e) => setCacheEngine(e.target.value as any)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="unity_acc">Unity Accelerator (Local Cache Hub)</option>
                      <option value="unreal_ddc">Unreal FastDDC / Shared S3 Backend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "节点 IP 地址" : "Endpoint Host"}</label>
                    <input
                      type="text"
                      defaultValue="10.128.24.112:5000"
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "缓存淘汰机制 (TTL)" : "Cache Expiry (TTL)"}</label>
                    <select
                      defaultValue="30days"
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="15days">15 Days (Aggressive Clean)</option>
                      <option value="30days">30 Days (Recommended)</option>
                      <option value="90days">90 Days (Enterprise Storage)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleWarmCache}
                    disabled={isWarmingCache || !accEnabled}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`h-3 w-3 ${isWarmingCache ? "animate-spin" : ""}`} />
                    <span>{isWarmingCache ? (isZh ? "预热中..." : "Warming...") : (isZh ? "立即缓存预热" : "Warm Cache")}</span>
                  </button>

                  <button
                    onClick={() => {
                      addToast(isZh ? "已成功清空本地分布式构建缓存" : "Successfully purged local compilation cache", "info");
                    }}
                    className="px-3 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-gray-100 text-xs font-semibold rounded transition-colors"
                  >
                    {isZh ? "清理本地" : "Purge Local"}
                  </button>
                </div>
              </div>

              {/* Status Display Area */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex flex-col justify-between h-20">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "网络吞吐率" : "Throughput"}</span>
                    <span className="text-base font-bold text-indigo-400 font-mono">1.2 Gbps</span>
                  </div>
                  <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex flex-col justify-between h-20">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "缓存命中率" : "Cache Hit Rate"}</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{acceleratorHitRate.toFixed(1)}%</span>
                  </div>
                  <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex flex-col justify-between h-20">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "累计节省时长" : "Total Time Saved"}</span>
                    <span className="text-base font-bold text-purple-400 font-mono">248.5 hrs</span>
                  </div>
                </div>

                {/* Hit Rate Trend Area Chart */}
                <div className="bg-gray-950/30 border border-gray-850 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isZh ? "缓存分时段命中率趋势与DDC负载" : "Hourly Cache Hit Rate & DDC Load"}</h5>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {isZh ? "效率提升 73%" : "73% efficiency lift"}
                    </span>
                  </div>
                  
                  <div className="h-36 w-full -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cacheMetrics}>
                        <defs>
                          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                        <ChartTooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="hit" name={isZh ? "缓存命中率 (%)" : "Hit Rate (%)"} stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Cache Clear Helper (Enterprise Feature) */}
            <div className="bg-gray-950/50 border border-gray-850 p-5 rounded-xl space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-900 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-400" />
                    {isZh ? "快速构建缓存清理指令助手" : "Quick Cache Clear Helper"}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {isZh 
                      ? "提供当前项目专属的 Jenkins 工作区、本地引擎目录及共享 DDC 节点的一键安全清理脚本" 
                      : "Generates custom CLI scripts for clearing Jenkins work dirs, engine cache registries, and DDC hubs."}
                  </p>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-950 text-indigo-400 font-mono border border-indigo-900 uppercase font-semibold">
                  DevOps Studio Admin
                </span>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Platform Selection */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">
                    {isZh ? "目标 Shell 终端类型:" : "Target CLI Shell Platform:"}
                  </span>
                  <div className="flex bg-gray-950 border border-gray-900 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setCleanPlatform("bash")}
                      className={`flex-1 py-1.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                        cleanPlatform === "bash" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Bash (.sh)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCleanPlatform("powershell")}
                      className={`flex-1 py-1.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                        cleanPlatform === "powershell" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      PowerShell (.ps1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCleanPlatform("cmd")}
                      className={`flex-1 py-1.5 rounded-md font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                        cleanPlatform === "cmd" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      Command Prompt (.cmd)
                    </button>
                  </div>
                </div>

                {/* Scope Selection */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">
                    {isZh ? "缓存路径物理节点上下文:" : "Target Path Context Scope:"}
                  </span>
                  <div className="flex bg-gray-950 border border-gray-900 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setCleanContext("jenkins")}
                      className={`flex-1 py-1.5 rounded-md font-semibold text-[10px] transition-all cursor-pointer ${
                        cleanContext === "jenkins" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {isZh ? "CI 服务器" : "Jenkins Server"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCleanContext("local")}
                      className={`flex-1 py-1.5 rounded-md font-semibold text-[10px] transition-all cursor-pointer ${
                        cleanContext === "local" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {isZh ? "本地开发机" : "Local Dev"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCleanContext("ddc_hub")}
                      className={`flex-1 py-1.5 rounded-md font-semibold text-[10px] transition-all cursor-pointer ${
                        cleanContext === "ddc_hub" ? "bg-indigo-600 text-white shadow font-bold" : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {isZh ? "共享 DDC" : "DDC / Accelerator"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-500">
                    {isZh ? "预生成的命令行指令:" : "Pre-Generated CLI Command Script:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getPurgeCommand(projectType, cleanPlatform, cleanContext));
                      addToast(isZh ? "脚本命令已成功复制到剪贴板！" : "Script copied to clipboard!", "success");
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{isZh ? "复制代码" : "Copy Command"}</span>
                  </button>
                </div>
                <div className="bg-gray-950 border border-gray-900 rounded-lg p-3 font-mono text-[10px] text-gray-300 overflow-x-auto whitespace-pre leading-relaxed relative group font-semibold">
                  {getPurgeCommand(projectType, cleanPlatform, cleanContext)}
                </div>
              </div>

              {/* Simulation Terminal */}
              <div className="pt-2 flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePurge}
                  disabled={isPurging}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw className={`h-4 w-4 ${isPurging ? "animate-spin" : ""}`} />
                  <span>{isPurging ? (isZh ? "正在执行清理..." : "Purging Cache...") : (isZh ? "一键模拟安全清理" : "Simulate Live Cache Clear")}</span>
                </button>

                {purgeTerminalLogs.length > 0 && (
                  <div className="flex-1 space-y-1.5 animate-in fade-in duration-200">
                    <div className="p-2.5 bg-black border border-gray-850 rounded-lg max-h-32 overflow-y-auto font-mono text-[9px] text-emerald-400 space-y-0.5">
                      {purgeTerminalLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          <span className="text-gray-600 mr-1.5">[{idx + 1}]</span>
                          <span className="break-all">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Section 2: Scaling & Licenses */}
        {activeSection === "scaling" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-400" />
                  {isZh ? "动态构建集群扩缩容与 Unity 许可证池分配" : "Dynamic Build Farm Auto-scaling & Unity License Orchestrator"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "基于 Kubernetes 的容器化节点按需拉起与 Unity Pro/Enterprise 许可证动态回收借用，彻底消解忙时排队并防止浪费" 
                    : "Kubernetes containerized worker dynamic provisioning and automatic Unity license seating leasing / returning, mitigating queue bottleneck and avoiding cost leak."}
                </p>
              </div>

              <div className="flex bg-gray-950 border border-gray-850 p-1 rounded-lg">
                <button
                  onClick={() => {
                    setK8sPods(p => Math.max(2, p - 4));
                    addToast(isZh ? "手动触发集群缩容，释放多余 Pod 资源" : "Manually scaled down cluster. Releasing unused pods.", "info");
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-900 border border-gray-800 hover:text-gray-100 rounded-md transition-all text-gray-400"
                >
                  {isZh ? "缩容 -4" : "Scale Down -4"}
                </button>
                <button
                  onClick={() => {
                    setK8sPods(p => Math.min(32, p + 4));
                    addToast(isZh ? "手动触发弹性扩容，拉起配有最新引擎镜像的干净 Pod" : "Manually scaled up cluster. Provisioning container workers.", "info");
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all ml-1"
                >
                  {isZh ? "扩容 +4" : "Scale Up +4"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* License Lease Orchestrator */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-amber-500" />
                    {isZh ? "Unity Pro 许可证动态租赁状态" : "Unity Pro/Enterprise Floating License Seats"}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded">
                    {isZh ? `空闲席位: ${5 - activeLeases.length} / 5` : `Free seats: ${5 - activeLeases.length} / 5`}
                  </span>
                </div>

                <div className="border border-gray-850 rounded-xl overflow-hidden bg-gray-950/20">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-gray-900/50 border-b border-gray-850">
                      <tr>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "许可证代号" : "Seat Token ID"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "承载节点" : "Leaser Node"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "租借时间" : "Leased Time"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase text-right">{isZh ? "状态/操作" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {activeLeases.map((lease) => (
                        <tr key={lease.id} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-gray-300">{lease.id}</td>
                          <td className="px-4 py-2.5 text-gray-400 font-mono">{lease.host}</td>
                          <td className="px-4 py-2.5 text-gray-400 font-mono">{lease.rentedAt}</td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              onClick={() => handleReturnLicense(lease.id)}
                              className="text-[10px] text-rose-400 hover:text-gray-100 px-2 py-1 rounded hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
                            >
                              {isZh ? "解绑回收" : "Revoke / Return"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {activeLeases.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-gray-500 font-mono italic">
                            {isZh ? "没有活动许可证正在被租借。闲置中。" : "No licenses leased. All seats are free."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRentLicense}
                    disabled={activeLeases.length >= 5 || isLeasingLicense}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLeasingLicense ? "animate-spin" : ""}`} />
                    {isZh ? "租借并激活新席位 (-activateLicense)" : "Lease and Activate Seat (-activateLicense)"}
                  </button>
                </div>
              </div>

              {/* K8s Log Terminal Output */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  {isZh ? "集群弹性扩容及认证终端日志" : "Cluster Scaler & CLI Shell"}
                </h4>

                <div className="bg-gray-950/90 p-4 rounded-xl border border-gray-850 font-mono text-[10px] text-gray-300 h-56 overflow-y-auto space-y-2">
                  <div className="text-gray-500">// Kubernetes Cluster HorizontalPodAutoscaler logs</div>
                  <div>[11:15:32] CPU Load averages exceeded 85% on static pool. Trigerring AutoScaler.</div>
                  <div>[11:15:33] HPA: Creating pod template: unity-editor:2022.3.20f1c1-android</div>
                  <div>[11:15:35] Pod successfully deployed on node-group-us-east4. Initializing workspace sync...</div>
                  {licenseTerminal.map((log, i) => (
                    <div key={i} className="text-emerald-400">{log}</div>
                  ))}
                  <div className="animate-pulse text-indigo-400">_</div>
                </div>

                <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-gray-400">{isZh ? "当前 K8s 活动构建容器数量:" : "Active dynamic container slots:"}</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{k8sPods} Pods</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl space-y-3">
                     <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "自动扩缩历史" : "Auto-Scaling History"}</h5>
                     <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={scalingHistory}>
                              <defs>
                                <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="time" hide />
                              <ChartTooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1f2937' }} />
                              <Area type="stepAfter" dataKey="nodes" name={isZh ? "活动节点数" : "Active Nodes"} stroke="#10b981" fill="url(#colorNodes)" strokeWidth={2} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                  <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl space-y-3">
                     <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "扩缩效率评估" : "Scaling Efficiency"}</h5>
                     <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={scalingHistory}>
                              <XAxis dataKey="time" hide />
                              <ChartTooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1f2937' }} />
                              <Bar dataKey="efficiency" name={isZh ? "资源利用率 (%)" : "Resource Util (%)"} fill="#6366f1" radius={[2, 2, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                </div>

                <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex flex-col justify-between min-h-[80px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "当前预测" : "Current Forecast"}</span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">High Traffic Expected</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {isZh ? "基于历史趋势，预计未来 2 小时构建负载将增加 25%，建议保持 4 个冗余节点。" : "Based on historical trends, build load is expected to increase by 25% in the next 2 hours. Maintaining 4 standby nodes recommended."}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Section 3: Package Diff */}
        {activeSection === "diff" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-indigo-400" />
                  {isZh ? "多版本包体清单大小差异比对分析 (Size Regressions)" : "Granular Build Size & Manifest Regression Engine"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "输入或上传两个不同构建版本的包内文件结构清单 (File Manifest)，对比分析细粒度资产差异，深度捕获和预警包体大小退化" 
                    : "Input or upload file structure manifests of two builds to compute granular file-level deltas, identifying code DLL, audio, and texture size regressions."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadDemoManifests}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs rounded transition-colors"
                >
                  {isZh ? "加载示例清单" : "Load Demo Manifests"}
                </button>
                <button
                  onClick={handleComputeManifestDiff}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-md transition-all flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3 animate-pulse" />
                  <span>{isZh ? "计算并比对差异" : "Compute Manifest Diff"}</span>
                </button>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{isZh ? "基线版本清单 (Base Build Manifest JSON):" : "Base Build Manifest JSON:"}</span>
                  <span className="text-[9px] text-gray-600 font-mono">[{isZh ? "示例: [ { \"path\": \"...\", \"size\": 12.4 } ]" : "Format: [{\"path\": \"...\", \"size\": MB}]"}]</span>
                </div>
                <textarea
                  value={baseManifestInput}
                  onChange={(e) => setBaseManifestInput(e.target.value)}
                  placeholder='[
  { "path": "Assets/Textures/skybox_night.png", "size": 12.4 },
  { "path": "Assets/Audio/battle_theme.mp3", "size": 8.2 }
]'
                  className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-[10px] text-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-700 leading-normal"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{isZh ? "目标版本清单 (Target Build Manifest JSON):" : "Target Build Manifest JSON:"}</span>
                  <span className="text-[9px] text-gray-600 font-mono">[{isZh ? "示例: [ { \"path\": \"...\", \"size\": 44.8 } ]" : "Format: [{\"path\": \"...\", \"size\": MB}]"}]</span>
                </div>
                <textarea
                  value={targetManifestInput}
                  onChange={(e) => setTargetManifestInput(e.target.value)}
                  placeholder='[
  { "path": "Assets/Textures/skybox_night.png", "size": 44.8 },
  { "path": "Assets/Audio/battle_theme.mp3", "size": 8.2 },
  { "path": "Assets/Textures/hero_skin_gold.png", "size": 18.5 }
]'
                  className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-[10px] text-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-700 leading-normal"
                />
              </div>
            </div>

            {/* Results rendering */}
            {manifestDiffResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Stats cards and file table */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Stats overview */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "基线总大小" : "Base Total Size"}</span>
                      <span className="text-base font-mono font-bold text-gray-300">{manifestDiffResult.totalBase.toFixed(1)} MB</span>
                    </div>
                    <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "目标总大小" : "Target Total Size"}</span>
                      <span className="text-base font-mono font-bold text-gray-300">{manifestDiffResult.totalTarget.toFixed(1)} MB</span>
                    </div>
                    <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl flex flex-col justify-between">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">{isZh ? "包体增益变化" : "Net Size Change"}</span>
                      <span className={`text-base font-mono font-bold ${manifestDiffResult.delta > 10 ? "text-rose-400" : manifestDiffResult.delta < 0 ? "text-emerald-400" : "text-gray-300"}`}>
                        {manifestDiffResult.delta > 0 ? "+" : ""}{manifestDiffResult.delta.toFixed(1)} MB
                      </span>
                    </div>
                  </div>

                  {/* File diff list */}
                  <div className="bg-gray-950 border border-gray-850 rounded-xl overflow-hidden text-xs">
                    <div className="bg-gray-900/50 border-b border-gray-850 p-3 flex justify-between items-center">
                      <span className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">{isZh ? "包内资源细分对比列表" : "Detailed Asset-by-Asset Diff List"}</span>
                      <span className="text-[9px] text-gray-500 font-mono">Sorted by Size Change</span>
                    </div>
                    
                    <div className="divide-y divide-gray-850 max-h-72 overflow-y-auto">
                      {manifestDiffResult.files.map((file, i) => {
                        const isSevere = file.delta >= 5;
                        return (
                          <div key={i} className="p-3 hover:bg-gray-900/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-gray-200 truncate block select-all">{file.path}</span>
                                {isSevere && (
                                  <span className="px-1 py-0.5 rounded bg-rose-950/40 border border-rose-900/30 text-rose-400 text-[8px] font-bold flex items-center gap-0.5 shrink-0 animate-pulse">
                                    <AlertTriangle className="h-2 w-2" />
                                    <span>REGRESSION</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span>Base: <span className="font-mono">{file.baseSize.toFixed(1)} MB</span></span>
                                <span>•</span>
                                <span>Target: <span className="font-mono">{file.targetSize.toFixed(1)} MB</span></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                                file.status === "added" 
                                  ? "bg-indigo-950/30 text-indigo-400 border border-indigo-900/40" 
                                  : file.status === "removed" 
                                  ? "bg-rose-950/30 text-rose-400 border border-rose-900/40" 
                                  : file.status === "changed" 
                                  ? "bg-amber-950/30 text-amber-400 border border-amber-900/40"
                                  : "bg-gray-900 text-gray-500"
                              }`}>
                                {file.status}
                              </span>

                              <span className={`text-[11px] font-mono font-bold w-16 text-right ${
                                file.delta > 0 ? "text-rose-400" : file.delta < 0 ? "text-emerald-400" : "text-gray-500"
                              }`}>
                                {file.delta > 0 ? "+" : ""}{file.delta.toFixed(1)} MB
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Anomalies and safety check */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                      <ShieldAlert className="h-4 w-4" />
                      {isZh ? "包体积熔断机制与异常分析" : "Size Regressions & Guardrails"}
                    </h4>

                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {isZh 
                        ? "系统会监控单个资源文件增量是否触发阈值（默认限制单文件增量 > 5 MB）。超出阈值的项需经过美术总监签名释放后，CI/CD 发布流水线方能放行。"
                        : "Detects individual asset regressions exceeding +5 MB. Items flagged with REGRESSION must be optimized or overridden to clear production pipelines."}
                    </p>

                    <div className="space-y-2.5">
                      {manifestDiffResult.files.filter(f => f.delta >= 5).map((reg, idx) => (
                        <div key={idx} className="p-3 bg-red-950/15 border border-red-900/30 rounded-lg text-xs space-y-1">
                          <div className="flex items-center gap-1 text-red-400 font-semibold text-[11px]">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>{isZh ? "严重包体暴涨预警" : "Severe Size Regression Detected"}</span>
                          </div>
                          <p className="text-gray-400 font-mono text-[9px] break-all leading-normal">{reg.path}</p>
                          <div className="text-[10px] text-red-300 font-mono pt-0.5">
                            {isZh ? "体积增幅:" : "Delta Surge:"} <span className="font-bold">+{reg.delta.toFixed(1)} MB</span> ({isZh ? "已超过 5MB 限制" : "Exceeds 5.0MB threshold"})
                          </div>
                        </div>
                      ))}

                      {manifestDiffResult.files.filter(f => f.delta >= 5).length === 0 && (
                        <div className="p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-lg text-xs text-center text-emerald-400 space-y-1">
                          <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                          <p className="font-semibold">{isZh ? "合规审查通过" : "Manifest Compliance Cleared"}</p>
                          <p className="text-[10px] text-gray-500">{isZh ? "未检测到单资产体积严重退化异常" : "No asset file regression exceeded 5.0 MB"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Symbol Table Autoupload config */}
                  <div className="bg-gray-950/50 p-4 border border-gray-850 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">{isZh ? "符号表文件自动上传 (Symbol Table)" : "Automated Symbol Table Upload"}</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoUploadSymbols}
                          onChange={(e) => setAutoUploadSymbols(e.target.checked)}
                          className="rounded border-gray-750 text-indigo-600 focus:ring-0 cursor-pointer h-3 w-3"
                        />
                        <span className="text-[10px] text-gray-500">AUTO</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={symbolPlatform}
                        onChange={(e: any) => setSymbolPlatform(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 flex-1"
                      >
                        <option value="sentry">Sentry (dSYM / .so debug)</option>
                        <option value="bugly">Tencent Bugly Symbol</option>
                        <option value="crashlytics">Firebase Crashlytics</option>
                      </select>

                      <button
                        onClick={() => {
                          addToast(isZh ? `调试符号表文件已加密并上传至 ${symbolPlatform.toUpperCase()}` : `dSYM debug symbol uploaded to ${symbolPlatform.toUpperCase()}`, "success");
                        }}
                        className="px-3 py-1 bg-gray-900 hover:bg-gray-850 border border-gray-800 rounded text-gray-300 text-xs transition-colors"
                      >
                        {isZh ? "手动触发" : "Upload now"}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="border border-dashed border-gray-800 rounded-xl p-10 text-center space-y-3 max-w-lg mx-auto">
                <FileSearch className="h-8 w-8 text-gray-600 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-300">{isZh ? "等待清单比对指令" : "Waiting for Manifest Comparison"}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isZh 
                    ? "请在上方输入框粘贴两个版本的 JSON 文件列表，或者点击 '加载示例清单' 体验游戏工业级包体退化分析引擎。" 
                    : "Please paste or load the file structures in the inputs above, then trigger 'Compute Manifest Diff' to view the breakdown."}
                </p>
                <button
                  onClick={loadDemoManifests}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs rounded transition-colors"
                >
                  {isZh ? "加载演示清单" : "Load Demo Manifests"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Hot-update Delta & CDN */}
        {activeSection === "delta" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-400" />
                  {isZh ? "热更新补丁包增量计算与全球 CDN 预热" : "Advanced Hot-Update Delta Generation & CDN Pre-warming"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "基于 bsdiff / hdiffz 差分算法计算新旧 AssetBundle 的二进制补丁包，大幅消减下载量，并利用 API 预热全网 CDN 缓存" 
                    : "Leverages binary diffing (bsdiff/hdiffz) to calculate ultra slim .patch files from AssetBundle deltas, triggering proactive edge CDN node warming."}
                </p>
              </div>

              <div className="flex items-center bg-gray-950 border border-gray-850 p-1 rounded-lg">
                <button
                  onClick={() => setDeltaCompression("bsdiff")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    deltaCompression === "bsdiff"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  bsdiff
                </button>
                <button
                  onClick={() => setDeltaCompression("hdiffz")}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    deltaCompression === "hdiffz"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  hdiffz (v2)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Binary Diffing Slider Calc */}
              <div className="lg:col-span-6 space-y-4 bg-gray-950/40 p-5 border border-gray-850 rounded-xl">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{isZh ? "二进制差分效率计算器" : "Binary Delta Efficiency Calculator"}</h4>
                
                <div className="space-y-4">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>{isZh ? "新 AssetBundle 包总体积:" : "AssetBundle original volume:"}</span>
                      <strong className="font-mono text-gray-200">{sourceSize} MB</strong>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      value={sourceSize}
                      onChange={(e) => setSourceSize(Number(e.target.value))}
                      className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="text-xs space-y-2">
                    <span className="block text-gray-500 font-mono uppercase text-[10px]">{isZh ? "压缩级别" : "Diff Compression Level"}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {["fast", "normal", "ultra"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setPatchLevel(lvl as any)}
                          className={`py-1.5 border rounded text-[11px] font-bold uppercase transition-all ${
                            patchLevel === lvl
                              ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                              : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-indigo-900/30 bg-indigo-950/10 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-indigo-300 font-semibold">{isZh ? "生成二进制差分包 (.patch):" : "Calculated .patch file volume:"}</span>
                      <strong className="font-mono text-emerald-400 text-sm">
                        {(sourceSize * (patchLevel === "ultra" ? 0.04 : patchLevel === "normal" ? 0.08 : 0.15)).toFixed(1)} MB
                      </strong>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 border-t border-indigo-900/20 pt-2 font-mono">
                      <span>{isZh ? "带宽流量减免:" : "Bandwidth traffic saved:"}</span>
                      <span className="text-emerald-500">
                        {patchLevel === "ultra" ? "≈ 96.0% savings!" : patchLevel === "normal" ? "≈ 92.0% savings" : "≈ 85.0% savings"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CDN Pre-warming Nodes */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="h-4 w-4 text-emerald-500" />
                    {isZh ? "CDN 边缘节点一致性验证与缓存预热" : "Global CDN Edge Nodes Pre-warming"}
                  </h4>
                  <button
                    onClick={handleTriggerWarmup}
                    disabled={isWarmupTriggered && warmupProgress < 100}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    {isWarmupTriggered && warmupProgress < 100 ? (isZh ? "分发中..." : "Warming...") : (isZh ? "推送 CDN 缓存" : "Warmup CDN")}
                  </button>
                </div>

                {isWarmupTriggered && (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-400 font-mono text-[10px]">
                      <span>{isZh ? "缓存分发同步进度:" : "Propagation Sync Progress:"}</span>
                      <span className="font-bold text-indigo-400">{warmupProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-900 border border-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${warmupProgress}%` }} />
                    </div>
                  </div>
                )}

                <div className="border border-gray-850 rounded-xl overflow-hidden bg-gray-950/20 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-900/50 border-b border-gray-850">
                      <tr>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "边缘网络节点" : "Edge Location"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "响应延时" : "Latency"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase text-right">{isZh ? "缓存状态" : "Cache State"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {cdnNodes.map((node, i) => (
                        <tr key={i} className="hover:bg-gray-900/30 transition-colors font-mono">
                          <td className="px-4 py-2 text-gray-300">{node.region}</td>
                          <td className="px-4 py-2 text-gray-400">{node.ping}</td>
                          <td className="px-4 py-2 text-right">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isWarmupTriggered && warmupProgress >= 100 || node.status === "Active"
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                                : "bg-gray-900 text-gray-500 border border-gray-850"
                            }`}>
                              {isWarmupTriggered && warmupProgress >= 100 || node.status === "Active" ? "WARMED" : "READY"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* CDN Pre-warming Script Generator Helper */}
            <div className="bg-gray-950 border border-gray-850 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4.5 w-4.5 text-indigo-400" />
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans">
                    {isZh ? "CDN 缓存预热命令与配置生成器" : "CDN Cache Pre-warming Script Generator"}
                  </h4>
                </div>
                <div className="flex bg-gray-900 border border-gray-800 p-0.5 rounded-lg">
                  {(["cloudfront", "akamai", "aliyun"] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setCdnProvider(prov)}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        cdnProvider === prov
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {isZh ? "热更新补丁包分发 URL (Distribution URL):" : "Patch Distribution URL:"}
                  </label>
                  <input
                    type="text"
                    value={cdnDistUrl}
                    onChange={(e) => setCdnDistUrl(e.target.value)}
                    placeholder="https://cdn.epicrealm.com/hotfix/v1.4.2/patch.pak"
                    className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    {isZh ? "即用型预热 Shell 脚本 (Ready-to-run curl script):" : "Ready-to-run Shell script:"}
                  </span>
                  <div className="relative">
                    <pre className="bg-gray-950/80 p-4 rounded-lg border border-gray-850 font-mono text-[10px] text-gray-300 overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
                      {getPreWarmScript()}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPreWarmScript());
                        addToast(isZh ? "预热命令脚本已复制到剪贴板！" : "Pre-warm script copied to clipboard!", "success");
                      }}
                      className="absolute top-2.5 right-2.5 bg-gray-900/90 border border-gray-800 hover:border-indigo-500/50 text-[10px] font-bold text-gray-400 hover:text-indigo-400 px-2 py-1 rounded transition-all cursor-pointer"
                    >
                      {isZh ? "复制" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Section 5: Signing & Compliance */}
        {activeSection === "publishing" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Key className="h-5 w-5 text-indigo-400" />
                  {isZh ? "母包极速批量重签名与发布前合规安全审计" : "Master-Package Resigning & Privacy Compliance Scan"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "通过对无渠道 SDK 的纯净母包极速注入渠道参数和再签名（v2/v3双签），免去漫长的重编译周期，并自动阻断违规权限 API 调用" 
                    : "Injects channel configuration into pre-compiled master packages for dynamic v2/v3 signing, executing deep API static scans to prevent rejection."}
                </p>
              </div>

              <button
                onClick={handleBatchSigning}
                disabled={isBatchSigning}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isBatchSigning ? "animate-spin" : ""}`} />
                <span>{isBatchSigning ? (isZh ? "批量签名中..." : "Signing...") : (isZh ? "一键母包重签名" : "Batch Resign Master")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Channel Resigning progress */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{isZh ? "分渠道子包打包状态" : "Channel Sub-package Signing Pipeline"}</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {channels.map((ch) => (
                    <div key={ch.id} className="bg-gray-950/40 border border-gray-850 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <strong className="text-gray-300 block">{ch.name}</strong>
                        <span className="font-mono text-[9px] uppercase text-gray-500 bg-gray-900 px-1 py-0.5 rounded">{ch.suffix}</span>
                      </div>
                      
                      <div className="text-right space-y-1 font-mono">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          ch.status === "Signed"
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                            : "bg-gray-900 text-gray-500 border border-gray-850 animate-pulse"
                        }`}>
                          {ch.status}
                        </span>
                        <div className="text-[9px] text-gray-500">{ch.duration !== "-" ? `took ${ch.duration}` : "queued"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Scan Check results */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                  <ShieldAlert className="h-4 w-4" />
                  {isZh ? "SDK 隐私特权与应用宝安全合规规则校验" : "Privacy API Call & Store Audits"}
                </h4>

                <div className="space-y-3">
                  {complianceResults.map((rule) => (
                    <div key={rule.id} className="bg-gray-950/40 border border-gray-850 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-300">{rule.label}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          rule.result === "Pass"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30"
                            : "bg-amber-950/40 text-amber-400 border-amber-900/30"
                        }`}>
                          {rule.result === "Pass" ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3 animate-pulse" />}
                          {rule.result}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{rule.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Section 6: ML & Cloud Device Testing */}
        {activeSection === "ml" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  {isZh ? "端侧 AI 智能体模型量化压缩与云端兼容性兼容测试" : "ML Agent Model Quantization & Cloud Test Lab"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "自动对 StreamingAssets 模型进行 FP32 -> INT8/FP16 量化，缩减 75% 体积并翻倍运行帧率，最后自动部署并拉起云端测试" 
                    : "Compresses PyTorch/ONNX agent models from FP32 to INT8, slashing disk size by 75%, and triggers end-to-end device smoke tests."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono text-[10px]">{modelType}</span>
                <button
                  onClick={handleQuantize}
                  disabled={isQuantizing}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded transition-colors"
                >
                  {isQuantizing ? (isZh ? "量化中..." : "Quantizing...") : (isZh ? "自动压缩模型" : "Quantize Model")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Quantization Stats */}
              <div className="lg:col-span-5 bg-gray-950/40 border border-gray-850 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{isZh ? "量化效能对比" : "Model Compression Metrics"}</h4>
                
                {quantizedStats && (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-gray-850">
                      <span className="text-gray-500">{isZh ? "原始大小 (FP32)" : "Original Size (FP32)"}</span>
                      <span className="font-mono font-bold text-gray-300">{quantizedStats.originalSize}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-850">
                      <span className="text-gray-500">{isZh ? "量化后大小 (INT8)" : "Quantized Size (INT8)"}</span>
                      <span className="font-mono font-bold text-indigo-400">{quantizedStats.quantizedSize}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-850">
                      <span className="text-gray-500">{isZh ? "包体体积缩减" : "Disk Footprint Reduction"}</span>
                      <span className="font-mono font-bold text-emerald-400">{quantizedStats.reduction}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-850">
                      <span className="text-gray-500">{isZh ? "设备侧推理平均延时" : "Edge Latency (Inference)"}</span>
                      <span className="font-mono font-bold text-purple-400">{quantizedStats.latency}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">{isZh ? "移动端运行帧率提升" : "Mobile FPS Performance"}</span>
                      <span className="font-mono font-bold text-amber-400">{quantizedStats.fpsBoost}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cloud Test Lab devices sweep */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    {isZh ? "多款真机回归与兼容性跑测" : "Cloud Test Lab Compatibility Smoke Swaps"}
                  </h4>
                  <button
                    onClick={handleTriggerDeviceTests}
                    disabled={isTestingDevices}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    {isTestingDevices ? (isZh ? "跑测中..." : "Testing...") : (isZh ? "启动回归测试" : "Run Smoke Sweeps")}
                  </button>
                </div>

                <div className="border border-gray-850 rounded-xl overflow-hidden bg-gray-950/20 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-900/50 border-b border-gray-850">
                      <tr>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "真机型号" : "Model"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "操作系统" : "OS Level"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase">{isZh ? "帧率 / 温度" : "Performance"}</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase text-right">{isZh ? "状态" : "Result"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {devices.map((dev, i) => (
                        <tr key={i} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-4 py-2 font-bold text-gray-300">{dev.name}</td>
                          <td className="px-4 py-2 text-gray-500 font-mono text-[10px]">{dev.os} ({dev.type})</td>
                          <td className="px-4 py-2 text-gray-400 font-mono text-[10px]">{dev.fps} FPS / {dev.temp}</td>
                          <td className="px-4 py-2 text-right">
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              dev.status === "Passed"
                                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                                : "bg-gray-900 text-gray-500 border border-gray-850 animate-pulse"
                            }`}>
                              {dev.status === "Passed" ? <Check className="h-2.5 w-2.5" /> : null}
                              {dev.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          </div>
        )}

        {activeSection === "naming" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-400" />
                  {isZh ? "包体动态命名与版本更新闭环系统" : "Package Naming & Version Sync Closed-Loop"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? "自动生成符合企业级规范的文件命名格式，跨平台、跨渠道自动同步构建版本，并自动生成构建后重命名 Hook 脚本" 
                    : "Standardize file naming conventions, sync multi-channel versions, and generate automatic renaming post-build hooks."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerSync}
                  disabled={syncStatus === "syncing"}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow shadow-indigo-600/30"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                  {syncStatus === "syncing" 
                    ? (isZh ? "正在计算闭环同步..." : "Syncing...") 
                    : (isZh ? "一键执行闭环同步" : "Run Auto Sync")}
                </button>
              </div>
            </div>

            {/* Formula & Pattern Builder Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form configs */}
              <div className="lg:col-span-5 bg-gray-950/40 border border-gray-850 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">{isZh ? "变量配置与规则定义" : "Naming System Variables"}</h4>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "项目名称 (Project Name)" : "Project Name"}</label>
                    <input
                      type="text"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "主版本号 (Version)" : "Version"}</label>
                      <input
                        type="text"
                        value={semVer}
                        onChange={(e) => setSemVer(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "编译号 (Build No)" : "Build Number"}</label>
                      <input
                        type="text"
                        value={buildNum}
                        onChange={(e) => setBuildNum(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "目标平台 (Platform)" : "Platform"}</label>
                      <select
                        value={namingPlatform}
                        onChange={(e: any) => setNamingPlatform(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        <option value="Android">Android</option>
                        <option value="iOS">iOS</option>
                        <option value="Windows">Windows</option>
                        <option value="macOS">macOS</option>
                        <option value="Linux">Linux</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "发行渠道 (Channel)" : "Channel"}</label>
                      <input
                        type="text"
                        value={namingChannel}
                        onChange={(e) => setNamingChannel(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "版本递增闭环策略" : "Auto-Increment Rule"}</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <button
                        onClick={() => setNamingRule("manual")}
                        className={`py-1.5 rounded text-center border font-mono font-medium transition-all ${
                          namingRule === "manual"
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                            : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {isZh ? "手动设定" : "Manual"}
                      </button>
                      <button
                        onClick={() => setNamingRule("semver_patch")}
                        className={`py-1.5 rounded text-center border font-mono font-medium transition-all ${
                          namingRule === "semver_patch"
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                            : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {isZh ? "自动补丁号" : "+1 Patch"}
                      </button>
                      <button
                        onClick={() => setNamingRule("timestamp")}
                        className={`py-1.5 rounded text-center border font-mono font-medium transition-all ${
                          namingRule === "timestamp"
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                            : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {isZh ? "时间戳追加" : "Timestamp"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">{isZh ? "命名格式算式 (Naming Formula)" : "Naming Formula Pattern"}</label>
                    <input
                      type="text"
                      value={namingFormula}
                      onChange={(e) => setNamingFormula(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
                    />
                    
                    {/* Token helper buttons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[9px] text-gray-500 self-center">{isZh ? "快速变量:" : "Tokens:"}</span>
                      {["{project}", "{platform}", "{channel}", "{version}", "{build}", "{datetime}"].map((token) => (
                        <button
                          key={token}
                          onClick={() => {
                            if (!namingFormula.includes(token)) {
                              setNamingFormula(prev => prev + (prev ? "_" : "") + token);
                            }
                          }}
                          className="px-1.5 py-0.5 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-gray-200 font-mono text-[9px] rounded border border-gray-800"
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Live Preview & Code Gen */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Live rendered name card */}
                <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase font-mono">{isZh ? "最终输出包体命名预览" : "Package Output File Name Live Preview"}</span>
                    <span className="text-[9px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-mono px-1.5 py-0.5 rounded-full font-bold">UTC Static</span>
                  </div>
                  <div className="bg-gray-950/40 p-3 rounded-lg border border-gray-850 flex items-center justify-between font-mono text-xs text-gray-200">
                    <span className="select-all break-all">{renderFormattedName()}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(renderFormattedName());
                        addToast(isZh ? "已复制命名到剪切板" : "Copied name to clipboard", "success");
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold ml-2 underline focus:outline-none shrink-0"
                    >
                      {isZh ? "复制" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Automation Log terminal */}
                {syncLog.length > 0 && (
                  <div className="bg-gray-950/60 border border-gray-850 rounded-xl p-4 font-mono text-[11px] leading-relaxed space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-gray-500 text-[10px] uppercase border-b border-gray-850/50 pb-1.5 mb-2">
                      <span>{isZh ? "闭环同步进程日志" : "Synchronizer Process Console"}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {syncStatus === "syncing" ? "Active" : "Closed-Loop"}
                      </span>
                    </div>
                    <div className="max-h-[120px] overflow-y-auto space-y-0.5 text-gray-400">
                      {syncLog.map((log, index) => (
                        <p key={index} className={log.includes("SUCCESS") || log.includes("closed") ? "text-emerald-400 font-bold" : ""}>{log}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Code Hook generation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <FileCode className="h-4 w-4 text-indigo-400" />
                      {projectType === "unity" 
                        ? (isZh ? "Unity 自动化打包命名 C# 脚本" : "Unity Editor Automator C# Script") 
                        : (isZh ? "Unreal Engine 自动化包命名 Python 脚本" : "Unreal Automation Pipeline python")}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">{projectType === "unity" ? "AutoVersioningBuildHook.cs" : "unreal_naming_hook.py"}</span>
                  </div>

                  <div className="bg-gray-950 border border-gray-850 rounded-xl p-4 text-[11px] font-mono leading-relaxed max-h-[220px] overflow-y-auto">
                    {projectType === "unity" ? (
                      <pre className="text-gray-400">
{`using UnityEditor;
using System;
using System.IO;

public class AutoVersioningBuildHook {
    public static void PerformBuild() {
        // 1. 读取配置变量
        string projName = "${projName}";
        string version = "${semVer}";
        int buildNum = ${buildNum};
        string platform = "${namingPlatform}";
        string channel = "${namingChannel}";
        string dateStr = DateTime.UtcNow.ToString("yyyyMMdd");

        // 2. 闭环同步 Unity PlayerSettings
        PlayerSettings.bundleVersion = version;
        PlayerSettings.Android.bundleVersionCode = buildNum;
        PlayerSettings.iOS.buildNumber = buildNum.ToString();

        // 3. 构建目标输出路径与命名
        string outputDir = "Builds/" + platform;
        Directory.CreateDirectory(outputDir);
        string outputFilename = \`\${projName}_\${platform}_\${channel}_v\${version}_b\${buildNum}_\${dateStr}\` + (platform == "Android" ? (channel == "GooglePlay" ? ".aab" : ".apk") : ".ipa");
        string fullPath = Path.Combine(outputDir, outputFilename);

        // 4. 执行构建
        BuildPlayerOptions options = new BuildPlayerOptions();
        options.scenes = new[] { "Assets/Scenes/Main.unity" };
        options.locationPathName = fullPath;
        options.target = BuildTarget.Android;
        options.options = BuildOptions.None;

        var report = BuildPipeline.BuildPlayer(options);
        if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded) {
            Console.WriteLine("[Success] Closed-loop naming file saved: " + fullPath);
        }
    }
}`}
                      </pre>
                    ) : (
                      <pre className="text-gray-400">
{`import unreal
import os
import datetime

def run_unreal_auto_versioning():
    # 1. 自动化管线参数
    project_name = "${projName}"
    version = "${semVer}"
    build_num = "${buildNum}"
    platform = "${namingPlatform}"
    channel = "${namingChannel}"
    date_str = datetime.datetime.utcnow().strftime("%Y%m%d")

    # 2. 闭环同步修改 Config/DefaultGame.ini 配置
    ini_path = os.path.join(unreal.Paths.project_dir(), "Config/DefaultGame.ini")
    with open(ini_path, "r") as f:
        lines = f.readlines()
    
    with open(ini_path, "w") as f:
        for line in lines:
            if line.startswith("ProjectVersion="):
                f.write(f"ProjectVersion={version}\\n")
            elif line.startswith("ProjectVersionCode="):
                f.write(f"ProjectVersionCode={build_num}\\n")
            else:
                f.write(line)

    # 3. 计算最终打包输出文件名称
    output_dir = os.path.join(unreal.Paths.project_dir(), "Saved/StagedBuilds")
    target_name = f"{project_name}_{platform}_{channel}_v{version}_b{build_num}_{date_str}.apk"
    print(f"[Success] Unreal auto rename file hook finalized. Out package: {target_name}")

if __name__ == '__main__':
    run_unreal_auto_versioning()`}
                      </pre>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Section 8: Dependency Auditor */}
        {activeSection === "dependency" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-indigo-400" />
                  {isZh ? "第三方依赖 & 引擎插件漏洞安全审计" : "Third-Party Dependencies & Plugins Security Auditor"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isZh 
                    ? `深度扫描游戏工程中的三方包引用及插件依赖（支持 Unity manifest.json / Unreal Module），发现已知 CVE 漏洞与低版本安全风险。` 
                    : `Deep scans package manifests (Unity manifest.json or Unreal Build Tool dependencies) to trace and analyze plugin CVE vulnerabilities.`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={runAuditScan}
                  disabled={depScanStatus === "scanning"}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow shadow-indigo-600/20"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${depScanStatus === "scanning" ? "animate-spin" : ""}`} />
                  <span>{depScanStatus === "scanning" ? (isZh ? "深度审计扫描中..." : "Scanning...") : (isZh ? "开始安全审计扫描" : "Start Audit Scan")}</span>
                </button>

                {dependenciesList.some(d => d.status !== "ok") && (
                  <button
                    onClick={handleRemediateAll}
                    className="px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isZh ? "一键合规修复/升级" : "One-Click Safe Upgrade"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dashboard stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono text-gray-500 block font-semibold">{isZh ? "总依赖组件/插件" : "Total Monitored Modules"}</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block font-mono">{dependenciesList.length}</span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {projectType === "unity" ? "manifest.json + AssemblyRefs" : "uproject + Build.cs target modules"}
                </span>
              </div>
              
              <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono text-gray-500 block font-semibold">{isZh ? "高危/严重漏洞" : "High/Critical Vulns"}</span>
                <span className={`text-2xl font-bold mt-1 block font-mono ${dependenciesList.some(d => d.severity === "high" || d.severity === "critical") ? "text-rose-500" : "text-emerald-400"}`}>
                  {dependenciesList.filter(d => d.severity === "high" || d.severity === "critical").length}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {isZh ? "触发最高优先级的安全合规拦截" : "Triggers immediate pipeline block on production"}
                </span>
              </div>

              <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono text-gray-500 block font-semibold">{isZh ? "中危/过时组件" : "Outdated / Medium Risk"}</span>
                <span className="text-2xl font-bold text-amber-500 mt-1 block font-mono">
                  {dependenciesList.filter(d => d.status === "outdated" || d.severity === "medium").length}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {isZh ? "建议在常规版本迭代中合并升级" : "Recommended optimization in next sprint cycle"}
                </span>
              </div>

              <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono text-gray-500 block font-semibold">{isZh ? "审计合规健康分" : "Audit Compliance Score"}</span>
                <span className={`text-2xl font-bold mt-1 block font-mono ${
                  dependenciesList.some(d => d.severity === "critical") ? "text-rose-500" :
                  dependenciesList.some(d => d.severity === "high") ? "text-red-400" :
                  dependenciesList.some(d => d.severity === "medium") ? "text-amber-500" : "text-emerald-400"
                }`}>
                  {dependenciesList.some(d => d.severity === "critical") ? "35/100" :
                   dependenciesList.some(d => d.severity === "high") ? "60/100" :
                   dependenciesList.some(d => d.severity === "medium") ? "85/100" : "100/100"}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {dependenciesList.some(d => d.status !== "ok") ? (isZh ? "⚠️ 存在安全合规风险点" : "⚠️ Needs urgent remediation") : (isZh ? "✓ 全网安全合规检测通过" : "✓ Secure & compliant")}
                </span>
              </div>
            </div>

            {/* Scan Process Log Terminal */}
            {depScanLog.length > 0 && (
              <div className="bg-gray-950/60 border border-gray-850 rounded-xl p-4 font-mono text-[11px] leading-relaxed space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-[10px] uppercase border-b border-gray-850/50 pb-1.5 mb-2">
                  <span>{isZh ? "依赖合规扫描器控制台" : "Dependency Audit Engine Console"}</span>
                  <span className="text-indigo-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    {depScanStatus === "scanning" ? "Active Scan" : "Completed"}
                  </span>
                </div>
                <div className="max-h-[140px] overflow-y-auto space-y-0.5 text-gray-400">
                  {depScanLog.map((log, index) => (
                    <p key={index} className={log.includes("Alert") || log.includes("🛑") ? "text-rose-400" : log.includes("✓") || log.includes("completed") ? "text-emerald-400" : ""}>{log}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Dependency list table */}
            <div className="border border-gray-850 rounded-xl overflow-hidden bg-gray-950/20">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-900/50 border-b border-gray-850">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isZh ? "组件/插件包名" : "Package / Plugin Name"}</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isZh ? "当前版本" : "Current Version"}</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isZh ? "最新安全版本" : "Latest Secure"}</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isZh ? "漏洞状态" : "Vulnerability / Risk Details"}</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{isZh ? "风险级别" : "Risk Level"}</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">{isZh ? "修复操作" : "Remediation"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850">
                  {dependenciesList.map((dep) => (
                    <tr key={dep.name} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-gray-200">{dep.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                          {projectType === "unity" ? "com.unity.package" : "UnrealPluginEngineModule"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-300">{dep.version}</td>
                      <td className="px-4 py-3 text-xs font-mono text-emerald-400 font-semibold">{dep.latest}</td>
                      <td className="px-4 py-3 text-xs">
                        {dep.status === "vulnerable" ? (
                          <span className="text-rose-400 font-medium flex items-center gap-1.5 font-sans">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {dep.vuln}
                          </span>
                        ) : dep.status === "outdated" ? (
                          <span className="text-amber-500 font-medium flex items-center gap-1.5 font-sans">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {isZh ? "版本落后，建议升级" : "Outdated package version"}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium flex items-center gap-1.5 font-sans">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {isZh ? "合规、无漏洞" : "Fully Secure"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          dep.severity === "critical" ? "bg-purple-950/50 text-purple-400 border-purple-900/40" :
                          dep.severity === "high" ? "bg-rose-950/50 text-rose-400 border-rose-900/40" :
                          dep.severity === "medium" ? "bg-amber-950/50 text-amber-400 border-amber-900/40" :
                          dep.severity === "low" ? "bg-blue-950/50 text-blue-400 border-blue-900/40" :
                          "bg-emerald-950/50 text-emerald-400 border-emerald-900/40"
                        }`}>
                          {dep.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {dep.status !== "ok" ? (
                          <button
                            onClick={() => handleRemediateSingle(dep.name, dep.latest)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 text-[10px] font-bold rounded transition-all cursor-pointer"
                          >
                            {isZh ? "一键升级" : "Upgrade"}
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-[11px] font-semibold flex items-center justify-end gap-1 font-mono">
                            <Check className="h-3.5 w-3.5" />
                            {isZh ? "最新" : "OK"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Explanatory banner */}
            <div className="bg-indigo-950/10 border border-indigo-900/20 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-indigo-300">{isZh ? "合规与供应链漏洞防御机制 (DevSecOps)" : "Supply Chain Defense & DevSecOps Gate"}</h4>
                <p className="text-[11px] text-indigo-200/80 mt-1 leading-relaxed">
                  {isZh 
                    ? "通过在 CI/CD 中添加 Dependency Auditor，你可以配置漏洞阈值。若扫描发现 CRITICAL 或 HIGH 级别漏洞，管线将自动发出高危预警并拦截最终的 Production 母包构建，彻底防止供应链投毒及运行时远程代码执行注入。"
                    : "By adding the Dependency Auditor to your pipeline, you establish an automatic compliance gate. Any CRITICAL or HIGH risk plugins will immediately block public packaging to safeguard production binaries against dependency vulnerability injection."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
