import React, { useState, useEffect } from "react";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { useLanguage } from "../../LanguageContext";
import { useToast } from "../ToastContext";
import { useWorkspace } from "../../WorkspaceContext";
import { useUser } from "../../UserContext";
import RunnerResourceMonitor from "../RunnerResourceMonitor";

interface RunnerNode {
  id: string;
  name: string;
  status: "idle" | "busy" | "offline" | "maintenance";
  ip: string;
  region: string;
  type: "bare-metal" | "vm" | "container";
  specs: {
    cpu: string;
    ram: string;
    gpu?: string;
  };
  utilization: {
    cpu: number;
    ram: number;
    temp: number;
  };
  tags: string[];
  lastJob?: string;
}

const INITIAL_RUNNERS: RunnerNode[] = [
  {
    id: "r-01",
    name: "RUNNER-PROD-01",
    status: "busy",
    ip: "10.0.4.12",
    region: "us-east1",
    type: "bare-metal",
    specs: { cpu: "AMD EPYC 96-Core", ram: "512GB", gpu: "NVIDIA A100" },
    utilization: { cpu: 82, ram: 45, temp: 62 },
    tags: ["unreal", "cooker", "gpu"],
    lastJob: "Bake Project X - 14:10"
  },
  {
    id: "r-02",
    name: "RUNNER-PROD-02",
    status: "idle",
    ip: "10.0.4.13",
    region: "us-east1",
    type: "vm",
    specs: { cpu: "Intel Xeon 32-Core", ram: "128GB" },
    utilization: { cpu: 4, ram: 12, temp: 42 },
    tags: ["unity", "android", "ios"],
    lastJob: "Unity Build Android - 12:45"
  },
  {
    id: "r-03",
    name: "RUNNER-STG-01",
    status: "busy",
    ip: "10.0.8.44",
    region: "eu-central1",
    type: "container",
    specs: { cpu: "8-Core Shared", ram: "32GB" },
    utilization: { cpu: 94, ram: 88, temp: 55 },
    tags: ["backend", "go", "test"],
    lastJob: "K8s Deployment Test - 15:30"
  },
  {
    id: "r-04",
    name: "RUNNER-OFFLINE-01",
    status: "offline",
    ip: "10.0.4.55",
    region: "us-west2",
    type: "vm",
    specs: { cpu: "16-Core", ram: "64GB" },
    utilization: { cpu: 0, ram: 0, temp: 0 },
    tags: ["archived"],
  }
];

export default function RunnerPools() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const { activeWorkspace } = useWorkspace();
  const engine = activeWorkspace?.projectType || 'web';
  const { hasPermission } = useUser();
  const isZh = language === "zh";

  const [runners, setRunners] = useState<RunnerNode[]>(INITIAL_RUNNERS);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cloud Build Cost Estimator States
  const [buildDuration, setBuildDuration] = useState<number>(30); // in minutes
  const [buildsPerDay, setBuildsPerDay] = useState<number>(20); // triggers per day
  const [workerGrade, setWorkerGrade] = useState<"std" | "high" | "gpu">("high");

  const hourlyRates = {
    std: 0.18,
    high: 0.52,
    gpu: 2.15
  };

  const calculateCosts = () => {
    const ratePerMin = hourlyRates[workerGrade] / 60;
    const dailyMinutes = buildDuration * buildsPerDay;
    const dailyCost = dailyMinutes * ratePerMin;
    const monthlyCost = dailyCost * 30.4;
    const spotSavings = monthlyCost * 0.65; // 65% discount on Spot VM instances
    const netCost = monthlyCost - spotSavings;

    return {
      daily: dailyCost.toFixed(2),
      monthly: monthlyCost.toFixed(2),
      savings: spotSavings.toFixed(2),
      net: netCost.toFixed(2)
    };
  };

  const costs = calculateCosts();

  useEffect(() => {
    const engineType = activeWorkspace?.projectType || 'web';
    let newRunners: RunnerNode[] = [];

    if (engineType === 'unreal' || engineType === 'unity') {
      newRunners = [
        {
          id: "r-01", name: "RUNNER-PROD-01", status: "busy", ip: "10.0.4.12", region: "us-east1", type: "bare-metal",
          specs: { cpu: "AMD EPYC 96-Core", ram: "512GB", gpu: "NVIDIA A100" },
          utilization: { cpu: 82, ram: 45, temp: 62 }, tags: [engineType, "cooker", "gpu"], lastJob: "Bake Project X - 14:10"
        },
        {
          id: "r-02", name: "RUNNER-PROD-02", status: "idle", ip: "10.0.4.13", region: "us-east1", type: "vm",
          specs: { cpu: "Intel Xeon 32-Core", ram: "128GB" },
          utilization: { cpu: 4, ram: 12, temp: 42 }, tags: [engineType, "android", "ios"], lastJob: "Build Mobile - 12:45"
        }
      ];
    } else if (engineType === 'mobile') {
      newRunners = [
        {
          id: "r-m01", name: "MAC-BUILD-01", status: "busy", ip: "192.168.1.10", region: "us-west1", type: "bare-metal",
          specs: { cpu: "Apple M2 Ultra", ram: "192GB" },
          utilization: { cpu: 90, ram: 60, temp: 70 }, tags: ["ios", "xcode", "fastlane"], lastJob: "AppStore Release - 10:20"
        },
        {
          id: "r-m02", name: "DROID-BUILD-02", status: "idle", ip: "10.0.2.14", region: "eu-central1", type: "vm",
          specs: { cpu: "32-Core Shared", ram: "64GB" },
          utilization: { cpu: 5, ram: 20, temp: 45 }, tags: ["android", "gradle"], lastJob: "PlayStore Beta - 09:15"
        }
      ];
    } else {
      newRunners = [
        {
          id: "r-w01", name: "K8S-WORKER-01", status: "busy", ip: "10.0.8.44", region: "eu-central1", type: "container",
          specs: { cpu: "8-Core Shared", ram: "32GB" },
          utilization: { cpu: 94, ram: 88, temp: 55 }, tags: [engineType, "test", "docker"], lastJob: "K8s Deployment Test - 15:30"
        },
        {
          id: "r-w02", name: "K8S-WORKER-02", status: "idle", ip: "10.0.8.45", region: "eu-central1", type: "container",
          specs: { cpu: "8-Core Shared", ram: "32GB" },
          utilization: { cpu: 2, ram: 10, temp: 35 }, tags: [engineType, "prod", "docker"], lastJob: "Image Scan - 14:00"
        }
      ];
    }
    
    newRunners.push({
      id: "r-off-01", name: "RUNNER-OFFLINE", status: "offline", ip: "10.0.4.55", region: "us-west2", type: "vm",
      specs: { cpu: "16-Core", ram: "64GB" },
      utilization: { cpu: 0, ram: 0, temp: 0 }, tags: ["archived"],
    });

    setRunners(newRunners);
  }, [activeWorkspace]);

  const canManageNodes = hasPermission("manage_nodes");

  // Filter runners based on search and current engine context
  const filteredRunners = runners.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                         r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast(isZh ? "执行节点状态已同步" : "Runner node states synchronized", "success");
    }, 1000);
  };

  const getStatusColor = (status: RunnerNode["status"]) => {
    switch (status) {
      case "busy": return "bg-amber-500";
      case "idle": return "bg-emerald-500";
      case "maintenance": return "bg-blue-500";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Panel */}
      <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
              {isZh ? "基础设施管理" : "INFRASTRUCTURE"}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">v1.2.0-cluster</span>
          </div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            {isZh ? "编译执行机集群 (Runner Pools)" : "Build Runner Clusters (Pools)"}
          </h2>
          <p className="text-xs text-gray-400 max-w-2xl">
            {isZh 
              ? "实时监控全球分布的物理机与虚拟机集群。管理专为游戏烘焙、后端编译优化的异构计算节点。" 
              : "Live monitoring of globally distributed physical and virtual runner pools. Manage heterogeneous computing nodes optimized for game baking and backend compilation."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input 
              type="text"
              placeholder={isZh ? "搜索节点或标签..." : "Search nodes or tags..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl text-gray-400 hover:text-indigo-400 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isZh ? "在线节点" : "Active Nodes", value: "14 / 16", icon: CheckCircle2, color: "text-emerald-400" },
          { label: isZh ? "平均负载" : "Avg Cluster Load", value: "64.2%", icon: Activity, color: "text-indigo-400" },
          { label: isZh ? "当前队列" : "Current Queue", value: "3 Jobs", icon: Clock, color: "text-amber-400" },
          { label: isZh ? "总算力 (PFLOPS)" : "Total Compute", value: "2.4", icon: Zap, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-950 border border-gray-900 p-4 rounded-xl flex items-center gap-4">
            <div className={`p-2.5 rounded-lg bg-gray-900 border border-gray-800 ${stat.color}`}>
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-bold text-gray-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Resource Management & Optimization Core */}
      <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 uppercase tracking-widest">
             <Cpu className="h-4 w-4 text-emerald-500" />
             {isZh ? "资源调度与性能优化中心" : "Resource Scheduling & Performance Optimization"}
           </h3>
           <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase">AI_Orchestration_Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Smart Scheduling */}
           <div className="space-y-4">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-b border-gray-900 pb-2">{isZh ? "智能资源调度管控" : "Intelligent Resource Scheduling"}</h4>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-start gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition-all text-left">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-gray-200">{isZh ? "动态按需调度" : "Dynamic Scheduling"}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{isZh ? "按当前构建负载自动分配闲置算力" : "Auto-allocate compute based on load"}</span>
                 </button>
                 <button className="flex flex-col items-start gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-emerald-500/50 transition-all text-left">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-gray-200">{isZh ? "构建缓存管控" : "Build Cache Mgr"}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{isZh ? "管理中间产物缓存，降低冷启成本" : "Reduce cold starts via build cache"}</span>
                 </button>
                 <button className="flex flex-col items-start gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-all text-left">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-gray-200">{isZh ? "闲置资源回收" : "Idle Recovery"}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{isZh ? "自动释放低活跃团队预留实例" : "Auto-release unused runner instances"}</span>
                 </button>
                 <button className="flex flex-col items-start gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all text-left">
                    <HardDrive className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold text-gray-200">{isZh ? "成本与利用率分析" : "Utilization Report"}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{isZh ? "按项目生成算力消耗及成本视图" : "Project-level cost & usage views"}</span>
                 </button>
              </div>
           </div>

           {/* Performance Optimization */}
           <div className="space-y-4">
              <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-b border-gray-900 pb-2">{isZh ? "构建性能优化建议" : "Performance Optimization Insights"}</h4>
              <div className="space-y-3">
                 <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="h-4 w-4 text-indigo-400" />
                       <div>
                         <div className="text-xs font-bold text-indigo-100">{isZh ? "并行构建策略" : "Multi-Thread Strategy"}</div>
                         <div className="text-[9px] text-indigo-300">{isZh ? "推荐开启 Shader 编译多通道并行" : "Suggest enabling multi-pass shader compilation"}</div>
                       </div>
                    </div>
                    <button className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/40">Apply</button>
                 </div>
                 <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Terminal className="h-4 w-4 text-emerald-400" />
                       <div>
                         <div className="text-xs font-bold text-emerald-100">{isZh ? "失败快照恢复" : "Failure Snapshot & Recovery"}</div>
                         <div className="text-[9px] text-emerald-300">{isZh ? "检测到近期失败，可从快照点快速还原" : "Recent failure detected, restore from snapshot"}</div>
                       </div>
                    </div>
                    <button className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/40">Restore</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Real-time Runner Resource Monitor Widget */}
      <RunnerResourceMonitor />

      {/* Runners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRunners.map((runner) => (
          <div 
            key={runner.id} 
            className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden hover:border-gray-800 transition-all group"
          >
            <div className="p-5 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`mt-1 h-3 w-3 rounded-full ${getStatusColor(runner.status)} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                      {runner.name}
                    </h3>
                    <span className="text-[9px] bg-gray-900 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                      {runner.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {runner.ip}
                    </span>
                    <span className="flex items-center gap-1 uppercase">
                      <Zap className="h-3 w-3" />
                      {runner.region}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                {runner.tags.map(tag => (
                  <span key={tag} className="text-[8px] bg-gray-900 text-gray-500 px-1.5 py-0.5 rounded border border-gray-800/50 uppercase font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics Bars */}
            <div className="px-5 pb-5 grid grid-cols-3 gap-4 border-b border-gray-900/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase">
                  <span>CPU</span>
                  <span>{runner.utilization.cpu}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${runner.utilization.cpu > 80 ? "bg-red-500" : "bg-indigo-500"}`} 
                    style={{ width: `${runner.utilization.cpu}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase">
                  <span>RAM</span>
                  <span>{runner.utilization.ram}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${runner.utilization.ram}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase">
                  <span>TEMP</span>
                  <span>{runner.utilization.temp}°C</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${runner.utilization.temp > 60 ? "bg-amber-500" : "bg-blue-500"}`} 
                    style={{ width: `${(runner.utilization.temp / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer / Specs */}
            <div className="px-5 py-3 bg-gray-900/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  {runner.specs.cpu}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" />
                  {runner.specs.ram}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  disabled={!canManageNodes}
                  className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    canManageNodes 
                      ? "text-indigo-400 hover:bg-indigo-500/10 cursor-pointer" 
                      : "text-gray-600 cursor-not-allowed opacity-50"
                  }`}
                  title={!canManageNodes ? (isZh ? "只有运维专家可操作" : "Ops only") : undefined}
                >
                  <RefreshCw className="h-3 w-3" />
                  {isZh ? "维护" : "MAINT"}
                </button>
                <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors">
                  {isZh ? "节点详情" : "DETAILS"}
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud Build Cost Estimator Tool */}
      <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 space-y-6 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
              {isZh ? "算力成本规划器" : "FINANCIAL OPTIMIZATION"}
            </span>
            <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-400" />
              {isZh ? "弹性云构建成本估算工具" : "Cloud Build Cost Estimator"}
            </h3>
            <p className="text-xs text-gray-400">
              {isZh ? "根据实际编译频率、单次时长与节点规格，自动算出每月运行预算。" : "Estimate your monthly cluster infrastructure cost based on build durations and trigger frequencies."}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-900/40 border border-gray-950 px-3 py-1.5 rounded-xl">
            <span>{isZh ? "费率基准: 现货实例" : "Rate Card: Spot Pricing"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Build duration slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 font-bold">{isZh ? "平均构建时长 (分钟)" : "Avg Build Duration (Minutes)"}</span>
                <span className="text-emerald-400 font-black">{buildDuration} {isZh ? "分钟" : "min"}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="180" 
                step="5"
                value={buildDuration}
                onChange={(e) => setBuildDuration(Number(e.target.value))}
                className="w-full h-1 bg-gray-805 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-gray-800"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>5m (Web/App)</span>
                <span>60m (Unity APK)</span>
                <span>180m (Unreal Win64)</span>
              </div>
            </div>

            {/* Builds per day slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 font-bold">{isZh ? "每日触发频率 (次)" : "Daily Build Triggers"}</span>
                <span className="text-emerald-400 font-black">{buildsPerDay} {isZh ? "次/日" : "builds/day"}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="250" 
                step="1"
                value={buildsPerDay}
                onChange={(e) => setBuildsPerDay(Number(e.target.value))}
                className="w-full h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer accent-emerald-500 bg-gray-800"
              />
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>1 build/day</span>
                <span>50 triggers</span>
                <span>250 triggers (High-Frequency CI)</span>
              </div>
            </div>

            {/* Worker node tier grade selection */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-gray-300 font-bold block">{isZh ? "计算节点规格 / 机器层级" : "Compute Worker Specifications"}</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "std" as const, label: isZh ? "标准通用" : "Standard", spec: "8-Core VM", rate: "$0.18/hr" },
                  { id: "high" as const, label: isZh ? "性能先锋" : "High-CPU", spec: "32-Core VM", rate: "$0.52/hr" },
                  { id: "gpu" as const, label: isZh ? "GPU 异构" : "GPU Bake", spec: "NVIDIA A10G", rate: "$2.15/hr" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setWorkerGrade(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      workerGrade === tier.id 
                        ? "bg-emerald-950/20 border-emerald-500 text-emerald-200" 
                        : "bg-gray-900/40 border-gray-900 hover:border-gray-800 text-gray-400"
                    }`}
                  >
                    <p className="text-xs font-black">{tier.label}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{tier.spec}</p>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold mt-1.5">{tier.rate}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gray-900/40 border border-gray-900 p-5 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{isZh ? "预计财务成本账单" : "PROJECTED MONTHLY BILL"}</span>
            
            <div className="space-y-0.5">
              <p className="text-3xl font-black text-emerald-400 font-mono">${costs.net}</p>
              <p className="text-[10px] text-gray-500">{isZh ? "包含自动 Spot 实例节省 65%" : "With 65% automatic Spot-Instance routing discount"}</p>
            </div>

            <div className="h-px bg-gray-900" />

            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>{isZh ? "单次编译成本:" : "Cost per build:"}</span>
                <span className="text-gray-200">${((hourlyRates[workerGrade] / 60) * buildDuration).toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{isZh ? "每日累计成本:" : "Daily raw costs:"}</span>
                <span className="text-gray-200">${costs.daily}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{isZh ? "标准按需月价:" : "Standard On-Demand monthly:"}</span>
                <span className="text-rose-400/90 line-through">${costs.monthly}</span>
              </div>
              <div className="flex justify-between text-emerald-400 bg-emerald-950/20 border border-emerald-950/40 p-2 rounded-lg text-xs font-bold">
                <span>{isZh ? "多云 Spot 调度立省:" : "Auto-Spot Saved:"}</span>
                <span>-${costs.savings}</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-gray-500 leading-normal font-sans italic">
              {isZh 
                ? "* 以上测算包含免费额度抵扣。多云环境下各地域 Spot 实例竞价可能会有 ±5% 的小幅波动。" 
                : "* Estimates include free tier allocations. Real-time Spot spot pricing may vary slightly across cloud regions (±5%)."}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-xl flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-400 flex-shrink-0" />
        <p className="text-xs text-gray-400">
          <strong className="text-indigo-300">{isZh ? "自动弹性扩容已启用：" : "Auto-scaling is active:"}</strong>
          {isZh 
            ? " 集群将根据实时编译任务队列深度自动调度 Spot 实例。当前预计节省 42% 的月度基础设施成本。" 
            : " The cluster will automatically schedule Spot instances based on job queue depth. Current monthly infrastructure savings estimated at 42%."}
        </p>
      </div>
    </div>
  );
}
