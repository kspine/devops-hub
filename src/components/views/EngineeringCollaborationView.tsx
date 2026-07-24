import React from "react";
import { 
  Users, 
  UserCheck, 
  Activity, 
  BarChart3, 
  Bell, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Mail,
  Zap,
  ArrowRight,
  ShieldCheck,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";

export default function EngineeringCollaborationView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === "zh";

  const teamHealth = [
    { team: "Frontend Core", score: 92, velocity: "+12%", health: "Stable" },
    { team: "Engine Systems", score: 78, velocity: "-5%", health: "At Risk" },
    { team: "DevOps Infra", score: 95, velocity: "+2%", health: "Optimal" },
  ];

  const assignments = [
    { task: "UE5 Build failure debug", urgency: "High", recommended: "Alex Chen", reason: "89% success in similar tasks" },
    { task: "Pipeline Security Scan", urgency: "Medium", recommended: "Sarah Lee", reason: "Security specialist" },
    { task: "Release Note Generation", urgency: "Low", recommended: "Auto-Agent", reason: "Template available" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "工程协作与组织能效" : "Collaboration & Team Efficiency"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "打破孤岛，实现基于数据的自动化任务分配与团队能效对标" : "Break silos with data-driven auto-assignment and team efficiency benchmarking."}
          </p>
        </div>
        <div className="flex gap-3">
          <button className={`p-2 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-100 text-gray-500'}`}>
            <Bell className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20">
            {isZh ? "团队配置标准" : "Team Standards"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Team Health Benchmarking */}
        <div className={`lg:col-span-4 p-8 rounded-[3.5rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Team_Health_Scores
          </h3>
          <div className="space-y-6">
            {teamHealth.map((team, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm font-black">{team.team}</div>
                    <div className="text-[10px] text-gray-500">{isZh ? "能效趋势" : "Velocity"}: <span className={team.velocity.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{team.velocity}</span></div>
                  </div>
                  <div className={`text-xl font-black ${team.score > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{team.score}</div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${team.score}%` }}
                    className={`h-full ${team.score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 rounded-2xl border border-dashed border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 transition-colors">
            {isZh ? "查看详细对标报告" : "View Detailed Benchmark"}
          </button>
        </div>

        {/* AI Task Assignment Suggestions */}
        <div className={`lg:col-span-8 rounded-[3.5rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black flex items-center gap-3">
                <Zap className="w-6 h-6 text-accent" />
                {isZh ? "智能任务分配建议" : "AI Task Assignment"}
              </h3>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Based on historical performance & current load</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Live Engine</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <th className="px-10 py-6">{isZh ? "工程任务" : "Engineering Task"}</th>
                  <th className="px-10 py-6">{isZh ? "推荐担任者" : "Recommended Actor"}</th>
                  <th className="px-10 py-6">{isZh ? "推荐逻辑" : "Rationale"}</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assignments.map((as, i) => (
                  <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${as.urgency === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <span className={`text-sm font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{as.task}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-[10px] font-black">
                           {as.recommended[0]}
                         </div>
                         <span className="text-xs font-bold text-gray-400">{as.recommended}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-mono text-gray-500">{as.reason}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="px-4 py-2 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {isZh ? "分配任务" : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Organization Automation Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: isZh ? "通知策略引擎" : "Notification Strategy", 
            desc: isZh ? "自动化构建状态推送至 Slack/Teams/Email" : "Auto-push build status to Slack/Teams/Email", 
            icon: MessageSquare,
            tags: ['SLACK', 'WEBHOOK', 'EMAIL_v2']
          },
          { 
            title: isZh ? "工程质量门禁" : "Quality Gateways", 
            desc: isZh ? "强制执行代码审查与安全扫描流程" : "Enforce code reviews and security scanning", 
            icon: ShieldCheck,
            tags: ['SONAR_SYNC', 'PR_GATES']
          },
          { 
            title: isZh ? "责任分配闭环" : "Responsibility Loop", 
            desc: isZh ? "任务自动映射至 PM 工具并追踪进度" : "Auto-map tasks to PM tools and track progress", 
            icon: CheckCircle2,
            tags: ['JIRA_HOOK', 'NOTION_API']
          }
        ].map((item, i) => (
          <div key={i} className={`p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-4">{item.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">{item.desc}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(t => (
                <span key={t} className="text-[8px] font-mono font-bold text-accent px-2 py-1 bg-accent/5 rounded border border-accent/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
