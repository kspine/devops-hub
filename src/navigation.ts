import { 
  Terminal, ShieldCheck, Wrench, Workflow, Key, Cpu, FileText, LayoutGrid, Activity, Server, Package, Database, BookOpen, Users
} from "lucide-react";

export type PrimaryGroup = "dashboard" | "portfolio" | "designer" | "infra" | "architect" | "production" | "security";
export type ActiveTab = "dashboard" | "hub" | "workspaces" | "services" | "designer" | "logs" | "signing" | "troubleshooter" | "architect" | "production" | "sshKeys" | "telemetry" | "blueprints" | "runners" | "deployments" | "artifacts" | "knowledge" | "governance" | "quotas" | "projectDashboard" | "collaboration" | "extensibility" | "quality";

export const PRIMARY_GROUPS = [
  {
    id: "dashboard" as PrimaryGroup,
    labelEn: "Operations Control",
    labelZh: "全球构建大盘",
    icon: LayoutGrid,
    defaultTab: "dashboard" as ActiveTab
  },
  {
    id: "portfolio" as PrimaryGroup,
    labelEn: "Project Portfolio",
    labelZh: "项目治理枢纽",
    icon: LayoutGrid,
    defaultTab: "governance" as ActiveTab
  },
  {
    id: "designer" as PrimaryGroup,
    labelEn: "Pipeline Orchestration",
    labelZh: "持续集成流水线",
    icon: Workflow,
    defaultTab: "designer" as ActiveTab
  },
  {
    id: "infra" as PrimaryGroup,
    labelEn: "Observability & Logs",
    labelZh: "智能可观测诊断",
    icon: Wrench,
    defaultTab: "troubleshooter" as ActiveTab
  },
  {
    id: "architect" as PrimaryGroup,
    labelEn: "Build Script Architect",
    labelZh: "自动化脚本架构",
    icon: Cpu,
    defaultTab: "architect" as ActiveTab
  },
  {
    id: "production" as PrimaryGroup,
    labelEn: "CD Delivery & Artifacts",
    labelZh: "持续交付与分发",
    icon: Terminal,
    defaultTab: "production" as ActiveTab
  },
  {
    id: "security" as PrimaryGroup,
    labelEn: "Security & Credentials",
    labelZh: "安全签名与凭证",
    icon: ShieldCheck,
    defaultTab: "signing" as ActiveTab
  }
];

export const SECONDARY_TABS = {
  dashboard: [
    { id: "hub" as ActiveTab, labelEn: "DevOps Studio Hub", labelZh: "开发者枢纽", icon: LayoutGrid, shortcut: "Ctrl+0" },
    { id: "dashboard" as ActiveTab, labelEn: "Operations Dashboard", labelZh: "控制台概览", icon: LayoutGrid, shortcut: "Ctrl+1" },
    { id: "workspaces" as ActiveTab, labelEn: "Workspace Manager", labelZh: "工作空间管理", icon: Server, shortcut: "Ctrl+W" },
    { id: "services" as ActiveTab, labelEn: "Backend Integrations", labelZh: "后端服务集成", icon: Database, shortcut: "Ctrl+B" },
    { id: "knowledge" as ActiveTab, labelEn: "Knowledge Hub", labelZh: "知识与文档中心", icon: BookOpen, shortcut: "Ctrl+K" }
  ],
  portfolio: [
    { id: "projectDashboard" as ActiveTab, labelEn: "Project Dashboard", labelZh: "项目概览看板", icon: LayoutGrid, shortcut: "Ctrl+1" },
    { id: "governance" as ActiveTab, labelEn: "Project Governance", labelZh: "项目治理审计", icon: ShieldCheck, shortcut: "Ctrl+G" },
    { id: "collaboration" as ActiveTab, labelEn: "Team Collaboration", labelZh: "组织协作标准", icon: Users, shortcut: "Ctrl+U" },
    { id: "quotas" as ActiveTab, labelEn: "Resource Quotas", labelZh: "资源配额管理", icon: Server, shortcut: "Ctrl+Q" },
    { id: "workspaces" as ActiveTab, labelEn: "Workspace Manager", labelZh: "工作空间管理", icon: Server, shortcut: "Ctrl+W" },
  ],
  designer: [
    { id: "designer" as ActiveTab, labelEn: "Visual Pipeline Designer", labelZh: "可视化设计器", icon: Workflow, shortcut: "Ctrl+2" }
  ],
  infra: [
    { id: "troubleshooter" as ActiveTab, labelEn: "Smart Troubleshooter", labelZh: "AI 智能排错", icon: Wrench, shortcut: "Ctrl+3" },
    { id: "logs" as ActiveTab, labelEn: "Real-time Log Parser", labelZh: "构建日志分析", icon: FileText, shortcut: "Ctrl+L" },
    { id: "telemetry" as ActiveTab, labelEn: "Telemetry & Node Health", labelZh: "服务器遥测监控", icon: Activity, shortcut: "Ctrl+8" },
    { id: "runners" as ActiveTab, labelEn: "Runner Cluster Pools", labelZh: "集群节点池", icon: Server, shortcut: "Ctrl+0" },
  ],
  architect: [
    { id: "architect" as ActiveTab, labelEn: "AI Automation Script Hub", labelZh: "AI 构建脚本枢纽", icon: Cpu, shortcut: "Ctrl+4" },
    { id: "extensibility" as ActiveTab, labelEn: "Ecosystem & Plugins", labelZh: "工程生态扩展", icon: Package, shortcut: "Ctrl+E" },
    { id: "blueprints" as ActiveTab, labelEn: "Build Topology & Blueprints", labelZh: "分布式拓扑蓝图", icon: Workflow, shortcut: "Ctrl+9" },
  ],
  production: [
    { id: "production" as ActiveTab, labelEn: "Multi-Platform Distribution", labelZh: "多端交付分发套件", icon: Terminal, shortcut: "Ctrl+5" },
    { id: "artifacts" as ActiveTab, labelEn: "Enterprise Artifact Hub", labelZh: "企业级制品库", icon: Package, shortcut: "Ctrl+P" },
    { id: "deployments" as ActiveTab, labelEn: "Enterprise Deployment Center", labelZh: "企业级部署中心", icon: Server, shortcut: "Ctrl+D" },
    { id: "quality" as ActiveTab, labelEn: "Quality & Testability", labelZh: "工程质量标准", icon: ShieldCheck, shortcut: "Ctrl+T" },
  ],
  security: [
    { id: "signing" as ActiveTab, labelEn: "Code Signing & Compliance", labelZh: "包体签名与合规", icon: ShieldCheck, shortcut: "Ctrl+6" },
    { id: "sshKeys" as ActiveTab, labelEn: "SSH Cryptographic Vault", labelZh: "SSH 密码安全中心", icon: Key, shortcut: "Ctrl+7" },
  ]
};

export const getPrimaryGroupForTab = (tab: ActiveTab): PrimaryGroup => {
  for (const group of Object.keys(SECONDARY_TABS) as PrimaryGroup[]) {
    if (SECONDARY_TABS[group].some(t => t.id === tab)) {
      return group;
    }
  }
  return "dashboard";
};
