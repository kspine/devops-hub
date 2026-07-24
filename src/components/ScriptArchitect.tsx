import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";
import { ArchitectResponse } from "../types";
import { useToast } from "./ToastContext";
import { validateUnityScriptConfig, autoFixUnityScript, UnityValidationIssue } from "../utils/unityBuildValidator";
import { 
  Cpu, 
  Sparkles, 
  Info, 
  Check, 
  Copy, 
  HelpCircle, 
  Terminal,
  FileCode,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Wrench,
  RefreshCw
} from "lucide-react";

export default function ScriptArchitect() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const [language, setLanguage] = useState<"csharp" | "python" | "cpp" | "java" | "yaml" | "terraform">("csharp");
  const [prompt, setPrompt] = useState("");
  const [unityVersion, setUnityVersion] = useState("2022.3 LTS");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchitectResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [validationIssues, setValidationIssues] = useState<UnityValidationIssue[]>([]);
  const [prevIssueCount, setPrevIssueCount] = useState<number>(0);
  
  const { language: appLanguage, t } = useLanguage();
  const isAppZh = appLanguage === "zh";

  // Use global Toast system context with fallback to local toast
  let addToastContext: ((message: string, type: "success" | "error" | "warning" | "info") => void) | null = null;
  try {
    const toastCtx = useToast();
    addToastContext = toastCtx.addToast;
  } catch (e) {
    addToastContext = null;
  }

  const triggerToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    if (addToastContext) {
      addToastContext(message, type);
    } else {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const showToast = (message: string) => {
    triggerToast(message, "success");
  };

  // Real-time Unity build configuration validation effect
  useEffect(() => {
    const contentToAnalyze = (result?.script || "") + "\n" + prompt;
    if (!contentToAnalyze.trim()) {
      setValidationIssues([]);
      return;
    }

    const issues = validateUnityScriptConfig(contentToAnalyze, language, unityVersion);
    setValidationIssues(issues);

    // If new critical issues or warnings detected as user writes, trigger instant feedback via Toast system
    if (issues.length > prevIssueCount) {
      const newIssue = issues[issues.length - 1];
      const toastType = newIssue.severity === "error" ? "error" : newIssue.severity === "warning" ? "warning" : "info";
      const msg = isAppZh 
        ? `[Unity 构建校验] ${newIssue.titleZh}: ${newIssue.recommendationZh}`
        : `[Unity Build Guard] ${newIssue.titleEn}: ${newIssue.recommendationEn}`;
      
      triggerToast(msg, toastType);
    }
    setPrevIssueCount(issues.length);
  }, [prompt, result, language, unityVersion]);

  const handleRunManualValidation = () => {
    const contentToAnalyze = (result?.script || "") + "\n" + prompt;
    const issues = validateUnityScriptConfig(contentToAnalyze, language, unityVersion);
    setValidationIssues(issues);

    if (issues.length === 0) {
      triggerToast(
        isAppZh ? "[Unity 构建校验] 配置检查通过，未发现关键错误！" : "[Unity Build Guard] Configuration clean, no issues found!",
        "success"
      );
    } else {
      const topIssue = issues[0];
      const toastType = topIssue.severity === "error" ? "error" : topIssue.severity === "warning" ? "warning" : "info";
      triggerToast(
        isAppZh 
          ? `[Unity 构建校验] 发现 ${issues.length} 项风险点: ${topIssue.titleZh}`
          : `[Unity Build Guard] Found ${issues.length} risks: ${topIssue.titleEn}`,
        toastType
      );
    }
  };

  const handleApplyFix = (issue: UnityValidationIssue) => {
    if (result && result.script) {
      const fixedScript = autoFixUnityScript(result.script, issue.id);
      setResult({ ...result, script: fixedScript });
    }
    const fixedPrompt = autoFixUnityScript(prompt, issue.id);
    setPrompt(fixedPrompt);

    triggerToast(
      isAppZh 
        ? `已通过 Unity 校验工具一键修复: ${issue.titleZh}`
        : `Auto-fixed Unity build issue: ${issue.titleEn}`,
      "success"
    );
  };

  const SUGGESTIONS = [
    {
      title: isAppZh ? "UTC 时间版本自增" : "UTC Version Sync",
      lang: "csharp" as const,
      text: isAppZh 
        ? "编写一个 C# Editor 脚本，读取 PlayerSettings.bundleVersion，并使用当前 UTC 日期（例如 1.2.yyMMdd）递增修订号（patch），最后保存项目。"
        : "Create a C# Editor script that reads PlayerSettings.bundleVersion, increments the patch number using the current UTC date (e.g. 1.2.yyMMdd), and saves the project."
    },
    {
      title: isAppZh ? "Unity Hybrid 热更新打包与自动发布" : "Unity Hybrid Hot-update Pack & Publish",
      lang: "csharp" as const,
      text: isAppZh 
        ? "编写一个 Unity C# 脚本，自动调用 Addressables 引擎，执行增量资源热更新打包 (Build Active Class/Incremental Player Content)，自动更新 Version.json 中的资源版本号、哈希和大小，最后将其自动发布上传到指定的云存储 CDN / 对象存储中。"
        : "Create a Unity C# Editor script that triggers an incremental Addressables hot-update build, generates/updates a Version.json file containing hashes and file sizes for hot-update clients, and prepares the bundle for CDN uploading."
    },
    {
      title: isAppZh ? "ClosingKit 数据权限与收尾归档" : "ClosingKit Project Close-out Archival",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 3 脚本，作为项目收尾归档工具 (ClosingKit)。该脚本执行以下操作：\n1. 安全清理临时构建缓存（如 Library, Temp, Obj 目录）\n2. 扫描并自动移除代码/配置文件中的测试凭证与敏感 Secrets\n3. 通过 Perforce (p4) 或 Git 锁定相关开发分支，关闭非必要读写权限\n4. 自动生成包含版本信息、最终包体大小、提交日志和权限名单的归档 Summary Markdown 报告，并将核心文件打包备份。"
        : "Create a Python 3 project close-out script (ClosingKit) that: 1. Cleans temporary build caches (Library, Temp, Obj) safety. 2. Scans and strips sensitive secrets/credentials from config files. 3. Locks Perforce (p4) or Git branches for archival. 4. Generates an archival Summary Report in Markdown detailing version metadata, artifacts size, and changelogs."
    },
    {
      title: isAppZh ? "iOS/Android 包体解包与签名校验" : "IPA/APK Unpack & Signature Verification",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 3 脚本，用于对打包出的 IPA/APK 进行完整性分析。脚本需要：\n1. 解包指定的 APK/IPA 包体并计算其 SHA256 哈希\n2. 对 Android 包，读取其 META-INF/ 文件夹，通过 apksigner 验证 v1/v2/v3 签名状态，并提取证书指纹\n3. 对 iOS 包，解析 Payload/ 目录下的 App 文件夹，解密 embedded.mobileprovision 描述文件，验证其 Bundle ID、权限列表 (Entitlements) 以及证书有效期\n4. 分析并输出包体内容大小占比与异常提示，以便开发团队快速定位包体签名及完整性问题。"
        : "Create a Python 3 tool that inspects compiled IPA/APK packages: 1. Unpacks and extracts files to calculate SHA256 hashes. 2. For APKs, checks META-INF/ signatures via apksigner to verify v1/v2/v3 signing state and extract keystore fingerpints. 3. For IPAs, decrypts the embedded.mobileprovision to inspect Bundle ID, Entitlements, and Certificate Expiration date. 4. Outputs a report detailing file size distribution and signing health."
    },
    {
      title: isAppZh ? "ML 训练推理管道及相关模型部署" : "ML Pipeline & Model Deployment Automation",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 3 脚本，用于自动化机器学习 (ML) 训练/推理管道与模型部署：\n1. 从云存储 (S3/OSS) 自动同步拉取最新的训练完毕的 ONNX/PyTorch 格式 AI 智能体模型\n2. 自动运行一轮推理校验脚本，对比新旧模型的准确度指标\n3. 若测试通过，将新模型安全复制到 Unity / Unreal 工程的 StreamingAssets 文件夹中，并覆盖现有模型\n4. 自动修改模型配置文件（更新版本号、参数维度等），并自动提交这些变更到 Git 或 Perforce (p4) 代码仓，以便后续流水线拉取自动出包。"
        : "Create a Python 3 script to automate ML model training/inference pipelining and deployment: 1. Downloads the latest trained ONNX/PyTorch model from Cloud storage. 2. Runs an inference test suite comparing performance metrics of the new model against the baseline. 3. Copies verified models to Unity/Unreal's StreamingAssets directory. 4. Updates config file version flags and commits changes to Perforce (p4) or Git."
    },
    {
      title: isAppZh ? "Itch.io Butler 自动部署" : "Itch.io Butler Deploy",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 脚本，将 WebGL 编译生成的文件夹打包压缩为 zip 文件，然后使用 Butler CLI 命令行工具，将其全自动部署上传到 itch.io 平台上。"
        : "Create a Python script that archives a WebGL build folder into a zip file, and uses Apple's or Butler CLI commands to upload the package automatically to itch.io."
    },
    {
      title: isAppZh ? "安卓 Keystore 解密并读取" : "Keystore Decryptor",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 脚本，读取加密的环境变量 Secret，解密您的 Android 密钥库 (Keystore) 凭据，并在编译开始前动态填入 launcherTemplate.gradle 文件中。"
        : "Create a Python script that reads an encrypted environment secret, decrypts your Android Keystore credentials, and updates launcherTemplate.gradle key configurations prior to building."
    },
    {
      title: isAppZh ? "Addressables 一键清理与重编译" : "Addressables Builder",
      lang: "csharp" as const,
      text: isAppZh 
        ? "编写一个 C# 脚本，在 Editor 环境下一键清理现有的 Addressable 资源缓存，启动资源包的全量编译构建，生成资源布局 json 报告，最后安全退出。"
        : "Create a C# editor script that triggers a clean rebuild of Addressable asset bundles, generates the binary layout report, and exits with status 0 on success."
    },
    {
      title: isAppZh ? "C++ 分布式编译 ccache 模块" : "C++ ccache CMake Setup",
      lang: "cpp" as const,
      text: isAppZh 
        ? "编写一个 CMakeLists.txt 扩展模块或 C++ 头文件，用于自动检测系统中的 ccache (Compiler Cache)，并将其配置为 CMake C/C++ 编译器的启动包装器，以在所有 Runner 主机上实现接近十倍的增量编译加速。"
        : "Create a CMake snippet or C++ integration that automatically discovers ccache on the host system and sets it as the launcher for standard C and C++ compilers to achieve extreme increment speedups."
    },
    {
      title: isAppZh ? "C++ Drogon 高性能异步服务器" : "C++ Drogon Async Server",
      lang: "cpp" as const,
      text: isAppZh
        ? "编写一个基于 C++ Drogon 框架的高性能非阻塞 HTTP API 服务器，支持多线程 epoll 事件循环、多路复用异步数据库连接池，并提供一个返回系统状态与内存指标的 REST 端点。"
        : "Create a high-performance non-blocking HTTP API server using the C++ Drogon framework, featuring multi-threaded epoll event loops, multiplexed async DB connection pooling, and a system health REST endpoint."
    },
    {
      title: isAppZh ? "C++ 容器化多阶段 Dockerfile 编译" : "C++ Multi-stage Docker Build",
      lang: "cpp" as const,
      text: isAppZh
        ? "编写一个多阶段构建的 Dockerfile，用于高性能 C++ 应用：第一阶段使用 gcc:13 基础镜像，配置 ccache、安装 CMake/Conan，拉取 Drogon 并编译静态二进制文件；第二阶段使用 distroless 瘦镜像，只拷贝最终的可执行文件，实现极致的镜像瘦身与安全隔离。"
        : "Create a highly optimized multi-stage Dockerfile for a C++ application: Stage 1 uses a GCC 13 image with ccache and CMake/Conan to build static binaries; Stage 2 uses a distroless runtime image to achieve extreme image size reduction and security."
    },
    {
      title: isAppZh ? "Unreal 引擎 C++ 内存池/反射宏扫描" : "UE5 C++ Reflection Scanner",
      lang: "cpp" as const,
      text: isAppZh 
        ? "编写一个高效的 C++ 17 脚本，静态分析 Unreal Engine 项目源代码目录，递归扫描所有 UCLASS()、USTRUCT() 和 UPROPERTY() 反射标记，校验头文件中的 #include \"*.generated.h\" 是否拼写正确，并生成一份违规声明清单。"
        : "Create a C++ 17 utility to statically scan Unreal Engine codebase directories, parse UCLASS/USTRUCT/UPROPERTY macros, verify inclusion of generated headers, and generate a safety diagnostic report."
    },
    {
      title: isAppZh ? "Spring Cloud Vault 自动解密与配置热拉取" : "Spring Cloud Vault Auto Sync",
      lang: "java" as const,
      text: isAppZh
        ? "编写一个基于 Java Spring Boot 的 Bootstrap/Configuration 模块。在应用启动时，该模块自动连接到 HashiCorp Vault 获取数据库凭证和 S3 密钥，并将自身注册到 Eureka 注册中心，同时启动定期异步刷新 OAuth token 的后台线程。"
        : "Create a Spring Boot configuration module that connects to HashiCorp Vault at bootstrap to retrieve database credentials and S3 access keys, registers itself with Eureka, and sets up an asynchronous background thread to periodically refresh OAuth tokens."
    },
    {
      title: isAppZh ? "Spring Boot K8s 构建队列自动扩缩器" : "Spring Boot K8s Queue Autoscale Monitor",
      lang: "java" as const,
      text: isAppZh
        ? "编写一个 Java Spring Boot 定时任务服务类，该服务使用官方 Kubernetes Java SDK 动态轮询流水线构建队列（Queue）状态。当挂起的构建作业超过设定阈值时，自动调用 K8s API 扩容（Scale up）构建 Runner Pod 的副本数。"
        : "Create a Spring Boot scheduled task class using the official Kubernetes Java SDK to monitor build queues. When pending jobs exceed a threshold, it scales up build runner pods automatically using the Kubernetes API."
    },
    {
      title: isAppZh ? "PyTorch 分布式 DDP 训练与 ONNX 导出" : "PyTorch Distributed DDP Training & ONNX Export",
      lang: "python" as const,
      text: isAppZh
        ? "编写一个 Python 3 脚本，使用 PyTorch 核心 API (torch.distributed/DDP) 来初始化分布式多卡训练。支持自动加载模型 Checkpoint、记录训练 Loss 指标并自动检测，如果验证集精度达标，则导出为优化后的 ONNX 静态计算图模型。"
        : "Create a Python 3 script using PyTorch (torch.distributed/DDP) to initialize distributed multi-GPU training. Includes checkpoint loading, validation metric evaluations, and exports optimized ONNX models upon reaching target accuracy."
    },
    {
      title: isAppZh ? "PyTorch TensorRT 编译算子量化优化" : "PyTorch TensorRT Graph Quantizer",
      lang: "python" as const,
      text: isAppZh
        ? "编写一个 Python 3 模型优化脚本，读取训练出的 PyTorch (.pth) 模型权重，使用 TensorRT / TorchScript 对计算图执行算子融合、半精度 (FP16) 量化，并自动进行推理基准测试，最后输出性能对比报告。"
        : "Create a Python 3 model optimization script that loads PyTorch (.pth) weights, performs operator fusion and FP16 quantization using TensorRT/TorchScript, and runs inference benchmarking to compare FPS and latency performance."
    },
    {
      title: isAppZh ? "ArgoCD 声明式金丝雀发布 Canary 灰度清单" : "ArgoCD Canary Rollout Manifest",
      lang: "yaml" as const,
      text: isAppZh
        ? "编写一个声明式的 ArgoCD Application 部署清单 YAML。其中包含一个 Argo Rollouts 资源，配置金丝雀发布策略（10% 流量引入、自动执行 Prometheus 性能监控分析、5xx 错误率飙升时自动回滚、并与 Slack Webhook 联动通知）。"
        : "Create a declarative ArgoCD Application manifest that deploys an Argo Rollouts resource. The rollout specifies a canary release pipeline with a 10% step increment, continuous Prometheus metric analysis, and automatic rollback on high error rates."
    },
    {
      title: isAppZh ? "ArgoCD App-of-Apps 顶级拓扑 GitOps 部署" : "ArgoCD App-of-Apps Bootstrap",
      lang: "yaml" as const,
      text: isAppZh
        ? "编写一个基于 ArgoCD App-of-Apps 模式的集群主控应用 YAML 清单。该清单会递归地同步加载集群的基础设施组件，包括 Cert-Manager、Ingress-Nginx、Vault-Agent、以及核心游戏服务器微服务应用的生命周期管理。"
        : "Create an ArgoCD App-of-Apps YAML template that declaratively bootstraps cluster infrastructure, recursively loading and synchronizing dependencies like Cert-Manager, Ingress-Nginx, HashiCorp Vault agents, and microservices."
    },
    {
      title: isAppZh ? "Terraform 自动配置 GCP GKE 专属私有集群" : "Terraform GCP GKE & Cloud SQL Provisioner",
      lang: "terraform" as const,
      text: isAppZh
        ? "编写一个完整的 Terraform 基础设施配置文件，用于在 Google Cloud (GCP) 上一键自动拉起一个私有 GKE 集群（启用 Autoscaling）与一个高可用的 Cloud SQL PostgreSQL 实例，并配置内部 VPC 对等连接与私有服务访问权限。"
        : "Create a robust Terraform IaC configuration that provisions a private Google Kubernetes Engine (GKE) cluster with cluster autoscaling, along with a highly available Cloud SQL PostgreSQL database instance, VPC peering, and secure private services access."
    },
    {
      title: isAppZh ? "Terraform AWS 跨可用区 EKS + RDS 生产骨架" : "Terraform AWS EKS / Multi-AZ RDS Deployment",
      lang: "terraform" as const,
      text: isAppZh
        ? "编写一个符合生产规范的 Terraform 模块。在 AWS 上自动化部署多可用区（Multi-AZ） VPC 网络、安全子网划分、一个 EKS 托管节点组，以及一个受 KMS 信封加密保护的多 AZ 关系型数据库 RDS 实例。"
        : "Create a production-grade Terraform configuration module that deploys a Multi-AZ VPC network, private subnet routing, an Amazon EKS managed node group, and an encrypted Multi-AZ RDS Postgres database under KMS envelope protection."
    },
    ...(projectType === "unreal" ? [{
      title: isAppZh ? "Unreal Engine 5 自动打包脚本" : "UE5 Automation Architect",
      lang: "python" as const,
      text: isAppZh 
        ? "编写一个 Python 脚本，调用 Unreal Automation Tool (UAT)，自动执行项目打包，指定 Cook 目录，并应用 Production 配置。"
        : "Create a Python script that invokes the Unreal Automation Tool (UAT) to package the project, specifying cook directories and applying Production build configurations."
    }] : [])
  ];

  const handleArchitect = async () => {
    if (!prompt.trim()) {
      setErrorMessage(isAppZh ? "请先输入脚本描述及逻辑需求。" : "Please type a script requirement description first.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch("/api/ai-script-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, prompt, unityVersion, appLanguage }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || (isAppZh ? "生成自动化脚本失败。" : "Failed to generate automation script."));
      }

      const data = await response.json();
      setResult(data);
      // Dispatch visual feedback confetti!
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    } catch (err: any) {
      setErrorMessage(
        err.message || 
        (isAppZh 
          ? "AI 自动化脚本引擎发生冲突，无法构建脚本。请检查 Secrets 选项中的 API 密钥。" 
          : "Automation engine failed to compile script. Ensure secrets are configured.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(isAppZh ? "已复制脚本内容到剪贴板！" : "Copied script to clipboard!");
  };

  const loadSuggestion = (s: typeof SUGGESTIONS[0]) => {
    setLanguage(s.lang);
    setPrompt(s.text);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6" id="script-architect">
      
      {/* Top Split Input Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Prompt configuration */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                {t("scriptSpecifier")}
              </h3>
              <p className="text-xs text-gray-400">
                {t("scriptSpecifierDesc")}
              </p>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold font-sans">{t("automationEnv")}</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="lang-csharp-btn"
                  onClick={() => setLanguage("csharp")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "csharp"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  C# (Unity)
                </button>
                <button
                  id="lang-python-btn"
                  onClick={() => setLanguage("python")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "python"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  Python 3
                </button>
                <button
                  id="lang-cpp-btn"
                  onClick={() => setLanguage("cpp")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "cpp"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  C++ Native
                </button>
                <button
                  id="lang-java-btn"
                  onClick={() => setLanguage("java")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "java"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  Java (Spring)
                </button>
                <button
                  id="lang-yaml-btn"
                  onClick={() => setLanguage("yaml")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "yaml"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  ArgoCD (YAML)
                </button>
                <button
                  id="lang-terraform-btn"
                  onClick={() => setLanguage("terraform")}
                  className={`py-2 px-1 rounded-lg border text-center font-mono text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer ${
                    language === "terraform"
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                      : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                  }`}
                >
                  Terraform IaC
                </button>
              </div>
            </div>

            {/* Target Version */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold font-sans">{t("targetEnvVersion")}</label>
              <input
                id="script-engine-version"
                type="text"
                value={unityVersion}
                onChange={e => setUnityVersion(e.target.value)}
                placeholder={projectType === "unity" ? "Universal / Unity 2022.3 LTS" : "Unreal Engine 5.3 / 5.4"}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Prompt description */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-semibold font-sans">{t("taskDescription")}</label>
              <textarea
                id="script-prompt-textarea"
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={t("taskPlaceholder")}
                className="w-full bg-gray-950/40 border border-gray-800 rounded-lg p-3 font-sans text-xs text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600 leading-relaxed"
              />
            </div>

            {/* Real-Time Unity Build Configuration Guard Panel */}
            <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-800 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-gray-200">
                    {isAppZh ? "Unity 构建配置实时校验护航" : "Unity Real-Time Build Guard"}
                  </span>
                  {validationIssues.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
                      {validationIssues.length} {isAppZh ? "风险" : "risks"}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleRunManualValidation}
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700 transition-colors cursor-pointer"
                  title="Run manual validation check"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isAppZh ? "重新校验" : "Re-check"}</span>
                </button>
              </div>

              {validationIssues.length === 0 ? (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>
                    {isAppZh 
                      ? "配置健全：未在脚本及描述中检测到 Unity 常见构建冲突。" 
                      : "Config Clean: No common Unity build configuration errors detected."}
                  </span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {validationIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${
                        issue.severity === 'error' 
                          ? 'bg-red-950/30 border-red-800/60 text-red-200' 
                          : issue.severity === 'warning'
                          ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                          : 'bg-indigo-950/30 border-indigo-800/60 text-indigo-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {issue.severity === 'error' ? <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> :
                           issue.severity === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" /> :
                           <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          <span>{isAppZh ? issue.titleZh : issue.titleEn}</span>
                        </div>

                        {issue.autoFixable && (
                          <button
                            onClick={() => handleApplyFix(issue)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all shrink-0 cursor-pointer shadow-sm"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>{isAppZh ? "一键修复" : "Auto Fix"}</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] opacity-90 leading-relaxed">
                        {isAppZh ? issue.messageZh : issue.messageEn}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400 pt-1 border-t border-white/10">
                        💡 {isAppZh ? issue.recommendationZh : issue.recommendationEn}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-850">
            <button
              id="run-architect-btn"
              onClick={handleArchitect}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-sans font-semibold text-xs disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/15 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("btnGeneratingScript")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("btnGenerateScript")}</span>
                </>
              )}
            </button>

            {errorMessage && (
              <p className="text-[10px] text-red-400 font-mono text-center leading-relaxed bg-red-950/20 p-2 rounded border border-red-900/40">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm flex-1">
            <div>
              <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-400" />
                {t("scenariosTitle")}
              </h4>
              <p className="text-xs text-gray-400">
                {t("scenariosDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  id={`suggestion-${index}`}
                  onClick={() => loadSuggestion(suggestion)}
                  className="p-3 text-left rounded-lg bg-gray-900/40 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900 transition-all flex flex-col justify-between gap-2 group cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-200 group-hover:text-indigo-400 transition-colors block">
                      {suggestion.title}
                    </span>
                    <p className="text-[10px] text-gray-400 leading-relaxed block">
                      {suggestion.text.substring(0, 95)}...
                    </p>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-400/80 mt-1 block">
                    {suggestion.lang === "csharp" ? "C# (Unity)" : 
                     suggestion.lang === "python" ? "Python / PyTorch" : 
                     suggestion.lang === "cpp" ? "C++ Native" : 
                     suggestion.lang === "java" ? "Java (Spring)" :
                     suggestion.lang === "yaml" ? "ArgoCD GitOps" :
                     "Terraform IaC"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Generated Output */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-gray-800 pt-6 animate-fade-in">
          
          {/* Main Code View */}
          <div className="lg:col-span-8 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
            <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-gray-300">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <span>{result.filename}</span>
              </div>
              
              <button
                id="copy-architect-code"
                onClick={() => handleCopyCode(result.script)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-800 text-gray-200 hover:bg-indigo-600 hover:text-gray-100 transition-all font-sans font-medium cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-300" />
                    <span>{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t("copyCode")}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 p-5 overflow-auto font-mono text-[11px] text-gray-300 leading-relaxed bg-gray-950/40">
              <pre className="whitespace-pre">{result.script}</pre>
            </div>
          </div>

          {/* Integration instructions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Short Explanation */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3 shadow-sm">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">{t("scriptBlueprint")}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("executionGuidelines")}</span>
              <div className="space-y-2 text-xs">
                {result.usageInstructions.split("\n").filter(line => line.trim()).map((step, idx) => (
                  <div key={idx} className="flex gap-2 text-gray-300 leading-relaxed">
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-400">{step}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

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
