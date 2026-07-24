import React from "react";
import { Activity, X, Clock, Terminal, Copy, RefreshCw } from "lucide-react";

export interface SimulationStep {
  id: string;
  name: string;
  duration: number;
  status: "queued" | "running" | "succeeded" | "failed";
}

interface SimulationSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  isZh: boolean;
  projectType: string;
  platform: string;
  simSteps: SimulationStep[];
  activeSimStepIdx: number;
  isSimRunning: boolean;
  simElapsedTime: number;
  simLogs: string[];
  triggerSimulation: () => void;
  showToast: (msg: string) => void;
}

export const SimulationSandboxModal: React.FC<SimulationSandboxModalProps> = ({
  isOpen,
  onClose,
  isZh,
  projectType,
  platform,
  simSteps,
  activeSimStepIdx,
  isSimRunning,
  simElapsedTime,
  simLogs,
  triggerSimulation,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      id="simulation-modal-overlay"
      onClick={() => {
        if (!isSimRunning) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-900/40 text-indigo-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider font-sans flex items-center gap-2">
                <span>{isZh ? "DevOps 构建沙盒模拟器" : "DevOps Build Sandbox Simulator"}</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-900/50 uppercase font-mono tracking-normal">
                  {projectType} / {platform}
                </span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isZh ? "在本地沙盒容器内动态运行当前流程定义，实时诊断并渲染底层依赖项构建序列。" : "Simulate and run your curated pipeline layout inside a visual sandbox container with real-time logs."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white text-xs cursor-pointer font-sans"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Grid Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-gray-950/10">
          {/* Left Column: Steps list & Statuses */}
          <div className="w-full md:w-[320px] border-r border-gray-800 bg-gray-950/40 p-4 overflow-y-auto space-y-3.5 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-gray-950">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "步骤构建队列" : "Step Execution Queue"}</span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {simSteps.filter(s => s.status === "succeeded").length} / {simSteps.length} {isZh ? "成功" : "Passed"}
              </span>
            </div>

            <div className="space-y-2">
              {simSteps.map((step) => {
                return (
                  <div 
                    key={step.id} 
                    className={`p-3 rounded-xl border transition-all ${
                      step.status === "running" ? "bg-indigo-950/30 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.15)] text-indigo-200" :
                      step.status === "succeeded" ? "bg-emerald-950/10 border-emerald-900/40 text-emerald-300" :
                      "bg-gray-900/30 border-gray-850/40 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold truncate max-w-[170px]">{step.name}</span>
                      <span className={`text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        step.status === "running" ? "bg-indigo-900/50 text-indigo-300 animate-pulse border border-indigo-700/30" :
                        step.status === "succeeded" ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/20" :
                        "bg-gray-800 text-gray-500"
                      }`}>
                        {step.status === "queued" ? (isZh ? "队列中" : "queued") :
                         step.status === "running" ? (isZh ? "执行中" : "running") :
                         (isZh ? "已通过" : "passed")}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[9.5px] text-gray-500 font-mono">
                      <span>ID: {step.id}</span>
                      {step.status === "succeeded" && (
                        <span className="text-emerald-500/80 font-semibold">+{step.duration}s</span>
                      )}
                      {step.status === "running" && (
                        <span className="text-indigo-400 animate-pulse">{isZh ? "进行中" : "Active"}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active logs and Dashboard metrics */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-gray-950 border border-gray-850 rounded-xl space-y-0.5 shadow-sm">
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block">{isZh ? "运行耗时" : "Elapsed Simulation Time"}</span>
                <span className="text-sm font-bold text-gray-200 font-mono flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{simElapsedTime}s</span>
                </span>
              </div>

              <div className="p-3 bg-gray-950 border border-gray-850 rounded-xl space-y-0.5 shadow-sm col-span-2">
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider block">{isZh ? "当前工作步骤" : "Active Simulation Task"}</span>
                <span className="text-xs font-bold text-gray-200 truncate block">
                  {activeSimStepIdx >= 0 && simSteps[activeSimStepIdx] 
                    ? simSteps[activeSimStepIdx].name 
                    : (isSimRunning ? (isZh ? "正在启动..." : "Initializing...") : (isZh ? "已就绪" : "Ready / Idling"))}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-950 border border-gray-850 rounded-xl p-3 space-y-2 text-left">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span>{isZh ? "整体作业构建进度" : "Overall CI/CD Build Progress"}</span>
                <span className="text-indigo-400 font-bold">
                  {simSteps.length > 0 
                    ? Math.round((simSteps.filter(s => s.status === "succeeded").length / simSteps.length) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-850">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                  style={{ 
                    width: `${simSteps.length > 0 
                      ? (simSteps.filter(s => s.status === "succeeded").length / simSteps.length) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Real-time Monospace Terminal */}
            <div className="flex-1 flex flex-col bg-gray-950 border border-gray-850 rounded-xl overflow-hidden shadow-inner text-left">
              <div className="px-4 py-2 bg-gray-900/60 border-b border-gray-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">
                    {isZh ? "交互式诊断控制台" : "Interactive Diagnostic Console"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(simLogs.join("\n"));
                    showToast(isZh ? "控制台日志已复制！" : "Terminal logs copied!");
                  }}
                  className="flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-2.5 w-2.5" />
                  <span>{isZh ? "复制日志" : "Copy Logs"}</span>
                </button>
              </div>

              <div 
                id="sim-terminal"
                className="flex-1 p-4 overflow-y-auto font-mono text-[10.5px] leading-relaxed space-y-1 select-text scroll-smooth"
                style={{ backgroundColor: "#02040a" }}
              >
                {simLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-600 italic text-[11px]">
                    {isZh ? "控制台为空，点击下方开始执行沙盒构建" : "Console empty. Click start simulation below to spawn task logs."}
                  </div>
                ) : (
                  simLogs.map((log, i) => {
                    let colorClass = "text-gray-300";
                    if (log.startsWith("[SUCCESS]")) colorClass = "text-emerald-400 font-bold";
                    else if (log.startsWith("[RUNNING]")) colorClass = "text-indigo-400 font-semibold";
                    else if (log.startsWith("[INFO]")) colorClass = "text-amber-300/90 font-medium";
                    else if (log.startsWith("[GIT]")) colorClass = "text-sky-400";
                    else if (log.startsWith("[UNITY]")) colorClass = "text-teal-400";
                    else if (log.startsWith("[UNREAL]")) colorClass = "text-fuchsia-400";
                    else if (log.startsWith("[ENV]")) colorClass = "text-blue-400";
                    else if (log.startsWith("[CLEAN]")) colorClass = "text-orange-400";
                    else if (log.startsWith("[NPM]")) colorClass = "text-pink-400";
                    else if (log.startsWith("[NOTIFY]")) colorClass = "text-purple-400";
                    
                    return (
                      <div key={i} className={`whitespace-pre-wrap ${colorClass} animate-in fade-in-50 duration-100`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-950/40 border-t border-gray-800 flex justify-between items-center">
          <span className="text-[10px] font-mono text-gray-500">
            {isZh ? "状态: 沙盒测试独立容器" : "Environment: Sandbox Isolated Container"}
          </span>

          <div className="flex gap-2.5">
            <button
              onClick={triggerSimulation}
              disabled={isSimRunning}
              className="px-3.5 py-2 rounded-lg border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 text-xs font-semibold font-sans cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{isZh ? "重新模拟" : "Restart Run"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold font-sans cursor-pointer transition-colors"
            >
              {isZh ? "退出模拟器" : "Exit Simulator"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSandboxModal;
