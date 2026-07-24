
import { LocalizedQuickIssue } from "./data";

export interface WikiEntry {
  id: string;
  category: "build" | "signing" | "environment" | "shader" | "other";
  title: { en: string; zh: string };
  content: { en: string; zh: string };
  tags: string[];
  engine?: "unity" | "unreal" | "both";
}

export const wikiEntryToIssue = (entry: WikiEntry): LocalizedQuickIssue => ({
  id: entry.id,
  platform: "all" as any,
  sampleError: "",
  titleEn: entry.title.en,
  titleZh: entry.title.zh,
  summaryEn: entry.content.en,
  summaryZh: entry.content.zh,
  solutionEn: entry.content.en,
  solutionZh: entry.content.zh,
  engine: entry.engine,
});

export const WIKI_KNOWLEDGE_BASE: WikiEntry[] = [
  {
    id: "android-signing-issue",
    category: "signing",
    title: { en: "Android Signing Keystore Issues", zh: "Android Keystore 签名常见问题" },
    content: {
      en: "Common Android signing issues include incorrect keystore password, invalid alias, or expired certificates. Ensure your keystore is in JKS or PKCS12 format. Use 'keytool -list -v -keystore your.keystore' to verify details.",
      zh: "Android 签名常见问题包括密码错误、别名无效或证书过期。请确保 keystore 为 JKS 或 PKCS12 格式。使用 'keytool -list -v -keystore your.keystore' 验证详情。"
    },
    tags: ["android", "signing", "keystore", "debug"],
    engine: "both"
  },
  {
    id: "ios-provisioning-profiles",
    category: "signing",
    title: { en: "iOS Provisioning Profile Mismatch", zh: "iOS Provisioning Profile 不匹配" },
    content: {
      en: "Ensure your provisioning profile matches the Bundle ID in Xcode. Check that the developer certificate used to create the profile is present in your keychain.",
      zh: "确保 provisioning profile 与 Xcode 中的 Bundle ID 匹配。检查创建 profile 时使用的开发者证书是否在您的 keychain 中。"
    },
    tags: ["ios", "signing", "xcode", "apple"],
    engine: "unity"
  },
  {
    id: "unity-shader-compilation",
    category: "shader",
    title: { en: "Unity Shader Compilation Errors", zh: "Unity Shader 编译错误" },
    content: {
      en: "Shader compilation errors often arise from syntax issues in HLSL or unsupported features on the target platform. Check the console for specific line numbers. Try 'Reimport All' or clearing the ShaderCache folder.",
      zh: "Shader 编译错误通常是由 HLSL 语法问题或目标平台不支持的特性引起的。检查控制台获取具体行号。尝试 'Reimport All' 或清理 ShaderCache 文件夹。"
    },
    tags: ["unity", "shader", "compilation", "gpu"],
    engine: "unity"
  },
  {
    id: "unreal-link-error",
    category: "build",
    title: { en: "Unreal Engine Linker Errors", zh: "Unreal Engine 链接错误" },
    content: {
      en: "Linker errors in UE often occur due to missing module dependencies in your Build.cs file. Ensure all used modules are added to PublicDependencyModuleNames.",
      zh: "UE 中的链接错误通常是由于 Build.cs 文件中缺少模块依赖项引起的。确保所有使用的模块都已添加到 PublicDependencyModuleNames 中。"
    },
    tags: ["unreal", "build", "linker", "c++"],
    engine: "unreal"
  },
  {
    id: "gradle-out-of-memory",
    category: "build",
    title: { en: "Gradle Out of Memory Build Error", zh: "Gradle 内存溢出构建错误" },
    content: {
      en: "Increase the Gradle daemon heap size in 'gradle.properties'. Add: org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m",
      zh: "在 'gradle.properties' 中增加 Gradle 守护进程堆大小。添加：org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m"
    },
    tags: ["android", "gradle", "build", "memory"],
    engine: "both"
  },
  {
    id: "git-lfs-checkout-failed",
    category: "environment",
    title: { en: "Git LFS Checkout Failed", zh: "Git LFS 检出失败" },
    content: {
      en: "This usually happens when Git LFS is not installed or the credentials are incorrect. Run 'git lfs install' and verify your lfs access.",
      zh: "这通常发生在使用 Git LFS 时未安装或凭据不正确。运行 'git lfs install' 并验证您的 LFS 访问权限。"
    },
    tags: ["git", "environment", "tools"],
    engine: "both"
  },
  {
    id: "eng-opt-best-practices",
    category: "build",
    title: { en: "Build Optimization Best Practices (Engineering-Aware)", zh: "构建优化的最佳实践 (工程感知)" },
    content: {
      en: "1. Incremental Builds: Always enable incremental build strategy for large scale projects.\n2. Caching: Utilize remote caching (e.g. Unreal Build Cache, Unity Cache Server) for faster artifact retrieval.\n3. Dependency Management: Keep project dependencies clean and minimal to reduce build times.",
      zh: "1. 增量构建：对于大型项目，始终启用增量构建策略。\n2. 缓存利用：利用远程缓存（如 Unreal Build Cache, Unity Cache Server）加快产物获取速度。\n3. 依赖管理：保持项目依赖的精简，以减少构建总时长。"
    },
    tags: ["engineering", "optimization", "best-practices", "strategy"],
    engine: "both"
  },
  {
    id: "eng-fail-remedies",
    category: "build",
    title: { en: "Fix Suggestions for Build Failures (Engineering-Aware)", zh: "构建失败场景下的修复建议 (工程感知)" },
    content: {
      en: "1. Missing References: Ensure Scene files are not referenced by non-target platforms.\n2. Dependency Conflicts: Check Docker build logs for version mismatch and enforce lock files.\n3. Memory Limits: Expand allocated runner resources dynamically if out-of-memory errors occur repeatedly.",
      zh: "1. 引用丢失：确保 Scene 文件未被非目标平台意外引用导致依赖拉取失败。\n2. 依赖冲突：检查 Docker 构建日志以排查版本冲突，建议使用 Lock 文件固化版本。\n3. 内存瓶颈：若频繁发生 OOM（内存溢出）错误，建议动态扩容构建节点分配的资源。"
    },
    tags: ["engineering", "troubleshooting", "repair", "remedies"],
    engine: "both"
  },
  {
    id: "eng-collab-modes",
    category: "other",
    title: { en: "Team Collaboration Mode Recommendations", zh: "工程团队的协作模式推荐" },
    content: {
      en: "1. Trunk-Based Development: Suitable for CI/CD environments with high build frequencies.\n2. Git Flow: For stable release cycles, separating feature development from hotfixes.\n3. Centralized Artifact Hub: Share intermediate builds via an artifact server to avoid redundant local compilations.",
      zh: "1. 主干开发：适合具有高频 CI/CD 流程的敏捷开发环境。\n2. Git Flow 工作流：适合稳定性要求高的发版周期，隔离功能开发和热修复。\n3. 集中式制品库：通过制品中心共享中间构建产物，避免各成员重复进行本地编译。"
    },
    tags: ["engineering", "collaboration", "team", "git"],
    engine: "both"
  },
  {
    id: "eng-strategy-evolution",
    category: "other",
    title: { en: "Build Strategy Improvement Path", zh: "构建策略改进路径" },
    content: {
      en: "Phase 1: Local Builds. Phase 2: Centralized CI Servers (Jenkins/GitLab CI). Phase 3: Distributed Cloud Runners with Auto-Scaling. Phase 4: Full Multi-Cloud Orchestration with AI Predictive Analysis.",
      zh: "阶段一：基于本机的散列构建。\n阶段二：集中式 CI 服务器（如 Jenkins/GitLab CI）自动化打出构建。\n阶段三：引入具有自动伸缩能力的云端分布式构建集群。\n阶段四：深度整合多云调度与 AI 构建错误预测分析体系。"
    },
    tags: ["engineering", "evolution", "strategy", "cloud"],
    engine: "both"
  }
];
