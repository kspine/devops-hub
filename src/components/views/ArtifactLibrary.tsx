import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Package, 
  Download, 
  RotateCcw, 
  Send, 
  Filter, 
  Search, 
  ExternalLink,
  Shield,
  ShieldCheck,
  FileArchive,
  ArrowRightLeft,
  ChevronRight,
  HardDrive,
  Brain,
  Plus,
  RefreshCw,
  GitBranch,
  Play,
  Sparkles,
  Check,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  Sliders,
  Server,
  FileCode,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../LanguageContext";
import { Artifact } from "../../types";
import { useWorkspace } from "../../WorkspaceContext";
import { useToast } from "../ToastContext";

interface AIModel {
  id: string;
  name: string;
  framework: "PyTorch" | "ONNX" | "TensorRT" | "TensorFlow";
  version: string;
  category: string;
  size: string;
  metricName: string;
  metricValue: string;
  createdAt: string;
  buildId: string;
  history: Array<{
    version: string;
    createdAt: string;
    metricValue: string;
    descriptionEn: string;
    descriptionZh: string;
  }>;
}

export default function ArtifactLibrary() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"builds" | "models" | "policies">("builds");

  // Retention Policies States
  const [retentionRules, setRetentionRules] = useState([
    {
      id: "rule-1",
      name: isZh ? "清理未标记的游戏二进制包 (30天过期)" : "Cleanup untagged game binaries (30d older)",
      target: "builds" as const,
      days: 30,
      keepTagged: true,
      keepTaggedValue: "production, staging",
      active: true,
      lastExecuted: "2026-07-18 04:00"
    },
    {
      id: "rule-2",
      name: isZh ? "自动清理过期的 AI 临时检查点 (14天过期)" : "Auto-clean expired PyTorch checkpoints (14d older)",
      target: "models" as const,
      days: 14,
      keepTagged: true,
      keepTaggedValue: "v3.0.1, v1.5.0-stable",
      active: true,
      lastExecuted: "2026-07-17 04:00"
    },
    {
      id: "rule-3",
      name: isZh ? "清理本地测试用的 Docker 临时构建层 (7天过期)" : "Cleanup test container layer artifacts (7d older)",
      target: "builds" as const,
      days: 7,
      keepTagged: false,
      keepTaggedValue: "",
      active: false,
      lastExecuted: "Never"
    }
  ]);

  // Form states for creating a new retention policy rule
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleTarget, setNewRuleTarget] = useState<"builds" | "models">("builds");
  const [newRuleDays, setNewRuleDays] = useState(30);
  const [newRuleKeepTagged, setNewRuleKeepTagged] = useState(true);
  const [newRuleKeepTaggedValue, setNewRuleKeepTaggedValue] = useState("stable, production");

  const [isSimulatingCleanup, setIsSimulatingCleanup] = useState(false);
  const [cleanupSimLogs, setCleanupSimLogs] = useState<string[]>([]);
  
  // Registration form states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [newModelCategory, setNewModelCategory] = useState("NPC Dialogue / NLP");
  const [newModelFramework, setNewModelFramework] = useState<"PyTorch" | "ONNX" | "TensorRT" | "TensorFlow">("PyTorch");
  const [newModelVersion, setNewModelVersion] = useState("v1.0.0");
  const [newModelSize, setNewModelSize] = useState("450 MB");
  const [newModelMetricName, setNewModelMetricName] = useState("Accuracy");
  const [newModelMetricValue, setNewModelMetricValue] = useState("97.2%");
  const [newModelBuildId, setNewModelBuildId] = useState("build-ai-101");

  // Selection states for detail panels
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Optimization simulation state
  const [optimizingModelId, setOptimizingModelId] = useState<string | null>(null);
  const [optimizingProgress, setOptimizingProgress] = useState(0);
  const [optimizingLogs, setOptimizingLogs] = useState<string[]>([]);
  const [optimizedTargetFramework, setOptimizedTargetFramework] = useState<"ONNX" | "TensorRT">("ONNX");
  const optimLogEndRef = useRef<HTMLDivElement>(null);

  // Base list of AI models
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: "model-001",
      name: "NPC_Dialogue_Core_LLM",
      framework: "PyTorch",
      version: "v2.1.0-alpha",
      category: "NPC NLP/Dialogue",
      size: "1.4 GB",
      metricName: isZh ? "困惑度 (PPL)" : "Perplexity",
      metricValue: "4.12",
      createdAt: "2026-07-15 14:32",
      buildId: "build-ai-201",
      history: [
        {
          version: "v2.1.0-alpha",
          createdAt: "2026-07-15 14:32",
          metricValue: "4.12",
          descriptionEn: "Initialized model with deep conversational dataset and fine-tuned core layer.",
          descriptionZh: "加载全新深层对话数据集，微调解码器核心层参数。"
        },
        {
          version: "v2.0.0",
          createdAt: "2026-07-01 09:15",
          metricValue: "4.89",
          descriptionEn: "Base pre-trained model for generic NPC prompt completions.",
          descriptionZh: "通用 NPC 任务提示词基座模型，完成冷启动对齐。"
        }
      ]
    },
    {
      id: "model-002",
      name: "RL_Pathfinding_Navigation",
      framework: "ONNX",
      version: "v1.5.0-stable",
      category: "Pathfinding / Navigation",
      size: "120 MB",
      metricName: isZh ? "寻路准确率" : "Nav Accuracy",
      metricValue: "99.2%",
      createdAt: "2026-07-18 10:15",
      buildId: "build-ai-184",
      history: [
        {
          version: "v1.5.0-stable",
          createdAt: "2026-07-18 10:15",
          metricValue: "99.2%",
          descriptionEn: "Exported as optimized static graph with high pathfinding convergence rates.",
          descriptionZh: "导出为高收敛效率的静态图模型，解决复杂多地形障碍问题。"
        },
        {
          version: "v1.4.2",
          createdAt: "2026-07-10 16:30",
          metricValue: "97.5%",
          descriptionEn: "Intermediate reinforcement learning agent training checkpoint.",
          descriptionZh: "强化学习中间态训练 Checkpoint，解决碰撞体绕行边界。"
        }
      ]
    },
    {
      id: "model-003",
      name: "Facial_Anim_Synthesis_LipSync",
      framework: "TensorRT",
      version: "v3.0.1",
      category: "Procedural Animation",
      size: "350 MB",
      metricName: isZh ? "口型同步延迟" : "Lip-Sync Delay",
      metricValue: "8.5ms",
      createdAt: "2026-07-19 08:44",
      buildId: "build-ai-222",
      history: [
        {
          version: "v3.0.1",
          createdAt: "2026-07-19 08:44",
          metricValue: "8.5ms",
          descriptionEn: "Compiled FP16 engine to achieve ultra-low P99 inference delay on device.",
          descriptionZh: "编译为 FP16 精度的 TensorRT 引擎，实现本地极低 P99 推理时延。"
        },
        {
          version: "v3.0.0",
          createdAt: "2026-07-14 11:00",
          metricValue: "14.2ms",
          descriptionEn: "Unoptimized base ONNX model for lip-sync animation mapping.",
          descriptionZh: "未经过量化的原始 ONNX 口型同步模型计算骨架。"
        }
      ]
    }
  ]);

  // Handle active model detail selection default
  useEffect(() => {
    if (aiModels.length > 0 && !selectedModelId) {
      setSelectedModelId(aiModels[0].id);
    }
  }, [aiModels, selectedModelId]);

  // Autoscroll optimization logs
  useEffect(() => {
    if (optimLogEndRef.current) {
      optimLogEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [optimizingLogs]);

  // Traditional build artifacts
  const MOCK_ARTIFACTS = useMemo(() => {
    const wsPrefix = activeWorkspace ? activeWorkspace.name.replace(/\s+/g, '-') : 'DevOpsHub';
    const isMobile = activeWorkspace?.projectType === 'mobile';
    const isWeb = activeWorkspace?.projectType === 'web' || activeWorkspace?.projectType === 'fullstack';
    
    return [
      {
        id: "art-101",
        name: `${wsPrefix}-${isMobile ? 'Mobile-Client' : 'App'}`,
        version: "v2.4.0-stable",
        type: isMobile ? "apk" : "docker-image",
        size: "42.5 MB",
        checksum: "sha256:7e5a...",
        createdAt: "2026-07-19 12:00",
        buildId: "build-882",
        downloadUrl: "#",
        environment: "production"
      },
      {
        id: "art-102",
        name: `${wsPrefix}-Core-Engine`,
        version: "v2.4.0-rc.2",
        type: "binary",
        size: "128.9 MB",
        checksum: "sha256:f12b...",
        createdAt: "2026-07-19 15:45",
        buildId: "build-885",
        downloadUrl: "#",
        environment: "staging"
      },
      {
        id: "art-103",
        name: `${wsPrefix}-${isWeb ? 'Web-Bundle' : 'Assets'}`,
        version: "v2.3.9",
        type: isWeb ? "tar.gz" : "zip",
        size: "850 MB",
        checksum: "sha256:a9c1...",
        createdAt: "2026-07-18 09:00",
        buildId: "build-870",
        downloadUrl: "#",
        environment: "production"
      }
    ];
  }, [activeWorkspace]);

  // Filter lists based on search term
  const filteredBuilds = MOCK_ARTIFACTS.filter(art => 
    art.name.toLowerCase().includes(search.toLowerCase()) || 
    art.version.toLowerCase().includes(search.toLowerCase())
  );

  const filteredModels = aiModels.filter(model => 
    model.name.toLowerCase().includes(search.toLowerCase()) || 
    model.category.toLowerCase().includes(search.toLowerCase()) ||
    model.framework.toLowerCase().includes(search.toLowerCase())
  );

  // Registering a new AI model
  const handleRegisterModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) {
      addToast(isZh ? "请输入模型名称" : "Please enter model name", "error");
      return;
    }

    const newModel: AIModel = {
      id: `model-${Date.now()}`,
      name: newModelName.replace(/\s+/g, '_'),
      category: newModelCategory,
      framework: newModelFramework,
      version: newModelVersion,
      size: newModelSize,
      metricName: newModelMetricName,
      metricValue: newModelMetricValue,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      buildId: newModelBuildId,
      history: [
        {
          version: newModelVersion,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          metricValue: newModelMetricValue,
          descriptionEn: `Registered initial model file with performance metrics.`,
          descriptionZh: `成功在制品库注册初始模型，附带验证集评估指标。`
        }
      ]
    };

    setAiModels(prev => [newModel, ...prev]);
    setSelectedModelId(newModel.id);
    setIsRegisterOpen(false);

    // Reset inputs
    setNewModelName("");
    setNewModelVersion("v1.0.0");
    setNewModelSize("450 MB");
    setNewModelMetricValue("97.2%");

    addToast(
      isZh 
        ? `模型 [${newModel.name}] 已成功注册至 AI 制品中心` 
        : `Model [${newModel.name}] successfully registered to the AI Artifacts library`,
      "success"
    );
  };

  // Creating a new retention rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      addToast(isZh ? "请输入策略名称" : "Please enter policy name", "error");
      return;
    }

    const newRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      target: newRuleTarget,
      days: newRuleDays,
      keepTagged: newRuleKeepTagged,
      keepTaggedValue: newRuleKeepTaggedValue,
      active: true,
      lastExecuted: "Never"
    };

    setRetentionRules(prev => [...prev, newRule]);
    setIsRuleFormOpen(false);
    setNewRuleName("");
    setNewRuleDays(30);
    setNewRuleKeepTagged(true);
    setNewRuleKeepTaggedValue("stable, production");

    addToast(
      isZh 
        ? `保留策略 [${newRule.name}] 创建成功` 
        : `Retention policy [${newRule.name}] created successfully`,
      "success"
    );
  };

  // Toggle active status
  const handleToggleRule = (ruleId: string) => {
    const targetRule = retentionRules.find(r => r.id === ruleId);
    if (!targetRule) return;
    const nextActive = !targetRule.active;
    setRetentionRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: nextActive } : r));
    addToast(
      isZh 
        ? `策略 [${targetRule.name}] 已${nextActive ? "启用" : "停用"}` 
        : `Policy [${targetRule.name}] has been ${nextActive ? "activated" : "deactivated"}`,
      "info"
    );
  };

  // Delete a rule
  const handleDeleteRule = (ruleId: string) => {
    const ruleToDelete = retentionRules.find(r => r.id === ruleId);
    if (ruleToDelete) {
      setRetentionRules(prev => prev.filter(r => r.id !== ruleId));
      addToast(
        isZh 
          ? `已删除策略: ${ruleToDelete.name}` 
          : `Deleted policy: ${ruleToDelete.name}`,
        "warning"
      );
    }
  };

  // Run dry-run cleanup simulation
  const runRetentionSimulation = () => {
    setIsSimulatingCleanup(true);
    setCleanupSimLogs([
      "🔄 Starting automated retention policy dry-run simulation...",
      `📅 Current Timestamp: ${new Date().toLocaleString()}`,
      "🔍 Scanning artifact store metadata on S3 / Google Cloud Storage..."
    ]);

    addToast(
      isZh 
        ? "正在运行保留策略模拟评估..." 
        : "Running retention policy dry-run assessment...",
      "info"
    );

    const simulationSteps = [
      "🛡️ Evaluation rule: 'Cleanup untagged game binaries (30d older)'...",
      "  - Found build 'v2.3.9' matching 'stable' pattern. [KEEP]",
      "  - Found temporary build 'build-870' older than 30 days. No tags matching 'production' or 'staging'. [MARK FOR DELETION]",
      "💾 Evaluation rule: 'Auto-clean expired PyTorch checkpoints (14d older)'...",
      "  - Found PyTorch dialogue base checkpoint 'v2.0.0' (created 18 days ago). Untagged. [MARK FOR DELETION]",
      "🧹 Consolidated simulation results:",
      "  - Builds checked: 3, Marked for deletion: 1, Space to reclaim: 850 MB",
      "  - AI Models checked: 3, Marked for deletion: 1, Space to reclaim: 450 MB",
      "✨ [DRY-RUN DONE] Total Space Reclaimed: 1.30 GB"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < simulationSteps.length) {
        setCleanupSimLogs(prev => [...prev, simulationSteps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsSimulatingCleanup(false);
        setRetentionRules(prev => prev.map(r => r.active ? { ...r, lastExecuted: new Date().toLocaleTimeString() } : r));
        addToast(
          isZh 
            ? "保留策略对齐完成！释放了 1.30 GB 虚拟存储空间。" 
            : "Retention simulation complete! Saved 1.30 GB of virtual storage.",
          "success"
        );
      }
    }, 600);
  };

  // Simulated Model compilation and optimization pipeline
  const runOptimization = (modelId: string, targetFramework: "ONNX" | "TensorRT") => {
    const targetModel = aiModels.find(m => m.id === modelId);
    if (!targetModel) return;

    setOptimizingModelId(modelId);
    setOptimizedTargetFramework(targetFramework);
    setOptimizingProgress(0);
    setOptimizingLogs([
      `[SYSTEM] Connecting to AI Pipeline Acceleration nodes...`,
      `[SYSTEM] Worker attached. Tailing compilation logs for ${targetModel.name}...`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setOptimizingProgress(Math.min(step * 20, 100));

      const timeStr = new Date().toISOString().split('T')[1].split('.')[0];
      const logPool = [
        `[${timeStr}] [INFO] Reading original model weights (${targetModel.size})`,
        `[${timeStr}] [INFO] Verifying checksum and structure authenticity`,
        `[${timeStr}] [COMPILE] Tracing static computational graph structure...`,
        `[${timeStr}] [OPTIMIZE] Merging consecutive Batch Normalization and Linear layers`,
        `[${timeStr}] [OPTIMIZE] Performing operator fusion on convolutional backbones`,
        `[${timeStr}] [QUANTIZE] Calibrating dynamic weights with symmetric range mapping`,
        targetFramework === "TensorRT" 
          ? `[${timeStr}] [QUANTIZE] FP16 quantization active. Enabling TensorRT engine kernels`
          : `[${timeStr}] [CONVERT] Serializing computational nodes to standard protobuf definition`,
        `[${timeStr}] [COMPILING] Saving target serialized artifact file...`,
      ];

      if (step <= logPool.length) {
        setOptimizingLogs(prev => [...prev, logPool[step - 1]]);
      }

      if (step === 5) {
        // Complete state change
        clearInterval(interval);
        setTimeout(() => {
          setOptimizingLogs(prev => [
            ...prev,
            `[${timeStr}] [SUCCESS] Model compiled successfully!`,
            `[${timeStr}] [SUCCESS] Saved compiled binary to global CDN: ${targetModel.name}.${targetFramework === 'ONNX' ? 'onnx' : 'engine'}`,
            `[${timeStr}] [SUCCESS] Accuracy retention: 99.85%. Latency decrease: -65%.`
          ]);

          // Update state of model
          setAiModels(prevModels => prevModels.map(m => {
            if (m.id === modelId) {
              const newVersion = `v${parseInt(m.version.replace(/[^0-9]/g, '')) + 1}.0.0-optimized`;
              const currentMetricVal = parseFloat(m.metricValue);
              const newMetricVal = isNaN(currentMetricVal) 
                ? m.metricValue 
                : `${(currentMetricVal * 1.01).toFixed(2)}${m.metricValue.includes('%') ? '%' : ''}`;

              return {
                ...m,
                framework: targetFramework,
                version: newVersion,
                size: targetFramework === "TensorRT" ? `${(parseFloat(m.size) * 0.45).toFixed(0)} MB` : `${(parseFloat(m.size) * 0.75).toFixed(0)} MB`,
                metricValue: targetFramework === "TensorRT" && m.metricName.includes("Delay") ? "4.2ms" : newMetricVal,
                history: [
                  {
                    version: newVersion,
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    metricValue: targetFramework === "TensorRT" && m.metricName.includes("Delay") ? "4.2ms" : newMetricVal,
                    descriptionEn: `Optimized & quantized into high-performance ${targetFramework} computing engine for production inference.`,
                    descriptionZh: `成功优化并量化为高性能 ${targetFramework} 离线计算引擎，提升多核缓存利用率。`
                  },
                  ...m.history
                ]
              };
            }
            return m;
          }));

          setOptimizingModelId(null);
          addToast(
            isZh 
              ? `模型 [${targetModel.name}] 已成功优化编译至 ${targetFramework}` 
              : `Model [${targetModel.name}] successfully optimized & compiled into ${targetFramework}`,
            "success"
          );
        }, 1000);
      }
    }, 1000);
  };

  const selectedModel = useMemo(() => {
    return aiModels.find(m => m.id === selectedModelId) || null;
  }, [aiModels, selectedModelId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Package className="h-6 w-6 text-emerald-400" />
              {isZh ? "持续交付与制品中心" : "Continuous Delivery & Artifacts"}
            </h2>
            <div className="flex bg-gray-900 border border-gray-800 p-0.5 rounded-xl">
              <button 
                onClick={() => { setActiveSubTab("builds"); setSearch(""); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeSubTab === 'builds' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                {isZh ? "包体 & 传统镜像" : "Build Packages"}
              </button>
              <button 
                onClick={() => { setActiveSubTab("models"); setSearch(""); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'models' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Brain className="h-3 w-3" />
                {isZh ? "AI / ML 智能模型库" : "AI/ML Models"}
              </button>
              <button 
                onClick={() => { setActiveSubTab("policies"); setSearch(""); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'policies' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Sliders className="h-3 w-3 text-amber-400" />
                {isZh ? "保留策略与自动清理" : "Retention Policies"}
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {activeSubTab === "builds" 
              ? (isZh ? "集中管理所有游戏构建产物、版本镜像及分发包体" : "Centralized management of standard build artifacts, docker-images, and distribution packages")
              : activeSubTab === "models"
              ? (isZh ? "注册、版本管理以及在线编译/量化游戏内 AI 决策与 NPC 对话模型" : "Register, manage, and optimize neural networks, deep learning graphs, and AI models for games")
              : (isZh ? "定义构建包体与 AI 模型生命周期自动清理规则，预防存储空间溢出" : "Define lifecycle automated cleanup rules for build packages and AI models to prevent disk storage overflow")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              placeholder={isZh ? "搜索制品名称、指标..." : "Search artifacts, metadata..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 w-64 transition-all"
            />
          </div>
          
          <button
             onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "quality" }))}
             className="px-3 py-2 bg-gray-900 border border-gray-800 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
             <ShieldCheck className="h-4 w-4" />
             {isZh ? "质量分析" : "Quality Check"}
          </button>

          {activeSubTab === "models" && (
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              <Plus className="h-4 w-4" />
              {isZh ? "注册 AI 模型" : "Register Model"}
            </button>
          )}
        </div>
      </div>

      {/* Register Model Slide-Over Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-lg">
                    {isZh ? "注册新的 AI / ML 智能模型" : "Register New AI / ML Model"}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterModel} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "模型名称" : "MODEL NAME"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. NPC_Pathfinding_Agent"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "应用场景" : "CATEGORY"}</label>
                    <select
                      value={newModelCategory}
                      onChange={(e) => setNewModelCategory(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="NPC Dialogue / NLP">{isZh ? "NPC 智能对话 / NLP" : "NPC Dialogue / NLP"}</option>
                      <option value="Pathfinding / Navigation">{isZh ? "智能寻路与物理避障" : "Pathfinding / Navigation"}</option>
                      <option value="Procedural Animation">{isZh ? "角色骨骼与口型合成" : "Procedural Animation"}</option>
                      <option value="Graphics Enhancement">{isZh ? "画面超分/帧率重建" : "Graphics Enhancement"}</option>
                      <option value="Bot Behavior / Reinforcement Learning">{isZh ? "对抗 AI 强化学习" : "Bot RL Behavior"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "基础框架" : "FRAMEWORK"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["PyTorch", "ONNX", "TensorRT", "TensorFlow"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setNewModelFramework(f)}
                          className={`py-2 px-1 text-center rounded-lg border text-xs font-bold font-mono transition-all ${
                            newModelFramework === f 
                              ? "bg-indigo-950/40 border-indigo-500 text-indigo-400" 
                              : "bg-gray-950 border-gray-800 text-gray-400 hover:text-gray-200"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "初始版本号" : "INITIAL VERSION"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. v1.0.0"
                      value={newModelVersion}
                      onChange={(e) => setNewModelVersion(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "制品大小" : "FILE SIZE"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. 150 MB"
                      value={newModelSize}
                      onChange={(e) => setNewModelSize(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "验证评估指标" : "EVALUATION METRIC"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. Accuracy / Loss / mAP"
                      value={newModelMetricName}
                      onChange={(e) => setNewModelMetricName(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "评估结果值" : "METRIC VALUE"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. 98.4% / 0.12"
                      value={newModelMetricValue}
                      onChange={(e) => setNewModelMetricValue(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "关联持续构建任务 ID" : "ASSOCIATED BUILD RUN ID"}</label>
                    <input 
                      type="text"
                      placeholder="e.g. build-ai-101"
                      value={newModelBuildId}
                      onChange={(e) => setNewModelBuildId(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button 
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all"
                  >
                    {isZh ? "取消" : "Cancel"}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isZh ? "完成登记" : "Register Asset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Tab View */}
      {activeSubTab === "builds" && (
        <>
          {/* Traditional Storage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: isZh ? "包体存储空间" : "Total Storage", value: "4.2 TB", detail: "82% Used", icon: HardDrive, color: "text-blue-400" },
              { label: isZh ? "本月构建产物" : "Artifacts Monthly", value: "1,284", detail: "+12% vs last month", icon: Package, color: "text-emerald-400" },
              { label: isZh ? "平均分发带宽" : "Avg. Throughput", value: "850 Mbps", detail: "Global CDN active", icon: Send, color: "text-indigo-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-950 border border-white/5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-gray-500">{stat.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Traditional Artifact Table */}
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "包体名称 / 版本" : "NAME / VERSION"}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "产物类型" : "TYPE"}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "目标环境" : "ENV"}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "包体大小" : "SIZE"}</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{isZh ? "打包日期" : "CREATED AT"}</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredBuilds.map((art) => (
                  <tr key={art.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{art.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{art.version}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileArchive className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium text-gray-300 uppercase">{art.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        art.environment === "production" ? "text-rose-400 border-rose-500/30" : "text-amber-400 border-amber-500/30"
                      }`}>
                        {art.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">{art.size}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{art.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer" title="Download">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-emerald-600/30 hover:text-emerald-400 text-white rounded-lg transition-colors cursor-pointer" title="Deploy to Test Server">
                          <Send className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-rose-600/30 hover:text-rose-400 text-white rounded-lg transition-colors cursor-pointer" title="Rollback">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-white">{isZh ? "自动化版本自愈与回滚" : "Auto-Rollback Rules"}</h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">ACTIVE</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {isZh 
                  ? "在生产部署期间，如果错误率在3分钟内攀升至2.5%以上，将自动执行上个稳定版本 (v2.3.9) 的就地零宕机回退，保障线上高可用。" 
                  : "Automatic continuous validation: if production error rate goes > 2.5% within 3 minutes of deployment, instantly rollback to v2.3.9 automatically."}
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-white/5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-gray-300">{isZh ? "合规性打包安全审计已开启" : "Compliance Audit Active"}</span>
                </div>
                <button className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">{isZh ? "查看详情" : "Details"}</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white">{isZh ? "分发策略与内测服务器" : "Distribution & Alpha Nodes"}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Alpha-QA-Region-1", status: "Idle", traffic: "0%" },
                  { name: "Beta-Public-Global", status: "Staging", traffic: "5%" },
                ].map((node, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${node.status === 'Idle' ? 'bg-gray-500' : 'bg-emerald-400 animate-pulse'}`} />
                      <span className="text-xs font-medium text-gray-300">{node.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-gray-500 font-mono">{node.traffic}</span>
                      <ChevronRight className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                {isZh ? "管理分发节点" : "Manage Distribution Nodes"}
              </button>
            </div>
          </div>
        </>
      )}

      {activeSubTab === "models" && (
        /* AI/ML Model Hub Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Models list - Col Span 7 */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Model list summary */}
            <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isZh ? "AI/ML 模型资产清单" : "AI/ML Model Assets"}</h4>
                  <p className="text-lg font-bold text-white mt-0.5">{aiModels.length} {isZh ? "个模型已登记" : "Models Registered"}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">GPU-Compiled Cache Active</span>
              </div>
            </div>

            {/* Grid of Models */}
            <div className="grid grid-cols-1 gap-3">
              {filteredModels.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <div 
                    key={model.id}
                    onClick={() => {
                      if (optimizingModelId !== model.id) {
                        setSelectedModelId(model.id);
                      }
                    }}
                    className={`border rounded-2xl p-4 transition-all duration-300 relative group cursor-pointer ${
                      isSelected 
                        ? "bg-indigo-950/20 border-indigo-500/80 shadow-lg shadow-indigo-500/5" 
                        : "bg-gray-900/40 border-gray-800/60 hover:bg-gray-900/70 hover:border-gray-700"
                    }`}
                  >
                    {/* Active highlight side-dot */}
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-indigo-500 rounded-r-full" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors ${
                          model.framework === "PyTorch" 
                            ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                            : model.framework === "ONNX"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          <Brain className="h-5 w-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">{model.name}</h4>
                            <span className="px-1.5 py-0.5 bg-gray-950 border border-white/5 rounded text-[9px] font-mono font-semibold text-gray-400 uppercase">
                              {model.framework}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1 font-medium">{model.category}</p>
                          
                          {/* Attributes */}
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500 font-mono font-medium">
                            <span>{isZh ? "大小" : "Size"}: <strong className="text-gray-300">{model.size}</strong></span>
                            <span>•</span>
                            <span>{model.metricName}: <strong className="text-indigo-400">{model.metricValue}</strong></span>
                            <span>•</span>
                            <span>{isZh ? "版本" : "Ver"}: <strong className="text-gray-300">{model.version}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-full min-h-[60px]">
                        <span className="text-[10px] text-gray-500 font-mono">{model.createdAt.split(' ')[0]}</span>
                        
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                          {model.framework !== "TensorRT" && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                runOptimization(model.id, "TensorRT");
                              }}
                              className="px-2 py-1 bg-gray-800 hover:bg-indigo-600 text-white hover:text-white rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title={isZh ? "编译为 TensorRT 引擎" : "Optimize to TensorRT"}
                            >
                              <Sparkles className="h-3 w-3" />
                              {isZh ? "构建 TRT" : "Compile TRT"}
                            </button>
                          )}
                          {model.framework === "PyTorch" && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                runOptimization(model.id, "ONNX");
                              }}
                              className="px-2 py-1 bg-gray-800 hover:bg-emerald-600 text-white hover:text-white rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title={isZh ? "转换导出为 ONNX" : "Convert to ONNX"}
                            >
                              <RefreshCw className="h-3 w-3" />
                              {isZh ? "转 ONNX" : "To ONNX"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details and interactive compilation console - Col Span 5 */}
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-4">
            
            {/* Optimization Status Console */}
            {optimizingModelId ? (
              <div className="bg-gray-950 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${optimizingProgress}%` }} />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {isZh ? "AI 边缘计算编译中..." : "COMPILING GRAPH ENGINE..."}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">{optimizingProgress}%</span>
                </div>

                <div className="h-48 rounded-xl bg-black border border-white/5 p-3.5 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {optimizingLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log.includes('[SUCCESS]') ? (
                        <span className="text-emerald-400 font-bold">{log}</span>
                      ) : log.includes('[COMPILE]') || log.includes('[OPTIMIZE]') ? (
                        <span className="text-indigo-300">{log}</span>
                      ) : (
                        <span className="text-gray-400">{log}</span>
                      )}
                    </div>
                  ))}
                  <div ref={optimLogEndRef} />
                </div>
                
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                  {isZh ? "采用 ccache 编译缓存，预计 5 秒内完成全算子图融合" : "Leveraging native LLVM model tracer & local CUDA caching."}
                </p>
              </div>
            ) : null}

            {/* Model Detail Panel */}
            {selectedModel ? (
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 flex flex-col gap-4">
                
                {/* Header */}
                <div className="border-b border-gray-800 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight">{selectedModel.name}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">{isZh ? "关联构建" : "Source build"}: <span className="font-mono text-gray-400">{selectedModel.buildId}</span></p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold rounded">
                      {selectedModel.framework}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-2.5 rounded-xl bg-gray-950 border border-white/5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">{isZh ? "主评估指标" : "Primary Metric"}</span>
                      <span className="text-sm font-bold text-indigo-400 font-mono mt-0.5 block">{selectedModel.metricName}: {selectedModel.metricValue}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-950 border border-white/5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">{isZh ? "编译文件大小" : "Engine Size"}</span>
                      <span className="text-sm font-bold text-gray-300 font-mono mt-0.5 block">{selectedModel.size}</span>
                    </div>
                  </div>
                </div>

                {/* Compile Actions inside detail */}
                <div className="bg-indigo-950/10 border border-indigo-500/10 rounded-xl p-3.5 flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isZh ? "一键编译 / 模型图优化流水线" : "Optimization Task Scheduler"}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {isZh 
                      ? "直接调用服务器集群中的 TensorRT 编译器或 ONNX 剪枝算法，将此权重序列化。提升 4-10 倍推理帧率。" 
                      : "Trigger automatic operator fusion, weight quantization (FP16), and computational graph pruning."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {selectedModel.framework === "PyTorch" && (
                      <button 
                        onClick={() => runOptimization(selectedModel.id, "ONNX")}
                        className="py-1.5 px-3 bg-gray-800 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        {isZh ? "导出为 ONNX" : "Export to ONNX"}
                      </button>
                    )}
                    {selectedModel.framework !== "TensorRT" && (
                      <button 
                        onClick={() => runOptimization(selectedModel.id, "TensorRT")}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors col-span-2 sm:col-span-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        {isZh ? "量化至 TensorRT" : "Quantize to TRT"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Version History */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-gray-500" />
                    {isZh ? "模型版本演进历史" : "Version Evolution History"}
                  </h4>

                  <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-800">
                    {selectedModel.history.map((ver, idx) => (
                      <div key={idx} className="flex gap-3 relative">
                        <div className={`h-6 w-6 rounded-full border flex items-center justify-center flex-shrink-0 z-10 ${
                          idx === 0 
                            ? "bg-indigo-950 border-indigo-500 text-indigo-400" 
                            : "bg-gray-950 border-gray-800 text-gray-500"
                        }`}>
                          {idx === 0 ? <CheckCircle className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-bold ${idx === 0 ? "text-indigo-400" : "text-gray-400"}`}>
                              {ver.version}
                            </span>
                            <span className="text-[9px] font-mono text-gray-500">{ver.createdAt.split(' ')[0]}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            {isZh ? ver.descriptionZh : ver.descriptionEn}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[8px] font-mono bg-gray-950 border border-white/5 rounded px-1 text-gray-400">
                              {selectedModel.metricName}: {ver.metricValue}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                <Brain className="h-8 w-8 text-gray-600 animate-pulse" />
                <p className="text-xs text-gray-400">{isZh ? "请在左侧选择一个 AI 模型查看其详尽细节及演进序列" : "Select an AI model from the list to view its configuration and compile pipelines"}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {activeSubTab === "policies" && (
        <div className="space-y-6 animate-in fade-in duration-300" id="retention-policies-view">
          {/* Rules and Simulation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Rules list - Col Span 7 */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isZh ? "自动清理规则配置" : "Active Retention Rules"}</h4>
                    <p className="text-lg font-bold text-white mt-0.5">{retentionRules.length} {isZh ? "条规则生效中" : "Active Policies"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRuleFormOpen(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isZh ? "添加策略" : "Add Policy"}</span>
                </button>
              </div>

              {/* Rules Items */}
              <div className="space-y-3">
                {retentionRules.map(rule => (
                  <div 
                    key={rule.id}
                    className="p-5 bg-gray-900/40 border border-gray-800/60 rounded-2xl hover:border-gray-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          rule.target === "builds" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          {rule.target === "builds" ? (isZh ? "构建包二进制" : "Build Binaries") : (isZh ? "AI/ML 模型" : "AI/ML Models")}
                        </span>
                        <span className="text-xs font-bold text-gray-400 font-mono">
                          {isZh ? `超期限值: ${rule.days} 天` : `Threshold: ${rule.days} days`}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{rule.name}</h4>

                      {rule.keepTagged && (
                        <p className="text-[10px] text-gray-500 font-medium">
                          🔒 {isZh ? "保留包含以下 Tag 的资产：" : "Protected Tags: "}{" "}
                          <strong className="text-gray-400 font-mono">{rule.keepTaggedValue}</strong>
                        </p>
                      )}

                      <p className="text-[10px] text-gray-500 font-mono">
                        {isZh ? "最近一次执行评估：" : "Last Execution Check: "}{" "}
                        <span className="text-gray-400">{rule.lastExecuted}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto border-t border-gray-800/40 sm:border-t-0 pt-3 sm:pt-0">
                      {/* Active Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          {rule.active ? (isZh ? "启用" : "Active") : (isZh ? "停用" : "Disabled")}
                        </span>
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                            rule.active ? "bg-indigo-600" : "bg-gray-800"
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${
                            rule.active ? "left-4.5" : "left-0.5"
                          }`} />
                        </button>
                      </div>

                      {/* Trash Delete button */}
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-gray-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                        title={isZh ? "删除该清理规则" : "Delete Rule"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dry-run Console - Col Span 5 */}
            <div className="lg:col-span-5 bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 text-amber-400 ${isSimulatingCleanup ? "animate-spin" : ""}`} />
                  {isZh ? "自动保留策略演练终端" : "Dry-Run Simulation Console"}
                </h3>
                <p className="text-[10px] text-gray-500">
                  {isZh ? "对所有活动清理规则进行无损演练测试，分析将要执行删除的旧二进制与模型资产。" : "Simulate cleanup across active policies to inspect old binary sizes and pending reclaimed bytes."}
                </p>
              </div>

              {/* Console log box */}
              <div className="flex-1 min-h-[220px] bg-gray-900/30 border border-gray-900/60 rounded-xl p-4 font-mono text-[11px] text-gray-300 space-y-2 overflow-y-auto">
                {cleanupSimLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-gray-500 leading-relaxed text-center">
                    <Sliders className="h-8 w-8 text-amber-500/40 mb-2 animate-pulse" />
                    <div>◆ {isZh ? "尚未执行演练评估" : "NO SIMULATION LOGS AVAILABLE"} ◆</div>
                    <div className="text-[10px] text-gray-600 mt-1">
                      {isZh ? "点击下方 [开始演练评估] 将安全模拟清理逻辑" : "Trigger dry-run scan to verify pending deletions safely."}
                    </div>
                  </div>
                ) : (
                  cleanupSimLogs.map((log, index) => {
                    const isSystem = log.startsWith("🔄") || log.startsWith("📅") || log.startsWith("🔍") || log.startsWith("✨");
                    const isDeletion = log.includes("DELETION");
                    return (
                      <div 
                        key={index} 
                        className={`leading-relaxed text-xs ${
                          isSystem ? "text-amber-400 font-bold" : isDeletion ? "text-rose-400" : "text-gray-400"
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })
                )}
              </div>

              <button
                onClick={runRetentionSimulation}
                disabled={isSimulatingCleanup}
                className="w-full py-2.5 bg-amber-650 hover:bg-amber-500 disabled:bg-amber-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSimulatingCleanup ? "animate-spin" : ""}`} />
                <span>{isSimulatingCleanup ? (isZh ? "正在计算存储对齐..." : "Analyzing Store...") : (isZh ? "开始策略演练评估" : "Run Policy Simulation")}</span>
              </button>
            </div>

          </div>

          {/* Add Rule Modal */}
          <AnimatePresence>
            {isRuleFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                >
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sliders className="h-5 w-5 text-amber-400" />
                      <h3 className="font-bold text-white text-base">
                        {isZh ? "添加自动保留与清理策略" : "Add Retention Policy Rule"}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsRuleFormOpen(false)}
                      className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleCreateRule} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "策略名称" : "POLICY RULE NAME"}</label>
                      <input 
                        type="text"
                        placeholder="e.g. Clean up old alpha models"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "目标资产类别" : "TARGET ASSETS"}</label>
                        <select
                          value={newRuleTarget}
                          onChange={(e) => setNewRuleTarget(e.target.value as any)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50"
                        >
                          <option value="builds">{isZh ? "包体 & 二进制镜像" : "Build Packages"}</option>
                          <option value="models">{isZh ? "AI / ML 模型 Checkpoints" : "AI/ML Models"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{isZh ? "保留期限 (天)" : "RETAIN PERIOD (DAYS)"}</label>
                        <input 
                          type="number"
                          value={newRuleDays}
                          onChange={(e) => setNewRuleDays(parseInt(e.target.value) || 30)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-850 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={newRuleKeepTagged}
                          onChange={(e) => setNewRuleKeepTagged(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-amber-500 bg-gray-950 border-gray-850"
                        />
                        <span className="text-xs font-bold text-gray-300">{isZh ? "防止删除带有指定 Tag 的资产" : "Protect Tagged Assets"}</span>
                      </label>

                      {newRuleKeepTagged && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 mt-2">{isZh ? "安全保护标签 (英文逗号分隔)" : "PROTECTED TAGS (COMMA SEPARATED)"}</label>
                          <input 
                            type="text"
                            placeholder="e.g. production, staging, stable"
                            value={newRuleKeepTaggedValue}
                            onChange={(e) => setNewRuleKeepTaggedValue(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-250 focus:outline-none focus:border-amber-500/50 font-mono"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                      <button 
                        type="button"
                        onClick={() => setIsRuleFormOpen(false)}
                        className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all"
                      >
                        {isZh ? "取消" : "Cancel"}
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
                      >
                        {isZh ? "创建规则" : "Create Policy"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}
