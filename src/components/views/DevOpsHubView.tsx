import React, { useMemo } from "react";
import {
  Wrench,
  Settings2,
  Link,
  Gauge,
  Lightbulb,
  Construction,
  Compass,
  BrainCircuit,
  BookOpen,
  FileSearch,
  Gamepad2,
  MonitorSmartphone,
  Trophy,
  TrendingUp,
  Briefcase,
  Boxes,
  Activity,
  Zap,
  ShieldCheck,
  Database,
  GitBranch,
  Layers,
  ArrowRight,
  Settings,
  Code,
  FileCode,
  CheckCircle2,
  History,
  LineChart,
  Search,
  Box,
  Cog,
  TerminalSquare,
  Key,
  Network,
  GitMerge,
  Cloud,
  RefreshCw,
  GitPullRequest,
  Shield,
  Sparkles,
  Server,
  DollarSign,
  Cpu,
  Map,
  ListTree,
  ActivitySquare,
  MessageSquareWarning,
  ScrollText,
  ShieldAlert,
  Users2,
  Rocket,
  BotMessageSquare,
  Blocks,
  Puzzle,
} from "lucide-react";
import { useLanguage } from "../../LanguageContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DevOpsHubView() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const chartData = useMemo(
    () => [
      { name: isZh ? "周一" : "Mon", builds: 40, deploys: 24 },
      { name: isZh ? "周二" : "Tue", builds: 30, deploys: 13 },
      { name: isZh ? "周三" : "Wed", builds: 45, deploys: 28 },
      { name: isZh ? "周四" : "Thu", builds: 50, deploys: 39 },
      { name: isZh ? "周五" : "Fri", builds: 65, deploys: 48 },
      { name: isZh ? "周六" : "Sat", builds: 25, deploys: 18 },
      { name: isZh ? "周日" : "Sun", builds: 34, deploys: 20 },
    ],
    [isZh],
  );

  const stats = [
    {
      label: isZh ? "活跃流水线" : "Active Pipelines",
      value: "14",
      icon: GitBranch,
      color: "text-sky-400",
    },
    {
      label: isZh ? "集群健康度" : "Cluster Health",
      value: "98%",
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      label: isZh ? "工程质量分" : "Quality Score",
      value: "96.4",
      icon: ShieldCheck,
      color: "text-rose-500",
    },
    {
      label: isZh ? "微服务拓扑" : "Microservices",
      value: "48",
      icon: Database,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0a] text-gray-100 min-h-screen">
      <header className="space-y-3 mb-10 mt-4 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <TerminalSquare className="w-4 h-4" />
          <span>{isZh ? "工程能力中心" : "Engineering Capability Center"}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          DevOps Hub Studio
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          {isZh
            ? "全链路研发效能与工程质量体系闭环"
            : "Enterprise R&D Efficiency & Quality Built-in"}
        </p>
      </header>

      <div
        id="devops-stats-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#111] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors"
            >
              <div className={`p-3 bg-white/5 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          id="devops-efficiency-chart"
          className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-100 tracking-tight">
              {isZh ? "效能度量趋势" : "Pipeline Efficiency Loop"}
            </h2>
          </div>
          <div className="h-64 bg-black/30 rounded-xl border border-white/5 flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBuild" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeploy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                    color: "#f3f4f6",
                  }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Area
                  type="monotone"
                  dataKey="builds"
                  stroke="#38bdf8"
                  fillOpacity={1}
                  fill="url(#colorBuild)"
                  name={isZh ? "构建次数" : "Builds"}
                />
                <Area
                  type="monotone"
                  dataKey="deploys"
                  stroke="#34d399"
                  fillOpacity={1}
                  fill="url(#colorDeploy)"
                  name={isZh ? "部署次数" : "Deploys"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          id="devops-active-agents"
          className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-4 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
              <ShieldCheck className="h-5 w-5 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-100 tracking-tight">
              {isZh ? "质量门禁状态" : "Quality Gate Status"}
            </h2>
          </div>
          <div className="space-y-2 flex-grow">
            {[
              isZh ? "静态代码分析" : "Static Analysis",
              isZh ? "单元测试覆盖" : "Unit Testing",
              isZh ? "构建错误预测" : "Build Error Pred",
            ].map((gate) => (
              <div
                key={gate}
                className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg"
              >
                <span className="font-semibold text-gray-300">{gate}</span>
                <span className="text-emerald-400 text-xs font-bold uppercase">
                  {isZh ? "已通过" : "Passed"}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("navigate-tab", { detail: "quality" }),
              )
            }
            className="mt-4 w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors border border-rose-500/20"
          >
            {isZh ? "进入工程质量中心" : "Enter Quality Center"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Settings className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh
                ? "工程价值体系 (Engineering Value Chain)"
                : "Engineering Value Chain"}
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">
                  {isZh ? "工程阶段" : "Phase"}
                </th>
                <th className="px-6 py-4">
                  {isZh ? "工程价值" : "Engineering Value"}
                </th>
                <th className="px-6 py-4 rounded-tr-lg">
                  {isZh
                    ? "DevOps Hub Studio 提供能力"
                    : "Provided Capabilities"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  icon: Code,
                  phaseZh: "开发",
                  phaseEn: "Development",
                  valZh: "提高开发效率",
                  valEn: "Improve development efficiency",
                  capZh: "构建模板 + 构建提示 + API连接",
                  capEn: "Build templates + Prompts + API integration",
                },
                {
                  icon: Cog,
                  phaseZh: "构建",
                  phaseEn: "Build",
                  valZh: "构建稳定性与效率提升",
                  valEn: "Enhance stability & efficiency",
                  capZh: "构建优化建议 + 构建健康度 + 缓存机制",
                  capEn: "Optimization suggestions + Build health + Caching",
                },
                {
                  icon: FileCode,
                  phaseZh: "测试",
                  phaseEn: "Testing",
                  valZh: "提高测试覆盖率与自动化能力",
                  valEn: "Increase coverage & automation",
                  capZh: "自动测试推荐 + 测试覆盖率监控",
                  capEn: "Auto-test recommendations + Coverage monitoring",
                },
                {
                  icon: Box,
                  phaseZh: "部署",
                  phaseEn: "Deployment",
                  valZh: "部署成功率与成本控制",
                  valEn: "Deployment success rate & cost control",
                  capZh: "部署策略推荐 + 风险预警",
                  capEn: "Deployment strategy + Risk alerts",
                },
                {
                  icon: LineChart,
                  phaseZh: "监控",
                  phaseEn: "Monitoring",
                  valZh: "提供高效性能评估",
                  valEn: "High-efficiency performance evaluation",
                  capZh: "构建性能监控 + 性能报告 + 构建日志分析",
                  capEn: "Performance monitoring + Reports + Log analysis",
                },
                {
                  icon: History,
                  phaseZh: "迭代",
                  phaseEn: "Iteration",
                  valZh: "工程过程优化持续提升",
                  valEn: "Continuous process optimization",
                  capZh: "构建趋势分析 + 智能提示 + 构建优化埋点",
                  capEn:
                    "Trend analysis + Smart prompts + Optimization tracking",
                },
              ].map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <tr key={i} className="hover:bg-white/5/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-200 flex items-center gap-3">
                      <RowIcon className="h-4 w-4 text-gray-500" />
                      {isZh ? row.phaseZh : row.phaseEn}
                    </td>
                    <td className="px-6 py-4">
                      {isZh ? row.valZh : row.valEn}
                    </td>
                    <td className="px-6 py-4 text-sky-400 font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {isZh ? row.capZh : row.capEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        id="devops-integration-path"
        className="bg-[#111] border border-white/5 rounded-2xl p-6 mt-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <TerminalSquare className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh
                ? "产品设计中的工程化体现 (Engineering in Product Design)"
                : "Engineering in Product Design"}
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">
                  {isZh ? "功能模块" : "Feature Module"}
                </th>
                <th className="px-6 py-4 rounded-tr-lg">
                  {isZh ? "工程化体现" : "Engineering Embodiment"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  icon: Layers,
                  featureZh: "构建模板",
                  featureEn: "Build Templates",
                  engZh: "工程标准 + 可配置性 + 可复用性",
                  engEn:
                    "Engineering standards + Configurability + Reusability",
                },
                {
                  icon: ShieldCheck,
                  featureZh: "构建健康评分",
                  featureEn: "Build Health Scoring",
                  engZh: "可测性 + 质量控制能力 + 全流程监控",
                  engEn:
                    "Testability + Quality control + Full-process monitoring",
                },
                {
                  icon: Zap,
                  featureZh: "构建提示体系",
                  featureEn: "Build Prompt System",
                  engZh: "知识驱动 + 智能推荐 + 可配置规则",
                  engEn:
                    "Knowledge-driven + Smart recommendation + Configurable rules",
                },
                {
                  icon: Search,
                  featureZh: "构建搜索功能",
                  featureEn: "Build Search",
                  engZh: "构建日志完善 + 可追溯工程流程",
                  engEn: "Comprehensive logs + Traceable engineering process",
                },
                {
                  icon: History,
                  featureZh: "构建回滚支持",
                  featureEn: "Build Rollback",
                  engZh: "可靠性 + 可调测性 + 构建可验证性",
                  engEn: "Reliability + Debuggability + Build verifiability",
                },
                {
                  icon: Database,
                  featureZh: "构建快照支持",
                  featureEn: "Build Snapshots",
                  engZh: "可审计性 + 可复现性 + 构建可检测性",
                  engEn: "Auditability + Reproducibility + Build detectability",
                },
                {
                  icon: Activity,
                  featureZh: "构建速度统计",
                  featureEn: "Build Speed Analytics",
                  engZh: "工程效率 + 流水线优化 + 资源规划",
                  engEn:
                    "Engineering efficiency + Pipeline optimization + Resource planning",
                },
              ].map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <tr
                    key={i}
                    className="hover:bg-white/5/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-200 w-1/3 flex items-center gap-3">
                      <div className="p-1.5 bg-white/5 rounded group-hover:bg-indigo-500/20 transition-colors">
                        <RowIcon className="h-4 w-4 text-indigo-400" />
                      </div>
                      {isZh ? row.featureZh : row.featureEn}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {isZh ? row.engZh : row.engEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        id="devops-advanced-engineering"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
      >
        <div
          id="devops-card-security"
          className="bg-gradient-to-br from-indigo-950/50 to-[#111] border border-indigo-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-indigo-300 mb-2 flex items-center gap-2">
            <Key className="h-5 w-5" />
            {isZh
              ? "企业级安全规范 (Security & Compliance)"
              : "Enterprise Security & Compliance"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "全生命周期安全内建，保障工程产物与配置数据的绝对安全。"
              : "Built-in full-lifecycle security, ensuring absolute safety of engineering artifacts and config data."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />{" "}
              {isZh
                ? "静态代码安全扫描 (SAST)"
                : "Static Application Security Testing (SAST)"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />{" "}
              {isZh
                ? "依赖漏洞分析 (SCA)"
                : "Software Composition Analysis (SCA)"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />{" "}
              {isZh
                ? "凭据扫描与防泄漏"
                : "Credential Scanning & Leak Prevention"}
            </li>
          </ul>
        </div>

        <div
          id="devops-card-kubernetes"
          className="bg-gradient-to-br from-emerald-950/50 to-[#111] border border-emerald-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-emerald-300 mb-2 flex items-center gap-2">
            <Network className="h-5 w-5" />
            {isZh
              ? "高可用与弹性调度 (High Availability)"
              : "High Availability & Elasticity"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "支持分布式构建节点与自动化弹性调度，应对高并发构建需求。"
              : "Supports distributed build nodes and automated elastic scheduling for high-concurrency needs."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />{" "}
              {isZh
                ? "基于 Kubernetes 的弹性构建"
                : "Kubernetes-based Elastic Builds"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />{" "}
              {isZh
                ? "多云与混合云调度支持"
                : "Multi-cloud & Hybrid Cloud Scheduling"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />{" "}
              {isZh
                ? "故障自愈与节点健康检查"
                : "Self-healing & Node Health Checks"}
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
            <GitMerge className="h-6 w-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh
                ? "与现有 DevOps 标准整合 (Integration Path)"
                : "Integration Path with Current DevOps Practices"}
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">
                  {isZh ? "工程实践" : "Engineering Practice"}
                </th>
                <th className="px-6 py-4 rounded-tr-lg">
                  {isZh
                    ? "DevOps Hub Studio 支持方式"
                    : "DevOps Hub Studio Support"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  icon: GitPullRequest,
                  pracZh: "CI/CD 标准",
                  pracEn: "CI/CD Standards",
                  supZh: "提供与主流CI/CD平台的兼容构建系统",
                  supEn:
                    "Compatible build system with mainstream CI/CD platforms",
                },
                {
                  icon: Box,
                  pracZh: "容器化与微服务",
                  pracEn: "Containerization & Microservices",
                  supZh: "支持Docker、Kubernetes、Service Mesh",
                  supEn: "Support for Docker, Kubernetes, Service Mesh",
                },
                {
                  icon: Cloud,
                  pracZh: "云原生开发",
                  pracEn: "Cloud-Native Development",
                  supZh: "支持云端构建、云资源优化、云成本控制",
                  supEn: "Cloud build, resource optimization, and cost control",
                },
                {
                  icon: RefreshCw,
                  pracZh: "软件交付流程（SDLC）集成",
                  pracEn: "SDLC Integration",
                  supZh: "支持从需求到部署的完整SDLC闭环",
                  supEn: "Full SDLC loop from requirements to deployment",
                },
                {
                  icon: GitBranch,
                  pracZh: "工程控制流（CI/CD Pipeline）",
                  pracEn: "Engineering Control Flow (CI/CD Pipeline)",
                  supZh: "提供可编程的工程流程构建能力",
                  supEn: "Programmable engineering pipeline construction",
                },
                {
                  icon: Shield,
                  pracZh: "工程审计与合规机制",
                  pracEn: "Audit & Compliance",
                  supZh: "构建历史记录、任务执行痕迹、构建质量追踪",
                  supEn:
                    "Build history, task execution traces, and quality tracking",
                },
              ].map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <tr
                    key={i}
                    className="hover:bg-white/5/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-200 w-1/3 flex items-center gap-3">
                      <div className="p-1.5 bg-white/5 rounded group-hover:bg-sky-500/20 transition-colors">
                        <RowIcon className="h-4 w-4 text-sky-400" />
                      </div>
                      {isZh ? row.pracZh : row.pracEn}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {isZh ? row.supZh : row.supEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div
          id="devops-card-aiops"
          className="bg-gradient-to-br from-purple-950/50 to-[#111] border border-purple-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-purple-300 mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {isZh
              ? "AIOps & 智能化工程 (AI-Driven DevOps)"
              : "AIOps & Intelligent Engineering"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "引入大模型与机器学习能力，实现从被动响应到预测性自愈的跨越。"
              : "Leveraging LLMs and machine learning for predictive self-healing and smart automation."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />{" "}
              {isZh
                ? "智能日志异常检测与根因分析"
                : "Smart Log Anomaly Detection & Root Cause Analysis"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />{" "}
              {isZh
                ? "基于历史数据的构建失败预测"
                : "Predictive Build Failure based on History"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />{" "}
              {isZh
                ? "代码质量 AI 自动审查 (AI Code Review)"
                : "AI-Powered Code Quality Review"}
            </li>
          </ul>
        </div>

        <div
          id="devops-card-gitops"
          className="bg-gradient-to-br from-amber-950/50 to-[#111] border border-amber-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <Server className="h-5 w-5" />
            {isZh
              ? "GitOps & 基础设施即代码 (IaC)"
              : "GitOps & Infrastructure as Code"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "以 Git 为单一可信源，实现基础设施的声明式管理与自动化演进。"
              : "Using Git as the single source of truth for declarative infrastructure and automated evolution."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />{" "}
              {isZh
                ? "声明式环境配置与状态一致性校验"
                : "Declarative Config & State Consistency"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />{" "}
              {isZh
                ? "配置漂移自动检测与告警 (Drift Detection)"
                : "Automated Config Drift Detection"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />{" "}
              {isZh
                ? "基础设施变更的 CI/CD 自动化审核"
                : "CI/CD Automated Review for IaC Changes"}
            </li>
          </ul>
        </div>

        <div
          id="devops-card-serverless"
          className="bg-gradient-to-br from-blue-950/50 to-[#111] border border-blue-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            {isZh
              ? "边缘与 Serverless 计算交付 (Edge & Serverless)"
              : "Edge & Serverless Delivery"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "面向现代无服务器架构的秒级弹性伸缩与全托管交付流。"
              : "Second-level elastic scaling and fully managed delivery flow for modern serverless architectures."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />{" "}
              {isZh
                ? "Serverless 函数自动打包与冷启动优化"
                : "Serverless Function Packaging & Cold Start Optimization"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />{" "}
              {isZh
                ? "边缘节点 (Edge Node) 全球分发调度"
                : "Global Distribution & Routing for Edge Nodes"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />{" "}
              {isZh
                ? "无状态架构状态一致性监控"
                : "Stateless Architecture Consistency Monitoring"}
            </li>
          </ul>
        </div>

        <div
          id="devops-card-finops"
          className="bg-gradient-to-br from-yellow-950/50 to-[#111] border border-yellow-900/50 rounded-2xl p-6"
        >
          <h3 className="text-md font-semibold text-yellow-300 mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {isZh
              ? "FinOps 云成本工程 (Cloud Cost Engineering)"
              : "FinOps & Cloud Cost Engineering"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {isZh
              ? "将成本控制融入研发与运维全周期，实现工程价值与商业成本的最优平衡。"
              : "Integrating cost control into the R&D and Ops lifecycle for optimal business value balance."}
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />{" "}
              {isZh
                ? "集群资源利用率分析与僵尸资源回收"
                : "Cluster Resource Analytics & Zombie Resource Reclaiming"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />{" "}
              {isZh
                ? "按环境/项目的多维度成本分摊展示"
                : "Multi-dimensional Cost Allocation by Env/Project"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />{" "}
              {isZh
                ? "自动化成本异常告警策略制定"
                : "Automated Cost Anomaly Alerting Strategies"}
            </li>
          </ul>
        </div>
      </div>

      <div
        id="devops-dora-metrics"
        className="bg-[#111] border border-white/5 rounded-2xl p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <Activity className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
                {isZh
                  ? "DORA 工程效能指标 (DORA Metrics)"
                  : "DORA Engineering Metrics"}
              </h2>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
            {isZh ? "精英级效能 (Elite Performer)" : "Elite Performer"}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              labelZh: "部署频率",
              labelEn: "Deployment Frequency",
              val: "按需 (Multiple/Day)",
              descZh: "按需即刻部署",
              descEn: "On-demand deployments",
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
            },
            {
              labelZh: "变更前置时间",
              labelEn: "Lead Time for Changes",
              val: "< 1 小时",
              descZh: "从提交到生产",
              descEn: "Commit to production",
              color: "text-sky-400",
              bg: "bg-sky-400/10",
            },
            {
              labelZh: "服务恢复时间",
              labelEn: "Mean Time to Recovery",
              val: "< 10 分钟",
              descZh: "MTTR 故障自愈",
              descEn: "Self-healing MTTR",
              color: "text-indigo-400",
              bg: "bg-indigo-400/10",
            },
            {
              labelZh: "变更失败率",
              labelEn: "Change Failure Rate",
              val: "1.2%",
              descZh: "通过金丝雀发布降低",
              descEn: "Reduced via Canary",
              color: "text-amber-400",
              bg: "bg-amber-400/10",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2"
            >
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {isZh ? metric.labelZh : metric.labelEn}
              </span>
              <span className={"text-xl font-bold " + metric.color}>
                {metric.val}
              </span>
              <span className="text-xs text-gray-500">
                {isZh ? metric.descZh : metric.descEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div id="devops-data-driven" className="mt-10 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20">
            <LineChart className="h-6 w-6 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh
                ? "工程数据驱动的产品设计"
                : "Data-Driven Engineering Design"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isZh
                ? "利用底层研发数据重构 DevOps 产品体验"
                : "Reconstructing DevOps product experience using underlying R&D data"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
              <Layers className="w-48 h-48 text-sky-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                {isZh ? "效能三角模型" : "Efficiency Triangle Model"}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {isZh
                  ? "构建 “用户行为 - 构建质量 - 团队协作” 的三角数据模型，指导平台架构演进与能力迭代。"
                  : "Building the 'User Behavior - Build Quality - Team Collaboration' triangle data model to guide platform architecture evolution."}
              </p>
            </div>

            <div className="flex items-center justify-center py-6 relative z-10">
              <div className="w-56 h-56 relative animate-pulse-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-bold text-sky-300 bg-sky-900/30 px-3 py-1.5 rounded-full border border-sky-400/30 backdrop-blur-md z-10 whitespace-nowrap shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  {isZh ? "用户行为 (User Behavior)" : "User Behavior"}
                </div>
                <div className="absolute bottom-2 -left-4 text-xs font-bold text-emerald-300 bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-md z-10 whitespace-nowrap shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                  {isZh ? "团队协作 (Collaboration)" : "Collaboration"}
                </div>
                <div className="absolute bottom-2 -right-4 text-xs font-bold text-rose-300 bg-rose-900/30 px-3 py-1.5 rounded-full border border-rose-400/30 backdrop-blur-md z-10 whitespace-nowrap shadow-[0_0_15px_rgba(251,113,133,0.2)]">
                  {isZh ? "构建质量 (Build Quality)" : "Build Quality"}
                </div>
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full absolute inset-0 text-white/5"
                  style={{ transform: "scale(0.8) translateY(10%)" }}
                >
                  <polygon
                    points="50,10 10,90 90,90"
                    fill="rgba(255,255,255,0.02)"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <polygon
                    points="50,25 25,75 75,75"
                    fill="rgba(255,255,255,0.03)"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="10"
                    r="4"
                    fill="#38bdf8"
                    className="animate-pulse"
                  />
                  <circle
                    cx="10"
                    cy="90"
                    r="4"
                    fill="#34d399"
                    className="animate-pulse"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="4"
                    fill="#fb7185"
                    className="animate-pulse"
                  />

                  <line
                    x1="50"
                    y1="10"
                    x2="10"
                    y2="90"
                    stroke="url(#grad1)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="10"
                    y1="90"
                    x2="90"
                    y2="90"
                    stroke="url(#grad2)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="90"
                    y1="90"
                    x2="50"
                    y2="10"
                    stroke="url(#grad3)"
                    strokeWidth="1.5"
                  />

                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#fb7185" />
                    </linearGradient>
                    <linearGradient
                      id="grad3"
                      x1="100%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#111] rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                  <Database className="h-4 w-4 text-emerald-400" />
                </div>
                {isZh
                  ? "基于构建数据的算法优化"
                  : "Algorithm Optimization via Build Data"}
              </h3>
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-200 font-medium text-sm">
                      {isZh
                        ? "智能提示系统训练"
                        : "Smart Prompt System Training"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    {isZh
                      ? "利用历史错误类型与解决路径，训练精准的错误提示与自动修复建议模型。"
                      : "Train accurate error prompts and auto-fix suggestions using historical error types and resolution paths."}
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <GitBranch className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-200 font-medium text-sm">
                      {isZh
                        ? "构建策略推荐算法"
                        : "Build Strategy Recommendation"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    {isZh
                      ? "根据代码规模、依赖树与历史构建时间，动态推荐最优缓存和并发策略。"
                      : "Dynamically recommend optimal caching and concurrency strategies based on code scale and history."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-fuchsia-500/10 rounded-md border border-fuchsia-500/20">
                  <Activity className="h-4 w-4 text-fuchsia-400" />
                </div>
                {isZh ? "用户行为分析与洞察" : "Behavior Analysis & Insight"}
              </h3>
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="h-4 w-4 text-fuchsia-400" />
                    <span className="text-gray-200 font-medium text-sm">
                      {isZh
                        ? "构建失败模式分析"
                        : "Build Failure Pattern Analysis"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    {isZh
                      ? "聚类分析频繁失败的构建节点，前置发现底层基础设施或特定依赖的共性问题。"
                      : "Cluster analysis of frequent failures to proactively discover common infrastructure or dependency issues."}
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Search className="h-4 w-4 text-fuchsia-400" />
                    <span className="text-gray-200 font-medium text-sm">
                      {isZh
                        ? "个性化研发体验推荐"
                        : "Personalized R&D Experience"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    {isZh
                      ? "结合用户高频操作路径与构建偏好，提供定制化的仪表盘与快捷操作推荐。"
                      : "Provide customized dashboards and shortcut recommendations based on user high-frequency action paths."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="devops-case-studies" className="mt-10 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
            <Briefcase className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh ? "工程化产品案例实践" : "Engineering Case Studies"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isZh
                ? "面向多端、多场景的端到端构建与效能优化实践"
                : "End-to-end build and efficiency optimization practices for multi-platform scenarios"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case 1: Unity */}
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -z-10 group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-500/10">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-100 leading-tight">
                {isZh
                  ? "Unity 跨平台游戏\n构建优化"
                  : "Unity Cross-Platform Build Optimization"}
              </h3>
            </div>
            <div className="space-y-5 flex-1 z-10">
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                  {isZh ? "业务痛点" : "Pain Points"}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {isZh
                    ? "独立游戏跨平台发布时，面临极其冗长的资产编译时间与计算资源浪费，导致版本迭代缓慢。"
                    : "Indie studios face extremely long asset compilation times and compute waste during multi-platform releases."}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-semibold">
                  {isZh ? "解决方案" : "Solutions"}
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-orange-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "提供专属 Unity 构建模板与 AI 优化提示"
                        : "Dedicated Unity build templates & AI optimization prompts"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-orange-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "智能识别未修改资产，免除不必要资源编译"
                        : "Smart detection of unmodified assets to skip compilation"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-orange-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-orange-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "基于历史推荐最优增量构建策略"
                        : "Historical data-driven incremental build strategy recommendation"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-emerald-400">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "成功率" : "Success Rate"}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> +40%
                </span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "构建耗时" : "Build Time"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> -65%
                </span>
              </div>
            </div>
          </div>

          {/* Case 2: Unreal Engine */}
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Boxes className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-100 leading-tight">
                {isZh
                  ? "大型 Unreal 项目\n构建提效"
                  : "Large Unreal Project Build Efficiency"}
              </h3>
            </div>
            <div className="space-y-5 flex-1 z-10">
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                  {isZh ? "业务痛点" : "Pain Points"}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {isZh
                    ? "3A级项目产物繁杂，存在海量 C++ 编译任务与极其复杂的引擎依赖管理开销。"
                    : "AAA project with massive artifacts, heavy C++ compilation, and complex engine dependency overhead."}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-semibold">
                  {isZh ? "解决方案" : "Solutions"}
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-indigo-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "智能推荐构建节点分布策略 (如 Incredibuild 级联)"
                        : "Smart build node distribution strategy (Incredibuild cascade)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-indigo-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "C++ 构建失败与链接错误的 AI 自动归因分析"
                        : "AI automated root cause analysis for C++ build/link failures"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-indigo-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "自动生成并推送构建失败模式图谱与平台级报告"
                        : "Auto-generated build failure pattern graphs and platform reports"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-indigo-400">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "编译瓶颈" : "Bottlenecks"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" />{" "}
                  {isZh ? "100% 消除" : "100% Cleared"}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "缓存命中率" : "Cache Hit"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> &gt; 80%
                </span>
              </div>
            </div>
          </div>

          {/* Case 3: Web + Mobile + Backend */}
          <div className="bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-100 leading-tight">
                {isZh
                  ? "全栈泛终端\n整合构建"
                  : "Full-Stack Omni-Channel Integrated Build"}
              </h3>
            </div>
            <div className="space-y-5 flex-1 z-10">
              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                  {isZh ? "业务痛点" : "Pain Points"}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {isZh
                    ? "跨端项目需从代码开发、单元测试到多平台部署的端到端集成，缺乏统一流转中枢。"
                    : "Cross-platform project needs E2E integration from coding, testing, to multi-platform deployment without a unified hub."}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-semibold">
                  {isZh ? "解决方案" : "Solutions"}
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-emerald-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "提供统一流水线引擎，无缝兼容 Web/移动端/后端任务"
                        : "Unified pipeline engine supporting Web/Mobile/Backend tasks seamlessly"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-emerald-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "实现全自动化流转 (Code -> Build -> Test -> Deploy -> Monitor)"
                        : "Fully automated E2E workflow (Code -> Build -> Test -> Deploy -> Monitor)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 bg-emerald-500/20 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="leading-snug">
                      {isZh
                        ? "基于全链路数据的构建健康度多维评分与架构优化建议"
                        : "Multi-dimensional build health scoring and architecture tips based on full-chain data"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-emerald-400">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "交付频率" : "Delivery Freq"}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> 3x {isZh ? "提升" : ""}
                </span>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
                  {isZh ? "链路可视" : "Observability"}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> 100%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="devops-future-directions" className="mt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Compass className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh
                ? "工程系统能力的未来方向"
                : "Engineering System Future Directions"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isZh
                ? "面向未来的产品工程演进策略与全栈可拓展能力"
                : "Future-proof product engineering evolution strategy and full-stack extensible capabilities"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-[#111] border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <BrainCircuit className="w-32 h-32 text-indigo-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl backdrop-blur-sm border border-indigo-500/30">
                <BrainCircuit className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "AI 构建连贯性模型" : "AI Build Coherence Model"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "针对构建过程执行不连贯痛点，智能识别断点与流程断层，实现上下文感知补全。"
                : "Smartly identify breakpoints and process gaps for inconsistent build execution with context-aware completion."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                  {isZh ? "构建健康度" : "Build Health"}
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                  {isZh ? "构建状态提示" : "State Prompts"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-[#111] border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg hover:shadow-blue-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <BookOpen className="w-32 h-32 text-blue-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "工程知识自动化" : "Engineering Knowledge Auto"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "将隐式工程经验转化为显式规则，推动工程流程高度标准化与跨团队可复制性。"
                : "Transform implicit engineering experience into explicit rules for standardized and replicable processes."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-medium">
                  {isZh ? "工程模式推荐" : "Pattern Recs"}
                </span>
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-medium">
                  {isZh ? "构建知识图谱" : "Knowledge Graph"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-[#111] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg hover:shadow-purple-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <FileSearch className="w-32 h-32 text-purple-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-purple-500/20 rounded-xl backdrop-blur-sm border border-purple-500/30">
                <FileSearch className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "构建可解释性模型" : "Build Explainability Model"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "打破黑盒构建过程，提供白盒化解析，确保每一个构建结果皆可追溯、可解释。"
                : "Break the black-box build process with white-box analysis, ensuring traceable and explainable results."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-xs font-medium">
                  {isZh ? "日志深度分析" : "Deep Log Analysis"}
                </span>
                <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-xs font-medium">
                  {isZh ? "失败归因引擎" : "Attribution Engine"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/40 to-[#111] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Network className="w-32 h-32 text-cyan-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-cyan-500/20 rounded-xl backdrop-blur-sm border border-cyan-500/30">
                <Network className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "工程与运维深度连接" : "Deep Eng-Ops Connection"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "消除研发与运维鸿沟，实现运维需求与上游开发构建流程的无缝前置整合 (Shift-Left)。"
                : "Eliminate Dev and Ops gap with seamless shift-left integration of Ops requirements into dev processes."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-medium">
                  {isZh ? "构建部署反馈环" : "Deploy Feedback Loop"}
                </span>
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-medium">
                  {isZh ? "系统性能监测" : "System Monitoring"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-900/40 to-[#111] border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-rose-500/40 transition-all shadow-lg hover:shadow-rose-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Layers className="w-32 h-32 text-rose-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-rose-500/20 rounded-xl backdrop-blur-sm border border-rose-500/30">
                <Layers className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "构建部署一致性" : "Build & Deploy Consistency"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "解决多平台、多云环境下环境飘移问题，确保从测试到生产环境的绝对一致性交付。"
                : "Solve environment drift across multi-cloud platforms, ensuring absolute consistent delivery."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-xs font-medium">
                  {isZh ? "智能部署建议" : "Smart Deployment"}
                </span>
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-xs font-medium">
                  {isZh ? "跨平台统一管理" : "Omni-Platform Mgmt"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/40 to-[#111] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg hover:shadow-amber-500/10 flex flex-col">
            <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Shield className="w-32 h-32 text-amber-300" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 bg-amber-500/20 rounded-xl backdrop-blur-sm border border-amber-500/30">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-semibold text-gray-100">
                {isZh ? "企业工程控制平台" : "Enterprise Control Platform"}
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 min-h-[40px] relative z-10 leading-relaxed">
              {isZh
                ? "建立企业级统一管理的工程控制中枢，满足严苛的权限管控、安全审计与合规要求。"
                : "Establish unified enterprise engineering control hub meeting strict access, audit, and compliance."}
            </p>
            <div className="border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="text-[10px] text-gray-500 mb-2.5 uppercase tracking-widest font-semibold">
                {isZh ? "核心可拓展能力" : "Extensible Capabilities"}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium">
                  {isZh ? "全链路审计追踪" : "E2E Audit Trail"}
                </span>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium">
                  {isZh ? "工程合规体系" : "Compliance System"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="devops-core-platform" className="mt-10 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Construction className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
                {isZh
                  ? "以“工程”为核心的全流程工具平台"
                  : "Engineering-Centric DevOps Platform"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isZh
                  ? "从单一工具向系统工程级体系演进的六大维度"
                  : "Six dimensions of evolution from simple tools to systems engineering"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-emerald-500/[0.05] transition-colors">
              01
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Wrench className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "产品功能" : "Product Function"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "提升构建效率与质量"
                    : "Improve build efficiency and quality"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-colors">
                    {isZh ? "构建优化提示" : "Optimization Prompts"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-colors">
                    {isZh ? "构建健康管理" : "Health Management"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-sky-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-sky-500/[0.05] transition-colors">
              02
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Settings2 className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "工程能力" : "Engineering Capability"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "构建流程可编程化、可优化"
                    : "Programmable and optimizable processes"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-sky-500/30 group-hover:text-sky-300 transition-colors">
                    {isZh ? "工程流程图" : "Process Graphs"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-sky-500/30 group-hover:text-sky-300 transition-colors">
                    {isZh ? "智能缓存机制" : "Smart Caching"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-fuchsia-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-fuchsia-500/[0.05] transition-colors">
              03
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                <Link className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "工程集成" : "Engineering Integration"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "跨平台、跨工具、跨系统连接"
                    : "Cross-platform/tool/system connection"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-fuchsia-500/30 group-hover:text-fuchsia-300 transition-colors">
                    {isZh ? "API 集成套件" : "API Suites"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-fuchsia-500/30 group-hover:text-fuchsia-300 transition-colors">
                    {isZh ? "工程规范整合" : "Standard Integration"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-amber-500/[0.05] transition-colors">
              04
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "工程治理" : "Engineering Governance"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "提高项目合规性与生产力"
                    : "Improve compliance and productivity"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-amber-500/30 group-hover:text-amber-300 transition-colors">
                    {isZh ? "健康评分" : "Health Scoring"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-amber-500/30 group-hover:text-amber-300 transition-colors">
                    {isZh ? "全量审计追踪" : "Full Auditing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-orange-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-orange-500/[0.05] transition-colors">
              05
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Gauge className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "工程性能" : "Engineering Performance"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "构建耗时管理、资源优化"
                    : "Build time & resource optimization"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-orange-500/30 group-hover:text-orange-300 transition-colors">
                    {isZh ? "极速响应架构" : "Fast Response"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-orange-500/30 group-hover:text-orange-300 transition-colors">
                    {isZh ? "流程式分析" : "Flow Analysis"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-[#161616]">
            <div className="absolute top-4 right-4 text-[40px] font-black text-white/[0.03] group-hover:text-indigo-500/[0.05] transition-colors">
              06
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Lightbulb className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {isZh ? "工程扩展" : "Engineering Extension"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心价值" : "Core Value"}
                </div>
                <div className="text-sm text-gray-300">
                  {isZh
                    ? "支持趋势性实践与创新"
                    : "Support trending practices & innovation"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  {isZh ? "DevOps Hub 方向" : "DevOps Hub Direction"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors">
                    {isZh ? "AI 驱动建议" : "AI Driven Advice"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors">
                    {isZh ? "泛生态知识图谱" : "Ecosystem Graph"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="devops-core-module-map" className="mt-10 mb-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <Map className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
              {isZh ? "核心模块图谱" : "Core Module Map"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isZh
                ? "为了实现产品工程化的全面落地，DevOps Hub Studio 的全能力模块支持"
                : "Full capability module support for comprehensive product engineering"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-rose-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <ListTree className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "构建编排" : "Build Orchestration"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400/70 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                {isZh ? "构建统一集成" : "Unified Integration"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "跨平台构建调度、冲突检测、资源分配"
                    : "Cross-platform scheduling, conflict detection, resource allocation"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    Docker
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    Kubernetes
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "引擎调度" : "Engine Sched"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <ActivitySquare className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "构建健康评估" : "Build Health Assessment"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                {isZh ? "智能提示生成" : "Smart Prompts"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "构建成功率、时间、质量"
                    : "Build success rate, time, quality"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "构建优化算法" : "Optimization Algo"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "静态分析模型" : "Static Analysis"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <MessageSquareWarning className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "智能提示引擎" : "Smart Prompt Engine"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-400/70 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                {isZh ? "深度推荐" : "Deep Recommendation"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "构建建议、错误分析、任务分配"
                    : "Build advice, error analysis, task assignment"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    NLP
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "知识规则映射" : "Knowledge Mapping"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 4 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  <ScrollText className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "构建日志分析" : "Build Log Analysis"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-sky-400/70 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">
                {isZh ? "质量分析能力" : "Quality Analysis"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "提供日志可视化、错误分析、构建失败预测"
                    : "Log visualization, error analysis, failure prediction"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "日志仓库" : "Log Repository"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "构建事件分析" : "Event Analysis"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 5 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "技术合规体系" : "Compliance System"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400/70 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                {isZh ? "构建企业信任" : "Enterprise Trust"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "安全权限控制、审计流程、数据加密"
                    : "Security permissions, audit flow, data encryption"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    RBAC
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "加密库" : "Crypto Lib"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "审计日志" : "Audit Logs"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 6 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Users2 className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "工程协作系统" : "Engineering Collab"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/70 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                {isZh ? "协作智能化" : "Smart Collab"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "推送任务、分配团队、构建后协同"
                    : "Task pushing, team assignment, post-build collab"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "敏捷看板" : "Agile Board"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "任务表" : "Task Table"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 7 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Rocket className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "构建性能优化" : "Performance Opt"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-orange-400/70 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
                {isZh ? "性能提升" : "Perf Improvement"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "缓存支持、资源调度、优化建议"
                    : "Caching, scheduling, optimization advice"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "智能资源分配" : "Smart Allocation"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "历史预测优化" : "History Prediction"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 8 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <BotMessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "AI 推荐系统" : "AI Recommendation"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-400/70 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                {isZh ? "AIGC 增强" : "AIGC Enhance"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "提供构建配置建议、路径优化、自动化评审"
                    : "Config advice, path optimization, auto review"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "关系图谱" : "Relation Graph"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "任务模式分析" : "Task Pattern Analysis"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 9 */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-pink-500/30 transition-all hover:bg-[#161616] group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <Puzzle className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="font-bold text-gray-100 text-lg">
                  {isZh ? "开发者生态系统" : "Developer Ecosystem"}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-pink-400/70 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">
                {isZh ? "构建生态协同" : "Ecosystem Synergy"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "核心功能" : "Core Function"}
                </div>
                <p className="text-sm text-gray-300">
                  {isZh
                    ? "插件、模板、贡献系统"
                    : "Plugins, templates, contribution system"}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                  {isZh ? "技术底座" : "Tech Stack"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "API 支持" : "API Support"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                    {isZh ? "插件中心" : "Plugin Center"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 研发效能闭环 (R&D Efficiency Closed Loop) */}
        <div id="devops-system-loop" className="mt-12 mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-blue-500/5 rounded-3xl blur-3xl -z-10"></div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <RefreshCw className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
                {isZh
                  ? "全链路研发效能与工程质量闭环"
                  : "End-to-End R&D Efficiency & Quality Closed Loop"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isZh
                  ? "持续反馈、持续优化，打破孤岛，实现研发价值流的无缝流转与度量"
                  : "Continuous feedback and optimization, breaking silos for seamless value stream flow"}
              </p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileSearch,
                  titleZh: "需求与计划",
                  titleEn: "Plan & Require",
                  descZh: "数据驱动的需求规划，确保研发方向紧随业务价值。",
                  descEn:
                    "Data-driven planning ensuring alignment with business value.",
                  metrics: ["Lead Time", "Backlog Health"],
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                  border: "border-blue-500/20",
                  arrow: "text-blue-500/30",
                },
                {
                  icon: Code,
                  titleZh: "开发与集成",
                  titleEn: "Code & Integrate",
                  descZh: "智能代码审查与持续集成，左移质量防线，加速迭代。",
                  descEn: "Smart code review and CI, shifting quality left.",
                  metrics: ["Merge Time", "Build Success Rate"],
                  color: "text-indigo-400",
                  bg: "bg-indigo-500/10",
                  border: "border-indigo-500/20",
                  arrow: "text-indigo-500/30",
                },
                {
                  icon: Box,
                  titleZh: "发布与部署",
                  titleEn: "Release & Deploy",
                  descZh:
                    "自动化灰度发布与配置管理，实现平滑、安全的版本迭代。",
                  descEn:
                    "Automated canary releases for smooth, safe iterations.",
                  metrics: ["Deploy Freq", "Change Fail Rate"],
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                  border: "border-purple-500/20",
                  arrow: "text-purple-500/30",
                },
                {
                  icon: Gauge,
                  titleZh: "运营与反馈",
                  titleEn: "Operate & Feedback",
                  descZh:
                    "全方位监控与AIOps智能自愈，实时反馈至规划阶段形成闭环。",
                  descEn:
                    "Comprehensive monitoring and AIOps feedback to planning.",
                  metrics: ["MTTR", "User Satisfaction"],
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  arrow: "text-emerald-500/30",
                },
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl h-full flex flex-col hover:border-white/10 transition-colors z-10 relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2.5 rounded-xl ${step.bg} ${step.border} border`}
                      >
                        {(() => { const Icon = step.icon; return <Icon className={`h-5 w-5 ${step.color}`} />; })()}
                      </div>
                      <div className="font-semibold text-gray-100">
                        {isZh ? step.titleZh : step.titleEn}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                      {isZh ? step.descZh : step.descEn}
                    </p>
                    <div className="space-y-2 mt-auto">
                      {step.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="text-xs flex items-center justify-between text-gray-500 bg-white/[0.02] p-2 rounded-lg border border-white/[0.02]"
                        >
                          <span>{m}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Arrow connector */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                      <ArrowRight className={`h-6 w-6 ${step.arrow}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback loop visual */}
            <div className="mt-8 pt-8 border-t border-white/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-4 text-xs font-medium text-emerald-400 border border-emerald-500/20 rounded-full py-1">
                {isZh
                  ? "持续反馈引擎 (Continuous Feedback Engine)"
                  : "Continuous Feedback Engine"}
              </div>
              <div className="flex items-center justify-between px-10 pt-4">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" />{" "}
                  {isZh ? "效能洞察" : "Insights"}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mx-4"></div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5" />{" "}
                  {isZh ? "策略自适应" : "Adaptive Strategy"}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent mx-4"></div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />{" "}
                  {isZh ? "闭环优化" : "Closed Loop"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
