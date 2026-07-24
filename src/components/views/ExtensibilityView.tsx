import React from "react";
import { 
  Puzzle, 
  ExternalLink, 
  Code, 
  Database, 
  Globe, 
  Cpu, 
  Layers, 
  Zap, 
  Package, 
  ShieldCheck, 
  Activity,
  Boxes,
  Plus,
  ArrowRight,
  Search,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";
import ThemeAccessibilityDebugger from "../ThemeAccessibilityDebugger";

export default function ExtensibilityView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  const templates = [
    { name: "Unity AAA Pipeline", type: "Game Engine", status: "Official", usage: "1.2k" },
    { name: "Next.js Microservice", type: "Web Framework", status: "Official", usage: "3.4k" },
    { name: "Kotlin Multiplatform", type: "Mobile", status: "Community", usage: "800+" },
  ];

  const plugins = [
    { name: "Firebase Deployer", vendor: "Google", category: "Deployment", rating: 4.8 },
    { name: "Datadog Telemetry", vendor: "Datadog", category: "Observability", rating: 4.9 },
    { name: "AWS S3 Artifacts", vendor: "AWS", category: "Storage", rating: 4.7 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "工程生态与扩展性" : "Ecosystem & Extensibility"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "可插拔模块架构与开放 API，支持企业级定制化工程流转" : "Plug-and-play architecture with open APIs for enterprise-grade custom engineering flows."}
          </p>
        </div>
        <div className="flex gap-3">
          <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-500'}`}>
             <BookOpen className="w-4 h-4 inline mr-2" />
             API Docs
          </button>
          <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
            {isZh ? "发布新模板" : "Publish Template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Template Library */}
        <div className={`lg:col-span-7 p-8 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Boxes className="w-6 h-6 text-accent" />
              {isZh ? "构建模板库" : "Build Template Library"}
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder={isZh ? "搜索模板..." : "Search templates..."}
                  className="pl-9 pr-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs outline-none focus:border-accent/50"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl, i) => (
              <div key={i} className={`p-6 rounded-[2.5rem] border group cursor-pointer transition-all ${mode === 'dark' ? 'bg-white/5 border-white/5 hover:border-accent/40' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${mode === 'dark' ? 'bg-white/5' : 'bg-white'} text-accent`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${tpl.status === 'Official' ? 'bg-accent/10 text-accent' : 'bg-blue-500/10 text-blue-500'}`}>
                    {tpl.status}
                  </span>
                </div>
                <h4 className="text-sm font-black mb-1">{tpl.name}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{tpl.type}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{tpl.usage} installs</span>
                </div>
              </div>
            ))}
            <div className={`p-6 rounded-[2.5rem] border border-dashed flex flex-col items-center justify-center gap-2 ${mode === 'dark' ? 'border-white/10 hover:border-accent/40' : 'border-gray-200 hover:border-accent/40'} transition-colors cursor-pointer group`}>
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-gray-500 group-hover:text-accent" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? "创建自定义模板" : "Custom Template"}</span>
            </div>
          </div>
        </div>

        {/* Plugin Marketplace Snapshot */}
        <div className={`lg:col-span-5 p-8 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-accent" />
            Plugin_Marketplace
          </h3>
          <div className="space-y-4">
            {plugins.map((plugin, i) => (
              <div key={i} className={`p-5 rounded-3xl border flex items-center gap-4 transition-all hover:scale-[1.02] ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${mode === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'} text-accent`}>
                  {plugin.name.includes('Firebase') ? <Globe className="w-6 h-6" /> : 
                   plugin.name.includes('Datadog') ? <Activity className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black">{plugin.name}</h4>
                    <span className="text-[10px] font-mono text-accent">★ {plugin.rating}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">{plugin.vendor} • {plugin.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
            {isZh ? "浏览全部扩展" : "Browse All Extensions"}
          </button>
        </div>
      </div>

      {/* Open API & Partners Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`p-10 rounded-[3rem] border border-accent/30 bg-accent/5 lg:col-span-2 flex flex-col lg:flex-row gap-10 items-center overflow-hidden relative`}>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Code className="w-64 h-64 text-accent" />
          </div>
          <div className="space-y-6 relative z-10 lg:w-3/5">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Open_Integration</span>
              <h3 className="text-3xl font-black">{isZh ? "开放 API 与开发者门户" : "Open API & Dev Portal"}</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {isZh 
                ? "基于 RESTful 与 GraphQL 的标准接口，支持从外部工具一键触发构建、获取实时遥测数据并同步工程报告。支持强大的 Webhook 订阅机制。" 
                : "RESTful & GraphQL standard interfaces. Trigger builds, fetch telemetry, and sync reports from external tools. Powerful Webhook subscription mechanism."}
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">
                Generate API Key
              </button>
              <button className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-colors">
                SDK Reference
              </button>
            </div>
          </div>
          <div className="lg:w-2/5 flex flex-col gap-3 relative z-10">
            {['GraphQL_Endpoint_v2', 'Webhook_Callback_Node', 'REST_Auth_Header'].map(node => (
              <div key={node} className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[9px] text-emerald-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {node}
              </div>
            ))}
          </div>
        </div>

        <div className={`p-10 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Ecosystem_Partners
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {['Unity', 'Unreal', 'GitHub', 'AWS', 'Azure', 'GitLab'].map(partner => (
              <div key={partner} className={`aspect-video rounded-2xl border ${mode === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white shadow-sm'} flex items-center justify-center font-black text-xs text-gray-500 transition-all cursor-pointer`}>
                {partner}
              </div>
            ))}
          </div>
          <p className="mt-8 text-[9px] text-gray-500 leading-relaxed text-center">
            {isZh ? "深度集成的基础设施伙伴，确保工程流转的极速与稳定。" : "Deeply integrated infra partners ensuring speed and stability."}
          </p>
        </div>
      </div>

      {/* Theme Accessibility Debugger Section */}
      <div className="pt-4">
        <ThemeAccessibilityDebugger />
      </div>
    </div>
  );
}
