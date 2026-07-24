import React from "react";
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  DollarSign, 
  Clock,
  PieChart,
  BarChart,
  Settings2
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";

export default function ResourceQuotaView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  const resources = [
    { type: "CPU Cores", allocated: 128, used: 84, unit: "Cores", color: "text-blue-500", bg: "bg-blue-500/10" },
    { type: "GPU Nodes", allocated: 16, used: 12, unit: "Cards", color: "text-purple-500", bg: "bg-purple-500/10" },
    { type: "Memory", allocated: 512, used: 310, unit: "GB", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { type: "Storage", allocated: 2048, used: 412, unit: "GB", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const projectsUsage = [
    { name: "Neo-City Expansion", cpu: 45, gpu: 70, ram: 30, cost: "$1,240" },
    { name: "Global Web Hub", cpu: 20, gpu: 10, ram: 45, cost: "$580" },
    { name: "Android V4 Pipeline", cpu: 15, gpu: 0, ram: 10, cost: "$120" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "资源配额与成本分析" : "Resource Quotas & Cost"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "多云算力资源编排、配额分配与研发成本归因" : "Multi-cloud compute orchestration, quota allocation, and R&D cost attribution."}
          </p>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:opacity-90 transition-opacity">
          {isZh ? "调整资源配额" : "Adjust Quotas"}
        </button>
      </div>

      {/* Main Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res, i) => (
          <div key={i} className={`p-8 rounded-[3rem] border flex flex-col justify-between ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${res.bg} ${res.color}`}>
                {res.type.includes('CPU') ? <Cpu className="w-6 h-6" /> : 
                 res.type.includes('GPU') ? <Zap className="w-6 h-6" /> : 
                 res.type.includes('Memory') ? <Activity className="w-6 h-6" /> : <Database className="w-6 h-6" />}
              </div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{res.type}</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{res.used}</span>
                <span className="text-xs text-gray-500 font-bold">/ {res.allocated} {res.unit}</span>
              </div>
            </div>
            <div className="mt-8 space-y-2">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(res.used/res.allocated)*100}%` }}
                  className={`h-full ${res.color.replace('text', 'bg')}`}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono font-bold text-gray-500 uppercase">
                <span>Utilization</span>
                <span>{Math.round((res.used/res.allocated)*100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Project Cost Table */}
        <div className={`lg:col-span-8 rounded-[3.5rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-black flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-accent" />
              {isZh ? "项目资源消耗排行" : "Project Resource Consumption"}
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-white/5 border border-white/5"><BarChart className="w-4 h-4 text-gray-500" /></button>
              <button className="p-2 rounded-xl bg-white/5 border border-white/5"><Settings2 className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <th className="px-10 py-6">{isZh ? "项目名称" : "Project"}</th>
                  <th className="px-10 py-6">{isZh ? "算力水位" : "Compute Level"}</th>
                  <th className="px-10 py-6">{isZh ? "显存负载" : "GPU Load"}</th>
                  <th className="px-10 py-6">{isZh ? "月估算成本" : "Est. Monthly Cost"}</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projectsUsage.map((p, i) => (
                  <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-10 py-6">
                      <span className={`text-sm font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{p.name}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-blue-500" style={{ width: `${p.cpu}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{p.cpu}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-purple-500" style={{ width: `${p.gpu}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{p.gpu}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-black text-accent">{p.cost}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-accent transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Efficiency Insights Card */}
        <div className={`lg:col-span-4 p-10 rounded-[3.5rem] border bg-accent/5 border-accent/20 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PieChart className="w-48 h-48 text-accent" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Resource_Insights</span>
              <h3 className="text-2xl font-black">{isZh ? "能效优化建议" : "Efficiency Insights"}</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { title: isZh ? "闲置实例回收" : "Idle Instance Sweep", desc: isZh ? "发现 4 个持续 48h 闲置的测试实例" : "4 testing instances idle for 48h+", icon: Clock },
                { title: isZh ? "按需扩容提醒" : "On-demand Scaling", desc: isZh ? "Neo-City 项目显存负载已达 85% 阈值" : "Neo-City GPU load reached 85% threshold", icon: Zap },
                { title: isZh ? "跨云调度优化" : "Cloud Scheduling", desc: isZh ? "发现 AWS 节点成本当前低于 Aliyun 15%" : "AWS nodes currently 15% cheaper than Aliyun", icon: DollarSign }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-2xl shadow-accent/20">
              {isZh ? "一键自动优化" : "Run Auto-Optimization"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
