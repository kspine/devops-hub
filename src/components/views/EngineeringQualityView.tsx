import React from "react";
import BuildOptimizationAdvisor from "../BuildOptimizationAdvisor";
import { 
  ShieldCheck, 
  Binary, 
  Gauge, 
  Bug, 
  Zap, 
  History, 
  RefreshCcw, 
  FileCode2, 
  Dna,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Activity,
  FileText,
  PieChart,
  Download,
  Cpu,
  Clock
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";

export default function EngineeringQualityView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  const qualityMetrics = [
    { label: isZh ? "静态分析通过率" : "Static Analysis", value: "99.2%", change: "+0.4%", status: "Good" },
    { label: isZh ? "单元测试覆盖率" : "Unit Test Coverage", value: "88.5%", change: "+2.1%", status: "Good" },
    { label: isZh ? "构建平均成功率" : "Build Success Rate", value: "96.4%", change: "-1.2%", status: "Warning" },
  ];

  const predictions = [
    { type: "Dependency Conflict", probability: "High", risk: "85%", target: "Unity_Core_Render" },
    { type: "Memory Leak Potential", probability: "Medium", risk: "42%", target: "Native_Memory_Manager" },
    { type: "Resource Bottleneck", probability: "Low", risk: "12%", target: "Asset_Bundle_Compressor" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "工程健康度与分析报告" : "Engineering Health & Analysis"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "全链路质量守护：构建健康度评分体系与自动化工程分析报告" : "Full-link quality protection: Build Health Scoring and Automated Engineering Analysis."}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "pipeline" }))}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all hover:bg-white/10 ${mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-500 shadow-sm'}`}
          >
             {isZh ? "查看流水线" : "View Pipeline"}
          </button>
          <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-500'}`}>
             {isZh ? "质量评分规则配置" : "Score Rules Config"}
          </button>
          <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
            {isZh ? "生成健康度报告" : "Generate Health Report"}
          </button>
        </div>
      </div>

      {/* Build Health Scoring System */}
      <BuildOptimizationAdvisor />

      <div className={`p-8 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-5 h-5 text-emerald-500" />
              {isZh ? "构建健康度评分体系 (Build Score)" : "Build Health Scoring (Build Score)"}
            </h3>
            <p className="text-xs text-gray-500 mt-2">{isZh ? "基于自研评分模型，综合评估工程交付质量与效能指标" : "Comprehensive assessment of engineering delivery quality based on custom scoring models."}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
             <div className="text-right">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isZh ? "工程整体健康分" : "Overall Health Score"}</div>
                <div className="text-4xl font-black text-emerald-500">92.4</div>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: isZh ? "构建成功率" : "Success Rate", val: "96.4%", score: 96, icon: CheckCircle2, color: "text-emerald-500" },
            { label: isZh ? "构建耗时评估" : "Build Time Eval", val: "Optimized", score: 90, icon: Clock, color: "text-blue-500" },
            { label: isZh ? "任务执行效率" : "Task Efficiency", val: "High", score: 88, icon: Zap, color: "text-amber-500" },
            { label: isZh ? "构建日志质量" : "Log Quality", val: "Clean", score: 95, icon: FileCode2, color: "text-purple-500" },
          ].map((s, i) => (
             <div key={i} className={`p-6 rounded-3xl border ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className={`text-xs font-black ${s.color}`}>{s.score}/100</span>
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{s.label}</div>
                <div className="text-lg font-black mt-1">{s.val}</div>
             </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Automated Engineering Reports */}
        <div className={`lg:col-span-7 p-10 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <PieChart className="w-6 h-6 text-accent" />
              {isZh ? "工程分析与构建报告" : "Engineering Analysis & Reports"}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: isZh ? "构建过程日志报告" : "Process Log Report", icon: FileText, desc: isZh ? "深度解析全链路执行日志" : "Deep analysis of execution logs", type: "PDF" },
              { title: isZh ? "资源消耗分析报告" : "Resource Analysis", icon: Cpu, desc: isZh ? "GPU/CPU/网络资源消耗分析" : "GPU/CPU/Network consumption", type: "HTML" },
              { title: isZh ? "构建错误预测与趋势" : "Error Trend Predict", icon: Bug, desc: isZh ? "引擎特定类型故障趋势分析" : "Engine-specific error trend analysis", type: "JSON" },
              { title: isZh ? "企业质量提升对比" : "Health Trend Report", icon: TrendingUp, desc: isZh ? "内部团队与项目组健康度对比" : "Cross-team health comparison", type: "CSV" }
            ].map((report, i) => (
              <div key={i} className={`p-5 rounded-3xl border flex items-start gap-4 transition-all hover:-translate-y-1 cursor-pointer ${mode === 'dark' ? 'bg-white/[0.02] border-white/5 hover:border-accent/50' : 'bg-gray-50 border-gray-100 hover:border-accent/30'}`}>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                   <report.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                   <h4 className="text-sm font-black">{report.title}</h4>
                   <p className="text-[10px] text-gray-500 mt-1">{report.desc}</p>
                   <div className="mt-3 flex gap-2">
                     <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-gray-500/30 text-gray-400">{report.type}</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-accent/10 text-accent flex items-center gap-1">
                       <Download className="w-3 h-3" /> Auto-Gen
                     </span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testability Engineering Model */}
        <div className={`lg:col-span-4 p-8 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-accent/5 border-accent/20' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
          <h3 className="text-sm font-black uppercase tracking-widest text-accent mb-8 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Testability_Model
          </h3>
          <div className="space-y-6">
            {[
              { label: isZh ? "环境重现性" : "Env Reproducibility", score: 98 },
              { label: isZh ? "失败可追溯性" : "Failure Traceability", score: 92 },
              { label: isZh ? "参数可测性" : "Param Testability", score: 85 },
              { label: isZh ? "全链路覆盖" : "E2E Coverage", score: 76 }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-accent">{item.score}%</span>
                </div>
                <div className="h-1 w-full bg-accent/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-3xl bg-black/40 border border-white/10">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">Local_Test_Agent</span>
             </div>
             <p className="text-[10px] text-gray-500 leading-relaxed italic">
               {isZh ? "“支持本地模拟构建参数验证，减少远程构建资源浪费。”" : "“Supports local simulation of build parameters to reduce remote resource waste.”"}
             </p>
          </div>
        </div>
      </div>

      {/* Code Structure Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: isZh ? "代码重复率" : "Duplication", val: "2.1%", icon: Dna, color: "text-emerald-500" },
          { title: isZh ? "圈复杂度" : "Complexity", val: "Low", icon: Binary, color: "text-emerald-500" },
          { title: isZh ? "构建确定性" : "Determinism", val: "High", icon: RefreshCcw, color: "text-blue-500" },
          { title: isZh ? "依赖健康度" : "Dep Health", val: "Stable", icon: Layers, color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
             </div>
             <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{stat.title}</div>
             <div className="text-xl font-black">{stat.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
