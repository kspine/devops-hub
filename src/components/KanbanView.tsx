import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Info, 
  Check, 
  X, 
  RefreshCw, 
  Trash2, 
  Terminal 
} from "lucide-react";
import { ProjectType } from "../types";

export interface KanbanJob {
  id: string;
  name: string;
  platform: string;
  projectType: ProjectType;
  status: "queued" | "running" | "succeeded" | "failed";
  progress: number;
  duration: number;
  startedAt: string;
}

interface KanbanViewProps {
  isZh: boolean;
  projectType: ProjectType;
  kanbanJobs: KanbanJob[];
  setKanbanJobs: React.Dispatch<React.SetStateAction<KanbanJob[]>>;
  resourceLimits: { maxConcurrentRunners: number };
  showToast: (msg: string) => void;
  getJobLogLines: (job: KanbanJob) => string[];
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
}

export default function KanbanView({
  isZh,
  projectType,
  kanbanJobs,
  setKanbanJobs,
  resourceLimits,
  showToast,
  getJobLogLines,
  showLogConsole,
  setShowLogConsole,
  selectedJobId,
  setSelectedJobId
}: KanbanViewProps) {
  const statuses = [
    { id: "queued", label: isZh ? "等待执行 (Queued)" : "Queued", color: "border-gray-800 bg-gray-900/30 text-gray-400" },
    { id: "running", label: isZh ? "正在构建 (Running)" : "Running", color: "border-indigo-900/50 bg-indigo-950/5 text-indigo-400", pulse: true },
    { id: "succeeded", label: isZh ? "构建成功 (Succeeded)" : "Succeeded", color: "border-emerald-900/50 bg-emerald-950/5 text-emerald-400" },
    { id: "failed", label: isZh ? "打包失败 (Failed)" : "Failed", color: "border-rose-900/50 bg-rose-950/5 text-rose-400" }
  ];

  const triggerNewJob = (platformKey: string, customName?: string) => {
    const jobId = "job-" + Math.floor(Math.random() * 1000 + 200);
    const newJobName = customName || `${platformKey.toUpperCase()} Automated Integration #${Math.floor(Math.random() * 90 + 10)}`;
    const newJob: KanbanJob = {
      id: jobId,
      name: newJobName,
      platform: platformKey,
      projectType: projectType,
      status: "queued" as const,
      progress: 0,
      duration: 0,
      startedAt: isZh ? "刚刚" : "Just now"
    };

    setKanbanJobs(prev => [newJob, ...prev]);
    showToast(isZh ? `已将任务 ${jobId} 加入流水线执行队列！` : `Task ${jobId} added to pipeline queue!`);

    setTimeout(() => {
      setKanbanJobs(currentJobs => currentJobs.map(job => {
        if (job.id === jobId) {
          return { ...job, status: "running" };
        }
        return job;
      }));
    }, 2500);
  };

  const cancelJob = (id: string) => {
    setKanbanJobs(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, status: "failed", progress: Math.min(job.progress, 90) };
      }
      return job;
    }));
    showToast(isZh ? `已取消构建任务。` : `Build task cancelled.`);
  };

  const retryJob = (id: string) => {
    setKanbanJobs(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, status: "running", progress: 0, duration: 0, startedAt: isZh ? "刚刚" : "Just now" };
      }
      return job;
    }));
    showToast(isZh ? `重新调度执行任务。` : `Re-scheduled task execution.`);
  };

  const deleteJob = (id: string) => {
    setKanbanJobs(prev => prev.filter(job => job.id !== id));
    showToast(isZh ? `已清除任务历史记录。` : `Cleared task record.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Quick Launch & Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Trigger Tool */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
            <Zap className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-mono">
              {isZh ? "快速触发新构建" : "Trigger Pipeline Job"}
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {isZh ? "基于当前架构配置与环境变量，直接向工作站集群发送一个构建指令。队列资源可用时将自动执行。" 
                  : "Instantly launch a build job across the server cluster using your saved architecture configs and environment secrets."}
          </p>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-gray-500 font-mono block mb-1">
                {isZh ? "构建目标平台" : "TARGET PLATFORM"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["android", "ios", "windows", "webgl"].map((p) => (
                  <button
                    key={p}
                    onClick={() => triggerNewJob(p)}
                    className="py-2 px-1 rounded-xl bg-gray-900 border border-gray-850 hover:border-indigo-500 hover:bg-gray-950/80 hover:text-white transition-all text-xs font-semibold capitalize cursor-pointer text-gray-400 text-center"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-indigo-950/15 border border-indigo-900/40 rounded-xl flex items-start gap-2.5">
                <Info className="h-3.5 w-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-indigo-300 font-medium leading-relaxed">
                  <strong>{isZh ? "高级提示" : "Pro Tip"}:</strong> {isZh ? "流水线将自动加载全局配置中的 Pre-Compile 与 Post-Compile 钩子脚本进行全链执行。" : "The pipeline automatically executes custom Pre-Compile and Post-Compile hook scripts configured in Global Settings."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Analytics Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest">{isZh ? "并发队列数" : "Runner Slots"}</span>
            <div className="my-3">
              <span className="text-3xl font-bold font-mono text-gray-100">
                {kanbanJobs.filter(j => j.status === "running").length}
              </span>
              <span className="text-xs text-gray-500 font-mono ml-1">/ {resourceLimits.maxConcurrentRunners} Slot</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1">
              <div 
                className="bg-indigo-500 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${(kanbanJobs.filter(j => j.status === "running").length / resourceLimits.maxConcurrentRunners) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest">{isZh ? "平均构建时长" : "Avg Build Time"}</span>
            <div className="my-3">
              <span className="text-3xl font-bold font-mono text-emerald-400">145s</span>
              <span className="text-xs text-emerald-600 font-mono ml-1">↓ 12%</span>
            </div>
            <p className="text-[9px] text-gray-500 font-mono leading-none">
              {isZh ? "基于最近15次真实构建任务" : "Calculated from last 15 live runs"}
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest">{isZh ? "当前缓存效率" : "Cache Hit Ratio"}</span>
            <div className="my-3">
              <span className="text-3xl font-bold font-mono text-indigo-400">89.4%</span>
              <span className="text-xs text-indigo-500 font-mono ml-1">High</span>
            </div>
            <p className="text-[9px] text-gray-500 font-mono leading-none">
              {isZh ? "DDC / Unity Cache Server 正常" : "DDC / Unity Cache online"}
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((col) => {
          const filteredJobs = kanbanJobs.filter(job => job.status === col.id);
          return (
            <div key={col.id} className="bg-gray-950/60 border border-gray-900/80 rounded-2xl p-3 flex flex-col min-h-[450px]">
              {/* Column Title */}
              <div className={`p-3 rounded-xl border flex items-center justify-between font-sans ${col.color} mb-3 shadow-sm`}>
                <div className="flex items-center gap-2">
                  {col.pulse && (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold tracking-wide">{col.label}</span>
                </div>
                <span className="text-[10px] bg-gray-950/40 px-2 py-0.5 rounded font-mono font-bold">
                  {filteredJobs.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                <AnimatePresence>
                  {filteredJobs.length === 0 ? (
                    <div className="h-28 border border-dashed border-gray-900 rounded-xl flex items-center justify-center text-center text-gray-600 text-[10px] font-mono select-none">
                      {isZh ? "无任务记录" : "Empty Column"}
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <motion.div
                        key={job.id}
                        layoutId={job.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className={`group p-3 bg-gray-900 border ${
                          job.status === "running" 
                            ? "border-indigo-500/25 shadow-md shadow-indigo-600/5 bg-indigo-950/10" 
                            : job.status === "failed" 
                              ? "border-rose-950/60 hover:border-rose-900/80" 
                              : "border-gray-850 hover:border-gray-800"
                        } rounded-xl space-y-2.5 relative transition-all`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wider bg-gray-950/30 px-1.5 py-0.5 rounded border border-gray-850">
                            {job.id}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wide font-mono ${
                            job.platform === "android" ? "text-emerald-400" :
                            job.platform === "ios" ? "text-indigo-400" :
                            job.platform === "windows" ? "text-blue-400" : "text-amber-400"
                          }`}>
                            {job.platform}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-bold text-gray-200 group-hover:text-white transition-colors tracking-tight line-clamp-1 leading-snug">
                            {job.name}
                          </h4>
                          <p className="text-[9px] text-gray-500 mt-0.5 font-mono">
                            Engine: <span className="capitalize">{job.projectType}</span> • {job.startedAt}
                          </p>
                        </div>

                        {job.status === "running" && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-indigo-300">
                              <span className="animate-pulse">{isZh ? "正在执行..." : "Compiling..."}</span>
                              <span className="font-bold">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden border border-gray-850/60">
                              <div 
                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {job.status === "succeeded" && (
                          <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono bg-gray-950/20 p-1.5 rounded border border-gray-850/40">
                            <span>Dur: {job.duration}s</span>
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              <Check className="h-2.5 w-2.5" /> Pack OK
                            </span>
                          </div>
                        )}

                        {job.status === "failed" && (
                          <div className="text-[9px] text-rose-300 font-mono bg-rose-950/20 border border-rose-900/35 p-1.5 rounded leading-relaxed">
                            {job.id === "job-104" ? (isZh ? "编译错误: 未解析的 Steamworks.NET" : "Compiler Error: Unresolved Steamworks") : (isZh ? "执行中止: 构建被主动取消" : "Execution Aborted")}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-gray-850/40">
                          <button
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setShowLogConsole(true);
                            }}
                            className="px-2 py-1 rounded bg-gray-950 border border-gray-850 hover:bg-gray-800 hover:text-white text-gray-400 text-[10px] font-mono transition-colors cursor-pointer"
                          >
                            {isZh ? "查看日志" : "Logs"}
                          </button>

                          {job.status === "running" && (
                            <button
                              onClick={() => cancelJob(job.id)}
                              className="p-1 rounded bg-rose-950/20 hover:bg-rose-900 border border-rose-900/40 text-rose-300 transition-colors cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}

                          {(job.status === "failed" || job.status === "succeeded") && (
                            <button
                              onClick={() => retryJob(job.id)}
                              className="p-1 rounded bg-indigo-950/40 hover:bg-indigo-600 border border-indigo-900/40 hover:text-white text-indigo-400 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </button>
                          )}

                          {(job.status === "failed" || job.status === "succeeded") && (
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="p-1 rounded bg-gray-950 border border-gray-850 hover:border-red-900 hover:text-red-400 text-gray-500 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {showLogConsole && selectedJobId && (() => {
        const matchedJob = kanbanJobs.find(j => j.id === selectedJobId);
        if (!matchedJob) return null;
        const logLines = getJobLogLines(matchedJob);
        return (
          <div className="fixed inset-0 bg-gray-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[70vh] shadow-2xl">
              <div className="bg-gray-950 px-5 py-3.5 border-b border-gray-850 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-100 tracking-wider font-mono">
                      {matchedJob.id} / RUNNER CONSOLE OUTPUT
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono">
                      Target: {matchedJob.name} • Status: {matchedJob.status.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowLogConsole(false);
                    setSelectedJobId(null);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-850 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 bg-black p-5 font-mono text-[11px] text-gray-300 overflow-y-auto space-y-1.5 leading-relaxed selection:bg-indigo-900 selection:text-white">
                {logLines.map((line, idx) => {
                  let colorClass = "text-gray-400";
                  if (line.includes("[ERROR]") || line.includes("[FATAL]")) colorClass = "text-red-400 font-semibold";
                  else if (line.includes("[WARN]")) colorClass = "text-amber-400";
                  else if (line.includes("[SUCCESS]")) colorClass = "text-emerald-400 font-semibold";
                  else if (line.includes("[RUNNING]")) colorClass = "text-indigo-300 font-medium";
                  else if (line.includes("[COMPILING]") || line.includes("[COOKING]")) colorClass = "text-sky-300";

                  return (
                    <div key={idx} className={colorClass}>
                      {line}
                    </div>
                  );
                })}
                {matchedJob.status === "running" && (
                  <div className="text-indigo-400 animate-pulse flex items-center gap-1 text-[10px] font-bold mt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>[COMPILE HOST] Streaming build compilation output...</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-950 px-5 py-3 border-t border-gray-850 flex items-center justify-between text-[11px]">
                <div className="text-gray-500 font-mono">
                  {logLines.length} output logs captured • Terminal standard CWD
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([logLines.join("\n")], { type: "text/plain" });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = `build-log-${matchedJob.id}.txt`;
                      link.click();
                    }}
                    className="px-3 py-1.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 font-semibold transition-colors cursor-pointer"
                  >
                    {isZh ? "导出日志" : "Export Text"}
                  </button>
                  <button
                    onClick={() => {
                      setShowLogConsole(false);
                      setSelectedJobId(null);
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    {isZh ? "关闭控制台" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
