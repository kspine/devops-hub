import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Pause, 
  Play, 
  RefreshCw, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  XCircle, 
  Server, 
  Layers, 
  Sliders,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../context/ThemeContext";

export interface AgentTelemetry {
  id: string;
  name: string;
  type: "bare-metal" | "vm" | "container";
  activeJob?: string;
  parallelJobsCount: number;
  maxParallelJobs: number;
  cpuHistory: number[]; // Last 15 data points (%)
  ramHistory: number[]; // Last 15 data points (%)
  diskIoHistory: number[]; // Last 15 data points (MB/s)
  diskSpaceUsedGb: number;
  diskSpaceTotalGb: number;
  status: "active" | "idle" | "bottlenecked" | "offline";
  bottleneckReason?: string;
}

const INITIAL_AGENTS: AgentTelemetry[] = [
  {
    id: "agent-01",
    name: "RUNNER-PROD-01 (AMD EPYC 96C)",
    type: "bare-metal",
    activeJob: "Unreal Engine 5 Shader Cook (Parallel Pass #4)",
    parallelJobsCount: 16,
    maxParallelJobs: 16,
    cpuHistory: [65, 70, 82, 88, 92, 95, 96, 94, 91, 89, 93, 96, 97, 95, 94],
    ramHistory: [40, 42, 45, 48, 52, 58, 62, 65, 68, 70, 72, 75, 78, 80, 82],
    diskIoHistory: [120, 210, 340, 480, 520, 610, 680, 720, 690, 710, 750, 730, 740, 760, 780],
    diskSpaceUsedGb: 420,
    diskSpaceTotalGb: 1000,
    status: "bottlenecked",
    bottleneckReason: "Disk I/O Throttling (780 MB/s) & Thread Saturation (16/16)"
  },
  {
    id: "agent-02",
    name: "RUNNER-PROD-02 (Intel Xeon 32C)",
    type: "vm",
    activeJob: "Unity Android Gradle APK Assembly & Proguard",
    parallelJobsCount: 4,
    maxParallelJobs: 8,
    cpuHistory: [25, 30, 45, 50, 62, 68, 70, 65, 60, 58, 62, 64, 61, 59, 63],
    ramHistory: [22, 24, 25, 28, 30, 32, 35, 36, 38, 40, 42, 41, 40, 43, 44],
    diskIoHistory: [40, 60, 90, 110, 140, 180, 160, 150, 140, 130, 150, 160, 140, 135, 145],
    diskSpaceUsedGb: 180,
    diskSpaceTotalGb: 512,
    status: "active"
  },
  {
    id: "agent-03",
    name: "RUNNER-STG-01 (K8s Worker Pod)",
    type: "container",
    activeJob: "Valgrind C++ Memory Leak Analysis & Unit Tests",
    parallelJobsCount: 2,
    maxParallelJobs: 4,
    cpuHistory: [88, 90, 92, 94, 96, 98, 99, 97, 98, 99, 98, 97, 99, 98, 99],
    ramHistory: [80, 82, 85, 87, 89, 91, 93, 94, 95, 96, 97, 96, 98, 97, 98],
    diskIoHistory: [30, 45, 50, 60, 80, 95, 110, 105, 115, 120, 125, 130, 120, 110, 125],
    diskSpaceUsedGb: 58,
    diskSpaceTotalGb: 64,
    status: "bottlenecked",
    bottleneckReason: "RAM & Disk Capacity Near Limit (98% RAM, 90% Disk)"
  },
  {
    id: "agent-04",
    name: "MAC-BUILD-01 (Apple M2 Ultra)",
    type: "bare-metal",
    activeJob: "iOS Xcode Release Archive & TestFlight Signing",
    parallelJobsCount: 3,
    maxParallelJobs: 6,
    cpuHistory: [35, 42, 58, 64, 72, 70, 68, 65, 62, 60, 63, 66, 68, 65, 62],
    ramHistory: [30, 32, 34, 38, 42, 45, 48, 50, 52, 51, 50, 52, 53, 51, 50],
    diskIoHistory: [150, 220, 310, 400, 380, 350, 320, 310, 330, 340, 360, 350, 340, 330, 320],
    diskSpaceUsedGb: 310,
    diskSpaceTotalGb: 2000,
    status: "active"
  }
];

export default function RunnerResourceMonitor() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isZh = language === "zh";

  const [agents, setAgents] = useState<AgentTelemetry[]>(INITIAL_AGENTS);
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-01");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "bottlenecked">("all");
  const [expandedDetails, setExpandedDetails] = useState(true);

  // Real-time ticking simulation
  useEffect(() => {
    if (!isLivePolling) return;

    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.status === "offline") return agent;

          // Generate slight telemetry variance
          const currentCpu = agent.cpuHistory[agent.cpuHistory.length - 1];
          const cpuDelta = (Math.random() - 0.48) * 8;
          const newCpu = Math.min(100, Math.max(10, Math.round(currentCpu + cpuDelta)));

          const currentRam = agent.ramHistory[agent.ramHistory.length - 1];
          const ramDelta = (Math.random() - 0.45) * 4;
          const newRam = Math.min(99, Math.max(15, Math.round(currentRam + ramDelta)));

          const currentIo = agent.diskIoHistory[agent.diskIoHistory.length - 1];
          const ioDelta = (Math.random() - 0.48) * 35;
          const newIo = Math.min(900, Math.max(20, Math.round(currentIo + ioDelta)));

          const newCpuHist = [...agent.cpuHistory.slice(1), newCpu];
          const newRamHist = [...agent.ramHistory.slice(1), newRam];
          const newIoHist = [...agent.diskIoHistory.slice(1), newIo];

          // Determine bottleneck status dynamically
          let status = agent.status;
          let bottleneckReason = agent.bottleneckReason;

          if (newCpu > 90 || newRam > 92 || newIo > 700) {
            status = "bottlenecked";
            const reasons: string[] = [];
            if (newCpu > 90) reasons.push(`High CPU (${newCpu}%)`);
            if (newRam > 92) reasons.push(`High RAM (${newRam}%)`);
            if (newIo > 700) reasons.push(`High Disk I/O (${newIo} MB/s)`);
            bottleneckReason = reasons.join(" & ");
          } else if (newCpu < 15) {
            status = "idle";
            bottleneckReason = undefined;
          } else {
            status = "active";
            bottleneckReason = undefined;
          }

          return {
            ...agent,
            cpuHistory: newCpuHist,
            ramHistory: newRamHist,
            diskIoHistory: newIoHist,
            status,
            bottleneckReason
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isLivePolling]);

  // Selected agent object
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Calculated aggregate statistics across cluster
  const activeCount = agents.filter((a) => a.status === "active").length;
  const bottleneckCount = agents.filter((a) => a.status === "bottlenecked").length;
  const avgClusterCpu = Math.round(
    agents.reduce((acc, a) => acc + a.cpuHistory[a.cpuHistory.length - 1], 0) / agents.length
  );
  const avgClusterRam = Math.round(
    agents.reduce((acc, a) => acc + a.ramHistory[a.ramHistory.length - 1], 0) / agents.length
  );
  const totalDiskIo = agents.reduce((acc, a) => acc + a.diskIoHistory[a.diskIoHistory.length - 1], 0);

  // Filtered list
  const filteredAgents = agents.filter((a) => {
    if (filterStatus === "all") return true;
    return a.status === filterStatus;
  });

  // SVG Sparkline Helper
  const renderSparkline = (data: number[], maxVal: number = 100, color: string = "#6366f1") => {
    const width = 120;
    const height = 28;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - (val / maxVal) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border transition-all ${
      mode === "dark" ? "bg-[#09090c] border-white/10" : "bg-white border-gray-200 shadow-sm"
    }`}>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Gauge className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-black tracking-tight ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {isZh ? "Runner 算力资源实时监控器" : "Runner Resource Monitor"}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                isLivePolling 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLivePolling ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                {isLivePolling ? (isZh ? "实时流" : "LIVE STREAM") : (isZh ? "已暂停" : "PAUSED")}
              </span>
            </div>
            <p className={`text-[11px] font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {isZh ? "监控并行编译 Worker 节点的 CPU、内存及 Disk I/O 负载瓶颈" : "Monitor CPU, RAM, & Disk I/O bottlenecks across active build agents"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filters */}
          <div className={`flex rounded-xl p-0.5 text-[10px] font-mono border ${
            mode === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
          }`}>
            {(["all", "active", "bottlenecked"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-indigo-600 text-white shadow-sm"
                    : mode === 'dark' ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {st === "all" ? (isZh ? "全部" : "ALL") : st === "active" ? (isZh ? "运行中" : "ACTIVE") : (isZh ? "瓶颈卡顿" : "BOTTLENECKED")}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLivePolling(!isLivePolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
              isLivePolling
                ? mode === 'dark' ? "bg-gray-900 border-gray-800 text-gray-300 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                : "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            }`}
          >
            {isLivePolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLivePolling ? (isZh ? "暂停轮询" : "Pause") : (isZh ? "恢复轮询" : "Resume")}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cluster Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={`p-3.5 rounded-2xl border ${
          mode === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-[9px] font-mono uppercase mb-1 flex items-center gap-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            <Cpu className="w-3 h-3 text-indigo-400" />
            {isZh ? "集群平均 CPU 负载" : "Cluster CPU Load"}
          </div>
          <div className={`text-xl font-black ${mode === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>{avgClusterCpu}%</div>
          <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${avgClusterCpu}%` }} />
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          mode === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-[9px] font-mono uppercase mb-1 flex items-center gap-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            <Activity className="w-3 h-3 text-emerald-400" />
            {isZh ? "集群平均 RAM 占用" : "Cluster RAM Usage"}
          </div>
          <div className="text-xl font-black text-emerald-500">{avgClusterRam}%</div>
          <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgClusterRam}%` }} />
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          mode === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-[9px] font-mono uppercase mb-1 flex items-center gap-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            <HardDrive className="w-3 h-3 text-purple-400" />
            {isZh ? "集群 Disk I/O 吞吐" : "Disk I/O Throughput"}
          </div>
          <div className={`text-xl font-black ${mode === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>{totalDiskIo} <span className="text-xs text-gray-500">MB/s</span></div>
          <div className="text-[9px] text-gray-500 font-mono mt-1">Parallel baking reads/writes</div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          mode === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-[9px] font-mono uppercase mb-1 flex items-center gap-1 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            {isZh ? "瓶颈警告节点" : "Bottleneck Alerts"}
          </div>
          <div className="text-xl font-black text-amber-500 flex items-center gap-1.5">
            {bottleneckCount}
            {bottleneckCount > 0 && <span className="text-xs bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-500 font-mono font-bold">HIGH</span>}
          </div>
          <div className="text-[9px] text-gray-500 font-mono mt-1">
            {bottleneckCount > 0 ? (isZh ? "需要干预或降低并发" : "Recommend thread rebalance") : (isZh ? "无严重阻塞" : "Optimal throughput")}
          </div>
        </div>
      </div>

      {/* Agents Resource List Grid */}
      <div className="space-y-3 mb-6">
        <div className={`flex items-center justify-between text-xs font-bold px-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
          <span>{isZh ? "活跃 Task Agent 节点与实时负载" : "Active Agent Nodes & Live Telemetry"}</span>
          <span className="text-[10px] font-mono text-gray-500">
            {isZh ? "点击节点卡片查看详细资源瓶颈与建议" : "Click agent card to inspect resource bottleneck details"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredAgents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            const lastCpu = agent.cpuHistory[agent.cpuHistory.length - 1];
            const lastRam = agent.ramHistory[agent.ramHistory.length - 1];
            const lastIo = agent.diskIoHistory[agent.diskIoHistory.length - 1];

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? mode === 'dark' 
                      ? "bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/10"
                      : "bg-indigo-50/80 border-indigo-500 shadow-md shadow-indigo-500/10"
                    : mode === 'dark'
                      ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      agent.status === "bottlenecked" 
                        ? "bg-amber-400 animate-ping" 
                        : agent.status === "active" 
                        ? "bg-emerald-400" 
                        : "bg-gray-500"
                    }`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold truncate ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{agent.name}</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                          mode === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {agent.type}
                        </span>
                      </div>
                      {agent.activeJob && (
                        <p className={`text-[10px] truncate font-mono mt-0.5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          ⚡ {agent.activeJob}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                    agent.status === "bottlenecked"
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                  }`}>
                    {agent.status}
                  </span>
                </div>

                {/* Real-time Telemetry Sparklines Row */}
                <div className={`grid grid-cols-3 gap-3 pt-3 border-t ${mode === 'dark' ? 'border-gray-800/60' : 'border-gray-200'}`}>
                  {/* CPU Metric */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}>CPU</span>
                      <span className={`font-bold ${lastCpu > 85 ? "text-amber-500" : mode === 'dark' ? "text-gray-200" : "text-gray-800"}`}>{lastCpu}%</span>
                    </div>
                    {renderSparkline(agent.cpuHistory, 100, lastCpu > 85 ? "#f59e0b" : "#6366f1")}
                  </div>

                  {/* RAM Metric */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}>RAM</span>
                      <span className={`font-bold ${lastRam > 90 ? "text-rose-500" : mode === 'dark' ? "text-gray-200" : "text-gray-800"}`}>{lastRam}%</span>
                    </div>
                    {renderSparkline(agent.ramHistory, 100, lastRam > 90 ? "#f43f5e" : "#10b981")}
                  </div>

                  {/* Disk I/O Metric */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Disk I/O</span>
                      <span className={`font-bold ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{lastIo} <span className="text-[8px] text-gray-500">MB/s</span></span>
                    </div>
                    {renderSparkline(agent.diskIoHistory, 900, "#a855f7")}
                  </div>
                </div>

                {/* Bottleneck Warning Flag */}
                {agent.bottleneckReason && (
                  <div className={`mt-3 p-2 rounded-xl text-[10px] flex items-center gap-1.5 ${
                    mode === 'dark' ? 'bg-amber-950/30 border border-amber-800/40 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                    <span className="truncate"><strong>Bottleneck:</strong> {agent.bottleneckReason}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Agent Detailed Bottleneck Diagnostic Panel */}
      {selectedAgent && (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          mode === 'dark' ? 'bg-gray-900 border-indigo-500/30' : 'bg-indigo-50/40 border-indigo-200'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${mode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h4 className={`text-xs font-bold ${mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                {isZh ? `节点瓶颈诊断 & 优化对策: ${selectedAgent.name}` : `Bottleneck Diagnostics & Optimization: ${selectedAgent.name}`}
              </h4>
            </div>

            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              {expandedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expandedDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Parallel Job Thread Load */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                mode === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="text-[10px] font-mono uppercase text-gray-500 flex justify-between">
                  <span>{isZh ? "并行构建线程队列" : "Parallel Job Threads"}</span>
                  <span className="text-indigo-500 font-bold">{selectedAgent.parallelJobsCount} / {selectedAgent.maxParallelJobs}</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${(selectedAgent.parallelJobsCount / selectedAgent.maxParallelJobs) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-mono">
                  {selectedAgent.parallelJobsCount >= selectedAgent.maxParallelJobs 
                    ? (isZh ? "⚠️ 线程池达到最大核上限，后序步骤开始排队" : "⚠️ Thread pool saturated; subsequent steps queued.")
                    : (isZh ? "线程空间充足，支持并行扩展" : "Headroom available for additional build workers.")}
                </p>
              </div>

              {/* Disk Capacity */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                mode === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="text-[10px] font-mono uppercase text-gray-500 flex justify-between">
                  <span>{isZh ? "磁盘容量占用" : "Disk Storage Capacity"}</span>
                  <span className="text-purple-500 font-bold">{selectedAgent.diskSpaceUsedGb}GB / {selectedAgent.diskSpaceTotalGb}GB</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${(selectedAgent.diskSpaceUsedGb / selectedAgent.diskSpaceTotalGb) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-mono">
                  {isZh ? "预留 50GB 用于 Asset Bundle & DDC 缓存" : "50GB reserved for intermediate DDC & Gradle cache."}
                </p>
              </div>

              {/* Optimization Recommendation */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                mode === 'dark' ? 'bg-indigo-950/30 border-indigo-900/40 text-gray-300' : 'bg-white border-indigo-200 text-gray-800 shadow-sm'
              }`}>
                <div className="text-[10px] font-mono uppercase text-indigo-500 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {isZh ? "AI 调度优化建议" : "AI Optimization Action"}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedAgent.status === "bottlenecked"
                    ? (isZh ? "建议降低并发 Shader 烘焙通道或开启分布式编译节点分流。" : "Cap worker concurrency thread count to prevent IOPS throttling.")
                    : (isZh ? "节点健康度优异，维持当前并行并发设置。" : "Agent health is nominal. Current throughput is optimal.")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
