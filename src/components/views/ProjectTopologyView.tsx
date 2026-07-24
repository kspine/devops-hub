import React, { useState } from "react";
import { 
  Server, 
  Database, 
  Cloud, 
  Workflow, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity,
  Maximize2,
  RefreshCw,
  Search,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";

export default function ProjectTopologyView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: 'vcs', label: 'GitHub / GitLab', icon: Database, x: 100, y: 100, type: 'input' },
    { id: 'orch', label: 'Orchestrator', icon: Workflow, x: 300, y: 100, type: 'core' },
    { id: 'builder', label: 'Build Agent (UE5)', icon: Cpu, x: 500, y: 50, type: 'runner' },
    { id: 'builder-win', label: 'Build Agent (Win)', icon: Cpu, x: 500, y: 150, type: 'runner' },
    { id: 'telemetry', label: 'Telemetry Hub', icon: Activity, x: 300, y: 250, type: 'observability' },
    { id: 'storage', label: 'S3 Artifacts', icon: Cloud, x: 700, y: 100, type: 'output' },
    { id: 'security', label: 'Security Gate', icon: ShieldCheck, x: 400, y: 100, type: 'gate' },
  ];

  const connections = [
    { from: 'vcs', to: 'orch' },
    { from: 'orch', to: 'security' },
    { from: 'security', to: 'builder' },
    { from: 'security', to: 'builder-win' },
    { from: 'builder', to: 'storage' },
    { from: 'builder-win', to: 'storage' },
    { from: 'builder', to: 'telemetry' },
    { from: 'builder-win', to: 'telemetry' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "工程流转拓扑观察" : "Engineering Topology Observability"}
          </h2>
          <p className="text-xs text-gray-500">
            {isZh ? "实时可视化构建流转、资源路径与状态监测" : "Real-time visualization of build flow, resource paths, and status monitoring."}
          </p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
             <RefreshCw className="w-4 h-4 text-gray-400" />
           </button>
           <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
             <Maximize2 className="w-4 h-4 text-gray-400" />
           </button>
        </div>
      </div>

      <div className={`relative aspect-[16/9] w-full rounded-[3rem] border overflow-hidden ${
        mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-gray-50 border-gray-100 shadow-inner'
      }`}>
        {/* SVG Connections Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.1)" />
            </marker>
          </defs>
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from)!;
            const toNode = nodes.find(n => n.id === conn.to)!;
            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 1, delay: i * 0.1 }}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-accent"
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            onClick={() => setActiveNode(node.id)}
            whileHover={{ scale: 1.1 }}
          >
            <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              activeNode === node.id 
                ? 'bg-accent border-accent text-white shadow-2xl shadow-accent/40 z-20 scale-110' 
                : (mode === 'dark' ? 'bg-[#080808] border-white/10 hover:border-accent/40 text-gray-400' : 'bg-white border-gray-200 hover:border-accent/40 text-gray-600')
            }`}>
              <node.icon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{node.label}</span>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505] animate-pulse shadow-sm" />
          </motion.div>
        ))}

        {/* Details Panel Overlay */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className={`absolute top-6 right-6 bottom-6 w-80 rounded-[2.5rem] border p-8 z-30 shadow-2xl ${
                mode === 'dark' ? 'bg-black/90 border-white/10 backdrop-blur-xl' : 'bg-white/90 border-gray-200 backdrop-blur-xl'
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl uppercase tracking-tight">
                  {nodes.find(n => n.id === activeNode)?.label}
                </h3>
                <button onClick={() => setActiveNode(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <Maximize2 className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                    <span>Performance_Load</span>
                    <span className="text-emerald-500">HEALTHY</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[8px] text-gray-500 font-black uppercase">Latency</div>
                    <div className="text-sm font-mono font-bold">12ms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[8px] text-gray-500 font-black uppercase">Uptime</div>
                    <div className="text-sm font-mono font-bold">99.9%</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase">{isZh ? "相关日志" : "Related Logs"}</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[9px] text-gray-400">
                    <div className="p-2 bg-white/5 rounded">SYNC_COMPLETE: SUCCESS</div>
                    <div className="p-2 bg-white/5 rounded">RESOURCE_ALLOCATED: NODE_04</div>
                    <div className="p-2 bg-white/5 rounded">HEARTBEAT_SENT: OK</div>
                  </div>
                </div>

                <button className="w-full py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
                  {isZh ? "进入详细控制台" : "Open Console"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center text-orange-400">
               <Zap className="w-4 h-4" />
             </div>
             <h4 className="text-xs font-black uppercase tracking-wider">{isZh ? "热路径加速" : "Hot-Path Accel"}</h4>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">{isZh ? "系统自动识别高频构建路径并分配专属高速缓存节点。" : "Auto-identifies high-freq build paths and assigns dedicated high-speed cache nodes."}</p>
        </div>
        
        <div className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
               <Activity className="w-4 h-4" />
             </div>
             <h4 className="text-xs font-black uppercase tracking-wider">{isZh ? "端到端观测" : "E2E Observability"}</h4>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">{isZh ? "全量采集从代码提交到制品发布的每一跳网络延迟与资源开销。" : "Full telemetry of network latency and resource overhead from commit to release."}</p>
        </div>

        <div className={`p-6 rounded-[2.5rem] border border-accent/20 bg-accent/5`}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
               <Settings className="w-4 h-4" />
             </div>
             <h4 className="text-xs font-black uppercase tracking-wider text-accent">{isZh ? "自动化编排" : "Auto Orchestration"}</h4>
          </div>
          <p className="text-[10px] text-accent/70 leading-relaxed">{isZh ? "基于拓扑结构的动态任务调度，支持在多种云环境间灵活迁移。" : "Topology-based dynamic task scheduling, enabling flexible migration across clouds."}</p>
        </div>
      </div>
    </div>
  );
}
