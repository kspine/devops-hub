import React, { useState } from "react";
import { 
  Layout, 
  Workflow, 
  ShieldCheck, 
  Server, 
  Database, 
  History, 
  Activity, 
  Zap, 
  ChevronRight, 
  Users, 
  ExternalLink,
  Plus,
  Github,
  RefreshCw,
  FileCode,
  Check,
  GitFork,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";
import ProjectTopologyView from "./ProjectTopologyView";
import BuildHealth from "../BuildHealth";

export default function ProjectDashboardView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  // State for GitHub integration
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("github.com/seankspine/build-configs");
  const [branch, setBranch] = useState("main");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState<"idle" | "connecting" | "fetching" | "done">("idle");
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [syncedFiles, setSyncedFiles] = useState([
    { name: ".github/workflows/ci.yml", type: "yml", content: "name: CI Build\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build Project\n        run: ./build.sh" },
    { name: "scripts/build.sh", type: "sh", content: "#!/bin/bash\necho \"Building game engine bundle...\"\nmake build\necho \"Build successful!\"" },
    { name: "scripts/deploy.sh", type: "sh", content: "#!/bin/bash\necho \"Pushing artifact registry target...\"\ndocker push company/neo-v1.0" }
  ]);
  const [importedConfigs, setImportedConfigs] = useState<Array<{ name: string; repo: string; branch: string; syncedAt: string }>>([
    { name: ".github/workflows/ci.yml", repo: "github.com/seankspine/build-configs", branch: "main", syncedAt: "10m ago" }
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStep("connecting");
    setSyncLogs([
      `[INFO] Starting OAuth handshake with GitHub...`,
      `[INFO] Requesting Repository Read Scopes...`
    ]);

    // Stage 1: Connect
    setTimeout(() => {
      setSyncStep("fetching");
      setSyncLogs(prev => [
        ...prev,
        `[SUCCESS] Authenticated using token context.`,
        `[INFO] Pulling directory structure for ${repoUrl} [branch: ${branch}]...`,
        `[INFO] Resolving .yml and .sh build configurations...`
      ]);

      // Stage 2: Fetch
      setTimeout(() => {
        setSyncStep("done");
        setSyncLogs(prev => [
          ...prev,
          `[SUCCESS] Detected 3 build configurations!`,
          `[SUCCESS] Fetch completed.`
        ]);
        setIsSyncing(false);
      }, 1500);

    }, 1200);
  };

  const handleImportFile = (file: typeof syncedFiles[0]) => {
    if (importedConfigs.some(c => c.name === file.name)) {
      return;
    }
    setImportedConfigs(prev => [
      ...prev,
      {
        name: file.name,
        repo: repoUrl,
        branch,
        syncedAt: "Just now"
      }
    ]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[2rem] bg-accent flex items-center justify-center shadow-2xl shadow-accent/30 text-white">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-3xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Project_Neo
              </h2>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-gray-500">ID: PRJ-001</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
               <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 12 Members</span>
               <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Fully Compliant</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => {
              setSyncStep("idle");
              setSyncLogs([]);
              setIsGithubModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-600/20 cursor-pointer transition-colors"
          >
            <Github className="w-4 h-4" />
            {isZh ? "同步 GitHub" : "Sync with GitHub"}
          </button>
          <button className={`px-5 py-2.5 rounded-2xl border transition-all text-sm font-black flex items-center gap-2 ${
            mode === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300' : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-700'
          }`}>
            <ExternalLink className="w-4 h-4" />
            {isZh ? "项目设置" : "Settings"}
          </button>
          <button className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-black flex items-center gap-2 hover:opacity-90 shadow-xl shadow-accent/20">
            <Plus className="w-4 h-4" />
            {isZh ? "新建流水线" : "New Pipeline"}
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Topology & Pipelines */}
        <div className="lg:col-span-8 space-y-6">
          {/* Engineering Observability (Live Topology) */}
          <div className={`p-1 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-gradient-to-br from-white/10 to-transparent border-white/5' : 'bg-gradient-to-br from-gray-200 to-transparent border-gray-100'}`}>
            <div className={`p-8 rounded-[3.4rem] ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
               <ProjectTopologyView />
            </div>
          </div>

          {/* D3.js 30-Day Build Health & Gemini AI Report Card */}
          <BuildHealth />

          {/* Active Pipelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Main Build UE5", status: "Success", duration: "12m 3s", health: 98, lastRun: "10m ago" },
              { name: "Android Client V4", status: "Running", duration: "Active", health: 85, lastRun: "Now" },
            ].map((pipe, i) => (
              <div key={i} className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pipe.status === 'Running' ? 'bg-accent/10 text-accent animate-pulse' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black">{pipe.name}</h4>
                      <div className="text-[10px] text-gray-500 font-mono">{pipe.lastRun}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Performance_Health</span>
                    <span className="text-emerald-500">{pipe.health}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${pipe.health}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono">
                     <span className="text-gray-400">STATUS: <span className={pipe.status === 'Running' ? 'text-accent' : 'text-emerald-500'}>{pipe.status.toUpperCase()}</span></span>
                     <span className="text-gray-500">{pipe.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quotas & Audit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Resource Usage Widget */}
          <div className={`p-8 rounded-[3rem] border flex flex-col justify-between h-[340px] ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <div className="flex justify-between items-center">
               <h3 className="font-black flex items-center gap-2 uppercase text-xs tracking-widest text-gray-500">
                 <Server className="w-4 h-4" />
                 Quota_Allotment
               </h3>
               <Zap className="w-4 h-4 text-accent" />
             </div>
             
             <div className="space-y-6 flex-grow flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-400 uppercase">CPU_USAGE</span>
                    <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>64%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-400 uppercase">GPU_CLUSTER_LOAD</span>
                    <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>12%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-1/8 bg-purple-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-gray-400 uppercase">STORAGE_QUOTA</span>
                    <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>412GB / 2TB</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-orange-500" />
                  </div>
                </div>
             </div>

             <button 
                onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quotas" }))}
                className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
               {isZh ? "进入资源中心" : "Resource Center"}
             </button>
          </div>

          {/* Team Efficiency Snapshot */}
          <div className={`p-8 rounded-[3rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <h3 className="font-black flex items-center gap-2 uppercase text-xs tracking-widest text-emerald-500 mb-6">
               <Users className="w-4 h-4" />
               Team_Efficiency
             </h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-black">94%</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Average<br/>Collaboration Score</div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                   <span className="text-gray-400">Task_Assignment</span>
                   <span className="text-emerald-500 font-bold">OPTIMIZED</span>
                </div>
                <div className="flex justify-between text-[10px]">
                   <span className="text-gray-400">Review_Latency</span>
                   <span className="text-emerald-500 font-bold">1.2h</span>
                </div>
             </div>
             <button 
                onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "collaboration" }))}
                className="w-full mt-8 py-3 rounded-2xl border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/5 transition-colors"
              >
               {isZh ? "团队能效看板" : "Team Analytics"}
             </button>
          </div>

          {/* Quality & Testability Snapshot */}
          <div className={`p-8 rounded-[3rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <h3 className="font-black flex items-center gap-2 uppercase text-xs tracking-widest text-rose-500 mb-6">
               <ShieldCheck className="w-4 h-4" />
               Quality_Shield
             </h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-black">96.4%</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Average<br/>Build Success</div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                   <span className="text-gray-400">Error_Prediction</span>
                   <span className="text-emerald-500 font-bold">STABLE</span>
                </div>
                <div className="flex justify-between text-[10px]">
                   <span className="text-gray-400">Test_Coverage</span>
                   <span className={mode === 'dark' ? 'text-white font-bold' : 'text-gray-900 font-bold'}>88.5%</span>
                </div>
             </div>
             <button 
                onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
                className="w-full mt-8 py-3 rounded-2xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/5 transition-colors"
              >
               {isZh ? "质量分析中心" : "Quality Center"}
             </button>
          </div>

          {/* Synced GitHub Configurations Snapshot */}
          <div className={`p-8 rounded-[3rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <h3 className="font-black flex items-center gap-2 uppercase text-xs tracking-widest text-indigo-450 mb-6">
               <Github className="w-4.5 h-4.5 text-indigo-400" />
               {isZh ? "GitHub 关联配置" : "GitHub SCM Sync"}
             </h3>
             <div className="space-y-4">
                {importedConfigs.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-500 italic">
                    {isZh ? "未导入任何构建配置" : "No build configurations imported"}
                  </div>
                ) : (
                  importedConfigs.map((cfg, i) => (
                    <div key={i} className="p-3 bg-gray-900/40 rounded-xl border border-gray-950 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileCode className="w-4 h-4 text-indigo-450 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-gray-200 truncate">{cfg.name}</div>
                          <div className="text-[8px] text-gray-500 font-mono truncate">{cfg.repo} ({cfg.branch})</div>
                        </div>
                      </div>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono shrink-0 uppercase font-bold">Active</span>
                    </div>
                  ))
                )}
             </div>
             <button 
                onClick={() => {
                  setSyncStep("idle");
                  setSyncLogs([]);
                  setIsGithubModalOpen(true);
                }}
                className="w-full mt-6 py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/10 cursor-pointer transition-colors"
              >
               {isZh ? "管理同步仓库" : "Sync SCM Repositories"}
             </button>
          </div>

          {/* Audit History Snapshot */}
          <div className={`p-8 rounded-[3rem] border overflow-hidden ${mode === 'dark' ? 'bg-accent/5 border-accent/20' : 'bg-gray-50 border-gray-200'}`}>
             <h3 className="font-black flex items-center gap-2 uppercase text-xs tracking-widest text-accent mb-6">
               <History className="w-4 h-4" />
               Recent_Activity
             </h3>
             <div className="space-y-4">
                {[
                  { user: "admin", action: "Pipeline Update", time: "2m ago" },
                  { user: "system", action: "Auto-Scale Trigger", time: "15m ago" },
                  { user: "user_x", action: "Artifact Download", time: "1h ago" },
                  { user: "admin", action: "Config Change", time: "3h ago" },
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-[8px] font-black">{act.user[0].toUpperCase()}</div>
                       <span className="font-bold">{act.action}</span>
                    </div>
                    <span className="text-gray-500 font-mono">{act.time}</span>
                  </div>
                ))}
             </div>
             <button 
                onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "governance" }))}
                className="w-full mt-8 py-3 rounded-2xl bg-accent text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent/20"
              >
               {isZh ? "查看完整审计日志" : "Full Audit Logs"}
             </button>
          </div>
        </div>
      </div>

      {/* GitHub Repository Syncer Modal */}
      <AnimatePresence>
        {isGithubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSyncing) setIsGithubModalOpen(false);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className={`w-full max-w-xl rounded-3xl border p-6 overflow-hidden relative shadow-2xl z-10 ${
                mode === 'dark' ? 'bg-[#080808] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-450 border border-indigo-500/20">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight">{isZh ? "同步 GitHub 管道配置" : "Sync GitHub Configurations"}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{isZh ? "提取代码仓库内的构建配置文件" : "Pull .yml or .sh configs from repository"}</p>
                  </div>
                </div>
                {!isSyncing && (
                  <button 
                    onClick={() => setIsGithubModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {syncStep === "idle" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">{isZh ? "GitHub 仓库地址" : "Repository Endpoint"}</label>
                      <input 
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="github.com/org/repo"
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">{isZh ? "分 支" : "Branch"}</label>
                      <input 
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="main"
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-2xl flex items-start gap-3">
                    <GitFork className="w-4 h-4 text-indigo-405 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-400 leading-normal">
                      {isZh 
                        ? "点击下方按钮后，将拉取该仓库的指定分支。系统会自动扫描包含的 YAML 编译工作流（如 .github/workflows）以及 sh 脚本文件，供您快捷同步。" 
                        : "Clicking sync will fetch the specified branch and automatically scan for YAML build workflows (e.g., inside .github/workflows) and executable .sh scripts."}
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setIsGithubModalOpen(false)}
                      className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {isZh ? "取消" : "Cancel"}
                    </button>
                    <button 
                      onClick={handleSync}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {isZh ? "授权并连接" : "Authorize & Sync"}
                    </button>
                  </div>
                </div>
              )}

              {isSyncing && (
                <div className="space-y-6 py-6 text-center">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Github className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm font-bold">{syncStep === "connecting" ? (isZh ? "正在建立 OAuth 握手..." : "Connecting to GitHub API...") : (isZh ? "正在拉取代码配置..." : "Fetching files from repository...")}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{repoUrl} ({branch})</div>
                  </div>
                  
                  {/* Pseudo terminal logs */}
                  <div className="bg-black/80 border border-gray-800 p-3 rounded-xl font-mono text-[9px] text-left text-indigo-300 space-y-1 h-24 overflow-y-auto">
                    {syncLogs.map((log, index) => (
                      <div key={index} className="truncate">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {syncStep === "done" && !isSyncing && (
                <div className="space-y-5">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">{isZh ? "拉取成功" : "Successfully Pulled"}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{repoUrl} ({branch})</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">{isZh ? "发现以下编译脚本文件 (请点击导入)" : "Detected Configs (Click Import)"}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {syncedFiles.map((file, idx) => {
                        const isAlreadyImported = importedConfigs.some(c => c.name === file.name);
                        return (
                          <div key={idx} className="p-3 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{file.name}</div>
                                <div className="text-[9px] text-gray-500 font-mono">{file.type === "yml" ? "GitHub Workflow File" : "Shell Script"}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleImportFile(file)}
                              disabled={isAlreadyImported}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                isAlreadyImported 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed" 
                                  : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                              }`}
                            >
                              {isAlreadyImported ? <Check className="w-3 h-3" /> : null}
                              <span>{isAlreadyImported ? (isZh ? "已导入" : "Imported") : (isZh ? "导入" : "Import")}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setIsGithubModalOpen(false)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      {isZh ? "完成" : "Done"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
