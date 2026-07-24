import React, { useState, useMemo, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { 
  GitBranch, 
  Key, 
  Wrench, 
  Cpu, 
  Activity, 
  Workflow, 
  Shield,
  Layers,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Server,
  Download,
  FileText,
  Boxes,
  Gamepad2,
  Globe,
  Smartphone,
  RotateCcw,
  LayoutGrid,
  TrendingUp,
  BarChart2,
  StickyNote,
  Terminal,
  GripVertical,
  Play,
  Pause,
  Plus,
  X,
  Bug,
  ArrowRight,
  Sparkles
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";
import { ProjectType, BuildPlatform } from "../../types";
import BuildQueue from "../BuildQueue";
import BuildDurationEstimator from "../BuildDurationEstimator";
import BuildStepTimeline from "../BuildStepTimeline";
import BuildCostEstimator from "../BuildCostEstimator";
import BuildHealth from "../BuildHealth";

import PipelineBuilder from "../PipelineBuilder";

import { useTheme } from "../../context/ThemeContext";

interface PipelineViewProps {
  isZh: boolean;
  projectType: ProjectType;
  t: (key: string) => string;
  isCompact: boolean;
  addToast: (msg: string, type: "success" | "error" | "info" | "warning") => void;
}

export default function PipelineView({ isZh, projectType, t, isCompact, addToast }: PipelineViewProps) {
  const { mode } = useTheme();
  // --- States moved from App.tsx ---
  const [unityRunners, setUnityRunners] = useState([
    { id: "NODE-01", type: "Unity-Runner", status: "Online" },
    { id: "NODE-03", type: "Unity-Runner", status: "Offline" },
    { id: "IOS-RUN-01", type: "Unity-iOS-Core", status: "Busy" },
    { id: "AND-RUN-02", type: "Unity-Android", status: "Online" }
  ]);
  const [unrealRunners, setUnrealRunners] = useState([
    { id: "UE-WIN-01", type: "UE-Windows-Runner", status: "Online" },
    { id: "UE-PS5-02", type: "UE-PS5-Runner", status: "Busy" },
    { id: "UE-XBX-03", type: "UE-Xbox-Runner", status: "Busy" },
    { id: "UE-COOK-04", type: "UE-Cook-Worker", status: "Online" }
  ]);
  const [webRunners, setWebRunners] = useState([
    { id: "WEB-BUILD-01", type: "Node-LTS", status: "Online" },
    { id: "WEB-TEST-02", type: "Puppeteer-Core", status: "Online" },
    { id: "WEB-DEPLOY-03", type: "Vercel-Adapter", status: "Busy" }
  ]);
  const [mobileRunners, setMobileRunners] = useState([
    { id: "MOB-XCODE-01", type: "Mac-Mini-M2", status: "Busy" },
    { id: "MOB-GRADLE-02", type: "Ubuntu-Android", status: "Online" },
    { id: "MOB-HARM-03", type: "Harmony-OS", status: "Online" }
  ]);
  const [backendRunners, setBackendRunners] = useState([
    { id: "BKD-K8S-01", type: "GKE-Node", status: "Online" },
    { id: "BKD-RUST-02", type: "High-CPU-Rust", status: "Online" },
    { id: "BKD-SEC-03", type: "Security-Scanner", status: "Online" }
  ]);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [nodeGrouping, setNodeGrouping] = useState<"platform" | "projectType" | "region" | "pools" | "none">("none");
  const [statusFilter, setStatusFilter] = useState<"all" | "Online" | "Busy" | "Offline" | "Draining">("all");
  const [bulkRebootProgress, setBulkRebootProgress] = useState<number | null>(null);
  const [tableDensity, setTableDensity] = useState<'compact' | 'comfortable' | 'relaxed'>('comfortable');
  const [groupNotes, setGroupNotes] = useState<Record<string, string>>({});
  const [expandedPools, setExpandedPools] = useState<Record<string, boolean>>({ "Default Pool": true });
  const [nodePools, setNodePools] = useState<Record<string, string[]>>({ "Default Pool": [] });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [autoDrainNodes, setAutoDrainNodes] = useState<Record<string, boolean>>({});
  const [sshTerminalNode, setSshTerminalNode] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [isHeatmapFaultSimulated, setIsHeatmapFaultSimulated] = useState(false);
  const [selectedAgentForChart, setSelectedAgentForChart] = useState<string>("");
  const [isMonitoringPaused, setIsMonitoringPaused] = useState(false);
  const [frozenChartData, setFrozenChartData] = useState<any[] | null>(null);
  const [criticalAlertThreshold] = useState(90);
  
  const [healthStatus, setHealthStatus] = useState<"Operational" | "Degraded">("Operational");
  const [lastHealthCheck, setLastHealthCheck] = useState<string>(() => new Date().toLocaleTimeString());
  const [isHealthFetching, setIsHealthFetching] = useState(false);
  const [autoPoll, setAutoPoll] = useState(false);
  const [healthViewMode, setHealthViewMode] = useState<"global" | "dual">("global");
  const [healthHistory, setHealthHistory] = useState<{id: number, status: "Operational" | "Degraded"}[]>([
    { id: 1, status: "Operational" },
    { id: 2, status: "Operational" },
    { id: 3, status: "Degraded" },
    { id: 4, status: "Operational" },
    { id: 5, status: "Operational" }
  ]);
  const healthIdCounter = useRef(6);
  const [pipelineActiveTab, setPipelineActiveTab] = useState<"overview" | "runners" | "telemetry">("overview");

  // Live build simulation state for confetti trigger
  const [isSimulatingBuild, setIsSimulatingBuild] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [activeBuildStep, setActiveBuildStep] = useState<string | null>(null);

  const handleRunQuickBuild = () => {
    if (isSimulatingBuild) return;
    setIsSimulatingBuild(true);
    setBuildProgress(10);
    setActiveBuildStep(isZh ? "初始化构建环境与 SCM 检出..." : "Initializing environment & SCM checkout...");
    
    addToast(
      isZh ? "🚀 正在启动生产级流水线构建..." : "🚀 Launching production pipeline build...",
      "info"
    );

    const steps = isZh ? [
      { name: "1/4 代码与依赖拉取 (SCM Sync)", pct: 30 },
      { name: "2/4 静态代码扫描与单元测试 (SAST & Unit Tests)", pct: 60 },
      { name: "3/4 原生引擎编译与资源打包 (Engine Compile & Cook)", pct: 85 },
      { name: "4/4 密钥签名与制品发布 (Code Sign & Deploy)", pct: 100 }
    ] : [
      { name: "1/4 Source Checkout & Dependencies", pct: 30 },
      { name: "2/4 Security Scan & Unit Tests", pct: 60 },
      { name: "3/4 Engine Compilation & Baking", pct: 85 },
      { name: "4/4 Code Signing & Artifact Deployment", pct: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setActiveBuildStep(steps[stepIndex].name);
        setBuildProgress(steps[stepIndex].pct);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsSimulatingBuild(false);
        setActiveBuildStep(null);
        setBuildProgress(0);
        
        // Trigger subtle celebration confetti effect
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
            disableForReducedMotion: true,
            scalar: 0.9
          });
        } catch (e) {
          console.error(e);
        }

        addToast(
          isZh ? "🎉 构建成功完成！目标制品已通过签名并打包发布！" : "🎉 Build completed successfully! Target artifact signed and deployed!",
          "success"
        );
      }
    }, 1100);
  };

  const platformCapabilities = {
    unity: { runners: unityRunners.map(r => r.id) },
    unreal: { runners: unrealRunners.map(r => r.id) },
    web: { runners: webRunners.map(r => r.id) },
    mobile: { runners: mobileRunners.map(r => r.id) },
    backend: { runners: backendRunners.map(r => r.id) }
  };

  const getResourceUtilizationData = (agentId: string) => {
    const baseSeed = agentId ? agentId.charCodeAt(agentId.length - 1) : 5;
    const timePoints = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
    return timePoints.map((time, idx) => ({
      time,
      cpu: Math.floor(40 + (baseSeed * 5) % 25 + Math.sin(idx) * 15),
      ram: Math.floor(50 + (baseSeed * 7) % 20 + Math.cos(idx) * 12),
      network: Math.floor(20 + (baseSeed * 3) % 40 + Math.sin(idx * 2) * 10)
    }));
  };

  const successRateData = useMemo(() => [
    { day: "07/07", unity: 94, unreal: 90, android: 92, ios: 88, webgl: 95 },
    { day: "07/08", unity: 96, unreal: 92, android: 95, ios: 90, webgl: 98 },
    { day: "07/09", unity: 89, unreal: 91, android: 88, ios: 94, webgl: 85 },
    { day: "07/10", unity: 92, unreal: 94, android: 94, ios: 92, webgl: 90 },
    { day: "07/11", unity: 98, unreal: 89, android: 96, ios: 98, webgl: 99 },
    { day: "07/12", unity: 95, unreal: 95, android: 95, ios: 95, webgl: 95 },
    { day: "07/13", unity: 97, unreal: 93, android: 97, ios: 96, webgl: 98 },
  ], []);

  const last30DaysData = useMemo(() => {
    const data = [];
    const baseDate = new Date(2026, 6, 16); // July 16, 2026
    for (let i = 29; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      const dayStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      const rawSeed = (i * 7 + 13) % 100;
      const unityRate = 92 + (rawSeed % 8);
      const unrealRate = 90 + ((rawSeed + 3) % 9);
      const rate = projectType === "unity" ? unityRate : unrealRate;
      data.push({
        day: dayStr,
        success: rate,
        failure: 100 - rate
      });
    }
    return data;
  }, [projectType]);

  const getDowntimeData = () => [
    { day: "Mon", offline: 12, degraded: 8 },
    { day: "Tue", offline: 5, degraded: 15 },
    { day: "Wed", offline: 20, degraded: 10 },
    { day: "Thu", offline: 8, degraded: 5 },
    { day: "Fri", offline: 15, degraded: 12 },
    { day: "Sat", offline: 2, degraded: 3 },
    { day: "Sun", offline: 1, degraded: 2 },
  ];

  const getHeatmapData = (type: ProjectType, isFaultSimulated: boolean) => {
    const runners = type === "unity" 
      ? ["RUNNER-U01", "RUNNER-U02", "RUNNER-U03", "RUNNER-U04"] 
      : type === "unreal"
      ? ["RUNNER-UE01", "RUNNER-UE02", "RUNNER-UE03", "RUNNER-UE04"]
      : type === "web"
      ? ["WEB-NODE-01", "WEB-NODE-02", "WEB-NODE-03"]
      : type === "mobile"
      ? ["MOB-IOS-01", "MOB-AND-01", "MOB-HARM-01"]
      : ["BKD-GKE-01", "BKD-LAMBDA-01", "BKD-SCR-01"];
    return runners.map((runner, rIdx) => ({
      runner,
      hours: Array.from({ length: 24 }, (_, hIdx) => {
        let successRate = 100;
        if (isFaultSimulated && rIdx === 1 && hIdx >= 14 && hIdx <= 17) successRate = 35;
        else if (hIdx % 8 === 0) successRate = 85;
        return { hour: hIdx, successRate, totalBuilds: 5 };
      })
    }));
  };

  const statusCounts = useMemo(() => {
    const counts = { Online: 0, Busy: 0, Draining: 0, Offline: 0 };
    const currentRunners = 
      projectType === 'unity' ? unityRunners : 
      projectType === 'unreal' ? unrealRunners :
      projectType === 'web' ? webRunners :
      projectType === 'mobile' ? mobileRunners :
      backendRunners;
    currentRunners.forEach(r => { if (r.status in counts) counts[r.status as keyof typeof counts]++; });
    return counts;
  }, [projectType, unityRunners, unrealRunners, webRunners, mobileRunners, backendRunners]);

  const groupedNodes = useMemo(() => {
    const runners = 
      projectType === 'unity' ? unityRunners : 
      projectType === 'unreal' ? unrealRunners :
      projectType === 'web' ? webRunners :
      projectType === 'mobile' ? mobileRunners :
      backendRunners;
    const ids = runners.map(r => r.id);
    if (nodeGrouping === 'none') return [{ key: 'all', runners: ids }];
    if (nodeGrouping === 'pools') {
      const grouped = { ...nodePools };
      const pooledIds = new Set(Object.values(nodePools).flat());
      const orphans = ids.filter(id => !pooledIds.has(id));
      if (orphans.length > 0) grouped["Unassigned"] = orphans;
      return Object.entries(grouped).map(([key, r]) => ({ key, runners: r }));
    }
    return [{ key: 'all', runners: ids }];
  }, [nodeGrouping, nodePools, projectType, unityRunners, unrealRunners]);

  const handleProvisionNewAgent = () => {
    setIsProvisioning(true);
    addToast(isZh ? "正在调度云端空闲资源..." : "Allocating cloud resource...", "info");
    setTimeout(() => {
      const newId = 
        projectType === "unity" ? `NODE-0${unityRunners.length + 1}` : 
        projectType === "unreal" ? `UE-RUN-0${unrealRunners.length + 1}` :
        projectType === "web" ? `WEB-RUN-0${webRunners.length + 1}` :
        projectType === "mobile" ? `MOB-RUN-0${mobileRunners.length + 1}` :
        `BKD-RUN-0${backendRunners.length + 1}`;

      if (projectType === "unity") setUnityRunners(prev => [...prev, { id: newId, type: "Unity-Cloud", status: "Online" }]);
      else if (projectType === "unreal") setUnrealRunners(prev => [...prev, { id: newId, type: "UE-Cloud", status: "Online" }]);
      else if (projectType === "web") setWebRunners(prev => [...prev, { id: newId, type: "Web-Node", status: "Online" }]);
      else if (projectType === "mobile") setMobileRunners(prev => [...prev, { id: newId, type: "Mobile-Builder", status: "Online" }]);
      else setBackendRunners(prev => [...prev, { id: newId, type: "Backend-Node", status: "Online" }]);
      
      addToast(isZh ? `🎉 节点 ${newId} 启动成功！` : `🎉 Agent ${newId} spun up!`, "success");
      setIsProvisioning(false);
    }, 2000);
  };

  const handleBulkQuickReboot = () => {
    if (selectedNodes.length === 0) return;
    setBulkRebootProgress(0);
    const interval = setInterval(() => {
      setBulkRebootProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setBulkRebootProgress(null), 1000);
          addToast(isZh ? `已完成 ${selectedNodes.length} 个节点的软重启` : `Reboot complete for ${selectedNodes.length} nodes`, "success");
          setSelectedNodes([]);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      setTerminalLogs(prev => [...prev, `$ ${terminalInput}`, `root: ${terminalInput}: command executed.`]);
      setTerminalInput("");
    }
  };

  const fetchSimulatedHealth = () => {
    setIsHealthFetching(true);
    setTimeout(() => {
      setIsHealthFetching(false);
      const next = Math.random() > 0.35 ? "Operational" : "Degraded";
      setHealthStatus(next);
      setLastHealthCheck(new Date().toLocaleTimeString());
      setHealthHistory(prev => [{ id: Date.now(), status: next }, ...prev.slice(0, 4)]);
    }, 1200);
  };

  const pipelineTabs = [
    {
      id: "overview" as const,
      labelEn: "Overview & Queues",
      labelZh: "概览与构建队列",
      descEn: "Global stats, durations, queue status, and cost modeling.",
      descZh: "全局统计指标、构建预估、实时排队队列及流水线步骤耗时模型",
      icon: Workflow,
      badge: isZh ? "5个组件" : "5 Widgets"
    },
    {
      id: "runners" as const,
      labelEn: "Runner Cluster",
      labelZh: "构建节点集群",
      descEn: "Deploy, manage, and remote shell into multi-platform agents.",
      descZh: "多端构建机编排、自定义隔离资源池、算力扩展及交互式 SSH 远程调试",
      icon: Server,
      badge: `${statusCounts.Online} / ${statusCounts.Online + statusCounts.Busy + statusCounts.Offline + statusCounts.Draining} Online`
    },
    {
      id: "telemetry" as const,
      labelEn: "Telemetry & Diagnostics",
      labelZh: "遥测与健康度",
      descEn: "Real-time health heatmap, telemetry monitors, and trends.",
      descZh: "实时可用性矩阵热图、节点 CPU/内存占用监控与故障模拟排错",
      icon: Activity,
      badge: `Status: ${healthStatus}`
    }
  ];

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Style Helpers
      const accentColor = [99, 102, 241]; // indigo-500
      const darkColor = [15, 23, 42]; // slate-900
      const lightGray = [241, 245, 249]; // slate-100

      // 1. Header & Title Block
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(0, 0, 210, 38, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("NEO PIPELINE CONFIGURATION REPORT", 14, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(`Generated: ${new Date().toLocaleString()}  |  Project ID: PRJ-001  |  Type: ${projectType.toUpperCase()}`, 14, 24);

      // Accent border
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(0, 38, 210, 2, "F");

      // 2. Metadata Section
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("1. SYSTEM SUMMARY", 14, 52);

      // Small line
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 55, 196, 55);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      const summaryKeys = [
        ["Current Governance State:", healthStatus === "Operational" ? "ACTIVE & SECURE (Fully Operational)" : "DEGRADED WARNING"],
        ["Target Platform:", projectType.toUpperCase() + " build architecture"],
        ["Cluster Integrity Hash:", "sha256:0b58e72c019d..."],
        ["Vulnerability Scans:", "0 Critical, 3 Low (Passed)"],
        ["Build Node Count:", `${unityRunners.length + unrealRunners.length} active multi-agent runners`]
      ];

      let yPos = 62;
      summaryKeys.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(k, 16, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(v, 75, yPos);
        yPos += 7;
      });

      // 3. Topology & Flow steps
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("2. COMPILE PIPELINE WORKFLOW", 14, 110);
      doc.line(14, 113, 196, 113);

      const workflowSteps = [
        ["Step 01: SCM Checkout", "Triggers webhook on push, clones repository context.", "Success Rate: 100%"],
        ["Step 02: Build Shader Cache", "Dynamic shader compilation and baking using Spot instances.", "Success Rate: 98.4%"],
        ["Step 03: Engine Compile", "Native build compilation on specialized runner VM pools.", "Success Rate: 96.5%"],
        ["Step 04: Playtest Suite", "Headless integration and automation smoke test runner.", "Success Rate: 95.1%"],
        ["Step 05: Artifact Registry", "Bake target outputs & deploy to cloud storage buckets.", "Success Rate: 100%"]
      ];

      yPos = 122;
      workflowSteps.forEach(([step, desc, rate]) => {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(14, yPos, 182, 14, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(step, 18, yPos + 5.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(desc, 18, yPos + 10.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(99, 102, 241);
        doc.text(rate, 155, yPos + 8);

        yPos += 18;
      });

      // 4. Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 275, 196, 275);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Confidential - Internal Devops Audit Log Report", 14, 281);
      doc.text("Page 1 of 1", 180, 281);

      doc.save(`neo_pipeline_report_${Date.now()}.pdf`);
      addToast(isZh ? "PDF 配置报告下载成功！" : "Pipeline configuration PDF report downloaded successfully!", "success");
    } catch (err: any) {
      console.error(err);
      addToast(isZh ? "生成 PDF 报告失败" : "Failed to generate PDF report", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Health Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-950/60 p-4 rounded-2xl border border-gray-900/60">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-indigo-400" />
            {isZh ? "流水线综合控制台" : "Pipeline Control Center"}
          </h2>
          <p className="text-[11px] text-gray-400">
            {isZh ? "一站式编译生命周期管理、节点监控及 AI 优化调度服务" : "Full-stack build lifecycle, real-time node orchestration, and predictive analytics"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleRunQuickBuild}
            disabled={isSimulatingBuild}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-black text-white rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-60"
          >
            {isSimulatingBuild ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>{isZh ? "执行构建中..." : "Building..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-200 animate-pulse" />
                <span>{isZh ? "触发成功构建 (验证庆祝)" : "Run Build & Celebrate"}</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-black text-white rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {isZh ? "下载配置报告" : "Download PDF Report"}
          </button>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${healthStatus === "Operational" ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/40" : "bg-rose-950/50 text-rose-400 border-rose-900/40"}`}>
            <div className={`h-2 w-2 rounded-full ${healthStatus === "Operational" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
            <span>{isZh ? "运行状态" : "Status"}: {healthStatus}</span>
          </div>
        </div>
      </div>

      {/* Live Active Build Execution Progress Banner */}
      {isSimulatingBuild && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 p-4 rounded-2xl space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-indigo-300 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin" />
              <span>{activeBuildStep}</span>
            </span>
            <span className="font-bold text-emerald-400">{buildProgress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${buildProgress}%` }}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pipelineTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isTabActive = pipelineActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPipelineActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-28 cursor-pointer select-none group ${
                isTabActive
                  ? "bg-accent/10 border-accent/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  : (mode === 'dark' ? "bg-[#050505] border-white/5 hover:border-white/20" : "bg-white border-gray-100 hover:border-gray-200 shadow-sm")
              }`}
            >
              {isTabActive && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-accent shadow-[0_0_15px_var(--accent-color)]" />
              )}
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl transition-colors ${
                  isTabActive ? "bg-accent/20 text-accent" : "bg-gray-500/10 text-gray-500 group-hover:text-gray-400"
                }`}>
                  <TabIcon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide border ${
                  isTabActive ? "bg-accent/10 border-accent/30 text-accent" : "bg-gray-500/5 border-gray-850 text-gray-500"
                }`}>
                  {tab.badge}
                </span>
              </div>
              <div className="mt-2 min-w-0">
                <h3 className={`text-xs font-bold transition-colors ${isTabActive ? "text-accent" : (mode === 'dark' ? "text-gray-200" : "text-gray-900")}`}>
                  {isZh ? tab.labelZh : tab.labelEn}
                </h3>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  {isZh ? tab.descZh : tab.descEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-px bg-gray-900/30 w-full my-1" />

      {/* Main Tab Contents with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pipelineActiveTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {pipelineActiveTab === "overview" && (
            <>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <BuildDurationEstimator />
                <BuildQueue />
                <BuildStepTimeline projectType={projectType} />
                <BuildCostEstimator />
                <BuildHealth />
                
                {/* Quality & Prediction Integration Widget */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
                  className={`p-4 rounded-xl flex flex-col justify-between h-full border cursor-pointer transition-all ${
                    mode === 'dark' ? 'bg-rose-950/10 border-rose-900/30 hover:border-rose-500/50' : 'bg-rose-50 border-rose-100 shadow-sm hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20">
                      <Bug className="h-4 w-4 text-rose-400" />
                    </div>
                    <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{isZh ? "AI 预测" : "AI Predict"}</div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">{isZh ? "高风险预警" : "High Risk Alerts"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-rose-500">85%</span>
                      <span className="text-[10px] font-bold text-gray-400 leading-tight">Dependency<br/>Conflict</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-rose-500/10 flex items-center justify-between">
                    <span className="text-[10px] text-rose-400 font-bold uppercase">{isZh ? "立即修复" : "Fix Now"}</span>
                    <ArrowRight className="h-3 w-3 text-rose-400" />
                  </div>
                </motion.div>
              </div>

              {/* Project Engine Core Hub - New Widget */}
              <div className={`p-6 rounded-3xl border mb-6 transition-all relative overflow-hidden group ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-32 h-32 text-accent" />
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{isZh ? "项目引擎核心 (Project Engine Hub)" : "Project Engine Core Hub"}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{isZh ? "治理状态: 正常" : "Governance: Operational"}</span>
                        </div>
                        <div className="h-3 w-px bg-gray-800" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">RBAC v4.2 Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-black text-accent">98.4%</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase">{isZh ? "健康指数" : "Health Score"}</div>
                    </div>
                    <div className="h-10 w-px bg-gray-800 hidden sm:block" />
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-500">72%</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase">{isZh ? "算力配额" : "Compute Quota"}</div>
                    </div>
                    <div className="h-10 w-px bg-gray-800 hidden sm:block" />
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "projectDashboard" }))}
                      className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-black uppercase tracking-widest"
                    >
                      {isZh ? "进入项目看板" : "Project Dashboard"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Status Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${mode === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${projectType === "unity" ? "bg-indigo-950/60 border-indigo-900" : "bg-orange-950/60 border-orange-900"}`}>
                    {projectType === "unity" ? (
                      <Gamepad2 className="h-4.5 w-4.5 text-indigo-400" />
                    ) : projectType === "unreal" ? (
                      <Boxes className="h-4.5 w-4.5 text-orange-400" />
                    ) : projectType === "web" ? (
                      <Globe className="h-4.5 w-4.5 text-emerald-400" />
                    ) : projectType === "mobile" ? (
                      <Smartphone className="h-4.5 w-4.5 text-blue-400" />
                    ) : (
                      <Server className="h-4.5 w-4.5 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-semibold block">{t("activeTargets")}</span>
                    <span className="text-sm font-semibold text-gray-200">
                      {projectType === "unity" ? "WebGL • Android • iOS" : 
                       projectType === "unreal" ? "Windows • PS5 • Xbox" :
                       projectType === "web" ? "React • Next.js • Vite" :
                       projectType === "mobile" ? "Flutter • iOS • Android" :
                       "Go • Rust • C++ (K8s)"}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl flex items-center gap-3 transition-all border ${mode === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="h-9 w-9 rounded-lg bg-emerald-950/60 border border-emerald-900 flex items-center justify-center">
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-semibold block">{isZh ? "同步状态" : "SYNC STATUS"}</span>
                    <span className="text-sm font-semibold text-gray-200">{isZh ? "全栈实时同步" : "E2E Synced"}</span>
                  </div>
                </div>

                {/* 30D Success Rate Sparkline */}
                <div className={`p-4 rounded-xl flex flex-col justify-between h-[68px] min-w-0 transition-all border ${mode === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-semibold truncate block">
                      {isZh ? "30天成功率" : "30D SUCCESS RATE"}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {projectType === "unity" ? "95.6%" : "93.4%"}
                    </span>
                  </div>
                  <div className="h-5 w-full mt-1 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last30DaysData} margin={{ top: 1, bottom: 1, left: 1, right: 1 }}>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-gray-950 border border-gray-850 px-1.5 py-0.5 rounded text-[8px] font-mono text-gray-300">
                                  {payload[0].payload.day}: <span className="text-emerald-400 font-bold">{payload[0].value}%</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <defs>
                          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="success" stroke="#10b981" strokeWidth={1} fillOpacity={1} fill="url(#colorSuccess)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 30D Failure Rate Sparkline */}
                <div className={`p-4 rounded-xl flex flex-col justify-between h-[68px] min-w-0 transition-all border ${mode === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-semibold truncate block">
                      {isZh ? "30天失败率" : "30D FAILURE RATE"}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {projectType === "unity" ? "4.4%" : "6.6%"}
                    </span>
                  </div>
                  <div className="h-5 w-full mt-1 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last30DaysData} margin={{ top: 1, bottom: 1, left: 1, right: 1 }}>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className={`border px-1.5 py-0.5 rounded text-[8px] font-mono ${mode === 'dark' ? 'bg-black border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                  {payload[0].payload.day}: <span className="text-rose-400 font-bold">{payload[0].value}%</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <defs>
                          <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="failure" stroke="#f43f5e" strokeWidth={1} fillOpacity={1} fill="url(#colorFailure)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {pipelineActiveTab === "runners" && (
            <>
              {/* Runner Table Control Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <select value={nodeGrouping} onChange={(e) => setNodeGrouping(e.target.value as any)} className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[10px] text-gray-300 font-mono">
                    <option value="none">No Grouping</option>
                    <option value="pools">Custom Pools</option>
                  </select>
                  <button onClick={handleProvisionNewAgent} disabled={isProvisioning} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer">
                    <Server className={`h-3 w-3 ${isProvisioning ? "animate-spin" : ""}`} />
                    {isZh ? "⚡ 快速部署" : "⚡ Provision"}
                  </button>
                  {selectedNodes.length > 0 && (
                    <button onClick={handleBulkQuickReboot} className="px-2 py-1.5 rounded text-[10px] font-bold border border-amber-900/50 bg-amber-500/10 text-amber-400 cursor-pointer">
                      Reboot ({selectedNodes.length})
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(['compact', 'comfortable', 'relaxed'] as const).map(d => (
                    <button key={d} onClick={() => setTableDensity(d)} className={`px-2 py-1 text-[8px] font-bold uppercase rounded cursor-pointer ${tableDensity === d ? 'bg-indigo-600 text-white' : 'text-gray-500 bg-gray-900'}`}>{d[0]}</button>
                  ))}
                </div>
              </div>

              {/* Node Table */}
              <div className={`overflow-hidden border rounded-2xl transition-all ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <table className="w-full text-left border-collapse">
                  <thead className={`border-b transition-colors ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <tr>
                      <th className="px-4 py-3"><input type="checkbox" onChange={(e) => setSelectedNodes(e.target.checked ? platformCapabilities[projectType].runners : [])} className="accent-accent" /></th>
                      <th className="px-4 text-[10px] font-bold text-gray-500 uppercase py-3 font-mono tracking-tighter">ID</th>
                      <th className="px-4 text-[10px] font-bold text-gray-500 uppercase py-3 font-mono tracking-tighter">Status</th>
                      <th className="px-4 text-[10px] font-bold text-gray-500 uppercase py-3 font-mono tracking-tighter">Pulse</th>
                      <th className="px-4 text-[10px] font-bold text-gray-500 uppercase py-3 font-mono tracking-tighter text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y transition-colors ${mode === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                    {groupedNodes.map(({ runners }) => runners.map(id => {
                      const r = 
                        projectType === 'unity' ? unityRunners.find(x => x.id === id) : 
                        projectType === 'unreal' ? unrealRunners.find(x => x.id === id) :
                        projectType === 'web' ? webRunners.find(x => x.id === id) :
                        projectType === 'mobile' ? mobileRunners.find(x => x.id === id) :
                        backendRunners.find(x => x.id === id);
                      return (
                        <React.Fragment key={id}>
                          <tr className={`transition-colors ${mode === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedNodes.includes(id)} onChange={() => setSelectedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id])} className="accent-accent" /></td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-400">{id}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                r?.status === 'Online' 
                                  ? (mode === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') 
                                  : (mode === 'dark' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')
                              }`}>
                                {r?.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className={`h-1 w-12 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <div className="h-full bg-accent w-3/4 animate-pulse" />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-3">
                                <button onClick={() => setSshTerminalNode(sshTerminalNode === id ? null : id)} className="text-gray-500 hover:text-accent transition-colors cursor-pointer" title={isZh ? "SSH 终端" : "SSH Terminal"}><Terminal className="h-3.5 w-3.5" /></button>
                                <button 
                                  onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "logs" }))}
                                  className="text-accent hover:opacity-80 text-[10px] font-bold uppercase cursor-pointer"
                                  title={isZh ? "查看日志分析" : "View Logs"}
                                >
                                  Logs
                                </button>
                              </div>
                            </td>
                          </tr>
                          {sshTerminalNode === id && (
                            <tr className={`${mode === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
                              <td colSpan={5} className="p-4">
                                <div className={`rounded-xl p-4 font-mono text-[11px] h-36 overflow-y-auto border shadow-inner ${
                                  mode === 'dark' 
                                    ? 'bg-[#050505] border-white/5 text-emerald-400' 
                                    : 'bg-gray-900 border-gray-800 text-emerald-400'
                                }`}>
                                  {terminalLogs.map((l, i) => <div key={i} className="mb-0.5">{l}</div>)}
                                  <div className="flex gap-2 mt-2">
                                    <span className="text-accent">$</span>
                                    <input type="text" value={terminalInput} onChange={e => setTerminalInput(e.target.value)} onKeyDown={handleTerminalSubmit} className="bg-transparent outline-none w-full border-none focus:ring-0 p-0" autoFocus />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {pipelineActiveTab === "telemetry" && (
            <>
              {/* Heatmap & Resource Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border transition-all ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-6 flex items-center gap-2 tracking-widest">
                    <LayoutGrid className="h-4 w-4 text-accent" />
                    {isZh ? "节点健康热图" : "Health Heatmap"}
                  </h4>
                  <div className="space-y-4">
                    {getHeatmapData(projectType, isHeatmapFaultSimulated).map(row => (
                      <div key={row.runner} className="flex gap-1 h-6">
                        {row.hours.map((h, i) => <div key={i} className={`flex-1 rounded-sm transition-all ${h.successRate === 100 ? (mode === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/40' : 'bg-emerald-500/10 hover:bg-emerald-500/20') : 'bg-rose-500/80 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]'}`} />)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2 tracking-widest">
                      <Cpu className="h-4 w-4 text-accent" />
                      Resources
                    </h4>
                    <button onClick={() => setIsMonitoringPaused(!isMonitoringPaused)} className="text-[10px] text-gray-500 hover:text-accent cursor-pointer transition-colors">
                      {isMonitoringPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer>
                      <AreaChart data={getResourceUtilizationData("TEST")}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="cpu" stroke="var(--accent-color)" fill="url(#colorCpu)" strokeWidth={2} />
                        <Area type="monotone" dataKey="ram" stroke="#10b981" fill="transparent" strokeWidth={1} strokeDasharray="3 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Health Monitor */}
              <div className={`p-6 rounded-2xl border transition-all ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-sm'} space-y-5`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-850/50">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${healthStatus === "Operational" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${healthStatus === "Operational" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    </div>
                    <h3 className={`text-sm font-bold flex items-center gap-2 tracking-tight ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      <Activity className="h-4 w-4 text-accent" />
                      {isZh ? "系统实时健康度" : "System Vital Signs"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={fetchSimulatedHealth} disabled={isHealthFetching} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                      mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                    }`}>
                      <RefreshCw className={`h-3 w-3 ${isHealthFetching ? "animate-spin" : ""}`} />
                      <span>{isHealthFetching ? "Syncing..." : "Manual Sync"}</span>
                    </button>
                  </div>
                </div>
                
                {/* History Timeline */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                  mode === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50/50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-tighter">Availability:</span>
                    <div className="flex gap-1.5">
                      {healthHistory.map(h => (
                        <div key={h.id} className={`h-2.5 w-1.5 rounded-full ${h.status === "Operational" ? "bg-emerald-500/40" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono italic opacity-60">Last sync: {lastHealthCheck}</span>
                </div>

                {/* Incident Log */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{isZh ? "最近事件 (Incidents)" : "RECENT INCIDENTS"}</h5>
                  {[
                    { time: "14:22:05", type: "CRITICAL", msg: isZh ? "GKE 节点集群 OOM 触发自动扩容" : "GKE Node OOM triggered auto-scaling", color: "text-rose-400" },
                    { time: "12:10:33", type: "WARNING", msg: isZh ? "Unity-Runner-03 磁盘空间低于 10%" : "Unity-Runner-03 Disk space below 10%", color: "text-amber-400" },
                    { time: "09:45:12", type: "RESOLVED", msg: isZh ? "iOS 签名证书链校验通过" : "iOS Cert Chain validation passed", color: "text-emerald-400" },
                  ].map((incident, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-900/20 border border-gray-800/40 rounded-lg group hover:border-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-gray-600">{incident.time}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${incident.color} border-current/20`}>{incident.type}</span>
                        <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{incident.msg}</span>
                      </div>
                      <button className="text-[10px] text-indigo-400 hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">{isZh ? "详情" : "DETAILS"}</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
