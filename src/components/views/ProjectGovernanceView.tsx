import React, { useState } from "react";
import { 
  ShieldCheck, 
  History, 
  Lock, 
  Eye, 
  FileCheck, 
  AlertCircle,
  Search,
  Filter,
  Download,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  ListTodo,
  RefreshCw,
  Sliders,
  Plus,
  Trash2,
  Play,
  Check,
  Layers,
  Settings,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../LanguageContext";
import { useToast } from "../ToastContext";

export default function ProjectGovernanceView() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isZh = language === "zh";

  // Tab state
  const [activeSubTab, setActiveSubTab] = useState<"standard" | "governance">("governance");

  // State for Terminology & Governance Scanner
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [isFixing, setIsFixing] = useState(false);
  const [bannedTerms, setBannedTerms] = useState<string[]>([
    "GameOps", 
    "LegacyCache", 
    "untracked_dll", 
    "temp_credential"
  ]);
  const [newTerm, setNewTerm] = useState("");
  const [scanResults, setScanResults] = useState<{ term: string; count: number; status: "clean" | "detected" }[]>([]);
  const [isAutoGuardActive, setIsAutoGuardActive] = useState(true);

  // Dynamic metrics
  const [metrics, setMetrics] = useState([
    { 
      labelZh: "术语一致性合规度", 
      labelEn: "Branding Consistency Score", 
      value: "92%", 
      status: "Warning" 
    },
    { 
      labelZh: "静态代码规范执行率", 
      labelEn: "Code Specification Compliance", 
      value: "98.2%", 
      status: "Good" 
    },
    { 
      labelZh: "自动化安全准入率", 
      labelEn: "Automated Security Gate Pass", 
      value: "100%", 
      status: "Secure" 
    },
  ]);

  // Roadmap/Phase checklist state
  const [phases, setPhases] = useState([
    {
      id: 1,
      titleZh: "阶段一：规范对齐与品牌术语治理",
      titleEn: "Phase 1: Brand & Terminology Alignment",
      descZh: "彻底清理历史遗留及非标准词汇，全局收敛为统一的 DevOps Hub 架构命名规范。",
      descEn: "Purge legacy non-standard references to align codebase with unified DevOps Hub branding.",
      progress: 50,
      tasks: [
        { textZh: "重构静态国际化词条（已收敛至 en.json 和 zh.json 国际化库）", textEn: "Refactor static translations into en.json and zh.json libraries", done: true },
        { textZh: "清除诊断专家系统（Troubleshooter）中的 GameOps 残留字段", textEn: "Purge legacy GameOps references from diagnostics engine", done: false },
        { textZh: "对齐流水线构建器（PipelineBuilder）及 YAML 导出的头部声明", textEn: "Align YAML export headers in PipelineBuilder configuration", done: true },
        { textZh: "统一本地微服务及底层 C++ 构建脚本的模块命名规则", textEn: "Standardize module naming across microservices & compilation scripts", done: false },
      ]
    },
    {
      id: 2,
      titleZh: "阶段二：模块解耦与组件规范化治理",
      titleEn: "Phase 2: Codebase Decoupling & Modularization",
      descZh: "治理或重构臃肿单体组件，抽象抽取状态机与数据管道至独立 Hooks 中，防止底层解析溢出。",
      descEn: "Decompress massive monolithic components, extracting key states into isolated hooks to minimize footprints.",
      progress: 50,
      tasks: [
        { textZh: "解耦 PipelineBuilder 中的构建日志解析与分流管道", textEn: "Extract log stream parsing pipe from main PipelineBuilder", done: true },
        { textZh: "隔离 PipelineView 与拓扑可视化（Topology）的渲染逻辑", textEn: "Isolate presentation states of PipelineView and visual Topology", done: false },
        { textZh: "剥离 Troubleshooter 诊断专家系统中的巨量静态知识库", textEn: "Split static troubleshooting knowledge base from logic engine", done: false },
        { textZh: "对齐多端工作空间共享的全局通用类型定义（types.ts）", textEn: "Enforce unified Global Types definition across modules", done: true },
      ]
    },
    {
      id: 3,
      titleZh: "阶段三：自动化静态扫描与构建准入网关",
      titleEn: "Phase 3: Static Security Scan & Gate Enforcement",
      descZh: "在本地构建集群与远程制品部署前执行预检扫描，严格拦截不合规配置与越权代码指令。",
      descEn: "Deploy automated structural pre-flight rule scanners, blocking unauthorized code execution.",
      progress: 25,
      tasks: [
        { textZh: "配置 Git Pre-commit 钩子对敏感凭证和密钥进行前置阻断", textEn: "Configure Git Pre-commit hook to block hardcoded keys", done: true },
        { textZh: "设计针对未签名、未授权 IPA / APK 文件的编译准入网关", textEn: "Enforce build-blocking criteria for unsigned deployment packages", done: false },
        { textZh: "实现本地构建池的多运行进程物理上限（并行硬隔离）", textEn: "Restrict concurrent physical worker processes on local runner hosts", done: false },
        { textZh: "配置 DevOps 构建脚本的统一 AST 语法解析与格式化门禁", textEn: "Integrate syntax linter gates for custom automation scripts", done: false },
      ]
    },
    {
      id: 4,
      titleZh: "阶段四：基于智能规则的纠偏自愈与审计分析",
      titleEn: "Phase 4: Intelligent Self-Healing & Compliance Audit",
      descZh: "配合扫描引擎监控多工作空间结构异动与命名漂移，实时触发自动化修补与合规可视化分析。",
      descEn: "Utilize background scanners to track structural drift across workspaces, enabling active self-healing.",
      progress: 0,
      tasks: [
        { textZh: "建立多项目空间（Workspaces）资源配额的动态硬上限", textEn: "Establish automated resource quotas limits for dynamic workspaces", done: false },
        { textZh: "实现智能诊断组件（Troubleshooter）的一键异常自愈修补回调", textEn: "Implement action hooks for self-healing in diagnostics troubleshooter", done: false },
        { textZh: "建立自动生成项目合规审计与系统异动月度分析报表服务", textEn: "Build automated monthly governance audit & compliance reports microservice", done: false },
      ]
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: "admin_dev", action: "TERMINOLOGY_ALIGN", target: "i18n/en.json, i18n/zh.json", time: "Just now", status: "Success" },
    { id: 2, user: "system_job", action: "GOVERN_SCAN", target: "Workspace_Root", time: "5m ago", status: "Success" },
    { id: 3, user: "li_wei", action: "UPDATE_QUOTA", target: "Project_Neo", time: "15m ago", status: "Success" },
    { id: 4, user: "system", action: "AUTO_SCALE", target: "Cluster_X", time: "1h ago", status: "Success" },
    { id: 5, user: "chen_xy", action: "POLICY_BYPASS", target: "Build_Gate", time: "3h ago", status: "Danger" },
  ]);

  const policies = [
    { name: "Global Security Gate", type: "Mandatory", status: "Active", impact: "High" },
    { name: "Resource Usage Cap", type: "Threshold", status: "Active", impact: "Medium" },
    { name: "Brand Terminology Guard", type: "Auto-Fix", status: "Active", impact: "High" },
    { name: "Code Linting Guard", type: "Standard", status: "Active", impact: "Medium" },
  ];

  // Run terminology governance scan
  const handleRunScan = () => {
    setScanStatus("scanning");
    setTimeout(() => {
      // Simulate checking codebase for banned terms
      const results = bannedTerms.map(term => {
        let count = 0;
        if (term === "GameOps") count = 1;
        else if (term === "LegacyCache") count = 2;
        else if (term === "untracked_dll") count = 3;
        else count = 0;

        return {
          term,
          count,
          status: count === 0 ? "clean" as const : "detected" as const
        };
      });
      setScanResults(results);
      setScanStatus("success");
      
      // Update Branding Alignment to 92% to indicate warnings detected
      setMetrics(prev => prev.map((m, i) => i === 0 ? { ...m, value: "92%", status: "Warning" } : m));

      addToast(
        isZh 
          ? "⚠️ 扫描完成：分析工作空间发现 3 处偏离标准规范的非标准命名与字段残留！" 
          : "⚠️ Scan completed: Detected 3 legacy naming drift violations inside workspace files!", 
        "warning"
      );
    }, 1200);
  };

  // Perform Automated Self-Healing Refactoring
  const handleSelfHeal = () => {
    setIsFixing(true);
    addToast(
      isZh 
        ? "🔧 正在唤醒自动化自愈系统，重构底层国际化词条与诊断库命名..." 
        : "🔧 Waking up self-healing pipelines, refactoring codebase translations...", 
      "info"
    );

    setTimeout(() => {
      // 1. Clear all banned terms to CLEAN
      setScanResults(bannedTerms.map(term => ({ term, count: 0, status: "clean" as const })));
      setScanStatus("success");

      // 2. Bump metrics to 100%
      setMetrics(prev => prev.map((m, i) => i === 0 ? { ...m, value: "100%", status: "Secure" } : m));

      // 3. Mark Phase 1 and Phase 2 tasks as completed
      setPhases(prev => prev.map(phase => {
        if (phase.id === 1 || phase.id === 2) {
          return {
            ...phase,
            progress: 100,
            tasks: phase.tasks.map(t => ({ ...t, done: true }))
          };
        }
        return phase;
      }));

      // 4. Append audit log entry
      setAuditLogs(prev => [
        { 
          id: Date.now(), 
          user: "admin_dev", 
          action: "SELF_HEAL", 
          target: "Global Workspace (DevOps Hub Studio Standards)", 
          time: "Just now", 
          status: "Success" 
        },
        ...prev
      ]);

      setIsFixing(false);
      addToast(
        isZh 
          ? "✅ 智能自愈重构成功！代码一致性合规度已提升至 100%！" 
          : "✅ Self-healing completed successfully! Codebase consistency is now 100%!", 
        "success"
      );
    }, 1500);
  };

  // Add a banned term
  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTerm.trim() && !bannedTerms.includes(newTerm.trim())) {
      setBannedTerms([...bannedTerms, newTerm.trim()]);
      setNewTerm("");
    }
  };

  // Remove a banned term
  const handleRemoveTerm = (term: string) => {
    setBannedTerms(bannedTerms.filter(t => t !== term));
    setScanResults(scanResults.filter(r => r.term !== term));
  };

  // Toggle a roadmap task
  const handleToggleTask = (phaseId: number, taskIndex: number) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedTasks = [...phase.tasks];
        updatedTasks[taskIndex].done = !updatedTasks[taskIndex].done;
        
        // Calculate new progress
        const doneCount = updatedTasks.filter(t => t.done).length;
        const newProgress = Math.round((doneCount / updatedTasks.length) * 100);
        
        return {
          ...phase,
          tasks: updatedTasks,
          progress: newProgress
        };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  return (
    <div className="space-y-8">
      {/* Top Title Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isZh ? "项目治理与合规审计" : "Project Governance & Audit"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isZh ? "项目级品牌术语对齐、操作审计、长期自愈治理与合规性实时监测" : "Project-level branding terminology alignment, active audits, self-healing governance roadmap, and real-time compliance."}
          </p>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${mode === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
            <Download className="w-3.5 h-3.5 inline mr-2" />
            {isZh ? "导出治理白皮书" : "Export Governance BP"}
          </button>
          <button 
            onClick={handleRunScan}
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanStatus === 'scanning' ? 'animate-spin' : ''}`} />
            {isZh ? "一键合规扫描" : "Run Compliance Scan"}
          </button>
        </div>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className={`p-6 rounded-3xl border flex items-center justify-between ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100'}`}>
            <div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                {isZh ? m.labelZh : m.labelEn}
              </div>
              <div className="text-2xl font-black">{m.value}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              m.status === 'Good' || m.status === 'Secure' || m.status === 'Full' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {m.status}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 pb-1">
        <button
          onClick={() => setActiveSubTab("governance")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === "governance" 
              ? "border-accent text-accent" 
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          {isZh ? "🛡️ 长期治理方案与自愈看板" : "🛡️ Long-term Governance & Self-Healing"}
        </button>
        <button
          onClick={() => setActiveSubTab("standard")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === "standard" 
              ? "border-accent text-accent" 
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          {isZh ? "📋 合规审计与控制台" : "📋 Live Audits & Policies"}
        </button>
      </div>

      {activeSubTab === "governance" ? (
        <div className="space-y-8">
          {/* Executive Summary Alert Banner */}
          {metrics[0].value !== "100%" ? (
            <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/20 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] uppercase font-black tracking-widest">
                  {isZh ? "治理解析：检测到非标准遗留命名残留" : "Governance Notice: Legacy Branding Drift Detected"}
                </span>
                <h4 className="text-sm font-black text-gray-200">
                  {isZh ? "⚠️ 静态检查警告：检测到残留的 GameOps 遗留字样和非标准字段 (一致性: 92%)" : "⚠️ Static Check Warning: Detected legacy GameOps/non-standard naming drift inside workspace files"}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isZh ? "项目需要进行命名收敛与规范对齐。可点击下方「一键自愈修复」按钮，由重构引擎自动化全局替换、纠偏并对齐 DevOps Hub Studio 的现代标准。" 
                       : "To achieve full compliance, click 'Run AI Self-Healing Refactor' below to automatically realign and normalize your codebase."}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={handleSelfHeal}
                  disabled={isFixing}
                  className="px-4 py-2.5 text-[10px] bg-amber-600 text-white font-black uppercase tracking-wider rounded-xl hover:bg-amber-500 transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-600/10"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      {isZh ? "重构中..." : "Refactoring..."}
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5" />
                      {isZh ? "一键自愈修复" : "Run Self-Healing"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] uppercase font-black tracking-widest">
                  {isZh ? "治理解析：合规性对齐已就绪 (100%)" : "Governance Success: Brand consistency fully aligned"}
                </span>
                <h4 className="text-sm font-black text-gray-200">
                  {isZh ? "✨ 静态重构完成：代码库非标准字样已全局收敛至 DevOps Hub 标准规范" : "✨ Self-Healing Perfected: Standardized DevOps Hub Studio codebase naming globally"}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isZh ? "已顺利重构底层国际化词条、排障诊断引擎以及本地脚本。当前项目命名一致性与开发标准已达到 100%。" 
                       : "Successfully refactored locales, troubleshooting diagnostic catalogs, and build tasks. Safe, clean, and fully compliant."}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  disabled
                  className="px-4 py-2.5 text-[10px] bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-wider rounded-xl border border-emerald-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isZh ? "完全对齐合规" : "Fully Compliant"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Roadmap Roadmap (Left Col, 7 spans) */}
            <div className="lg:col-span-7 space-y-6">
              <div className={`p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-black flex items-center gap-2 text-lg">
                      <ListTodo className="w-5 h-5 text-accent" />
                      {isZh ? "推荐长期治理路线图" : "Recommended Governance Roadmap"}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {isZh ? "通过系统、分阶段的任务指引，彻底理清大型全栈项目，提升开发效能" : "An actionable phased strategy for keeping the codebase organized, robust, and clean"}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-accent">
                    {isZh ? "总体进度：" : "Overall Progress: "}{Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length)}%
                  </span>
                </div>

                {/* Phase Accordions */}
                <div className="space-y-6">
                  {phases.map((phase) => (
                    <div key={phase.id} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black flex items-center gap-2 text-gray-200">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              phase.progress === 100 ? 'bg-emerald-500 text-white' : 'bg-accent/10 text-accent'
                            }`}>
                              {phase.id}
                            </span>
                            {isZh ? phase.titleZh : phase.titleEn}
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed pl-7">
                            {isZh ? phase.descZh : phase.descEn}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            phase.progress === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {phase.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pl-7 my-3">
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${phase.progress === 100 ? 'bg-emerald-500' : 'bg-accent'}`}
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tasks Checkbox List */}
                      <div className="pl-7 grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        {phase.tasks.map((task, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleToggleTask(phase.id, idx)}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              task.done 
                                ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10' 
                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                              task.done ? 'bg-emerald-500 border-emerald-600' : 'border-gray-600'
                            }`}>
                              {task.done && <Check className="w-2.5 h-2.5 text-black font-black" />}
                            </div>
                            <span className={`text-[10px] font-bold ${task.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                              {isZh ? task.textZh : task.textEn}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Terms Guard & Realtime Scanner (Right Col, 5 spans) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Terminology Guard */}
              <div className={`p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h3 className="font-black flex items-center gap-2 text-base mb-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  {isZh ? "术语漂移检测与隔离规则" : "Terminology Drift & Guard Filters"}
                </h3>
                <p className="text-[10px] text-gray-500 mb-6">
                  {isZh ? "设定禁用词或旧品牌，通过一键扫描实时阻止遗留术语漏入自动构建与脚本架构导出中" 
                       : "Set custom forbidden tokens/brand words to keep code exports and configuration outputs aligned."}
                </p>

                {/* Automation Guard Toggle */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-black text-gray-200 block">{isZh ? "启用编译自动拦截门禁" : "Enable Automated Terminology Gate"}</span>
                    <span className="text-[9px] text-gray-400">{isZh ? "自动分析 Pipeline 导出的 YAML 命名" : "Analyze YAML pipeline exports and reject legacy brand names"}</span>
                  </div>
                  <button 
                    onClick={() => setIsAutoGuardActive(!isAutoGuardActive)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${isAutoGuardActive ? 'bg-emerald-500' : 'bg-gray-800'}`}
                  >
                    <div className={`w-4 h-4 bg-black rounded-full absolute top-0.5 transition-all ${isAutoGuardActive ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Add Forbidden Term */}
                <form onSubmit={handleAddTerm} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder={isZh ? "添加禁用过滤词 (如 game_build)..." : "Add custom banned term..."}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                  <button 
                    type="submit" 
                    className="px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {/* List of current banned terms */}
                <div className="space-y-2 max-h-40 overflow-y-auto mb-6 pr-2">
                  {bannedTerms.map((term) => (
                    <div key={term} className="flex items-center justify-between bg-white/5 p-2 rounded-xl text-xs">
                      <span className="font-mono text-gray-300 font-bold">{term}</span>
                      <button 
                        onClick={() => handleRemoveTerm(term)}
                        className="text-rose-500 hover:text-rose-400 p-1"
                        title={isZh ? "移除过滤" : "Remove"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Trigger Compliance Audit Scan */}
                <button 
                  onClick={handleRunScan}
                  disabled={scanStatus === "scanning"}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {scanStatus === "scanning" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {isZh ? "正在检测全站代码..." : "Scanning codebase files..."}
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isZh ? "运行全站代码治理扫描" : "Run Full Governance Scan"}
                    </>
                  )}
                </button>

                {/* Scan Results Visualization */}
                {scanStatus !== "idle" && (
                  <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{isZh ? "治理扫描报告" : "Governance Results"}</span>
                      <span className="text-[9px] font-mono text-emerald-400">
                        {isZh ? "扫描耗时: 148ms" : "Completed in 148ms"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {scanResults.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center">{isZh ? "尚未运行扫描" : "No results yet."}</p>
                      ) : (
                        scanResults.map((r) => (
                          <div key={r.term} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-xs font-mono font-bold text-gray-300">{r.term}</span>
                            <div className="flex items-center gap-1.5">
                              {r.count === 0 ? (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-black uppercase">
                                  {isZh ? "完全对齐" : "CLEAN"}
                                </span>
                              ) : (
                                <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-black uppercase">
                                  {r.count} {isZh ? "处需重命名" : "FOUND"}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policy Management Card */}
          <div className={`lg:col-span-1 p-8 rounded-[3rem] border ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                {isZh ? "活跃治理策略" : "Active Policies"}
              </h3>
              <span className="text-[10px] font-mono text-gray-500">{policies.length} TOTAL</span>
            </div>
            <div className="space-y-4">
              {policies.map((policy, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{policy.name}</span>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      policy.impact === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {policy.impact}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    <span>{policy.type}</span>
                    <span className="text-emerald-500">● {policy.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-2xl border border-dashed border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 transition-colors">
              + {isZh ? "配置安全围栏" : "Configure Guardrail"}
            </button>
            
            <button 
               onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
               className="w-full mt-3 py-3 rounded-2xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
            >
               <ShieldCheck className="w-4 h-4" />
               {isZh ? "配置质量度量标准" : "Configure Quality Standards"}
            </button>
          </div>

          {/* Audit Log Table Card */}
          <div className={`lg:col-span-2 rounded-[3rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h3 className="font-black flex items-center gap-2 text-xl">
                <History className="w-6 h-6 text-accent" />
                {isZh ? "实时审计追踪" : "Live Audit Trail"}
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder={isZh ? "搜索日志..." : "Search logs..."}
                    className="pl-9 pr-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs outline-none focus:border-accent/50"
                  />
                </div>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10"><Filter className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                    <th className="px-8 py-5">{isZh ? "用户/参与者" : "Actor"}</th>
                    <th className="px-8 py-5">{isZh ? "操作类型" : "Action"}</th>
                    <th className="px-8 py-5">{isZh ? "目标对象" : "Target"}</th>
                    <th className="px-8 py-5">{isZh ? "触发时间" : "Timestamp"}</th>
                    <th className="px-8 py-5">{isZh ? "状态" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent">
                          {log.user.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold">{log.user}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-400">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-500">{log.target}</td>
                      <td className="px-8 py-5 text-[10px] text-gray-500 font-mono">{log.time}</td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 
                          log.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {log.status === 'Success' ? <UserCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {log.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isZh ? "精细化权限" : "Fine-grained Auth", desc: isZh ? "基于项目的 RBAC 访问隔离" : "Project-based RBAC isolation", icon: Lock },
          { label: isZh ? "自动化扫描" : "Auto Scanning", desc: isZh ? "集成静态检查与安全门禁" : "Integrated static checks & gates", icon: Eye },
          { label: isZh ? "合规性评分" : "Compliance Score", desc: isZh ? "实时评估工程合规度" : "Real-time compliance rating", icon: FileCheck },
          { label: isZh ? "异常预警" : "Anomaly Detection", desc: isZh ? "智能识别越权与风险操作" : "AI detection of risky actions", icon: AlertCircle },
        ].map((item, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${mode === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-gray-100 shadow-sm'} transition-colors`}>
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <item.icon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black mb-1">{item.label}</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
