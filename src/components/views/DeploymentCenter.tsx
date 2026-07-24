import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Filter, 
  Search, 
  MoreVertical, 
  Activity, 
  Server, 
  Cloud, 
  ChevronRight, 
  Globe, 
  Smartphone, 
  Gamepad2, 
  Plus,
  RefreshCw,
  Play,
  GitBranch,
  Check,
  FileText,
  ShieldCheck
} from "lucide-react";
import ComplianceDashboard from "../ComplianceDashboard";
import RunnerScaler from "../RunnerScaler";
import PolicyAudit from "../PolicyAudit";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../LanguageContext";
import { DeploymentRecord } from "../../types";
import { useToast } from "../ToastContext";
import { useWorkspace } from "../../WorkspaceContext";

const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: "dep-001",
    version: "v2.4.0-rc.1",
    environment: "production",
    status: "success",
    deployedBy: "system-auto",
    deployedAt: "2024-03-20 14:30",
    platform: "docker",
    releaseNotes: "Critical security patch and performance optimizations."
  },
  {
    id: "dep-002",
    version: "v2.3.5",
    environment: "staging",
    status: "running",
    deployedBy: "alex.w",
    deployedAt: "2024-03-20 16:15",
    platform: "k8s",
    releaseNotes: "Feature: New analytics dashboard integration."
  },
  {
    id: "dep-003",
    version: "v2.3.4",
    environment: "internal",
    status: "failed",
    deployedBy: "dev-bot",
    deployedAt: "2024-03-20 10:00",
    platform: "linux",
    releaseNotes: "Experiment: New compression algorithm."
  },
  {
    id: "dep-004",
    version: "v2.3.3",
    environment: "production",
    status: "success",
    deployedBy: "sarah.j",
    deployedAt: "2024-03-19 09:20",
    platform: "web",
    releaseNotes: "UI Refresh and bug fixes for the core editor."
  }
];

export default function DeploymentCenter() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const { addToast } = useToast();
  const { activeWorkspace } = useWorkspace();
  
  const [search, setSearch] = useState("");
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [isDeploying, setIsDeploying] = useState(false);

  // ArgoCD GitOps Sync Manager states
  const [argoApps, setArgoApps] = useState([
    { id: "app-1", name: "auth-service", status: "Synced", health: "Healthy", destination: "gke-devops-hub-prod/auth", repo: "git@github.com:devops-hub/infra-gitops.git", revision: "v2.4.0", driftCount: 0 },
    { id: "app-2", name: "matchmaker-service", status: "OutOfSync", health: "Healthy", destination: "gke-devops-hub-prod/matchmaker", repo: "git@github.com:devops-hub/infra-gitops.git", revision: "v2.4.1-rc.2", driftCount: 1 },
    { id: "app-3", name: "game-server-manager", status: "Synced", health: "Progressing", destination: "gke-devops-hub-prod/gsm", repo: "git@github.com:devops-hub/infra-gitops.git", revision: "v2.3.9", driftCount: 0 },
  ]);
  const [isArgoSyncing, setIsArgoSyncing] = useState(false);
  const [argoLogs, setArgoLogs] = useState<string[]>([]);
  const [showArgoDiff, setShowArgoDiff] = useState(false);

  // Real-time ArgoCD API state
  const [isArgoPolling, setIsArgoPolling] = useState(false);
  const [lastArgoApiPoll, setLastArgoApiPoll] = useState<string>(new Date().toLocaleTimeString());

  const pollArgoCDApi = () => {
    setIsArgoPolling(true);
    setTimeout(() => {
      setIsArgoPolling(false);
      setLastArgoApiPoll(new Date().toLocaleTimeString());
    }, 600);
  };

  useEffect(() => {
    const pollInterval = setInterval(() => {
      pollArgoCDApi();
    }, 8000);
    return () => clearInterval(pollInterval);
  }, []);

  const globalSyncStatus = argoApps.some(app => app.status === "OutOfSync") ? "OutOfSync" : "Synced";

  const triggerArgoSync = (appId: string) => {
    setIsArgoSyncing(true);
    addToast(isZh ? "正在触发 ArgoCD 同步..." : "Triggering ArgoCD GitOps sync...", "info");
    setArgoLogs([
      "⏳ Initiating GitOps synchronisation webhook...",
      "🔍 Resolving target revision (HEAD -> revision: a8f0c90)...",
      "📦 Comparing local cluster live state with Git repository manifests..."
    ]);

    let i = 0;
    const syncLogs = [
      "⚠️ Drift detected on matchmaker-service deployment manifest.",
      "🔄 Syncing 1 resource: matchmaker-service-deployment (v1/apps/Deployment)",
      "✓ Kubernetes Deployment patched successfully.",
      "⏳ Waiting for rollout progression of replica set...",
      "✓ Health status: HEALTHY (3/3 pods active)",
      "✨ GitOps synchronization finished! ArgoCD Status is now: SYNCED"
    ];

    const interval = setInterval(() => {
      if (i < syncLogs.length) {
        setArgoLogs(prev => [...prev, syncLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setArgoApps(prev => prev.map(app => {
          if (app.id === appId) {
            return { ...app, status: "Synced", health: "Healthy", driftCount: 0 };
          }
          return app;
        }));
        setIsArgoSyncing(false);
        addToast(isZh ? "ArgoCD GitOps 同步对齐成功！" : "ArgoCD GitOps deployment aligned successfully!", "success");
      }
    }, 1200);
  };

  // Ref to track previous deployments for safe toast notifications upon status transition
  const prevDeploymentsRef = React.useRef<DeploymentRecord[]>(deployments);

  // Separate effect to handle Toast notifications when deployment status changes, keeping state updaters pure
  useEffect(() => {
    const prevDeps = prevDeploymentsRef.current;
    deployments.forEach(dep => {
      const prevDep = prevDeps.find(d => d.id === dep.id);
      if (prevDep && prevDep.status === "running" && dep.status !== "running") {
        if (dep.status === "success") {
          addToast(isZh ? `部署成功: ${dep.version}` : `Deployment successful: ${dep.version}`, "success");
        } else if (dep.status === "failed") {
          addToast(isZh ? `部署失败: ${dep.version}` : `Deployment failed: ${dep.version}`, "error");
        }
      }
    });
    prevDeploymentsRef.current = deployments;
  }, [deployments, isZh, addToast]);

  // Simulate active deployments finishing
  useEffect(() => {
    const interval = setInterval(() => {
      setDeployments(prev => {
        const hasRunning = prev.some(d => d.status === 'running');
        if (!hasRunning) {
          setIsDeploying(false);
          return prev;
        }

        return prev.map(dep => {
          if (dep.status === 'running') {
            const isSuccess = Math.random() > 0.2; // 80% success rate
            return {
              ...dep,
              status: isSuccess ? 'success' : 'failed'
            };
          }
          return dep;
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerNewDeployment = () => {
    if (isDeploying) {
      addToast(isZh ? "已有部署在进行中" : "A deployment is already running", "warning");
      return;
    }

    setIsDeploying(true);
    addToast(isZh ? "正在初始化新部署..." : "Initializing new deployment...", "info");

    const envs = ["staging", "production", "internal"] as const;
    const env = envs[Math.floor(Math.random() * envs.length)];
    const platforms = ["k8s", "docker", "web", "linux"] as const;
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    
    // Generate version bump
    const lastVersion = deployments[0].version.replace('v', '').split('-');
    const parts = lastVersion[0].split('.');
    const newVersion = `v${parts[0]}.${parts[1]}.${parseInt(parts[2] || "0") + 1}`;

    const newDep: DeploymentRecord = {
      id: `dep-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      version: newVersion,
      environment: env,
      status: "running",
      deployedBy: "current_user",
      deployedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      platform,
      releaseNotes: "Automated trigger deployment"
    };

    setDeployments(prev => [newDep, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "running": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "failed": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getEnvColor = (env: string) => {
    switch (env) {
      case "production": return "text-rose-400 border-rose-500/30";
      case "staging": return "text-amber-400 border-amber-500/30";
      case "internal": return "text-indigo-400 border-indigo-500/30";
      default: return "text-gray-400 border-gray-500/30";
    }
  };

  const filteredDeployments = deployments.filter(dep => 
    dep.version.toLowerCase().includes(search.toLowerCase()) || 
    dep.releaseNotes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Rocket className="h-6 w-6 text-indigo-400" />
            {isZh ? "部署与交付中心" : "Deployment & Delivery Center"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isZh ? "管理和监控所有环境的自动化部署流水线" : "Manage and monitor automated deployment pipelines across all environments"}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            {/* ArgoCD Status Badge */}
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition-all duration-300 ${
              globalSyncStatus === "Synced" 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
                : "bg-amber-950/20 border-amber-500/30 text-amber-400"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                globalSyncStatus === "Synced" ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-bounce"
              }`} />
              <span>ArgoCD: {globalSyncStatus === "Synced" ? (isZh ? "集群已对齐" : "Synced") : (isZh ? "存在未对齐偏移" : "OutOfSync")}</span>
            </div>

            {/* API Connection & Poll Pulse */}
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
              <span className={`h-1.5 w-1.5 rounded-full bg-teal-500 ${isArgoPolling ? "animate-ping" : "animate-pulse"}`} />
              <span>API Poll: {lastArgoApiPoll}</span>
              <button 
                onClick={pollArgoCDApi} 
                disabled={isArgoPolling}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
                title={isZh ? "手动重新拉取 ArgoCD 状态" : "Manually poll ArgoCD status"}
              >
                <RefreshCw className={`h-3 w-3 ml-1 inline ${isArgoPolling ? "animate-spin" : ""}`} />
              </button>
            </div>
            <ComplianceDashboard />
            <RunnerScaler />
            <PolicyAudit />
            {/* QUALITY TESTABILITY LINK */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
              className="px-2.5 py-1 rounded-lg border bg-rose-950/20 border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-900/40 transition-colors cursor-pointer"
              title={isZh ? "工程质量与可测性指标" : "Quality & Testability Metrics"}
            >
              <ShieldCheck className="h-3 w-3" />
              <span>{isZh ? "质量度量" : "Testability"}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder={isZh ? "搜索版本、环境或人员..." : "Search versions, env, or users..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-gray-700 transition-all">
            <Filter className="h-4 w-4" />
          </button>
          <button 
            onClick={triggerNewDeployment}
            disabled={isDeploying}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isDeploying 
                ? 'bg-indigo-600/50 text-white/70 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer'
            }`}
          >
            {isDeploying ? (
              <Activity className="h-4 w-4 animate-pulse" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isZh ? "触发新部署" : "Trigger New Deployment"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: isZh ? "今日部署" : "Deployments Today", value: "24", icon: Activity, color: "text-blue-400" },
          { label: isZh ? "平均耗时" : "Avg. Duration", value: "4.2m", icon: Clock, color: "text-amber-400" },
          { label: isZh ? "成功率" : "Success Rate", value: "98.2%", icon: CheckCircle2, color: "text-emerald-400" },
          { label: isZh ? "活跃环境" : "Active Envs", value: "12", icon: Cloud, color: "text-indigo-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-950 border border-white/5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Deployment Table */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "版本号" : "VERSION"}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "环境" : "ENVIRONMENT"}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "平台" : "PLATFORM"}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "状态" : "STATUS"}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "操作人员" : "OPERATOR"}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "部署时间" : "TIMESTAMP"}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <AnimatePresence initial={false}>
                {filteredDeployments.map((dep) => (
                  <motion.tr 
                    key={dep.id} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{dep.version}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{dep.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getEnvColor(dep.environment)}`}>
                        {dep.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Server className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium uppercase">{dep.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${getStatusColor(dep.status)}`}>
                      {dep.status === "running" ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      ) : dep.status === "success" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {isZh 
                        ? (dep.status === "success" ? "成功" : dep.status === "running" ? "部署中" : "失败")
                        : dep.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                        {dep.deployedBy[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-300 font-medium">{dep.deployedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {dep.deployedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ArgoCD GitOps Sync Manager */}
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>ArgoCD GitOps Sync Manager</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isZh ? "监控 Kubernetes 集群容器编排配置漂移并执行自动化 GitOps 回滚与同步" : "Audit live Kubernetes cluster configurations against Git repo state and trigger GitOps synchronization"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                addToast(isZh ? "正在重新审计 GitOps 资源清单漂移..." : "Polling ArgoCD applications manifest drift...", "info");
              }}
              className="p-2 bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
              title={isZh ? "刷新清单状态" : "Refresh ArgoCD manifests"}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isZh ? "拉取漂移状态" : "Audit Drift"}</span>
            </button>
            <button
              onClick={() => setShowArgoDiff(!showArgoDiff)}
              className={`p-2 border rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 font-semibold ${
                showArgoDiff 
                  ? "bg-indigo-950/40 border-indigo-505 text-indigo-300"
                  : "bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{showArgoDiff ? (isZh ? "关闭 Diff 视图" : "Hide Diff") : (isZh ? "查看漂移 Diff" : "Inspect Diff")}</span>
            </button>
          </div>
        </div>

        {/* GitOps Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {argoApps.map((app) => {
            const isAppOutOfSync = app.status === "OutOfSync";
            const isAppProgressing = app.health === "Progressing";
            
            return (
              <div 
                key={app.id} 
                className={`bg-gray-950/50 border rounded-xl p-4.5 space-y-3.5 relative transition-all ${
                  isAppOutOfSync 
                    ? "border-amber-505/20 hover:border-amber-505/30 shadow-md shadow-amber-950/5" 
                    : "border-gray-800/80 hover:border-gray-800"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white font-mono truncate">{app.name}</h4>
                    <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                      <GitBranch className="h-3 w-3 shrink-0 text-indigo-400/70" />
                      {app.revision}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                      app.status === "Synced" 
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                        : "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Body Specs */}
                <div className="space-y-1.5 text-[11px] border-t border-gray-900 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isZh ? "集群目的地:" : "Cluster Dest:"}</span>
                    <span className="font-mono text-gray-300 font-medium">{app.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isZh ? "运行健康状态:" : "App Health:"}</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      app.health === "Healthy" 
                        ? "text-emerald-400" 
                        : isAppProgressing 
                          ? "text-blue-400" 
                          : "text-rose-400"
                    }`}>
                      {isAppProgressing && <RefreshCw className="h-2.5 w-2.5 animate-spin" />}
                      {app.health}
                    </span>
                  </div>
                </div>

                {/* Sync Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    disabled={isArgoSyncing || !isAppOutOfSync}
                    onClick={() => {
                      setShowArgoDiff(true);
                      triggerArgoSync(app.id);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      isAppOutOfSync
                        ? "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/10 active:scale-95"
                        : "bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Play className="h-3 w-3" />
                    <span>{isArgoSyncing ? (isZh ? "同步中..." : "Syncing...") : (isZh ? "同步" : "Sync")}</span>
                  </button>
                </div>

                {/* Drift Ribbon Indicator */}
                {isAppOutOfSync && (
                  <div className="absolute top-2 right-2 flex items-center justify-center h-2 w-2 rounded-full bg-amber-400">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Manifest Diff (Only visible if showArgoDiff is true) */}
        {showArgoDiff && (
          <div className="bg-gray-950 border border-gray-850 rounded-xl p-4.5 space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-900 pb-2.5">
              <span className="text-xs font-bold text-gray-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-400" />
                {isZh ? "Kubernetes 资源漂移差异比对 (Git vs. Live Cluster)" : "Manifest Drift Comparison (Git vs. Live Cluster)"}
              </span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                - deployment.yaml / matchmaker-service
              </span>
            </div>

            <div className="p-3 bg-gray-950 font-mono text-[10px] leading-relaxed rounded-lg overflow-x-auto space-y-1">
              <div className="text-gray-500">@@ -15,12 +15,12 @@ spec:</div>
              <div className="text-gray-400">   replicas:</div>
              <div className="text-rose-400 bg-rose-950/20 px-1 rounded">-    # Git Repository configuration value</div>
              <div className="text-rose-400 bg-rose-950/20 px-1 rounded">-    replicas: 4</div>
              <div className="text-emerald-400 bg-emerald-950/20 px-1 rounded">+    # Actual cluster state (manually scaled or drifted)</div>
              <div className="text-emerald-400 bg-emerald-950/20 px-1 rounded">+    replicas: 2</div>
              <div className="text-gray-400">   template:</div>
              <div className="text-gray-400">     metadata:</div>
              <div className="text-gray-400">       labels:</div>
              <div className="text-rose-400 bg-rose-950/20 px-1 rounded">-        version: "v2.4.1-rc.2"</div>
              <div className="text-emerald-400 bg-emerald-950/20 px-1 rounded">+        version: "v2.4.1-rc.1"</div>
            </div>
            <p className="text-[10px] text-amber-500 leading-normal font-sans">
              {isZh 
                ? "💡 提示：ArgoCD 发现 1 处部署清单属性发生漂移（Replica 数与版本标签在 Git 库与 K8s 集群实态不一致）。点击该应用卡片下的“Sync”按钮即可自动用 Git 清单对齐集群。" 
                : "💡 Insight: ArgoCD flagged a configuration drift. The replica size and version tag in Git does not match the live cluster. Click 'Sync' to apply repository state and re-align."}
            </p>
          </div>
        )}

        {/* ArgoCD Sync Terminal Logs */}
        {argoLogs.length > 0 && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-1 flex items-center justify-between font-sans">
              <span>ArgoCD GitOps Synchronisation logs</span>
              {isArgoSyncing && <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-ping" />}
            </div>
            <div className="p-3 bg-gray-950 border border-gray-850 rounded-xl max-h-36 overflow-y-auto font-mono text-[9.5px] text-indigo-300 space-y-1">
              {argoLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-gray-600 mr-1.5">[{idx + 1}]</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">{isZh ? "金丝雀部署策略" : "Canary Deployment Policy"}</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {isZh 
              ? "系统目前配置为阶梯式分发：10% 用户先行，验证无报错后 30 分钟内自动全量。您可以随时干预并回滚任何不稳定的版本。"
              : "System is configured for staggered rollout: 10% initial target, automated 100% within 30 minutes after health check. You can intervene or rollback any unstable version manually."}
          </p>
          <button className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            {isZh ? "配置分发策略" : "Configure Rollout Strategy"}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-800 text-gray-400">
                <ExternalLink className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white">{isZh ? "外部发布渠道" : "External Release Channels"}</h3>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: "App Store", status: "Connected", icon: Globe },
              { name: "Google Play", status: "Connected", icon: Smartphone },
              { name: "Steam Works", status: "Connected", icon: Gamepad2 },
            ].map((channel, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-white/5">
                <div className="flex items-center gap-3">
                  <channel.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-300">{channel.name}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{channel.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
