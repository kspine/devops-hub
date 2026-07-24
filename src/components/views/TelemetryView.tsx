import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Cpu, 
  LayoutGrid, 
  RefreshCw, 
  Play, 
  Pause, 
  Server, 
  TrendingUp, 
  BarChart2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Flame,
  Zap,
  HardDrive,
  DollarSign,
  ShieldAlert
} from "lucide-react";
import CloudResourceMonitor from "../CloudResourceMonitor";
import CostEstimator from "../CostEstimator";
import PipelineEfficiencyWidget from "../PipelineEfficiencyWidget";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from "recharts";
import { useLanguage } from "../../LanguageContext";
import { useWorkspace } from "../../WorkspaceContext";
import { useToast } from "../ToastContext";
import { ProjectType } from "../../types";
import { useTheme } from "../../context/ThemeContext";

interface TelemetryViewProps {
  isZh?: boolean;
}

export default function TelemetryView({ isZh: propIsZh }: TelemetryViewProps) {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const { addToast } = useToast();
  
  const isZh = propIsZh !== undefined ? propIsZh : language === "zh";

  // Threshold Alert System (Mock)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate checking runner utilization
      const highUsage = Math.random() > 0.8; 
      if (highUsage) {
        addToast("Alert: Build Runner NODE-01 CPU usage exceeded 90% for > 5 minutes!", "warning");
      }
    }, 10000); // Checking every 10 seconds for demo
    return () => clearInterval(interval);
  }, [addToast]);

  // State Management
  const [telemetryTab, setTelemetryTab] = useState<"health" | "performance" | "memory">("health");
  const [perfServiceFilter, setPerfServiceFilter] = useState<"all" | "cpp" | "java" | "python">("all");

  // Flame Graph hierarchy data types
  interface FlameNode {
    name: string;
    value: number;
    children?: FlameNode[];
  }

  const unityNativeHeapData = useMemo<FlameNode>(() => ({
    name: "UnityPlayer.dll",
    value: 4120,
    children: [
      {
        name: "Core",
        value: 1850,
        children: [
          { name: "MemoryManager", value: 450 },
          { name: "AssetBundleSystem", value: 620, children: [
            { name: "SerializedFile", value: 380 },
            { name: "CompressionLZ4", value: 240 }
          ]},
          { name: "GarbageCollector", value: 320 },
          { name: "ProfilingProfiler", value: 460 }
        ]
      },
      {
        name: "Graphics",
        value: 1250,
        children: [
          { name: "RenderPipeline", value: 580, children: [
            { name: "ShaderLabCompiler", value: 340 },
            { name: "VulkanDevice", value: 240 }
          ]},
          { name: "TextureManager", value: 420 },
          { name: "MeshOptimizer", value: 250 }
        ]
      },
      {
        name: "Physics",
        value: 640,
        children: [
          { name: "PhysXCore", value: 380 },
          { name: "CollisionDetection", value: 160 },
          { name: "RigidBodySolver", value: 100 }
        ]
      },
      {
        name: "AudioEngine",
        value: 230,
        children: [
          { name: "FMODSystem", value: 150 },
          { name: "DSPGraph", value: 80 }
        ]
      },
      {
        name: "ScriptingIL2CPP",
        value: 150,
        children: [
          { name: "MetadataLoader", value: 90 },
          { name: "GarbageCollectorBridge", value: 60 }
        ]
      }
    ]
  }), []);

  const assetImportHeapData = useMemo<FlameNode>(() => ({
    name: "AssetPipeline.dll",
    value: 3200,
    children: [
      {
        name: "TextureImporter",
        value: 1450,
        children: [
          { name: "ASTC_Encoder", value: 650 },
          { name: "MipmapGenerator", value: 480 },
          { name: "ColorSpaceConverter", value: 320 }
        ]
      },
      {
        name: "ModelProcessor",
        value: 1100,
        children: [
          { name: "FBX_SDK_Parser", value: 500 },
          { name: "MeshQuantizer", value: 380 },
          { name: "SkeletonBaking", value: 220 }
        ]
      },
      {
        name: "AudioPrecompiler",
        value: 400,
        children: [
          { name: "VorbisCompressor", value: 280 },
          { name: "WavResampler", value: 120 }
        ]
      },
      {
        name: "ScriptStripper",
        value: 250,
        children: [
          { name: "AssemblyStripping", value: 170 },
          { name: "MetadataReduction", value: 80 }
        ]
      }
    ]
  }), []);

  const [memoryProfileCategory, setMemoryProfileCategory] = useState<"runtime" | "importer">("runtime");
  const [memorySearchQuery, setMemorySearchQuery] = useState("");
  const [focusedFlameNodeId, setFocusedFlameNodeId] = useState<string | null>(null);

  const buildDurationData = useMemo(() => [
    { build: "#101", cpp: 240, java: 120, python: 80 },
    { build: "#102", cpp: 210, java: 115, python: 95 },
    { build: "#103", cpp: 295, java: 150, python: 110 }, // cache miss
    { build: "#104", cpp: 180, java: 95, python: 75 },
    { build: "#105", cpp: 150, java: 90, python: 72 },
    { build: "#106", cpp: 145, java: 88, python: 70 },
    { build: "#107", cpp: 220, java: 130, python: 85 },
    { build: "#108", cpp: 135, java: 85, python: 68 },
    { build: "#109", cpp: 128, java: 80, python: 65 },
    { build: "#110", cpp: 120, java: 78, python: 62 },
  ], []);

  const cacheHitData = useMemo(() => [
    { build: "#101", hitRate: 65, missRate: 35 },
    { build: "#102", hitRate: 68, missRate: 32 },
    { build: "#103", hitRate: 40, missRate: 60 }, // Cache bust
    { build: "#104", hitRate: 82, missRate: 18 },
    { build: "#105", hitRate: 88, missRate: 12 },
    { build: "#106", hitRate: 91, missRate: 9 },
    { build: "#107", hitRate: 75, missRate: 25 },
    { build: "#108", hitRate: 93, missRate: 7 },
    { build: "#109", hitRate: 95, missRate: 5 },
    { build: "#110", hitRate: 96, missRate: 4 },
  ], []);

  const cppMemorySpikeData = useMemo(() => [
    { stage: "Preprocess", heapMem: 3.2, peakMem: 4.5 },
    { stage: "Parsing headers", heapMem: 6.8, peakMem: 8.9 },
    { stage: "AST Gen", heapMem: 8.5, peakMem: 11.2 },
    { stage: "Template Expand", heapMem: 12.4, peakMem: 15.8 }, // Peak spike
    { stage: "Optimization O3", heapMem: 11.1, peakMem: 14.5 },
    { stage: "Object Gen", heapMem: 5.4, peakMem: 7.2 },
    { stage: "Linking (ld)", heapMem: 9.8, peakMem: 13.1 },
    { stage: "Post-Processing", heapMem: 2.1, peakMem: 3.5 },
  ], []);

  const [healthStatus, setHealthStatus] = useState<"Operational" | "Degraded" | "Critical">("Operational");
  const [lastHealthCheck, setLastHealthCheck] = useState<string>(() => new Date().toLocaleTimeString());
  const [isHealthFetching, setIsHealthFetching] = useState(false);
  const [isMonitoringPaused, setIsMonitoringPaused] = useState(false);
  const [isHeatmapFaultSimulated, setIsHeatmapFaultSimulated] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: string; msg: string; msgZh: string; level: "warning" | "error"; time: string }>>([]);

  const [healthHistory, setHealthHistory] = useState<Array<{ id: number; status: "Operational" | "Degraded" | "Critical"; time: string }>>([
    { id: 1, status: "Operational", time: "10:00" },
    { id: 2, status: "Operational", time: "11:00" },
    { id: 3, status: "Degraded", time: "12:00" },
    { id: 4, status: "Operational", time: "13:00" },
    { id: 5, status: "Operational", time: "14:00" }
  ]);
  const healthIdCounter = useRef(6);

  // Simulated live-updating utilization values
  const [realtimeLoad, setRealtimeLoad] = useState({ cpu: 42, ram: 58, disk: 31, network: 120 });

  useEffect(() => {
    if (isMonitoringPaused) return;

    const interval = setInterval(() => {
      // Dynamic random fluctuations
      setRealtimeLoad(prev => {
        const cpuDelta = Math.floor((Math.random() - 0.5) * 12);
        const ramDelta = Math.floor((Math.random() - 0.5) * 4);
        const diskDelta = Math.floor((Math.random() - 0.5) * 2);
        const netDelta = Math.floor((Math.random() - 0.5) * 40);

        return {
          cpu: Math.min(Math.max(prev.cpu + cpuDelta, 15), 95),
          ram: Math.min(Math.max(prev.ram + ramDelta, 30), 85),
          disk: Math.min(Math.max(prev.disk + diskDelta, 20), 80),
          network: Math.min(Math.max(prev.network + netDelta, 20), 450)
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoringPaused]);

  // Chart Data Generators
  const getResourceUtilizationData = useMemo(() => {
    const timePoints = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const baseSeed = projectType === "unity" ? 42 : 58;
    return timePoints.map((time, idx) => ({
      time,
      cpu: Math.floor(35 + (baseSeed * (idx + 1)) % 30 + Math.sin(idx) * 10),
      ram: Math.floor(45 + (baseSeed * (idx + 2)) % 20 + Math.cos(idx) * 8),
      network: Math.floor(80 + (baseSeed * (idx + 3)) % 150 + Math.sin(idx * 1.5) * 30)
    }));
  }, [projectType]);

  const uptimeData = useMemo(() => [
    { name: isZh ? "周一" : "Mon", uptime: 99.8, failures: 1 },
    { name: isZh ? "周二" : "Tue", uptime: 99.9, failures: 0 },
    { name: isZh ? "周三" : "Wed", uptime: 98.4, failures: 4 },
    { name: isZh ? "周四" : "Thu", uptime: 99.5, failures: 2 },
    { name: isZh ? "周五" : "Fri", uptime: 99.9, failures: 0 },
    { name: isZh ? "周六" : "Sat", uptime: 100, failures: 0 },
    { name: isZh ? "周日" : "Sun", uptime: 100, failures: 0 },
  ], [isZh]);

  const getHeatmapData = (type: ProjectType, isFault: boolean) => {
    const runners = type === "unity" 
      ? ["RUNNER-U01", "RUNNER-U02", "RUNNER-U03", "RUNNER-U04"] 
      : type === "unreal"
      ? ["RUNNER-UE01", "RUNNER-UE02", "RUNNER-UE03", "RUNNER-UE04"]
      : type === "web"
      ? ["WEB-RUN-01", "WEB-RUN-02", "WEB-RUN-03"]
      : type === "mobile"
      ? ["MOB-RUN-01", "MOB-RUN-02", "MOB-RUN-03"]
      : ["BKD-RUN-01", "BKD-RUN-02", "BKD-RUN-03"];
    return runners.map((runner, rIdx) => ({
      runner,
      hours: Array.from({ length: 24 }, (_, hIdx) => {
        let successRate = 100;
        // Simulate block anomalies if fault mode is active
        if (isFault && rIdx === 1 && hIdx >= 14 && hIdx <= 17) successRate = 35;
        else if (hIdx % 8 === 0) successRate = 85;
        return { hour: hIdx, successRate, totalBuilds: 5 };
      })
    }));
  };

  // Health check manual polling simulation
  const fetchSimulatedHealth = () => {
    setIsHealthFetching(true);
    addToast(isZh ? "正在重新拉取各个构建节点的健康状态..." : "Polling health metrics from agents...", "info");
    
    setTimeout(() => {
      setIsHealthFetching(false);
      const nextStatus = isHeatmapFaultSimulated 
        ? "Degraded" 
        : Math.random() > 0.8 ? "Degraded" : "Operational";
      
      setHealthStatus(nextStatus);
      const nowStr = new Date().toLocaleTimeString();
      setLastHealthCheck(nowStr);
      setHealthHistory(prev => [
        { id: Date.now(), status: nextStatus, time: nowStr.substring(0, 5) },
        ...prev.slice(0, 4)
      ]);

      if (nextStatus === "Degraded") {
        addToast(isZh ? "⚠️ 警告：检测到个别构建机运行速度明显降级！" : "⚠️ Warning: Slowdown detected on virtual runner pools!", "warning");
      } else {
        addToast(isZh ? "✅ 所有编译集群状态优秀，网络通信正常！" : "✅ All runner pools operational, networking checks passed!", "success");
      }
    }, 1200);
  };

  const handleSimulateFaultToggle = () => {
    const nextFault = !isHeatmapFaultSimulated;
    setIsHeatmapFaultSimulated(nextFault);
    
    if (nextFault) {
      setHealthStatus("Degraded");
      const newAlert = {
        id: "alert-" + Date.now(),
        msg: "CRITICAL SLOWDOWN: Runner 'RUNNER-02' experienced a massive disk-thrashing exception during static code linking.",
        msgZh: "严重警报：构建机 'RUNNER-02' 在进行静态代码链接时因磁盘读写压力过大产生严重降级与异常。",
        level: "warning" as const,
        time: new Date().toLocaleTimeString()
      };
      setActiveAlerts(prev => [newAlert, ...prev]);
      addToast(isZh ? "🔴 故障模拟：节点 IO 降级警报已触发" : "🔴 Simulated fault: Node disk IO degraded", "error");
    } else {
      setHealthStatus("Operational");
      setActiveAlerts([]);
      addToast(isZh ? "🟢 故障已解决：集群节点全部恢复常态" : "🟢 Solved: All runner clusters returned to normal status", "success");
    }
  };

  return (
    <div className={`space-y-6 transition-colors duration-500 ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`} id="telemetry-monitoring-view">
      {/* Tab Switcher */}
      <div className="flex border-b border-b-gray-800 pb-1 gap-4">
        <button
          onClick={() => setTelemetryTab("health")}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            telemetryTab === "health"
              ? "border-indigo-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          {isZh ? "集群运行监控" : "Cluster Health Monitor"}
        </button>
        <button
          onClick={() => setTelemetryTab("performance")}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            telemetryTab === "performance"
              ? "border-indigo-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          {isZh ? "编译效能统计" : "Build Performance Stats"}
        </button>
        <button
          onClick={() => setTelemetryTab("memory")}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            telemetryTab === "memory"
              ? "border-indigo-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          {isZh ? "内存堆栈分析 (Flame Graph)" : "Memory Profiling (Flame Graph)"}
        </button>
      </div>

      {telemetryTab === "health" && (
        <div className="space-y-6">
          {/* Visual Header / Operational Status banner */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        healthStatus === "Operational" 
          ? (mode === 'dark' ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-900")
          : (mode === 'dark' ? "bg-amber-950/15 border-amber-900/40 text-amber-100" : "bg-amber-50 border-amber-200 text-amber-900")
      }`}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center border animate-pulse ${
            healthStatus === "Operational" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"
          }`}>
            <Activity className={`h-6 w-6 ${healthStatus === "Operational" ? "text-emerald-400" : "text-amber-400"}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight uppercase">
                {isZh ? "集群系统运行状态：" : "Cluster System Status: "}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                healthStatus === "Operational" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {healthStatus}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-xl">
              {isZh 
                ? `遥测核心正在持续检测 ${projectType.toUpperCase()} 构建机网络互联与底层 IO，健康度评分良好。最近一次全局健康扫描完成于 ${lastHealthCheck}。` 
                : `Telemetry engines are continuously pulling latency metrics from ${projectType.toUpperCase()} runner nodes. Cluster health check completed at ${lastHealthCheck}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={fetchSimulatedHealth}
            disabled={isHealthFetching}
            className="px-4 py-2 bg-gray-900 border border-gray-800 hover:border-indigo-500/40 hover:bg-gray-850 text-xs font-semibold rounded-xl text-gray-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 ${isHealthFetching ? "animate-spin" : ""}`} />
            <span>{isZh ? "轮询诊断" : "Poll Diagnostics"}</span>
          </button>
          
          <button
            onClick={handleSimulateFaultToggle}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              isHeatmapFaultSimulated 
                ? "bg-red-500 hover:bg-red-400 text-white" 
                : "bg-gray-900 border border-gray-850 text-gray-300 hover:border-red-500/30 hover:text-red-400"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-red-400" />
            <span>{isZh ? "异常故障模拟" : "Simulate Fault"}</span>
          </button>
        </div>
      </div>

      {/* Cluster Metrics Top Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: CPU Realtime Load */}
        <div className="bg-gray-950 border border-gray-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider select-none">{isZh ? "处理器占用" : "CPU LOAD"}</span>
            <Cpu className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-gray-100">{realtimeLoad.cpu}%</span>
            <span className="text-[9px] text-gray-500 font-mono">64 Cores</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                realtimeLoad.cpu > 80 ? "bg-red-500" : realtimeLoad.cpu > 60 ? "bg-amber-500" : "bg-indigo-500"
              }`}
              style={{ width: `${realtimeLoad.cpu}%` }}
            />
          </div>
        </div>

        {/* Card 2: Memory Realtime Load */}
        <div className="bg-gray-950 border border-gray-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider select-none">{isZh ? "内存分配率" : "RAM ALLOCATION"}</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-gray-100">{realtimeLoad.ram}%</span>
            <span className="text-[9px] text-gray-500 font-mono">128GB</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
              style={{ width: `${realtimeLoad.ram}%` }}
            />
          </div>
        </div>

        {/* Card 3: Security Posture */}
        <div className="bg-gray-950 border border-gray-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider select-none">{isZh ? "合规安全评分" : "SECURITY SCORE"}</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-emerald-400">98.2</span>
            <span className="text-[9px] text-emerald-500/60 font-mono">Compliant</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `98%` }}
            />
          </div>
        </div>

        {/* Card 4: Estimated Build Cost */}
        <div className="bg-gray-950 border border-gray-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider select-none">{isZh ? "预估构建成本" : "BUILD COST"}</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-mono font-bold text-gray-100">$42.50</span>
            <span className="text-[9px] text-gray-500 font-mono">MTD (Cloud)</span>
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full" 
              style={{ width: `65%` }}
            />
          </div>
        </div>

        {/* Card 5: Historical Status Trend */}
        <div className="bg-gray-950 border border-gray-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider select-none">{isZh ? "历史趋势" : "TRENDS"}</span>
            <Clock className="h-4 w-4 text-pink-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-gray-300">99.64%</span>
            <span className="text-[9px] text-gray-500 font-mono">Last 5 Checks</span>
          </div>
          <div className="flex items-center gap-1.5 h-2">
            {healthHistory.map((h, i) => (
              <div 
                key={h.id} 
                className={`h-2 flex-1 rounded-full ${
                  h.status === "Operational" 
                    ? "bg-emerald-500" 
                    : h.status === "Degraded" 
                      ? "bg-amber-500 animate-pulse" 
                      : "bg-red-500"
                }`} 
                title={`${h.time} - ${h.status}`}
              />
            ))}
          </div>
        </div>
      </div>

      <CloudResourceMonitor />
      <CostEstimator />
      <PipelineEfficiencyWidget />

      {/* Main Mid Layout Split: Heatmap Grid vs Hardware Resource Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols on large screen): Runner Heath Heatmap */}
        <div className="lg:col-span-7 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-indigo-400" />
                {isZh ? "构建节点健康度可用矩阵" : "Runner Cluster Health Heatmap"}
              </h3>
              <p className="text-[10px] text-gray-500">
                {isZh 
                  ? "当前 24 小时维度下，云端物理机及专有物理机的负载、通信、磁盘与硬件完整性状态热图。" 
                  : "Uptime and response completeness heatmap mapped across the past 24 hourly metrics increments."}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {getHeatmapData(projectType, isHeatmapFaultSimulated).map((row) => (
              <div key={row.runner} className="space-y-1.5 bg-gray-900/25 p-3 rounded-xl border border-gray-900/60">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-gray-400">{row.runner}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-gray-500">Avg Success:</span>
                    <span className={`font-semibold ${
                      isHeatmapFaultSimulated && row.runner.includes("02") ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {isHeatmapFaultSimulated && row.runner.includes("02") ? "89.1%" : "99.8%"}
                    </span>
                  </div>
                </div>
                
                {/* 24 Segment Bar representing 24 hours */}
                <div className="grid grid-cols-24 gap-1 h-5 select-none">
                  {row.hours.map((h, i) => {
                    let color = "bg-emerald-500/80 hover:bg-emerald-400";
                    let titleText = `Hour ${h.hour}:00 - 100% stable`;
                    
                    if (h.successRate < 50) {
                      color = "bg-rose-500 animate-pulse hover:bg-rose-400";
                      titleText = `Hour ${h.hour}:00 - Out of bounds (35% speed degradation)`;
                    } else if (h.successRate < 90) {
                      color = "bg-amber-500 hover:bg-amber-400";
                      titleText = `Hour ${h.hour}:00 - Slower linking (85% efficiency)`;
                    }
                    
                    return (
                      <div 
                        key={i} 
                        className={`rounded-sm transition-all duration-200 cursor-help ${color}`}
                        title={titleText}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Color Guides Legend */}
          <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-emerald-500/80" />
              <span>{isZh ? "运行正常 (100%)" : "Optimal (100%)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-amber-500" />
              <span>{isZh ? "轻度延迟 (85%)" : "Minor Latency (85%)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-rose-500 animate-pulse" />
              <span>{isZh ? "异常阻塞 (<50%)" : "Severe Degradation (<50%)"}</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols on large screen): Resource Monitor Charts */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                {isZh ? "资源占用波形图" : "Resource Waves Monitor"}
              </h3>
              <p className="text-[10px] text-gray-500">
                {isZh ? "服务器 CPU / 内存的波动折线分析" : "Telemetry metrics monitoring CPU & RAM memory allocation waves."}
              </p>
            </div>

            <button 
              onClick={() => setIsMonitoringPaused(!isMonitoringPaused)}
              className={`p-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1 ${
                isMonitoringPaused 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
              }`}
              title={isMonitoringPaused ? "Resume Live Graph" : "Pause Live Graph"}
            >
              {isMonitoringPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              <span>{isMonitoringPaused ? (isZh ? "恢复" : "LIVE") : (isZh ? "暂停" : "PAUSE")}</span>
            </button>
          </div>

          <div className="h-44 w-full select-none pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getResourceUtilizationData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={9} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: "#030712", borderColor: "#1f2937", borderRadius: "8px", fontSize: "10px" }}
                />
                <Area type="monotone" name="CPU" dataKey="cpu" stroke="#818cf8" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" name="RAM" dataKey="ram" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-4 rounded-sm bg-indigo-400" />
              <span>CPU Core Utilization (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-4 rounded-sm bg-emerald-400" />
              <span>RAM Heap Utilization (%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Lower Grid Split: Active Simulated Alerts Stream vs Weekly Uptime Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Uptime Statistics */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-purple-400" />
              {isZh ? "周度可用性与任务故障频数" : "Weekly Availability & Fault Frequency"}
            </h3>
            <p className="text-[10px] text-gray-500">
              {isZh ? "对比可用性评分（柱状图）与由于超时或编译失败导致的宕机次数。" : "Shows weekly network availability (bar) versus compilation crash incidents."}
            </p>
          </div>

          <div className="h-48 w-full select-none pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uptimeData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: "#030712", borderColor: "#1f2937", borderRadius: "8px", fontSize: "10px" }}
                />
                <Bar name={isZh ? "运行健康度 %" : "Uptime %"} dataKey="uptime" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                <Bar name={isZh ? "打包中断数" : "Crash Count"} dataKey="failures" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts Stream console */}
        <div className="lg:col-span-7 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              {isZh ? "遥测告警中心" : "Live Telemetry Alerts Hub"}
            </h3>
            <p className="text-[10px] text-gray-500">
              {isZh ? "实时编译集群底层产生的网络慢、磁盘满或证书签名过期告警日志。" : "Real-time stream capture of kernel alerts, network degradation, and signing status."}
            </p>
          </div>

          <div className="flex-1 min-h-[140px] bg-gray-900/30 border border-gray-900/60 rounded-xl p-4 font-mono text-[11px] text-gray-300 space-y-2 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {activeAlerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center py-6 text-gray-500 leading-relaxed text-center"
                >
                  <CheckCircle className="h-8 w-8 text-emerald-500/60 mb-2" />
                  <div>◆ {isZh ? "暂无活跃故障告警" : "ALL SYSTEMS GREEN"} ◆</div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    {isZh ? "你可以点击右上角的 [异常故障模拟] 强制流注故障数据" : "Use the 'Simulate Fault' trigger to verify pipeline warning events."}
                  </div>
                </motion.div>
              ) : (
                activeAlerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-red-300 flex gap-3 items-start shadow-sm"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-900/40 border border-red-800/40 text-red-400 px-1 rounded">
                          DISPATCH_EXCEPTION
                        </span>
                        <span className="text-gray-500 text-[10px]">{alert.time}</span>
                      </div>
                      <p className="leading-relaxed text-xs">{isZh ? alert.msgZh : alert.msg}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
      </div>
      )}

      {telemetryTab === "performance" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Filter Bar */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans">
                {isZh ? "流水线编译效能诊断" : "CI/CD Compilation Diagnostics"}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {isZh ? "深入分析共享缓存命中情况、重度 C++ 编译器内存峰值、及多语言微服务构建耗时波动。" : "Inspect build runners shared cache efficacy, memory-intensive C++ parsing spikes, and pipeline times."}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 font-sans">{isZh ? "过滤器:" : "Pipeline Filter:"}</span>
              <select
                value={perfServiceFilter}
                onChange={(e) => setPerfServiceFilter(e.target.value as any)}
                className="text-xs bg-gray-900 border border-gray-800 rounded-lg p-1.5 px-3 text-gray-200 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
              >
                <option value="all">{isZh ? "所有服务 (All Services)" : "All Services"}</option>
                <option value="cpp">{isZh ? "C++ 基础设施服务" : "C++ Backend Services"}</option>
                <option value="java">{isZh ? "Spring Boot 微服务" : "Spring Boot microservices"}</option>
                <option value="python">{isZh ? "Python AI 推理服务" : "Python AI Services"}</option>
              </select>
            </div>
          </div>

          {/* Performance stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-950 border border-gray-900 p-4.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider">{isZh ? "平均构建周期" : "AVG BUILD TIME"}</span>
                <Clock className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-bold text-gray-100">
                  {perfServiceFilter === "all" ? "3m 24s" : perfServiceFilter === "cpp" ? "4m 45s" : perfServiceFilter === "java" ? "2m 10s" : "1m 18s"}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold">-12.4%</span>
              </div>
              <p className="text-[9.5px] text-gray-500 font-sans leading-none">
                {isZh ? "编译器分布式构建加速" : "Powered by multi-core run pools"}
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-900 p-4.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider">{isZh ? "缓存命中率" : "CACHE HIT RATIO"}</span>
                <HardDrive className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-bold text-gray-100">88.4%</span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold">+4.2%</span>
              </div>
              <p className="text-[9.5px] text-gray-500 font-sans leading-none">
                {isZh ? "本地 CCache 及 Docker 缓存" : "Shared cache saves ~450GB/mo"}
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-900 p-4.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider">{isZh ? "C++ 内存峰值" : "PEAK MEMORY SPIKE"}</span>
                <Cpu className="h-4 w-4 text-pink-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-bold text-gray-100">15.8 GB</span>
                <span className="text-[9px] text-amber-500 font-mono font-bold">Swap Active</span>
              </div>
              <p className="text-[9.5px] text-gray-500 font-sans leading-none">
                {isZh ? "发生在模板大面积展开阶段" : "Spike during heavy template expansion"}
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-900 p-4.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider">{isZh ? "构建能效评分" : "EFFICIENCY RATING"}</span>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-bold text-teal-400">94 / 100</span>
                <span className="text-[9px] text-teal-500 font-mono font-bold">Excellent</span>
              </div>
              <p className="text-[9.5px] text-gray-500 font-sans leading-none">
                {isZh ? "调度器调度损耗低于 2.1%" : "Scheduler overhead: 2.1% max"}
              </p>
            </div>
          </div>

          {/* Charts Row 1: Duration trends and Cache Hits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Build Duration Trends */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  {isZh ? "构建耗时变化趋势" : "Build Duration Trends"}
                </h4>
                <p className="text-[10px] text-gray-500">
                  {isZh ? "按提交版本排序，单位为秒 (s)。" : "Sorted by sequential commit build runs, duration in seconds."}
                </p>
              </div>

              <div className="h-56 w-full select-none pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={buildDurationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="build" stroke="#4b5563" fontSize={9} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={9} tickLine={false} />
                    <ChartTooltip
                      contentStyle={{ backgroundColor: "#030712", borderColor: "#1f2937", borderRadius: "8px", fontSize: "10px" }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                    {(perfServiceFilter === "all" || perfServiceFilter === "cpp") && (
                      <Line type="monotone" name="C++ Service" dataKey="cpp" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 6 }} />
                    )}
                    {(perfServiceFilter === "all" || perfServiceFilter === "java") && (
                      <Line type="monotone" name="Spring Boot" dataKey="java" stroke="#a78bfa" strokeWidth={2} activeDot={{ r: 6 }} />
                    )}
                    {(perfServiceFilter === "all" || perfServiceFilter === "python") && (
                      <Line type="monotone" name="Python AI" dataKey="python" stroke="#14b8a6" strokeWidth={2} activeDot={{ r: 6 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Runner Cache Hit Rates */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-emerald-400" />
                  {isZh ? "跑机分布式缓存命中与未命中对比" : "Shared CI/CD Runner Cache Hit Rate"}
                </h4>
                <p className="text-[10px] text-gray-500">
                  {isZh ? "显示增量编译中，缓存复用（Hit %）与重新编译（Miss %）占比。" : "Tracks shared local compiler storage cache hit vs cold cache miss ratios."}
                </p>
              </div>

              <div className="h-56 w-full select-none pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cacheHitData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMiss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="build" stroke="#4b5563" fontSize={9} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={9} tickLine={false} />
                    <ChartTooltip
                      contentStyle={{ backgroundColor: "#030712", borderColor: "#1f2937", borderRadius: "8px", fontSize: "10px" }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                    <Area type="monotone" name="Cache Hit %" dataKey="hitRate" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorHit)" stackId="1" />
                    <Area type="monotone" name="Cache Miss %" dataKey="missRate" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorMiss)" stackId="1" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Heavy C++ compilation memory usage spikes */}
          <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-pink-400" />
                {isZh ? "深度诊断：C++ 编译器各构建阶段内存分配与突发峰值" : "Deep Diagnostics: C++ Compiler Memory Allocations & Spikes"}
              </h4>
              <p className="text-[10px] text-gray-500">
                {isZh ? "对比 C++ 编译时，活跃堆物理内存（Heap Memory）与最大预留峰值内存（Peak Reservation），用于定位头文件模板引起的内存泄漏或爆仓。" : "Tracks static memory (heap) vs dynamic maximum peak reservation (GB) during intense C++ compiling/linking."}
              </p>
            </div>

            <div className="h-64 w-full select-none pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cppMemorySpikeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHeap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="stage" stroke="#4b5563" fontSize={9} tickLine={false} />
                  <YAxis unit=" GB" stroke="#4b5563" fontSize={9} tickLine={false} />
                  <ChartTooltip
                    contentStyle={{ backgroundColor: "#030712", borderColor: "#1f2937", borderRadius: "8px", fontSize: "10px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Area type="monotone" name="Compiler Heap (GB)" dataKey="heapMem" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorHeap)" />
                  <Area type="monotone" name="Peak Reservation (GB)" dataKey="peakMem" stroke="#ec4899" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPeak)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-1.5 p-3 bg-pink-950/10 border border-pink-950/30 rounded-lg text-[10.5px] text-pink-300">
              <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
              <span>
                {isZh 
                  ? "⚠️ 高负载遥测警报：在 'Template Expansion' (模板展开阶段) 内存突然暴涨至 15.8 GB 触及物理服务器上限，这通常是由未优化的 C++ 嵌套元编程所致。建议检查头文件内联与 ccache 排除规则。" 
                  : "⚠️ Resource Threshold Alert: Memory spike triggered (15.8 GB peak) during the template expansion stage of C++ translation units. Consider splitting bloated includes."}
              </span>
            </div>
          </div>
        </div>
      )}

      {telemetryTab === "memory" && (() => {
        // Active heap tree
        const activeHeapRoot = memoryProfileCategory === "runtime" ? unityNativeHeapData : assetImportHeapData;

        // Use D3 to compute hierarchy and partition
        const root = d3.hierarchy<FlameNode>(activeHeapRoot)
          .sum(d => d.value)
          .sort((a, b) => (b.value || 0) - (a.value || 0)) as any;

        // Size of partition layout is [10000, 1] (virtual width, virtual depth)
        const partition = d3.partition<FlameNode>().size([10000, 1]);
        partition(root);

        // Find the currently focused node in the tree. Default to root.
        let activeRootNode = root;
        if (focusedFlameNodeId) {
          root.each((node: any) => {
            if (node.data.name === focusedFlameNodeId) {
              activeRootNode = node;
            }
          });
        }

        // Calculate layout coordinates for visible nodes relative to activeRootNode
        const rootX0 = activeRootNode.x0;
        const rootX1 = activeRootNode.x1;
        const rootWidth = rootX1 - rootX0;

        // Flatten and group nodes by depth
        const list: any[] = [];
        root.each(node => {
          // Check if node is within range of active root node
          if (node.x0 >= rootX0 && node.x1 <= rootX1 && node.depth >= activeRootNode.depth) {
            list.push(node);
          }
        });

        // Group by relative depth (relative to active root)
        const nodesByDepth: Record<number, any[]> = {};
        list.forEach(node => {
          const relDepth = node.depth - activeRootNode.depth;
          if (!nodesByDepth[relDepth]) nodesByDepth[relDepth] = [];
          nodesByDepth[relDepth].push(node);
        });

        // Maximum depth to draw
        const depthsList = Object.keys(nodesByDepth).map(Number).sort((a, b) => a - b);

        const getFlameNodeColor = (node: any) => {
          const isMatched = memorySearchQuery && node.data.name.toLowerCase().includes(memorySearchQuery.toLowerCase());
          if (isMatched) return "bg-blue-600 border-blue-450 text-white animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.7)] z-10";

          const isFocused = focusedFlameNodeId === node.data.name;
          if (isFocused) return "bg-indigo-950/60 border-indigo-400 text-indigo-100 font-bold";

          // Standard hot colors based on relative weight
          const ratio = node.value / activeHeapRoot.value;
          if (ratio > 0.4) return "bg-red-950/40 border-red-500/30 text-red-200 hover:bg-red-900/40 hover:border-red-400";
          if (ratio > 0.15) return "bg-orange-950/40 border-orange-500/30 text-orange-200 hover:bg-orange-900/40 hover:border-orange-400";
          if (ratio > 0.05) return "bg-amber-950/30 border-amber-600/30 text-amber-200 hover:bg-amber-900/40 hover:border-amber-400";
          return "bg-yellow-950/20 border-yellow-850/35 text-yellow-300 hover:bg-yellow-900/30 hover:border-yellow-400";
        };

        return (
          <div className="space-y-6 animate-in fade-in duration-300" id="memory-profiling-tab-view">
            {/* Controls Bar */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                    {isZh ? "Unity 引擎 Native C++ 堆内存分配火焰图 (Flame Graph)" : "Unity Engine Native C++ Heap Flame Graph"}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {isZh ? "通过 D3.js 算法多层布局，直观分析编译打包出的 native 二进制中各个模块（核心、图形、物理等）的运行时静态堆栈物理内存占用。" : "Utilizes D3.js hierarchy layout algorithms to partition static C++ memory stack heaps (Core, Graphics, PhysX) across multiple compiler modules."}
                  </p>
                </div>

                {/* Memory target toggle */}
                <div className="flex items-center gap-1.5 p-1 bg-gray-900 rounded-lg border border-gray-850 self-start md:self-auto">
                  <button
                    onClick={() => {
                      setMemoryProfileCategory("runtime");
                      setFocusedFlameNodeId(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      memoryProfileCategory === "runtime"
                        ? "bg-indigo-950/50 text-indigo-300 border border-indigo-500/20"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {isZh ? "UnityPlayer.dll (运行时堆)" : "UnityPlayer.dll (Runtime)"}
                  </button>
                  <button
                    onClick={() => {
                      setMemoryProfileCategory("importer");
                      setFocusedFlameNodeId(null);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      memoryProfileCategory === "importer"
                        ? "bg-indigo-950/50 text-indigo-300 border border-indigo-500/20"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {isZh ? "AssetPipeline.dll (导入期堆)" : "AssetPipeline.dll (Importer)"}
                  </button>
                </div>
              </div>

              {/* Filter and reset actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={memorySearchQuery}
                    onChange={(e) => setMemorySearchQuery(e.target.value)}
                    placeholder={isZh ? "搜索内存节点 (如: RenderPipeline, PhysX)..." : "Filter memory node stack (e.g. RenderPipeline, PhysX)..."}
                    className="w-full text-xs bg-gray-900 border border-gray-850 rounded-lg py-2 pl-3 pr-8 text-gray-200 focus:outline-none focus:border-indigo-500"
                  />
                  {memorySearchQuery && (
                    <button
                      onClick={() => setMemorySearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {focusedFlameNodeId && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[10px] text-gray-400 bg-indigo-950/20 border border-indigo-900/40 rounded px-2.5 py-1 flex items-center gap-1">
                      {isZh ? "聚焦节点：" : "Zoom:"} <strong className="text-indigo-300">{focusedFlameNodeId}</strong>
                    </span>
                    <button
                      onClick={() => setFocusedFlameNodeId(null)}
                      className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 font-semibold rounded-lg text-white transition-all cursor-pointer whitespace-nowrap text-xs"
                    >
                      {isZh ? "重置缩放" : "Reset Zoom"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Flame Graph Container */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                <span>{isZh ? "堆调用深度 (Heap Depth Levels)" : "Heap Call Depth (0 ~ Max)"}</span>
                <span>{isZh ? "点击节点缩放聚焦，悬停查看具体开销" : "Click node to Zoom. Hover to view precise bytes allocation."}</span>
              </div>

              {/* Render rows */}
              <div className="space-y-1.5 pt-2 relative">
                {depthsList.map(depth => {
                  const nodes = nodesByDepth[depth];
                  return (
                    <div key={depth} className="relative h-9 w-full flex items-center bg-gray-900/10 rounded overflow-hidden border border-gray-900/30">
                      {nodes.map((node: any, idx: number) => {
                        const left = ((node.x0 - rootX0) / rootWidth) * 100;
                        const width = ((node.x1 - node.x0) / rootWidth) * 100;
                        
                        // Skip rendering infinitesimally small nodes
                        if (width < 0.2) return null;

                        return (
                          <div
                            key={idx}
                            style={{
                              position: "absolute",
                              left: `${left}%`,
                              width: `${width}%`
                            }}
                            onClick={() => {
                              setFocusedFlameNodeId(node.data.name);
                              addToast(isZh ? `已缩放聚焦至内存节点: ${node.data.name}` : `Zoomed in on memory node: ${node.data.name}`, "info");
                            }}
                            className={`h-8 border rounded flex flex-col justify-center px-1.5 cursor-pointer select-none transition-all duration-300 text-left overflow-hidden group/item ${getFlameNodeColor(node)}`}
                            title={`${node.data.name}: ${node.value} MB (${((node.value / activeHeapRoot.value) * 100).toFixed(1)}% of total)`}
                          >
                            <div className="text-[10px] font-bold truncate tracking-tight">{node.data.name}</div>
                            <div className="text-[8.5px] font-mono opacity-80 truncate">{node.value} MB</div>

                            {/* Hover custom tooltip element */}
                            <div className="absolute hidden group-hover/item:block bg-gray-950 border border-gray-800 text-[10px] text-gray-200 rounded p-2.5 z-50 pointer-events-none min-w-[180px] shadow-2xl left-2 top-8 leading-relaxed">
                              <div className="font-bold text-gray-100">{node.data.name}</div>
                              <div className="text-orange-400 font-mono mt-1 font-bold">Allocation: {node.value} MB</div>
                              <div className="text-gray-400 mt-0.5">% of Total Heap: {((node.value / activeHeapRoot.value) * 100).toFixed(1)}%</div>
                              {node.parent && (
                                <div className="text-gray-500">% of Parent: {((node.value / node.parent.value) * 100).toFixed(1)}%</div>
                              )}
                              <div className="text-indigo-400 mt-1 uppercase text-[8px] tracking-widest">{isZh ? "点击进行缩放" : "Click to zoom node"}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-900">
                <div className="bg-gray-900/35 border border-gray-900 rounded-xl p-3 text-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">{isZh ? "堆物理预留总和" : "Total Reserved Heap"}</span>
                  <span className="text-base font-mono font-bold text-orange-400">{activeHeapRoot.value} MB</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-900 rounded-xl p-3 text-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">{isZh ? "活动分配计数" : "Active Allocation Count"}</span>
                  <span className="text-base font-mono font-bold text-teal-400">4,812 allocs</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-900 rounded-xl p-3 text-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">{isZh ? "最大堆栈深度" : "Max Hierarchy Depth"}</span>
                  <span className="text-base font-mono font-bold text-indigo-400">{root.height + 1} Levels</span>
                </div>
                <div className="bg-gray-900/35 border border-gray-900 rounded-xl p-3 text-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">{isZh ? "堆泄漏隐患评分" : "Leak Severity Score"}</span>
                  <span className="text-base font-mono font-bold text-rose-400">Excellent (0.01%)</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
