import { PipelineStep, QuickIssue } from "./types";

export interface LocalizedPipelineStep extends Omit<PipelineStep, 'name' | 'description'> {
  nameEn: string;
  nameZh: string;
  descEn: string;
  descZh: string;
}

export interface LocalizedQuickIssue extends Omit<QuickIssue, 'title' | 'summary' | 'solution'> {
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
  solutionEn: string;
  solutionZh: string;
  engine?: "unity" | "unreal" | "both";
}

export const PIPELINE_STEPS: LocalizedPipelineStep[] = [
  {
    id: "fetch",
    nameEn: "Fetch Source",
    nameZh: "获取源代码",
    descEn: "Downloads the latest project source from Git or Perforce repository.",
    descZh: "从 Git 或 Perforce 仓库下载最新的项目源代码。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  },
  {
    id: "checkout",
    nameEn: "Checkout Version",
    nameZh: "检出版本号",
    descEn: "Switches to the specific branch, tag, or commit hash for this build session.",
    descZh: "切换到本次构建任务指定的特定分支、标签或提交哈希。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  },
  {
    id: "setup",
    nameEn: "Setup Environment",
    nameZh: "构建环境初始化",
    descEn: "Configures SDK paths (Unity/Unreal/Node/Go), downloads required binaries and tools.",
    descZh: "配置 SDK 路径（Unity/Unreal/Node/Go），下载必要的二进制依赖和工具链。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  },
  {
    id: "cook",
    nameEn: "Cook Content",
    nameZh: "资源烘焙 (Cooking)",
    descEn: "Processes and formats assets for the target platform.",
    descZh: "为目标平台处理和格式化资产。",
    enabled: true,
    requiredFor: ["unreal"],
    engines: ["unreal"]
  },
  {
    id: "package",
    nameEn: "Package Build",
    nameZh: "打包工程 (Packaging)",
    descEn: "Packages the cooked content into a deployable binary.",
    descZh: "将烘焙后的内容打包成可部署的二进制文件。",
    enabled: true,
    requiredFor: ["unreal"],
    engines: ["unreal"]
  },
  {
    id: "stage",
    nameEn: "Stage Build",
    nameZh: "暂存构建 (Staging)",
    descEn: "Collects all required files into a staging directory for deployment.",
    descZh: "将所有必需文件收集到暂存目录中以进行部署。",
    enabled: true,
    requiredFor: ["unreal"],
    engines: ["unreal"]
  },
  {
    id: "archive",
    nameEn: "Archive Build",
    nameZh: "归档构建 (Archive)",
    descEn: "Compresses and archives the build for long-term storage or distribution.",
    descZh: "压缩并归档构建版本，用于长期存储或分发。",
    enabled: true,
    requiredFor: ["unreal"],
    engines: ["unreal"]
  },
  {
    id: "clean",
    nameEn: "Clean Build Folders",
    nameZh: "清理构建目录",
    descEn: "Cleans output paths, artifacts, and library caches to ensure a reproducible clean state.",
    descZh: "清理输出路径、归档产物和库缓存，确保可重复的纯净打包状态。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  },
  {
    id: "npm_install",
    nameEn: "NPM Install",
    nameZh: "安装依赖 (NPM)",
    descEn: "Installs project dependencies using npm or yarn.",
    descZh: "使用 npm 或 yarn 安装项目依赖项。",
    enabled: true,
    requiredFor: ["web"],
    engines: ["web"]
  },
  {
    id: "web_build",
    nameEn: "Production Build",
    nameZh: "生产环境构建",
    descEn: "Compiles and minifies the web application for production.",
    descZh: "为生产环境编译并混淆 Web 应用程序。",
    enabled: true,
    requiredFor: ["web"],
    engines: ["web"]
  },
  {
    id: "flutter_build",
    nameEn: "Flutter Build",
    nameZh: "Flutter 构建",
    descEn: "Compiles Flutter application for target platform (Android/iOS).",
    descZh: "为目标平台（Android/iOS）编译 Flutter 应用程序。",
    enabled: true,
    requiredFor: ["android", "ios"],
    engines: ["mobile"]
  },
  {
    id: "backend_compile",
    nameEn: "Backend Compilation",
    nameZh: "后端程序编译",
    descEn: "Compiles the backend source code (Go/Rust/Java).",
    descZh: "编译后端源代码（Go/Rust/Java）。",
    enabled: true,
    requiredFor: ["backend"],
    engines: ["backend"]
  },
  {
    id: "docker_build",
    nameEn: "Dockerize",
    nameZh: "容器化 (Docker Build)",
    descEn: "Builds a Docker image for the backend service.",
    descZh: "为后端服务构建 Docker 镜像。",
    enabled: true,
    requiredFor: ["backend"],
    engines: ["backend"]
  },
  {
    id: "k8s_deploy",
    nameEn: "K8s Deployment",
    nameZh: "K8s 集群部署",
    descEn: "Deploys the container to a Kubernetes cluster.",
    descZh: "将容器部署到 Kubernetes 集群。",
    enabled: true,
    requiredFor: ["backend"],
    engines: ["backend"]
  },
  {
    id: "addressables",
    nameEn: "Addressables Compilation",
    nameZh: "Addressables 资源编译",
    descEn: "Builds asset bundles and builds the content catalog if the project uses Addressables.",
    descZh: "如果项目使用了可寻址资源系统 (Addressables)，则编译资源包并生成内容目录。",
    enabled: false,
    requiredFor: ["webgl", "android", "ios", "standalone"],
    engines: ["unity"]
  },
  {
    id: "prebuild_script",
    nameEn: "Pre-Build Automation (C#)",
    nameZh: "构建前自动化脚本 (C#)",
    descEn: "Executes custom C# methods to increment version, configure splash screen, and select API endpoints.",
    descZh: "执行自定义 C# 静态方法，用于递增版本号、配置闪屏和动态切换 API 端点。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone"],
    engines: ["unity"]
  },
  {
    id: "build",
    nameEn: "Compile Engine & Code",
    nameZh: "编译引擎与代码",
    descEn: "Invokes UBT or MSVC to compile the project binaries and game modules.",
    descZh: "调用 UBT 或 MSVC 编译项目二进制文件和游戏模块。",
    enabled: true,
    requiredFor: ["unreal"],
    engines: ["unreal"]
  },
  {
    id: "unity_build",
    nameEn: "Compile Unity Player",
    nameZh: "编译 Unity 播放器",
    descEn: "Invokes Unity in headless batch mode to generate the compiled game or exported project.",
    descZh: "在 headless 批处理模式下唤醒 Unity，生成编译后的游戏包或导出的工程项目。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone"],
    engines: ["unity"]
  },
  {
    id: "postprocess_xcode",
    nameEn: "Xcode Post-processing (iOS Only)",
    nameZh: "Xcode 后处理 (仅限 iOS)",
    descEn: "Modifies the generated Xcode project (e.g. Info.plist, Frameworks, Capabilities) via C# PBXProject API.",
    descZh: "通过 Unity C# PBXProject API 修改生成的 Xcode 工程（例如 Info.plist、依赖库及权限能力）。",
    enabled: true,
    requiredFor: ["ios"],
    engines: ["unity"]
  },
  {
    id: "sign_package",
    nameEn: "Code Signing & Packaging",
    nameZh: "代码签名与包体打包",
    descEn: "Signs the final binary with certificate/keystore and packages it into APK/AAB or IPA format.",
    descZh: "使用对应证书/密钥库对最终二进制文件进行签名，并将其打包为 APK/AAB 或 IPA 格式。",
    enabled: true,
    requiredFor: ["android", "ios"],
    engines: ["unity", "unreal"]
  },
  {
    id: "store_upload",
    nameEn: "App Store / Google Play Deploy",
    nameZh: "商店部署上传 (TestFlight / Play)",
    descEn: "Uploads signed build to Google Play Console (internal/alpha) or TestFlight via altool/transporter.",
    descZh: "通过 altool 或 transporter 将已签名的安装包自动上传至 Google Play 控制台或 TestFlight。",
    enabled: false,
    requiredFor: ["android", "ios", "unreal"],
    engines: ["unity", "unreal"]
  },
  {
    id: "quality_check",
    nameEn: "Quality & Testability Check",
    nameZh: "工程质量分析门禁",
    descEn: "Runs static code analysis, test coverage evaluation, and build error prediction.",
    descZh: "运行静态代码分析、测试覆盖率评估以及构建错误预测模型门禁。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  },
  {
    id: "notify",
    nameEn: "Notify Slack / Teams",
    nameZh: "通知 Slack / Teams Webhook",
    descEn: "Sends build report and artifacts link to Slack or Discord webhook with changelog details.",
    descZh: "将构建报告和归档产物链接，连同更新日志详情一起发送到 Slack 或 Discord webhook。",
    enabled: true,
    requiredFor: ["webgl", "android", "ios", "standalone", "unreal", "web", "mobile", "backend"],
    engines: ["unity", "unreal", "web", "mobile", "backend"]
  }
];

export const QUICK_ISSUES: LocalizedQuickIssue[] = [
  {
    id: "ios-signing",
    titleEn: "No Matching Provisioning Profile",
    titleZh: "找不到匹配的 iOS 描述文件 (Provisioning Profile)",
    platform: "ios",
    engine: "unity",
    summaryEn: "Xcode fails to compile or archive the app because the specified Provisioning Profile UUID is missing, invalid, or does not match the active signing identity or Bundle ID.",
    summaryZh: "Xcode 归档或编译失败。原因是在打包机上未安装指定 UUID 的 Provisioning Profile、描述文件已过期，或者该文件与当前的 Bundle ID、打包证书私钥不匹配。",
    sampleError: "❌ [Xcode Build Error] Code Signing Error: No profile for 'com.company.game' were found: Xcode couldn't find any free provisioning profiles matching 'com.company.game'.\n    Code signing is required for product type 'Application' in SDK 'iOS 17.0'",
    solutionEn: "To resolve this, apply these corrective actions:\n1. **Verify Bundle Identifier**: Ensure the bundle identifier in your Unity BuildSettings ('com.company.game') matches the App ID registered in Apple Developer Portal.\n2. **Install mobileprovision file**: Download the provisioning profile (.mobileprovision) and copy it into:\n   ~/Library/MobileDevice/Provisioning Profiles/\n3. **Configure automatic signing in Unity Post-process**:\n   Utilize a C# post-build script to toggle provisioning keys in Xcode. For example:\n   ```csharp\n   var project = new PBXProject();\n   project.ReadFromFile(projectPath);\n   string targetGuid = project.GetUnifiedTargetGuid();\n   project.SetBuildProperty(targetGuid, \"CODE_SIGN_STYLE\", \"Manual\");\n   project.SetBuildProperty(targetGuid, \"PROVISIONING_PROFILE_SPECIFIER\", \"YourProfileName\");\n   ```\n4. **Command-Line Signing parameters**: If building in Jenkins or GitHub Actions using 'xcodebuild', append:\n   `xcodebuild -exportArchive -archivePath build.xcarchive -exportPath dist/ -exportOptionsPlist ExportOptions.plist`",
    solutionZh: "要解决此签名冲突，请执行以下排查及修复步骤：\n1. **核对 Bundle Identifier (包名)**：确保 Unity 播放器设置 (Player Settings) 中的包名（例如 'com.company.game'）与苹果开发者后台注册的 App ID 完美一致。\n2. **安装描述文件 (mobileprovision)**：在打包机上手工下载对应的描述文件并复制放入至此目录：\n   ~/Library/MobileDevice/Provisioning Profiles/\n3. **在 Unity 后处理中配置手动/自动签名选项**：\n   使用 C# 脚本在打包后动态写入 Xcode 项目配置，避免被 Unity 覆盖重置。例如：\n   ```csharp\n   var project = new PBXProject();\n   project.ReadFromFile(projectPath);\n   string targetGuid = project.GetUnifiedTargetGuid();\n   project.SetBuildProperty(targetGuid, \"CODE_SIGN_STYLE\", \"Manual\");\n   project.SetBuildProperty(targetGuid, \"PROVISIONING_PROFILE_SPECIFIER\", \"YourProfileName\");\n   ```\n4. **构建命令行参数指定**：如果使用 Jenkins 或 GitHub Actions 命令行调用 `xcodebuild` 进行打包，请在末尾附加参数：\n   `xcodebuild -exportArchive -archivePath build.xcarchive -exportPath dist/ -exportOptionsPlist ExportOptions.plist`"
  },
  {
    id: "android-multidex",
    titleEn: "Android 64K Dex Method Limit Exceeded",
    titleZh: "Android 64K Dex 方法数限制超限 (Dex Method Limit)",
    platform: "android",
    engine: "unity",
    summaryEn: "The application uses multiple SDKs (AdMob, Firebase, Facebook, Game Services), exceeding the 65,536 method limit for a single Android Dalvik Executable (.dex) file.",
    summaryZh: "由于项目中集成过多第三方 SDK (如 AdMob, Firebase, Facebook 等) 导致总方法数超过 65,536，Dalvik 编译器无法将其合入到单一 .dex 文件中。",
    sampleError: "Execution failed for task ':launcher:mergeProjectDexDebug'.\n> A failure occurred while executing com.android.build.gradle.internal.tasks.DexArchiveMergerRunnable\n  > Cannot fit requested classes in a single dex file (# methods: 78241 > 65536)",
    solutionEn: "To resolve this limit:\n1. **Enable Multi-dex in Custom Gradle**:\n   Go to Unity **Project Settings > Player > Publishing Settings** and enable **Custom Gradle Template** (launcherTemplate.gradle).\n2. Open the generated gradle file and add:\n   ```groovy\n   android {\n       defaultConfig {\n           multiDexEnabled true\n       }\n   }\n   dependencies {\n       implementation 'androidx.multidex:multidex:2.0.1'\n   }\n   ```\n3. **Use Proguard/R8 Minification**:\n   In Unity **Publishing Settings**, set **Minify > Release** and **Minify > Debug** to **Proguard** or **Gradle**. This shakes off unused bytecode from imported SDKs.",
    solutionZh: "要解决 64K 方法数限制，请执行以下步骤：\n1. **启用 Custom Gradle 模版并配置 Multi-dex**：\n   在 Unity 编辑器中打开 **Project Settings > Player > Publishing Settings**，勾选启用 **Custom Gradle Template** (将会生成 launcherTemplate.gradle)。\n2. 编辑生成的 Gradle 脚本并添加以下声明：\n   ```groovy\n   android {\n       defaultConfig {\n           multiDexEnabled true\n       }\n   }\n   dependencies {\n       implementation 'androidx.multidex:multidex:2.0.1'\n   }\n   ```\n3. **开启 Proguard 混淆与代码裁剪**：\n   在 Unity 编译的 **Publishing Settings** 中，将 Release 和 Debug 的 **Minify** 选项切换配置为 **Proguard** 或 **Gradle**。这将自动剔除第三方 SDK 中未使用的垃圾字节码，大大减少包体方法数。"
  },
  {
    id: "unity-editor-ref",
    titleEn: "UnityEditor API Reference Compiler Error",
    titleZh: "非编辑器模式下引用 UnityEditor 命名空间报错",
    platform: "all",
    engine: "unity",
    summaryEn: "A C# script contains references to classes inside the 'UnityEditor' namespace (e.g., EditorUtility, BuildPlayer), which does not exist in standalone runtime builds, causing build errors.",
    summaryZh: "C# 代码中包含了对 'UnityEditor' 命名空间的调用 (如 EditorUtility 或 BuildPlayer)，但在打包客户端包体时，运行包无法载入这些 API，导致编译打包直接报错中断。",
    sampleError: "Assets/Scripts/GameManager.cs(14,19): error CS0246: The type or namespace name 'UnityEditor' could not be found (are you missing a using directive or an assembly reference?)",
    solutionEn: "Editor scripts cannot be compiled into target devices. Implement these steps:\n1. **Use Preprocessor Directives**:\n   Wrap any Editor-only references in conditional compilation blocks:\n   ```csharp\n   #if UNITY_EDITOR\n   using UnityEditor;\n   #endif\n\n   public void StartGame() {\n       #if UNITY_EDITOR\n       EditorUtility.DisplayDialog(\"Notice\", \"Starting from Editor!\", \"Ok\");\n       #endif\n   }\n   ```\n2. **Relocate Scripts**:\n   Move any files referencing `UnityEditor` directly (without compiler wraps) into folders named **Editor** (e.g. `Assets/Scripts/Editor/BuildHelper.cs`). Unity completely excludes Editor folders from target player compilations.",
    solutionZh: "编辑器专用的 C# 脚本不能打包进入真机目标平台中。请使用以下规范：\n1. **加入条件编译预处理指令 (Conditional Directives)**：\n   在所有引用了 UnityEditor 的地方包覆宏定义条件编译：\n   ```csharp\n   #if UNITY_EDITOR\n   using UnityEditor;\n   #endif\n\n   public void StartGame() {\n       #if UNITY_EDITOR\n       EditorUtility.DisplayDialog(\"通知\", \"在编辑器运行状态中!\", \"确定\");\n       #endif\n   }\n   ```\n2. **移动文件到专属的 Editor 目录**：\n   将所有主要用于辅助开发、工具菜单，并且未加宏定义的 C# 脚本移入名为 **Editor** 的子目录中 (例如 `Assets/Scripts/Editor/BuildHelper.cs`)。Unity 编译机制会在出包真机时自动排除这些目录，避免其被当做游戏逻辑脚本。"
  },
  {
    id: "il2cpp-ndk-mismatch",
    titleEn: "IL2CPP Compilation Failure (Missing NDK)",
    titleZh: "IL2CPP 编译失败 / NDK 环境变量缺失或版本不匹配",
    platform: "il2cpp",
    engine: "unity",
    summaryEn: "The IL2CPP (C++ Ahead-of-Time) build target fails because Unity cannot locate the compatible Android NDK, or the NDK version installed differs from the strictly requested version for that editor release.",
    summaryZh: "IL2CPP (C++ AOT 编译机制) 运行失败。这主要是由于 Unity 无法在当前打包机上检索到有效的 Android NDK，或者已安装的 NDK 版本与当前 Unity 编辑器版本要求不兼容。",
    sampleError: "Failed running C:\\\\Program Files\\\\Unity\\\\Hub\\\\Editor\\\\2022.3.20f1\\\\Editor\\\\Data\\\\il2cpp/build/deploy/netcoreapp3.1/il2cpp.exe\nException: Android NDK not found or invalid. Please configure your NDK path in Preferences > External Tools.",
    solutionEn: "IL2CPP builds are highly sensitive to toolchain versions:\n1. **Unity Hub Managed NDK (Recommended)**:\n   Ensure you installed the NDK *via* the Unity Hub. In Unity Hub, go to Installs, click settings on your version, **Add Modules**, and check **Android NDK & SDK Tools**.\n2. **Re-link Paths**:\n   Inside Unity Editor, navigate to **Edit > Preferences > External Tools**. Check the box:\n   `[✓] Android NDK Installed with Unity (recommended)`\n3. **Check NDK Version Manually**:\n   If you must use a custom NDK, consult the Unity documentation for your exact editor version. For instance, Unity 2022.3 requires **NDK r23b (23.1.7779620)**. Incorrect versions result in C++ linker errors.",
    solutionZh: "IL2CPP (C++ AOT) 构建过程对 Android 原生编译链版本非常敏感：\n1. **首选由 Unity Hub 托管安装 (推荐)**：\n   在 Unity Hub 的“安装 (Installs)”页面中，找到对应的 Unity 编辑器版本，点击齿轮选择“添加模块”，确保勾选了 **Android NDK & SDK Tools**，让其全自动同步配置。\n2. **编辑器偏好重新关联**：\n   在 Unity 顶栏菜单中打开 **Edit > Preferences > External Tools**。勾选该推荐选项：\n   `[✓] Android NDK Installed with Unity (recommended)`\n3. **核查 NDK 版本号**：\n   如果您必须使用独立安装的 NDK 路径，请务必查询官方文档对应您当前 Unity 版本的具体 NDK 兼容矩阵。例如：Unity 2022.3 必须且只适配 **NDK r23b (23.1.7779620)**，若版本冲突将直接导致编译链接阶段报错。"
  },
  {
    id: "unreal-ubt-exit-6",
    titleEn: "UBT Exit Code 6 (Missing Symbols)",
    titleZh: "Unreal Build Tool 退出代码 6 (缺少符号/头文件错误)",
    platform: "unreal",
    engine: "unreal",
    summaryEn: "The Unreal Build Tool (UBT) failed with exit code 6, usually indicating a compilation error in C++ code, missing header references, or unresolved external symbols during the linking stage.",
    summaryZh: "Unreal Build Tool (UBT) 返回退出代码 6。这通常意味着 C++ 代码中存在编译错误、缺失头文件引用，或者在链接阶段存在无法解析的外部符号。",
    sampleError: "[UBT] ERROR: Target 'MyGame' failed to build. Exit code 6.\n[UBT] MyGame.cpp(42): error C2039: 'GetWorld': is not a member of 'FMyActor'",
    solutionEn: "To fix UBT Exit Code 6:\n1. **Check Compiler Output**: Scroll up in the logs to find the specific C++ compilation error (e.g., C2039, C2065).\n2. **Refresh Project Files**: Right-click your .uproject file and select **Generate Visual Studio project files**.\n3. **Verify Dependencies**: Ensure all required modules are listed in your `Build.cs` file (e.g., \"Core\", \"Engine\", \"InputCore\").",
    solutionZh: "解决 UBT 退出代码 6：\n1. **核对编译器输出**：在日志中向上滚动，寻找具体的 C++ 编译报错代码（如 C2039, C2065）。\n2. **刷新项目文件**：右键点击 .uproject 文件并选择 **Generate Visual Studio project files**。\n3. **验证模块依赖**：确保 `Build.cs` 文件中列出了所有必要的引擎模块（如 \"Core\", \"Engine\", \"InputCore\"）。"
  },
  {
    id: "unreal-shader-fail",
    titleEn: "Shader Compiler Failure",
    titleZh: "着色器编译器失败 (Shader Compiler Crash)",
    platform: "unreal",
    engine: "unreal",
    summaryEn: "The shader compilation process crashed or timed out, often due to complex materials, missing SM6 support, or insufficient VRAM on the build agent.",
    summaryZh: "着色器编译过程崩溃或超时。通常由于材质过大、缺少 SM6 支持，或者构建节点的 VRAM/显存不足导致。",
    sampleError: "[ShaderCompiler] Fatal error: ShaderCompileWorker crashed!\n[ShaderCompiler] Failed to compile Global Shader: FPostProcessVS",
    solutionEn: "To resolve shader failures:\n1. **Clear Shader Cache**: Delete the `DerivedDataCache` folder in your Unreal project directory.\n2. **Check SM Version**: Verify that your target platform supports the requested Shader Model (e.g., SM6 vs SM5).\n3. **Build Agent Hardware**: Ensure the build agent has a dedicated GPU or enough shared memory for ShaderCompileWorker.",
    solutionZh: "解决着色器编译失败：\n1. **清理着色器缓存**：删除 Unreal 项目目录下的 `DerivedDataCache` 文件夹。\n2. **检查 SM 版本**：确保目标平台支持所请求的着色器模型（例如 SM6 或 SM5）。\n3. **构建节点硬件**：确保构建节点配备了独立显卡，或者有足够的共享内存供 ShaderCompileWorker 使用。"
  }
];

export function getPlatformExtension(platform: string): string {
  switch (platform) {
    case "android": return "apk";
    case "ios": return "ipa";
    case "webgl": return "zip";
    default: return "exe";
  }
}
export const SEARCH_ITEMS = [
  // Troubleshooting articles
  {
    id: "ios-signing",
    type: "troubleshooter",
    titleEn: "No Matching Provisioning Profile (iOS)",
    titleZh: "找不到匹配的 iOS 描述文件",
    descEn: "Xcode compilation or archive failures caused by missing provisioning profiles.",
    descZh: "由缺失 Provisioning Profile 导致的 Xcode 归档或编译失败。"
  },
  {
    id: "android-multidex",
    type: "troubleshooter",
    titleEn: "Android 64K Dex Method Limit Exceeded",
    titleZh: "Android 64K Dex 方法数超限",
    descEn: "Dalvik compilation limits exceeded when integrating multiple SDKs.",
    descZh: "集成多个 SDK 导致 Dalvik 编译器方法数限制溢出。"
  },
  {
    id: "unity-editor-ref",
    type: "troubleshooter",
    titleEn: "UnityEditor API Reference Compiler Error",
    titleZh: "UnityEditor 命名空间编译报错",
    descEn: "Compiling standalones with references to editor-only scripts.",
    descZh: "非编辑器模式下包含 UnityEditor 专属脚本引用导致打包报错。"
  },
  {
    id: "il2cpp-ndk",
    type: "troubleshooter",
    titleEn: "IL2CPP Compilation Failure (Missing NDK)",
    titleZh: "IL2CPP 编译失败 / NDK 缺失",
    descEn: "Unity failing to locate a compatible Android NDK toolchain.",
    descZh: "Unity 无法定位兼容的 Android NDK 路径导致 C++ 编译失败。"
  },
  // CI/CD Templates
  {
    id: "gitlab",
    type: "pipeline",
    titleEn: "GitLab CI Workflow Template",
    titleZh: "GitLab CI 工作流模板",
    descEn: "Pre-configured .gitlab-ci.yml for automated packaging pipelines.",
    descZh: "预制的 .gitlab-ci.yml 配置文件，用于自动化打包流水线。"
  },
  {
    id: "bitbucket",
    type: "pipeline",
    titleEn: "Bitbucket Pipelines Template",
    titleZh: "Bitbucket Pipelines 配置文件",
    descEn: "Pre-configured bitbucket-pipelines.yml build configurations.",
    descZh: "预配置的 bitbucket-pipelines.yml 编译工作流。"
  }
];
