import React from "react";
import { 
  Shield, 
  Layers, 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Lock, 
  Users, 
  BarChart3,
  Search,
  Plus,
  MoreVertical,
  Cpu,
  Database,
  Globe,
  Settings
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";

export default function ProjectPortfolioView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  const projects = [
    { 
      id: "PRJ-001", 
      name: "Neo-City Expansion", 
      type: "Unity AAA", 
      owner: "Alex Chen", 
      status: "Active", 
      health: 94, 
      quota: 85, 
      compliance: "Pass",
      lastUpdate: "12m ago"
    },
    { 
      id: "PRJ-002", 
      name: "Global Web Hub", 
      type: "Next.js Microservices", 
      owner: "Sarah Smith", 
      status: "Scaling", 
      health: 82, 
      quota: 92, 
      compliance: "Warning",
      lastUpdate: "45m ago"
    },
    { 
      id: "PRJ-003", 
      name: "Android V4 Pipeline", 
      type: "Kotlin Multiplatform", 
      owner: "David Miller", 
      status: "Paused", 
      health: 65, 
      quota: 12, 
      compliance: "Audit Req",
      lastUpdate: "2h ago"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "项目治理枢纽" : "Project Governance Hub"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "多租户架构下的项目生命周期管理与资源编排" : "Project lifecycle management and resource orchestration under multi-tenant architecture."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`relative flex items-center ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Search className="absolute left-3 w-4 h-4" />
            <input 
              type="text" 
              placeholder={isZh ? "搜索项目..." : "Search projects..."}
              className={`pl-10 pr-4 py-2 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-accent/50 outline-none w-64 ${
                mode === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
          <button className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-black flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            {isZh ? "新建项目" : "New Project"}
          </button>
        </div>
      </div>

      {/* Portfolio Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isZh ? "活跃项目" : "Active Projects", value: "24", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: isZh ? "平均健康度" : "Avg Health", value: "88%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: isZh ? "已分配算力" : "Allocated Compute", value: "1.2 PHz", icon: Cpu, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: isZh ? "安全合规率" : "Security Compliance", value: "99.4%", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className={`rounded-[2.5rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-black flex items-center gap-2">
            <Database className="w-4 h-4 text-accent" />
            {isZh ? "项目全生命周期清单" : "Project Lifecycle Inventory"}
          </h3>
          <div className="flex gap-2">
             <button className={`p-2 rounded-lg border transition-colors ${mode === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
               <BarChart3 className="w-4 h-4 text-gray-500" />
             </button>
             <button className={`p-2 rounded-lg border transition-colors ${mode === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
               <Settings className="w-4 h-4 text-gray-500" />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-widest text-gray-500 border-b ${mode === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <th className="px-6 py-4">{isZh ? "项目详情" : "Project Info"}</th>
                <th className="px-6 py-4">{isZh ? "治理状态" : "Governance"}</th>
                <th className="px-6 py-4">{isZh ? "资源占用" : "Resource Usage"}</th>
                <th className="px-6 py-4">{isZh ? "合规性" : "Compliance"}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((prj) => (
                <tr key={prj.id} className={`group hover:bg-white/[0.01] transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-50'} text-gray-400 group-hover:text-accent transition-colors`}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`text-sm font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{prj.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{prj.id} • {prj.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${prj.health > 90 ? 'bg-emerald-500' : prj.health > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className="text-xs font-bold">{prj.health}%</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${prj.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {prj.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${prj.quota > 90 ? 'bg-rose-500' : 'bg-accent'}`} 
                          style={{ width: `${prj.quota}%` }} 
                        />
                      </div>
                      <div className="text-[9px] font-mono text-gray-500">{prj.quota}% QUOTA USED</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      prj.compliance === 'Pass' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {prj.compliance === 'Pass' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {prj.compliance}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Management Logic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black mb-4">{isZh ? "访问控制与安全策略" : "Access & Security Policy"}</h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            {isZh ? "基于 RBAC 模型实现项目级细粒度权限管控。自动审计所有操作日志，确保工程治理的合规性与可追溯性。" : "RBAC-based fine-grained project permissions. Auto-auditing of all logs to ensure compliance and traceability."}
          </p>
          <div className="space-y-2">
            {['RBAC_MASTER_SYNC', 'AUDIT_TRAIL_ACTIVE', 'ENCRYPTION_LAYER_v4'].map((tag) => (
              <div key={tag} className="text-[9px] font-mono font-bold text-accent px-2 py-1 bg-accent/5 rounded border border-accent/10 inline-block mr-2">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black mb-4">{isZh ? "弹性资源调度逻辑" : "Elastic Resource Logic"}</h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            {isZh ? "动态管理项目计算资源。根据构建压力自动触发 Runner 扩容，支持闲置资源的一键回收与成本优化。" : "Dynamically manage compute resources. Auto-trigger runner scaling based on build load, with idle reclamation."}
          </p>
          <div className="flex gap-2">
            <div className="h-2 flex-grow bg-blue-500/20 rounded-full" />
            <div className="h-2 flex-grow bg-blue-500/20 rounded-full" />
            <div className="h-2 w-8 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className={`p-8 rounded-[3rem] border border-accent/30 bg-accent/5`}>
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-black mb-4">{isZh ? "跨团队协同治理" : "Cross-Team Governance"}</h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            {isZh ? "打通项目间的依赖关系，实现工程资产的统一治理。支持多租户环境下的工程配置标准化同步。" : "Link project dependencies for unified asset governance. Support standard config sync in multi-tenant environments."}
          </p>
          <button className="w-full py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
            {isZh ? "查看治理报告" : "View Governance Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
