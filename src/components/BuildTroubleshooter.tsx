import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { QUICK_ISSUES, LocalizedQuickIssue } from "../data";
import { BuildPlatform, DiagnosticResponse } from "../types";
import { useWorkspace } from "../WorkspaceContext";
import { 
  Wrench, 
  Sparkles, 
  AlertCircle, 
  Terminal, 
  ChevronRight, 
  Check, 
  Copy,
  Info,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  History,
  BarChart2,
  Download,
  Plus,
  Trash2,
  Clock,
  BookOpen
} from "lucide-react";
import KnowledgeBaseView from "./KnowledgeBaseView";
import ValgrindLeakDetector from "./ValgrindLeakDetector";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface BuildSession {
  id: string;
  timestamp: string;
  platform: string;
  duration: number; // in seconds
  status: "Success" | "Failure";
}

export default function BuildTroubleshooter() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>("ios-signing");
  const [customLog, setCustomLog] = useState("");
  const [targetPlatform, setTargetPlatform] = useState<BuildPlatform | "general">("general");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<DiagnosticResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { language, t } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [blueprintLog, setBlueprintLog] = useState("");
  const [blueprintAiLoading, setBlueprintAiLoading] = useState(false);
  const [blueprintAiResult, setBlueprintAiResult] = useState<DiagnosticResponse | null>(null);
  const [blueprintError, setBlueprintError] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBlueprintDiagnose = async () => {
    if (!blueprintLog.trim()) {
      setBlueprintError(isZh ? "请先粘贴蓝图构建报错日志。" : "Please paste a Blueprint build log first.");
      return;
    }

    setBlueprintAiLoading(true);
    setBlueprintError(null);
    setBlueprintAiResult(null);

    try {
      const response = await fetch("/api/ai-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorLog: `[UNREAL BLUEPRINT ERROR LOG]\n${blueprintLog}`, platform: "unreal", language }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || (isZh ? "解析蓝图日志失败。" : "Failed to analyze Blueprint log."));
      }

      const data = await response.json();
      setBlueprintAiResult(data);
    } catch (err: any) {
      setBlueprintError(err.message || (isZh ? "Gemini 无法解析蓝图日志。" : "Gemini was unable to parse Blueprint logs."));
    } finally {
      setBlueprintAiLoading(false);
    }
  };

  // Custom Event Listener to select diagnostic issue
  useEffect(() => {
    const handleSelectIssue = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedIssueId(customEvent.detail);
      }
    };
    
    const handleDiagnoseLog = (e: Event) => {
      const customEvent = e as CustomEvent<{ log: string; platform: string }>;
      if (customEvent.detail) {
        const { log, platform } = customEvent.detail;
        setCustomLog(log);
        setTargetPlatform(platform as any || "general");
        setDiagnoseMode("manual");
        setAiResult(null);
        setErrorMessage(null);
        
        // Auto-click the run-ai-diagnose-btn
        setTimeout(() => {
          const btn = document.getElementById("run-ai-diagnose-btn");
          if (btn) {
            btn.click();
          }
        }, 300);
      }
    };

    window.addEventListener("select-troubleshoot-issue", handleSelectIssue);
    window.addEventListener("diagnose-log", handleDiagnoseLog);
    return () => {
      window.removeEventListener("select-troubleshoot-issue", handleSelectIssue);
      window.removeEventListener("diagnose-log", handleDiagnoseLog);
    };
  }, []);

  // Local History Table States
  const [sessions, setSessions] = useState<BuildSession[]>([]);
  const [logPlatform, setLogPlatform] = useState<string>("ios");
  const [logDuration, setLogDuration] = useState<number>(240);
  const [logStatus, setLogStatus] = useState<"Success" | "Failure">("Success");
  
  // Load sessions on mount
  useEffect(() => {
    const stored = localStorage.getItem("devops_hub_build_sessions");
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    } else {
      const defaultSessions: BuildSession[] = [
        { id: "1", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), platform: "ios", duration: 312, status: "Failure" },
        { id: "2", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), platform: "android", duration: 245, status: "Success" },
        { id: "3", timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), platform: "webgl", duration: 420, status: "Failure" },
        { id: "4", timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), platform: "standalone", duration: 185, status: "Success" },
        { id: "5", timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), platform: "ios", duration: 290, status: "Success" },
      ];
      localStorage.setItem("devops_hub_build_sessions", JSON.stringify(defaultSessions));
      setSessions(defaultSessions);
    }
  }, []);

  const handleAddSession = (platform: string, duration: number, status: "Success" | "Failure") => {
    const newSession: BuildSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      platform,
      duration,
      status
    };
    setSessions(prev => {
      const updated = [newSession, ...prev].slice(0, 5); // Keep last 5 records
      localStorage.setItem("devops_hub_build_sessions", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem("devops_hub_build_sessions");
    setSessions([]);
  };

  const getChartData = () => {
    const platforms = ["android", "ios", "webgl", "standalone"];
    return platforms.map(plat => {
      const platSessions = sessions.filter(s => s.platform.toLowerCase() === plat.toLowerCase());
      const avg = platSessions.length > 0 
        ? Math.round(platSessions.reduce((acc, curr) => acc + curr.duration, 0) / platSessions.length)
        : 0;
      return {
        name: plat === "webgl" ? "WebGL" : plat === "ios" ? "iOS" : plat === "android" ? "Android" : "Standalone",
        "Avg Duration (sec)": avg || (plat === "ios" ? 301 : plat === "android" ? 245 : plat === "webgl" ? 420 : 185)
      };
    });
  };

  const handleExportDiagnostics = () => {
    const isZhLocale = language === "zh";
    let content = `==================================================\n`;
    content += isZhLocale ? `DEVOPS HUB STUDIO 智能打包诊断与修复报告\n` : `DEVOPS HUB STUDIO PACKAGING DIAGNOSTICS & REMEDIATION REPORT\n`;
    content += `==================================================\n`;
    content += `Timestamp: ${new Date().toLocaleString()}\n`;
    content += `Target Platform: ${(targetPlatform || "general").toUpperCase()}\n`;
    content += `--------------------------------------------------\n\n`;
    
    content += `[1] SOURCE CODES / LOG FILE PROVIDED:\n`;
    content += `--------------------------------------------------\n`;
    content += customLog ? customLog : `(No custom logs provided)\n`;
    content += `\n\n`;
    
    content += `[2] REMEDIATION BLUEPRINT:\n`;
    content += `--------------------------------------------------\n`;
    if (aiResult) {
      content += `Root Cause: ${aiResult.rootCause}\n\n`;
      content += `Detailed Explanation:\n${aiResult.explanation}\n\n`;
      content += `Remediation Steps:\n`;
      aiResult.steps.forEach((step, idx) => {
        content += `  ${idx + 1}. ${step}\n`;
      });
      if (aiResult.codeSnippet) {
        content += `\nSuggested Repair Code Snippet / Commands:\n`;
        content += `${aiResult.codeSnippet}\n`;
      }
    } else if (selectedIssue) {
      const selectedIssueObj = QUICK_ISSUES.find(i => i.id === selectedIssueId);
      if (selectedIssueObj) {
        const details = {
          title: isZhLocale ? selectedIssueObj.titleZh : selectedIssueObj.titleEn,
          summary: isZhLocale ? selectedIssueObj.summaryZh : selectedIssueObj.summaryEn,
          solution: isZhLocale ? selectedIssueObj.solutionZh : selectedIssueObj.solutionEn,
        };
        content += `Standard Issue Category: ${details.title}\n\n`;
        content += `Summary:\n${details.summary}\n\n`;
        content += `Step-by-Step Remediation Plan:\n${details.solution}\n`;
      } else {
        content += `No standard issue selected.\n`;
      }
    } else {
      content += `No active logs diagnosed. Make sure you paste build logs and click 'Analyze' or select a common issue.\n`;
    }
    content += `\n==================================================\n`;
    content += `End of Diagnostic Report • DevOps Hub Studio\n`;
    content += `==================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devops-diagnostic-report-${targetPlatform}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Troubleshooter Mode (Manual input vs Automated Simulation vs System Check vs Knowledge Base)
  const [diagnoseMode, setDiagnoseMode] = useState<"manual" | "simulation" | "system_check" | "knowledge_base" | "memory_leak">("manual");
  const [simulationPlatform, setSimulationPlatform] = useState<"ios" | "android" | "webgl" | "unreal">("ios");
  const [customIssues, setCustomIssues] = useState<LocalizedQuickIssue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("devops_hub_custom_issues");
    if (stored) {
      try {
        setCustomIssues(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const [simulationLines, setSimulationLines] = useState<string[]>([]);
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Real-time time elapsed counter for Simulation
  useEffect(() => {
    let interval: any = null;
    if (isSimPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimPlaying]);

  // System requirements check states
  const [userUnityVersion, setUserUnityVersion] = useState<string>("2022.3 LTS");
  const [userNodeVersion, setUserNodeVersion] = useState<string>("18.19.0");
  const [userJdkVersion, setUserJdkVersion] = useState<string>("11.0.19");
  const [androidSdkStatus, setAndroidSdkStatus] = useState<string>("configured");
  const [targetCheckPlatform, setTargetCheckPlatform] = useState<string>("android");
  const [isCheckingSystem, setIsCheckingSystem] = useState<boolean>(false);
  const [checkProgress, setCheckProgress] = useState<number>(0);
  const [systemReport, setSystemReport] = useState<any | null>(null);
  const [activeCheckStep, setActiveCheckStep] = useState<string>("");

  const handleRunSystemCheck = () => {
    setIsCheckingSystem(true);
    setCheckProgress(0);
    setSystemReport(null);
    setActiveCheckStep(language === "zh" ? "正在初始化扫描系统..." : "Initializing local environment scan...");

    const intervals = [
      { progress: 25, step: language === "zh" ? "扫描浏览器 WebGL 运行环境..." : "Scanning browser capability & WebGL runtime..." },
      { progress: 50, step: language === "zh" ? "对比 Unity 编译器版本与平台兼容性..." : "Validating Unity Editor alignment vs templates..." },
      { progress: 75, step: language === "zh" ? "校验 Node.js 与 Java 开发环境 SDK..." : "Verifying Node.js and Java JDK path variables..." },
      { progress: 100, step: language === "zh" ? "生成多维度依赖兼容性报告..." : "Assembling dependency compatibility score..." }
    ];

    intervals.forEach((item, index) => {
      setTimeout(() => {
        setCheckProgress(item.progress);
        setActiveCheckStep(item.step);
        if (item.progress === 100) {
          setTimeout(() => {
            setIsCheckingSystem(false);
            
            // Validate compatibility logic
            const isNodeCompatible = parseFloat(userNodeVersion) >= 16.0;
            const isJdkCompatible = targetCheckPlatform === "android" 
              ? (userUnityVersion.includes("6") || userUnityVersion.includes("6000") ? parseFloat(userJdkVersion) >= 17 : parseFloat(userJdkVersion) >= 11)
              : true;
            
            let baseScore = 100;
            if (!isNodeCompatible) baseScore -= 20;
            if (!isJdkCompatible) baseScore -= 15;
            if (targetCheckPlatform === "android" && androidSdkStatus === "missing") baseScore -= 25;
            const isPlatformMac = navigator.userAgent.includes("Mac");
            if (targetCheckPlatform === "ios" && !isPlatformMac) baseScore -= 20;
            
            setSystemReport({
              score: baseScore,
              nodeOk: isNodeCompatible,
              jdkOk: isJdkCompatible,
              androidSdkOk: androidSdkStatus === "configured",
              isMac: isPlatformMac,
              webglSupport: true,
              localStorageOk: true,
              unityVersion: userUnityVersion,
              platform: targetCheckPlatform
            });

            showToast(language === "zh" ? "环境与依赖诊断已完成！" : "System requirements scan complete!");
          }, 500);
        }
      }, (index + 1) * 500);
    });
  };

  // Preset Simulated Logs
  const SIM_LOGS = {
    ios: [
      "[11:42:01] [Pipeline] Initializing Unity Build Pipeline Engine...",
      "[11:42:02] [Pipeline] Active Runner ID: CloudRun-BuildAgent-7ff2",
      "[11:42:03] [Unity] Executing Pre-Build script: PreBuildProcessor.BumbleVersion()",
      "[11:42:04] [Unity] Set bundleVersion to '1.0.24' (Code: 1024)",
      "[11:42:05] [Unity] Loading 12,482 game assets from catalogs...",
      "[11:42:08] [Unity] Compiling IL2CPP static methods (ARM64/iOS target)...",
      "[11:42:15] [Unity] IL2CPP Metadata translation complete in 6.43s",
      "[11:42:16] [Unity] Exporting Xcode structural framework: Builds/ios/Unity-iPhone",
      "[11:42:20] [Xcode] Running: xcodebuild -workspace Unity-iPhone.xcworkspace -scheme Unity-iPhone -configuration Release archive",
      "[11:42:22] [Xcode] Reading BuildSettings and entitlements...",
      "[11:42:23] [Xcode] Code Signing Error: No profile for 'com.company.game' were found in provisioning database.",
      "[11:42:23] [Xcode] Code signing is required for product type 'Application' in SDK 'iOS 17.0'",
      "[11:42:24] [Xcode] ** ARCHIVE FAILED ** (Exit Code: 65)",
      "[11:42:24] [Pipeline] Fatal build exception caught! Reporting telemetry logs to server."
    ],
    android: [
      "[11:42:01] [Pipeline] Initializing Unity Build Pipeline Engine...",
      "[11:42:02] [Pipeline] Active Runner ID: CloudRun-BuildAgent-7ff2",
      "[11:42:03] [Unity] Executing Pre-Build script: PreBuildProcessor.BumbleVersion()",
      "[11:42:04] [Unity] Set bundleVersion to '2.1.8' (Code: 218)",
      "[11:42:06] [Unity] Building Player with Android SDK Target API level 34...",
      "[11:42:08] [Unity] Compiling scripts: Assembly-CSharp.dll (2.41s)",
      "[11:42:11] [Unity] Executing Gradle Daemon task: :launcher:assembleRelease",
      "[11:42:14] [Gradle] Configured Google Firebase Core, AdMob, and IronSource SDKs",
      "[11:42:18] [Gradle] > Task :launcher:compileReleaseJavaWithJavac",
      "[11:42:21] [Gradle] > Task :launcher:mergeDexRelease",
      "[11:42:22] [Gradle] D8: Cannot fit requested classes in a single dex file (# methods: 78942 > 65536)",
      "[11:42:22] [Gradle] com.android.builder.dexing.DexArchiveMergerException: Error while merging dex archives.",
      "[11:42:23] [Gradle] > Task :launcher:mergeDexRelease FAILED",
      "[11:42:24] [Pipeline] Fatal build exception caught! Reporting telemetry logs to server."
    ],
    webgl: [
      "[11:42:01] [Pipeline] Initializing Unity Build Pipeline Engine...",
      "[11:42:02] [Pipeline] Active Runner ID: CloudRun-BuildAgent-7ff2",
      "[11:42:03] [Unity] Executing Pre-Build script: PreBuildProcessor.BumbleVersion()",
      "[11:42:04] [Unity] Set bundleVersion to '1.0.0' (Code: 100)",
      "[11:42:05] [Unity] Loading WebGL Web Assembly compilation toolchain...",
      "[11:42:08] [Unity] Packaging AssetBundles and Addressable catalog data...",
      "[11:42:12] [Unity] Compiling C# IL2CPP to Emscripten WebAssembly target...",
      "[11:42:18] [Emscripten] emcc: running LLVM Linker Optimizer...",
      "[11:42:22] [Emscripten] emcc: error: WASM link step failed with memory exhaustion",
      "[11:42:22] [Emscripten] fatal: Out of memory - Emscripten heap allocation exceeds limit (512MB RAM)",
      "[11:42:23] [Unity] BuildFailedException: Emscripten compilation failed with exit code 1",
      "[11:42:24] [Pipeline] Fatal build exception caught! Reporting telemetry logs to server."
    ],
    unreal: [
      "[14:20:01] [Pipeline] Initializing Unreal Build Engine...",
      "[14:20:02] [Pipeline] Active Runner ID: UE-Agent-Alpha-9",
      "[14:20:03] [UBT] Analyzing module dependencies for 'SpaceShooter'...",
      "[14:20:05] [UBT] Found 42 source files, 18 headers.",
      "[14:20:08] [UBT] Compiling MyCharacter.cpp (MSVC v143)...",
      "[14:20:12] [UBT] MyCharacter.cpp(128): error C2039: 'GetController': is not a member of 'FPlayerInput'",
      "[14:20:13] [UBT] ERROR: Target 'SpaceShooter' failed to build. Exit code 6.",
      "[14:20:14] [ShaderCompiler] Triggering parallel shader compilation for SM6...",
      "[14:20:18] [ShaderCompiler] Fatal error: ShaderCompileWorker.exe crashed!",
      "[14:20:19] [Pipeline] Unreal build failed with critical exceptions."
    ]
  };

  // Run simulation timeline loop
  useEffect(() => {
    let timer: any = null;
    if (isSimPlaying && simulationIndex < SIM_LOGS[simulationPlatform].length) {
      timer = setTimeout(() => {
        setSimulationLines(prev => [...prev, SIM_LOGS[simulationPlatform][simulationIndex]]);
        setSimulationIndex(prev => prev + 1);
      }, 700); // 700ms typing speed
    } else if (simulationIndex >= SIM_LOGS[simulationPlatform].length && isSimPlaying) {
      setIsSimPlaying(false);
      
      const title = language === "zh" ? "模拟打包编译结束" : "Simulated Build Process Complete";
      const body = language === "zh" 
        ? `针对 ${simulationPlatform.toUpperCase()} 平台的打包模拟已结束。` 
        : `Unity build simulation for ${simulationPlatform.toUpperCase()} platform has completed!`;

      // Trigger Web Notifications API
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification(title, { body });
          } catch (e) {
            console.warn("Failed to trigger desktop Notification in iframe", e);
          }
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              try {
                new Notification(title, { body });
              } catch (e) {
                console.warn("Failed to trigger desktop Notification in iframe", e);
              }
            }
          });
        }
      }

      // In-app fallback toast
      showToast(body);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSimPlaying, simulationIndex, simulationPlatform, language]);

  const handleStartSim = () => {
    setSimulationLines([]);
    setSimulationIndex(0);
    setElapsedTime(0);
    setIsSimPlaying(true);
  };

  const handlePauseSim = () => {
    setIsSimPlaying(false);
  };

  const handleResumeSim = () => {
    setIsSimPlaying(true);
  };

  const handleResetSim = () => {
    setIsSimPlaying(false);
    setSimulationLines([]);
    setSimulationIndex(0);
    setElapsedTime(0);
  };

  const handleFeedToDiagnose = () => {
    const fullLog = SIM_LOGS[simulationPlatform].slice(0, simulationIndex).join("\n");
    setCustomLog(fullLog);
    const platformMapped = simulationPlatform === "webgl" ? "webgl" : (simulationPlatform === "unreal" ? "standalone" : simulationPlatform);
    setTargetPlatform(platformMapped);
    setDiagnoseMode("manual");
    setAiResult(null);
    setErrorMessage(null);
    
    // Automatically log this build session in history!
    const simulatedDurations = { ios: 312, android: 245, webgl: 420, unreal: 580 };
    const dur = simulatedDurations[simulationPlatform] || 180;
    handleAddSession(platformMapped, dur, "Failure");
  };

  const isZh = language === "zh";

  const selectedIssue = QUICK_ISSUES.find(i => i.id === selectedIssueId);

  const getLocalizedIssue = (issue: typeof QUICK_ISSUES[0]) => {
    return {
      title: isZh ? issue.titleZh : issue.titleEn,
      summary: isZh ? issue.summaryZh : issue.summaryEn,
      solution: isZh ? issue.solutionZh : issue.solutionEn,
    };
  };

  const handleAiDiagnose = async () => {
    if (!customLog.trim()) {
      setErrorMessage(isZh ? "请先粘贴编译器日志或打包报错。" : "Please paste a compiler log or build error first.");
      return;
    }

    setAiLoading(true);
    setErrorMessage(null);
    setAiResult(null);

    try {
      const response = await fetch("/api/ai-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorLog: customLog, platform: targetPlatform, language }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || (isZh ? "解析日志内容失败。" : "Failed to analyze log content."));
      }

      const data = await response.json();
      setAiResult(data);
      handleAddSession(targetPlatform, 180, "Failure");
    } catch (err: any) {
      setErrorMessage(
        err.message || 
        (isZh 
          ? "Gemini 无法解析该编译日志。请确保 API 密钥已在 Secrets 面板中正确配置。" 
          : "Gemini was unable to parse the compiler logs. Make sure API keys are configured.")
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoPatch = () => {
    if (!aiResult || !aiResult.codeSnippet) return;
    
    // Simulate detecting fixable error and applying it to a file
    showToast(isZh ? "正在检测并修复构建脚本..." : "Detecting and patching build scripts...");
    
    setTimeout(() => {
      showToast(isZh ? "成功！构建脚本已自动修复。" : "Success! Build scripts auto-patched.");
      console.log("Auto-patched with:", aiResult.codeSnippet);
    }, 1500);
  };

  const loadSampleError = (sample: string, platform: BuildPlatform) => {
    setCustomLog(sample);
    setTargetPlatform(platform);
    setAiResult(null);
    setErrorMessage(null);
  };

  const currentIssueDetails = selectedIssue ? getLocalizedIssue(selectedIssue) : null;

  return (
    <div className="space-y-6" id="troubleshooter-view">
      
      {/* Top Split Layout: Quick Lookup vs Custom Diagnostician */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Common Issues Directory */}
        {diagnoseMode !== "knowledge_base" && (
          <div className="lg:col-span-4 bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Wrench className="h-4 w-4 text-indigo-400" />
                {t("buildDiagnostics")}
              </h3>
              <p className="text-xs text-gray-400">
                {t("diagnosticsDesc")}
              </p>
            </div>

            <div className="space-y-2">
              {QUICK_ISSUES.map(issue => {
                const issueDetails = getLocalizedIssue(issue);
                return (
                  <button
                    key={issue.id}
                    id={`issue-btn-${issue.id}`}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setAiResult(null); // Clear AI view when inspecting standard issue
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      selectedIssueId === issue.id && !aiResult
                        ? "bg-indigo-950/30 border-indigo-500 text-indigo-300"
                        : "bg-gray-900/40 border-gray-800/80 text-gray-400 hover:bg-gray-900"
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <span className="text-xs font-semibold block truncate">{issueDetails.title}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">
                        Platform: {issue.platform}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Quick Sandbox Tester */}
            <div className="pt-4 border-t border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">{t("sandboxTemplates")}</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  id="load-sample-multidex"
                  onClick={() => loadSampleError(QUICK_ISSUES[1].sampleError, "android")}
                  className="py-1.5 px-2 rounded bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-850 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  {t("loadDex")}
                </button>
                <button
                  id="load-sample-signing"
                  onClick={() => loadSampleError(QUICK_ISSUES[0].sampleError, "ios")}
                  className="py-1.5 px-2 rounded bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-850 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  {t("loadSign")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Interactive Log Console */}
        <div className={`${diagnoseMode === "knowledge_base" ? "lg:col-span-12" : "lg:col-span-8"} bg-gray-950 border border-gray-800 rounded-xl p-5 flex flex-col space-y-4`}>
          
          {/* Diagnostic Mode Tab Switcher */}
          <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-1 flex-wrap gap-2">
            <div className="flex bg-gray-900/60 p-1 rounded-lg border border-gray-800">
              <button
                id="diagnose-mode-manual-btn"
                onClick={() => setDiagnoseMode("manual")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  diagnoseMode === "manual"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {isZh ? "手动贴入日志" : "Manual Paste Logs"}
              </button>
              <button
                id="diagnose-mode-simulation-btn"
                onClick={() => setDiagnoseMode("simulation")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  diagnoseMode === "simulation"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{isZh ? "自动化日志流监视器" : "Automated Log Monitor"}</span>
              </button>
              <button
                id="diagnose-mode-system-check-btn"
                onClick={() => setDiagnoseMode("system_check")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  diagnoseMode === "system_check"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isZh ? "环境与依赖项诊断" : "System Requirements Check"}</span>
              </button>
              <button
                id="diagnose-mode-knowledge-base-btn"
                onClick={() => setDiagnoseMode("knowledge_base")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  diagnoseMode === "knowledge_base"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-indigo-450" />
                <span>{isZh ? "领域专家知识库" : "Domain Knowledge Base"}</span>
              </button>
              <button
                id="diagnose-mode-memory-leak-btn"
                onClick={() => setDiagnoseMode("memory_leak")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  diagnoseMode === "memory_leak"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                <span>{isZh ? "C++ 内存泄漏检测" : "C++ Memory Leak Detector"}</span>
              </button>
            </div>
            
            {diagnoseMode === "simulation" && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{isZh ? "异常模板" : "Templates"}:</span>
                <select
                  id="sim-platform-select"
                  value={simulationPlatform}
                  onChange={(e) => {
                    setSimulationPlatform(e.target.value as "ios" | "android" | "webgl");
                    handleResetSim();
                  }}
                  className="bg-gray-900 border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-300 font-mono focus:outline-none focus:border-indigo-500"
                >
                  <option value="ios">iOS Certificate Error</option>
                  <option value="android">Android MultiDex Limit</option>
                  <option value="webgl">WebGL Out of Memory</option>
                  <option value="unreal">Unreal UBT Exit Code 6</option>
                </select>
              </div>
            )}
          </div>

          {/* Blueprint troubleshooter */}
          {projectType === "unreal" && (
            <div className="bg-gray-950 border border-indigo-900/30 rounded-xl p-5 space-y-4 mb-4">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {isZh ? "Unreal Blueprint 蓝图构建诊断" : "Unreal Blueprint Build Diagnostics"}
              </h4>
              <p className="text-xs text-gray-400">
                {isZh ? "粘贴 Blueprint 构建报错日志，Gemini 将提供节点重构建议或性能优化方案。" : "Paste your Blueprint build logs, and Gemini will provide node refactoring suggestions or optimization fixes."}
              </p>
              <textarea
                rows={4}
                value={blueprintLog}
                onChange={(e) => setBlueprintLog(e.target.value)}
                className="w-full bg-gray-950/40 border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder={isZh ? "粘贴蓝图报错..." : "Paste Blueprint errors..."}
              />
              {blueprintError && (
                <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3 text-xs text-red-400 font-mono animate-in fade-in duration-200">
                  {blueprintError}
                </div>
              )}
              <button
                onClick={handleBlueprintDiagnose}
                disabled={blueprintAiLoading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {blueprintAiLoading ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isZh ? "分析中..." : "Analyzing..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isZh ? "分析蓝图错误" : "Analyze Blueprint Errors"}</span>
                  </>
                )}
              </button>

              {/* Blueprint Results Display */}
              {blueprintAiResult && (
                <div className="mt-4 p-4 bg-gray-900/40 border border-indigo-950 rounded-lg space-y-3 animate-in fade-in duration-300 text-left">
                  <div className="bg-red-950/10 border-l-4 border-red-500 p-3 rounded-r">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">{isZh ? "原因分析" : "Root Cause"}</span>
                    <p className="text-xs text-gray-200 leading-relaxed font-mono mt-0.5">{blueprintAiResult.rootCause}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-300 block uppercase tracking-wider">{isZh ? "蓝图重构/修复步骤" : "Blueprint Remediation Blueprint"}</span>
                    {blueprintAiResult.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-gray-950/40 border border-gray-900 rounded">
                        <div className="h-4 w-4 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900/50 flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-gray-300 leading-normal">{step}</p>
                      </div>
                    ))}
                  </div>
                  {blueprintAiResult.explanation && (
                    <div className="p-3 bg-gray-950 rounded border border-gray-900 text-xs text-gray-400 leading-relaxed">
                      {blueprintAiResult.explanation}
                    </div>
                  )}
                  {blueprintAiResult.codeSnippet && (
                    <div className="border border-gray-900 rounded-lg overflow-hidden bg-gray-950/50">
                      <div className="px-3 py-1.5 border-b border-gray-900 bg-gray-900 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>{isZh ? "修复方案 / 关键节点提示" : "Repair Blueprint Tips / Code"}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(blueprintAiResult.codeSnippet || "");
                            showToast(isZh ? "已复制到剪贴板！" : "Copied to clipboard!");
                          }}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap">{blueprintAiResult.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {diagnoseMode === "memory_leak" && (
            <div className="flex-1 animate-in fade-in duration-200">
              <ValgrindLeakDetector />
            </div>
          )}

          {diagnoseMode === "manual" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    {t("aiDiagnosticTitle")}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t("aiDiagnosticDesc")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id="ai-diagnose-platform-select"
                    value={targetPlatform}
                    onChange={e => setTargetPlatform(e.target.value as BuildPlatform | "general")}
                    className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="general">Platform: General</option>
                    <option value="android">Platform: Android</option>
                    <option value="ios">Platform: iOS</option>
                    <option value="webgl">Platform: WebGL</option>
                    <option value="standalone">Platform: Standalone</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 mb-2 animate-in fade-in duration-300">
                <span className="text-[10px] uppercase font-bold text-gray-500 mb-2 block tracking-widest">{isZh ? "工程目标驱动提示推荐 (Engineering-Aware Prompts)" : "Engineering-Aware Prompts"}</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    isZh ? "此Unity项目构建失败，请确保Scene文件未被非目标平台引用" : "This Unity project build failed, ensure Scene files are not referenced by non-target platforms.",
                    isZh ? "检测到Unreal项目依赖未清理，建议开启构建管理清理流程" : "Unreal project un-cleaned dependencies detected, suggest enabling build manager cleanup.",
                    isZh ? "建议将构建配置移到远程构建集群以提升性能" : "Suggest moving build configuration to remote build cluster to improve performance.",
                    isZh ? "Web项目依赖版本冲突，请查看Docker构建日志" : "Web project dependency version conflict, please check Docker build logs.",
                    isZh ? "此构建耗时过长，是否启用了增量构建策略？" : "This build takes too long, did you enable incremental build strategy?"
                  ].map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setCustomLog(prev => prev ? prev + "\n" + prompt : prompt)}
                      className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-[10px] text-left transition-colors border border-indigo-500/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex-1">
                <textarea
                  id="compiler-log-textarea"
                  rows={6}
                  value={customLog}
                  onChange={e => setCustomLog(e.target.value)}
                  placeholder={t("placeholderLogs")}
                  className="w-full bg-gray-950/40 border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-gray-500">
                  {t("poweredBy")} <strong className="text-gray-400">Gemini 3.5 Flash</strong> (Server-Side)
                </span>

                <button
                  id="run-ai-diagnose-btn"
                  onClick={handleAiDiagnose}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-sans font-semibold text-xs disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  {aiLoading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("btnAnalyzing")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{t("btnAnalyze")}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {diagnoseMode === "simulation" && (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
              {/* Real-time Build Progress & Time Elapsed Counter */}
              <div className="bg-gray-950/60 border border-gray-850 p-4 rounded-xl space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {isSimPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimPlaying ? "bg-indigo-500 animate-pulse" : simulationIndex >= SIM_LOGS[simulationPlatform].length ? "bg-red-500" : "bg-gray-600"}`}></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                      {isZh ? "当前打包状态:" : "ACTIVE BUILD STATUS:"}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isSimPlaying 
                        ? "bg-indigo-950 text-indigo-400 border border-indigo-900/40" 
                        : simulationIndex >= SIM_LOGS[simulationPlatform].length 
                          ? "bg-red-950 text-red-400 border border-red-900/40" 
                          : "bg-gray-900 text-gray-500 border border-gray-800"
                    }`}>
                      {isSimPlaying 
                        ? (isZh ? "正在编译 (Started)" : "Started") 
                        : simulationIndex >= SIM_LOGS[simulationPlatform].length 
                          ? (isZh ? "编译中止 (Exception)" : "Exception Caught") 
                          : (isZh ? "就绪 (Idle)" : "Idle")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span>{isZh ? "累计已用时长:" : "Time Elapsed:"}</span>
                    <span className="text-indigo-400 font-bold text-sm w-12 text-right">{elapsedTime.toFixed(1)}s</span>
                  </div>
                </div>

                {/* Smooth Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>{isZh ? "编译器打包编译进程" : "Unity Compiler Progress"}</span>
                    <span>{Math.round((simulationIndex / SIM_LOGS[simulationPlatform].length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-850">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 rounded-full"
                      style={{ width: `${(simulationIndex / SIM_LOGS[simulationPlatform].length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Automated Log Terminal View */}
              <div className="relative bg-gray-950/80 border border-gray-850/80 rounded-xl p-4 font-mono text-xs text-gray-300 h-64 overflow-y-auto flex flex-col justify-between shadow-inner">
                {/* Glow scanlines effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none rounded-xl"></div>
                
                <div className="space-y-1 z-10 flex-1">
                  {simulationLines.length === 0 ? (
                    <div className="text-gray-500 text-center py-12 leading-relaxed">
                      {isZh 
                        ? "◆ 实时 Unity 打包日志流监控终端已就绪 ◆\n请点击下方的 [开始流模拟] 按钮启动流数据 analysis" 
                        : "◆ REAL-TIME UNITY BUILD LOG MONITOR READY ◆\nClick 'Start Simulation' below to start stream capture"}
                    </div>
                  ) : (
                    simulationLines.map((line, idx) => {
                      let colorClass = "text-gray-300";
                      if (line.includes("Error") || line.includes("FAILED") || line.includes("error") || line.includes("fatal") || line.includes("❌")) {
                        colorClass = "text-red-400 font-bold bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30 my-0.5";
                      } else if (line.includes("Initializing") || line.includes("Executing")) {
                        colorClass = "text-indigo-400";
                      } else if (line.includes("Success") || line.includes("complete")) {
                        colorClass = "text-green-400";
                      }
                      return (
                        <div key={idx} className={`${colorClass} leading-relaxed animate-in fade-in duration-100`}>
                          {line}
                        </div>
                      );
                    })
                  )}
                  {isSimPlaying && (
                    <div className="text-indigo-400 flex items-center gap-1.5 text-[11px] font-bold mt-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                      <span>Streaming real-time Unity CLI standard output...</span>
                    </div>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="border-t border-gray-900/60 pt-2.5 mt-4 flex items-center justify-between text-[10px] text-gray-500 z-10">
                  <span>Stream ID: SIM-GAME-09x8</span>
                  <span>Captured: {simulationIndex} / {SIM_LOGS[simulationPlatform].length} lines</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-900/40 p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  {simulationIndex === 0 ? (
                    <button
                      id="sim-start-btn"
                      onClick={handleStartSim}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-indigo-600/10"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{isZh ? "开始流模拟" : "Start Simulation"}</span>
                    </button>
                  ) : isSimPlaying ? (
                    <button
                      id="sim-pause-btn"
                      onClick={handlePauseSim}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-amber-600/10"
                    >
                      <Pause className="h-3.5 w-3.5 fill-current" />
                      <span>{isZh ? "暂停监视" : "Pause"}</span>
                    </button>
                  ) : (
                    <button
                      id="sim-resume-btn"
                      onClick={handleResumeSim}
                      disabled={simulationIndex >= SIM_LOGS[simulationPlatform].length}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors shadow-md shadow-indigo-600/10"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{isZh ? "继续流捕获" : "Resume"}</span>
                    </button>
                  )}

                  <button
                    id="sim-reset-btn"
                    onClick={handleResetSim}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{isZh ? "重置" : "Reset"}</span>
                  </button>
                </div>

                {/* Feed to AI Analyzer button */}
                <div className="flex items-center gap-2.5">
                  <span className="hidden md:inline text-[10px] text-gray-500 italic">
                    {simulationIndex >= SIM_LOGS[simulationPlatform].length 
                      ? (isZh ? "检测到打包报错！" : "Crash detected!") 
                      : (isZh ? "流数据已就绪" : "Ready to export")}
                  </span>
                  
                  <button
                    id="sim-feed-btn"
                    onClick={handleFeedToDiagnose}
                    disabled={simulationIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isZh ? "导入 AI 智能诊断" : "Feed to AI Diagnostics"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {diagnoseMode === "system_check" && (
            <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
              {/* Header and description */}
              <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-indigo-400" />
                    {isZh ? "本地环境依赖兼容性诊断" : "CI/CD Environment Compatibility Suite"}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {isZh ? "检测您的本地 Unity Hub, Node.js 与 Java 开发链，确保与目标 CI/CD 模板完全匹配。" : "Configure your local system versions below, then scan to discover build alignment compatibility."}
                  </p>
                </div>
              </div>

              {/* Version Configurators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-950/40 p-4 rounded-xl border border-gray-900">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? (projectType === "unity" ? "Unity Hub 版本:" : "Unreal Engine 版本:") : (projectType === "unity" ? "Unity Version:" : "Unreal Version:")}</label>
                  <select
                    value={userUnityVersion}
                    onChange={(e) => {
                      setUserUnityVersion(e.target.value);
                      setSystemReport(null);
                    }}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded p-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    {projectType === "unity" ? (
                      <>
                        <option value="2022.3 LTS">2022.3 LTS (Stable)</option>
                        <option value="2021.3 LTS">2021.3 LTS</option>
                        <option value="6000.0 Beta">6000.0 (Unity 6) Beta</option>
                        <option value="2020.3 LTS">2020.3 LTS (Legacy)</option>
                      </>
                    ) : (
                      <>
                        <option value="5.3">Unreal Engine 5.3</option>
                        <option value="5.4">Unreal Engine 5.4</option>
                        <option value="5.2">Unreal Engine 5.2</option>
                        <option value="4.27">Unreal Engine 4.27</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "Node.js 运行时:" : "Node.js Version:"}</label>
                  <select
                    value={userNodeVersion}
                    onChange={(e) => {
                      setUserNodeVersion(e.target.value);
                      setSystemReport(null);
                    }}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded p-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="18.19.0">v18.19.0 (LTS)</option>
                    <option value="20.11.0">v20.11.0 (LTS)</option>
                    <option value="14.21.0">v14.21.0 (Unsupported)</option>
                    <option value="12.0.0">v12.0.0 (Legacy)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "Java JDK 依赖包:" : "Java JDK Version:"}</label>
                  <select
                    value={userJdkVersion}
                    onChange={(e) => {
                      setUserJdkVersion(e.target.value);
                      setSystemReport(null);
                    }}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded p-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="11.0.19">JDK 11 (LTS)</option>
                    <option value="17.0.8">JDK 17 (Stable)</option>
                    <option value="1.8.0">JDK 1.8 (Legacy 8)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "Android SDK 配置:" : "Android SDK:"}</label>
                  <select
                    value={androidSdkStatus}
                    onChange={(e) => {
                      setAndroidSdkStatus(e.target.value);
                      setSystemReport(null);
                    }}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded p-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="configured">{isZh ? "已配置 (ANDROID_HOME)" : "Configured"}</option>
                    <option value="missing">{isZh ? "未检测到环境路径" : "Missing / Not Set"}</option>
                  </select>
                </div>
              </div>

              {/* Platform Selector & Trigger button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/20 p-3 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold">{isZh ? "目标编译平台:" : "Target Platform Build:"}</span>
                  <select
                    value={targetCheckPlatform}
                    onChange={(e) => {
                      setTargetCheckPlatform(e.target.value);
                      setSystemReport(null);
                    }}
                    className="bg-gray-900 border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-300 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="android">Android (APK / AAB)</option>
                    <option value="ios">iOS (Xcode project)</option>
                    <option value="webgl">WebGL (HTML5)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunSystemCheck}
                  disabled={isCheckingSystem}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-sans font-semibold text-xs disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {isCheckingSystem ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isZh ? "正在极速扫描中..." : "Diagnosing System..."}</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="h-3.5 w-3.5" />
                      <span>{isZh ? "执行诊断检测" : "Execute Diagnostics Check"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress and Report Output */}
              {isCheckingSystem && (
                <div className="p-4 bg-gray-900/60 rounded-xl border border-gray-800 text-center space-y-3 animate-pulse">
                  <div className="text-xs text-indigo-400 font-mono font-semibold">{activeCheckStep}</div>
                  <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-900">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${checkProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Analyzing workspace environment compatibility details...</span>
                </div>
              )}

              {systemReport && !isCheckingSystem && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm ${
                        systemReport.score >= 80 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" 
                          : "bg-amber-950/80 text-amber-400 border border-amber-800"
                      }`}>
                        {systemReport.score}%
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200 uppercase tracking-wider">{isZh ? "环境健康分数" : "Compatibility Report Score"}</h5>
                        <p className="text-[10px] text-gray-400">
                          {systemReport.score >= 80 
                            ? (isZh ? "极佳！当前环境可以直接出包运行" : "Fully Optimized! Highly compatible with DevOps Hub Studio.") 
                            : (isZh ? "需要调整！缺少部分重要环境变量" : "Warning! Missing some optional SDK variables.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Diagnostic Item 1 */}
                    <div className="flex items-start gap-2.5 p-2.5 bg-gray-950/60 rounded-lg border border-gray-900">
                      <div className="mt-0.5">
                        {systemReport.nodeOk ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200">Node.js Runtime</div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {systemReport.nodeOk 
                            ? `${isZh ? '通过：已配置 Node.js' : 'Success: Node.js version is compatible'} (${userNodeVersion})` 
                            : `${isZh ? '不匹配：流水线需要 Node.js v16+ 驱动依赖' : 'Incompatible: Pipeline modules require Node.js >= 16.0'}`}
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Item 2 */}
                    <div className="flex items-start gap-2.5 p-2.5 bg-gray-950/60 rounded-lg border border-gray-900">
                      <div className="mt-0.5">
                        {systemReport.jdkOk ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200">Java JDK Alignment</div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {systemReport.jdkOk 
                            ? `${isZh ? '通过：Java JDK 版本匹配' : 'Success: Java JDK is aligned'} (${userJdkVersion})` 
                            : `${isZh ? '警告：Unity 6+ 建议搭配 JDK 17 及以上版本' : 'Warning: Unity 6 templates require JDK 17+ for Gradle compiler.'}`}
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Item 3 */}
                    {systemReport.platform === "android" && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-gray-950/60 rounded-lg border border-gray-900">
                        <div className="mt-0.5">
                          {systemReport.androidSdkOk ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-200">Android SDK (ANDROID_HOME)</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {systemReport.androidSdkOk 
                              ? (isZh ? "通过：Android SDK 环境路径校验成功" : "Success: ANDROID_HOME path has been established.") 
                              : (isZh ? "不匹配：缺少 Android SDK 变量，Gradle 打包将报错" : "Failure: Missing ANDROID_HOME. Gradle build is likely to fail.")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Item 4 */}
                    {systemReport.platform === "ios" && (
                      <div className="flex items-start gap-2.5 p-2.5 bg-gray-950/60 rounded-lg border border-gray-900">
                        <div className="mt-0.5">
                          {systemReport.isMac ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-200">Apple Xcode Compiler Host</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {systemReport.isMac 
                              ? (isZh ? "通过：检测到 macOS，支持本地导出 .ipa 格式包" : "Success: macOS detected. Xcode command-line tools ready.") 
                              : (isZh ? "警告：iOS 流水线需要 macOS / Apple 编译环境主机才可生成安装包" : "Warning: iOS build processes require a macOS compiler host for ipa packaging.")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Item 5 */}
                    <div className="flex items-start gap-2.5 p-2.5 bg-gray-950/60 rounded-lg border border-gray-900">
                      <div className="mt-0.5">
                        {systemReport.webglSupport ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-200">Browser WebGL Support</div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {systemReport.webglSupport 
                            ? (isZh ? "通过：浏览器正常支持 WebGL 流水线预览与 WASM 加载" : "Success: WebGL 2.0 context is supported by your current browser.") 
                            : (isZh ? "错误：浏览器已被禁用硬件加速" : "Failure: GPU hardware acceleration disabled.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {diagnoseMode === "knowledge_base" && (
            <KnowledgeBaseView
              isZh={isZh}
              customIssues={customIssues}
              setCustomIssues={setCustomIssues}
              onSelectIssue={(issueId) => {
                setSelectedIssueId(issueId);
                setAiResult(null); // Clear previous AI view
                setDiagnoseMode("manual");
              }}
              onLoadSample={(sample, plat) => {
                setCustomLog(sample);
                setTargetPlatform(plat);
                setAiResult(null); // Clear previous AI view
                setDiagnoseMode("manual");
              }}
              showToast={showToast}
            />
          )}

          {errorMessage && (
            <div className="bg-red-950/20 border border-red-900/60 rounded-lg p-3 text-xs text-red-400 font-mono">
              {errorMessage}
            </div>
          )}
        </div>

      </div>

      {/* Analytics & Local Build History Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Local History Table */}
        <div className="lg:col-span-7 bg-gray-950 border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
                {isZh ? "本地编译历史记录" : "Local Build History"}
              </h3>
            </div>
            {sessions.length > 0 && (
              <button
                id="clear-history-btn"
                onClick={handleClearHistory}
                className="text-[10px] text-gray-500 hover:text-red-400 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                title="Clear build log history"
              >
                <Trash2 className="h-3 w-3" />
                <span>{isZh ? "清空历史" : "Clear"}</span>
              </button>
            )}
          </div>

          {/* Table display */}
          <div className="flex-1 overflow-x-auto min-h-[140px]">
            {sessions.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-xs font-mono">
                {isZh ? "暂无编译历史记录。请手动添加或运行上方流模拟。" : "No build sessions found. Add one manually or run a simulation."}
              </div>
            ) : (
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-gray-900 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2 px-1">{isZh ? "时间" : "Time"}</th>
                    <th className="py-2 px-1">{isZh ? "目标平台" : "Platform"}</th>
                    <th className="py-2 px-1">{isZh ? "持续时间" : "Duration"}</th>
                    <th className="py-2 px-1 text-right">{isZh ? "编译结果" : "Result"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-gray-300">
                  {sessions.slice(0, 5).map((session) => (
                    <tr key={session.id} className="hover:bg-gray-900/20 transition-colors">
                      <td className="py-2 px-1 font-mono text-[10px] text-gray-400">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2 px-1 font-mono">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          session.platform === "ios" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                          session.platform === "android" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                          session.platform === "webgl" ? "bg-purple-950/40 text-purple-400 border border-purple-900/30" :
                          "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                        }`}>
                          {session.platform.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-1 font-mono text-gray-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{session.duration}s</span>
                      </td>
                      <td className="py-2 px-1 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          session.status === "Success" 
                            ? "bg-green-950/60 text-green-400 border border-green-900/40" 
                            : "bg-red-950/60 text-red-400 border border-red-900/40"
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Manual Logger Form */}
          <div className="bg-gray-900/30 border border-gray-900 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-2 text-xs">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider sm:w-20 flex items-center gap-1">
              <Plus className="h-3 w-3" />
              {isZh ? "登记编译" : "Log Build"}
            </span>
            
            <div className="flex flex-1 items-center gap-2 w-full flex-wrap">
              {/* Platform select */}
              <select
                id="form-platform"
                value={logPlatform}
                onChange={(e) => setLogPlatform(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 font-mono focus:outline-none cursor-pointer"
              >
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="webgl">WebGL</option>
                <option value="standalone">Standalone</option>
              </select>

              {/* Duration Input */}
              <div className="flex items-center bg-gray-950 border border-gray-800 rounded px-2 py-1 flex-1 min-w-[70px]">
                <input
                  id="form-duration"
                  type="number"
                  value={logDuration}
                  onChange={(e) => setLogDuration(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-transparent w-full text-xs font-mono text-gray-300 outline-none border-0 p-0 focus:ring-0"
                  placeholder="Duration (sec)"
                />
                <span className="text-[10px] text-gray-500 font-mono ml-1">s</span>
              </div>

              {/* Status Selector */}
              <div className="flex bg-gray-950 border border-gray-800 rounded p-0.5">
                <button
                  id="form-status-success"
                  type="button"
                  onClick={() => setLogStatus("Success")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    logStatus === "Success" 
                      ? "bg-green-600 text-white font-bold" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Success
                </button>
                <button
                  id="form-status-failure"
                  type="button"
                  onClick={() => setLogStatus("Failure")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    logStatus === "Failure" 
                      ? "bg-red-600 text-white font-bold" 
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Failure
                </button>
              </div>

              {/* Add Button */}
              <button
                id="log-session-btn"
                type="button"
                onClick={() => handleAddSession(logPlatform, logDuration, logStatus)}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {isZh ? "记入" : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* recharts Bar Chart */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
            <BarChart2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
              {isZh ? "平均编译时间对比 (秒)" : "Average Build Times (sec)"}
            </h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} unit="s" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderColor: '#1f2937', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    color: '#f3f4f6' 
                  }} 
                />
                <Bar dataKey="Avg Duration (sec)" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {getChartData().map((entry, index) => {
                    const colors = {
                      Android: "#10b981", 
                      iOS: "#3b82f6", 
                      WebGL: "#8b5cf6", 
                      Standalone: "#f59e0b"
                    };
                    const color = colors[entry.name] || "#6366f1";
                    return <Cell key={`cell-${index}`} fill={color} opacity={0.85} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-gray-500 text-center leading-normal italic">
            {isZh 
              ? "WebGL 由于 IL2CPP 静态转换与 WASM 优化，打包用时最长，是常见的研发性能瓶颈。" 
              : "WebGL requires heavy WebAssembly linker compression, representing a typical bottleneck."}
          </p>
        </div>

      </div>

      {/* Bottom Panel: Diagnostic Results */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950 shadow-sm">
        
        {/* Result Header */}
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/30 flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            {aiResult ? t("aiReportTitle") : `${t("standardReportTitle")}: ${currentIssueDetails?.title || ""}`}
          </h4>
          
          <div className="flex items-center gap-3">
            <button
              id="export-diagnostics-btn"
              onClick={handleExportDiagnostics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isZh ? "导出诊断报告" : "Export Report (.txt)"}</span>
            </button>
            
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              {t("sourceTitle")}: {aiResult ? (isZh ? "云端 AI 专家" : "Server AI Analyst") : (isZh ? "静态知识库" : "Static Knowledgebase")}
            </span>
          </div>
        </div>

        {/* AI Result Dashboard */}
        {aiResult ? (
          <div className="p-6 space-y-6">
            
            {/* Root Cause block */}
            <div className="bg-red-950/10 border-l-4 border-red-500 rounded-r-lg p-4 space-y-1">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">{t("rootCauseTitle")}</span>
              <p className="text-xs text-gray-200 leading-relaxed font-mono">{aiResult.rootCause}</p>
            </div>

            {/* Structured Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left explanation and checklist column */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Steps Checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-gray-300 block uppercase tracking-wider font-sans">{t("blueprintTitle")}</span>
                  <div className="space-y-2">
                    {aiResult.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/40 border border-gray-800/80">
                        <div className="h-5 w-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900/50 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-1 bg-gray-900/10 border border-gray-850 p-4 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-2 font-sans">
                    <Info className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{t("deepDiveTitle")}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{aiResult.explanation}</p>
                </div>

              </div>

              {/* Right snippet block */}
              <div className="md:col-span-5 flex flex-col">
                {aiResult.codeSnippet ? (
                  <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden flex flex-col bg-gray-950/40">
                    <div className="px-4 py-2.5 border-b border-gray-800 bg-gray-900/60 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-300 font-mono">{t("repairSnippet")}</span>
                      <button
                        id="copy-repair-snippet-btn"
                        onClick={() => handleCopyCode(aiResult.codeSnippet || "")}
                        className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy repair block"
                      >
                        {copied ? <Check className="h-3 w-3.5 text-green-400" /> : <Copy className="h-3 w-3.5" />}
                      </button>
                      <button
                        id="auto-patch-btn"
                        onClick={handleAutoPatch}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 text-[10px] font-bold transition-colors cursor-pointer"
                        title="Apply fix automatically to build scripts"
                      >
                        <Sparkles className="h-3 w-3" />
                        {isZh ? "自动修复" : "Auto-Patch"}
                      </button>
                    </div>
                    <div className="flex-1 p-4 overflow-auto font-mono text-[11px] text-indigo-300 leading-relaxed">
                      <pre className="whitespace-pre-wrap">{aiResult.codeSnippet}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 border border-dashed border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center text-gray-500">
                    <AlertCircle className="h-8 w-8 text-gray-700 mb-2" />
                    <p className="text-xs">{t("noSnippet")}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : selectedIssue && currentIssueDetails ? (
          // Static Issue Display
          <div className="p-6 space-y-6">
            
            {/* Summary block */}
            <div className="bg-indigo-950/10 border-l-4 border-indigo-500 rounded-r-lg p-4 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Description Summary</span>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{currentIssueDetails.summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Error code block */}
              <div className="lg:col-span-5 flex flex-col">
                <span className="text-xs font-semibold text-gray-300 block mb-3 font-sans">{t("simulatedCompilerError")}</span>
                <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden bg-gray-950 flex flex-col max-h-[300px]">
                  <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/60 font-mono text-[10px] text-gray-400">
                    {t("consoleLogOutput")}
                  </div>
                  <div className="flex-1 p-4 overflow-auto font-mono text-[10px] text-red-400 bg-gray-950/40 leading-relaxed">
                    <pre className="whitespace-pre-wrap">{selectedIssue.sampleError}</pre>
                  </div>
                </div>
              </div>

              {/* Solution checklist and codes */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-semibold text-gray-300 block font-sans">{t("stepByStepPlan")}</span>
                <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-5 text-xs text-gray-300 leading-relaxed space-y-2 markdown-body">
                  {currentIssueDetails.solution.split("\n").map((line, i) => {
                    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
                      return <h5 key={i} className="font-semibold text-gray-200 mt-3 flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-indigo-400" /> {line}</h5>;
                    }
                    if (line.startsWith("   `") || line.startsWith("   var") || line.startsWith("   project") || line.startsWith("   }")) {
                      return <code key={i} className="block bg-gray-950/30 border border-gray-800/80 p-2 rounded my-1 font-mono text-[10px] text-indigo-300 whitespace-pre overflow-x-auto">{line.replace(/^(   )/, "")}</code>;
                    }
                    return <p key={i} className="text-gray-400 pl-4 text-[11px] leading-relaxed">{line}</p>;
                  })}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 font-mono text-xs">
            {t("selectIssuePrompt")}
          </div>
        )}

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-indigo-500 text-indigo-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-sans font-semibold z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
