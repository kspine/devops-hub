import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LanguageSelector } from "./LanguageSelector";
import { 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Code, 
  Database, 
  Globe, 
  Languages, 
  Gamepad2, 
  Boxes, 
  Smartphone, 
  Server, 
  Workflow,
  Cpu,
  BarChart3,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  Palette,
  Sun,
  Moon,
  TrendingUp, 
  Users, 
  Hourglass, 
  HelpCircle, 
  MapPin,
  ChevronDown,
  Check,
  Building2,
  Mail,
  User,
  Briefcase,
  Sparkles,
  Star,
  Award,
  Network,
  Coffee,
  Brain,
  Satellite,
  Cloud,
  Settings2,
  Eye,
  ArrowDown,
  ArrowUp,
  Layout,
  FileText,
  GitBranch,
  MessageSquare,
  Shield,
  Timer,
  Puzzle,
  Gauge,
  Maximize2,
  Search,
  FolderKanban,
  RefreshCw,
  Sliders,
  ExternalLink
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './ToastContext';
import InsightsDashboard from './InsightsDashboard';
import BusinessPlan from './BusinessPlan';
import PipelineView from './views/PipelineView';
import TelemetryView from './views/TelemetryView';
import ProductionSuite from './ProductionSuite';
import ArtifactLibrary from './views/ArtifactLibrary';
import SSHKeyManager from './SSHKeyManager';
import DevOpsConsoleSimulator from './DevOpsConsoleSimulator';
import PipelineBuilder from './PipelineBuilder';
import LogView from './views/LogView';
import BackendServices from './views/BackendServices';
import WorkspaceManager from './views/WorkspaceManager';

const ModuleCard = ({ icon: Icon, title, desc, color, tabId }: { icon: any, title: string, desc: string, color: string, tabId: string }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: tabId }))}
      className={`group relative border p-8 rounded-[2rem] overflow-hidden transition-all cursor-pointer ${mode === 'dark' ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5'}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20 ${color}`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className={`text-xl font-bold mb-3 tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
        
        <div className={`mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${mode === 'dark' ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-accent'}`}>
          {t('modules.learnMore')} <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

const TechBadge = ({ name, icon: Icon, color }: { name: string, icon: any, color: string }) => {
  const { mode } = useTheme();
  return (
    <motion.div 
      whileHover={{ y: -3, scale: 1.05 }}
      className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border transition-all cursor-default shadow-lg ${mode === 'dark' ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10 shadow-black/20' : 'bg-white border-gray-100 hover:border-accent/20 hover:shadow-accent/5 shadow-gray-200/50'}`}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{name}</span>
    </motion.div>
  );
};

const engineeringModules = [
  {
    id: 'build',
    titleZh: '基础构建模块',
    titleEn: 'Build Orchestration',
    icon: Boxes,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    subItemsZh: [
      'Unity/Unreal 构建支持：深度集成引擎管线',
      'Web 构建支持：Node.js/React/Vue/Python/Django',
      '移动构建支持：iOS/Android/Flutter/RN',
      '微服务构建集成：K8s/Docker 流水线配置'
    ],
    subItemsEn: [
      'Unity/Unreal Support: Deep engine pipeline integration',
      'Web Stacks: Node.js/React/Vue/Python/Django',
      'Mobile Apps: iOS/Android/Flutter/RN',
      'Cloud Native: K8s/Docker CI/CD orchestration'
    ]
  },
  {
    id: 'telemetry',
    titleZh: '智能遥测与质量监控',
    titleEn: 'Telemetry & Quality Control',
    icon: Activity,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    subItemsZh: [
      '构建性能数据采集：资源占用与延迟监控',
      '构建健康度评分系统：研发能效可视化',
      '错误日志分析：自动分类与关联追踪',
      '构建失败预警策略：机器学习预测预警'
    ],
    subItemsEn: [
      'Build Perf Data: Resource & latency monitoring',
      'Health Score: Engineering efficiency visualization',
      'Log Analysis: Auto-classification & tracing',
      'Failure Prediction: ML-driven early warnings'
    ]
  },
  {
    id: 'ai',
    titleZh: 'AI 工程辅助系统',
    titleEn: 'AI Engineering Assistant',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    subItemsZh: [
      '构建配置推荐 AI：智能推荐构建方案',
      '代码质量分析：SonarQube/Lint 智能修复',
      '部署风险评估：预测发布失败概率',
      '构建流程自动优化：资源与缓存调度建议'
    ],
    subItemsEn: [
      'Config Recommendation: Smart build schemes',
      'Code Quality AI: SonarQube/Lint auto-fix',
      'Risk Assessment: Deployment failure prediction',
      'Process Optimizer: Resource & cache scheduling'
    ]
  },
  {
    id: 'collaboration',
    titleZh: '团队工程协作模块',
    titleEn: 'Team Engineering Collaboration',
    icon: Users,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    subItemsZh: [
      '任务跟踪系统：集成 Jira/ClickUp/Trello',
      '文档自动化系统：自动生成 Release Note',
      '代码评审集成：PR 智能质量分析',
      '工程化部署流程：多环境协同治理'
    ],
    subItemsEn: [
      'Task Tracking: Jira/ClickUp/Trello integration',
      'Docs Automation: Auto Release Notes',
      'Code Review: AI-powered PR analysis',
      'Engineering Flow: Multi-env governance'
    ]
  },
  {
    id: 'toolchain',
    titleZh: '工程化工具链整合',
    titleEn: 'Toolchain Integration',
    icon: Network,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
    subItemsZh: [
      'CI/CD 工具 API 绑定：Jenkins/GitLab 对接',
      '容器化部署支持：Docker/K8s 资源调度',
      '版本控制集成：Git/SVN 实时同步',
      '环境隔离管理：Dev/Test/Prod 自动化'
    ],
    subItemsEn: [
      'CI/CD APIs: Jenkins/GitLab/GitHub Actions',
      'Container Support: Docker/K8s orchestration',
      'VCS Sync: Real-time Git/SVN synchronization',
      'Env Isolation: Automated Dev/Test/Prod flows'
    ]
  }
];

const engineeringGrowthPath = [
  { step: '01', titleZh: '基础设施整合', titleEn: 'Infrastructure Sync', descZh: '实现跨平台构建编排与资源统一调度', descEn: 'Cross-platform build orchestration & unified scheduling' },
  { step: '02', titleZh: '流程标准化', titleEn: 'Process Standard', descZh: '定义通用的工程流程图与配置模板', descEn: 'Generic engineering flowcharts & templates' },
  { step: '03', titleZh: 'AI 工程辅助', titleEn: 'AI Engineering', descZh: '将构建、测试、部署与 AI 深度结合', descEn: 'Deep AI integration in build, test, & deploy' },
  { step: '04', titleZh: '数据分析平台', titleEn: 'Data Analytics', descZh: '支持企业级研发数据分析与可视化', descEn: 'Enterprise R&D data analytics & visualization' },
  { step: '05', titleZh: '知识图谱系统', titleEn: 'Knowledge Graph', descZh: '沉淀最佳实践、错误诊断与构建模式', descEn: 'Best practices, diagnostics, & build patterns' }
];

const engineeringProcesses = [
  { stageZh: '需求与开发', stageEn: 'Dev', taskZh: 'Feature branching, PR', taskEn: 'Feature branching, PR', supportZh: '自动推荐静态检查规则', supportEn: 'Auto-static check rules' },
  { stageZh: '构建与测试', stageEn: 'Build', taskZh: 'Automated builds, CI/CD', taskEn: 'Automated builds, CI/CD', supportZh: '构建健康度评分系统', supportEn: 'Build Health Score' },
  { stageZh: '部署与上线', stageEn: 'Deploy', taskZh: 'Release management', taskEn: 'Release management', supportZh: '风险提示 + 智能发布推荐', supportEn: 'Risk alerts & smart release' },
  { stageZh: '监控与反馈', stageEn: 'Ops', taskZh: 'Perf & Error tracking', taskEn: 'Perf & Error tracking', supportZh: '遥测平台 + 构建失败分析', supportEn: 'Telemetry & failure analysis' }
];

const engineeringStandards = [
  { titleZh: '跨平台构建规范', titleEn: 'Cross-Platform Std', descZh: '统一 Unity/Unreal/Web 构建生命周期', descEn: 'Unified lifecycle for 3D & Web' },
  { titleZh: '自动化质量门禁', titleEn: 'Quality Gateways', descZh: '强制性的代码质量与安全扫描标准', descEn: 'Mandatory quality & security scanning' },
  { titleZh: '版本化配置标准', titleEn: 'Versioning Std', descZh: '所有构建参数与环境配置必须版本化', descEn: 'All configs must be version-controlled' },
  { titleZh: '可观测性遥测规范', titleEn: 'Observability Std', descZh: '全量采集构建性能指标与资源消耗', descEn: 'Full collection of performance metrics' }
];

const projectManagementLogic = [
  {
    id: 'governance',
    titleZh: '项目准入与治理',
    titleEn: 'Project Governance',
    icon: Shield,
    featuresZh: ['多租户隔离架构', '精细化权限控制 (RBAC)', '操作审计日志', '合规性标准自动校验'],
    featuresEn: ['Multi-tenant Isolation', 'Fine-grained RBAC', 'Audit Logging', 'Compliance Auto-validation']
  },
  {
    id: 'collaboration',
    titleZh: '组织协作标准',
    titleEn: 'Team Collaboration',
    icon: Users,
    featuresZh: ['智能代码审查角色推荐', '团队构建健康度评估', '基于执行效率的任务分配', '跨团队工程能效看板'],
    featuresEn: ['AI Reviewer Recommendation', 'Team Health Scoring', 'Efficiency-based Assignment', 'Cross-team Analytics']
  },
  {
    id: 'extensibility',
    titleZh: '可扩展工程体系',
    titleEn: 'Engineering Extensibility',
    icon: Puzzle,
    featuresZh: ['可插拔模块架构', '开放 API 标准接口', '构建任务订阅回调', '第三方工具插件市场'],
    featuresEn: ['Plug-and-play Architecture', 'Open API Standard', 'Webhook & Subscriptions', 'Plugin Marketplace']
  },
  {
    id: 'quality',
    titleZh: '工程质量与可测性',
    titleEn: 'Quality & Testability',
    icon: Gauge,
    featuresZh: ['静态代码重复率分析', '构建错误故障预测', '可测性模型与环境重现', '本地构建参数验证'],
    featuresEn: ['Static Duplication Analysis', 'Build Failure Prediction', 'Testability & Env Reproducibility', 'Local Parameter Validation']
  }
];

const collaborationIntegrations = [
  { name: 'Jira / ClickUp', icon: CheckCircle2, descZh: '构建任务自动映射到项目管理工具', descEn: 'Auto-mapping tasks to PM tools' },
  { name: 'Confluence / Notion', icon: FileText, descZh: '自动生成构建报告与 Release Note', descEn: 'Auto-gen reports & release notes' },
  { name: 'GitHub / GitLab PR', icon: GitBranch, descZh: 'PR 智能质量分析与审查推送', descEn: 'AI-powered PR analysis & reviews' },
  { name: 'Slack / Teams', icon: MessageSquare, descZh: '构建状态实时通知与异常告警', descEn: 'Real-time alerts & status updates' }
];

const architectureLayers = [
  { id: 'app', titleZh: 'DevOps Hub Studio', titleEn: 'Control Plane', icon: Layout, color: 'text-white', bg: 'bg-accent', tabId: "hub" },
  { id: 'engine', titleZh: '工程流程引擎', titleEn: 'Process Engine', icon: Workflow, color: 'text-accent', bg: 'bg-accent/10', tabId: "designer" },
  { id: 'exec', titleZh: '构建编排与远程执行', titleEn: 'Orchestration & Execution', icon: Cpu, color: 'text-orange-400', bg: 'bg-orange-400/10', tabId: "runners" },
  { id: 'telemetry', titleZh: '数据采集与遥测系统', titleEn: 'Telemetry System', icon: Satellite, color: 'text-blue-400', bg: 'bg-blue-400/10', tabId: "telemetry" },
  { id: 'data', titleZh: '工程数据中台', titleEn: 'Engineering Data Hub', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10', tabId: "artifacts" },
  { id: 'ai', titleZh: 'AI 工程推荐与优化', titleEn: 'AI Optimization Engine', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10', tabId: "architect" }
];

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const { mode, toggleMode, theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [view, setView] = useState<'home' | 'bp'>('home');
  const [landingSubTab, setLandingSubTab] = useState<'overview' | 'architecture' | 'solutions' | 'roi' | 'enterprise'>('overview');

  // Hero Interactive Window & Demo Modal States
  const [heroPreviewTab, setHeroPreviewTab] = useState<'pipeline' | 'designer' | 'logs' | 'telemetry' | 'artifacts' | 'services' | 'security' | 'workspaces'>('pipeline');
  const [showLiveDemoModal, setShowLiveDemoModal] = useState(false);
  const [liveDemoProgress, setLiveDemoProgress] = useState(0);
  const [liveDemoRunning, setLiveDemoRunning] = useState(false);
  const [liveDemoLogs, setLiveDemoLogs] = useState<string[]>([]);

  const handleStartLiveDemo = () => {
    setShowLiveDemoModal(true);
    setLiveDemoProgress(0);
    setLiveDemoRunning(true);
    setLiveDemoLogs([
      isZh ? "[18:10:01] 正在连接 DevOps Hub 分布式编译集群 East-US-01..." : "[18:10:01] Connecting to DevOps Hub distributed runner cluster East-US-01...",
    ]);

    let step = 0;
    const steps = [
      {
        pct: 25,
        log: isZh 
          ? "[18:10:02] [GIT] 恢复代码元数据，检测到 C++ / UnrealEngine 增量变更 #commit-8f32a" 
          : "[18:10:02] [GIT] Restored repository, detected C++ / UnrealEngine delta #commit-8f32a"
      },
      {
        pct: 55,
        log: isZh 
          ? "[18:10:03] [PCH CACHE] 匹配全局 PCH 预编译头共享池，命中率 94.2%！解压 18.4GB 结构体" 
          : "[18:10:03] [PCH CACHE] Matched global PCH warm cache pool. Hit rate 94.2%! Restored 18.4GB"
      },
      {
        pct: 85,
        log: isZh 
          ? "[18:10:04] [SHADER MATRIX] 分发 48 个高并发着色器编译节点，14,800 个 Shader 变体并行编译完成！" 
          : "[18:10:04] [SHADER MATRIX] Dispatched 48 shader compile nodes. 14,800 shader variants completed!"
      },
      {
        pct: 100,
        log: isZh 
          ? "[18:10:05] [VAULT SIGN] HSM 硬件加密密钥挂载完成，版本构建成功！提速 15.4 倍 (耗时 3.8s)" 
          : "[18:10:05] [VAULT SIGN] HSM hardware Vault key attached. Build success! 15.4x faster (3.8s)"
      },
    ];

    const timer = setInterval(() => {
      if (step < steps.length) {
        const cur = steps[step];
        setLiveDemoProgress(cur.pct);
        setLiveDemoLogs(prev => [...prev, cur.log]);
        step++;
      } else {
        clearInterval(timer);
        setLiveDemoRunning(false);
      }
    }, 800);
  };

  // Enterprise Interactive States
  const [activeSolution, setActiveSolution] = useState<'gamedev' | 'web' | 'mobile' | 'backend'>('gamedev');
  const [engineers, setEngineers] = useState(30);
  const [buildsPerMonth, setBuildsPerMonth] = useState(60);
  const [currentDuration, setCurrentDuration] = useState(45);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Tech Compatibility States
  const [selectedTechCategory, setSelectedTechCategory] = useState<'all' | 'game' | 'frontend' | 'backend' | 'mobile' | 'database'>('all');
  const [selectedTechItem, setSelectedTechItem] = useState<string | null>("Unity");

  // Enterprise Case Study & Solution Consultant States
  const [activeCaseStudy, setActiveCaseStudy] = useState<'gamedev' | 'web' | 'mobile'>('gamedev');
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [consultantTeamSize, setConsultantTeamSize] = useState('21-100');
  const [consultantStack, setConsultantStack] = useState<'gamedev' | 'web' | 'mobile' | 'backend'>('gamedev');
  const [consultantDeploy, setConsultantDeploy] = useState<'saas' | 'hybrid' | 'onprem'>('hybrid');
  const [isSubmittingConsultant, setIsSubmittingConsultant] = useState(false);
  const [consultantResult, setConsultantResult] = useState<any | null>(null);
  const [formError, setFormError] = useState('');

  const techCompatItems = [
    { name: "Unity", category: "game" as const, icon: Gamepad2, color: "text-indigo-400 border-indigo-500/20", descEn: "Library/Temp physics cache sync, reducing AAA level asset import times by 90%.", descZh: "Library 与 Temp 物理缓存共享对齐，AAA 级资源导入与二次编译提速 90%。", strategyEn: "Incremental Shared Cache", strategyZh: "增量物理共享缓存", metric: "Build Time < 5m", speedup: "12.5x", logs: ["[INFO] Unity Hub CLI detected, loading version 2022.3.12f1...", "[CACHE] Restoring dynamic volume /Library (Size: 18.4GB)...", "[COMPILE] Resolving custom addressable asset sheets...", "[SUCCESS] Cache hit-ratio: 94.2%. Completed in 3.8m!"] },
    { name: "Unreal Engine", category: "game" as const, icon: Boxes, color: "text-orange-400 border-orange-500/20", descEn: "Distributed Shader warm-ups and incremental addressable package compilation.", descZh: "Shader 预热分发、多并发像素着色器编译与 Addressables 增量资源打包优化。", strategyEn: "Distributed Shader Compiler", strategyZh: "分布式着色器编译器", metric: "Cold Start -85%", speedup: "11.8x", logs: ["[INFO] UE5 Engine build target initialized (Win64/PS5/XSX)...", "[INFO] Orchestrating 48 distributed shader compiler nodes...", "[COMPILE] Loading Intermediate/Source cache headers...", "[SUCCESS] 14,800 Shaders compiled in parallel. Time: 4.2m!"] },
    { name: "Cocos Creator", category: "game" as const, icon: Layers, color: "text-emerald-400 border-emerald-500/20", descEn: "Optimized WebGL target compiler pipelines for HTML5 and instant mini-programs.", descZh: "专为 H5 与小游戏打造的 WebGL/WebGPU 构建包裁剪与发布优化。", strategyEn: "WebGL Bundle Minifier", strategyZh: "WebGL 产物极限制冷", metric: "Size -40%", speedup: "3.5x", logs: ["[INFO] Cocos engine path mapped. Building platform: web-mobile...", "[COMPRESS] Optimizing AST structure & treeshaking assets...", "[DIST] Publishing WebGL static bundles to edge Node-CDN...", "[SUCCESS] Minified size: 4.8MB (Initial: 12MB). SLA 100%."] },
    { name: "Godot Engine", category: "game" as const, icon: Cpu, color: "text-sky-400 border-sky-500/20", descEn: "Direct cross-platform export to Linux, WebAssembly, and native Mobile SDKs.", descZh: "支持一键导出 Linux, WebAssembly 平台，多构型平台秒级交叉编译。", strategyEn: "Cross-Platform Export Pipeline", strategyZh: "多端自动化导出", metric: "Instant Sandbox", speedup: "4.0x", logs: ["[INFO] Godot headless compiler initialized...", "[COMPILE] Building WebAssembly targets with Emscripten...", "[INFO] Code signed successfully for iOS / Android targets...", "[SUCCESS] Build pipeline completed without error. Ready!"] },
    { name: "C++ (Native)", category: "game" as const, icon: Code, color: "text-blue-400 border-blue-500/20", descEn: "Optimized incremental Clang/MSVC/GCC compilers. Employs high-speed distributed precompiled headers (PCH) and global ccache object caches.", descZh: "深度优化 Clang/MSVC/GCC 增量编译链，内置高并发分布式预编译头 (PCH) 编译技术与全局 ccache 分布式共享缓存。", strategyEn: "Distributed Clang/MSVC/GCC Compiler Cache", strategyZh: "分布式编译与 PCH 依赖链对齐", metric: "Build Time -92%", speedup: "15.4x", logs: ["[INFO] Native C++ compiler engine loaded. Toolchain: clang++-17...", "[CACHE] Restoring global precompiled headers (.gch) (Size: 5.4GB)...", "[COMPILE] Dispatching 128 parallel translation units...", "[SUCCESS] Object files linked. Re-compilation completed in 24 seconds."] },
    { name: "React / Next.js", category: "frontend" as const, icon: Globe, color: "text-blue-400 border-blue-500/20", descEn: "Dynamic cache sharing for incremental static regeneration and bundle compiling.", descZh: "集成 Next.js ISR 深度缓存、React 19 多态静态路由静态编译调优。", strategyEn: "SWC Bundle Cache", strategyZh: "SWC 级并发哈希缓存", metric: "Build < 10s", speedup: "8.2x", logs: ["[INFO] Node runtime initialized (Next.js 14)...", "[CACHE] SWC compiler cache restored successfully (Vite/Webpack)...", "[COMPILE] Running Incremental Static Regeneration (ISR) compile...", "[SUCCESS] Route bundling completed. All chunks compiled in 8s."] },
    { name: "Vue / Nuxt", category: "frontend" as const, icon: Globe, color: "text-emerald-400 border-emerald-500/20", descEn: "Vite dev-server middleware mode with instant module resolution and caching.", descZh: "Vite 编译中间件、多版本 HMR 热更缓存对齐及Nuxt静态资源增量裁剪。", strategyEn: "Vite Middleware Optimization", strategyZh: "Vite 增量树摇打包", metric: "Vite Speedup 5x", speedup: "5.0x", logs: ["[INFO] Nuxt Framework detected, pre-building virtual modules...", "[COMPILE] Vite building bundle optimized for client/server targets...", "[CACHE] Restoring vue-loader cache mappings...", "[SUCCESS] Nuxt static deployment built successfully."] },
    { name: "Vite / Webpack", category: "frontend" as const, icon: Zap, color: "text-purple-400 border-purple-500/20", descEn: "Advanced sub-node parallel bundle slicing and global assets replication.", descZh: "多子节点并发静态分流（Slicing）技术，大型 Web 包自动化构建与裁剪。", strategyEn: "Parallel Node Slicing", strategyZh: "并发分流编译", metric: "99.2% Hit Rate", speedup: "6.4x", logs: ["[INFO] Running Webpack/Vite optimized bundler...", "[OPTIMIZE] Splitting chunk files into multi-node parallel stream...", "[CACHE] Node modules persistent caches matched 99.2%...", "[SUCCESS] Build artifacts synced across 24 edge nodes!"] },
    { name: "Turborepo / Nx", category: "frontend" as const, icon: Workflow, color: "text-pink-400 border-pink-500/20", descEn: "Monorepo dependency topological mapping with remote persistent execution caches.", descZh: "Monorepo 全局拓扑依赖图谱，通过远程持久化云缓存免除未改动包的编译。", strategyEn: "Remote Build Cache Sync", strategyZh: "远程分布式执行缓存", metric: "No-ops Instant", speedup: "20x+", logs: ["[INFO] Turbo engine loading global pipeline configuration...", "[INFO] Restoring remote build cache index for 12 packages...", "[COMPILE] No code changes detected in 11 sub-packages, skipping...", "[SUCCESS] Incremental build completed in 0.8 seconds (Saved 5m)."] },
    { name: "Go (Golang)", category: "backend" as const, icon: Terminal, color: "text-cyan-400 border-cyan-500/20", descEn: "Concurrent go-build persistent caches with direct Docker scratch multi-stage output.", descZh: "Go 构建缓存跨流水线复用，多架构 Linux ELF 极速交叉编译，Scratch 镜像瘦身。", strategyEn: "Multi-arch ELF Builder", strategyZh: "交叉二进制多态编译", metric: "Build < 4.5s", speedup: "7.5x", logs: ["[INFO] Go compiler initialized. Target: linux/amd64 and linux/arm64...", "[CACHE] Restoring GOCACHE environment variables (Size: 840MB)...", "[COMPILE] Compiling microservice entrypoints in concurrent mode...", "[SUCCESS] Static ELF binary output compiled. Docker image: 12MB."] },
    { name: "Rust", category: "backend" as const, icon: Code, color: "text-amber-400 border-amber-500/20", descEn: "Cargo-chef dependency layer pre-baking, eliminating heavy runtime crate rebuilds.", descZh: "cargo-chef 智能依赖层预打包技术，免去大型 Crate 重复加载，Rust 速度提升 8x。", strategyEn: "Cargo Layer Pre-baking", strategyZh: "Cargo 级依赖层预烘焙", metric: "Save 400s / cycle", speedup: "8.0x", logs: ["[INFO] rustc compiler detected. Initializing Cargo pre-baking steps...", "[CACHE] cargo-chef recipe matched, skipping heavy crate compilation...", "[COMPILE] Recompiling target source changes only...", "[SUCCESS] Binary compiled. Cache saved successfully."] },
    { name: "Node.js / Bun", category: "backend" as const, icon: Server, color: "text-emerald-500 border-emerald-500/20", descEn: "Optimized yarn/pnpm module symlink structure and memory-resident execution.", descZh: "pnpm 强链接依赖穿透、Bun 极速原生运行时兼容，实现毫秒级依赖自检与热启动。", strategyEn: "Symlink Penetration Cache", strategyZh: "硬链接依赖穿透", metric: "Install < 3s", speedup: "4.8x", logs: ["[INFO] Node runtime loading with bun v1.1.2...", "[CACHE] Mapping local node_modules via shared pnpm-store...", "[COMPILE] Initializing server-side API endpoints...", "[SUCCESS] Active server boots on port 3000 in 0.08 seconds."] },
    { name: "Docker / K8s", category: "backend" as const, icon: Boxes, color: "text-blue-500 border-blue-500/20", descEn: "Dynamic Docker-in-Docker BuildKit caching and automated namespace switching.", descZh: "内置 Docker-in-Docker (DinD) BuildKit 镜像流，K8s 命名空间动态隔离发布。", strategyEn: "DinD BuildKit Registry", strategyZh: "DinD 构建热缓存", metric: "Image Size -65%", speedup: "5.5x", logs: ["[INFO] Connecting to secure Docker-in-Docker sandbox daemon...", "[COMPILE] Building Dockerfile layers utilizing concurrent BuildKit...", "[CACHE] Reusing 8 cached layers out of 10...", "[SUCCESS] Image pushed to local container registry. Size: 45MB."] },
    { name: "C++ (Native Server)", category: "backend" as const, icon: Code, color: "text-indigo-400 border-indigo-500/20", descEn: "Ultra-low latency microservices with Drogon and gRPC compiled with Clang-18 and advanced thread affinity mapping.", descZh: "基于 Drogon / Crow 与 gRPC 的极速 C++ 异步微服务，Clang-18 编译器加持，内置线程内核亲和性映射。", strategyEn: "Zero-Copy gRPC & Thread Affinity", strategyZh: "零拷贝 gRPC 与核心亲和线程对准", metric: "Latency < 0.1ms", speedup: "18.2x", logs: ["[INFO] Starting C++ Drogon HTTP backend on port 9000...", "[EPOLL] epoll dispatch thread pool bound to CPU cores #0-#7...", "[CONNECT] Connection pool pre-heated with 32 lock-free channels...", "[SUCCESS] Handled 450,000 req/sec with zero packet drop!"] },
    { name: "Flutter", category: "mobile" as const, icon: Smartphone, color: "text-blue-400 border-blue-500/20", descEn: "Cocoapods layer pre-warming and fast Gradle lock caching.", descZh: "Cocoapods 依赖池预缓存，Gradle 构建依赖对齐，大幅缩减 APK/IPA 签名耗时。", strategyEn: "Pod Cache / Gradle Lock", strategyZh: "双端依赖锁缓存", metric: "Sign < 12s", speedup: "6.2x", logs: ["[INFO] Flutter compiler loaded, compiling multi-target application...", "[COMPILE] Pre-warming dynamic Cocoapods cache for iOS compile...", "[CACHE] Restoring Gradle build-cache folders (Size: 2.1GB)...", "[SUCCESS] Double build APK & IPA files generated successfully!"] },
    { name: "React Native", category: "mobile" as const, icon: Globe, color: "text-sky-400 border-sky-500/20", descEn: "Metro bundler cache virtualization and automated keystore vaulting.", descZh: "Metro 构建缓存虚拟化、React Native 代码硬签、安全机密库原生桥接上架。", strategyEn: "Virtual Metro Bundler", strategyZh: "虚拟 Metro 构建器", metric: "Build -70%", speedup: "4.5x", logs: ["[INFO] Starting Metro packager in optimized compilation mode...", "[CACHE] Restoring metro-cache indices successfully...", "[INFO] Re-signing bundle binaries using Android Keystore Vault...", "[SUCCESS] Packaged client signed. Delivery to beta store completed."] },
    { name: "PostgreSQL", category: "database" as const, icon: Database, color: "text-blue-400 border-blue-500/20", descEn: "Automated schema diff migration verification and isolated ephemeral sandbox DBs.", descZh: "自动 DDL / Drizzle 模式校验、数据库临时沙箱测试以及异地分布式冷热隔离备份。", strategyEn: "Ephemeral DB Sandbox", strategyZh: "库结构自动漂移校验", metric: "Zero Downtime", speedup: "3.0x", logs: ["[INFO] Initializing PostgreSQL ephemeral sandbox...", "[DB] Loading SQL migration files (0001_initial_schema.sql)...", "[TEST] Simulating DDL changes & checking backward compatibility...", "[SUCCESS] 0 conflicts detected. Dynamic schema safe to migrate."] },
    { name: "Redis", category: "database" as const, icon: Database, color: "text-rose-500 border-rose-500/20", descEn: "Automated clustered node hot backups and millisecond state persistence audits.", descZh: "高并发分布式缓存集群自动运维、内存状态瞬时快照存储、一键健康监控度量。", strategyEn: "Dynamic Cluster Auditor", strategyZh: "分布式缓存可用性监控", metric: "Latency < 1ms", speedup: "2.5x", logs: ["[INFO] Connecting to cluster node pools of Redis database...", "[MONITOR] Reading ping times and memory allocation profiles...", "[BACKUP] Snapshot RDB written to durable bucket storage...", "[SUCCESS] Replication healthy. Cluster latency: 0.12ms."] }
  ];

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      // Wait for view transition
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 4);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const modules = [
    { icon: Rocket, title: t('modules.cicd.title'), desc: t('modules.cicd.desc'), color: "bg-emerald-500 text-emerald-400", tabId: "designer" },
    { icon: Activity, title: t('modules.telemetry.title'), desc: t('modules.telemetry.desc'), color: "bg-accent text-accent", tabId: "telemetry" },
    { icon: Database, title: t('modules.artifacts.title'), desc: t('modules.artifacts.desc'), color: "bg-purple-500 text-purple-400", tabId: "artifacts" },
    { icon: Cpu, title: t('modules.architect.title'), desc: t('modules.architect.desc'), color: "bg-amber-500 text-amber-400", tabId: "architect" },
    { icon: Globe, title: t('modules.distribution.title'), desc: t('modules.distribution.desc'), color: "bg-blue-500 text-blue-400", tabId: "production" },
    { icon: Lock, title: t('modules.security.title'), desc: t('modules.security.desc'), color: "bg-rose-500 text-rose-400", tabId: "signing" },
  ];

  const metrics = [
    { label: t('insights.metrics.activeDetail'), value: "1,424", detail: t('insights.metrics.active') },
    { label: t('insights.metrics.queuedDetail'), value: "0", detail: t('insights.metrics.queued') },
    { label: t('insights.metrics.avgTimeDetail'), value: "3.8m", detail: t('insights.metrics.avgTime') },
    { label: t('insights.metrics.successDetail'), value: "99.99%", detail: t('insights.metrics.success') },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${mode === 'dark' ? 'bg-[#000000] text-white' : 'bg-white text-gray-900'} font-sans selection:bg-accent/30 overflow-x-hidden selection:text-white`}>
      {/* Background Architecture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] blur-[140px] transition-opacity duration-1000 ${mode === 'dark' ? 'opacity-40' : 'opacity-10'}`}
          style={{ background: `radial-gradient(circle at 50% 0%, var(--accent-color, #6366f1) 0%, transparent 70%)` }}
        />
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay`} />
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:60px_60px] ${mode === 'dark' ? 'opacity-10' : 'opacity-40'} [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? (mode === 'dark' ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 shadow-xl shadow-gray-200/40") : "bg-transparent py-8"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Enterprise Logo Branding */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => { setLandingSubTab('overview'); setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-inner group-hover:bg-accent group-hover:text-white transition-all">
                <Terminal className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-black tracking-tight leading-none ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    DEVOPS HUB
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-widest ${mode === 'dark' ? 'bg-white/5 border-white/10 text-accent' : 'bg-accent/10 border-accent/20 text-accent'}`}>
                    Enterprise
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase font-semibold mt-0.5">
                  Platform Edition v4.2
                </span>
              </div>
            </div>

            {/* Premium Enterprise Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-xs font-semibold">
              {[
                { id: 'overview', labelZh: '平台概览', labelEn: 'Overview' },
                { id: 'architecture', labelZh: '系统架构', labelEn: 'Architecture' },
                { id: 'solutions', labelZh: '行业方案', labelEn: 'Solutions' },
                { id: 'roi', labelZh: '研发效能', labelEn: 'Business ROI' },
                { id: 'enterprise', labelZh: '企业治理', labelEn: 'Governance' },
              ].map((nav) => {
                const isActive = landingSubTab === nav.id && view === 'home';
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setLandingSubTab(nav.id as any);
                      if (view === 'bp') setView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`transition-all py-1.5 relative cursor-pointer font-semibold ${
                      isActive
                        ? (mode === 'dark' ? 'text-white' : 'text-gray-900')
                        : (mode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    {isZh ? nav.labelZh : nav.labelEn}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
              
              <button
                onClick={() => setView(view === 'bp' ? 'home' : 'bp')}
                className={`transition-all py-1.5 relative cursor-pointer font-semibold ${
                  view === 'bp'
                    ? (mode === 'dark' ? 'text-white' : 'text-gray-900')
                    : (mode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                {isZh ? '商业白皮书' : 'Business Plan'}
                {view === 'bp' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme & Mode Switchers */}
            <div className={`hidden sm:flex items-center gap-1 p-1 rounded-xl border transition-colors ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
              {(['indigo', 'emerald', 'rose'] as const).map((tName) => (
                <button
                  key={tName}
                  onClick={() => setTheme(tName)}
                  className={`w-5 h-5 rounded-lg transition-all cursor-pointer ${theme === tName ? 'scale-110 shadow-lg ring-2 ring-accent/30' : 'opacity-40 hover:opacity-100'}`}
                  style={{ backgroundColor: tName === 'indigo' ? '#6366f1' : tName === 'emerald' ? '#10b981' : '#f43f5e' }}
                  title={`Switch theme: ${tName}`}
                />
              ))}
              <div className={`w-px h-3 mx-1 ${mode === 'dark' ? 'bg-white/10' : 'bg-gray-300'}`} />
              <button
                onClick={toggleMode}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${mode === 'dark' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600'}`}
                title="Toggle light/dark mode"
              >
                {mode === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>

            <LanguageSelector variant="segmented" />
            
            <button
              onClick={onEnter}
              className="group flex items-center gap-2 bg-accent hover:opacity-90 text-white font-bold px-5 py-2 rounded-xl transition-all text-xs tracking-tight shadow-lg shadow-accent/20 cursor-pointer"
            >
              <span>{t('nav.dashboard')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile View Selector Bar */}
        <div className="lg:hidden border-t border-white/5 px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
          {[
            { id: 'overview', labelZh: '概览', labelEn: 'Overview' },
            { id: 'architecture', labelZh: '系统架构', labelEn: 'Architecture' },
            { id: 'solutions', labelZh: '行业方案', labelEn: 'Solutions' },
            { id: 'roi', labelZh: '研发效能', labelEn: 'ROI' },
            { id: 'enterprise', labelZh: '企业治理', labelEn: 'Governance' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => {
                setLandingSubTab(nav.id as any);
                if (view === 'bp') setView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                landingSubTab === nav.id && view === 'home'
                  ? 'bg-accent text-white'
                  : (mode === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600')
              }`}
            >
              {isZh ? nav.labelZh : nav.labelEn}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {/* Main Landing Hero - Only shown on Overview */}
            {landingSubTab === 'overview' && (
              <>
                {/* Enterprise Hero Section */}
                <section className="pt-36 sm:pt-44 pb-20 px-6 overflow-hidden">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      {/* Hero Left: Copy & CTAs */}
                      <div className="lg:col-span-6 space-y-8">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide ${mode === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-accent/5 border-accent/20 text-accent'}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                          <span>{isZh ? "企业级 DevOps & 全场景 CI/CD 编排平台" : "ENTERPRISE DEVOPS & CI/CD PLATFORM"}</span>
                        </motion.div>
                        
                        <motion.h1 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                          {isZh ? (
                            <>为高并发工程与复杂团队<br /><span className="text-accent">重塑研发效能</span>与构建管线</>
                          ) : (
                            <>Engineering Platform for <span className="text-accent">High-Velocity</span> Software Teams</>
                          )}
                        </motion.h1>
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={`text-base sm:text-lg leading-relaxed font-normal ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                          {isZh 
                            ? "内置 6 层系统架构引擎，深度整合 Unreal Engine、Unity、Web/Cloud Native 及 Native C++。实现 15 倍编译加速、分布式 PCH 缓存共享与零信任合规发布。"
                            : "Accelerate builds by up to 15x, streamline cross-platform runners, and enforce zero-trust security across Unreal Engine, Unity, Web, and Cloud Native environments."}
                        </motion.p>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-wrap items-center gap-3.5 pt-2"
                        >
                          <button
                            onClick={onEnter}
                            className="group flex items-center gap-2.5 bg-accent hover:opacity-90 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm tracking-tight shadow-xl shadow-accent/25 cursor-pointer"
                          >
                            <span>{isZh ? "进入 DevOps Studio 控制台" : "Launch Studio Console"}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          <button
                            onClick={handleStartLiveDemo}
                            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${mode === 'dark' ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20' : 'bg-accent/5 border-accent/20 text-accent hover:bg-accent/10'}`}
                          >
                            <Sparkles className="w-4 h-4 text-accent animate-spin-slow" />
                            <span>{isZh ? "运行 15 秒极速编译模拟" : "Simulate Pipeline Run"}</span>
                          </button>

                          <button 
                            onClick={() => {
                              const el = document.getElementById('consultant');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                              else {
                                setLandingSubTab('enterprise');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className={`px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${mode === 'dark' ? 'text-gray-300 hover:text-white border-white/10 hover:border-white/20 bg-white/5' : 'text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                          >
                            {isZh ? "预约企业方案演示" : "Request Enterprise Demo"}
                          </button>
                        </motion.div>

                        {/* Enterprise Stats Bullets */}
                        <div className={`pt-6 border-t grid grid-cols-3 gap-4 ${mode === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                          <div>
                            <p className="text-xl sm:text-2xl font-black text-accent font-mono">15.4x</p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{isZh ? "峰值编译提速" : "Peak Speedup"}</p>
                          </div>
                          <div>
                            <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400">99.99%</p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{isZh ? "SLA 可用性保证" : "Uptime SLA"}</p>
                          </div>
                          <div>
                            <p className="text-xl sm:text-2xl font-black font-mono text-indigo-400">SOC2 II</p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{isZh ? "企业级合规审计" : "Compliance"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Hero Right: High-Fidelity DevOps Studio Console Terminal Simulator */}
                      <div className="lg:col-span-6">
                        <DevOpsConsoleSimulator isZh={isZh} onEnter={onEnter} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Dynamic Metric Ticker */}
                <div className={`border-y transition-colors duration-500 ${mode === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-gray-100 bg-gray-50/30'} backdrop-blur-sm`}>
                  <div className="max-w-7xl mx-auto px-6 h-32 flex items-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                      {metrics.map((metric, i) => (
                        <div key={i} className={`transition-all duration-500 ${activeMetric === i ? "opacity-100 translate-y-0" : "opacity-30 translate-y-1"}`}>
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{metric.label}</p>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metric.value}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{metric.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enterprise Client Trust Grid */}
                <section className={`py-12 px-6 border-b transition-colors ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-gray-50/20'}`}>
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] md:w-1/4 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {isZh ? "全球头部研发团队深度协同中" : "TRUSTED BY THE WORLD'S LEADING ENGINEERING TEAMS"}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 items-center justify-items-center w-full md:w-3/4 opacity-60">
                      {/* Logo 1 */}
                      <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300">
                        <Gamepad2 className="w-5 h-5 text-indigo-500" />
                        <span className={`font-display font-black tracking-tight text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>NOVA INTERACTIVE</span>
                      </div>
                      {/* Logo 2 */}
                      <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300">
                        <Server className="w-5 h-5 text-emerald-500" />
                        <span className={`font-display font-black tracking-tight text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>AETHER CLOUD</span>
                      </div>
                      {/* Logo 3 */}
                      <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300">
                        <Smartphone className="w-5 h-5 text-rose-500" />
                        <span className={`font-display font-black tracking-tight text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>APEX MOBILE</span>
                      </div>
                      {/* Logo 4 */}
                      <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300">
                        <Boxes className="w-5 h-5 text-amber-500" />
                        <span className={`font-display font-black tracking-tight text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>PRISM ENGINE</span>
                      </div>
                      {/* Logo 5 */}
                      <div className="flex items-center gap-2 hover:opacity-100 transition-opacity duration-300">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span className={`font-display font-black tracking-tight text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>VORTEX SYSTEMS</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Sub-Page Dedicated Hero Banner - Shown when a specific sub-page is active */}
            {landingSubTab !== 'overview' && (
              <section className={`pt-36 pb-16 px-6 border-b transition-colors ${mode === 'dark' ? 'border-white/5 bg-gradient-to-b from-accent/10 via-black to-black' : 'border-gray-100 bg-gradient-to-b from-accent/5 via-white to-white'}`}>
                <div className="max-w-7xl mx-auto">
                  <div className="max-w-4xl space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${mode === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-accent/5 border-accent/10 text-accent'}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {landingSubTab === 'architecture' && (isZh ? "6层系统构建引擎与跨平台矩阵" : "6-Layer Orchestration Engine")}
                      {landingSubTab === 'solutions' && (isZh ? "Unreal/Unity/Cloud Native 专属场景" : "Multi-Stack Pipeline Scenarios")}
                      {landingSubTab === 'roi' && (isZh ? "研发效能模型与构建加速测算" : "Developer Efficiency & Cost Model")}
                      {landingSubTab === 'enterprise' && (isZh ? "SOC2 / RBAC / 私有化合规保障" : "Enterprise Governance & Audit")}
                    </div>

                    <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {landingSubTab === 'architecture' && (isZh ? "系统工程架构与能力全景" : "System Architecture & Engineering Capabilities")}
                      {landingSubTab === 'solutions' && (isZh ? "全场景行业 DevOps 自动化解决方案" : "Industry-Tailored DevOps Pipeline Solutions")}
                      {landingSubTab === 'roi' && (isZh ? "研发效能评估与商业 ROI 测算模型" : "Developer Productivity & ROI Calculation Framework")}
                      {landingSubTab === 'enterprise' && (isZh ? "企业级 DevSecOps、安全准入与合规保障" : "Enterprise Governance, Audit & Compliance Standard")}
                    </h1>

                    <p className={`text-base sm:text-lg leading-relaxed font-medium max-w-2xl ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {landingSubTab === 'architecture' && (isZh ? "深度探索 DevOps Hub 6层逻辑管道、5大核心模块与跨平台 Runner 部署矩阵。" : "Explore the 6-layer orchestration engine, 5 core modules, and cross-platform runner stack.")}
                      {landingSubTab === 'solutions' && (isZh ? "为游戏开发 (Unreal/Unity)、Cloud Native Web、移动端 iOS/Android 及微服务架构量身打造。" : "Tailored CI/CD pipelines for GameDev (Unreal/Unity), Web, Mobile, and Microservices.")}
                      {landingSubTab === 'roi' && (isZh ? "实时评估构建耗时与硬件集群成本节省，通过全链路 Telemetry 驱动效能提升。" : "Quantify build time savings, runner optimization, and drive productivity with telemetry.")}
                      {landingSubTab === 'enterprise' && (isZh ? "提供细粒度 RBAC 准入控制、全流程审计日志、气隙隔离部署与 99.99% 高可用 SLA。" : "Granular RBAC, full audit trail, air-gapped deployment options, and 99.99% uptime SLA.")}
                    </p>
                  </div>
                </div>
              </section>
            )}

        {/* Portal Direct Sub-Page Navigation Grid for Overview */}
        {landingSubTab === 'overview' && (
          <>
          <section className={`py-16 px-6 border-b ${mode === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-2">
                    {isZh ? "模块化专区导航" : "MODULAR SPECIALIZED PORTALS"}
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "按需选择您的工程视角" : "Explore by Domain & Objective"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <span>{isZh ? "切换专区快速聚焦深度内容" : "Click card to switch specialized view"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { id: 'architecture', titleZh: '系统工程与架构', titleEn: 'System Architecture', descZh: '6层系统架构、5大构建模块与跨平台能力矩阵', descEn: '6-layer architecture, 5 core modules & cross-platform stack', icon: Cpu, color: 'text-indigo-400', tag: '01 / ARCHITECTURE' },
                  { id: 'solutions', titleZh: '行业场景解决方案', titleEn: 'Industry Solutions', descZh: '游戏开发、Web/云原生、移动应用与微服务场景', descEn: 'Gaming, Web, Mobile & Cloud Native scenarios', icon: Workflow, color: 'text-emerald-400', tag: '02 / SOLUTIONS' },
                  { id: 'roi', titleZh: '研发效能与 ROI', titleEn: 'Business ROI & Metrics', descZh: '效能测算计算器、Insights 仪表盘与商业模型', descEn: 'ROI calculator, Insights dashboard & business plan', icon: BarChart3, color: 'text-amber-400', tag: '03 / METRICS' },
                  { id: 'enterprise', titleZh: 'DevSecOps & 企业保障', titleEn: 'Enterprise & Security', descZh: '项目准入治理、全流程审计合规与专家级保障', descEn: 'RBAC governance, audit compliance & enterprise SLA', icon: ShieldCheck, color: 'text-rose-400', tag: '04 / SECURITY' },
                ].map((portal) => (
                  <motion.div
                    key={portal.id}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      setLandingSubTab(portal.id as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group ${
                      mode === 'dark'
                        ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-accent/40 shadow-xl'
                        : 'bg-white border-gray-100 hover:border-accent/30 shadow-md hover:shadow-xl'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-50'} ${portal.color}`}>
                          <portal.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono tracking-wider font-semibold text-gray-500">
                          {portal.tag}
                        </span>
                      </div>
                      <h3 className={`text-base font-bold mb-2 group-hover:text-accent transition-colors ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? portal.titleZh : portal.titleEn}
                      </h3>
                      <p className={`text-xs leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isZh ? portal.descZh : portal.descEn}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-accent group-hover:translate-x-1 transition-transform">
                      <span>{isZh ? "进入专区" : "Enter Portal"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Overview Executive Pillars & Enterprise Trust Section */}
          <section className={`py-20 px-6 border-b ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-white'}`}>
            <div className="max-w-7xl mx-auto space-y-16">
              {/* Pillar Grid */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                  {isZh ? "核心竞争优势" : "EXECUTIVE SUMMARY"}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {isZh ? "为现代化大型团队打造的工程底座" : "Engineering Infrastructure Built for Velocity"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`p-8 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className={`text-lg font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "15.4 倍分布式构建加速" : "15.4x Build Acceleration"}
                  </h4>
                  <p className={`text-xs leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isZh ? "基于预编译 PCH 共享与增量增程调度，将 Unreal / C++ / Web 复杂构建编译时间从数小时压缩至分钟级。" : "Accelerate complex C++, Unreal Engine, and web builds with shared warm PCH cache and intelligent graph scheduling."}
                  </p>
                </div>

                <div className={`p-8 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <h4 className={`text-lg font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "全场景统一 pipeline 编排" : "Unified Multi-Stack Runner"}
                  </h4>
                  <p className={`text-xs leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isZh ? "无缝整合 GameDev、Web 云原生、iOS/Android 移动端及微服务，单控制台管控全栈生命周期。" : "Orchestrate heterogeneous pipelines across GameDev, Web, Mobile, and Microservices in a single enterprise console."}
                  </p>
                </div>

                <div className={`p-8 rounded-2xl border ${mode === 'dark' ? 'bg-gray-900/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className={`text-lg font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "金融级安全与合规治理" : "Zero-Trust DevSecOps Governance"}
                  </h4>
                  <p className={`text-xs leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isZh ? "内置 SOC2 Type II 认证、零信任密钥 Vault 挂载、细粒度 RBAC 准入与全流程区块链级变更审计。" : "SOC2 Type II compliance, HSM secret vaults, granular RBAC access controls, and tamper-proof audit trails."}
                  </p>
                </div>
              </div>

              {/* Console Quick Start Banner */}
              <div className={`p-8 sm:p-12 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-8 ${mode === 'dark' ? 'bg-gradient-to-r from-accent/20 via-gray-900 to-black border-accent/30' : 'bg-gradient-to-r from-accent/10 via-gray-50 to-white border-accent/20'}`}>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase">ENTERPRISE DEPLOYMENT</span>
                  <h4 className={`text-xl sm:text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "准备好提升您的团队研发效能了吗？" : "Ready to Supercharge Your Engineering Pipeline?"}
                  </h4>
                  <p className={`text-xs ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isZh ? "立即免费体验 DevOps Studio 交互控制台，或预约专家进行架构调优诊断。" : "Launch interactive Studio console now, or schedule a diagnostic session with our solution architects."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <button
                    onClick={onEnter}
                    className="flex items-center gap-2 bg-accent hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-accent/20 cursor-pointer"
                  >
                    <span>{isZh ? "立即启动 Studio 控制台" : "Launch Studio Console"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
          </>
        )}

        {/* System Engineering Blueprint (Dedicated Architecture View) */}
        {landingSubTab === 'architecture' && (
          <>
            <section id="engineering" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "系统工程架构" : "SYSTEM ENGINEERING BLUEPRINT"}
              </span>
              <h2 className={`text-4xl md:text-6xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "全链路闭环研发系统工程" : "Enterprise-Grade Engineering System"}
              </h2>
              <p className={`text-base max-w-3xl mx-auto leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh 
                  ? "DevOps Hub Studio 不仅是工具，更是深度集成的系统工程。从模块化设计到自动化流程，从工程标准到团队协作，构建高效研发闭环。" 
                  : "More than a tool, DevOps Hub Studio is a deeply integrated engineering system. From modular design to automated flows, it builds a high-efficiency R&D closed loop."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {engineeringModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group p-8 rounded-[2.5rem] border transition-all duration-500 ${
                    mode === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10' : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${module.bg} ${module.color}`}>
                    <module.icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-2xl font-black mb-6 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? module.titleZh : module.titleEn}
                  </h3>
                  <ul className="space-y-4">
                    {(isZh ? module.subItemsZh : module.subItemsEn).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-4 h-4 mt-1 shrink-0 ${module.color}`} />
                        <span className={`text-sm leading-snug ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              
              {/* Central Connection Visual (Decorative) */}
              <div className={`hidden lg:flex p-8 rounded-[2.5rem] border border-dashed flex-col justify-center items-center text-center ${
                mode === 'dark' ? 'border-white/10 bg-accent/5' : 'border-gray-200 bg-accent/5'
              }`}>
                <Workflow className="w-12 h-12 text-accent mb-4 animate-pulse" />
                <h4 className={`text-xl font-black mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {isZh ? "系统工程闭环" : "Closed-Loop System"}
                </h4>
                <p className="text-xs text-gray-500 max-w-[200px]">
                  {isZh ? "五个维度深度耦合，形成持续优化的研发能效增强回路" : "Deep coupling of five dimensions, forming a continuous improvement loop."}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Engineering Process Model & Architecture */}
        <section id="process" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-[#050505]' : 'bg-gray-50/20'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Left: Process Model Table */}
              <div className="lg:col-span-7 space-y-12">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                    {isZh ? "工程流程模型" : "ENGINEERING PROCESS MODEL"}
                  </span>
                  <h2 className={`text-4xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "标准化研发流水线" : "Standardized R&D Pipeline"}
                  </h2>
                </div>
                
                <div className={`overflow-hidden rounded-3xl border ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${mode === 'dark' ? 'bg-white/5' : 'bg-gray-50'} text-[10px] font-black uppercase tracking-widest text-gray-500`}>
                        <th className="px-6 py-4">{isZh ? "阶段" : "Stage"}</th>
                        <th className="px-6 py-4">{isZh ? "工程流程" : "Process"}</th>
                        <th className="px-6 py-4">{isZh ? "智能支持" : "Support"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {engineeringProcesses.map((proc, i) => (
                        <tr key={i} className={`text-sm ${mode === 'dark' ? 'text-gray-400 hover:bg-white/[0.01]' : 'text-gray-600 hover:bg-gray-50/50'}`}>
                          <td className="px-6 py-4 font-bold text-accent">{isZh ? proc.stageZh : proc.stageEn}</td>
                          <td className="px-6 py-4">{isZh ? proc.taskZh : proc.taskEn}</td>
                          <td className="px-6 py-4 italic text-xs">{isZh ? proc.supportZh : proc.supportEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Growth Path */}
                <div className="pt-12 space-y-8">
                  <h3 className={`text-2xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "能力提升演进路径" : "Engineering Maturity Path"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {engineeringGrowthPath.map((path) => (
                      <div key={path.step} className={`p-6 rounded-2xl border flex gap-5 items-start ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100'}`}>
                        <span className="text-2xl font-black text-accent/30 font-mono">{path.step}</span>
                        <div>
                          <h4 className={`text-sm font-black mb-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{isZh ? path.titleZh : path.titleEn}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{isZh ? path.descZh : path.descEn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Architecture Visual */}
              <div className="lg:col-span-5 sticky top-32">
                <div className={`p-10 rounded-[3rem] border ${mode === 'dark' ? 'bg-black border-white/10' : 'bg-gray-50 border-gray-200'} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Network className="w-64 h-64 text-accent" />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <h3 className={`text-xl font-black mb-10 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {isZh ? "系统工程架构拓扑" : "System Architecture"}
                    </h3>
                    
                    <div className="flex flex-col items-center gap-2">
                      {architectureLayers.map((layer, i) => (
                        <React.Fragment key={layer.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: layer.tabId }))}
                            className={`w-full max-w-xs p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer ${
                              layer.id === 'app' 
                                ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20' 
                                : (mode === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100 shadow-sm')
                            }`}
                          >
                            <div className={`p-2 rounded-xl ${layer.id === 'app' ? 'bg-white/20' : layer.bg + ' ' + layer.color}`}>
                              <layer.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-black uppercase tracking-wider ${layer.id === 'app' ? 'text-white' : (mode === 'dark' ? 'text-white' : 'text-gray-900')}`}>
                                {isZh ? layer.titleZh : layer.titleEn}
                              </span>
                              <span className={`text-[8px] font-mono opacity-60`}>
                                {layer.id === 'app' ? 'CORE HUB' : 'COMPONENT_LAYER'}
                              </span>
                            </div>
                          </motion.div>
                          {i < architectureLayers.length - 1 && (
                            <div className="flex flex-col items-center">
                              <div className="w-px h-4 bg-gradient-to-b from-accent/40 to-transparent" />
                              <ArrowDown className="w-3 h-3 text-accent/30" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Standards Highlights */}
        <section className={`py-20 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-[#030303]' : 'bg-gray-50/10'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest block mb-2">
                  {isZh ? "工程标准" : "ENGINEERING STANDARDS"}
                </span>
                <h3 className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {isZh ? "定义企业级研发标准" : "Defining R&D Excellence"}
                </h3>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {engineeringStandards.map((std, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-black mb-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? std.titleZh : std.titleEn}
                      </h4>
                      <p className="text-xs text-gray-500">{isZh ? std.descZh : std.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Centric Management Logic */}
        <section id="projects" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                    {isZh ? "项目引擎核心" : "PROJECT ENGINE CORE"}
                  </span>
                  <h2 className={`text-4xl md:text-6xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "强化项目自身的\n内部管理逻辑" : "Reinforced Internal\nProject Management"}
                  </h2>
                  <p className={`text-lg leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isZh 
                      ? "超越简单的任务追踪，DevOps Hub Studio 构建了深度的项目治理底座。我们将资源配额、安全审计与研发能效深度解耦，确保每一个项目都拥有独立且受控的运行环境。" 
                      : "Beyond simple task tracking, DevOps Hub Studio builds a deep project governance foundation. We decouple resource quotas, security audits, and R&D efficiency to ensure every project has an independent and controlled environment."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {projectManagementLogic.map((logic, idx) => (
                    <motion.div
                      key={logic.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className={`group p-8 rounded-3xl border flex gap-6 items-start transition-all cursor-pointer ${
                        mode === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-xl'
                      }`}
                      onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: logic.id }))}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-accent/10 text-accent group-hover:scale-110 transition-transform`}>
                        <logic.icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-4">
                        <h4 className={`text-xl font-black ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {isZh ? logic.titleZh : logic.titleEn}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(isZh ? logic.featuresZh : logic.featuresEn).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                              <span className="text-xs text-gray-500 font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 w-full relative">
                {/* Floating Abstract UI for Project Management */}
                <div className={`aspect-square rounded-[4rem] border border-dashed flex items-center justify-center ${
                  mode === 'dark' ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[80%] h-[80%] border border-accent/20 rounded-full border-dashed"
                  />
                  
                  <div className="relative z-10 grid grid-cols-2 gap-4 w-full p-12">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-black border-white/10' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/50'}`}>
                      <div className="text-[10px] font-black text-gray-500 uppercase mb-4">Quota_Status</div>
                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-accent/10 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-accent" />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono">
                          <span className="text-accent">PROJECT_A</span>
                          <span className="text-gray-500">67% USED</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`p-6 rounded-[2.5rem] border ${mode === 'dark' ? 'bg-black border-white/10' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/50'}`}>
                      <div className="text-[10px] font-black text-gray-500 uppercase mb-4">Audit_Live</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <div className="h-1 w-full bg-emerald-500/10 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <div className="h-1 w-full bg-amber-500/10 rounded-full" />
                        </div>
                      </div>
                    </motion.div>

                    <div className="col-span-2 p-8 rounded-[3rem] border border-accent/20 bg-accent/5 flex flex-col items-center text-center">
                      <Layout className="w-10 h-10 text-accent mb-4" />
                      <h5 className={`text-lg font-black mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? "多项目集中管控" : "Portfolio Intelligence"}
                      </h5>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        {isZh ? "全局视角洞察所有项目的健康度、进度与资源消耗，实现研发资产的数字化透明治理。" : "Global insight into all projects' health, progress, and resource consumption for digital transparent governance."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Engineering Collaboration */}
        <section id="collaboration" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                    {isZh ? "团队工程协作" : "TEAM COLLABORATION"}
                  </span>
                  <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "无缝集成的研发协作生态" : "Seamless Collaboration Ecosystem"}
                  </h2>
                  <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isZh 
                      ? "打破工具孤岛，将构建任务、文档、评审与即时通讯深度整合，打造透明、高效的工程协同环境。" 
                      : "Break tool silos by deeply integrating build tasks, documentation, reviews, and IM to create a transparent, high-efficiency engineering environment."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collaborationIntegrations.map((item, idx) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-3xl border ${mode === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}
                    >
                      <item.icon className="w-6 h-6 text-accent mb-4" />
                      <h4 className={`text-sm font-black mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">{isZh ? item.descZh : item.descEn}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className={`p-1 rounded-[3rem] ${mode === 'dark' ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-gray-200 to-transparent'}`}>
                  <div className={`rounded-[2.9rem] overflow-hidden border ${mode === 'dark' ? 'bg-black border-white/5' : 'bg-white border-gray-100'}`}>
                    <div className={`px-6 py-4 border-b flex justify-between items-center ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase">Integration_Portal.exe</span>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-accent uppercase">Live Sync Status</span>
                          <span className="text-[9px] font-mono text-emerald-400">● 12 TOOLS ACTIVE</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '85%' }}
                            className="h-full bg-accent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className={`aspect-square rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 ${mode === 'dark' ? 'border-white/10 hover:border-accent/40' : 'border-gray-200 hover:border-accent/40'} transition-colors cursor-pointer group`}>
                            <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-colors" />
                            <div className="h-1 w-8 bg-white/5 group-hover:bg-accent/40 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering-Driven Feature Design */}
        <section id="features" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "工程化功能设计" : "ENGINEERING-DRIVEN FEATURES"}
              </span>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "为卓越工程而生" : "Built for Engineering Excellence"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Build as a Service */}
              <div className={`p-10 rounded-[3rem] border flex flex-col justify-between ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                <div>
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-8">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <h3 className={`text-2xl font-black mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "构建服务工程化" : "Build-as-a-Service"}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">
                    {isZh ? "提供可配置的构建服务，支持按需资源分配、任务调度优化、跨云平台管理（Aliyun/AWS/Azure）。" : "Configurable build services with on-demand resource allocation, scheduling optimization, and multi-cloud management."}
                  </p>
                  <ul className="space-y-3">
                    {['按需构建资源分配', '任务调度策略优化', '构建缓存机制', '资源效率调节'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Zap className="w-3 h-3 text-blue-500" />
                        {isZh ? f : f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Config Automation */}
              <div className={`p-10 rounded-[3rem] border flex flex-col justify-between ${mode === 'dark' ? 'bg-[#080808] border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                <div>
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-8">
                    <Settings2 className="w-6 h-6" />
                  </div>
                  <h3 className={`text-2xl font-black mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "配置管理与自动化" : "Config & Automation"}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">
                    {isZh ? "工程级配置能力，支持构建参数可配置化、流程自定义及内容版本化回滚。" : "Enterprise configuration with parameterization, custom workflow definition, and versioned rollback support."}
                  </p>
                  <ul className="space-y-3">
                    {['构建参数可配置化', '流程自定义能力', '内容版本化支持', '一键安全回滚'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Zap className="w-3 h-3 text-purple-500" />
                        {isZh ? f : f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Engineering Observability */}
              <div className={`p-10 rounded-[3rem] border flex flex-col justify-between ${mode === 'dark' ? 'bg-accent/5 border-accent/20' : 'bg-accent/5 border-accent/10 shadow-sm'}`}>
                <div>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className={`text-2xl font-black mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "工程可观测性" : "Engineering Observability"}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">
                    {isZh ? "可视化展示构建拓扑图，深度监控 GPU/内存等资源消耗，实现 Healthy/Unhealthy 精准定位。" : "Visual build topology with deep GPU/RAM resource monitoring and precise health diagnostic locating."}
                  </p>
                  
                  {/* Mock Visual Topology */}
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[8px] font-black text-gray-500 uppercase tracking-widest">
                      <span>PIPELINE_VIEW</span>
                      <span className="text-emerald-400">99% HEALTHY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-8 rounded-full bg-accent/50" />
                      <div className="h-px flex-grow bg-white/10" />
                      <div className="h-2 w-8 rounded-full bg-emerald-500" />
                      <div className="h-px flex-grow bg-white/10" />
                      <div className="h-2 w-8 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                      <span>GPU: 42%</span>
                      <span>RAM: 1.2G</span>
                      <span>DISK: 12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Grid (Refactored) */}
        <section id="stack" className={`py-32 px-6 border-b transition-colors ${mode === 'dark' ? 'bg-[#030303]' : 'bg-gray-50/30'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                  {isZh ? "全栈支持矩阵" : "UNIVERSAL STACK MATRIX"}
                </span>
                <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {isZh ? "深度适配：从 3D 引擎到 AI 微服务" : "Native Support: From 3D Engines to AI Services"}
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: isZh ? "全部" : "All" },
                  { id: 'game', label: isZh ? "游戏" : "Game" },
                  { id: 'frontend', label: isZh ? "前端" : "Web" },
                  { id: 'backend', label: isZh ? "后端" : "Backend" },
                  { id: 'mobile', label: isZh ? "移动" : "Mobile" },
                  { id: 'database', label: isZh ? "数据" : "Data" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTechCategory(cat.id as any)}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedTechCategory === cat.id
                        ? "bg-accent text-white shadow-lg shadow-accent/20"
                        : (mode === 'dark' ? "text-gray-500 hover:text-white bg-white/5 border border-white/5" : "text-gray-400 hover:text-gray-900 bg-white border border-gray-100")
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {techCompatItems
                .filter((tech) => selectedTechCategory === 'all' || tech.category === selectedTechCategory)
                .map((tech, idx) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group p-6 rounded-3xl border flex flex-col justify-between aspect-square transition-all duration-300 ${
                        mode === 'dark' ? 'bg-[#080808] border-white/5 hover:border-accent/30 hover:bg-[#0a0a0a]' : 'bg-white border-gray-100 hover:border-accent/30 hover:shadow-xl hover:shadow-gray-200/40'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-[10deg] ${
                        mode === 'dark' ? 'bg-white/5 text-gray-400 group-hover:text-accent group-hover:bg-accent/10' : 'bg-gray-50 text-gray-500 group-hover:text-accent group-hover:bg-accent/10'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-black uppercase tracking-wider mb-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {tech.name}
                        </h4>
                        <p className="text-[10px] font-mono text-gray-500 font-bold">
                          {tech.metric}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Modules Bento Grid */}
        <section id="modules" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">{t('modules.title')}</span>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('modules.title')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ModuleCard {...module} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sub-tab Next Guide Footer */}
        <section className={`py-12 px-6 border-b ${mode === 'dark' ? 'bg-gray-950 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase">NEXT SPECIALIZED MODULE</span>
              <h4 className={`text-lg font-bold mt-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "探索 02 / 行业场景自动化解决方案" : "Explore 02 / Multi-Stack Industry Solutions"}
              </h4>
            </div>
            <button
              onClick={() => {
                setLandingSubTab('solutions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-accent hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{isZh ? "前往行业方案专区" : "View Industry Solutions"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
        </>
        )}

        {/* Interactive Industry Solutions Showcase (Dedicated Solutions View) */}
        {landingSubTab === 'solutions' && (
          <>
            <section id="solutions-showcase" className={`py-32 px-6 border-y transition-colors ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-gray-50/20'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "多端效能场景" : "SCENARIO SOLUTIONS"}
              </span>
              <h2 className={`text-4xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "行业专属多端研发效能解决方案" : "Tailored Multi-Stack Engineering Solutions"}
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh ? "DevOps Hub 针对不同技术栈特征，进行了深度编译链级调优与流水线编排抽象，为企业提供高质量的行业专属体验。" : "DevOps Hub delivers deeply-optimized compiler chains and pipeline abstractions custom-tailored for specialized industry verticals."}
              </p>
            </div>

            {/* Solution Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { id: 'gamedev', label: isZh ? "游戏研发 (Unity/Unreal)" : "Game Dev Engine", icon: Gamepad2, color: 'text-indigo-400 border-indigo-500/20' },
                { id: 'web', label: isZh ? "企业 Web 架构" : "Modern Web App", icon: Globe, color: 'text-emerald-400 border-emerald-500/20' },
                { id: 'mobile', label: isZh ? "原生/跨端移动" : "Native Mobile", icon: Smartphone, color: 'text-rose-400 border-rose-500/20' },
                { id: 'backend', label: isZh ? "微服务与依赖集成" : "Microservices & Infra", icon: Server, color: 'text-purple-400 border-purple-500/20' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSolution === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSolution(tab.id as any)}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all cursor-pointer font-bold text-xs uppercase tracking-wider ${
                      isActive
                        ? (mode === 'dark' ? "bg-accent/10 border-accent text-accent shadow-lg shadow-accent/10" : "bg-accent border-accent text-white shadow-lg shadow-accent/20")
                        : (mode === 'dark' ? "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900 shadow-sm")
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content panel */}
            <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 ${
              mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-xl'
            }`}>
              <AnimatePresence mode="wait">
                {activeSolution === 'gamedev' && (
                  <motion.div
                    key="gamedev"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <div className="inline-block p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Gamepad2 className="w-6 h-6" />
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? "Unity & Unreal 游戏研发集群极速构建" : "Unity & Unreal Game Dev Build Optimization"}
                      </h3>
                      <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isZh 
                          ? "专为 Unity 和 Unreal Engine 大体积项目打造。内置分布式编译引擎，支持 Shader 暖启动预编译、Addressable 资源增量流式处理、以及全渠道分发（iOS, Android, Windows, PS5, Steam）一键上架发布。" 
                          : "Engineered specifically for heavy 3D engine workflows. Featuring global distributed cache reuse, hot Shader warmup compilation, incremental Addressable package streaming, and native signing wrappers for console and mobile platforms."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-indigo-400">8.4x</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "二次增量构建加速" : "Incremental Build Speedup"}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-emerald-400">100%</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "多端自动证书重签" : "Multi-Platform Autosign"}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`relative border rounded-2xl p-6 ${mode === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/5">
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold">Active Game-Build Task (UE5-Android)</span>
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                      </div>
                      <div className="space-y-3.5 font-mono text-xs text-gray-400">
                        <div className="flex justify-between"><span className="text-gray-500">[01] Sync Git Repository</span><span className="text-emerald-500">Completed (12s)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">[02] Cache Lookup: Intermediate/</span><span className="text-emerald-500">HIT (94.2 GB Shared)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">[03] Run UnrealAutomationTool (UAT)</span><span className="text-indigo-400 animate-pulse">Running ShaderCompiler (104/104)...</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">[04] Inject keystore & iOS Certs</span><span className="text-gray-600">Pending</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">[05] Push artifacts to CDN & Steam</span><span className="text-gray-600">Pending</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSolution === 'web' && (
                  <motion.div
                    key="web"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? "现代 Web 应用与企业级 Monorepo 前端治理" : "Modern Web Systems & Monorepo Optimization"}
                      </h3>
                      <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isZh 
                          ? "全套 Web 应用构建链路深度优化。完美兼容 React, Next.js, Vue, Angular 框架，深度支持 Turborepo/Nx 模块树缓存。内置边缘安全 CDN 分发，静态页面秒级推至全球，支持版本灰度回滚。" 
                          : "Optimize your entire enterprise web frontend ecosystem. Support high-performance monorepos, React, Next.js, and Vue frameworks. Fully aligned with Turborepo dynamic caching and global Edge static page replication for instant gray rollbacks."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-emerald-400">&lt; 30s</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "全球边缘节点部署时间" : "Global Edge Deployment"}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-indigo-400">98.2%</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "Node Modules 极速缓存命中" : "NPM Dependency Cache Hit"}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`relative border rounded-2xl p-6 ${mode === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/5">
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold">Edge CDN Node Replication</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <div className="space-y-3.5 font-mono text-xs text-gray-400">
                        <div className="flex justify-between"><span className="text-gray-500">Silicon Valley (US-West)</span><span className="text-emerald-500 font-bold">ACTIVE (14ms)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Frankfurt (EU-Central)</span><span className="text-emerald-500 font-bold">ACTIVE (18ms)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Singapore (AP-Southeast)</span><span className="text-emerald-500 font-bold">ACTIVE (11ms)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Tokyo (AP-Northeast)</span><span className="text-emerald-500 font-bold">ACTIVE (9ms)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Shanghai (CN-East)</span><span className="text-emerald-500 font-bold">ACTIVE (15ms)</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSolution === 'mobile' && (
                  <motion.div
                    key="mobile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <div className="inline-block p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? "原生/跨端移动 App 安全流水线与分发" : "Secure Mobile Pipelines & Delivery"}
                      </h3>
                      <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isZh 
                          ? "支持 iOS Swift/ObjC、Android Kotlin/Java 以及 Flutter/React Native。内置苹果/安卓包体签名与托管（Automated Code Signing），与 App Store Connect 及 Google Play 控制台原生联动，极速内测分发。" 
                          : "Support Native iOS & Android, Flutter, and React Native. Fully integrated with secure remote mobile keychain managers, provisioning profile setups, and direct distribution bridges to TestFlight and Google Play Beta."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-rose-400">100%</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "苹果证书云端合规重签" : "Automated Apple Signing"}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-emerald-400">No-ops</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "直连两端应用商店" : "App Store Direct Upload"}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`relative border rounded-2xl p-6 ${mode === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/5">
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold">Keychain Security Status</span>
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      </div>
                      <div className="space-y-3.5 font-mono text-xs text-gray-400">
                        <div className="flex justify-between"><span className="text-gray-500">Android Keystore</span><span className="text-emerald-500">Encrypted (AES-256)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Apple iOS Cert (P12)</span><span className="text-emerald-500">Provisioned (Active)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">App Store Connect API Key</span><span className="text-emerald-500">Authorized</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Google Play API Key</span><span className="text-emerald-500">Authorized</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Build Target Arch</span><span className="text-indigo-400">arm64-v8a / universal</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSolution === 'backend' && (
                  <motion.div
                    key="backend"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div className="space-y-6">
                      <div className="inline-block p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Server className="w-6 h-6" />
                      </div>
                      <h3 className={`text-2xl font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? "全栈后端治理、AI 模型与分布式微服务" : "Full-Stack Backend, AI Pipelines & Microservices Governance"}
                      </h3>
                      <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isZh 
                          ? "专为高可用分布式服务打造。提供一站式容器化部署（K8s / Cloud Run），深度支持 Java/Spring、Go、C++、Rust 等主流后端架构与 Python/AI 模型流水线治理。集成主流数据库（PostgreSQL/MySQL）、缓存（Redis）与消息网格（Kafka/RabbitMQ）一站式运维治理。" 
                          : "Built for scalable microservices. Connect and secure diverse backends (Java/Spring, Go, C++, Rust), Python AI model pipelines, and gRPC servers. Manage dependency mesh databases, redis session cache instances, and event message brokers smoothly across isolated namespaces."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-purple-400">&lt; 3.5s</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "微服务新环境拉起时间" : "New Env Boot Time"}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="text-xl font-black text-emerald-400">99.99%</div>
                          <div className="text-xs text-gray-500 mt-1 font-semibold">{isZh ? "高可用隔离集群运行SLA" : "High-Availability SLA"}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`relative border rounded-2xl p-6 ${mode === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center justify-between border-b pb-4 mb-4 border-white/5">
                        <span className="text-xs font-mono text-gray-500 uppercase font-semibold">Active Backend dependencies</span>
                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                      </div>
                      <div className="space-y-3.5 font-mono text-xs text-gray-400">
                        <div className="flex justify-between"><span className="text-gray-500">PostgreSQL (Primary Cluster)</span><span className="text-emerald-500">RUNNING (1.2 GB mem)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Redis (Distributed Cache)</span><span className="text-emerald-500">RUNNING (256 MB mem)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">GraphQL Gateway (Go Compute)</span><span className="text-emerald-500">RUNNING (18% CPU)</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Prometheus Node Exporter</span><span className="text-emerald-500">RUNNING</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Cluster Connection Pool</span><span className="text-emerald-500">OK (99.9% Health)</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Sub-tab Next Guide Footer */}
        <section className={`py-12 px-6 border-b ${mode === 'dark' ? 'bg-gray-950 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase">NEXT SPECIALIZED MODULE</span>
              <h4 className={`text-lg font-bold mt-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "评估 03 / 研发效能测算与 ROI 分析" : "Calculate 03 / Engineering ROI & Productivity"}
              </h4>
            </div>
            <button
              onClick={() => {
                setLandingSubTab('roi');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-accent hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{isZh ? "前往研发 ROI 评估" : "Calculate ROI Metrics"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
        </>
        )}

        {/* Enterprise ROI & Build Performance Calculator (Dedicated ROI View) */}
        {landingSubTab === 'roi' && (
          <>
            <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                    {isZh ? "能效计算器" : "ROI CALCULATOR"}
                  </span>
                  <h2 className={`text-4xl font-black tracking-tight leading-tight mt-2 font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {isZh ? "估算 DevOps Hub 带来的研发能效增值" : "Calculate Your Engineering Savings"}
                  </h2>
                  <p className={`text-sm mt-4 leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isZh 
                      ? "通过引入分布式智能缓存与能效调度技术，DevOps Hub Studio 平均可将开发团队构建等待时间压缩 80% 以上。请选择您的团队状态以评估 ROI 的提升。" 
                      : "By utilizing distributed warm caches and elastic builder orchestration, DevOps Hub average reduces wait-times by over 80%. Adjust the parameters to calculate your monthly returns."}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Slider 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                      <span>{isZh ? "团队研发规模" : "DEVELOPERS"}</span>
                      <span className="text-accent">{engineers} {isZh ? "人" : "Engineers"}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="500" 
                      value={engineers} 
                      onChange={(e) => setEngineers(Number(e.target.value))}
                      className="w-full accent-accent bg-gray-200/50 dark:bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                      <span>{isZh ? "人均月构建次数" : "BUILDS / MONTH"}</span>
                      <span className="text-accent">{buildsPerMonth} {isZh ? "次" : "Builds"}</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={buildsPerMonth} 
                      onChange={(e) => setBuildsPerMonth(Number(e.target.value))}
                      className="w-full accent-accent bg-gray-200/50 dark:bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                      <span>{isZh ? "当前单次构建耗时" : "CURRENT BUILD TIME"}</span>
                      <span className="text-accent">{currentDuration} {isZh ? "分钟" : "Mins"}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="120" 
                      value={currentDuration} 
                      onChange={(e) => setCurrentDuration(Number(e.target.value))}
                      className="w-full accent-accent bg-gray-200/50 dark:bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Outputs Widget */}
              <div className="lg:col-span-7">
                <div className={`p-8 md:p-12 rounded-[2.5rem] border flex flex-col justify-between h-full ${
                  mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-2xl shadow-gray-200/30'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b pb-8 border-white/5">
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? "每月节省研发时间" : "HOURS SAVED / MONTH"}</div>
                      <div className="text-4xl md:text-5xl font-black text-accent font-display mt-2">
                        {Math.round(engineers * buildsPerMonth * (currentDuration - 3.8) / 60)} <span className="text-sm font-sans font-bold">{isZh ? "小时" : "Hours"}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2">
                        {isZh ? "基于 DevOps Hub 均值 3.8 分钟/次算得" : "Calculated using DevOps Hub average cycle time"}
                      </p>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{isZh ? "年均节省研发成本" : "ANNUAL REVENUE SAVED"}</div>
                      <div className="text-4xl md:text-5xl font-black text-emerald-400 font-display mt-2">
                        ${Math.round(engineers * buildsPerMonth * (currentDuration - 3.8) / 60 * 12 * 65).toLocaleString()}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2">
                        {isZh ? "基于行业高级工程师时薪标准 $65 评估" : "Estimated at market average of $65/hr"}
                      </p>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row items-center gap-6 justify-between p-6 rounded-2xl border ${
                    mode === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{isZh ? "编译流加速比" : "BUILD SPEEDUP FACTOR"}</div>
                        <div className={`text-xl font-black mt-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {(currentDuration / 3.8).toFixed(1)}x {isZh ? "加速" : "Acceleration"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onEnter}
                      className="w-full sm:w-auto bg-accent text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-accent/20"
                    >
                      {isZh ? "立即试用加速" : "Start Build Speedup"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Edge Node Map */}
        <section className={`py-32 px-6 border-t transition-colors ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-gray-50/20'}`}>
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4 max-w-xl mx-auto">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "基础设施与智能遥测" : "GLOBAL INFRASTRUCTURE"}
              </span>
              <h2 className={`text-4xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "全球弹性构建节点与低时延网络" : "Global High-Performance Edge Build Grid"}
              </h2>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh 
                  ? "DevOps Hub 拥有全球分布式构建集群。无论您的开发团队身处何处，构建请求都将自动分发至最近的边缘高性能节点。" 
                  : "Deploy builds to a globally distributed warm cache cloud. Enjoy sub-millisecond network speeds from major innovation hubs around the world."}
              </p>
            </div>

            {/* Simulated interactive map grid */}
            <div className={`border rounded-[2rem] p-8 relative overflow-hidden ${
              mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-xl'
            }`}>
              {/* Map background network grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center relative z-10">
                {[
                  { region: isZh ? "北美集群 (美西)" : "North America (US-West)", latency: "14ms", status: "Online", hardware: "A100 Compute Grid" },
                  { region: isZh ? "欧洲集群 (法兰克福)" : "Europe Central (DE-West)", latency: "18ms", status: "Online", hardware: "x86 Bare Metal Matrix" },
                  { region: isZh ? "亚太集群 (新加坡)" : "Asia Pacific (SG-East)", latency: "11ms", status: "Online", hardware: "EPYC Compute Cluster" },
                  { region: isZh ? "中国集群 (上海)" : "East China (CN-East)", latency: "15ms", status: "Online", hardware: "Mac Pro Studio Cluster" }
                ].map((node, i) => (
                  <div key={i} className={`p-6 rounded-2xl border w-full text-left transition-all ${
                    mode === 'dark' ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-accent/10 text-accent">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <h4 className={`font-bold text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{node.region}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 font-mono">{node.hardware}</p>
                    <div className="flex justify-between items-center mt-6 border-t pt-3 border-white/5">
                      <span className="text-[10px] font-bold text-gray-500">LATENCY</span>
                      <span className="text-xs font-mono font-black text-accent">{node.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sub-tab Next Guide Footer */}
        <section className={`py-12 px-6 border-b ${mode === 'dark' ? 'bg-gray-950 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-accent tracking-widest uppercase">NEXT SPECIALIZED MODULE</span>
              <h4 className={`text-lg font-bold mt-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "查看 04 / DevSecOps & 企业合规治理" : "Review 04 / Enterprise DevSecOps & Governance"}
              </h4>
            </div>
            <button
              onClick={() => {
                setLandingSubTab('enterprise');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-accent hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{isZh ? "前往企业治理专区" : "View Governance & SLA"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
        </>
        )}

        {/* Interactive Customer Success Case Studies Hub (Dedicated Governance View) */}
        {landingSubTab === 'enterprise' && (
          <>
            <section id="case-studies" className={`py-32 px-6 border-t transition-colors ${mode === 'dark' ? 'border-white/5 bg-black/50' : 'border-gray-100 bg-gray-50/10'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "客户成功案例" : "CLIENT SUCCESS STORIES"}
              </span>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "行业头部企业的效能跨越实践" : "How Industry Leaders Accelerate with Us"}
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh ? "看看不同技术领域的研发团队，如何利用 DevOps Hub Studio 重新定义软件交付速度与质量。" : "Explore real-world case studies demonstrating how elite engineering teams streamline delivery loops and save costs."}
              </p>
            </div>

            {/* Testimonials switcher tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              <div className="lg:col-span-4 flex flex-col gap-4">
                {[
                  { id: 'gamedev', label: isZh ? "NOVA INTERACTIVE (游戏研发)" : "Nova Interactive (Game Engine)", desc: "Unity/UE5 Heavy Build Pipeline", icon: Gamepad2 },
                  { id: 'web', label: isZh ? "AETHER CLOUD (企业 Web 与云服务)" : "Aether Cloud (Enterprise Web)", desc: "Monorepo & Edge Replication", icon: Server },
                  { id: 'mobile', label: isZh ? "APEX MOBILE (原生与跨端应用)" : "Apex Mobile (Mobile & Fintech)", desc: "Automated Sign & App Store Connect", icon: Smartphone }
                ].map((study) => {
                  const Icon = study.icon;
                  const isActive = activeCaseStudy === study.id;
                  return (
                    <button
                      key={study.id}
                      onClick={() => setActiveCaseStudy(study.id as any)}
                      className={`text-left p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                        isActive
                          ? (mode === 'dark' ? "bg-accent/10 border-accent text-white shadow-lg" : "bg-white border-accent text-gray-900 shadow-xl shadow-accent/5")
                          : (mode === 'dark' ? "bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/[0.03]" : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50")
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isActive ? "bg-accent text-white" : (mode === 'dark' ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500")}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider">{study.label}</div>
                        <div className="text-[11px] text-gray-500 mt-1 font-mono">{study.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Case Study Details Panel */}
              <div className="lg:col-span-8">
                <div className={`p-8 md:p-12 rounded-[2.5rem] border h-full flex flex-col justify-between transition-all duration-500 ${
                  mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-xl'
                }`}>
                  <AnimatePresence mode="wait">
                    {activeCaseStudy === 'gamedev' && (
                      <motion.div
                        key="gamedev_study"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                          <div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">CASE 01 / GAME SECTOR</span>
                            <h3 className={`text-2xl font-bold mt-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{isZh ? "虚幻引擎 5 构建打包周期从 45分钟 压缩至 3.8分钟" : "UE5 Engine build cycle reduced from 45 min to 3.8 min"}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 font-black" />)}
                          </div>
                        </div>

                        <p className={`text-sm md:text-base leading-relaxed italic ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {isZh 
                            ? "“DevOps Hub Studio 重构了我们的 Shader 暖启动和 Addressables 资源增量打包流水线。我们的大型开放世界手游《Nexus Dawn》得益于此，提前 3 个月完成了全平台测试，二次构建命中率达到了 94.2%，完全消除了打包等待带来的研发中断。”" 
                            : "“DevOps Hub Studio re-architected our shader warm-ups and Addressables build pipelines. Thanks to this, our AAA mobile open-world game 'Nexus Dawn' launched 3 months ahead of schedule. The incremental cache hit-rate reached 94.2%, completely eliminating pipeline bottlenecks.”"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                          <div>
                            <div className="text-3xl font-black text-accent font-display">91.5%</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "等待时长缩短" : "TIME SAVED"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-indigo-400 font-display">94.2%</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "增量缓存命中率" : "CACHE HIT RATE"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-emerald-400 font-display">3 Months</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "交付周期提前" : "TIME TO MARKET"}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs font-mono">MV</div>
                          <div>
                            <div className={`text-xs font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Marcus Vance</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{isZh ? "NOVA INTERACTIVE 研发技术总监" : "Director of Engineering, Nova Interactive"}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeCaseStudy === 'web' && (
                      <motion.div
                        key="web_study"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">CASE 02 / WEB & ENTERPRISE SAAS</span>
                            <h3 className={`text-2xl font-bold mt-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{isZh ? "大规模 Monorepo 多包构建及云原生冷启动治理" : "Enterprise Monorepo built with 100% warm-node serverless caching"}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 font-black" />)}
                          </div>
                        </div>

                        <p className={`text-sm md:text-base leading-relaxed italic ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {isZh 
                            ? "“多端前端 Monorepo 的包依赖与部署曾是我们的噩梦，冷启动往往耗时近 15 分钟。引入 DevOps Hub Studio 智能 Turborepo 深度集成与 Node 缓存网络后，全球边缘分发提速至秒级，不仅消除了无用构建，每年还为我们节省了近 24 万美元的计算开销。”" 
                            : "“Managing global package dependencies inside our enterprise Monorepo was incredibly complex. Moving to DevOps Hub dynamic Turborepo integration and global static Edge servers allowed secondary builds to complete instantly, saving us over $240,000 in raw infrastructure costs.”"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                          <div>
                            <div className="text-3xl font-black text-accent font-display">$240K+</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "年均节省算力成本" : "YEARLY CLOUD SAVINGS"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-emerald-400 font-display">&lt; 30s</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "全球边缘节点部署时间" : "GLOBAL DEPLOYMENT"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-indigo-400 font-display">98.2%</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "依赖缓存命中率" : "DEPENDENCY HIT RATE"}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs font-mono">SJ</div>
                          <div>
                            <div className={`text-xs font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sarah Jenkins</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{isZh ? "AETHER CLOUD 基础架构高级副总裁" : "VP of Infrastructure, Aether Cloud"}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeCaseStudy === 'mobile' && (
                      <motion.div
                        key="mobile_study"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-8"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                          <div>
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest font-mono">CASE 03 / MOBILE FINTECH SECURE DELIVERY</span>
                            <h3 className={`text-2xl font-bold mt-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{isZh ? "移动金融 App 密钥重签与多语言商店全自动化合规上架" : "Mobile App Store signing automated across 24 localized builds"}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 font-black" />)}
                          </div>
                        </div>

                        <p className={`text-sm md:text-base leading-relaxed italic ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {isZh 
                            ? "“作为金融级支付应用，证书安全和上架合规审查极其严格。DevOps Hub 自建的安全机密库完美契合我们的诉求，所有的 iOS 描述文件重签和 Android Keystore 注入全部在内存沙箱中进行。原本需要移动组耗费几天的多版本合规分发，现在全链路缩短到一键托管。”" 
                            : "“As a heavily audited fintech payment provider, certificate security is critical. DevOps Hub secure credentials vault handles all iOS profile provisionings and Android Keystores inside secure memory sandboxes. What used to take our mobile team days of manual overhead is now fully automated.”"}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                          <div>
                            <div className="text-3xl font-black text-accent font-display">100%</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "签名密钥云合规通过率" : "SIGNING COMPLIANCE"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-rose-400 font-display">No-ops</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "应用商城直连发布" : "STORE DEPLOYMENT"}</div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-emerald-400 font-display">AES-256</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-wider">{isZh ? "内存沙箱加密级别" : "VAULT ENCRYPTION"}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-black text-xs font-mono">LC</div>
                          <div>
                            <div className={`text-xs font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Linus Cho</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{isZh ? "APEX MOBILE 首席信息安全官" : "Chief Information Security Officer, Apex Mobile"}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrated Previews */}
        <section id="features" className={`py-32 px-6 transition-colors ${mode === 'dark' ? 'bg-white/[0.01]' : 'bg-gray-50/30'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <h2 className={`text-4xl font-black tracking-tight leading-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {t('preview.title')}
                  </h2>
                  <p className={`text-lg leading-relaxed font-medium tracking-tight ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('preview.desc1')}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, text: t('preview.feature1') },
                    { icon: Lock, text: t('preview.feature2') },
                    { icon: Zap, text: t('preview.feature3') },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 text-sm font-bold ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <item.icon className="w-5 h-5 text-emerald-400" />
                      {item.text}
                    </div>
                  ))}
                </div>
                
                <button onClick={onEnter} className={`inline-flex items-center gap-2 text-sm font-black hover:text-accent transition-colors uppercase tracking-widest border-b-2 border-accent pb-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('hero.cta')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="lg:col-span-7 relative group">
                <div className={`absolute inset-0 blur-[100px] rounded-full scale-75 opacity-30 group-hover:opacity-50 transition-opacity ${mode === 'dark' ? 'bg-accent/20' : 'bg-accent/10'}`} />
                <div className={`relative border rounded-[2.5rem] p-3 shadow-2xl overflow-hidden aspect-[16/10] transform hover:scale-[1.02] transition-transform duration-700 ${mode === 'dark' ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                  {/* Browser/App Frame */}
                  <div className={`relative flex flex-col h-full rounded-[2rem] border overflow-hidden ${mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-[#fcfcfc] border-gray-200/50'}`}>
                    {/* Header Bar */}
                    <div className={`h-12 border-b flex items-center justify-between px-6 ${mode === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${mode === 'dark' ? 'bg-red-500/30' : 'bg-red-500/20'}`} />
                          <div className={`w-2.5 h-2.5 rounded-full ${mode === 'dark' ? 'bg-amber-500/30' : 'bg-amber-500/20'}`} />
                          <div className={`w-2.5 h-2.5 rounded-full ${mode === 'dark' ? 'bg-emerald-500/30' : 'bg-emerald-500/20'}`} />
                        </div>
                        <div className={`ml-4 h-5 w-48 rounded-lg flex items-center px-3 ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-200/50'}`}>
                          <div className="w-2 h-2 rounded-full bg-accent/50 mr-2" />
                          <div className={`h-1.5 w-full rounded-full ${mode === 'dark' ? 'bg-white/10' : 'bg-gray-300/50'}`} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-200/50'}`} />
                        <div className={`w-24 h-5 rounded-lg ${mode === 'dark' ? 'bg-white/5' : 'bg-gray-200/50'}`} />
                      </div>
                    </div>
                    
                    {/* Live Content Area */}
                    <div className="flex-1 overflow-hidden flex">
                      {/* Mini Sidebar */}
                      <div className={`w-16 border-r p-4 flex flex-col gap-6 items-center ${mode === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-gray-100 bg-gray-50/30'}`}>
                        {[Rocket, Activity, Database, Cpu, ShieldCheck].map((Icon, i) => (
                          <Icon key={i} className={`w-5 h-5 ${i === 0 ? 'text-accent' : (mode === 'dark' ? 'text-gray-600' : 'text-gray-400')}`} />
                        ))}
                      </div>
                      
                      {/* Main Scrollable View */}
                      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="scale-[0.85] origin-top transform-gpu">
                          <InsightsDashboard />
                        </div>
                      </div>
                    </div>

                    {/* Interaction Glow */}
                    <motion.div 
                      animate={{ 
                        x: [0, 150, 0],
                        y: [0, 80, 0]
                      }}
                      transition={{ duration: 15, repeat: Infinity }}
                      className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise FAQ & Compliance Accordion */}
        <section id="faq" className={`py-32 px-6 border-t transition-colors ${mode === 'dark' ? 'border-white/5 bg-black' : 'border-gray-100 bg-gray-50/20'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "常见问答与合规" : "FAQ & SECURITY"}
              </span>
              <h2 className={`text-4xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "企业级安全合规与常见问答" : "Enterprise Compliance & FAQ"}
              </h2>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh ? "了解 DevOps Hub Studio 如何保障高等级研发资产、签名密钥和运行环境的安全与高可用。" : "Learn how DevOps Hub protects your highly sensitive developer secrets, credentials, and hybrid runner nodes."}
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  qEn: "How does DevOps Hub guarantee the security of build credentials?",
                  qZh: "如何保证代码与敏感构建密钥（如签名证书）的安全性？",
                  aEn: "We employ our custom SSH Cryptographic Vault. All credentials, iOS P12 profiles, and Android keystores are stored using AES-256-GCM encryption. They are temporarily injected into isolated build sandbox memories and instantly scrubbed post-execution, strictly meeting ISO 27001 compliance standard.",
                  aZh: "我们采用自建的安全机密库（SSH Cryptographic Vault）。所有签名证书、安卓 Keystore 和苹果 P12 密钥均经过 AES-256 级别强加密落盘，在构建节点沙箱中以内存态即用即销毁，符合 ISO 27001 安全规范。"
                },
                {
                  qEn: "Can we connect our own on-premises bare metal build nodes?",
                  qZh: "平台是否支持接入企业本地物理机或私有云物理节点？",
                  aEn: "Absolutely. With our cluster node pools, you can register any secure local hardware or private IDC nodes via a single lightweight command-line setup. Distributed builds sync using secure tunnel networks, shielding your local network entirely from public exposure.",
                  aZh: "完全支持。企业可通过一键拉起轻量级 Agent 命令行，快速将企业内网的本地 Bare Metal 物理服务器、Mac mini 编译阵列或私有 K8s 集群无缝接入至 Runner Cluster Pools。通过安全的专线拉取协议进行双向同步，零公网入站暴露，兼顾极速与绝对机密性。"
                },
                {
                  qEn: "How does the caching system accelerate heavy Unreal/Unity 3D packages?",
                  qZh: "针对 Unity/Unreal Engine 等大体积游戏包体，如何优化构建？",
                  aEn: "DevOps Hub integrates a distributed physics-cache sharing system. By caching previous Library, Temp, and Intermediate assets across distributed high-performance SSD volumes, we achieve up to 90% cache hit ratios, compressing secondary incremental compilation cycles down to sub-5 minutes.",
                  aZh: "平台在物理层部署了特异性优化。针对 Unity (Library/) 与 Unreal (Intermediate/) 大体积临时目录，内置分布式瞬时缓存技术。通过全局共享的高速 SSD 缓存卷复用增量资源，确保二次增量构建获得高达 90% 以上的缓存命中率，让 3D 引擎的打包周期缩短至 5 分钟以内。"
                },
                {
                  qEn: "What levels of SLA and enterprise tech support do you provide?",
                  qZh: "是否提供企业级可用性 SLA 协议与专属技术支持？",
                  aEn: "Our Commercial Plan guarantees a 99.99% active runner pool uptime SLA. Every enterprise client is matched with a dedicated 24/7 technical solutions expert group to coordinate deployment architectures, pipeline optimization, and custom script integrations.",
                  aZh: "我们的企业版及商业计划书提供 99.99% 构建节点高可用性 SLA 担保协议。每个企业用户均可获得由 24/7 专属资深平台效能专家、平台架构师组成的专家组全程护航，支持定制化自动化脚本编写与私有化环境调优服务。"
                }
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen 
                        ? (mode === 'dark' ? 'bg-white/[0.03] border-accent/30' : 'bg-white border-accent/20 shadow-lg shadow-accent/5') 
                        : (mode === 'dark' ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm')
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                    >
                      <h3 className={`font-bold text-sm md:text-base pr-4 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isZh ? item.qZh : item.qEn}
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className={`px-6 pb-6 text-xs md:text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <div className={`pt-2 border-t ${mode === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                              {isZh ? item.aZh : item.aEn}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enterprise Interactive Solution Consultant Suite */}
        <section id="consultant" className={`py-32 px-6 border-t transition-colors ${mode === 'dark' ? 'border-white/5 bg-[#030303]' : 'border-gray-100 bg-gray-50/20'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                {isZh ? "智能方案设计中心" : "ARCHITECT BLUEPRINT SUITE"}
              </span>
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "定制化企业研发效能解决方案" : "Design Your Enterprise Blueprint"}
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isZh ? "输入您的团队规模与偏好，我们的人性化智能架构引擎将实时为您绘制专属的 DevOps 构建节点矩阵与拓扑策略。" : "Select your organization parameters to instantly synthesize a customized infrastructure structure, cache policy, and security topology."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              {/* Form Side */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div className={`p-8 md:p-10 rounded-[2rem] border ${
                  mode === 'dark' ? 'bg-black border-white/5' : 'bg-white border-gray-100 shadow-xl'
                }`}>
                  <h3 className={`text-lg font-bold mb-8 flex items-center gap-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                    {isZh ? "1. 填入研发配置需求" : "1. Specify Your Requirements"}
                  </h3>

                  <div className="space-y-6">
                    {/* Organization Input */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                        {isZh ? "公司或组织名称" : "Company / Organization Name"}
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            if (formError) setFormError('');
                          }}
                          placeholder={isZh ? "例如：Nova Interactive" : "e.g. Nova Interactive"}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border focus:outline-none focus:border-accent font-medium transition-all ${
                            mode === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                        {isZh ? "企业电子邮箱" : "Work Email Address"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={workEmail}
                          onChange={(e) => {
                            setWorkEmail(e.target.value);
                            if (formError) setFormError('');
                          }}
                          placeholder={isZh ? "例如：developer@nova.com" : "e.g. developer@nova.com"}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border focus:outline-none focus:border-accent font-medium transition-all ${
                            mode === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Team Size Selector */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                        {isZh ? "研发团队规模" : "Team Size (Developers)"}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {['5-20', '21-100', '101-500', '500+'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setConsultantTeamSize(sz)}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              consultantTeamSize === sz
                                ? 'bg-accent/10 border-accent text-accent'
                                : (mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stack Selector */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                        {isZh ? "核心研发技术栈" : "Primary Technology Stack"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'gamedev', label: isZh ? "游戏引擎" : "Game Dev", desc: "Unity/UE5" },
                          { id: 'web', label: "Modern Web", desc: "React/Next" },
                          { id: 'mobile', label: isZh ? "移动端" : "Mobile App", desc: "Flutter/iOS" },
                          { id: 'backend', label: isZh ? "后端微服务" : "Back-End", desc: "K8s/Go" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setConsultantStack(item.id as any)}
                            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                              consultantStack === item.id
                                ? 'bg-accent/10 border-accent text-accent'
                                : (mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            <div className="text-xs font-black">{item.label}</div>
                            <div className="text-[9px] text-gray-500 mt-0.5 font-mono">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deployment Environment */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                        {isZh ? "部署环境架构" : "Target Deployment Environment"}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'saas', label: "SaaS Cloud" },
                          { id: 'hybrid', label: "Hybrid VPC" },
                          { id: 'onprem', label: "On-Premises" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setConsultantDeploy(item.id as any)}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              consultantDeploy === item.id
                                ? 'bg-accent/10 border-accent text-accent'
                                : (mode === 'dark' ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Form Error */}
                    {formError && (
                      <div className="text-xs font-bold text-red-500 mt-2">
                        ⚠️ {formError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={() => {
                        if (!companyName.trim()) {
                          setFormError(isZh ? "请输入您的公司名称" : "Please input your company/organization name.");
                          return;
                        }
                        if (!workEmail.trim() || !workEmail.includes('@')) {
                          setFormError(isZh ? "请输入有效的企业邮箱" : "Please input a valid business email address.");
                          return;
                        }
                        setFormError('');
                        setIsSubmittingConsultant(true);
                        setConsultantResult(null);

                        // Simulated compile/processing log delay
                        setTimeout(() => {
                          setIsSubmittingConsultant(false);
                          setConsultantResult({
                            refId: `ARCH-${Math.floor(1000 + Math.random() * 9000)}-DOP`,
                            teamSize: consultantTeamSize,
                            stack: consultantStack,
                            deploy: consultantDeploy,
                            timestamp: new Date().toLocaleDateString()
                          });
                        }, 2200);
                      }}
                      disabled={isSubmittingConsultant}
                      className="w-full bg-accent hover:opacity-90 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-accent/20 cursor-pointer flex justify-center items-center gap-2"
                    >
                      {isSubmittingConsultant ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {isZh ? "正在通过大模型匹配构建拓扑..." : "SYNTHESIZING ARCHITECTURE MANIFEST..."}
                        </>
                      ) : (
                        isZh ? "生成智能企业架构蓝图" : "Synthesize Enterprise Blueprint"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview Side */}
              <div className="lg:col-span-6">
                <div className={`p-8 md:p-10 rounded-[2rem] border h-full flex flex-col justify-between transition-all duration-500 ${
                  mode === 'dark' ? 'bg-[#050505] border-white/5' : 'bg-white border-gray-100 shadow-xl'
                }`}>
                  <AnimatePresence mode="wait">
                    {consultantResult ? (
                      <motion.div
                        key="consultant_success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6 text-left flex flex-col justify-between h-full"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              <Check className="w-5 h-5 font-black" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">MANIFEST SYNTHESIZED</div>
                              <h4 className={`text-xl font-bold mt-0.5 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{companyName} {isZh ? "定制化拓扑已生成" : "Blueprint Ready"}</h4>
                            </div>
                          </div>

                          <div className={`p-5 rounded-2xl border font-mono text-xs space-y-3 ${mode === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">{isZh ? "蓝图单号" : "BLUEPRINT ID"}</span>
                              <span className="text-accent font-black">{consultantResult.refId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">{isZh ? "开发规模" : "DEVELOPERS"}</span>
                              <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>{consultantResult.teamSize} {isZh ? "人" : "engineers"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">{isZh ? "首选技术栈" : "PRIMARY STACK"}</span>
                              <span className="text-accent font-bold uppercase">{consultantResult.stack}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">{isZh ? "基础设施部署" : "DEPLOY MODE"}</span>
                              <span className="text-emerald-400 font-bold uppercase">{consultantResult.deploy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">{isZh ? "有效期" : "GENERATED ON"}</span>
                              <span className="text-gray-400">{consultantResult.timestamp}</span>
                            </div>
                          </div>

                          {/* Action Items Recommendation list */}
                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">{isZh ? "系统设计及交付建议" : "TAILORED RECOMMENDATIONS"}</span>
                            <ul className="space-y-2.5 text-xs">
                              <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                  {isZh 
                                    ? `建议接入 ${consultantResult.teamSize === '5-20' ? '12 个弹性轻量级' : '48 个高并发高性能'} Runner 节点，实现零排队敏捷流水线构建。` 
                                    : `Provisioning ${consultantResult.teamSize === '5-20' ? '12 elastic lightweight' : '48 high-performance serverless'} nodes for zero-delay compilation.`}
                                </span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                  {consultantResult.deploy === 'saas' && (isZh ? "采用完全托管的 SaaS 安全底座，配置 AWS/GCP 托管 KMS 自动解密机制。" : "Deploying on fully-managed SaaS architecture with encrypted Cloud-KMS credentials.")}
                                  {consultantResult.deploy === 'hybrid' && (isZh ? "推荐采用双向专线代理桥接本地 Bare Metal 与云端 Runner 控制台，确保数据不泄露。" : "Establishing a secure VPC gateway tunnel to connect cloud schedulers with local Mac compile units.")}
                                  {consultantResult.deploy === 'onprem' && (isZh ? "启用完全隔绝物理气隙部署。所有密钥签名与编译过程通过局域网高可用镜像仓承载。" : "Hardening bare-metal node clusters inside isolated physical intranet. Local shared SSD cache.")}
                                </span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                                  {consultantResult.stack === 'gamedev' && (isZh ? "自动注入 Shader 增量物理缓存共享策略，Library 卷预分配 SSD 全局共享，节省 90% 重复构建时间。" : "Enabling shared volume addressables cache sharing, reducing massive Unity/UE Library rebuilds by 90%.")}
                                  {consultantResult.stack === 'web' && (isZh ? "引入极速 Turborepo 多包增量哈希裁剪，配合多路边缘 CDN 实现秒级静态分发。" : "Injecting Turborepo global incremental hash alignment with instant edge assets routing.")}
                                  {consultantResult.stack === 'mobile' && (isZh ? "激活自动化 iOS 重签与 Android Keystore 沙箱加密存储。商店分发通过 API 直接分发至 TestFlight / Play Store。" : "Automating fastlane credentials bridging. Cert keys are generated inside AES-256 memory buffers.")}
                                  {consultantResult.stack === 'backend' && (isZh ? "集成 Docker 基础层镜像多阶段增量高速裁剪，多微服务 CI 通过并发 DOCKER_BUILDKIT 进行提速。" : "Integrating microservices parallel Docker buildkit. Fast Kubernetes namespace hot swaps.")}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                          <button
                            onClick={() => {
                              window.print();
                            }}
                            className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center cursor-pointer border ${
                              mode === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {isZh ? "打印或保存 PDF 蓝图" : "Print / Save PDF Manifest"}
                          </button>
                          <button
                            onClick={() => {
                              setCompanyName('');
                              setWorkEmail('');
                              setConsultantResult(null);
                            }}
                            className="flex-1 bg-accent text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center cursor-pointer hover:opacity-90 transition-all"
                          >
                            {isZh ? "重新定制方案" : "Create New Scenario"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="consultant_preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 text-left flex flex-col justify-between h-full"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest font-mono">ARCHITECTURE PREVIEW</span>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-bold text-gray-500 font-mono">DRAFT_MODE</span>
                            </div>
                          </div>

                          <h4 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {isZh ? "实时系统组网与能效拓扑预览" : "Live Infrastructure Architecture Topology"}
                          </h4>

                          {/* Visual Dynamic Architecture Graph Mock */}
                          <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col items-center justify-center min-h-[180px] ${
                            mode === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-gray-50 border-gray-100'
                          }`}>
                            {/* Topological Connecting Lines */}
                            <div className="absolute inset-0 pointer-events-none opacity-25">
                              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 50,90 Q 150,30 250,90 T 450,90" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                                <path d="M 50,90 Q 150,150 250,90 T 450,90" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3,3" />
                              </svg>
                            </div>

                            <div className="flex justify-between items-center w-full max-w-sm relative z-10">
                              <div className="flex flex-col items-center gap-2">
                                <div className={`p-3 rounded-2xl border ${mode === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-md'}`}>
                                  <Code className="w-5 h-5 text-accent" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-gray-500">GIT REPO</span>
                              </div>

                              <div className="h-0.5 w-10 border-t border-dashed border-gray-600 relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-1.5 rounded-full bg-accent animate-[ping_2s_infinite]" />
                              </div>

                              <div className="flex flex-col items-center gap-2">
                                <div className={`p-4 rounded-2xl border animate-pulse ${
                                  mode === 'dark' ? 'bg-black border-accent/40 text-accent' : 'bg-white border-accent/30 text-accent shadow-lg shadow-accent/5'
                                }`}>
                                  {consultantStack === 'gamedev' && <Gamepad2 className="w-6 h-6" />}
                                  {consultantStack === 'web' && <Server className="w-6 h-6" />}
                                  {consultantStack === 'mobile' && <Smartphone className="w-6 h-6" />}
                                  {consultantStack === 'backend' && <Boxes className="w-6 h-6" />}
                                </div>
                                <span className="text-[9px] font-mono font-black text-accent uppercase">{consultantStack} RUNNER</span>
                              </div>

                              <div className="h-0.5 w-10 border-t border-dashed border-gray-600" />

                              <div className="flex flex-col items-center gap-2">
                                <div className={`p-3 rounded-2xl border ${mode === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-md'}`}>
                                  <Network className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">{consultantDeploy}</span>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic specifications cards */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{isZh ? "建议计算节点" : "NODE SPECIFICATION"}</span>
                              <div className={`text-xs font-bold mt-1 uppercase ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {consultantDeploy === 'saas' && (isZh ? "SaaS 边缘高规格节点" : "Serverless SaaS Runners")}
                                {consultantDeploy === 'hybrid' && (isZh ? "本地 Bare Metal 集群机" : "Hybrid Dedicated Cluster")}
                                {consultantDeploy === 'onprem' && (isZh ? "隔离气隙私有物理服务器" : "On-Premises EPYC Array")}
                              </div>
                            </div>
                            <div className={`p-4 rounded-2xl border ${mode === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{isZh ? "针对性缓存加速策略" : "SPECIFIC CACHE ALIGNMENT"}</span>
                              <div className={`text-xs font-bold mt-1 uppercase ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {consultantStack === 'gamedev' && "Library/Intermediate SSD Cache"}
                                {consultantStack === 'web' && "Turborepo Edge Cache"}
                                {consultantStack === 'mobile' && "Profiles Keychain Sign Cache"}
                                {consultantStack === 'backend' && "Docker Layer Registry Cache"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl text-xs font-medium border text-gray-500 text-center ${
                          mode === 'dark' ? 'bg-white/[0.01] border-white/5' : 'bg-gray-50 border-gray-200'
                        }`}>
                          ℹ️ {isZh ? "请在左侧填入公司名称及企业邮箱，以锁定制定的架构拓扑及高可用 SLA 保证方案。" : "Fill in your corporate email on the left to lock and generate the downloadable security architecture blueprint."}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
        )}

        <section className="py-48 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className={`text-5xl md:text-7xl font-black tracking-tight leading-none font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('cta.title')}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {t('cta.desc')}
            </p>
            <div className="flex justify-center pt-8">
              <button
                onClick={onEnter}
                className={`font-black px-12 py-6 rounded-full transition-all text-base uppercase tracking-tighter shadow-2xl ${mode === 'dark' ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'}`}
              >
                {t('cta.btn')}
              </button>
            </div>
          </div>
        </section>
      </motion.main>
    ) : (
      <motion.main
        key="bp"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative z-10 pt-32"
      >
        <BusinessPlan />
      </motion.main>
    )}
    </AnimatePresence>

    {/* Footer */}
    <footer className={`max-w-7xl mx-auto px-6 py-20 border-t transition-colors ${mode === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className={`text-xl font-black tracking-tighter italic font-display ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>DEVOPS HUB</div>
              <p className={`text-sm leading-relaxed ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('footer.desc')}
              </p>
            </div>
            {[
              { title: t('footer.cols.product'), links: [
                { label: t('footer.links.features'), href: "#features" },
                { label: t('footer.links.solutions'), href: "#modules" },
                { label: t('footer.links.runners'), href: "#" },
                { label: t('footer.links.security'), href: "#" }
              ] },
              { title: t('footer.cols.resources'), links: [
                { label: t('footer.links.docs'), href: "#" },
                { label: t('footer.links.api'), href: "#" },
                { label: t('footer.links.community'), href: "#" },
                { label: t('footer.links.status'), href: "#" }
              ] },
              { title: t('footer.cols.company'), links: [
                { label: t('footer.links.about'), href: "#" },
                { label: t('footer.links.blog'), href: "#" },
                { label: t('nav.business'), onClick: () => { setView('bp'); window.scrollTo(0,0); } },
                { label: t('footer.links.careers'), href: "#" },
                { label: t('footer.links.legal'), href: "#" }
              ] },
            ].map((col, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link: any, j) => (
                    <li key={j}>
                      {link.onClick ? (
                        <button 
                          onClick={link.onClick} 
                          className={`text-sm font-medium transition-colors text-left ${mode === 'dark' ? 'text-gray-600 hover:text-white' : 'text-gray-500 hover:text-accent'}`}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a href={link.href} className={`text-sm font-medium transition-colors ${mode === 'dark' ? 'text-gray-600 hover:text-white' : 'text-gray-500 hover:text-accent'}`}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t text-[10px] font-bold uppercase tracking-widest ${mode === 'dark' ? 'border-white/5 text-gray-700' : 'border-gray-100 text-gray-400'}`}>
            <p>{t('footer.rights')}</p>
            <div className="flex gap-8">
              <a href="#" className={`transition-colors ${mode === 'dark' ? 'hover:text-white' : 'hover:text-accent'}`}>Twitter</a>
              <a href="#" className={`transition-colors ${mode === 'dark' ? 'hover:text-white' : 'hover:text-accent'}`}>GitHub</a>
              <a href="#" className={`transition-colors ${mode === 'dark' ? 'hover:text-white' : 'hover:text-accent'}`}>Discord</a>
            </div>
          </div>
        </footer>

        {/* Floating Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-2xl shadow-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 group ${
                mode === 'dark' 
                  ? 'bg-gray-900/90 text-white border-white/10 hover:border-accent hover:bg-accent hover:shadow-accent/20' 
                  : 'bg-white/90 text-gray-900 border-gray-200 hover:border-accent hover:bg-accent hover:text-white hover:shadow-accent/20'
              } backdrop-blur-md`}
              title={isZh ? "回到顶部" : "Back to Top"}
            >
              <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Live Pipeline Run Simulation Modal */}
        <AnimatePresence>
          {showLiveDemoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${
                  mode === 'dark' ? 'bg-gray-950 text-white border-white/10' : 'bg-gray-900 text-white border-gray-800'
                }`}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/20 text-accent">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-100">
                        {isZh ? "DevOps Hub 极速编译模拟器 v4.2" : "DevOps Hub Pipeline Simulator v4.2"}
                      </h3>
                      <p className="text-[11px] font-mono text-gray-400">
                        {isZh ? "目标平台: AAA Unreal5 / C++ Multi-Target" : "Target Platform: AAA Unreal5 / C++ Multi-Target"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLiveDemoModal(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 font-mono">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold flex items-center gap-2">
                        {liveDemoRunning ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                            <span>{isZh ? "正在执行分布式编译分发..." : "Executing Distributed Build..."}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">{isZh ? "编译发布任务完成！" : "Pipeline Completed Successfully!"}</span>
                          </>
                        )}
                      </span>
                      <span className="font-bold text-accent">{liveDemoProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-accent h-full rounded-full transition-all duration-300"
                        style={{ width: `${liveDemoProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Terminal Log Console */}
                  <div className="p-4 rounded-xl bg-black/90 border border-gray-800 text-xs text-gray-300 h-48 overflow-y-auto space-y-2 leading-relaxed">
                    {liveDemoLogs.map((log, index) => (
                      <p key={index} className={index === liveDemoLogs.length - 1 ? "text-accent font-bold" : "text-gray-300"}>
                        {log}
                      </p>
                    ))}
                  </div>

                  {/* Modal Footer CTAs */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="text-[11px] text-gray-400 font-sans">
                      {isZh ? "验证提速效果 15.4 倍，符合 SOC2 合规标准" : "15.4x Acceleration Verified with SOC2 SLA"}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartLiveDemo}
                        disabled={liveDemoRunning}
                        className="px-4 py-2.5 rounded-xl border border-gray-700 hover:bg-white/5 text-xs font-bold text-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isZh ? "重新模拟" : "Rerun Simulation"}
                      </button>
                      <button
                        onClick={() => {
                          setShowLiveDemoModal(false);
                          onEnter();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-accent/20 flex items-center gap-1.5"
                      >
                        <span>{isZh ? "进入 Studio 控制台" : "Open Studio Console"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
