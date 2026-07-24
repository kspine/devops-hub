import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { PIPELINE_STEPS } from "../data";
import { BuildPlatform, CodeType, GeneratedCode } from "../types";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";
import { motion, AnimatePresence } from "motion/react";
import ArtifactGallery from "./ArtifactGallery";
import PipelinePresets from "./PipelinePresets";
import {
  TEAMCITY_TEMPLATE,
  PERFORCE_TEMPLATE,
  GITLAB_TEMPLATE_UNREAL,
  BITBUCKET_TEMPLATE_UNREAL,
  CIRCLECI_TEMPLATE_UNREAL,
  GITHUB_TEMPLATE_UNREAL,
  GITLAB_TEMPLATE,
  BITBUCKET_TEMPLATE,
  CIRCLECI_TEMPLATE,
  COMPARE_PRESETS
} from "./PipelineTemplates";
import KanbanView, { KanbanJob } from "./KanbanView";
import ConfigView from "./ConfigView";
import TemplateGallery from "./TemplateGallery";
import PipelineOnboarding from "./PipelineOnboarding";

export interface PipelineSchedule {
  id: string;
  name: string;
  platform: string;
  triggerType: "cron" | "interval";
  value: string;
}

export const DEFAULT_SCHEDULES: PipelineSchedule[] = [
  {
    id: "sch-1",
    name: "Nightly Beta Delivery",
    platform: "android",
    triggerType: "cron",
    value: "0 2 * * *"
  },
  {
    id: "sch-2",
    name: "Hourly WebGL Diagnostics",
    platform: "webgl",
    triggerType: "interval",
    value: "every 60 minutes"
  }
];
import { 
  Smartphone, 
  Globe, 
  Monitor, 
  Check, 
  Copy, 
  Cpu, 
  RefreshCw, 
  FileCode, 
  FileText,
  Info,
  Download,
  HelpCircle,
  LayoutGrid,
  ArrowRight,
  GripVertical,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Sliders,
  Package,
  Layout,
  Zap,
  Bell,
  Activity,
  AlertTriangle,
  X,
  Terminal,
  Key,
  Workflow,
  Layers,
  Github,
  Play
} from "lucide-react";
import UnrealPipelineEditor from "./UnrealPipelineEditor";
import GithubSyncModal from "./pipeline/GithubSyncModal";
import SimulationSandboxModal from "./pipeline/SimulationSandboxModal";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function PipelineBuilder() {
  const { activeWorkspace, activeWorkspaceId, updateWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const setProjectType = (type: any) => {
    if (activeWorkspaceId) updateWorkspace(activeWorkspaceId, { projectType: type });
  };
  const [platform, setPlatform] = useState<BuildPlatform>(
    projectType === "web" ? "web" : 
    projectType === "mobile" ? "android" : 
    projectType === "backend" ? "linux" : "android"
  );
  const [enabledSteps, setEnabledSteps] = useState<string[]>(
    PIPELINE_STEPS.filter(s => s.enabled && s.requiredFor.includes("android") && s.engines?.includes(projectType)).map(s => s.id)
  );
  
  const [generatedCodes, setGeneratedCodes] = useState<Record<CodeType, GeneratedCode> | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<CodeType>(
    projectType === "unity" ? "csharp" : 
    projectType === "unreal" ? "cpp" :
    projectType === "web" || projectType === "backend" ? "docker" : "jenkins"
  );
  
  useEffect(() => {
    // Switch default tab and platform when engine changes
    setActiveCodeTab(
      projectType === "unity" ? "csharp" : 
      projectType === "unreal" ? "cpp" :
      projectType === "web" || projectType === "backend" ? "docker" : "jenkins"
    );

    setPlatform(
      projectType === "web" ? "web" : 
      projectType === "mobile" ? "android" : 
      projectType === "backend" ? "docker" : "android"
    );
    
    // Reset enabled steps to defaults for this engine and current platform
    const defaultEnabled = PIPELINE_STEPS.filter(s => 
      s.enabled && s.requiredFor.includes(platform) && s.engines?.includes(projectType)
    ).map(s => s.id);
    
    setEnabledSteps(defaultEnabled);
    
    // Refresh pipeline data
    fetchPipeline(platform, defaultEnabled);
  }, [projectType]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { language, t } = useLanguage();
  const isZh = language === "zh";

  // Reordering steps states
  const [orderedStepIds, setOrderedStepIds] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Smart Estimator assets count state
  const [assetCount, setAssetCount] = useState<number>(1800);

  // Pipeline Schedule component states
  const [schedules, setSchedules] = useState<PipelineSchedule[]>([]);
  const [schName, setSchName] = useState("");
  const [schPlatform, setSchPlatform] = useState("android");
  const [schTriggerType, setSchTriggerType] = useState<"cron" | "interval">("cron");
  const [schValue, setSchValue] = useState("0 2 * * *");

  // Webhook notification states
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookType, setWebhookType] = useState<"slack" | "discord" | "teams">("slack");
  const [webhookChannel, setWebhookChannel] = useState("#build-notifications");
  const [leftTab, setLeftTab] = useState<"builder" | "schedules" | "notifications" | "envsync" | "terraform">("builder");
  const [terraformProvider, setTerraformProvider] = useState<"aws" | "gcp" | "azure">("aws");
  const [terraformClusterName, setTerraformClusterName] = useState("devops-hub-runner-cluster");
  const [terraformMinNodes, setTerraformMinNodes] = useState(2);
  const [terraformMaxNodes, setTerraformMaxNodes] = useState(8);
  const [terraformInstanceType, setTerraformInstanceType] = useState("c6i.xlarge");
  const [webhookLogs, setWebhookLogs] = useState<{ time: string; text: string; type: "slack" | "discord" | "teams" }[]>([]);

  // Cloud Account Linker states
  const [cloudAccounts, setCloudAccounts] = useState<Array<{
    id: string;
    provider: "aws" | "gcp" | "azure";
    name: string;
    regionOrProject: string;
    accessKeyOrClientId: string;
    secretKeyOrClientSecret: string;
    active: boolean;
  }>>([
    {
      id: "acc-1",
      provider: "aws",
      name: "AWS-Production-IAM",
      regionOrProject: "us-west-2",
      accessKeyOrClientId: "AKIAIOSFODNN7EXAMPLE",
      secretKeyOrClientSecret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      active: true
    },
    {
      id: "acc-2",
      provider: "gcp",
      name: "GCP-CI-CD-ServiceAccount",
      regionOrProject: "devops-hub-management-platform",
      accessKeyOrClientId: "devops-hub-terraform-sa@devops-hub.iam.gserviceaccount.com",
      secretKeyOrClientSecret: "{\n  \"type\": \"service_account\",\n  \"project_id\": \"devops-hub-management-platform\"\n}",
      active: false
    }
  ]);

  const [newAccName, setNewAccName] = useState("");
  const [newAccProvider, setNewAccProvider] = useState<"aws" | "gcp" | "azure">("aws");
  const [newAccRegionOrProj, setNewAccRegionOrProj] = useState("");
  const [newAccKeyId, setNewAccKeyId] = useState("");
  const [newAccSecret, setNewAccSecret] = useState("");
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  // Pipeline Top Mode: "builder" (original editor), "kanban" (live dashboard), "config" (global properties)
  const [activeMode, setActiveMode] = useState<"builder" | "kanban" | "config">("builder");

  // Kanban stateful tasks
  const [kanbanJobs, setKanbanJobs] = useState<KanbanJob[]>([
    {
      id: "job-101",
      name: "Nightly WebGL Alpha-3 Build",
      platform: "webgl",
      projectType: "unity",
      status: "succeeded",
      progress: 100,
      duration: 184,
      startedAt: "10 mins ago"
    },
    {
      id: "job-102",
      name: "Android Production APK Cook & Pack",
      platform: "android",
      projectType: "unity",
      status: "running",
      progress: 45,
      duration: 125,
      startedAt: "3 mins ago"
    },
    {
      id: "job-103",
      name: "iOS AppStore Cert Integration",
      platform: "ios",
      projectType: "unity",
      status: "queued",
      progress: 0,
      duration: 0,
      startedAt: "Just now"
    },
    {
      id: "job-104",
      name: "Win64 Unreal Server Shipping Pack",
      platform: "windows",
      projectType: "unreal",
      status: "failed",
      progress: 82,
      duration: 310,
      startedAt: "1 hour ago"
    }
  ]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showLogConsole, setShowLogConsole] = useState(false);

  // Configuration management states
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string; isSecret: boolean }>>([
    { key: "UE_ROOT", value: "C:\\Program Files\\Epic Games\\UE_5.3", isSecret: false },
    { key: "UNITY_PATH", value: "/Applications/Unity/Hub/Editor/2022.3.15f1", isSecret: false },
    { key: "SIGNING_KEY_PASS", value: "••••••••••••••••", isSecret: true },
    { key: "STEAM_SDK_VER", value: "1.57", isSecret: false }
  ]);
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvVal, setNewEnvVal] = useState("");
  const [newEnvSecret, setNewEnvSecret] = useState(false);

  const [cacheSettings, setCacheSettings] = useState({
    enableDDC: true,
    enableUnityCache: true,
    precompileShaders: true,
    cleanWorkspaceMode: "increment"
  });

  const [pipelineHooks, setPipelineHooks] = useState({
    preCompile: "echo \"Syncing static resources & localized text...\"\nnode scripts/sync_resources.js",
    postCompile: "echo \"Deploying compressed archives to storage server...\"\npython scripts/upload_artifacts.py"
  });

  const [resourceLimits, setResourceLimits] = useState({
    maxConcurrentRunners: 4,
    maxRamAllocation: 16,
    maxDiskQuota: 100,
    artifactRetentionDays: 14
  });

  const [codeQualityGate, setCodeQualityGate] = useState(false);
  
  // Simulated live progressive builds
  useEffect(() => {
    const interval = setInterval(() => {
      setKanbanJobs(prevJobs => prevJobs.map(job => {
        if (job.status === "running") {
          const nextProgress = job.progress + Math.floor(Math.random() * 8) + 2;
          if (nextProgress >= 100) {
            return {
              ...job,
              progress: 100,
              status: "succeeded",
              duration: job.duration + Math.floor(Math.random() * 15)
            };
          } else {
            return {
              ...job,
              progress: nextProgress,
              duration: job.duration + 2
            };
          }
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getJobLogLines = (job: typeof kanbanJobs[0]) => {
    const lines = [
      `[${job.startedAt}] [INFO] Initializing runner environment for agent-${job.id.substring(4)}...`,
      `[${job.startedAt}] [INFO] Working CWD set to /var/lib/runner/workspaces/${job.projectType === "unity" ? "UnityGame" : "UnrealGame"}`,
      `[${job.startedAt}] [INFO] Syncing source files from VCS depot (HEAD revision)...`,
      `[${job.startedAt}] [INFO] Sync completed in 14.5 seconds. Code is up-to-date.`,
      `[${job.startedAt}] [INFO] Starting build orchestration for target platform: ${job.platform.toUpperCase()}`,
    ];

    if (job.status === "queued") {
      lines.push(`[${job.startedAt}] [WARN] Waiting in execution queue. 1 engine resource ahead of this job.`);
      return lines;
    }

    if (job.projectType === "unity") {
      lines.push(
        `[INFO] Invoking Unity executable: ${envVars.find(e => e.key === "UNITY_PATH")?.value || "Unity"}`,
        `[INFO] CommandLine args: -batchmode -quit -projectPath . -executeMethod BuildScript.PerformBuild -buildTarget ${job.platform}`,
        `[COMPILING] Resolving assembly dependencies via MSBuild/Roslyn...`,
        `[COMPILING] Compiling C# Scripts (Assembly-CSharp.dll)...`,
        `[COMPILING] Generated Assembly-CSharp.dll successfully.`
      );
      if (job.status === "running") {
        const stepIndex = Math.floor(job.progress / 20);
        if (stepIndex >= 1) lines.push(`[COOKING] Processing scene asset bundle index 0 to 45...`);
        if (stepIndex >= 2) lines.push(`[COOKING] Compression format: LZ4. Texture packing started.`);
        if (stepIndex >= 3) lines.push(`[OPTIMIZING] Stripping unused bytecode and assemblies (IL2CPP compilation)...`);
        if (stepIndex >= 4) lines.push(`[PACKING] Finalizing APK/WebGL package bundle...`);
        lines.push(`[RUNNING] Current build operation progress: ${job.progress}%`);
      } else if (job.status === "succeeded") {
        lines.push(
          `[COOKING] Processing scene asset bundle index 0 to 45...`,
          `[COOKING] Compression format: LZ4. Texture packing completed.`,
          `[OPTIMIZING] Stripping unused bytecode and assemblies (IL2CPP compilation)...`,
          `[PACKING] Finalizing APK/WebGL package bundle...`,
          `[POST-BUILD] Triggering Automation Hook...`,
          `[HOOK] ` + pipelineHooks.postCompile.split("\n")[0],
          `[SUCCESS] Build compiled, certified, and packaged in ${job.duration}s.`,
          `[SUCCESS] Artifacts archived: build/${job.platform}/${job.name.replace(/\s+/g, "_")}.zip`
        );
      } else if (job.status === "failed") {
        lines.push(
          `[COOKING] Processing scene asset bundle index 0 to 45...`,
          `[ERROR] IL2CPP compilation failed: Assembly-CSharp.dll has unresolved reference to Steamworks.NET`,
          `[ERROR] Did you enable the STEAM_SDK define without linking Steamworks.NET package?`,
          `[FATAL] Build failed with exit code 1. See build-diagnostics-report.log for detailed stacktrace.`
        );
      }
    } else {
      lines.push(
        `[INFO] Invoking Unreal Automation Tool: ${envVars.find(e => e.key === "UE_ROOT")?.value || "UnrealEngine"}/Engine/Build/BatchFiles/RunUAT.bat`,
        `[INFO] CommandLine args: BuildCookRun -project=MyGame.uproject -platform=${job.platform} -cook -stage -archive`,
        `[COMPILING] Executing UnrealBuildTool (UBT) for Win64/Mac targets...`,
        `[COMPILING] Compiling 245 modules (Engine & Game modules)...`
      );
      if (job.status === "running") {
        const stepIndex = Math.floor(job.progress / 20);
        if (stepIndex >= 1) lines.push(`[COOKING] Cooking game content for ${job.platform}... (Shaders, Textures, Meshes)`);
        if (stepIndex >= 2) lines.push(`[COOKING] Shader Compiler: compiled 1024/4096 global shaders (8 workers active)`);
        if (stepIndex >= 3) lines.push(`[STAGE] Creating file system layout in Saved/StagedBuilds...`);
        if (stepIndex >= 4) lines.push(`[PACK] Building PAK file (Saved/StagedBuilds/WindowsNoEditor/MyGame/Content/Paks/MyGame-WindowsNoEditor.pak)...`);
        lines.push(`[RUNNING] Current build operation progress: ${job.progress}%`);
      } else if (job.status === "succeeded") {
        lines.push(
          `[COOKING] Cooking game content for ${job.platform}... (Shaders, Textures, Meshes)`,
          `[COOKING] Shader Compiler: compiled 4096/4096 global shaders successfully.`,
          `[STAGE] Creating file system layout in Saved/StagedBuilds...`,
          `[PACK] Building PAK file completed. File size: 4.82 GB.`,
          `[POST-BUILD] Triggering Automation Hook...`,
          `[HOOK] ` + pipelineHooks.postCompile.split("\n")[0],
          `[SUCCESS] Unreal package generated in ${job.duration}s.`,
          `[SUCCESS] Package saved to: Saved/Archives/${job.platform}/MyGame`
        );
      } else if (job.status === "failed") {
        lines.push(
          `[COOKING] Cooking game content for ${job.platform}... (Shaders, Textures, Meshes)`,
          `[FATAL] Shader compiler crashed! Unhandled exception: out of video/system memory.`,
          `[FATAL] Try increasing maxConcurrentRunners memory buffer in Global Configurations or increasing RAM quota limit.`
        );
      }
    }
    return lines;
  };
  
  // Environment Sync & Config Drift states
  const [referenceEnv, setReferenceEnv] = useState("gold-reference");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncAligned, setIsSyncAligned] = useState(false);
  const [syncOutputLogs, setSyncOutputLogs] = useState<string[]>([]);
  
  const [complexityData] = useState([
    { complexity: 10, time: 5, name: 'Small Project' },
    { complexity: 25, time: 12, name: 'Asset Pack' },
    { complexity: 45, time: 18, name: 'Core Engine' },
    { complexity: 60, time: 35, name: 'Level A' },
    { complexity: 75, time: 42, name: 'Level B' },
    { complexity: 90, time: 85, name: 'Full Build' },
    { complexity: 30, time: 15, name: 'UI Module' },
    { complexity: 55, time: 28, name: 'Physics Overhaul' },
    { complexity: 80, time: 55, name: 'Character System' },
    { complexity: 100, time: 120, name: 'Final Release' },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    failures: true,
    health: false,
    spikes: true
  });

  // Build failure thresholds states
  const [consecutiveFailures, setConsecutiveFailures] = useState(2);
  const [testFailureRate, setTestFailureRate] = useState(10);
  const [warningThreshold, setWarningThreshold] = useState(50);
  const [alertChannels, setAlertChannels] = useState({
    toast: true,
    desktop: true,
    sound: false
  });

  // Diff Compare states
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareLeftId, setCompareLeftId] = useState("android");
  const [compareRightId, setCompareRightId] = useState("ios");

  // GitHub Sync states
  const [isGithubSyncOpen, setIsGithubSyncOpen] = useState(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "connecting" | "pushing" | "done">("idle");
  const [githubRepoName, setGithubRepoName] = useState("my-game-devops-actions");

  // Simulation states
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [activeSimStepIdx, setActiveSimStepIdx] = useState(-1);
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [simElapsedTime, setSimElapsedTime] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simSteps, setSimSteps] = useState<any[]>([]);

  // Simulation refs to safely clear timers
  const simTimeoutRef = useRef<any>(null);
  const simIntervalRef = useRef<any>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    const term = document.getElementById("sim-terminal");
    if (term) {
      term.scrollTop = term.scrollHeight;
    }
  }, [simLogs]);

  // Cleanup simulation timers on unmount
  useEffect(() => {
    return () => {
      if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  // Real-time Validation rules
  const getStepValidationError = (stepId: string): string | null => {
    // Only validate enabled steps
    if (!enabledSteps.includes(stepId)) return null;

    // Rule 1: 'fetch' is the first step.
    if (stepId === "checkout" && !enabledSteps.includes("fetch")) {
      return isZh 
        ? "缺失先决条件：需要开启“获取源代码”步骤以定位本地或远程仓库。" 
        : "Missing prerequisite: 'Fetch Source' must be enabled to resolve checkout workspace.";
    }

    // Rule 2: Setup requires fetch and checkout
    if (stepId === "setup" && (!enabledSteps.includes("fetch") || !enabledSteps.includes("checkout"))) {
      return isZh
        ? "缺失先决条件：需要先启用并配置“获取源代码”与“检出版本号”步骤。"
        : "Missing prerequisite: 'Fetch Source' and 'Checkout Version' must be enabled before environment configuration.";
    }

    // Rule 3: Compiler steps (unity_build, cook, web_build, etc.) require Setup to be enabled
    if (stepId === "unity_build" && !enabledSteps.includes("setup")) {
      return isZh
        ? "缺失先决条件：需要开启“构建环境初始化”以配置 Unity 运行环境变量与编译器路径。"
        : "Missing prerequisite: 'Setup Environment' must be enabled first to configure compilers.";
    }
    if (stepId === "build" && !enabledSteps.includes("setup")) {
      return isZh
        ? "缺失先决条件：需要开启“构建环境初始化”以指定 Unreal UBT 编译器路径。"
        : "Missing prerequisite: 'Setup Environment' must be enabled first to locate Unreal Build Tool (UBT).";
    }
    if (stepId === "web_build" && !enabledSteps.includes("npm_install")) {
      return isZh
        ? "缺失先决条件：需要先启用“安装依赖 (NPM)”步骤，否则编译打包将因缺少依赖库失败。"
        : "Missing prerequisite: 'NPM Install' must be enabled before production-grade compilation.";
    }

    // Rule 4: Dockerize requires backend compilation
    if (stepId === "docker_build" && !enabledSteps.includes("backend_compile")) {
      return isZh
        ? "缺失先决条件：需要开启“后端程序编译”步骤以获得可装箱的二进制目标文件。"
        : "Missing prerequisite: 'Backend Compilation' must be enabled before containerization.";
    }

    // Rule 5: Deploy steps require packaging/compiling steps
    if (stepId === "k8s_deploy" && !enabledSteps.includes("docker_build")) {
      return isZh
        ? "缺失先决条件：需要开启“容器化 (Docker Build)”步骤以推送最新的镜像产物。"
        : "Missing prerequisite: 'Dockerize' must be enabled before deploying to Kubernetes cluster.";
    }

    // Rule 6: Code Signing requires active compiler steps
    if (stepId === "sign_package") {
      const compilationSteps = ["unity_build", "package", "web_build", "flutter_build", "backend_compile"];
      const hasCompilation = enabledSteps.some(id => compilationSteps.includes(id));
      if (!hasCompilation) {
        return isZh
          ? "缺失先决条件：没有启用的编译生成步骤。签名程序没有可签署的包体产物。"
          : "Missing prerequisite: No compilation or player build step is enabled to generate signed binaries.";
      }
      
      // Check active cloud accounts
      const activeCredential = cloudAccounts.find(acc => acc.provider === terraformProvider && acc.active);
      if (!activeCredential) {
        return isZh
          ? "缺少必要配置：在当前选定的云提供商下未找到激活的云凭证账户 (IAM Vault)。"
          : "Missing configuration input: No active cloud credentials linked for current provider in IAM Vault.";
      }
    }

    // Rule 7: Store Upload requires Signing
    if (stepId === "store_upload" && !enabledSteps.includes("sign_package")) {
      return isZh
        ? "配置警告：上传商店包体必须先启用“代码签名与包体打包”步骤，未签名的包体将被商店直接拒收。"
        : "Missing required configuration input: App Stores will reject unsigned builds. Enable 'Code Signing & Packaging'.";
    }

    // Rule 8: Webhook Notification requires Webhook Enabled
    if (stepId === "notify" && !webhookEnabled) {
      return isZh
        ? "缺少必要配置：通知步骤已启用，但通知全局总开关未开启。请在“定时计划与通知”选项卡中启用 Webhook。"
        : "Missing required configuration input: 'Notify Slack/Teams' is active but Webhook integration is disabled. Toggle Webhook in 'Schedules & alerts' tab.";
    }

    return null;
  };

  // GitHub Actions workflow generator
  const generateGitHubActionsWorkflowYaml = () => {
    const activeSteps = orderedStepIds.filter(id => enabledSteps.includes(id));
    let stepsYaml = "";
    
    if (activeSteps.includes("fetch")) {
      stepsYaml += `      - name: Fetch Source Code (Checkout)
        uses: actions/checkout@v4
        with:
          lfs: true
          fetch-depth: 0\n\n`;
    }
    
    if (activeSteps.includes("checkout")) {
      stepsYaml += `      - name: Checkout Targeted Branch
        run: |
          echo "Checking out targeted ref: \${{ github.ref }}"
          git checkout \${{ github.sha }}\n\n`;
    }
    
    if (activeSteps.includes("setup")) {
      if (projectType === "unity") {
        stepsYaml += `      - name: Setup Unity Environment
        uses: game-ci/unity-request-activation-file@v2
        env:
          UNITY_EMAIL: \${{ secrets.UNITY_EMAIL }}
          UNITY_PASSWORD: \${{ secrets.UNITY_PASSWORD }}
          UNITY_SERIAL: \${{ secrets.UNITY_SERIAL }}\n\n`;
      } else if (projectType === "unreal") {
        stepsYaml += `      - name: Locate Unreal Build Tool (UBT)
        run: |
          echo "Locating Unreal Engine SDK installations..."
          # Set up paths to RunUAT.bat / RunUAT.sh\n\n`;
      } else if (projectType === "web") {
        stepsYaml += `      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'\n\n`;
      } else if (projectType === "mobile") {
        stepsYaml += `      - name: Setup Flutter Toolchain
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true\n\n`;
      } else {
        stepsYaml += `      - name: Setup Toolchain & SDKs
        run: echo "Initializing environment compilers..."\n\n`;
      }
    }
    
    if (activeSteps.includes("clean")) {
      if (projectType === "unity") {
        stepsYaml += `      - name: Clean Unity Caches & Outputs
        run: |
          rm -rf Library/
          rm -rf Temp/
          rm -rf Builds/\n\n`;
      } else if (projectType === "unreal") {
        stepsYaml += `      - name: Clean Unreal Build Folders
        run: |
          rm -rf Binaries/
          rm -rf Intermediate/
          rm -rf Saved/\n\n`;
      } else {
        stepsYaml += `      - name: Clean Outputs & Workspace
        run: rm -rf dist/ build/ out/\n\n`;
      }
    }
    
    if (activeSteps.includes("npm_install")) {
      stepsYaml += `      - name: Install Project Dependencies (NPM)
        run: npm ci\n\n`;
    }
    
    if (activeSteps.includes("addressables")) {
      stepsYaml += `      - name: Build Unity Addressables
        uses: game-ci/unity-builder@v4
        env:
          UNITY_LICENSE: \${{ secrets.UNITY_LICENSE }}
        with:
          projectPath: .
          buildMethod: BuildScript.BuildAddressables\n\n`;
    }
    
    if (activeSteps.includes("prebuild_script")) {
      stepsYaml += `      - name: Run Pre-build Code Hooks
        run: |
          echo "Updating build identifiers and assembly numbers..."\n\n`;
    }
    
    if (activeSteps.includes("unity_build")) {
      stepsYaml += `      - name: Compile Unity Player Client
        uses: game-ci/unity-builder@v4
        env:
          UNITY_LICENSE: \${{ secrets.UNITY_LICENSE }}
        with:
          projectPath: .
          targetPlatform: ${platform === 'android' ? 'Android' : platform === 'ios' ? 'iOS' : platform === 'webgl' ? 'WebGL' : 'StandaloneWindows64'}
          buildMethod: GameBuilder.Build\n\n`;
    }
    
    if (activeSteps.includes("build") && projectType === "unreal") {
      stepsYaml += `      - name: Compile Unreal Binaries & Game Modules
        run: |
          RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=${platform === 'android' ? 'Android' : platform === 'ios' ? 'IOS' : 'Win64'} -clientconfig=Development -build\n\n`;
    }
    
    if (activeSteps.includes("cook") && projectType === "unreal") {
      stepsYaml += `      - name: Cook Unreal Content Assets
        run: |
          RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=${platform === 'android' ? 'Android' : platform === 'ios' ? 'IOS' : 'Win64'} -cook -stage\n\n`;
    }
    
    if (activeSteps.includes("package") && projectType === "unreal") {
      stepsYaml += `      - name: Package Cooked Build (Unreal UAT)
        run: |
          RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=${platform === 'android' ? 'Android' : platform === 'ios' ? 'IOS' : 'Win64'} -pak -stage -package\n\n`;
    }
    
    if (activeSteps.includes("postprocess_xcode") && platform === "ios") {
      stepsYaml += `      - name: Run Xcode Postprocessing
        run: |
          echo "Configuring entitlements and framework search paths..."\n\n`;
    }
    
    if (activeSteps.includes("sign_package")) {
      if (platform === "android") {
        stepsYaml += `      - name: Cryptographic Signing (Android Keystore)
        uses: r0adkll/sign-android-release@v1
        with:
          releaseDirectory: Builds/android
          signingKeyBase64: \${{ secrets.ANDROID_SIGNING_KEY }}
          alias: \${{ secrets.ANDROID_ALIAS }}
          keyStorePassword: \${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          keyPassword: \${{ secrets.ANDROID_KEY_PASSWORD }}\n\n`;
      } else if (platform === "ios") {
        stepsYaml += `      - name: Cryptographic Signing (iOS Apple Provisioning)
        uses: apple-actions/import-codesign-certs@v2
        with:
          p12-file-base64: \${{ secrets.IOS_SIGNING_CERT }}
          p12-password: \${{ secrets.IOS_SIGNING_PASSWORD }}\n\n`;
      } else {
        stepsYaml += `      - name: Cryptographic Binary Signing
        run: echo "Applying code signatures to executable target..."\n\n`;
      }
    }
    
    if (activeSteps.includes("store_upload")) {
      if (platform === "android") {
        stepsYaml += `      - name: Publish to Google Play (Internal Testing Track)
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_STORE_JSON_KEY }}
          packageName: com.devops.game
          releaseFiles: Builds/android/*.aab
          track: internal\n\n`;
      } else if (platform === "ios") {
        stepsYaml += `      - name: Publish to Apple App Store (TestFlight)
        uses: apple-actions/upload-testflight-build@v1
        with:
          app-path: Builds/ios/BuildGame.ipa
          apple-id: \${{ secrets.APPLE_ID }}
          password: \${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}\n\n`;
      } else {
        stepsYaml += `      - name: Distribute Artifact Binaries
        uses: actions/upload-artifact@v4
        with:
          name: packaged-client-binaries
          path: Builds/${platform}/\n\n`;
      }
    }
    
    if (activeSteps.includes("quality_check")) {
      stepsYaml += `      - name: Run Code Static Analysis Quality Gate
        run: |
          echo "Executing Clang-Format, Cppcheck & ESLint checks..."
          # npm run lint or clang-format -n src/*.cpp\n\n`;
    }
    
    if (activeSteps.includes("notify")) {
      stepsYaml += `      - name: Dispatch Slack Notifications
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_MESSAGE: "Build Successful for \${{ github.repository }} - \${{ github.sha }}"\n`;
    }
    
    const runnerOs = platform === "ios" ? "macos-latest" : "ubuntu-latest";
    
    return `name: DevOps Hub Studio CI/CD Workflow

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

env:
  PROJECT_TYPE: ${projectType}
  BUILD_PLATFORM: ${platform}
  TARGET_ENV: ${targetEnv}

jobs:
  build:
    name: Build, Package & Distribute (${platform.toUpperCase()})
    runs-on: ${runnerOs}
    
    steps:
${stepsYaml}`;
  };

  // Simulated run logic
  const startPipelineSimulation = () => {
    // Clear any existing simulation timers before starting a new run
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    setIsSimRunning(true);
    setActiveSimStepIdx(0);
    setSimElapsedTime(0);
    setSimLogs([`[INFO] Starting visual pipeline run simulation...`]);

    const activeSteps = orderedStepIds.filter(id => enabledSteps.includes(id));
    const stepObjects = activeSteps.map(id => {
      const stepData = PIPELINE_STEPS.find(s => s.id === id);
      return {
        id,
        name: language === "en" ? stepData?.nameEn : stepData?.nameZh,
        status: "queued" as const,
        duration: id === "clean" ? 30 : id === "addressables" ? 60 : id === "prebuild_script" ? 15 : id === "unity_build" ? 120 : id === "cook" ? 200 : id === "package" ? 150 : id === "postprocess_xcode" ? 45 : id === "sign_package" ? 40 : id === "store_upload" ? 90 : id === "quality_check" ? 45 : 10
      };
    });

    setSimSteps(stepObjects);

    let currentStepIdx = 0;
    setSimLogs(prev => [...prev, `[INFO] Queued ${stepObjects.length} active tasks.`]);

    const runNextStep = () => {
      if (currentStepIdx >= stepObjects.length) {
        setIsSimRunning(false);
        setSimLogs(prev => [...prev, `[SUCCESS] 🚀 ALL PIPELINE STEPS EXECUTED SUCCESSFULLY!`, `[SUCCESS] Deployment package is ready for distribution.`]);
        window.dispatchEvent(new Event("trigger-confetti"));
        return;
      }

      setActiveSimStepIdx(currentStepIdx);
      
      // Mark current step as running
      setSimSteps(prev => prev.map((step, idx) => {
        if (idx === currentStepIdx) return { ...step, status: "running" };
        return step;
      }));

      const step = stepObjects[currentStepIdx];
      setSimLogs(prev => [...prev, `[RUNNING] Starting step: ${step.name}...`]);

      // Generate step logs
      const logsForStep = getLogsForStepId(step.id);
      let logLineIdx = 0;

      const logInterval = setInterval(() => {
        if (logLineIdx < logsForStep.length) {
          setSimLogs(prev => [...prev, logsForStep[logLineIdx]]);
          logLineIdx++;
        }
      }, 350);
      simIntervalRef.current = logInterval;

      const stepTimeout = setTimeout(() => {
        clearInterval(logInterval);
        // Mark current step as succeeded
        setSimSteps(prev => prev.map((s, idx) => {
          if (idx === currentStepIdx) return { ...s, status: "succeeded" };
          return s;
        }));
        setSimLogs(prev => [...prev, `[SUCCESS] Step ${step.name} completed in ${step.duration}s.`]);
        setSimElapsedTime(prev => prev + step.duration);

        currentStepIdx++;
        runNextStep();
      }, 2500); // fixed simulated duration per step for animation
      simTimeoutRef.current = stepTimeout;
    };

    const initTimeout = setTimeout(() => {
      runNextStep();
    }, 1000);
    simTimeoutRef.current = initTimeout;
  };

  const triggerSimulation = () => {
    // Stop running simulation
    setIsSimRunning(false);
    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    
    setActiveSimStepIdx(-1);
    setSimLogs([]);
    setSimSteps([]);
    setTimeout(() => {
      startPipelineSimulation();
    }, 150);
  };

  const getLogsForStepId = (id: string): string[] => {
    switch (id) {
      case "fetch":
        return [
          `[GIT] git init /var/lib/runner/workspace`,
          `[GIT] git remote add origin https://github.com/company/game.git`,
          `[GIT] git fetch origin --tags --progress`,
          `[GIT] Fetch complete. 182 files analyzed.`
        ];
      case "checkout":
        return [
          `[GIT] git reset --hard HEAD`,
          `[GIT] HEAD is now at a3f4bc7 Update pipeline configurations`
        ];
      case "setup":
        return [
          `[ENV] Checking compiler toolchain versions...`,
          `[ENV] Setting paths: PROJECT_ROOT=${projectType.toUpperCase()}_WORKSPACE`,
          `[ENV] Environment verification completed.`
        ];
      case "clean":
        return [
          `[CLEAN] Purging output intermediate artifacts...`,
          `[CLEAN] Deleted 1,284 directory clusters.`
        ];
      case "npm_install":
        return [
          `[NPM] npm ci --prefer-offline`,
          `[NPM] Added 847 packages from repository cache.`,
          `[NPM] Done in 1.8 seconds.`
        ];
      case "addressables":
        return [
          `[UNITY] Executing Addressable Content Compilation...`,
          `[UNITY] Content catalog written to ServerData/WebGL/catalog.json`,
          `[UNITY] Asset Bundles packed: 8 files generated.`
        ];
      case "prebuild_script":
        return [
          `[HOOK] Launching static version-incrementor class...`,
          `[HOOK] Version adjusted to: 1.0.283. Build timestamp: ${new Date().toISOString().substring(0, 10)}`
        ];
      case "unity_build":
        return [
          `[UNITY] Starting compilation in headless batchmode...`,
          `[UNITY] Asset dependency database synced.`,
          `[UNITY] Compiling visual shaders (GLES3 / Metal)...`,
          `[UNITY] Standard standalone package built successfully.`
        ];
      case "build":
        return [
          `[UNREAL] Summoning Unreal Build Tool (UBT)...`,
          `[UNREAL] Compiling native source modules...`,
          `[UNREAL] PDB debugging symbols generated.`
        ];
      case "cook":
        return [
          `[UNREAL] Cooking level assets for ${platform.toUpperCase()}...`,
          `[UNREAL] Shader Model 5.0 compilation: 2048 shaders baked.`
        ];
      case "package":
        return [
          `[UNREAL] Creating PAK file distribution layouts...`,
          `[UNREAL] Packed 5.4GB assets into single archive.`
        ];
      case "postprocess_xcode":
        return [
          `[XCODE] Injecting bundle frameworks to Info.plist...`,
          `[XCODE] Xcode target PBXProject updated.`
        ];
      case "sign_package":
        return [
          `[SIGN] Securing distribution credentials...`,
          `[SIGN] Applying SHA-256 cryptographic RSA signatures...`
        ];
      case "store_upload":
        return [
          `[DEPLOY] Uploading distribution bundle to target store...`,
          `[DEPLOY] Transferred 48.2MB chunks to testing track...`,
          `[DEPLOY] Play Console Internal Track Status: Active`
        ];
      case "quality_check":
        return [
          `[TEST] Invoking Clang-Format and ESLint test suites...`,
          `[TEST] Unit Tests run: 48 passed, 0 failed.`,
          `[TEST] Static coverage threshold: 92.4% (PASS).`
        ];
      case "notify":
        return [
          `[NOTIFY] Dispatching webhook payload to configured integration...`,
          `[NOTIFY] Slack API returned HTTP 200 OK. Notification sent!`
        ];
      default:
        return [
          `[RUNNING] Executing custom shell automation script...`,
          `[SUCCESS] Step finished successfully.`
        ];
    }
  };

  // Environment Sync helper data & functions
  const getSyncVariables = () => {
    if (projectType === "unity") {
      return [
        { name: "UNITY_VERSION", type: "tool", currVal: "2022.3.0f1", refVal: "2022.3.14f1", status: "mismatch" },
        { name: "ANDROID_NDK_HOME", type: "env", currVal: "/opt/android-ndk-r25b", refVal: "/opt/android-ndk-r25b", status: "aligned" },
        { name: "GRADLE_VERSION", type: "tool", currVal: "7.4.2", refVal: "8.0.2", status: "mismatch" },
        { name: "UNITY_LICENSE_KEY", type: "env", currVal: "Leased", refVal: "Leased", status: "aligned" },
        { name: "GEMINI_API_KEY", type: "env", currVal: "Missing", refVal: "Configured", status: "missing" },
        { name: "SIGNING_KEY_STORE", type: "env", currVal: "Configured", refVal: "Configured", status: "aligned" },
      ];
    } else {
      return [
        { name: "UNREAL_ENGINE_VERSION", type: "tool", currVal: "5.3.2", refVal: "5.3.2", status: "aligned" },
        { name: "XCODE_SDK_VERSION", type: "tool", currVal: "15.1.0", refVal: "15.2.0", status: "mismatch" },
        { name: "P4PORT", type: "env", currVal: "ssl:p4.epicrealm.com:1666", refVal: "ssl:p4.epicrealm.com:1666", status: "aligned" },
        { name: "P4USER", type: "env", currVal: "build_machine", refVal: "build_machine", status: "aligned" },
        { name: "APPLE_APP_SPECIFIC_PASSWORD", type: "env", currVal: "Missing", refVal: "Configured", status: "missing" },
      ];
    }
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncOutputLogs([
      "🔄 Initializing Golden reference sync handshake...",
      `📡 Connected to baseline [${referenceEnv}] registry server...`,
      "🔍 Auditing compiler toolchain and configuration parameters..."
    ]);

    let i = 0;
    const steps = projectType === "unity" ? [
      "⚠️ Drift detected: UNITY_VERSION mismatch. Pulling standard Unity 2022.3.14f1 toolchain...",
      "⚙️ Upgrading local runner Unity installation to match 2022.3.14f1 baseline... Done.",
      "⚠️ Drift detected: GRADLE_VERSION mismatch. Downloading Gradle 8.0.2 wrapper... Done.",
      "🛑 Critical drift: GEMINI_API_KEY is missing. Mounting secret environment credentials from Vault... Done.",
      "✓ Re-evaluating environment variables against Golden Reference image...",
      "✨ Environment Alignment successful! Node is fully aligned with 0% configuration drift."
    ] : [
      "⚠️ Drift detected: XCODE_SDK_VERSION mismatch. Aligning iOS SDK paths to Xcode 15.2... Done.",
      "🛑 Critical drift: APPLE_APP_SPECIFIC_PASSWORD is empty. Mapping deployment keys from vault registry... Done.",
      "✓ Re-evaluating environment variables against Golden Reference image...",
      "✨ Environment Alignment successful! Node is fully aligned with 0% configuration drift."
    ];

    const timer = setInterval(() => {
      if (i < steps.length) {
        setSyncOutputLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(timer);
        setIsSyncing(false);
        setIsSyncAligned(true);
        showToast(isZh ? "环境同步对齐成功！所有变量与引擎版本漂移率已降至 0%！" : "Environment successfully aligned! All config drifts cleared.");
        window.dispatchEvent(new Event("trigger-confetti"));
      }
    }, 450);
  };

  // Target Environment state
  const [targetEnv, setTargetEnv] = useState<"qa" | "staging" | "production">("staging");

  // Build Farm simulation states
  const [activeAgents, setActiveAgents] = useState<number>(6);
  const [pendingAgents, setPendingAgents] = useState<number>(2);
  const [maxAgents] = useState<number>(16);
  const [agentHistory, setAgentHistory] = useState<{ name: string; active: number; pending: number }[]>([
    { name: "10m", active: 4, pending: 1 },
    { name: "8m", active: 5, pending: 2 },
    { name: "6m", active: 8, pending: 3 },
    { name: "4m", active: 7, pending: 1 },
    { name: "2m", active: 6, pending: 2 },
  ]);

  // Simulate build farm scaling fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const next = Math.max(2, Math.min(14, prev + change));
        
        setPendingAgents(pPrev => {
          const pChange = Math.floor(Math.random() * 3) - 1;
          const pNext = Math.max(0, Math.min(5, pPrev + pChange));
          
          setAgentHistory(history => {
            const nextHistory = [...history.slice(1), { name: "Now", active: next, pending: pNext }];
            return nextHistory.map((h, idx) => ({
              ...h,
              name: idx === 4 ? "Now" : `${(4 - idx) * 2}m`
            }));
          });
          return pNext;
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch pipeline when target environment changes
  useEffect(() => {
    fetchPipeline(platform, enabledSteps);
  }, [targetEnv]);

  useEffect(() => {
    if (terraformProvider === "aws") {
      setTerraformInstanceType("c6i.xlarge");
    } else if (terraformProvider === "gcp") {
      setTerraformInstanceType("c2-standard-4");
    } else if (terraformProvider === "azure") {
      setTerraformInstanceType("Standard_D4ds_v5");
    }
  }, [terraformProvider]);

  const getTerraformHcl = () => {
    const activeCredential = cloudAccounts.find(acc => acc.provider === terraformProvider && acc.active);
    if (terraformProvider === "aws") {
      const reg = activeCredential?.regionOrProject || "us-west-2";
      const keyId = activeCredential?.accessKeyOrClientId || "AKIAIOSFODNN7EXAMPLE";
      return `# AWS EKS Autoscaling Build Runner Cluster Blueprint
${activeCredential ? `# Securely deployed via Cloud Account Credentials: ${activeCredential.name}` : `# WARNING: No active Cloud Account linked. Using placeholder values.`}
provider "aws" {
  region     = "${reg}"
  access_key = "${keyId}"
  # secret_key is securely loaded during Terraform run
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "${terraformClusterName}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${reg}a", "${reg}b", "${reg}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.0"

  cluster_name    = "${terraformClusterName}"
  cluster_version = "1.27"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    build_runners = {
      min_size     = ${terraformMinNodes}
      max_size     = ${terraformMaxNodes}
      desired_size = ${terraformMinNodes}

      instance_types = ["${terraformInstanceType}"]
      capacity_type  = "SPOT" # Cost optimization for CI/CD

      labels = {
        role = "devops-hub-build-runner"
      }
    }
  }
}`;
    } else if (terraformProvider === "gcp") {
      const proj = activeCredential?.regionOrProject || "devops-hub-management-platform";
      const saEmail = activeCredential?.accessKeyOrClientId || "devops-hub-terraform-sa@devops-hub.iam.gserviceaccount.com";
      return `# Google Cloud GKE Autoscaling Build Runner Cluster Blueprint
${activeCredential ? `# Securely deployed via Cloud Account Credentials: ${activeCredential.name}` : `# WARNING: No active Cloud Account linked. Using placeholder values.`}
provider "google" {
  project     = "${proj}"
  region      = "us-central1"
  credentials = "<< LINKED_SERVICE_ACCOUNT_JSON (${saEmail}) >>"
}

resource "google_compute_network" "vpc" {
  name                    = "${terraformClusterName}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "${terraformClusterName}-subnet"
  ip_cidr_range = "10.10.0.0/16"
  region        = "us-central1"
  network       = google_compute_network.vpc.id
}

resource "google_container_cluster" "primary" {
  name     = "${terraformClusterName}"
  location = "us-central1-a"

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
}

resource "google_container_node_pool" "build_runners" {
  name       = "build-runner-pool"
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = ${terraformMinNodes}

  autoscaling {
    min_node_count = ${terraformMinNodes}
    max_node_count = ${terraformMaxNodes}
  }

  node_config {
    preemptible  = true # Cost optimization for ephemeral runners
    machine_type = "${terraformInstanceType}"

    labels = {
      role = "devops-hub-build-runner"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}`;
    } else {
      const subId = activeCredential?.regionOrProject || "00000000-0000-0000-0000-000000000000";
      const clientId = activeCredential?.accessKeyOrClientId || "00000000-0000-0000-0000-000000000000";
      return `# Azure AKS Autoscaling Build Runner Cluster Blueprint
${activeCredential ? `# Securely deployed via Cloud Account Credentials: ${activeCredential.name}` : `# WARNING: No active Cloud Account linked. Using placeholder values.`}
provider "azurerm" {
  features {}
  subscription_id = "${subId}"
  client_id       = "${clientId}"
  # client_secret is securely injected during deployment
}

resource "azurerm_resource_group" "rg" {
  name     = "${terraformClusterName}-rg"
  location = "West US 2"
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "${terraformClusterName}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${terraformClusterName}-dns"

  default_node_pool {
    name                = "runnerpool"
    node_count          = ${terraformMinNodes}
    vm_size             = "${terraformInstanceType}"
    enable_auto_scaling = true
    min_count           = ${terraformMinNodes}
    max_count           = ${terraformMaxNodes}

    node_labels = {
      "role" = "devops-hub-build-runner"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production-CI"
  }
}`;
    }
  };

  // Version History
  const [versions, setVersions] = useState<{ id: string, name: string, date: string }[]>([]);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load and save schedules and webhooks
  useEffect(() => {
    const stored = localStorage.getItem("devops_hub_pipeline_schedules");
    if (stored) {
      try {
        setSchedules(JSON.parse(stored));
      } catch (e) {
        setSchedules(DEFAULT_SCHEDULES);
      }
    } else {
      localStorage.setItem("devops_hub_pipeline_schedules", JSON.stringify(DEFAULT_SCHEDULES));
      setSchedules(DEFAULT_SCHEDULES);
    }
    
    const storedWebhookChannel = localStorage.getItem("devops_hub_webhook_channel");
    if (storedWebhookChannel) setWebhookChannel(storedWebhookChannel);
  }, []);

  useEffect(() => {
    localStorage.setItem("devops_hub_webhook_channel", webhookChannel);
  }, [webhookChannel]);

  const handleAddSchedule = () => {
    if (!schName.trim() || !schValue.trim()) {
      showToast(isZh ? "请输入完整的调度器参数！" : "Please enter all schedule parameters!");
      return;
    }
    const newSch: PipelineSchedule = {
      id: "sch-" + Date.now(),
      name: schName,
      platform: schPlatform,
      triggerType: schTriggerType,
      value: schValue
    };
    const updated = [...schedules, newSch];
    setSchedules(updated);
    localStorage.setItem("devops_hub_pipeline_schedules", JSON.stringify(updated));
    setSchName("");
    setSchValue(schTriggerType === "cron" ? "0 2 * * *" : "4");
    showToast(isZh ? "定时构建触发器已创建！" : "Build schedule successfully configured!");
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    localStorage.setItem("devops_hub_pipeline_schedules", JSON.stringify(updated));
    showToast(isZh ? "已删除该定时触发器。" : "Schedule deleted successfully.");
  };

  // Smart duration estimation math
  const getEstimatedDuration = () => {
    let duration = 0;
    
    // Platform base duration
    if (projectType === "unreal") {
      duration += 300; // Longer baseline for Unreal
    } else {
      if (platform === "android") duration += 180;
      else if (platform === "ios") duration += 280;
      else if (platform === "webgl") duration += 380;
      else duration += 90;
    }

    // Additive time per enabled step
    enabledSteps.forEach(stepId => {
      if (stepId === "clean") duration += 30;
      else if (stepId === "addressables") duration += 60;
      else if (stepId === "prebuild_script") duration += 15;
      else if (stepId === "unity_build") duration += 120;
      else if (stepId === "cook") duration += 200;
      else if (stepId === "package") duration += 150;
      else if (stepId === "postprocess_xcode") duration += 45;
      else if (stepId === "sign_package") duration += 40;
      else if (stepId === "store_upload") duration += 90;
      else if (stepId === "quality_check") duration += 45;
      else if (stepId === "notify") duration += 10;
    });

    // Asset count multiplier (0.05 seconds per asset file)
    duration += Math.round(assetCount * 0.05);

    return duration;
  };

  const getEstimationBreakdown = () => {
    const total = getEstimatedDuration();
    
    let prepTime = 0;
    let assetTime = Math.round(assetCount * 0.05);
    let playerTime = 0;
    let deployTime = 0;

    // Platform baseline distribution
    if (projectType === "unreal") {
      playerTime += 300;
    } else {
      if (platform === "android") playerTime += 180;
      else if (platform === "ios") playerTime += 280;
      else if (platform === "webgl") playerTime += 380;
      else playerTime += 90;
    }

    enabledSteps.forEach(stepId => {
      if (stepId === "clean" || stepId === "prebuild_script") {
        prepTime += stepId === "clean" ? 30 : 15;
      } else if (stepId === "addressables") {
        assetTime += 60;
      } else if (stepId === "unity_build" || stepId === "cook") {
        playerTime += stepId === "unity_build" ? 120 : 200;
      } else {
        deployTime += stepId === "package" ? 150 : stepId === "postprocess_xcode" ? 45 : stepId === "sign_package" ? 40 : stepId === "store_upload" ? 90 : stepId === "quality_check" ? 45 : 10;
      }
    });

    return {
      prep: Math.max(12, Math.round((prepTime / total) * 100)),
      assets: Math.max(18, Math.round((assetTime / total) * 100)),
      player: Math.max(35, Math.round((playerTime / total) * 100)),
      deploy: Math.max(12, Math.round((deployTime / total) * 100)),
      totalSecs: total
    };
  };

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const nextSteps = [...orderedStepIds];
    const [draggedItem] = nextSteps.splice(draggedIndex, 1);
    nextSteps.splice(targetIndex, 0, draggedItem);
    setOrderedStepIds(nextSteps);
    setDraggedIndex(null);
    showToast(isZh ? "已调整步骤执行顺序！" : "Pipeline execution sequence updated!");
    
    // Sort and trigger code regeneration with new order
    const nextEnabledSorted = nextSteps.filter(id => enabledSteps.includes(id));
    fetchPipeline(platform, nextEnabledSorted);
  };

  // Manage platform step order resets
  useEffect(() => {
    const defaultStepsForPlatform = PIPELINE_STEPS.filter(s => s.requiredFor.includes(platform) && s.engines?.includes(projectType)).map(s => s.id);
    setOrderedStepIds(defaultStepsForPlatform);
  }, [platform, projectType]);

  const injectTemplate = (platformName: string, filename: string, title: string, code: string, explanation: string) => {
    if (!generatedCodes) return;
    setGeneratedCodes(prev => {
      if (!prev) return null;
      return {
        ...prev,
        github: {
          title,
          type: "github",
          filename,
          code,
          explanation
        }
      };
    });
    setActiveCodeTab("github");
    showToast(language === "zh" ? `已成功注入 ${platformName} 模板！` : `Successfully injected ${platformName} template!`);
  };

  // Listen to search template injection triggers
  useEffect(() => {
    const handleSelectTemplate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const templateId = customEvent.detail;
      if (templateId === "gitlab") {
        injectTemplate("GitLab CI", ".gitlab-ci.yml", "GitLab CI Configuration", projectType === "unity" ? GITLAB_TEMPLATE : GITLAB_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} pipeline config tailored for GitLab CI runners.`);
      } else if (templateId === "bitbucket") {
        injectTemplate("Bitbucket", "bitbucket-pipelines.yml", "Bitbucket Pipelines Configuration", projectType === "unity" ? BITBUCKET_TEMPLATE : BITBUCKET_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} build pipeline for Bitbucket Cloud Pipelines.`);
      } else if (templateId === "circleci") {
        injectTemplate("CircleCI", ".circleci/config.yml", "CircleCI Configuration", projectType === "unity" ? CIRCLECI_TEMPLATE : CIRCLECI_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} compilation workflow config for CircleCI container environments.`);
      }
    };
    window.addEventListener("select-pipeline-template", handleSelectTemplate);
    return () => window.removeEventListener("select-pipeline-template", handleSelectTemplate);
  }, [language, generatedCodes]);

  const getStepTooltip = (id: string) => {
    const isZh = language === "zh";
    switch (id) {
      case "clean":
        return isZh
          ? "清理以往的构建产物。如果旧资源、以前的 C++ 缓存等导致出包异常，此步骤可保证绝对干净的初始状态。"
          : "Removes previous build artifacts. Crucial for resetting caches (like IL2CPP metadata) when upgrading SDKs.";
      case "addressables":
        return isZh
          ? "如果游戏使用可寻址资源系统，在打包 Player 前必须全量构建一次资产 Bundle，生成最新的 Catalog 资产清单。"
          : "Compiles and bundles game assets into catalog files. Must be built prior to Compiling Player if assets are dynamic.";
      case "prebuild_script":
        return isZh
          ? "运行自定义的 C# 脚本，在打包前自动化配置 Player 选项（如更新 UTC 版本号、配置调试宏、重构包名等）。"
          : "Runs custom editor functions to bump bundleVersion, toggle scripting macros, or rewrite player settings dynamically.";
      case "unity_build":
        return isZh
          ? "启动无头 (Headless) 批处理 Unity 进程，进行核心代码及资源烘焙。如果出错，应仔细检查 Unity 编辑器编译日志。"
          : "Invokes silent Unity in batchmode to compile the game. Any compilation errors will abort the entire pipeline.";
      case "postprocess_xcode":
        return isZh
          ? "iOS 特有。在 Unity 导出完 Xcode 项目后，运行 C# 脚本向 Xcode 项目注入必须的 iOS plist 或 Framework 依赖项。"
          : "iOS specific. Modifies the output Xcode project file (adding frameworks, Capabilities, or custom Plist flags) via C#.";
      case "sign_package":
        return isZh
          ? "移动端核心。使用开发者证书或安卓密钥 (Keystore) 对二进制文件签名并校正字节对齐，否则无法在真机上安装运行。"
          : "Applies cryptographic certificates to the player. For Android, aligns bytes via zipalign and applies apksigner keystores.";
      case "store_upload":
        return isZh
          ? "自动化分发通道。直接通过命令行工具 altool 或 Google 发布插件将包体自动交付到 TestFlight / 内部共享测试渠道。"
          : "Automates uploading binaries to Apple App Store Connect (TestFlight) or Google Play Store Internal test tracks.";
      case "quality_check":
        return isZh
          ? "全量质量门禁。包含静态代码分析、AI驱动错误预测、以及依赖冲突排查。任何一项高危指标都会中止流水线。"
          : "Comprehensive quality gate. Runs static analysis, AI-driven failure prediction, and dependency conflict checks.";
      case "notify":
        return isZh
          ? "向开发团队发送飞书/Slack/Discord 通道推送。附带详细的构建结果、包体体积、运行时长以及最新 Git 提交记录。"
          : "Posts diagnostic telemetry and build success status to Slack/Teams/Discord channels with webhook integrations.";
      case "cook":
        return isZh
          ? "执行 Unreal 资源烘焙，将源资产处理为特定平台所需的格式。"
          : "Executes Unreal Engine content cooking to process assets for the target platform.";
      case "package":
        return isZh
          ? "打包烘焙后的内容，生成可执行的二进制文件或包。"
          : "Packages cooked content into an executable or deployable binary.";
      default:
        return "";
    }
  };

  const prepareExportData = () => {
    return {
      exportDate: new Date().toISOString(),
      platform,
      enabledSteps,
      activeCodeTab,
      generatedFiles: generatedCodes ? Object.entries(generatedCodes).map(([key, value]) => {
        const val = value as any;
        return {
          type: key,
          filename: val.filename,
          title: val.title,
          code: val.code
        };
      }) : []
    };
  };

  const handleExportJson = () => {
    const data = prepareExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devops-hub-pipeline-${platform}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportYaml = () => {
    const data = prepareExportData();
    let yaml = `# ==========================================\n`;
    yaml += `# DevOps Hub Studio Pipeline Schema Export\n`;
    yaml += `# ==========================================\n\n`;
    yaml += `exportDate: "${data.exportDate}"\n`;
    yaml += `platform: "${data.platform}"\n`;
    yaml += `activeCodeTab: "${data.activeCodeTab}"\n`;
    yaml += `enabledSteps:\n`;
    data.enabledSteps.forEach((step: string) => {
      yaml += `  - "${step}"\n`;
    });
    yaml += `\ngeneratedFiles:\n`;
    data.generatedFiles.forEach((file: any) => {
      yaml += `  - type: "${file.type}"\n`;
      yaml += `    filename: "${file.filename}"\n`;
      yaml += `    title: "${file.title}"\n`;
      yaml += `    code: |\n`;
      const lines = file.code.split("\n");
      lines.forEach((line: string) => {
        yaml += `      ${line}\n`;
      });
    });

    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devops-pipeline-${platform}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const getStepDisplayName = (stepId: string) => {
    const step = PIPELINE_STEPS.find(s => s.id === stepId);
    if (!step) return stepId;
    return language === "en" ? step.nameEn : step.nameZh;
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast(isZh ? "⚠️ 无法打开新窗口！请允许浏览器弹出窗口以生成 PDF 报告。" : "⚠️ Cannot open new window! Please allow popups to generate the PDF report.");
      return;
    }

    const platformUpper = platform.toUpperCase();
    const currentDate = new Date().toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const reportHtml = `
      <html>
        <head>
          <title>DevOps Hub Studio CI/CD Build Health Report - ${platformUpper}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1f2937;
              line-height: 1.5;
              padding: 40px;
              background-color: #ffffff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #4f46e5;
              margin: 0;
            }
            .subtitle {
              font-size: 12px;
              color: #6b7280;
              margin-top: 5px;
            }
            .meta-box {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 30px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              font-size: 13px;
            }
            .meta-item span {
              font-weight: 600;
              color: #374151;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #111827;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .grid-stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .stat-value {
              font-size: 22px;
              font-weight: 700;
              color: #4f46e5;
              font-family: 'JetBrains Mono', monospace;
            }
            .stat-label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              margin-top: 5px;
            }
            .steps-list {
              font-size: 13px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .step-item {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            .step-item:last-child {
              border-bottom: none;
            }
            .step-name {
              font-weight: 600;
            }
            .step-status {
              font-family: 'JetBrains Mono', monospace;
              color: #10b981;
              font-weight: 700;
              margin-left: auto;
            }
            .advisory {
              background-color: #eff6ff;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              border-radius: 4px;
              font-size: 12px;
              color: #1e3a8a;
              margin-top: 40px;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
              margin-top: 50px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">DevOps Hub Studio CI/CD Build Health Report</h1>
              <div class="subtitle">Platform Pipeline & Performance Telemetry Metrics</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; color: #111827;">DEVOPS-STUDIO</div>
              <div class="subtitle">v2.4.0 Release</div>
            </div>
          </div>

          <div class="meta-box">
            <div class="meta-item"><span>Target Environment:</span> ${targetEnv.toUpperCase()}</div>
            <div class="meta-item"><span>Target Platform:</span> ${platformUpper}</div>
            <div class="meta-item"><span>Generated Date:</span> ${currentDate}</div>
            <div class="meta-item"><span>DevOps Core:</span> ${projectType === 'unity' ? 'Unity IL2CPP' : 'Unreal UBT C++'}</div>
          </div>

          <div class="section-title">Key Performance Indicators (KPIs)</div>
          <div class="grid-stats">
            <div class="stat-card">
              <div class="stat-value">89.4%</div>
              <div class="stat-label">Build Success Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${Math.floor(getEstimatedDuration() / 60)}m ${getEstimatedDuration() % 60}s</div>
              <div class="stat-label">Avg Pipeline Duration</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${assetCount.toLocaleString()}</div>
              <div class="stat-label">Total Workspace Assets</div>
            </div>
          </div>

          <div class="section-title">Pipeline Execution Flow Checklist</div>
          <div class="steps-list">
            ${enabledSteps.map((step, idx) => `
              <div class="step-item" style="display: flex; justify-content: space-between;">
                <div class="step-name">${idx + 1}. ${getStepDisplayName(step)}</div>
                <div class="step-status">ENABLED (OK)</div>
              </div>
            `).join('')}
          </div>

          <div class="section-title">FinOps Cost Optimization Advisory</div>
          <div class="advisory">
            <strong>Distributed Cache recommendation:</strong> Based on the current asset compilation metric of <strong>${assetCount.toLocaleString()} files</strong>, we highly recommend integrating Distributed Asset Caching. This will likely reduce the Average Pipeline Duration of <strong>${Math.floor(getEstimatedDuration() / 60)}m</strong> down to less than <strong>${Math.floor(getEstimatedDuration() / 120)}m</strong>, representing an average estimated monthly savings of <strong>$145.00 USD</strong> for development runners.
          </div>

          <div class="footer">
            Confidential Document - Generated automatically by DevOps Hub Studio Workspace.<br/>
            &copy; 2026 DevOps Hub Studio FinOps Broker & Build Automation. All rights reserved.
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    showToast(isZh ? "🎉 已成功准备并打印 PDF 质量报告！" : "🎉 Successfully generated and opened the printable PDF health report!");
    setShowExportMenu(false);
  };

  // Trigger regeneration whenever platform or steps change or language changes to keep explanations synced
  useEffect(() => {
    // Reset steps that aren't valid for the new platform and engine
    const validSteps = PIPELINE_STEPS.filter(s => s.requiredFor.includes(platform) && s.engines?.includes(projectType));
    const sortedOrder = (orderedStepIds.length > 0 && orderedStepIds.every(id => validSteps.some(vs => vs.id === id))) 
      ? orderedStepIds 
      : validSteps.map(s => s.id);
    
    const currentEnabledValid = sortedOrder.filter(id => enabledSteps.includes(id));
    
    // Ensure vital steps are enabled
    if (currentEnabledValid.length === 0) {
      if (projectType === "unity") {
        currentEnabledValid.push("unity_build");
      } else {
        currentEnabledValid.push("build");
      }
    }
    
    fetchPipeline(platform, currentEnabledValid);
  }, [platform, language, orderedStepIds, enabledSteps, projectType]);

  const triggerSimulatedWebhook = async (targetPlat: string) => {
    const timeStr = new Date().toLocaleTimeString();
    let serviceName = "Slack";
    if (webhookType === "discord") serviceName = "Discord";
    if (webhookType === "teams") serviceName = "Teams";
    
    const msgText = `[${timeStr}] [incoming-webhook] ${serviceName}: Sent build-completed notification to ${webhookChannel} for ${targetPlat.toUpperCase()}`;
    
    try {
      const response = await fetch("/api/webhook/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText, type: webhookType }),
      });
      
      if (!response.ok) throw new Error("Failed to send webhook");
      
      setWebhookLogs(prev => [
        { time: timeStr, text: msgText, type: webhookType },
        ...prev
      ].slice(0, 5));
      showToast(isZh ? `${serviceName} 通知已发送到 ${webhookChannel}！` : `${serviceName} notification sent to ${webhookChannel}!`);
    } catch (e) {
      showToast(isZh ? "通知发送失败" : "Notification failed");
    }
  };

  const triggerSimulatedFailureAlert = () => {
    const timeStr = new Date().toLocaleTimeString();
    const failMsg = isZh 
      ? `🚨 流水线告警：构建连续失败次数达 (${consecutiveFailures} 次)！单元测试失败率: ${testFailureRate}%，编译警告数: ${warningThreshold}`
      : `🚨 Pipeline Alert: Consecutive build failures (${consecutiveFailures}) reached threshold! Test failure rate: ${testFailureRate}%, Warnings: ${warningThreshold}`;
    
    if (alertChannels.toast) {
      showToast(failMsg);
    }
    
    if (alertChannels.desktop) {
      showToast(isZh ? `ℹ️ [桌面通知模拟]：${failMsg}` : `ℹ️ [Desktop Push Simulated]: ${failMsg}`);
    }

    const serviceName = webhookType === "slack" ? "Slack" : webhookType === "discord" ? "Discord" : "Teams";
    const logText = `[${timeStr}] [FAILURE ALERT] ${serviceName}: Sent critical alert to ${webhookChannel}. Reason: ${consecutiveFailures} consec failures, ${testFailureRate}% test fail, ${warningThreshold} warnings.`;
    
    setWebhookLogs(prev => [
      { time: timeStr, text: logText, type: webhookType },
      ...prev
    ].slice(0, 10));
  };

  const fetchPipeline = async (targetPlatform: BuildPlatform, steps: string[]) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: targetPlatform, enabledSteps: steps, language, projectType, targetEnv }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate pipeline scripts");
      }
      const data = await response.json();
      setGeneratedCodes(data);
      // Fire visual accomplishment confetti!
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
      
      // Send simulated webhook notification if enabled!
      if (webhookEnabled) {
        triggerSimulatedWebhook(targetPlatform);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred generating script templates.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepToggle = (stepId: string) => {
    const isEnabled = enabledSteps.includes(stepId);
    let newSteps: string[];
    if (isEnabled) {
      newSteps = enabledSteps.filter(id => id !== stepId);
    } else {
      newSteps = [...enabledSteps, stepId];
    }
    
    // Avoid leaving with zero steps
    if (newSteps.length === 0) return;
    
    setEnabledSteps(newSteps);
    fetchPipeline(platform, newSteps);
  };

  const handleCopy = () => {
    if (!generatedCodes) return;
    const activeCode = generatedCodes[activeCodeTab]?.code;
    if (activeCode) {
      navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(language === "zh" ? "已复制脚本内容到剪贴板！" : "Copied script to clipboard!");
    }
  };

  const renderKanbanView = () => {
    return (
      <KanbanView
        isZh={isZh}
        projectType={projectType}
        kanbanJobs={kanbanJobs}
        setKanbanJobs={setKanbanJobs}
        resourceLimits={resourceLimits}
        showToast={showToast}
        getJobLogLines={getJobLogLines}
        showLogConsole={showLogConsole}
        setShowLogConsole={setShowLogConsole}
        selectedJobId={selectedJobId}
        setSelectedJobId={setSelectedJobId}
      />
    );
  };

  const renderConfigView = () => {
    return (
      <ConfigView
        isZh={isZh}
        envVars={envVars}
        setEnvVars={setEnvVars}
        newEnvKey={newEnvKey}
        setNewEnvKey={setNewEnvKey}
        newEnvVal={newEnvVal}
        setNewEnvVal={setNewEnvVal}
        newEnvSecret={newEnvSecret}
        setNewEnvSecret={setNewEnvSecret}
        cacheSettings={cacheSettings}
        setCacheSettings={setCacheSettings}
        pipelineHooks={pipelineHooks}
        setPipelineHooks={setPipelineHooks}
        resourceLimits={resourceLimits}
        setResourceLimits={setResourceLimits}
        showToast={showToast}
      />
    );
  };

  const activeCodeObj = generatedCodes ? generatedCodes[activeCodeTab] : null;

  return (
    <div className="space-y-6" id="pipeline-builder">

      {/* Top Level Sub-Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-950/40 border border-gray-900 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-900/30">
            <Sliders className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-100 tracking-tight font-sans">
              {isZh ? "流水线自动化控制中枢" : "Pipeline Automation Control Center"}
            </h2>
            <p className="text-[11px] text-gray-500">
              {isZh ? "配置编译环境、调度计划任务、模拟多平台打包进度与管理构建看板系统" : "Configure compile environments, dispatch build jobs, track live progress & inspect run outputs"}
            </p>
          </div>
        </div>
        <div className="flex items-center bg-gray-950 border border-gray-850 p-1 rounded-xl select-none max-w-full overflow-x-auto gap-1">
          <button
            onClick={() => setActiveMode("builder")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === "builder"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>{isZh ? "工作流架构师" : "Pipeline Architect"}</span>
          </button>
          <button
            onClick={() => setActiveMode("kanban")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === "kanban"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Layout className="h-3.5 w-3.5" />
            <div className="flex items-center gap-1.5">
              <span>{isZh ? "构建进度看板" : "Kanban Dashboard"}</span>
              {kanbanJobs.filter(j => j.status === "running").length > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveMode("config")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeMode === "config"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{isZh ? "高级全局配置" : "Global Config"}</span>
          </button>
        </div>
      </div>

      {activeMode === "builder" ? (
        /* Platform & Steps Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
        
        {/* Left Control Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tab Switcher */}
          <div className="flex border border-gray-850 bg-gray-950/80 backdrop-blur p-1 rounded-xl w-full overflow-x-auto gap-1">
            <button
              onClick={() => setLeftTab("builder")}
              className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold tracking-wide transition-all flex flex-col items-center gap-1 cursor-pointer min-w-[65px] select-none ${
                leftTab === "builder"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{isZh ? "属性参数" : "Params"}</span>
            </button>
            <button
              onClick={() => setLeftTab("schedules")}
              className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold tracking-wide transition-all flex flex-col items-center gap-1 cursor-pointer min-w-[65px] select-none ${
                leftTab === "schedules"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30"
              }`}
            >
              <Workflow className="h-4 w-4" />
              <span>{isZh ? "步骤编排" : "Steps"}</span>
            </button>
            <button
              onClick={() => setLeftTab("notifications")}
              className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold tracking-wide transition-all flex flex-col items-center gap-1 cursor-pointer min-w-[65px] select-none ${
                leftTab === "notifications"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{isZh ? "自动规则" : "Rules"}</span>
            </button>
            <button
              onClick={() => setLeftTab("envsync")}
              className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wide transition-all flex flex-col items-center gap-1 cursor-pointer min-w-[60px] select-none ${
                leftTab === "envsync"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>{isZh ? "集群同步" : "Cluster"}</span>
            </button>
            <button
              onClick={() => setLeftTab("terraform")}
              className={`flex-1 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wide transition-all flex flex-col items-center gap-1 cursor-pointer min-w-[60px] select-none ${
                leftTab === "terraform"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{isZh ? "IaC蓝图" : "IaC Blueprint"}</span>
            </button>
          </div>

          <div className={leftTab === "builder" ? "space-y-6 block" : "hidden"}>
            
            {/* Tab header description */}
            <div className="bg-gradient-to-r from-indigo-950/20 to-purple-950/20 border border-gray-850 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                {isZh ? "编译属性与环境设定" : "Build Parameters & Environment"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isZh ? "定义目标运行平台、参考部署拓扑、预置打包规格。这将决定底层引擎脚本编译时采用的主配方。" : "Define compile target, execution environment, and performance specs. This feeds parameters into generator."}
              </p>
            </div>
          
          {/* Template Gallery */}
          <TemplateGallery
            isZh={isZh}
            onSelectTemplate={(steps, templPlatform, templProjectType) => {
              if (templProjectType !== projectType) {
                setProjectType(templProjectType);
              }
              setPlatform(templPlatform);
              setEnabledSteps(steps);
              
              // Align execution sequence order for new platform/engine
              const defaultStepsForPlatform = PIPELINE_STEPS.filter(s => 
                s.requiredFor.includes(templPlatform) && s.engines?.includes(templProjectType)
              ).map(s => s.id);
              setOrderedStepIds(defaultStepsForPlatform);
              
              fetchPipeline(templPlatform, steps);
              showToast(isZh ? "已成功应用预设工作流模板！" : "Successfully applied workflow template!");
            }}
          />
          
          {/* Pipeline Presets */}
          <PipelinePresets />

          {/* Platform Selector */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4 font-sans">
              {t("choosePlatform")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {projectType === "unity" || projectType === "unreal" ? (
                <>
                  <button
                    id="platform-android-btn"
                    onClick={() => setPlatform("android")}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "android"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-950/20"
                        : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:text-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2 group/tooltip">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-48 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl">
                        {language === "zh"
                          ? "AAB 格式是 Google Play 发布所必须的。启用动态交付分发以优化安装大小。"
                          : "AAB format is mandatory for Google Play Store. Enables dynamic delivery to optimize install sizes."}
                      </div>
                    </div>
                    <Smartphone className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Android</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">AAB / APK</span>
                  </button>

                  <button
                    id="platform-ios-btn"
                    onClick={() => setPlatform("ios")}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "ios"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-950/20"
                        : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:text-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2 group/tooltip">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-48 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl">
                        {language === "zh"
                          ? "生成 Xcode 工程项目。必须要在装有 Xcode 开发链的 macOS 电脑上进行打包签名。"
                          : "Generates an Xcode project. Must be compiled, archived, and signed on macOS with Xcode toolchain."}
                      </div>
                    </div>
                    <Smartphone className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">iOS</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Xcode / IPA</span>
                  </button>

                  <button
                    id="platform-webgl-btn"
                    onClick={() => setPlatform("webgl")}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "webgl"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-950/20"
                        : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:text-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2 group/tooltip">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-48 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl">
                        {language === "zh"
                          ? "输出静态 HTML5/WASM 文件。服务器上通常需要设置 Brotli/Gzip 解压头响应以加速首屏载入。"
                          : "Produces static HTML5/WASM. Requires configuring web server gzip/brotli compression headers."}
                      </div>
                    </div>
                    <Globe className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">WebGL</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">WASM Browser</span>
                  </button>

                  <button
                    id="platform-standalone-btn"
                    onClick={() => setPlatform("standalone")}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "standalone"
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-950/20"
                        : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:text-gray-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2 group/tooltip">
                      <HelpCircle className="h-3.5 w-3.5 text-gray-500 hover:text-gray-300 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-48 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl">
                        {language === "zh"
                          ? "生成传统的 PC/Mac 独立执行程序 (.exe / .app)。适合在 Steam 平台或者独立网站上发布。"
                          : "Produces an executable player (.exe/.app). Suitable for desktop deployments or Steam publishing."}
                      </div>
                    </div>
                    <Monitor className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Standalone</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Win / Mac</span>
                  </button>
                </>
              ) : projectType === "web" ? (
                <>
                  <button
                    onClick={() => setPlatform("web")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "web" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Globe className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Web</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Static Assets</span>
                  </button>
                  <button
                    onClick={() => setPlatform("docker")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "docker" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Docker</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Container Image</span>
                  </button>
                </>
              ) : projectType === "mobile" ? (
                <>
                  <button
                    onClick={() => setPlatform("android")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "android" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Smartphone className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Android</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">APK / AAB</span>
                  </button>
                  <button
                    onClick={() => setPlatform("ios")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "ios" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Smartphone className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">iOS</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">IPA</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPlatform("linux")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "linux" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Terminal className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Linux</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Binary Executable</span>
                  </button>
                  <button
                    onClick={() => setPlatform("docker")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "docker" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Package className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">Docker</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Container</span>
                  </button>
                  <button
                    onClick={() => setPlatform("k8s")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      platform === "k8s" ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md" : "bg-gray-900/40 border-gray-800 text-gray-400"
                    }`}
                  >
                    <Workflow className="h-6 w-6 mb-2" />
                    <span className="text-xs font-semibold font-mono">K8s</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Orchestration</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Target Environment Selector */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
                {isZh ? "目标部署环境" : "Target Environment"}
              </h3>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {isZh 
                ? "选择目标部署环境。系统将根据最佳实践自动为 Unity/Unreal CI/CD 生成对应环境的控制变量、优化级别和打包设置。"
                : "Select the deployment target environment. The CI/CD system automatically injects optimal build configurations and macro tags."}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(["qa", "staging", "production"] as const).map((env) => {
                const label = {
                  qa: "QA",
                  staging: isZh ? "预发布" : "Staging",
                  production: isZh ? "正式生产" : "Production",
                }[env];

                const desc = {
                  qa: isZh ? "快速调试包" : "Debug / Test",
                  staging: isZh ? "内测优化包" : "Optimized Dev",
                  production: isZh ? "正式发布签名" : "Retail Shipping",
                }[env];

                const isActive = targetEnv === env;
                return (
                  <button
                    key={env}
                    onClick={() => {
                      setTargetEnv(env);
                      showToast(isZh ? `部署环境已切换至：${label}` : `Deployment environment set to: ${label}`);
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow-md"
                        : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:text-gray-200"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">{label}</span>
                    <span className="text-[8px] text-gray-500 mt-0.5 whitespace-nowrap">{desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-900 text-[10px] space-y-1 text-gray-400 leading-normal min-h-[75px]">
              <AnimatePresence mode="wait">
                {targetEnv === "qa" && (
                  <motion.div
                    key="qa"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center gap-1 text-sky-400 font-semibold mb-1">
                      <span className="h-1.5 w-1.5 bg-sky-400 rounded-full animate-pulse" />
                      <span>QA Environment Rules:</span>
                    </div>
                    <p>{isZh ? "• 包含全量调试符号与运行时日志输出" : "• Debug logs and profiling instrumentation fully enabled."}</p>
                    <p>{isZh ? "• 自动执行包含在代码库中的冒烟与自动化测试" : "• Executes fast regression and smoke automation tests on agent."}</p>
                  </motion.div>
                )}
                {targetEnv === "staging" && (
                  <motion.div
                    key="staging"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center gap-1 text-amber-400 font-semibold mb-1">
                      <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                      <span>Staging Environment Rules:</span>
                    </div>
                    <p>{isZh ? "• 启用 IL2CPP / C++ 代码深度编译优化" : "• Advanced build optimizations (Release configurations) enabled."}</p>
                    <p>{isZh ? "• 触发内部版本号自动同步，包体部署至内测渠道" : "• Triggers automatic version syncing and posts to internal channels."}</p>
                  </motion.div>
                )}
                {targetEnv === "production" && (
                  <motion.div
                    key="production"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span>Production Environment Rules:</span>
                    </div>
                    <p>{isZh ? "• 启用零售发布 (Shipping/Release) 剥离调试日志" : "• Retail Shipping configuration with stripped development asserts."}</p>
                    <p>{isZh ? "• 强制执行签名合规扫描，触发全局 CDN 预热" : "• Enforces compliance scan, strict signing, and global CDN pre-warm."}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {projectType === 'unreal' && (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "烹饪配置 (Cooking)" : "Cooking Configurations"}</h3>
              <input type="text" placeholder="Cook Directory" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2"/>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "衍生数据缓存路径 (DDC Path)" : "DDC Paths"}</h3>
              <input type="text" placeholder="/path/to/ddc" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2"/>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "UBT 命令行参数" : "UBT Command-line Args"}</h3>
              <textarea rows={3} placeholder="-build -cook -stage" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2"/>
            </div>
          )}

          {/* Template Library */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4 font-sans">
              {isZh ? "模板库 (CI/CD YAML)" : "Template Library (CI/CD YAML)"}
            </h3>
            <select className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2">
              <option>{isZh ? "选择 CI/CD 模板..." : "Select CI/CD Template..."}</option>
              <option>GitHub Actions (Unity)</option>
              <option>GitHub Actions (Unreal)</option>
              <option>GitLab CI (Unity)</option>
              <option>GitLab CI (Unreal)</option>
              <option>Jenkinsfile (Generic)</option>
            </select>
          </div>

          {/* Version History */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4 font-sans">
              {isZh ? "版本历史" : "Version History"}
            </h3>
            <select className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2">
              <option>{isZh ? "保存当前版本" : "Save Current Version"}</option>
            </select>
          </div>

          </div>

          <div className={leftTab === "schedules" ? "space-y-6 block" : "hidden"}>

            {/* Tab header description */}
            <div className="bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-gray-850 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Workflow className="h-3.5 w-3.5" />
                {isZh ? "原子步骤编排与工时预估" : "Workflow Orchestration & Costs"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isZh ? "可视化编排持续集成的原子任务，勾选开关以启用该环节。通过智能预测模型，在拖拽排序时将实时输出预测的打包耗时。" : "Drag and reorder pipeline stages, toggling checkboxes. Build runtime duration estimator computes active costs live."}
              </p>
            </div>

            {projectType === "unreal" && (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "烹饪配置 (Cooking)" : "Cooking Configurations"}</h3>
                <input type="text" placeholder="Cook Directory" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2" defaultValue="/Game/Maps/MyMap" />
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "衍生数据缓存路径 (DDC Path)" : "DDC Paths"}</h3>
                <input type="text" placeholder="/path/to/ddc" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2" defaultValue="%ENGINE_DIR%/DerivedDataCache" />
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">{isZh ? "UBT 命令行参数" : "UBT Command-line Args"}</h3>
                <textarea rows={3} placeholder="-build -cook -stage" className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2" defaultValue="-build -cook -stage -pak -clientconfig=Shipping" />
              </div>
            )}

            {projectType === "unreal" ? (
            <UnrealPipelineEditor 
              enabledSteps={enabledSteps} 
              onToggleStep={handleStepToggle} 
            />
          ) : null}

          {/* Steps Configurator */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
                {t("pipelineSteps")}
              </h3>
              <button 
                id="sync-pipeline-btn"
                onClick={() => fetchPipeline(platform, enabledSteps)}
                className="p-1.5 rounded hover:bg-gray-900 text-gray-400 hover:text-gray-200 transition-colors"
                title={t("forceRefresh")}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mb-3 leading-normal">
              {isZh ? "💡 拖拽左侧手柄 ☰ 调整步骤顺序，勾选框切换启用状态。" : "💡 Drag the ☰ handle to reorder build phases. Toggle checkbox to enable/disable."}
            </p>

            <div className="space-y-3">
              {orderedStepIds.map((stepId, index) => {
                const step = PIPELINE_STEPS.find(s => s.id === stepId);
                if (!step || !step.requiredFor.includes(platform) || !step.engines?.includes(projectType)) return null;
                const isChecked = enabledSteps.includes(step.id);
                const stepName = language === "en" ? step.nameEn : step.nameZh;
                const stepDesc = language === "en" ? step.descEn : step.descZh;
                const validationError = getStepValidationError(step.id);

                return (
                  <div
                    key={step.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={() => setDraggedIndex(null)}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      validationError
                        ? "bg-rose-950/20 border-rose-500/80 text-rose-200"
                        : isChecked
                          ? "bg-gray-900/80 border-indigo-500/40 text-gray-200"
                          : "bg-gray-900/20 border-gray-800/60 text-gray-400 hover:bg-gray-900/40"
                    } ${draggedIndex === index ? "opacity-30 border-dashed border-indigo-500" : ""} ${
                      validationError ? "cursor-grab active:cursor-grabbing" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <div className="mt-1 text-gray-500 hover:text-gray-300 cursor-grab px-0.5">
                      <GripVertical className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleStepToggle(step.id)}
                      className="mt-1 h-3.5 w-3.5 accent-indigo-500 text-indigo-600 rounded border-gray-800 focus:ring-offset-0 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5 flex-1 select-none">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-semibold block ${validationError ? "text-rose-300" : ""}`}>{stepName}</span>
                        
                        {validationError && (
                          <div className="relative group/val-tooltip flex items-center">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-pulse cursor-help" />
                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-gray-950 border border-rose-500/60 text-[10.5px] text-rose-200 opacity-0 group-hover/val-tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-2xl">
                              <span className="font-bold text-rose-400 block mb-1 uppercase tracking-wider">
                                {isZh ? "⚠️ 步骤配置冲突" : "⚠️ Step Config Issue"}
                              </span>
                              {validationError}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-950"></div>
                            </div>
                          </div>
                        )}

                        <div className="relative group/step-tooltip">
                          <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" onClick={(e) => e.stopPropagation()} />
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-300 opacity-0 group-hover/step-tooltip:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl">
                            {getStepTooltip(step.id)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] leading-relaxed block ${validationError ? "text-rose-400/80" : "text-gray-400"}`}>{stepDesc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Duration Estimator Card */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                {isZh ? "智能构建耗时估算器" : "Smart Build Duration Estimator"}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{isZh ? "预估打包资产总数:" : "Estimated Project Asset Count:"}</span>
                <span className="font-mono text-emerald-400 font-semibold">{assetCount.toLocaleString()} {isZh ? "个资源文件" : "files"}</span>
              </div>
              
              <input
                type="range"
                min="500"
                max="12000"
                step="100"
                value={assetCount}
                onChange={(e) => setAssetCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="pt-2">
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400">{isZh ? "总构建预计耗时:" : "Total Estimated Pipeline Duration:"}</span>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-gray-100">
                      {Math.floor(getEstimatedDuration() / 60)}m {getEstimatedDuration() % 60}s
                    </span>
                  </div>
                </div>

                {projectType === "unreal" && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gray-900 p-2 rounded-lg border border-gray-800 text-center">
                      <span className="text-[9px] text-gray-500 uppercase block leading-none mb-1">{isZh ? "着色器编译" : "Shaders"}</span>
                      <span className="text-xs font-mono font-bold text-orange-400">4,281</span>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg border border-gray-800 text-center">
                      <span className="text-[9px] text-gray-500 uppercase block leading-none mb-1">{isZh ? "烘焙大小" : "Cooked Size"}</span>
                      <span className="text-xs font-mono font-bold text-orange-400">12.4 GB</span>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg border border-gray-800 text-center">
                      <span className="text-[9px] text-gray-500 uppercase block leading-none mb-1">{isZh ? "UBT 线程" : "UBT Workers"}</span>
                      <span className="text-xs font-mono font-bold text-orange-400">24 Active</span>
                    </div>
                  </div>
                )}

                {/* Progress segmented bar */}
                {(() => {
                  const breakdown = getEstimationBreakdown();
                  return (
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full overflow-hidden flex bg-gray-900 border border-gray-800/80">
                        <div 
                          className="bg-sky-500 h-full transition-all duration-300" 
                          style={{ width: `${breakdown.prep}%` }}
                          title={`${isZh ? '环境初始化' : 'Setup & Clean'} (${breakdown.prep}%)`}
                        />
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-300" 
                          style={{ width: `${breakdown.assets}%` }}
                          title={`${isZh ? '可寻址编译' : 'Asset Baking'} (${breakdown.assets}%)`}
                        />
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-300" 
                          style={{ width: `${breakdown.player}%` }}
                          title={`${isZh ? (projectType === 'unity' ? 'Unity 主核心编译' : 'Unreal 引擎编译') : (projectType === 'unity' ? 'Unity Editor Compiler' : 'Unreal Engine Build')} (${breakdown.player}%)`}
                        />
                        <div 
                          className="bg-purple-500 h-full transition-all duration-300" 
                          style={{ width: `${breakdown.deploy}%` }}
                          title={`${isZh ? '包体签名与分发' : 'Sign & Distribute'} (${breakdown.deploy}%)`}
                        />
                      </div>

                      {/* Legend labels */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[10px]">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span>{isZh ? "环境初始化" : "Setup & Clean"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{isZh ? "资源编译打包" : "Asset Baking"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{isZh ? (projectType === 'unity' ? "Unity 核心出包" : "Unreal 核心构建") : (projectType === 'unity' ? "Unity Compiler" : "Unreal Build")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>{isZh ? "签名分发通知" : "Sign & Deploy"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className={leftTab === "envsync" ? "space-y-6 block" : "hidden"}>

            {/* Tab header description */}
            <div className="bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 border border-gray-850 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                {isZh ? "分布式构建集群与制品托管" : "Distributed Build Farm & Artifacts"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isZh ? "实时监控多区域分布式流水线集群弹性扩缩容。支持跨平台冷热制品、游戏包体资产的审计和环境一致性同步。" : "Monitor on-demand multi-zone cluster scaling, artifact assets, and environment synchronization rules."}
              </p>
            </div>

            <ArtifactGallery />

            {/* Build Farm Auto-scaling Metric Card */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="build-farm-auto-scaling">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" />
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-0.5 font-sans">
                  {isZh ? "构建集群动态扩缩容 (Build Farm Scaling)" : "Build Farm Auto-scaling"}
                </h3>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-900 text-[9px] font-mono font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE</span>
              </span>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              {isZh 
                ? "模拟游戏构建节点集群的动态弹性伸缩。CI/CD 系统会根据待构建队列的积压情况，自动启动云端按需节点进行分布式加速，闲时自动释放以节约成本。"
                : "Simulate elastic scale-out of on-demand build agent instances. Cloud agents boot automatically during queue spikes and terminate when idle."}
            </p>

            {/* Stat Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-gray-900/60 p-2.5 rounded-lg border border-gray-900">
                <span className="text-[9px] text-gray-500 uppercase block font-sans mb-0.5">{isZh ? "活跃节点" : "Active Nodes"}</span>
                <span className="text-sm font-mono font-bold text-gray-200">
                  {activeAgents} <span className="text-[10px] text-gray-500 font-normal">/ {maxAgents}</span>
                </span>
              </div>
              <div className="bg-gray-900/60 p-2.5 rounded-lg border border-gray-900">
                <span className="text-[9px] text-gray-500 uppercase block font-sans mb-0.5">{isZh ? "排队任务" : "Pending Jobs"}</span>
                <span className={`text-sm font-mono font-bold flex items-center gap-1.5 ${pendingAgents > 0 ? "text-amber-400" : "text-gray-400"}`}>
                  {pendingAgents}
                  {pendingAgents > 0 && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                </span>
              </div>
              <div className="bg-gray-900/60 p-2.5 rounded-lg border border-gray-900">
                <span className="text-[9px] text-gray-500 uppercase block font-sans mb-0.5">{isZh ? "集群负载" : "Farm Load"}</span>
                <span className="text-sm font-mono font-bold text-indigo-400">
                  {((activeAgents + pendingAgents) / maxAgents * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Simulated Live Spark/History Histogram */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block px-0.5">
                {isZh ? "实时集群状态趋势 (Live Utilization History):" : "Live Utilization History:"}
              </span>
              <div className="bg-gray-900/40 p-2 rounded-lg border border-gray-900 flex items-end justify-between h-20 gap-1 pt-4">
                {agentHistory.map((pt, index) => {
                  const maxVal = maxAgents;
                  const activeHeight = Math.max(8, (pt.active / maxVal) * 100);
                  const pendingHeight = (pt.pending / maxVal) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-1 bg-gray-950 border border-gray-800 rounded px-1.5 py-0.5 text-[8px] text-gray-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40 shadow-lg pointer-events-none">
                        Active: {pt.active}, Pending: {pt.pending}
                      </div>

                      <div className="w-full flex flex-col justify-end h-full max-w-[24px]">
                        {/* Pending block */}
                        {pt.pending > 0 && (
                          <div 
                            className="bg-amber-500/70 w-full rounded-t-sm transition-all duration-300"
                            style={{ height: `${pendingHeight}%` }}
                          />
                        )}
                        {/* Active block */}
                        <div 
                          className="bg-indigo-600/80 w-full transition-all duration-300"
                          style={{ 
                            height: `${activeHeight}%`, 
                            borderTopRightRadius: pt.pending > 0 ? '0' : '2px',
                            borderTopLeftRadius: pt.pending > 0 ? '0' : '2px'
                          }}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 mt-1">{pt.name}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[8px] text-gray-500 font-mono px-0.5 mt-1">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-indigo-600/80" />
                  <span>{isZh ? "活跃容器节点" : "Active Node Agents"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-amber-500/70" />
                  <span>{isZh ? "排队积压作业" : "Pending Build Backlog"}</span>
                </span>
              </div>
            </div>

            {/* Quick Simulation Controls */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setActiveAgents(prev => Math.min(maxAgents, prev + 2));
                  showToast(isZh ? "已手动拉起 2 个辅助构建容器！" : "Provisioned 2 extra on-demand build agents!");
                }}
                className="py-1 px-1.5 rounded bg-gray-900 border border-gray-800 hover:border-indigo-500/50 text-[9px] font-semibold text-gray-300 hover:text-indigo-400 text-center cursor-pointer transition-colors"
              >
                {isZh ? "弹性扩容 (+2)" : "Scale Up (+2)"}
              </button>
              <button
                onClick={() => {
                  setActiveAgents(prev => Math.max(1, prev - 2));
                  showToast(isZh ? "已优雅下线 2 个闲置构建容器！" : "Gracefully terminated 2 idle build agents.");
                }}
                className="py-1 px-1.5 rounded bg-gray-900 border border-gray-800 hover:border-rose-500/50 text-[9px] font-semibold text-gray-300 hover:text-rose-400 text-center cursor-pointer transition-colors"
              >
                {isZh ? "缩容回收 (-2)" : "Scale Down (-2)"}
              </button>
              <button
                onClick={() => {
                  setPendingAgents(p => p + 4);
                  setActiveAgents(a => Math.min(maxAgents - 1, a + 1));
                  showToast(isZh ? "模拟开发者提交：积压任务激增！" : "Load Spike triggered: backlogged commits queue growing!");
                }}
                className="py-1 px-1.5 rounded bg-indigo-950/40 border border-indigo-800 hover:bg-indigo-900 text-[9px] font-semibold text-indigo-300 text-center cursor-pointer transition-colors"
              >
                {isZh ? "负载激增模拟" : "Spike Surging"}
              </button>
            </div>
          </div>

          </div>

          <div className={leftTab === "notifications" ? "space-y-6 block" : "hidden"}>

            {/* Tab header description */}
            <div className="bg-gradient-to-r from-purple-950/20 to-pink-950/20 border border-gray-855 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {isZh ? "定时计划、通知、质量度量规则" : "Schedules, Rules & Alert Policies"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isZh ? "在这里配置流水线自动触发策略、外部渠道 Webhook 通知规则、以及包体测试覆盖率或构建崩溃熔断阈值。" : "Configure unattended cron schedules, outbound slack/webhook notices, and automated regression alert rules."}
              </p>
            </div>

          {/* Pipeline Schedules list & form */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="pipeline-schedules">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                {isZh ? "定时构建触发计划 (Schedules)" : "Pipeline Schedules"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {isZh ? "配置 Cron 表达式或间隔时间来驱动持续集成自动化运行。" : "Define cron intervals or direct rules for unattended pipeline triggers."}
              </p>
            </div>

            {/* Creation form */}
            <div className="space-y-3 p-3.5 bg-gray-900/40 rounded-lg border border-gray-900">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "触发器名称:" : "Trigger Name:"}</label>
                <input
                  type="text"
                  placeholder={isZh ? "例如: 每日午夜出包" : "e.g., Nightly Deployment"}
                  value={schName}
                  onChange={(e) => setSchName(e.target.value)}
                  className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "目标平台:" : "Target Platform:"}</label>
                  <select
                    value={schPlatform}
                    onChange={(e) => setSchPlatform(e.target.value)}
                    className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="webgl">WebGL</option>
                    <option value="standalone">Standalone</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "触发机制:" : "Trigger Mechanism:"}</label>
                  <select
                    value={schTriggerType}
                    onChange={(e) => {
                      const type = e.target.value as "cron" | "interval";
                      setSchTriggerType(type);
                      setSchValue(type === "cron" ? "0 2 * * *" : "4");
                    }}
                    className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cron">{isZh ? "Cron 表达式" : "Cron Expression"}</option>
                    <option value="interval">{isZh ? "简单小时周期" : "Simple Interval"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  {schTriggerType === "cron" 
                    ? (isZh ? "Cron 规则 (分 时 日 月 周):" : "Cron Expression (m h d m w):") 
                    : (isZh ? "间隔周期 (小时):" : "Interval Duration (Hours):")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={schValue}
                    onChange={(e) => setSchValue(e.target.value)}
                    className="flex-1 text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddSchedule}
                    className="px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isZh ? "添加" : "Add"}</span>
                  </button>
                </div>
                {schTriggerType === "cron" && (
                  <span className="text-[9px] text-gray-500 block leading-normal">
                    {isZh ? "标准五字段 Cron，例如 0 2 * * * 表示每天凌晨 2 点" : "Standard 5-field cron syntax. e.g. 0 2 * * * means 2 AM daily"}
                  </span>
                )}
              </div>
            </div>

            {/* Schedules List */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-1">
                {isZh ? "运行中的触发计划" : "Active Scheduled Triggers"} ({schedules.length})
              </div>
              {schedules.length === 0 ? (
                <div className="text-center text-[10px] text-gray-600 py-4 bg-gray-900/20 border border-dashed border-gray-900 rounded-lg">
                  {isZh ? "暂无配置的定时触发计划" : "No active pipeline schedules."}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {schedules.map(s => (
                    <div 
                      key={s.id} 
                      className="flex items-center justify-between p-2.5 bg-gray-900/60 border border-gray-800/60 rounded-lg text-[11px]"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                          <span>{s.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-indigo-900/60 text-indigo-300 border border-indigo-800 rounded-full font-mono uppercase">
                            {s.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="font-mono text-indigo-300">
                            {s.triggerType === "cron" ? `cron(${s.value})` : `every ${s.value} hours`}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSchedule(s.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-gray-900/80 transition-colors"
                        title={isZh ? "移除触发器" : "Remove Schedule"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Webhook Notifications Panel */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="pipeline-webhooks">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                {isZh ? "Webhook 实时通知" : "Webhook Notifications"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {isZh ? "开启此选项后，每次流水线打包编译成功均会向指定渠道发送模拟通知。" : "Toggle Slack or Discord integrations to receive simulated notifications when builds finish."}
              </p>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-900/80">
              <span className="text-xs font-semibold text-gray-300">
                {isZh ? "启用通知集成" : "Enable Webhook Integration"}
              </span>
              <button
                type="button"
                onClick={() => setWebhookEnabled(!webhookEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  webhookEnabled ? "bg-indigo-600" : "bg-gray-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    webhookEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Form Fields - Only enabled when webhookEnabled is true */}
            {webhookEnabled && (
              <div className="space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                      {isZh ? "通知服务平台:" : "Service Type:"}
                    </label>
                    <div className="flex rounded-lg border border-gray-800 bg-gray-950 p-0.5">
                      <button
                        type="button"
                        onClick={() => setWebhookType("slack")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "slack"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Slack
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebhookType("discord")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "discord"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Discord
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebhookType("teams")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "teams"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Teams
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                      {isZh ? "目标频道名称:" : "Target Channel:"}
                    </label>
                    <input
                      type="text"
                      value={webhookChannel}
                      onChange={(e) => setWebhookChannel(e.target.value)}
                      className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                      placeholder="#build-notifications"
                    />
                  </div>
                </div>


                {/* Simulated Delivery Logs */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-1">
                    {isZh ? "通知发送历史" : "Notification Delivery Logs"} ({webhookLogs.length})
                  </div>
                  {webhookLogs.length === 0 ? (
                    <div className="text-center text-[10px] text-gray-600 py-3 bg-gray-900/10 border border-dashed border-gray-900 rounded-lg">
                      {isZh ? "暂无发送记录。更新代码或点击测试可触发通知。" : "No notifications triggered yet."}
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {webhookLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-gray-950/80 border border-gray-850/60 rounded text-[9px] font-mono text-gray-300 flex items-start gap-1.5"
                        >
                          <span className={`inline-block h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                            log.type === "slack" ? "bg-amber-400" : "bg-indigo-400"
                          }`} />
                          <span className="break-all">{log.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          </div>

          <div className={leftTab === "envsync" ? "space-y-6 block" : "hidden"}>
            {/* Environment Sync & Drift Audit Panel */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="env-sync-panel">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-indigo-400" />
                    {isZh ? "生产/预发环境变量漂移检测器 (Environment Drift Detector)" : "Production vs Staging Environment Drift Detector"}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    {isZh 
                      ? "自动检测生产环境 (Production) 与预发环境 (Staging) 环境变量与引擎 SDK 版本的配置漂移，预防上线后因缺少配置导致的部署故障。" 
                      : "Detects and highlights drift between production and staging environment variables to prevent deployment failures."}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                  isSyncAligned 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                }`}>
                  {isSyncAligned ? (isZh ? "零漂移 (0% Drift)" : "0% Drift") : (isZh ? "检测到高风险漂移" : "High Risk Drift Detected")}
                </span>
              </div>

              {/* Drift Summary Cards */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">
                  <div className="text-[9px] uppercase font-bold text-gray-500">{isZh ? "审计变量总数" : "Total Vars"}</div>
                  <div className="text-sm font-mono font-bold text-gray-200 mt-0.5">6</div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">
                  <div className="text-[9px] uppercase font-bold text-gray-500">{isZh ? "一致项" : "Aligned"}</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{isSyncAligned ? "6" : "3"}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">
                  <div className="text-[9px] uppercase font-bold text-gray-500">{isZh ? "数值不匹配" : "Mismatch"}</div>
                  <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{isSyncAligned ? "0" : "2"}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800">
                  <div className="text-[9px] uppercase font-bold text-gray-500">{isZh ? "生产缺失项" : "Missing Prod"}</div>
                  <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">{isSyncAligned ? "0" : "1"}</div>
                </div>
              </div>

              {/* Environment Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "源环境 (Source):" : "Source Environment:"}</label>
                  <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-mono text-indigo-300 font-bold">
                    STAGING (staging-runner-02)
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{isZh ? "基准目标 (Baseline Target):" : "Baseline Target:"}</label>
                  <select
                    value={referenceEnv}
                    onChange={(e) => {
                      setReferenceEnv(e.target.value);
                      setIsSyncAligned(false);
                      setSyncOutputLogs([]);
                      showToast(isZh ? `已切换对比目标: ${e.target.value}` : `Switched target baseline to: ${e.target.value}`);
                    }}
                    className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-1.5 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gold-reference">PRODUCTION (K8s Golden Prod-01)</option>
                    <option value="staging-runner">STAGING SECONDARY (Fast-Ring Beta)</option>
                    <option value="lead-dev">LOCAL DEV WORKSTATION</option>
                  </select>
                </div>
              </div>

              {/* Variable Table */}
              <div className="border border-gray-900 rounded-lg overflow-hidden bg-gray-950/40 text-[11px]">
                <div className="grid grid-cols-12 bg-gray-900/60 p-2 border-b border-gray-900 font-bold text-gray-400 uppercase tracking-tighter">
                  <div className="col-span-4">{isZh ? "配置/环境变量名" : "Variable / Key"}</div>
                  <div className="col-span-3 text-center">{isZh ? "预发环境 (Staging)" : "Staging Value"}</div>
                  <div className="col-span-3 text-center">{isZh ? "生产环境 (Prod)" : "Production Baseline"}</div>
                  <div className="col-span-2 text-right">{isZh ? "漂移状态" : "Drift Status"}</div>
                </div>

                <div className="divide-y divide-gray-900/60 max-h-60 overflow-y-auto">
                  {getSyncVariables().map((v) => {
                    let badgeClass = "bg-emerald-950/40 text-emerald-400 border border-emerald-900/20";
                    let statusLabel = isZh ? "一致" : "Aligned";
                    
                    if (!isSyncAligned) {
                      if (v.status === "missing") {
                        badgeClass = "bg-rose-950/40 text-rose-400 border border-rose-900/20 animate-pulse";
                        statusLabel = isZh ? "生产缺失" : "Missing Prod";
                      } else if (v.status === "mismatch") {
                        badgeClass = "bg-amber-950/40 text-amber-400 border border-amber-900/20";
                        statusLabel = isZh ? "数值漂移" : "Mismatched";
                      }
                    }

                    return (
                      <div key={v.name} className="grid grid-cols-12 p-2 hover:bg-gray-900/20 transition-colors items-center font-mono text-[10px]">
                        <div className="col-span-4 font-semibold text-gray-300 truncate" title={v.name}>{v.name}</div>
                        <div className={`col-span-3 text-center truncate ${!isSyncAligned && v.status !== "aligned" ? "text-amber-400 font-bold" : "text-gray-400"}`}>
                          {isSyncAligned ? v.refVal : v.currVal}
                        </div>
                        <div className="col-span-3 text-center text-gray-400 truncate font-semibold">{v.refVal}</div>
                        <div className="col-span-2 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-sans font-semibold inline-block whitespace-nowrap ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={isSyncing || isSyncAligned}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? (isZh ? "正在强制对齐..." : "Aligning Env...") : isSyncAligned ? (isZh ? "已同步对齐" : "Fully Aligned") : (isZh ? "一键强制对齐 (Auto-Align)" : "Force Auto-Align & Sync")}</span>
                </button>
                {isSyncAligned && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSyncAligned(false);
                      setSyncOutputLogs([]);
                      showToast(isZh ? "已重置环境同步模拟" : "Reset environment sync simulator");
                    }}
                    className="py-2 px-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    {isZh ? "重置" : "Reset"}
                  </button>
                )}
              </div>

              {/* Console Sync Logs */}
              {syncOutputLogs.length > 0 && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 px-1 font-sans">
                    {isZh ? "环境对齐实时控制台" : "Sync Execution Terminal"}
                  </div>
                  <div className="p-2.5 bg-gray-950 border border-gray-850 rounded-lg max-h-36 overflow-y-auto font-mono text-[9px] text-indigo-300 space-y-1">
                    {syncOutputLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">
                        <span className="text-gray-600 mr-1.5">[{idx + 1}]</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CI/CD Template Gallery */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="ci-cd-gallery">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-indigo-400" />
                {isZh ? "CI/CD 模板库" : "CI/CD Template Gallery"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {isZh ? "选择下方的预制 CI 模板并将其注入到右侧代码视窗中。" : "Select a pre-configured workflow to inject into the pipeline editor."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {/* GitLab CI */}
              <button
                id="inject-gitlab"
                onClick={() => injectTemplate("GitLab CI", ".gitlab-ci.yml", "GitLab CI Configuration", projectType === "unity" ? GITLAB_TEMPLATE : GITLAB_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} pipeline config tailored for GitLab CI runners.`)}
                className="p-2.5 text-left rounded-lg bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate">
                  <span className="text-[11px] font-bold text-gray-200 group-hover:text-indigo-400 block truncate">GitLab CI Workflow</span>
                  <span className="text-[10px] text-gray-500 font-mono block">.gitlab-ci.yml</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              </button>
              {/* Bitbucket Pipelines */}
              <button
                id="inject-bitbucket"
                onClick={() => injectTemplate("Bitbucket", "bitbucket-pipelines.yml", "Bitbucket Pipelines Configuration", projectType === "unity" ? BITBUCKET_TEMPLATE : BITBUCKET_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} build pipeline for Bitbucket Cloud Pipelines.`)}
                className="p-2.5 text-left rounded-lg bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate">
                  <span className="text-[11px] font-bold text-gray-200 group-hover:text-indigo-400 block truncate">Bitbucket Pipelines</span>
                  <span className="text-[10px] text-gray-500 font-mono block">bitbucket-pipelines.yml</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              </button>
              {/* CircleCI */}
              <button
                id="inject-circleci"
                onClick={() => injectTemplate("CircleCI", ".circleci/config.yml", "CircleCI Configuration", projectType === "unity" ? CIRCLECI_TEMPLATE : CIRCLECI_TEMPLATE_UNREAL, `Automated ${projectType === "unity" ? "Unity" : "Unreal"} compilation workflow config for CircleCI container environments.`)}
                className="p-2.5 text-left rounded-lg bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate">
                  <span className="text-[11px] font-bold text-gray-200 group-hover:text-indigo-400 block truncate">CircleCI Workflow</span>
                  <span className="text-[10px] text-gray-500 font-mono block">.circleci/config.yml</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              </button>
              {/* TeamCity */}
              <button
                onClick={() => injectTemplate("TeamCity", "settings.kts", "TeamCity Configuration", TEAMCITY_TEMPLATE, "Automated Unreal build pipeline for TeamCity.")}
                className="p-2.5 text-left rounded-lg bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate">
                  <span className="text-[11px] font-bold text-gray-200 group-hover:text-orange-400 block truncate">TeamCity Kotlin DSL</span>
                  <span className="text-[10px] text-gray-500 font-mono block">settings.kts</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-orange-400 flex-shrink-0 transition-colors" />
              </button>
              {/* Perforce Sync */}
              <button
                onClick={() => injectTemplate("Perforce", "p4_sync_build.bat", "Perforce Sync Script", PERFORCE_TEMPLATE, "Perforce synchronization and build automation script.")}
                className="p-2.5 text-left rounded-lg bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-900 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate">
                  <span className="text-[11px] font-bold text-gray-200 group-hover:text-orange-400 block truncate">Perforce Sync & Build</span>
                  <span className="text-[10px] text-gray-500 font-mono block">p4_sync_build.bat</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-orange-400 flex-shrink-0 transition-colors" />
              </button>
            </div>
          </div>

          {/* Performance Visualization */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
                  {isZh ? "效能分析" : "Insights"}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">{isZh ? "构建耗时 vs 复杂度" : "Time vs Complexity"}</span>
            </div>
            
            <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="complexity" 
                    name="Complexity" 
                    unit="%" 
                    stroke="#4b5563" 
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="time" 
                    name="Build Time" 
                    unit="m" 
                    stroke="#4b5563" 
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '10px', color: '#d1d5db' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Scatter name="Builds" data={complexityData} fill="#6366f1" radius={3} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          </div>

          <div className={leftTab === "notifications" ? "space-y-6 block" : "hidden"}>

          {/* Build Failure Thresholds & Alerts Configurator */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-400" />
                {isZh ? "构建失败阈值与警报配置" : "Failure Thresholds & Alerts"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {isZh ? "配置触发严重告警的连续流水线失败次数及测试覆盖阈值。" : "Set tolerance parameters for automatic triggers when builds fail or test coverage dips."}
              </p>
            </div>

            {/* Threshold Sliders */}
            <div className="space-y-4 pt-1">
              {/* Consecutive Failures */}
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono uppercase">
                  <span className="text-gray-400 font-semibold">{isZh ? "连续失败阈值上限" : "Consecutive Failures Limit"}</span>
                  <span className="text-rose-400 font-bold">{consecutiveFailures} {isZh ? "次失败" : "failed builds"}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={consecutiveFailures}
                  onChange={(e) => setConsecutiveFailures(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Unit Test Failure Rate */}
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono uppercase">
                  <span className="text-gray-400 font-semibold">{isZh ? "单元测试失败率上限" : "Unit Test Failure Limit"}</span>
                  <span className="text-amber-400 font-bold">{testFailureRate}% {isZh ? "失败率" : "failure rate"}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={testFailureRate}
                  onChange={(e) => setTestFailureRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Compilation Warnings Threshold */}
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono uppercase">
                  <span className="text-gray-400 font-semibold">{isZh ? "编译警告数容忍上限" : "Compilation Warnings Limit"}</span>
                  <span className="text-blue-400 font-bold">{warningThreshold} {isZh ? "条警告" : "warnings"}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Target Channels */}
            <div className="space-y-2.5 pt-3 border-t border-gray-900">
              <span className="text-[10px] uppercase font-mono text-gray-500 font-bold block">
                {isZh ? "报警通知发送渠道" : "Alert Output Channels"}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${alertChannels.toast ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-300 animate-pulse" : "bg-gray-900/40 border-gray-900 text-gray-500"}`}>
                  <input
                    type="checkbox"
                    checked={alertChannels.toast}
                    onChange={(e) => setAlertChannels(prev => ({ ...prev, toast: e.target.checked }))}
                    className="rounded border-gray-800 text-indigo-600 focus:ring-0 cursor-pointer h-3.5 w-3.5 accent-indigo-500"
                  />
                  <span className="text-xs font-semibold font-sans">{isZh ? "系统弹窗 (Toast)" : "System Toast"}</span>
                </label>

                <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${alertChannels.desktop ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-300 animate-pulse" : "bg-gray-900/40 border-gray-900 text-gray-500"}`}>
                  <input
                    type="checkbox"
                    checked={alertChannels.desktop}
                    onChange={(e) => setAlertChannels(prev => ({ ...prev, desktop: e.target.checked }))}
                    className="rounded border-gray-800 text-indigo-600 focus:ring-0 cursor-pointer h-3.5 w-3.5 accent-indigo-500"
                  />
                  <span className="text-xs font-semibold font-sans">{isZh ? "桌面推播 (Push)" : "Desktop Alert"}</span>
                </label>
              </div>
            </div>

            {/* Simulated Event Trigger Button */}
            <button
              onClick={triggerSimulatedFailureAlert}
              className="w-full py-2 bg-rose-650 hover:bg-rose-600 active:scale-95 text-white border border-rose-500/20 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md shadow-rose-950/30 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="h-4 w-4 text-rose-300 animate-bounce" />
              <span>{isZh ? "模拟触发阈值警戒事件" : "TEST & TRIGGER FAILURE ALERT"}</span>
            </button>
          </div>
          </div>

          <div className={leftTab === "terraform" ? "space-y-6 block" : "hidden"}>
            {/* Tab header description */}
            <div className="bg-gradient-to-r from-teal-950/20 to-emerald-950/20 border border-gray-850 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 animate-pulse" />
                {isZh ? "Terraform 基础设施蓝图" : "Terraform Infrastructure Blueprint"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {isZh ? "选择云服务提供商、定义 auto-scaling 弹性伸缩节点组参数，实时生成符合生产标准的 Terraform HCL 基础设施代码蓝图。" : "Select cloud provider and set auto-scaling node pools. Output production-grade Terraform HCL config to provision ephemeral build runner clusters."}
              </p>
            </div>

            {/* Provider Selection */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans">
                  {isZh ? "选择云服务商" : "Cloud Provider"}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {isZh ? "选择用于托管构建集群的公有云基础设施平台。" : "Choose target public cloud platform for host nodes."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTerraformProvider("aws")}
                  className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    terraformProvider === "aws"
                      ? "bg-indigo-950/40 border-indigo-505 text-indigo-300 font-bold"
                      : "bg-gray-900/40 border-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-900/80"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-wide">AWS</span>
                  <span className="text-[9px] text-gray-500">EKS Cluster</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTerraformProvider("gcp")}
                  className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    terraformProvider === "gcp"
                      ? "bg-indigo-950/40 border-indigo-505 text-indigo-300 font-bold"
                      : "bg-gray-900/40 border-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-900/80"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-wide">GCP</span>
                  <span className="text-[9px] text-gray-500">GKE Cluster</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTerraformProvider("azure")}
                  className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    terraformProvider === "azure"
                      ? "bg-indigo-950/40 border-indigo-505 text-indigo-300 font-bold"
                      : "bg-gray-900/40 border-gray-900 text-gray-400 hover:text-gray-200 hover:bg-gray-900/80"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-wide">Azure</span>
                  <span className="text-[9px] text-gray-500">AKS Cluster</span>
                </button>
              </div>
            </div>

            {/* Cloud Account Linker */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm" id="cloud-account-linker">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-amber-400" />
                    {isZh ? "云端凭证安全管理 (IAM Vault)" : "Cloud Account Linker (IAM Vault)"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {isZh ? "安全链接并托管 AWS/GCP/Azure 权限密钥，使 Terraform 能够自动化部署和调度算力集群。" : "Securely link AWS/GCP/Azure IAM credentials so Terraform can automatically deploy cloud infrastructure."}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/40 text-amber-400 border border-amber-900/40 uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  AES-256
                </span>
              </div>

              {/* Filter and show existing accounts for selected provider */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  {isZh ? "已链接的云端凭证账户" : "Linked Cloud Credentials"} ({terraformProvider.toUpperCase()})
                </span>

                {cloudAccounts.filter(acc => acc.provider === terraformProvider).length === 0 ? (
                  <div className="p-3 bg-gray-900/30 border border-dashed border-gray-800 rounded-lg text-center">
                    <p className="text-xs text-gray-500 font-sans">
                      {isZh ? "当前提供商没有链接的密钥账户，请在下方添加。" : "No linked credentials for this provider. Add one below to enable automated deployments."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {cloudAccounts.filter(acc => acc.provider === terraformProvider).map(acc => (
                      <div
                        key={acc.id}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          acc.active 
                            ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-100" 
                            : "bg-gray-900/20 border-gray-900/60 text-gray-400 hover:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCloudAccounts(prev => prev.map(a => 
                                a.provider === terraformProvider ? { ...a, active: a.id === acc.id } : a
                              ));
                              if (setToastMessage) {
                                setToastMessage(isZh ? `已激活凭证账户: ${acc.name}` : `Activated credential account: ${acc.name}`);
                                setTimeout(() => setToastMessage(null), 3000);
                              }
                            }}
                            className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              acc.active 
                                ? "border-indigo-500 bg-indigo-500 text-white" 
                                : "border-gray-700 hover:border-gray-500"
                            }`}
                          >
                            {acc.active && <Check className="h-3 w-3" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold font-sans flex items-center gap-1.5">
                              {acc.name}
                              {acc.active && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-wider">
                                  {isZh ? "已启用" : "Active Provider"}
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] text-gray-500 font-mono mt-0.5">
                              {acc.provider === "aws" && `Region: ${acc.regionOrProject} | Key: ${acc.accessKeyOrClientId.substring(0, 8)}...`}
                              {acc.provider === "gcp" && `Project: ${acc.regionOrProject} | SA Email: ${acc.accessKeyOrClientId.substring(0, 20)}...`}
                              {acc.provider === "azure" && `Tenant: ${acc.regionOrProject.substring(0, 8)}... | Client: ${acc.accessKeyOrClientId.substring(0, 8)}...`}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCloudAccounts(prev => prev.filter(a => a.id !== acc.id));
                            if (setToastMessage) {
                              setToastMessage(isZh ? `已移除凭证账户: ${acc.name}` : `Removed credential account: ${acc.name}`);
                              setTimeout(() => setToastMessage(null), 3000);
                            }
                          }}
                          className="p-1 hover:text-rose-400 text-gray-600 rounded transition-colors cursor-pointer"
                          title="Remove credential"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Account Expandable */}
              <div>
                {!showAddAccountForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNewAccName(`${terraformProvider.toUpperCase()}-Credential-${Date.now().toString().substring(10)}`);
                      setNewAccRegionOrProj(terraformProvider === "aws" ? "us-west-2" : terraformProvider === "gcp" ? "devops-hub-main-project" : "00000000-0000-0000-0000-000000000000");
                      setNewAccKeyId("");
                      setNewAccSecret("");
                      setShowAddAccountForm(true);
                    }}
                    className="w-full py-1.5 border border-dashed border-gray-800 hover:border-indigo-500/50 hover:bg-indigo-950/10 text-xs font-semibold text-gray-400 hover:text-indigo-300 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isZh ? `链接新 ${terraformProvider.toUpperCase()} 密钥凭证` : `Link New ${terraformProvider.toUpperCase()} Credential`}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-gray-900/20 border border-gray-850 rounded-lg space-y-3 animate-in slide-in-from-top duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-300 font-sans flex items-center gap-1">
                        <Key className="h-3 w-3 text-indigo-400" />
                        {isZh ? `新建 ${terraformProvider.toUpperCase()} 凭证链接` : `Link ${terraformProvider.toUpperCase()} Credentials`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddAccountForm(false)}
                        className="text-gray-500 hover:text-gray-300 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-gray-500">{isZh ? "账户名称 / Alias:" : "Account Alias / Name:"}</label>
                        <input
                          type="text"
                          value={newAccName}
                          onChange={(e) => setNewAccName(e.target.value)}
                          className="w-full text-xs bg-gray-950 border border-gray-850 rounded p-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
                          placeholder="AWS-Main-IAM"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-gray-500">
                          {terraformProvider === "aws" ? (isZh ? "默认区域 / Region:" : "Default Region:") : 
                           terraformProvider === "gcp" ? (isZh ? "项目 ID / Project ID:" : "GCP Project ID:") : 
                           (isZh ? "订阅 ID / Subscription ID:" : "Azure Subscription ID:")}
                        </label>
                        <input
                          type="text"
                          value={newAccRegionOrProj}
                          onChange={(e) => setNewAccRegionOrProj(e.target.value)}
                          className="w-full text-xs bg-gray-950 border border-gray-850 rounded p-1.5 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                          placeholder={terraformProvider === "aws" ? "us-west-2" : terraformProvider === "gcp" ? "devops-hub-core-infra" : "00000000-0000-0000-0000-000000000000"}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-gray-500">
                        {terraformProvider === "aws" ? (isZh ? "Access Key ID (公钥 ID):" : "AWS Access Key ID:") : 
                         terraformProvider === "gcp" ? (isZh ? "服务账户邮箱 / SA Email:" : "Service Account Email:") : 
                         (isZh ? "客户端 ID / Client (App) ID:" : "Azure Client ID:")}
                      </label>
                      <input
                        type="text"
                        value={newAccKeyId}
                        onChange={(e) => setNewAccKeyId(e.target.value)}
                        className="w-full text-xs bg-gray-950 border border-gray-850 rounded p-1.5 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                        placeholder={terraformProvider === "aws" ? "AKIAIOSFODNN7EXAMPLE" : terraformProvider === "gcp" ? "terraform-deployer@devops-hub.iam.gserviceaccount.com" : "00000000-0000-0000-0000-000000000000"}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-gray-500">
                        {terraformProvider === "aws" ? (isZh ? "Secret Access Key (私钥):" : "AWS Secret Access Key:") : 
                         terraformProvider === "gcp" ? (isZh ? "服务账号 JSON 密钥内容:" : "Service Account Key JSON:") : 
                         (isZh ? "客户端秘钥 / Client Secret:" : "Azure Client Secret:")}
                      </label>
                      {terraformProvider === "gcp" ? (
                        <textarea
                          value={newAccSecret}
                          onChange={(e) => setNewAccSecret(e.target.value)}
                          rows={3}
                          className="w-full text-xs bg-gray-950 border border-gray-850 rounded p-1.5 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                          placeholder="{'type': 'service_account', 'project_id': ...}"
                        />
                      ) : (
                        <input
                          type="password"
                          value={newAccSecret}
                          onChange={(e) => setNewAccSecret(e.target.value)}
                          className="w-full text-xs bg-gray-950 border border-gray-850 rounded p-1.5 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                          placeholder="••••••••••••••••••••••••••••••••"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddAccountForm(false)}
                        className="px-3 py-1 bg-gray-900 border border-gray-850 text-[11px] font-bold text-gray-400 hover:text-gray-200 rounded cursor-pointer"
                      >
                        {isZh ? "取消" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newAccName || !newAccKeyId) {
                            alert(isZh ? "请填写必要的凭证信息。" : "Please complete alias and Key ID fields.");
                            return;
                          }
                          const newAccount = {
                            id: "acc-" + Date.now(),
                            provider: terraformProvider,
                            name: newAccName,
                            regionOrProject: newAccRegionOrProj,
                            accessKeyOrClientId: newAccKeyId,
                            secretKeyOrClientSecret: newAccSecret,
                            active: true // make active by default
                          };

                          // Make others of the same provider inactive
                          setCloudAccounts(prev => prev.map(a => 
                            a.provider === terraformProvider ? { ...a, active: false } : a
                          ).concat(newAccount));

                          setShowAddAccountForm(false);
                          if (setToastMessage) {
                            setToastMessage(isZh ? `已链接并激活云凭证: ${newAccName}` : `Successfully linked and activated credentials: ${newAccName}`);
                            setTimeout(() => setToastMessage(null), 3000);
                          }
                        }}
                        className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 text-[11px] font-bold text-white rounded cursor-pointer"
                      >
                        {isZh ? "保存并链接" : "Link Account"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cluster Configurator */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-sans">
                  {isZh ? "节点与规格参数" : "Cluster Resource Tuning"}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {isZh ? "调配托管集群的弹性伸缩上限及单个构建跑主机的机器规格。" : "Tune automatic scale bounds and machine hardware profile for compiling hosts."}
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Cluster Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {isZh ? "集群标识符 / Name:" : "Cluster Identifier / Name:"}
                  </label>
                  <input
                    type="text"
                    value={terraformClusterName}
                    onChange={(e) => setTerraformClusterName(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                    className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="devops-hub-runner-cluster"
                  />
                </div>

                {/* Nodes Range Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-gray-400">{isZh ? "弹性节点伸缩范围" : "Runner Scale Bounds"}</span>
                    <span className="text-teal-400 font-bold">{terraformMinNodes} ~ {terraformMaxNodes} Nodes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[9px] text-gray-500 block mb-1">Min Nodes</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={terraformMinNodes}
                        onChange={(e) => {
                          const minVal = parseInt(e.target.value);
                          setTerraformMinNodes(minVal);
                          if (terraformMaxNodes < minVal) setTerraformMaxNodes(minVal);
                        }}
                        className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 block mb-1">Max Nodes</span>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={terraformMaxNodes}
                        onChange={(e) => {
                          const maxVal = parseInt(e.target.value);
                          setTerraformMaxNodes(Math.max(terraformMinNodes, maxVal));
                        }}
                        className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Instance Type Select */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {isZh ? "虚拟机实例规格:" : "Machine Instance Type:"}
                  </label>
                  <select
                    value={terraformInstanceType}
                    onChange={(e) => setTerraformInstanceType(e.target.value)}
                    className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500 font-mono font-semibold"
                  >
                    {terraformProvider === "aws" && (
                      <>
                        <option value="c6i.xlarge">c6i.xlarge (Compute Optimized, 4 vCPU, 8GB RAM)</option>
                        <option value="m6i.xlarge">m6i.xlarge (General Purpose, 4 vCPU, 16GB RAM)</option>
                        <option value="c6i.2xlarge">c6i.2xlarge (Heavy Compile, 8 vCPU, 16GB RAM)</option>
                      </>
                    )}
                    {terraformProvider === "gcp" && (
                      <>
                        <option value="c2-standard-4">c2-standard-4 (Compute Optimized, 4 vCPU, 16GB RAM)</option>
                        <option value="n2-standard-4">n2-standard-4 (Balanced, 4 vCPU, 16GB RAM)</option>
                        <option value="c2-standard-8">c2-standard-8 (High-Core Compiler, 8 vCPU, 32GB RAM)</option>
                      </>
                    )}
                    {terraformProvider === "azure" && (
                      <>
                        <option value="Standard_D4ds_v5">Standard_D4ds_v5 (General Purpose, 4 vCPU, 16GB RAM)</option>
                        <option value="Standard_F4s_v2">Standard_F4s_v2 (Compute Optimized, 4 vCPU, 8GB RAM)</option>
                        <option value="Standard_D8ds_v5">Standard_D8ds_v5 (Heavy Build, 8 vCPU, 32GB RAM)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Code Output Visualizer Card */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">
                  {terraformProvider === "aws" ? "main.tf" : terraformProvider === "gcp" ? "gke.tf" : "aks.tf"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getTerraformHcl());
                      showToast(isZh ? "Terraform HCL 蓝图已成功复制！" : "Terraform blueprint HCL copied!");
                    }}
                    className="p-1 px-2 bg-indigo-900/40 text-[10px] hover:bg-indigo-900 hover:text-white text-indigo-300 border border-indigo-800 rounded transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{isZh ? "复制" : "Copy"}</span>
                  </button>
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([getTerraformHcl()], { type: "text/plain" });
                      element.href = URL.createObjectURL(file);
                      element.download = terraformProvider === "aws" ? "main.tf" : terraformProvider === "gcp" ? "gke.tf" : "aks.tf";
                      document.body.appendChild(element);
                      element.click();
                      showToast(isZh ? "下载基础设施 Terraform 蓝图文件" : "Downloading Terraform HCL blueprint...");
                    }}
                    className="p-1 px-2 bg-gray-900 hover:bg-gray-800 hover:text-white text-[10px] text-gray-300 border border-gray-800 rounded transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Download className="h-3 w-3" />
                    <span>{isZh ? "下载" : "Download"}</span>
                  </button>
                </div>
              </div>

              {/* HCL Editor Code View Box */}
              <div className="p-3 bg-gray-950 border border-gray-900 rounded-lg font-mono text-[9.5px] leading-relaxed text-indigo-200 overflow-x-auto max-h-[280px] overflow-y-auto whitespace-pre select-all shadow-inner">
                {getTerraformHcl()}
              </div>

              {/* Quick Lint Status Bar */}
              <div className="flex items-center justify-between p-2.5 bg-indigo-950/10 border border-indigo-950/40 rounded-lg text-[10.5px]">
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-semibold">{isZh ? "IaC 静态分析无警告" : "HCL Blueprint fully compliant"}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-500 font-bold">v1.27 / tf-lint pass</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Code Display Column */}
        <div className="lg:col-span-8 flex flex-col min-h-[550px]">
          
          <div className="flex items-center gap-4 mb-4 bg-gray-900/40 p-4 rounded-xl border border-gray-800">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={codeQualityGate}
                onChange={(e) => setCodeQualityGate(e.target.checked)}
                className="accent-indigo-600"
              />
              Enable Code Quality Gate (Clang-Format + Cppcheck)
            </label>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-gray-950 border border-gray-900 rounded-xl p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="github-sync-btn"
                onClick={() => {
                  setSyncStatus("idle");
                  setIsGithubSyncOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-semibold text-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Github className="h-4 w-4 text-indigo-400" />
                <span>{isZh ? "同步至 GitHub Actions" : "Sync with GitHub"}</span>
              </button>

              <button
                id="simulate-run-btn"
                onClick={() => {
                  setIsSimulateOpen(true);
                  startPipelineSimulation();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-950/20 to-indigo-900/10 border border-indigo-950 hover:border-indigo-800 rounded-lg text-xs font-semibold text-indigo-300 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current text-indigo-400 animate-pulse" />
                <span>{isZh ? "运行沙盒模拟" : "Simulate Run"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
              <span>{isZh ? "运行引擎：" : "Engine:"}</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-300 font-bold uppercase border border-indigo-900/40">{projectType}</span>
            </div>
          </div>

          {/* File Tab Buttons */}
          <div className="flex border-b border-gray-800 bg-gray-950 rounded-t-xl p-1 overflow-x-auto gap-1">
            {generatedCodes && Object.keys(generatedCodes).map((key) => {
              const codeObj = generatedCodes[key as CodeType];
              const isActive = activeCodeTab === key;
              
              const getIcon = () => {
                if (key === "csharp" || key === "cpp" || key === "python") return <Cpu className="h-3.5 w-3.5" />;
                if (key === "docker") return <Package className="h-3.5 w-3.5" />;
                if (key === "github") return <FileText className="h-3.5 w-3.5" />;
                return <FileCode className="h-3.5 w-3.5" />;
              };

              return (
                <button
                  key={key}
                  onClick={() => setActiveCodeTab(key as CodeType)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                  }`}
                >
                  {getIcon()}
                  <span>{codeObj.filename}</span>
                </button>
              );
            })}
            
            {!generatedCodes && (
              <div className="px-4 py-2.5 text-xs text-gray-600 italic">
                {isZh ? "配置后生成脚本..." : "Configure to generate scripts..."}
              </div>
            )}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 bg-gray-950 border border-t-0 border-gray-800 rounded-b-xl flex flex-col overflow-hidden relative">
            
            {loading && (
              <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-mono text-gray-400">{t("compilingRules")}</span>
                </div>
              </div>
            )}

            {errorMessage ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <div className="bg-red-950/40 text-red-400 border border-red-900 rounded-xl p-4 max-w-md">
                  <p className="text-xs font-semibold mb-1">{t("errorPipeline")}</p>
                  <p className="text-[11px] text-red-300 font-mono leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            ) : activeCodeObj ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header Action bar inside Panel */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/40 text-xs">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="font-semibold text-gray-300">{activeCodeObj.title}</span>
                    <span className="text-gray-600">|</span>
                    <span className="font-mono text-[10px] text-gray-500">{activeCodeObj.filename}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      id="compare-configs-btn"
                      onClick={() => setIsCompareModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition-all font-sans font-medium cursor-pointer"
                      title={isZh ? "对比不同平台的配置文件" : "Compare build configuration files"}
                    >
                      <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{isZh ? "对比配置" : "Compare"}</span>
                    </button>

                    <button
                      id="copy-code-btn"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-800 text-gray-200 hover:bg-indigo-600 hover:text-white transition-all font-sans font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-300" />
                          <span className="text-xs">{t("copied")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="text-xs">{t("copyCode")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Script Code Block */}
                <div className="flex-1 overflow-auto p-5 font-mono text-xs text-gray-300 leading-relaxed bg-gray-950/40">
                  <pre className="whitespace-pre">{activeCodeObj.code}</pre>
                </div>

                {/* Explanation Block */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/30 text-xs text-gray-400 flex items-start gap-3">
                  <Info className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-300 block mb-0.5">{t("deploymentNote")}:</span>
                    <p className="leading-relaxed text-gray-400">{activeCodeObj.explanation}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 p-6 flex items-center justify-center">
                <span className="text-xs font-mono text-gray-500">{t("configureSteps")}</span>
              </div>
            )}
          </div>

        </div>

      </div>
      ) : activeMode === "kanban" ? (
        renderKanbanView()
      ) : (
        renderConfigView()
      )}

      {/* Floating Export Configuration Button */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end gap-2">
        {showExportMenu && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-2.5 shadow-2xl flex flex-col gap-1 w-48 text-xs font-sans animate-in fade-in slide-in-from-bottom-3 duration-150">
            <span className="px-2.5 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider block border-b border-gray-900 pb-1.5 mb-1.5">
              {t("exportConfig")}
            </span>
            <button
              id="export-json-btn"
              onClick={handleExportJson}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-indigo-600 hover:text-white text-gray-300 text-left transition-all cursor-pointer font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t("downloadJson")}</span>
            </button>
            <button
              id="export-yaml-btn"
              onClick={handleExportYaml}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-indigo-600 hover:text-white text-gray-300 text-left transition-all cursor-pointer font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t("downloadYaml")}</span>
            </button>
            <button
              id="export-pdf-btn"
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-emerald-600 hover:text-white text-gray-300 text-left transition-all cursor-pointer font-medium border-t border-gray-900/40 mt-1"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isZh ? "下载 PDF 报告" : "Download PDF Report"}</span>
            </button>
          </div>
        )}
        <button
          id="export-toggle-btn"
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Export pipeline state to JSON or YAML"
        >
          <Download className="h-4 w-4" />
          <span>{t("exportConfig")}</span>
        </button>
      </div>

      {/* Side-by-Side Compare Modal */}
      {isCompareModalOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          id="compare-modal-overlay"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
              <div>
                <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  {isZh ? "对比打包配置文件" : "Compare Build Configurations"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isZh ? "选择两个不同的平台配置文件，高亮显示配置键值差异，排查构建配置不一致问题。" : "Select two platform configuration presets to inspect property discrepancies side-by-side."}
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs cursor-pointer font-sans"
              >
                {isZh ? "关闭" : "Close"}
              </button>
            </div>

            {/* Selector Fields */}
            <div className="p-4 bg-gray-950/40 border-b border-gray-850/60 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{isZh ? "配置文件 A (源):" : "Configuration A (Source):"}</label>
                <select
                  value={compareLeftId}
                  onChange={(e) => setCompareLeftId(e.target.value)}
                  className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
                >
                  <optgroup label="Engines">
                    <option value="unity">Unity Config</option>
                    <option value="unreal">Unreal Config</option>
                  </optgroup>
                  <optgroup label="Platforms">
                    <option value="android">android-build.json</option>
                    <option value="ios">ios-build.json</option>
                    <option value="webgl">webgl-build.json</option>
                    <option value="standalone">standalone-build.json</option>
                  </optgroup>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{isZh ? "配置文件 B (对比):" : "Configuration B (Target):"}</label>
                <select
                  value={compareRightId}
                  onChange={(e) => setCompareRightId(e.target.value)}
                  className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
                >
                  <optgroup label="Engines">
                    <option value="unity">Unity Config</option>
                    <option value="unreal">Unreal Config</option>
                  </optgroup>
                  <optgroup label="Platforms">
                    <option value="android">android-build.json</option>
                    <option value="ios">ios-build.json</option>
                    <option value="webgl">webgl-build.json</option>
                    <option value="standalone">standalone-build.json</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Side-by-Side Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-950/20">
              <div className="grid grid-cols-2 gap-4 font-mono text-[11px]">
                {/* Left Preset */}
                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest block">
                    {compareLeftId === "unity" || compareLeftId === "unreal" ? `${compareLeftId.toUpperCase()} Default Config` : `${compareLeftId}-build.json`}
                  </span>
                  <div className="bg-gray-950 border border-gray-850 rounded-xl p-3 space-y-2.5">
                    {Object.entries(COMPARE_PRESETS[compareLeftId]).map(([key, val]) => {
                      const isDiff = COMPARE_PRESETS[compareLeftId][key] !== COMPARE_PRESETS[compareRightId][key];
                      return (
                        <div 
                          key={key} 
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                            isDiff 
                              ? "bg-red-950/25 border-red-900/40 text-red-200" 
                              : "bg-gray-900/30 border-gray-850/40 text-gray-300"
                          }`}
                        >
                          <span className="text-gray-500 font-bold font-mono">{key}:</span>
                          <span className="font-semibold text-right max-w-[160px] truncate">{JSON.stringify(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Preset */}
                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest block">
                    {compareRightId === "unity" || compareRightId === "unreal" ? `${compareRightId.toUpperCase()} Default Config` : `${compareRightId}-build.json`}
                  </span>
                  <div className="bg-gray-950 border border-gray-850 rounded-xl p-3 space-y-2.5">
                    {Object.entries(COMPARE_PRESETS[compareRightId]).map(([key, val]) => {
                      const isDiff = COMPARE_PRESETS[compareLeftId][key] !== COMPARE_PRESETS[compareRightId][key];
                      return (
                        <div 
                          key={key} 
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                            isDiff 
                              ? "bg-emerald-950/25 border-emerald-900/40 text-emerald-200" 
                              : "bg-gray-900/30 border-gray-850/40 text-gray-300"
                          }`}
                        >
                          <span className="text-gray-500 font-bold font-mono">{key}:</span>
                          <span className="font-semibold text-right max-w-[160px] truncate">{JSON.stringify(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-950/40 border-t border-gray-850/80 flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold font-sans cursor-pointer transition-colors"
              >
                {isZh ? "完成对比" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      <GithubSyncModal
        isOpen={isGithubSyncOpen}
        onClose={() => setIsGithubSyncOpen(false)}
        isZh={isZh}
        githubRepoName={githubRepoName}
        setGithubRepoName={setGithubRepoName}
        syncStatus={syncStatus}
        setSyncStatus={setSyncStatus}
        workflowYaml={generateGitHubActionsWorkflowYaml()}
        showToast={showToast}
      />

      {/* Simulation Sandbox Modal */}
      <SimulationSandboxModal
        isOpen={isSimulateOpen}
        onClose={() => {
          setIsSimRunning(false);
          if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
          if (simIntervalRef.current) clearInterval(simIntervalRef.current);
          setIsSimulateOpen(false);
        }}
        isZh={isZh}
        projectType={projectType}
        platform={platform}
        simSteps={simSteps}
        activeSimStepIdx={activeSimStepIdx}
        isSimRunning={isSimRunning}
        simElapsedTime={simElapsedTime}
        simLogs={simLogs}
        triggerSimulation={triggerSimulation}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-indigo-500 text-indigo-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-sans font-semibold z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
