import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DependencyMap from "../DependencyMap";
import { 
  GitBranch, 
  Workflow, 
  Cpu, 
  Settings, 
  Package, 
  Key, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert, 
  Terminal, 
  Boxes, 
  Gamepad2,
  RefreshCw,
  Flame,
  FileCode,
  LayoutGrid,
  Smartphone,
  Server,
  ShieldCheck,
  ListChecks
} from "lucide-react";
import { useWorkspace } from "../../WorkspaceContext";
import { ProjectType } from "../../types";
import { useLanguage } from "../../LanguageContext";
import { useToast } from "../ToastContext";

interface TopologyNode {
  id: string;
  phase: number;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  purposeEn: string;
  purposeZh: string;
  requirementsEn: string[];
  requirementsZh: string[];
  engine: ProjectType | "all" | "games" | "non-games";
  icon: any;
  status: "idle" | "running" | "success" | "warning";
  detailsEn: string;
  detailsZh: string;
  pitfallsEn: string[];
  pitfallsZh: string[];
  snippetTitle: string;
  snippet: string;
}

export default function PipelineTopology() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [activeNodeId, setActiveNodeId] = useState<string>("source-sync");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRunningDryRun, setIsRunningDryRun] = useState(false);
  const [dryRunProgress, setDryRunProgress] = useState<string[]>([]);
  const [dryRunCurrentNode, setDryRunCurrentNode] = useState<string | null>(null);

  // Define pipeline architectural nodes with comprehensive stage purpose & requirements annotations
  const nodes: TopologyNode[] = [
    {
      id: "source-sync",
      phase: 1,
      titleEn: "Source Sync & SCM",
      titleZh: "代码与版本库同步",
      descEn: "Fetch revision source codes, resolve Git LFS assets or Perforce (P4) streams.",
      descZh: "安全拉取最新代码，解析大型 Git LFS 资源资产或 Perforce (P4) 工作流分支。",
      purposeEn: "Establish workspace isolation, synchronize Git/P4 revision trees, and pull heavy LFS media binary pointers.",
      purposeZh: "建立工作区隔离环境，同步 Git/P4 目标提交分支，并高可靠性解包 Git LFS 大文件指针。",
      requirementsEn: [
        "SCM authentication tickets/SSH keys",
        "Git LFS or Perforce CLI runner client",
        "Repository read access & workspace disk space"
      ],
      requirementsZh: [
        "SCM 访问凭据 Ticket 或已公钥认证书",
        "构建节点预装 Git LFS 或 Perforce CLI 客户端",
        "目标仓库的 Read 权限及充足的物理磁盘容量"
      ],
      engine: "all",
      icon: GitBranch,
      status: "idle",
      detailsEn: "Synchronize raw files, code assets, and plugin directories. For Perforce workflows, this establishes client mappings, workspace isolation, and triggers force-sync only when required to maximize runner disk life.",
      detailsZh: "同步原始美术资产、二进制文件与代码。针对大容量 P4 分支，优化工作区隔离，并触发增量同步以最大化延长构建服务器固态硬盘（SSD）的寿命。",
      pitfallsEn: [
        "Incomplete LFS pointer download causing texture corruptions.",
        "P4 ticket expiration aborting sync steps mid-execution.",
        "Unresolved branch conflicts stalling automated webhook pulls."
      ],
      pitfallsZh: [
        "LFS 指针下载不全，导致部分三维模型或贴图在构建时损坏或丢失。",
        "Perforce 会话凭据（Ticket）过期，导致后续管道步骤无权限中止。",
        "未解决的分支冲突直接阻塞了自动触发的 Webhook 工作流。"
      ],
      snippetTitle: "gitlab-ci-scm.yaml",
      snippet: `stages:
  - checkout

checkout-code:
  stage: checkout
  variables:
    GIT_SUBMODULE_STRATEGY: recursive
    GIT_LFS_SKIP_SMUDGE: 0
  script:
    - echo "Synchronizing Workspace SCM revision..."
    - git checkout -f $CI_COMMIT_SHA
    - git lfs pull`
    },
    {
      id: "security-scan",
      phase: 2,
      titleEn: "Security & Compliance",
      titleZh: "安全扫描与合规审计",
      descEn: "Scan for vulnerabilities, secrets, and licensing compliance.",
      descZh: "静态代码审计、依赖漏洞扫描以及开源协议合规性检查。",
      purposeEn: "Execute SAST static code audits and SCA dependency vulnerability scans to intercept credential leaks and non-compliant open source components.",
      purposeZh: "执行 SAST 静态代码审计与 SCA 依赖库漏洞扫描，从源头拦截硬编码密钥泄露与传染性开源协议风险。",
      requirementsEn: [
        "TruffleHog / Snyk / SonarQube audit tools",
        "Valid security scanner API audit tokens",
        "Network connection to up-to-date CVE feeds"
      ],
      requirementsZh: [
        "TruffleHog / Snyk / Sonar 审计工具链",
        "有效的安全扫描引擎 API Audit Tokens",
        "可连通实时 CVE 漏洞库与合规数据库服务"
      ],
      engine: "all",
      icon: ShieldCheck,
      status: "idle",
      detailsEn: "Executes SAST (Static Application Security Testing) and SCA (Software Composition Analysis). Prevents secret leakage (API keys) and ensures all third-party libraries comply with enterprise policies.",
      detailsZh: "执行 SAST（静态应用安全测试）与 SCA（软件成分分析）。防止密钥泄漏（如 API Key 误传），并确保所有第三方库符合企业开源治理策略。",
      pitfallsEn: [
        "Hardcoded credentials found in public commits.",
        "High-severity CVEs in underlying base images or dependencies.",
        "GPL-licensed components accidentally included in proprietary builds."
      ],
      pitfallsZh: [
        "在公共提交记录中发现硬编码的凭据信息。",
        "底层基础镜像或依赖包中存在高危 CVE 漏洞。",
        "在专有商业构建中意外引入了具有传染性的 GPL 协议组件。"
      ],
      snippetTitle: "security-audit.yaml",
      snippet: `- name: TruffleHog Secret Scan
  run: trufflehog git file:///workspace --since-commit HEAD --fail
- name: Snyk Vulnerability Scan
  run: snyk test --all-projects --severity-threshold=high`
    },
    {
      id: "automated-test",
      phase: 3,
      titleEn: "Automated Verification",
      titleZh: "自动化质量验证",
      descEn: "Run unit tests, integration tests, and performance regressions.",
      descZh: "运行单元测试、集成测试以及性能基准回归测试。",
      purposeEn: "Run unit tests, integration test suites, and performance benchmark regressions in isolated headless runner environments.",
      purposeZh: "在隔离无头运行环境中跑通单元测试、集成测试及性能基准回归测试，保障重型编译前的代码质量。",
      requirementsEn: [
        "Test framework runtime (Vitest / Go Test / Unity Test Runner)",
        "Mock test data fixtures & seed databases",
        "At least 2 CPU cores & 4GB RAM runner allocation"
      ],
      requirementsZh: [
        "测试框架运行时 (Vitest / Go Test / Unity Test Runner)",
        "模拟测试数据打桩文件与 Base 种子数据库",
        "分配至少 2核 CPU 与 4GB 内存独立算力"
      ],
      engine: "all",
      icon: CheckCircle2,
      status: "idle",
      detailsEn: "Ensures code quality before heavy compilation. Runs headless test suites in dedicated environments. For games, this includes automated smoke tests via mock input agents.",
      detailsZh: "在进入重型编译阶段前保障代码质量。在隔离环境中运行无头测试套件。针对游戏项目，包括通过模拟输入代理执行的自动化冒烟测试。",
      pitfallsEn: [
        "Flaky tests causing intermittent pipeline failures.",
        "Mismatched test environments vs production OS.",
        "Insufficient code coverage hiding critical logic regressions."
      ],
      pitfallsZh: [
        "不稳定（Flaky）测试导致流水线产生间歇性虚假报错。",
        "测试环境与生产环境操作系统版本不一致导致的运行差异。",
        "测试覆盖率不足，掩盖了核心逻辑的回退风险。"
      ],
      snippetTitle: "test-suite.sh",
      snippet: `# For Unity
Unity.exe -runTests -testPlatform playmode -resultsFile tests.xml
# For Backend
go test -v -cover ./...`
    },
    {
      id: "api-contract",
      phase: 2,
      titleEn: "E2E Contract Sync",
      titleZh: "跨端协议同步",
      descEn: "Synchronize Protobuf/Flatbuffers schemas between client and server.",
      descZh: "在客户端和服务端之间同步 Protobuf/Flatbuffers 协议定义，确保双端数据契合。",
      purposeEn: "Synchronize Protobuf/Flatbuffers serialization schemas between game clients and server backends to prevent runtime binary field mismatches.",
      purposeZh: "在游戏客户端与后端服务之间强校验与同步 Protobuf/Flatbuffers 协议定义，生成强类型代码并规避序列化错位。",
      requirementsEn: [
        "protoc compiler binary installed",
        "Shared .proto / .fbs schema repository",
        "Target language codegen plugins (protoc-gen-go, protoc-gen-csharp)"
      ],
      requirementsZh: [
        "protoc 协议编译器二进制工具",
        "共享的 .proto 或 .fbs 契约文件仓库",
        "目标语言代码生成插件 (protoc-gen-go, protoc-gen-csharp)"
      ],
      engine: "all",
      icon: Terminal,
      status: "idle",
      detailsEn: "Validates API contracts between game clients (Unity/Unreal) and backends (Go/Rust). Generates strongly-typed code for all targets to prevent runtime serialization mismatches.",
      detailsZh: "验证游戏客户端（Unity/Unreal）与后端（Go/Rust）之间的 API 契约。为所有目标平台生成强类型代码，防止运行时序列化不匹配导致的崩溃。",
      pitfallsEn: [
        "Mismatched proto versions causing critical production downtime.",
        "Field index collisions in binary protocols.",
        "Incomplete schema generation for specific edge-case targets."
      ],
      pitfallsZh: [
        "Proto 版本不一致导致生产环境严重停机。",
        "二进制协议中的字段索引冲突。",
        "针对特定边缘平台协议生成不完整。"
      ],
      snippetTitle: "protoc-gen.sh",
      snippet: `protoc --proto_path=./proto \\
  --cpp_out=./client/unreal/source \\
  --csharp_out=./client/unity/assets \\
  --go_out=./server/pkg/api \\
  ./proto/service.proto`
    },
    {
      id: "asset-resolve",
      phase: 2,
      titleEn: "Addressables Builder",
      titleZh: "热更新资源预处理",
      descEn: "Pre-compile catalog mappings, bundle Addressable assets into CDN-ready files.",
      descZh: "打包 Unity 可寻址资产或 Unreal 基础烘焙关联，编译资源包并生成布局报告。",
      purposeEn: "Compile modular asset groups, build LZ4 compressed AssetBundles, and export remote catalog.json mapping files for dynamic hot-update delivery.",
      purposeZh: "编译模块化资源分组，构建 LZ4 压缩 AssetBundles 包体，并导出可寻址热更新 catalog.json 索引清单。",
      requirementsEn: [
        "Unity Editor 2022+ command line setup",
        "Addressable Asset System package configured",
        "Target CDN bucket write credentials & endpoint"
      ],
      requirementsZh: [
        "Unity Editor 2022+ 命令行环境",
        "已正确配置 Addressable Asset System 规则",
        "目标 CDN 存储桶写入凭据与 API 端点"
      ],
      engine: "unity",
      icon: Boxes,
      status: "idle",
      detailsEn: "Process modular game structures. Build AssetBundles based on the active addressables profiles (Local vs Remote). Compress bundles with LZ4/LZMA and export the catalog.json mappings for runtime smart CDN delivery.",
      detailsZh: "处理模块化游戏资产结构。基于当前配置方案（本地或远程）打包可寻址资产包。使用高效 LZ4 压缩，并生成用于运行时动态热更新的 catalog.json 索引清单文件。",
      pitfallsEn: [
        "Duplicate resource dependencies bloating memory heap size.",
        "Incorrect Hash identifier preventing incremental remote patch downloads.",
        "Mismatched group paths causing critical null reference asset loading errors."
      ],
      pitfallsZh: [
        "冗余的重合资源依赖关系导致包体臃肿与运行时内存堆过载。",
        "可寻址 Hash 标识生成错误，导致客户端无法识别增量资源补丁。",
        "分组远程路径配置错误，导致游戏加载时抛出严重的空指针异常。"
      ],
      snippetTitle: "AddressablesBuildScript.cs",
      snippet: `using UnityEditor.AddressableAssets;
using UnityEditor.AddressableAssets.Settings;

public class AddressablesBuilder {
    public static void BuildActiveContent() {
        AddressableAssetSettings.BuildPlayerContent(out AddressablesPlayerBuildResult result);
        if (!string.IsNullOrEmpty(result.Error)) {
            throw new System.Exception("Addressables Compilation Failed: " + result.Error);
        }
    }
}`
    },
    {
      id: "unreal-cook",
      phase: 2,
      titleEn: "UAT Content Cooking",
      titleZh: "UAT 资产烘焙重组",
      descEn: "Bake engine textures, blueprints, and materials for targets via Unreal Automation Tool.",
      descZh: "通过 Unreal 自动化工具（UAT）编译并烘焙平台材质、蓝图及三维贴图数据。",
      purposeEn: "Bake platform-specific shaders, textures, and Blueprint bytecode via Unreal Automation Tool (UAT) with BuildCookRun automation.",
      purposeZh: "通过 Unreal 自动化工具（UAT）将 3D 美术资产、蓝图与 Shader 缓存重组烘焙为目标平台原生渲染格式。",
      requirementsEn: [
        "Unreal Engine 5.3+ installed on build runner",
        "GPU-accelerated DirectX 12 / Vulkan render host",
        "32GB+ System RAM & high-speed SSD scratch disk"
      ],
      requirementsZh: [
        "构建节点安装 Unreal Engine 5.3+ 工具链",
        "支持 DirectX 12 / Vulkan 的 GPU 渲染支持",
        "至少 32GB 内存与高速 NVMe SSD 临时缓存盘"
      ],
      engine: "unreal",
      icon: Flame,
      status: "idle",
      detailsEn: "Process assets into platform-specific native formats. Executed via Unreal AutomationTool with BuildCookRun command, validating asset registries, compiling global shader caches, and stripping editor metadata.",
      detailsZh: "将美术资产批量烘焙并导出为特定发布平台所需的原生渲染格式。通过 Unreal 自动化工具（UAT）调用 BuildCookRun 参数执行，并生成着色器缓存及去除编辑器元数据。",
      pitfallsEn: [
        "Stale cooking cache resulting in visual artifact glitches.",
        "ShaderCompilerWorker crash due to insufficient virtual memory setup.",
        "Circular Blueprint class dependencies causing cooker thread deadlock."
      ],
      pitfallsZh: [
        "由于缓存过期，导致烘焙出的项目材质出现黑点或渲染通道异常报错。",
        "虚拟内存分配过小，导致 ShaderCompilerWorker 并行编译器进程异常崩溃。",
        "蓝图类存在循环加载依赖关系，直接引起 UAT 烘焙线程死锁崩溃。"
      ],
      snippetTitle: "uat-build-cook.sh",
      snippet: `RunUAT.sh BuildCookRun \\
  -project="$WORKSPACE/SpaceShooter.uproject" \\
  -noP4 -platform=Win64 -clientconfig=Development \\
  -cook -allmaps -stage -pak -archive`
    },
    {
      id: "web-build",
      phase: 2,
      titleEn: "Frontend Bundler",
      titleZh: "前端资源构建",
      descEn: "Optimize assets, transpile TSX, and bundle with Vite/Webpack.",
      descZh: "优化静态资源，转译 TSX 代码，并使用 Vite/Webpack 进行现代化打包。",
      purposeEn: "Transpile TypeScript/React codebases, optimize assets, tree-shake dependencies, and produce minified static web distributions.",
      purposeZh: "转译 TSX / JSX 代码，执行依赖 Tree-Shaking 剪裁，打包优化静态资源并输出 Web 生产阶段包体。",
      requirementsEn: [
        "Node.js 18+ runtime environment",
        "npm / pnpm package manager installed",
        "Production environment variable configuration (.env.production)"
      ],
      requirementsZh: [
        "Node.js 18+ 生产运行时环境",
        "已安装 npm / pnpm 包管理器",
        "已配置生产环境变量 (.env.production)"
      ],
      engine: "web",
      icon: LayoutGrid,
      status: "idle",
      detailsEn: "Minifies CSS, uglifies JS, and generates critical-path CSS for optimal performance.",
      detailsZh: "为现代 Web 应用执行生产环境构建。压缩 CSS，混淆 JS，并生成关键路径 CSS 以实现极致性能。",
      pitfallsEn: [
        "Unused large dependencies bloating the bundle.",
        "Incorrect public path causing asset 404s."
      ],
      pitfallsZh: [
        "未使用的庞大依赖导致 JS 包体过大。",
        "错误的公共路径配置导致资源加载 404。"
      ],
      snippetTitle: "package.json",
      snippet: `"scripts": {
  "build": "vite build --base=/app/",
  "test": "vitest run"
}`
    },
    {
      id: "core-compilation",
      phase: 3,
      titleEn: "Compiler Engine",
      titleZh: "代码编译栈",
      descEn: "Translate source code into targeted assembly.",
      descZh: "执行跨平台代码编译与静态链接操作。",
      purposeEn: "Translate C# IL or C++ source code into platform-native assembly, applying Link-Time Optimization (LTO) and IL2CPP ahead-of-time (AOT) compilation.",
      purposeZh: "将 C# IL 或 C++ 源码翻译为平台原生汇编指令，实施 IL2CPP AOT 预编译与 LTO 链接期优化。",
      requirementsEn: [
        "Target platform C++ compiler toolchains (MSVC / Clang / NDK)",
        "Android NDK / iOS SDK toolchain installations",
        "Runner host build toolchain licensing"
      ],
      requirementsZh: [
        "目标平台 C++ 编译器工具链 (MSVC / Clang / NDK)",
        "已配置 Android NDK 或 iOS Xcode SDK 环境",
        "构建服务器编译许可与环境变量授权"
      ],
      engine: "games",
      icon: Cpu,
      status: "idle",
      detailsEn: "Translates C# (Unity) or C++ (Unreal) into optimized native binaries for target platforms.",
      detailsZh: "将 C# (Unity) 或 C++ (Unreal) 翻译为针对目标平台优化的原生二进制文件。",
      pitfallsEn: [
        "Incompatible NDK versions.",
        "Missing compiler environment variables."
      ],
      pitfallsZh: [
        "使用了不兼容的 NDK 编译器版本。",
        "构建服务器的主机系统缺失 C++ 生成工具链环境变量。"
      ],
      snippetTitle: "UnityBuilder.cs",
      snippet: `using UnityEditor;
public class CorePlayerCompiler {
    public static void BuildClient() {
        BuildPlayerOptions options = new BuildPlayerOptions();
        options.target = BuildTarget.Android;
        BuildPipeline.BuildPlayer(options);
    }
}`
    },
    {
      id: "backend-compile",
      phase: 3,
      titleEn: "Backend Compilation",
      titleZh: "后端代码编译",
      descEn: "Compile Go/Rust/C++ server code into high-performance binaries.",
      descZh: "将 Go/Rust/C++ 后端代码编译为高性能的可执行文件。",
      purposeEn: "Cross-compile backend services into lightweight, standalone static binaries optimized for Linux container environments.",
      purposeZh: "为 Linux/K8s 容器环境交叉编译无依赖的高性能 Go/Rust/C++ 静态二进制服务程序。",
      requirementsEn: [
        "Go 1.22+ or Rust compiler toolchain",
        "CGO cross-compilation environment setup",
        "Target architecture flags (GOOS=linux GOARCH=amd64/arm64)"
      ],
      requirementsZh: [
        "Go 1.22+ 或 Rust 编译器工具链",
        "CGO 交叉编译支持与无头库支持",
        "目标操作系统与架构交叉编译参数 (GOOS=linux GOARCH=amd64/arm64)"
      ],
      engine: "backend",
      icon: Cpu,
      status: "idle",
      detailsEn: "Cross-compiles server code for Linux/K8s environments with static linking optimization.",
      detailsZh: "为 Linux/K8s 环境交叉编译后端代码。优化静态链接以减少容器镜像体积。",
      pitfallsEn: [
        "CGO dependency issues causing linking failures.",
        "Incorrect architecture for target nodes."
      ],
      pitfallsZh: [
        "CGO 依赖问题导致链接失败。",
        "目标节点架构不匹配（ARM/x86）。"
      ],
      snippetTitle: "Makefile",
      snippet: `build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \\
	go build -ldflags="-s -w" -o bin/server main.go`
    },
    {
      id: "dockerize",
      phase: 4,
      titleEn: "Containerization",
      titleZh: "容器化打包",
      descEn: "Build OCI-compliant Docker images for the backend service.",
      descZh: "为后端服务构建符合 OCI 标准的 Docker 镜像。",
      purposeEn: "Encapsulate compiled server binaries into minimal, hardened OCI-compliant container images ready for K8s deployment.",
      purposeZh: "将编译好的二进制文件封装进极简、加固的 OCI 容器镜像，准备部署至 Kubernetes 集群。",
      requirementsEn: [
        "Docker / Buildah container engine installed",
        "Distroless or Alpine minimal base image",
        "Registry push credentials (GCR / ECR / Harbor)"
      ],
      requirementsZh: [
        "Docker / Buildah 容器构建引擎",
        "Distroless 或 Alpine 极简安全基础镜像",
        "私有镜像仓库 (Harbor/GCR/ECR) Push 推送凭据"
      ],
      engine: "backend",
      icon: Package,
      status: "idle",
      detailsEn: "Packages compiled binaries into secure, minimal container images.",
      detailsZh: "将编译好的二进制文件打包进安全、极简的容器镜像中。",
      pitfallsEn: [
        "Large image layers.",
        "Running as root in production."
      ],
      pitfallsZh: [
        "过多的镜像层级导致启动缓慢。",
        "生产环境中以 root 权限运行容器。"
      ],
      snippetTitle: "Dockerfile",
      snippet: `FROM gcr.io/distroless/static-debian11
COPY bin/server /server
USER nonroot:nonroot
ENTRYPOINT ["/server"]`
    },
    {
      id: "signing",
      phase: 4,
      titleEn: "Signing & Packaging",
      titleZh: "签署签名与分包",
      descEn: "Apply keystores/provisioning certificates for mobile/console.",
      descZh: "整合安全密钥（Keystore / Certificate），对输出包体实施强制安全签名。",
      purposeEn: "Embed release cryptographic certificates, sign mobile APK/AAB or iOS IPA binaries, and produce encrypted distribution bundles.",
      purposeZh: "压入发布版加密证书，为移动端 APK/AAB 或 iOS IPA 执行强制数字签名与合规包体验证。",
      requirementsEn: [
        "Valid Keystore certificate or Apple P12 cert",
        "Provisioning Profiles matching bundle ID",
        "Secure secret manager for certificate passwords"
      ],
      requirementsZh: [
        "有效的 Android Keystore 证书或 Apple P12 私钥",
        "与 Bundle ID 完全配对的 Provisioning Profile 文件",
        "解密证书与密钥的 Key Vault 安全变量"
      ],
      engine: "mobile",
      icon: Key,
      status: "idle",
      detailsEn: "Applies secure Keystores for Android or Apple Provisioning Profiles for iOS IPA signing.",
      detailsZh: "为 Android 包实施签名；针对 iOS 提供安全证书链及描述文件打包。",
      pitfallsEn: [
        "Certificate expiration.",
        "Entitlements mismatch."
      ],
      pitfallsZh: [
        "签名证书已过期或已被吊销。",
        "权限文件（Entitlements）中的 Bundle ID 不匹配。"
      ],
      snippetTitle: "Fastfile",
      snippet: `lane :release do
  get_certificates
  get_provisioning_profile
  build_app(scheme: "Release")
end`
    },
    {
      id: "dist-notify",
      phase: 5,
      titleEn: "Deployment & Delivery",
      titleZh: "发布与交付",
      descEn: "Push production artifacts to platforms (CDN/K8s/App Store).",
      descZh: "将最终的制品（安装包/镜像）自动上传至平台并发送通知。",
      purposeEn: "Publish compiled artifacts to production targets (Kubernetes, App Stores, CDNs) and notify team channels via real-time webhooks.",
      purposeZh: "将编译制品自动化发布部署至生产目标（K8s 集群 / App Store / CDN），并通过 Webhook 实时通知研发团队。",
      requirementsEn: [
        "Kubernetes Kubeconfig or App Store API credentials",
        "CDN cache purge tokens",
        "Webhook endpoint URLs (Slack / Discord / Teams)"
      ],
      requirementsZh: [
        "Kubernetes Kubeconfig 凭据或 App Store Connect API Key",
        "CDN 节点刷新 Cache Purge Tokens",
        "Slack / Discord / Teams Webhook 通知地址"
      ],
      engine: "all",
      icon: Globe,
      status: "idle",
      detailsEn: "Automates the final deployment update and notifies developer channels.",
      detailsZh: "自动化最终部署更新流程，并向研发通道反馈完整的构建报告。",
      pitfallsEn: [
        "Rollback failure tags.",
        "CDN propagation delay."
      ],
      pitfallsZh: [
        "由于缺少版本标签导致回滚失败。",
        "CDN 刷新缓存存在传播延迟。"
      ],
      snippetTitle: "k8s-deploy.yaml",
      snippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: game-server
spec:
  template:
    spec:
      containers:
      - name: server
        image: asia-docker.pkg.dev/proj/server:v1.2.0`
    }
  ];

  // Filters nodes according to active engine
  const filteredNodes = nodes.filter(
    n => n.engine === "all" || n.engine === projectType || (n.engine === "games" && (projectType === "unity" || projectType === "unreal"))
  );

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast(isZh ? "已复制脚本模板到剪贴板！" : "Script template copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Dry run simulation function
  const runDryRun = () => {
    if (isRunningDryRun) return;
    setIsRunningDryRun(true);
    setDryRunProgress([]);
    
    addToast(
      isZh ? "🚀 正在启动全流程 Dry-Run 预演验证..." : "🚀 Launching dry-run simulation across all topological nodes...", 
      "info"
    );

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < filteredNodes.length) {
        const currentNode = filteredNodes[currentIndex];
        setDryRunCurrentNode(currentNode.id);
        setDryRunProgress(prev => [...prev, currentNode.id]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRunningDryRun(false);
        setDryRunCurrentNode(null);
        
        // Dispatch custom confetti event on success!
        window.dispatchEvent(new CustomEvent("trigger-confetti"));

        addToast(
          isZh ? "🎉 拓扑 Dry-Run 预演成功！无结构阻断性异常。" : "🎉 Topology Dry-Run Completed Successfully! Zero structural anomalies found.",
          "success"
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Header */}
      <div className="bg-gray-950 p-5 rounded-2xl border border-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-gray-100 flex items-center gap-2">
            <Workflow className="h-4.5 w-4.5 text-indigo-400" />
            {isZh ? "流水线拓扑架构与依赖 DAG" : "Pipeline Topology & DAG Workflow"}
          </h2>
          <p className="text-xs text-gray-400">
            {isZh 
              ? "悬停节点查看阶段作用与环境要求，点击检视 Dry-Run 验证日志及完整 CI 脚本模板。" 
              : "Hover over any stage node for purpose & requirements annotations. Click to inspect Dry-Run logs & CI templates."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runDryRun}
            disabled={isRunningDryRun}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {isRunningDryRun ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{isZh ? "预演推演中..." : "Simulating Dry-Run..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                <span>{isZh ? "运行 Dry-Run 预演" : "Run Topology Dry-Run"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Node List + Right Specification Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Flowchart Nodes Stream */}
        <div className="lg:col-span-6 space-y-4 text-left">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-gray-400" />
              {isZh ? "工作流顺序流向 (Hover 查看作用说明)" : "PIPELINE LOGICAL STREAM (Hover for purpose)"}
            </h3>
            <p className="text-[10px] text-gray-500">
              {isZh ? "鼠标悬停在节点卡片上可实时弹出阶段作用与环境需求注释，点击可固定选中节点。" : "Hover over a node card for tooltip annotations explaining its purpose and prerequisites."}
            </p>
          </div>

          {/* Interactive DAG Nodes Flowchart */}
          <div className="space-y-4 relative">
            {filteredNodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isActive = node.id === activeNodeId;
              
              // Dry run state determinations
              const hasPassedDryRun = dryRunProgress.includes(node.id);
              const isDryRunCurrent = dryRunCurrentNode === node.id;

              return (
                <div key={node.id} className="relative flex items-center">
                  {/* Visual Node Card Button */}
                  <button
                    onClick={() => {
                      setActiveNodeId(node.id);
                      addToast(
                        isZh 
                          ? `已载入【${node.titleZh}】的诊断日志与阶段规格` 
                          : `Loaded specifications and metrics for ${node.titleEn}`,
                        "info"
                      );
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left relative overflow-visible group cursor-pointer ${
                      isActive 
                        ? "bg-indigo-950/30 border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-indigo-200" 
                        : "bg-gray-900/30 border-gray-900 hover:border-gray-800 hover:bg-gray-900/60"
                    }`}
                  >
                    {/* Active line marker */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
                    )}

                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                        isActive 
                          ? "bg-indigo-500 text-white shadow-md shadow-indigo-900/20" 
                          : "bg-gray-950 text-gray-400 group-hover:text-indigo-400"
                      }`}>
                        <NodeIcon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                            Phase {node.phase}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-950 text-gray-400 font-mono border border-gray-800 uppercase">
                            {node.engine}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold mt-0.5 truncate ${isActive ? "text-indigo-300" : "text-gray-200"}`}>
                          {isZh ? node.titleZh : node.titleEn}
                        </h4>
                      </div>
                    </div>

                    {/* Dry-run validation pulse status */}
                    <div className="flex items-center gap-2 pl-2">
                      {isDryRunCurrent ? (
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </div>
                      ) : hasPassedDryRun ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-in zoom-in duration-200" />
                      ) : (
                        <ArrowRight className={`h-3.5 w-3.5 text-gray-600 transition-transform ${isActive ? "translate-x-1 text-indigo-400" : "group-hover:translate-x-1"}`} />
                      )}
                    </div>

                    {/* Hover Floating Tooltip Annotation Popover */}
                    <AnimatePresence>
                      {hoveredNodeId === node.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 sm:left-auto sm:right-2 top-full sm:top-auto sm:bottom-full mb-2 z-50 w-80 p-4 rounded-2xl bg-gray-950/95 border border-indigo-500/60 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl pointer-events-none text-left space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                                <NodeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Phase {node.phase}</span>
                                <h5 className="text-xs font-bold text-white">{isZh ? node.titleZh : node.titleEn}</h5>
                              </div>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-gray-900 text-indigo-300 border border-gray-800">
                              {node.engine}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                              <Info className="h-3 w-3 text-indigo-400" />
                              {isZh ? "阶段作用 (Purpose)" : "Stage Purpose"}
                            </span>
                            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                              {isZh ? node.purposeZh : node.purposeEn}
                            </p>
                          </div>

                          <div className="space-y-1 pt-1 border-t border-gray-900">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <ListChecks className="h-3 w-3 text-emerald-400" />
                              {isZh ? "环境与前置要求 (Requirements)" : "Requirements & Prerequisites"}
                            </span>
                            <ul className="space-y-1">
                              {(isZh ? node.requirementsZh : node.requirementsEn).map((req, rIdx) => (
                                <li key={rIdx} className="text-[10.5px] text-gray-300 flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>

                  {/* Connective Line to Next Node */}
                  {index < filteredNodes.length - 1 && (
                    <div className="absolute left-8 -bottom-4 w-0.5 h-4 bg-gray-900 z-0">
                      {dryRunProgress.includes(node.id) && (
                        <div className="w-full h-full bg-indigo-500/40 animate-in fade-in duration-300" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Engine Context display info */}
          <div className="p-3 bg-gray-900/20 border border-gray-900/50 rounded-xl text-[10px] text-gray-500 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {projectType === "unity" ? (
                <Gamepad2 className="h-3.5 w-3.5 text-indigo-400" />
              ) : projectType === "unreal" ? (
                <Boxes className="h-3.5 w-3.5 text-orange-400" />
              ) : projectType === "web" ? (
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
              ) : projectType === "mobile" ? (
                <Smartphone className="h-3.5 w-3.5 text-blue-400" />
              ) : (
                <Server className="h-3.5 w-3.5 text-rose-400" />
              )}
              <span>{isZh ? "当前技术栈:" : "Active stack:"} <strong className="text-gray-400 uppercase">{projectType}</strong></span>
            </span>
            <span>v1.2.0-b24</span>
          </div>
        </div>

        {/* Right Column: Node Details & Specifications Panel */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Node Architecture Explainer */}
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 text-left space-y-5">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Info className="h-4 w-4 text-indigo-400" />
                {isZh ? "架构节点详细说明" : "STAGE SPECIFICATIONS & PURPOSE"}
              </span>
              <span className="text-[10px] bg-gray-900 px-2 py-0.5 rounded text-gray-400 font-mono font-bold">
                {activeNode.id.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>{isZh ? activeNode.titleZh : activeNode.titleEn}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                  Phase {activeNode.phase}
                </span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {isZh ? activeNode.detailsZh : activeNode.detailsEn}
              </p>
            </div>

            {/* Stage Purpose Section */}
            <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                {isZh ? "阶段核心作用 (Stage Purpose)" : "STAGE CORE PURPOSE"}
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isZh ? activeNode.purposeZh : activeNode.purposeEn}
              </p>
            </div>

            {/* Requirements & Prerequisites Checklist */}
            <div className="p-3.5 bg-emerald-950/10 border border-emerald-900/30 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ListChecks className="h-3.5 w-3.5 text-emerald-400" />
                {isZh ? "环境与前置要求清单 (Prerequisites)" : "PREREQUISITES & ENVIRONMENT REQUIREMENTS"}
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
                {(isZh ? activeNode.requirementsZh : activeNode.requirementsEn).map((req, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-normal">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid Pitfalls section */}
            <div className="p-3.5 bg-red-950/10 border border-red-950/40 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                {isZh ? "高频配置陷阱 / 避坑指南" : "COMMON INTEGRATION PITFALLS"}
              </span>
              <ul className="space-y-1.5 text-[11px] text-gray-400 font-sans">
                {(isZh ? activeNode.pitfallsZh : activeNode.pitfallsEn).map((pit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500/80 mt-0.5 font-bold">•</span>
                    <span className="leading-normal">{pit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Template Snippet */}
          <div className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden text-left flex flex-col">
            <div className="bg-gray-900 px-4 py-2.5 border-b border-gray-900 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                <FileCode className="h-4 w-4 text-indigo-400" />
                {activeNode.snippetTitle}
              </span>
              <button
                onClick={() => handleCopyCode(activeNode.snippet)}
                className="text-[10px] font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? (isZh ? "已复制" : "Copied!") : (isZh ? "复制模板" : "Copy Template")}</span>
              </button>
            </div>
            <pre className="p-4 bg-gray-950 font-mono text-[10.5px] text-indigo-300 leading-relaxed overflow-x-auto whitespace-pre text-left border-none focus:outline-none">
              {activeNode.snippet}
            </pre>
          </div>

          {/* Step Telemetry Metrics & Dynamic Live Logs (INTERACTIVE) */}
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 text-left space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-indigo-400 animate-pulse" />
                {isZh ? "运行性能与诊断控制台" : "STEP PERFORMANCE & LIVE LOGS"}
              </span>
              <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 font-mono uppercase font-bold">
                {activeNode.id}
              </span>
            </div>

            {/* Dynamic CPU / Memory / Duration Metrics for Active Node */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-900/40 p-3 rounded-xl border border-gray-900/60">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">CPU LOAD</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-200">
                    {activeNode.id === "source-sync" ? "28%" : activeNode.id === "security-scan" ? "85%" : activeNode.id === "automated-test" ? "92%" : activeNode.id === "api-contract" ? "40%" : activeNode.id === "asset-resolve" ? "74%" : activeNode.id === "unreal-cook" ? "98%" : "54%"}
                  </span>
                  <span className="text-[8px] text-gray-500 font-mono">cores</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: activeNode.id === "source-sync" ? "28%" : activeNode.id === "security-scan" ? "85%" : activeNode.id === "automated-test" ? "92%" : activeNode.id === "api-contract" ? "40%" : activeNode.id === "asset-resolve" ? "74%" : activeNode.id === "unreal-cook" ? "98%" : "54%" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">MEMORY</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-200">
                    {activeNode.id === "unreal-cook" ? "24.2GB" : activeNode.id === "asset-resolve" ? "8.4GB" : activeNode.id === "core-compilation" ? "12.1GB" : "3.2GB"}
                  </span>
                  <span className="text-[8px] text-gray-500 font-mono">RAM</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: activeNode.id === "unreal-cook" ? "88%" : activeNode.id === "asset-resolve" ? "60%" : "35%" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">AVG DURATION</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-gray-200">
                    {activeNode.id === "unreal-cook" ? "18m 20s" : activeNode.id === "asset-resolve" ? "6m 45s" : activeNode.id === "security-scan" ? "1m 15s" : "42s"}
                  </span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">PASS RATE</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-emerald-400">99.4%</span>
                </div>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: "99.4%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Architectural Dependency Map */}
      <DependencyMap />
    </div>
  );
}
