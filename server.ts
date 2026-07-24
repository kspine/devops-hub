import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { WIKI_KNOWLEDGE_BASE } from "./src/wikiData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to lazy-initialize GoogleGenAI to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// Endpoints
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "GameOps & CI/CD Pipeline Server",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// System & Cluster Metrics
app.get("/api/metrics", (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    timestamp: new Date().toISOString(),
    system: {
      cpuLoadPercent: Math.floor(Math.random() * 25) + 35,
      memoryUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
      activeJobsCount: Math.floor(Math.random() * 5) + 2,
      completedTodayCount: 148,
      failedTodayCount: 6,
      avgBuildDurationSeconds: 462,
    },
    runnersSummary: {
      totalNodes: 18,
      onlineNodes: 16,
      busyNodes: 6,
      idleNodes: 10,
      offlineNodes: 2
    }
  });
});

// Build Runners Status
app.get("/api/runners/status", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    cluster: "gameops-build-us-east",
    runners: [
      { id: "unity-win-01", type: "unity", platform: "Windows/Android", status: "busy", activeJob: "Build #1042 - SpaceShooter Android", cpuUsage: "78%", ramUsage: "14.2 GB / 32 GB" },
      { id: "unity-mac-01", type: "unity", platform: "macOS/iOS", status: "busy", activeJob: "Build #1041 - SpaceShooter iOS IPA", cpuUsage: "82%", ramUsage: "18.5 GB / 32 GB" },
      { id: "unreal-uat-01", type: "unreal", platform: "Win64 DirectX12", status: "busy", activeJob: "Build #892 - Unreal Cook Win64", cpuUsage: "96%", ramUsage: "28.4 GB / 64 GB" },
      { id: "web-bundler-01", type: "web", platform: "Linux x86_64", status: "idle", activeJob: null, cpuUsage: "4%", ramUsage: "2.1 GB / 16 GB" },
      { id: "backend-k8s-01", type: "backend", platform: "Docker/Go", status: "idle", activeJob: null, cpuUsage: "8%", ramUsage: "3.5 GB / 16 GB" }
    ]
  });
});

// Build History Query
app.get("/api/builds/history", (req, res) => {
  const { limit = 10, platform = "all" } = req.query;
  const mockBuilds = [
    { id: "BUILD-1042", platform: "android", projectType: "unity", status: "success", duration: "6m 12s", commit: "a7f9b2c", author: "Alex Rivers", time: "10 mins ago" },
    { id: "BUILD-1041", platform: "ios", projectType: "unity", status: "success", duration: "8m 45s", commit: "3e1d8a4", author: "Sarah Chen", time: "25 mins ago" },
    { id: "BUILD-1040", platform: "win64", projectType: "unreal", status: "failed", duration: "14m 02s", commit: "9c4f1e0", author: "Michael Zhang", time: "1 hour ago" },
    { id: "BUILD-1039", platform: "webgl", projectType: "web", status: "success", duration: "2m 10s", commit: "f2a8c51", author: "DevOps Bot", time: "2 hours ago" },
    { id: "BUILD-1038", platform: "backend", projectType: "backend", status: "success", duration: "3m 30s", commit: "7b0e3f2", author: "Elena Rostova", time: "3 hours ago" }
  ];
  
  const filtered = platform === "all" ? mockBuilds : mockBuilds.filter(b => b.platform === platform || b.projectType === platform);
  res.json({
    total: filtered.length,
    builds: filtered.slice(0, Number(limit))
  });
});

// Export Workspace Pipeline Package
app.post("/api/workspace/export", (req, res) => {
  const { workspaceName, pipelineConfig, language } = req.body;
  res.json({
    exportedAt: new Date().toISOString(),
    filename: `${(workspaceName || "pipeline").toLowerCase().replace(/\s+/g, '-')}-config.json`,
    package: {
      version: "1.2.0",
      workspace: workspaceName || "Default Workspace",
      pipeline: pipelineConfig || {},
      generatedBy: "GameOps CI/CD Automation Engine"
    }
  });
});

// 1. Pipeline Generation Endpoint (Instant static templates based on selection)
app.post("/api/build-trigger", async (req, res) => {
  // Simulate build duration
  await new Promise(resolve => setTimeout(resolve, 3000));
  const success = Math.random() > 0.1;
  res.json({ success, message: success ? "Build completed successfully" : "Build failed due to resource conflict" });
});

app.post("/api/generate-pipeline", (req, res) => {
  try {
    const { platform, enabledSteps, language, projectType, targetEnv = "staging" } = req.body as { 
      platform: string; 
      enabledSteps: string[]; 
      language?: string; 
      projectType?: string; 
      targetEnv?: "qa" | "staging" | "production"; 
    };
    if (!platform) {
      return res.status(400).json({ error: "Platform is required" });
    }

    const isZh = language === "zh";
    const steps = enabledSteps || [];
    const envUpper = targetEnv.toUpperCase();

    if (projectType === "unreal") {
      const generateUnrealCpp = () => {
        return `// Unreal Engine Automation Build Script - Target Environment: ${envUpper}
#include "CoreMinimal.h"
#include "Editor.h"
#include "UnrealEd.h"

void FGameEditorBuilder::BuildProject()
{
    FString ProjectPath = FPaths::ProjectDir();
    FString OutputPath = FPaths::Combine(ProjectPath, TEXT("Builds/${platform}"));
    FString TargetEnv = TEXT("${targetEnv}");
    
    UE_LOG(LogTemp, Log, TEXT("Starting Unreal ${platform.toUpperCase()} [Environment: %s] Build -> %s"), *TargetEnv, *OutputPath);
    
    // Automation tool call simulated for ${envUpper} environment
    // RunUAT.bat BuildCookRun -project="%s" -platform=${platform} -cook -stage -archive -clientconfig=${targetEnv === "production" ? "Shipping" : "Development"}
}`;
      };

      const generateUnrealPython = () => {
        return `import unreal
import os

def build_unreal_project():
    platform = "${platform}"
    target_env = "${targetEnv}"
    output_path = os.path.join(unreal.Paths.project_dir(), "Builds", platform)
    unreal.log(f"Starting build for {platform} in [{target_env.upper()}] environment...")
    
    # Logic to trigger UAT (Unreal Automation Tool)
    # config = "Shipping" if target_env == "production" else "Development"
    # os.system(f"RunUAT.bat BuildCookRun -platform={platform} -clientconfig={config} ...")

if __name__ == "__main__":
    build_unreal_project()`;
      };

      const generateUnrealJenkinsfile = () => {
        if (targetEnv === "qa") {
          return `pipeline {
    agent { label 'unreal-qa-runner' }
    environment {
        TARGET_ENV = 'QA'
        UE_LOG_LEVEL = 'VeryVerbose'
    }
    stages {
        stage('Clean') {
            steps {
                sh "rm -rf Intermediate/Build/ Saved/Logs/"
            }
        }
        stage('Sync P4 Source') {
            steps {
                sh "p4 sync //depot/project/dev/..."
            }
        }
        stage('Build & Cook') {
            steps {
                echo "Running QA fast development build..."
                sh "RunUAT.sh BuildCookRun -platform=${platform} -clientconfig=Development -cook -stage -archive"
            }
        }
        stage('Run Automation Tests') {
            steps {
                echo "Running Unreal standard automation test suites..."
                sh "RunUAT.sh RunTests -test='Project.Unit'"
            }
        }
    }
}`;
        } else if (targetEnv === "production") {
          return `pipeline {
    agent { label 'unreal-shipping-cluster' }
    environment {
        TARGET_ENV = 'PRODUCTION'
        SIGNING_VAULT = credentials('unreal-production-vault')
    }
    stages {
        stage('Clean workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Sync Release Branch') {
            steps {
                sh "p4 sync //depot/project/main/..."
            }
        }
        stage('Shader Compile') {
            steps {
                echo "Warming shared DDC server..."
                sh "RunUAT.sh PrecompileShaders"
            }
        }
        stage('Shipping Build') {
            steps {
                echo "Compiling client with fully optimized Shipping configuration..."
                sh "RunUAT.sh BuildCookRun -platform=${platform} -clientconfig=Shipping -cook -stage -pak -prereqs -archive"
            }
        }
        stage('Secure Signing') {
            steps {
                echo "Applying cryptographic certificates to package..."
                sh "./scripts/sign_package.sh -env PRODUCTION -cert \\\${SIGNING_VAULT}"
            }
        }
        stage('CDN Prewarm') {
            steps {
                echo "Pre-warming global edge CDN nodes..."
                sh "curl -X POST -H 'Content-Type: application/json' -d '{\\"url\\":\\"https://cdn.studio.game/releases/${platform}/\\",\\"env\\":\\"production\\"}' https://api.gameops-cdn.com/prewarm"
            }
        }
    }
}`;
        } else {
          // Staging environment
          return `pipeline {
    agent { label 'unreal-staging-runner' }
    environment {
        TARGET_ENV = 'STAGING'
    }
    stages {
        stage('Clean') {
            steps {
                sh "rm -rf Intermediate/Build/"
            }
        }
        stage('Build & Cook') {
            steps {
                echo "Running Staging optimized development build..."
                sh "RunUAT.sh BuildCookRun -platform=${platform} -clientconfig=Development -cook -stage -archive"
            }
        }
        stage('Upload to AdHoc / TestFlight') {
            steps {
                echo "Deploying Staging artifact to internal testers..."
                sh "./scripts/deploy.sh --target staging --platform ${platform}"
            }
        }
    }
}`;
        }
      };

      const generateUnrealGHA = () => {
        if (targetEnv === "qa") {
          return `name: Unreal QA Pipeline (${platform.toUpperCase()})
on:
  push:
    branches: [ "dev", "feature/*" ]
jobs:
  qa_build:
    runs-on: windows-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4
      - name: Build & Run Fast Tests
        run: |
          echo "Building Unreal Project in Development Config..."
          RunUAT.bat BuildCookRun -platform=${platform} -clientconfig=Development -cook -stage -archive
          RunUAT.bat RunTests -test="Project.Unit"`;
        } else if (targetEnv === "production") {
          return `name: Unreal Production Release (${platform.toUpperCase()})
on:
  push:
    tags: [ "v*" ]
jobs:
  release_build:
    runs-on: windows-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4
      - name: Fetch Shared DDC Server
        run: echo "Connecting to Shared DDC Cache on S3..."
      - name: Build Shipping Client
        run: |
          RunUAT.bat BuildCookRun -platform=${platform} -clientconfig=Shipping -cook -stage -pak -prereqs -archive
      - name: Secure Production Sign
        env:
          KEY_CERT: \${{ secrets.RELEASE_KEY_BASE64 }}
        run: |
          echo "Executing release package cryptographic signing..."
      - name: Warmup CDN Cache
        run: |
          curl -X POST -H "Content-Type: application/json" -d '{"url":"https://cdn.studio.com/"}' https://api.gameops-cdn.com/prewarm`;
        } else {
          return `name: Unreal Staging Pipeline (${platform.toUpperCase()})
on:
  push:
    branches: [ "main", "release/*" ]
jobs:
  staging_build:
    runs-on: windows-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4
      - name: Build Staging Client
        run: |
          RunUAT.bat BuildCookRun -platform=${platform} -clientconfig=Development -cook -stage -archive
      - name: Upload to Internal Hub
        run: echo "Publishing build to Staging testers..."`;
        }
      };

      return res.json({
        cpp: {
          title: isZh ? "Unreal C++ 编译助手" : "Unreal C++ Build Helper",
          filename: "GameBuilder.cpp",
          explanation: isZh ? `用于 Unreal Editor 的 C++ 自动化构建扩展（目标环境：${envUpper}）。` : `C++ extension for Unreal Editor automation (Target: ${envUpper}).`,
          code: generateUnrealCpp()
        },
        python: {
          title: isZh ? "Unreal Python 自动化脚本" : "Unreal Python Automation",
          filename: "unreal_build.py",
          explanation: isZh ? `利用 Unreal Python API 在 ${envUpper} 环境下执行构建任务。` : `Execute build tasks via Unreal Python API for ${envUpper} environment.`,
          code: generateUnrealPython()
        },
        jenkins: {
          title: isZh ? `Unreal Jenkinsfile (${envUpper})` : `Unreal Jenkinsfile (${envUpper})`,
          filename: "Jenkinsfile",
          explanation: isZh ? `针对 Unreal Engine ${envUpper} 环境深度优化的 Jenkins 流水线模版。` : `Jenkins pipeline template deeply optimized for Unreal Engine ${envUpper}.`,
          code: generateUnrealJenkinsfile()
        },
        github: {
          title: isZh ? `Unreal GHA Workflow (${envUpper})` : `Unreal GHA Workflow (${envUpper})`,
          filename: "unreal-ci.yml",
          explanation: isZh ? `针对 Unreal Engine ${envUpper} 环境配置的 GitHub Actions 工作流。` : `GitHub Actions workflow configured for Unreal Engine ${envUpper}.`,
          code: generateUnrealGHA()
        }
      });
    }
    if (projectType === "web") {
      const generateWebDocker = () => {
        return `FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;
      };

      const generateWebJenkins = () => {
        return `pipeline {
    agent { label 'node-runner' }
    stages {
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('Lint & Test') {
            steps {
                sh "npm run lint"
            }
        }
        stage('Production Build') {
            steps {
                sh "npm run build"
            }
        }
        stage('Docker Build & Push') {
            steps {
                sh "docker build -t web-app:${targetEnv} ."
                sh "docker tag web-app:${targetEnv} registry.studio.com/web-app:${targetEnv}"
            }
        }
    }
}`;
      };

      const generateWebGHA = () => {
        return `name: Web Application CI/CD
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - name: Deploy to Cloud
        run: echo "Deploying static assets to production..."`;
      };

      return res.json({
        docker: {
          title: isZh ? "Docker 容器配置" : "Dockerfile Configuration",
          filename: "Dockerfile",
          explanation: isZh ? "用于 Web 应用程序的多阶段构建 Docker 镜像。" : "Multi-stage Docker build for web application.",
          code: generateWebDocker()
        },
        jenkins: {
          title: "Web Jenkinsfile",
          filename: "Jenkinsfile",
          explanation: isZh ? "用于 Web 应用的 CI/CD 流水线。" : "CI/CD pipeline for web application.",
          code: generateWebJenkins()
        },
        github: {
          title: "Web GHA Workflow",
          filename: "deploy.yml",
          explanation: isZh ? "GitHub Actions 部署配置。" : "GitHub Actions deployment configuration.",
          code: generateWebGHA()
        },
        python: {
          title: "Web Deploy Helper",
          filename: "deploy.py",
          explanation: isZh ? "用于部署 Web 产物的 Python 脚本。" : "Python helper for web deployment.",
          code: `import os\nprint("Deploying web assets...")`
        }
      });
    }

    if (projectType === "mobile") {
      const generateMobileGHA = () => {
        return `name: Mobile Build
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.0'
      - run: flutter pub get
      - run: flutter build ${platform === "android" ? "apk" : "ios --no-codesign"}`;
      };

      return res.json({
        jenkins: {
          title: "Mobile Jenkinsfile",
          filename: "Jenkinsfile",
          explanation: isZh ? "移动端 Flutter 构建流水线。" : "Mobile Flutter build pipeline.",
          code: `pipeline {\n  agent { label 'macos-runner' }\n  stages {\n    stage('Build') {\n      steps {\n        sh "flutter build ${platform}"\n      }\n    }\n  }\n}`
        },
        github: {
          title: "Mobile GHA Workflow",
          filename: "mobile-ci.yml",
          explanation: isZh ? "GitHub Actions 移动端构建。" : "GitHub Actions mobile build.",
          code: generateMobileGHA()
        },
        python: {
          title: "Fastlane Config",
          filename: "Fastfile",
          explanation: isZh ? "Fastlane 自动化发布配置。" : "Fastlane automation configuration.",
          code: `lane :deploy do\n  build_app\n  upload_to_testflight\nend`
        },
        csharp: {
          title: "Native Script",
          filename: "NativeHelper.kt",
          explanation: isZh ? "原生代码辅助类。" : "Native helper class.",
          code: `class NativeHelper { }`
        }
      });
    }

    if (projectType === "backend") {
      const generateBackendK8s = () => {
        return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: registry.studio.com/backend:${targetEnv}
        ports:
        - containerPort: 8080`;
      };

      return res.json({
        docker: {
          title: "Backend Dockerfile",
          filename: "Dockerfile",
          explanation: isZh ? "后端服务容器化配置。" : "Backend containerization.",
          code: `FROM golang:1.22-alpine\nWORKDIR /app\nCOPY . .\nRUN go build -o main .\nCMD ["./main"]`
        },
        jenkins: {
          title: "Backend Jenkinsfile",
          filename: "Jenkinsfile",
          explanation: isZh ? "后端 CI/CD 流程。" : "Backend CI/CD workflow.",
          code: `pipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps {\n        sh "go build -o server"\n      }\n    }\n  }\n}`
        },
        github: {
          title: "Backend GHA Workflow",
          filename: "backend-ci.yml",
          explanation: isZh ? "GitHub Actions 后端构建。" : "GitHub Actions backend CI.",
          code: `name: Backend CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: go test ./...`
        },
        python: {
          title: "K8s Deployment",
          filename: "deployment.yaml",
          explanation: isZh ? "Kubernetes 部署清单。" : "Kubernetes deployment manifest.",
          code: generateBackendK8s()
        }
      });
    }

    const generateCSharpCode = () => {
      let runSteps = "";
      let buildTarget = "BuildTarget.StandaloneWindows64";
      let buildOptions = "BuildOptions.None";
      let fileExt = "exe";

      if (platform === "android") {
        buildTarget = "BuildTarget.Android";
        fileExt = "apk";
      } else if (platform === "ios") {
        buildTarget = "BuildTarget.iOS";
        fileExt = "xcodeproj";
      } else if (platform === "webgl") {
        buildTarget = "BuildTarget.WebGL";
        fileExt = "webgl";
      }

      // Respect the exact sequence of steps defined by the user
      steps.forEach((step) => {
        if (step === "clean") {
          runSteps += isZh 
            ? `        // 步骤: 清理构建文件夹\n        Debug.Log("正在清理构建目录...");\n        if (System.IO.Directory.Exists(outputPath))\n        {\n            System.IO.Directory.Delete(outputPath, true);\n        }\n        System.IO.Directory.CreateDirectory(outputPath);\n\n`
            : `        // Step: Clean Build Folders\n        Debug.Log("Cleaning build folders...");\n        if (System.IO.Directory.Exists(outputPath))\n        {\n            System.IO.Directory.Delete(outputPath, true);\n        }\n        System.IO.Directory.CreateDirectory(outputPath);\n\n`;
        }
        if (step === "addressables") {
          runSteps += isZh
            ? `        // 步骤: Addressables 资源包编译\n        #if UNITY_ADDRESSABLES\n        Debug.Log("正在编译 Addressables 资源包内容...");\n        UnityEditor.AddressableAssets.Settings.AddressableAssetSettings.BuildPlayerContent();\n        #else\n        Debug.LogWarning("Addressables 插件包未安装。跳过 Addressables 编译。");\n        #endif\n\n`
            : `        // Step: Addressables Compilation\n        #if UNITY_ADDRESSABLES\n        Debug.Log("Building Addressables asset groups...");\n        UnityEditor.AddressableAssets.Settings.AddressableAssetSettings.BuildPlayerContent();\n        #else\n        Debug.LogWarning("Addressables package is not installed. Skipping Addressables compilation.");\n        #endif\n\n`;
        }
        if (step === "prebuild_script") {
          runSteps += isZh
            ? `        // 步骤: 构建前版本自增及配置\n        Debug.Log("正在执行构建前置配置自适应...");\n        PlayerSettings.bundleVersion = "1.0." + System.DateTime.UtcNow.ToString("yyMMddHH");\n        #if UNITY_ANDROID\n        PlayerSettings.Android.bundleVersionCode = int.Parse(System.DateTime.UtcNow.ToString("yyMMdd"));\n        #elif UNITY_IOS\n        PlayerSettings.iOS.buildNumber = System.DateTime.UtcNow.ToString("yyMMddHH");\n        #endif\n\n`
            : `        // Step: Pre-Build Version Incrementor\n        Debug.Log("Executing pre-build configuration...");\n        PlayerSettings.bundleVersion = "1.0." + System.DateTime.UtcNow.ToString("yyMMddHH");\n        #if UNITY_ANDROID\n        PlayerSettings.Android.bundleVersionCode = int.Parse(System.DateTime.UtcNow.ToString("yyMMdd"));\n        #elif UNITY_IOS\n        PlayerSettings.iOS.buildNumber = System.DateTime.UtcNow.ToString("yyMMddHH");\n        #endif\n\n`;
        }
        if (step === "unity_build") {
          runSteps += isZh
            ? `        // 步骤: 编译生成 Player 包体\n        Debug.Log("开始执行 Unity Player 批处理编译...");\n        string buildFile = System.IO.Path.Combine(outputPath, "BuildGame.${fileExt}");\n        string[] scenes = GetEnabledScenes();\n\n        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();\n        buildPlayerOptions.scenes = scenes;\n        buildPlayerOptions.locationPathName = buildFile;\n        buildPlayerOptions.target = ${buildTarget};\n        buildPlayerOptions.options = ${buildOptions};\n\n        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);\n        BuildSummary summary = report.summary;\n\n        if (summary.result == BuildResult.Succeeded)\n        {\n            Debug.Log($"构建成功: {summary.totalSize} 字节，耗时 {summary.totalTime.TotalSeconds} 秒。");\n        }\n        else if (summary.result == BuildResult.Failed)\n        {\n            Debug.LogError("构建失败: 遇到 " + summary.totalErrors + " 个错误。");\n            EditorApplication.Exit(1);\n        }\n\n`
            : `        // Step: Compile Player\n        Debug.Log("Starting Unity Player build...");\n        string buildFile = System.IO.Path.Combine(outputPath, "BuildGame.${fileExt}");\n        string[] scenes = GetEnabledScenes();\n\n        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();\n        buildPlayerOptions.scenes = scenes;\n        buildPlayerOptions.locationPathName = buildFile;\n        buildPlayerOptions.target = ${buildTarget};\n        buildPlayerOptions.options = ${buildOptions};\n\n        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);\n        BuildSummary summary = report.summary;\n\n        if (summary.result == BuildResult.Succeeded)\n        {\n            Debug.Log($"Build Succeeded: {summary.totalSize} bytes in {summary.totalTime.TotalSeconds} seconds.");\n        }\n        else if (summary.result == BuildResult.Failed)\n        {\n            Debug.LogError("Build Failed: " + summary.totalErrors + " errors encountered.");\n            EditorApplication.Exit(1);\n        }\n\n`;
        }
      });

      return `using System;
using System.IO;
using System.Linq;
using UnityEngine;
using UnityEditor;
using UnityEditor.Build.Reporting;

public class GameBuilder : MonoBehaviour
{
    private static readonly string DefaultBuildPath = "Builds/${platform}";

    [MenuItem("Build/Automated Build/${platform}")]
    public static void Build()
    {
        string outputPath = GetCommandLineArg("-outputPath") ?? DefaultBuildPath;
        Debug.Log($"\${isZh ? '正在启动自动化流水线编译' : 'Starting automated build workflow for'} \${platform.toUpperCase()} -> {outputPath}");

${runSteps}    }

    private static string[] GetEnabledScenes()
    {
        return EditorBuildSettings.scenes
            .Where(s => s.enabled)
            .Select(s => s.path)
            .ToArray();
    }

    private static string GetCommandLineArg(string name)
    {
        string[] args = System.Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == name && i + 1 < args.Length)
            {
                return args[i + 1];
            }
        }
        return null;
    }
}`;
    };

    // Helper to generate Jenkinsfile
    const generateJenkinsfile = () => {
      let stages = "";
      steps.forEach((step) => {
        if (step === "clean") {
          stages += `        stage('${isZh ? '清理工作空间' : 'Clean Workspace'}') {\n            steps {\n                echo '${isZh ? '正在清理输出目标...' : 'Cleaning output targets...'}'\n                sh "rm -rf Builds/${platform}/*"\n            }\n        }\n`;
        }
        if (step === "prebuild_script") {
          stages += `        stage('${isZh ? '构建前置处理' : 'Pre-Build Configurations'}') {\n            steps {\n                echo '${isZh ? '正在应用自动化版本自增及配置适配...' : 'Incrementing pipeline builds and setting bundle targets...'}'\n            }\n        }\n`;
        }
        if (step === "unity_build") {
          let unityCmd = `\\\${UNITY_PATH} -batchmode -quit -projectPath . -executeMethod GameBuilder.Build -logFile build.log -outputPath Builds/${platform}`;
          stages += `        stage('${isZh ? 'Unity 静默批处理构建' : 'Unity headless build'}') {\n            steps {\n                echo '${isZh ? '正在启动 Unity 批处理构建...' : 'Booting Unity Editor in batchmode...'}'\n                withEnv(["UNITY_PATH=/Applications/Unity/Hub/Editor/2022.3.20f1/Unity.app/Contents/MacOS/Unity"]) {\n                    sh "${unityCmd}"\n                }\n                archiveArtifacts artifacts: 'build.log', allowEmptyArchive: true\n            }\n        }\n`;
        }
        if (step === "postprocess_xcode" && platform === "ios") {
          stages += `        stage('${isZh ? 'Xcode 签名与归档' : 'Xcode Build & Archive'}') {\n            steps {\n                echo '${isZh ? '正在签名并打包 Xcode 归档...' : 'Signing & archiving Xcode build...'}'\n                sh '''\n                    cd Builds/ios\n                    security unlock-keychain -p "\\\${KEYCHAIN_PASSWORD}" ~/Library/Keychains/login.keychain\n                    xcodebuild -workspace Unity-iPhone.xcworkspace -scheme Unity-iPhone -configuration Release -archivePath Unity-iPhone.xcarchive archive\n                    xcodebuild -exportArchive -archivePath Unity-iPhone.xcarchive -exportPath ../final-ipa -exportOptionsPlist ExportOptions.plist\n                '''\n            }\n        }\n`;
        }
        if (step === "sign_package" && platform === "android") {
          stages += `        stage('${isZh ? '对 Android 包体进行签名' : 'Sign Android Package'}') {\n            steps {\n                echo '${isZh ? '正在对 AAB / APK 产物进行签名...' : 'Signing AAB / APK artifact...'}'\n                sh "apksigner sign --ks \\$KEYSTORE_FILE --ks-pass pass:\\$KEYSTORE_PASSWORD Builds/android/BuildGame.apk"\n            }\n        }\n`;
        }
        if (step === "store_upload") {
          if (platform === "ios") {
            stages += `        stage('${isZh ? '部署到 TestFlight' : 'Deploy to TestFlight'}') {\n            steps {\n                echo '${isZh ? '正在上传 IPA 软件包至 App Store Connect...' : 'Uploading IPA to App Store Connect...'}'\n                sh "xcrun altool --upload-app --type ios --file Builds/final-ipa/BuildGame.ipa --username \\$APPLE_USER --password \\$APPLE_APP_SPECIFIC_PASSWORD"\n            }\n        }\n`;
          } else if (platform === "android") {
            stages += `        stage('${isZh ? '部署到 Google Play' : 'Deploy to Google Play'}') {\n            steps {\n                echo '${isZh ? '正在将生成的包体上传至 Google Play 内部共享通道...' : 'Uploading artifact to Play Internal App Sharing...'}'\n                // ${isZh ? '已与 Google Play 插件完成集成' : 'Integration via Google Play Android Publisher plugin'}\n            }\n        }\n`;
          }
        }
        if (step === "notify") {
          stages += `        stage('${isZh ? '发送 Slack 渠道通知' : 'Slack Notification'}') {\n            steps {\n                slackSend channel: '#dev-builds', color: '#36a64f', message: "SUCCESS: Unity ${platform.toUpperCase()} Build #\\\${BUILD_NUMBER} ${isZh ? '编译打包已顺利完成！' : 'completed!'} Artifacts: \\\${ENV.BUILD_URL}"\n            }\n        }\n`;
        }
      });

      return `pipeline {
    agent { label 'unity-builder' }
    
    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }
    
    environment {
        KEYCHAIN_PASSWORD = credentials('mac-keychain-pass')
        APPLE_APP_SPECIFIC_PASSWORD = credentials('apple-app-pass')
        TARGET_ENV = '${targetEnv.toUpperCase()}'
    }

    stages {
${stages}    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo '${isZh ? '流水线编译过程意外终止！' : 'Build Pipeline encountered a failure!'}'
            slackSend channel: '#dev-builds', color: '#ff0000', message: "FAILED: Unity ${platform.toUpperCase()} Build #\\\${BUILD_NUMBER} failed."
        }
    }
}`;
    };

    // Helper to generate GitHub Actions Workflow
    const generateGitHubCode = () => {
      let ghaSteps = `    - name: ${isZh ? '检出仓库源码' : 'Checkout Repository'}\n      uses: actions/checkout@v4\n      with:\n        lfs: true\n\n    - name: ${isZh ? '配置 Library 缓存加速' : 'Cache Library Folder'}\n      uses: actions/cache@v4\n      with:\n        path: Library\n        key: Library-\\\${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}\n        restore-keys: Library-\n\n`;

      steps.forEach((step) => {
        if (step === "clean") {
          ghaSteps += `    - name: ${isZh ? '清理旧版构建输出' : 'Clean Build Folders'}\n      run: rm -rf Builds/${platform}\n\n`;
        }
        if (step === "prebuild_script") {
          ghaSteps += `    - name: ${isZh ? '前置版本号配置' : 'Pre-Build Versioning'}\n      run: echo "Setting player build numbers for ${targetEnv.toUpperCase()}..."\n\n`;
        }
        if (step === "addressables") {
          ghaSteps += `    - name: ${isZh ? '编译 Addressables 资源组' : 'Build Addressables'}\n      run: echo "Generating addressable groups..."\n\n`;
        }
        if (step === "unity_build") {
          ghaSteps += `    - name: ${isZh ? '静默运行 Unity 编译' : 'Build Unity Player'}\n      uses: game-ci/unity-builder@v4\n      env:\n        UNITY_LICENSE: \\\${{ secrets.UNITY_LICENSE }}\n        TARGET_ENV: ${targetEnv}\n      with:\n        targetPlatform: ${platform === "android" ? "Android" : platform === "ios" ? "iOS" : platform === "webgl" ? "WebGL" : "StandaloneWindows64"}\n        buildMethod: GameBuilder.Build\n        customParameters: -outputPath Builds/${platform}\n\n`;
        }
        if (step === "postprocess_xcode" && platform === "ios") {
          ghaSteps += `    - name: ${isZh ? 'Xcode 编译归档' : 'Xcode Archive'}\n      run: echo "Running Xcode configuration archive..."\n\n`;
        }
        if (step === "sign_package" && platform === "android") {
          ghaSteps += `    - name: ${isZh ? '签署 Android 证书密钥' : 'Sign Android Release'}\n      uses: r0adkll/sign-android-release@v1\n      with:\n        releaseDirectory: Builds/android\n        signingKeyBase64: \\\${{ secrets.SIGNING_KEY }}\n        alias: \\\${{ secrets.ALIAS }}\n        keyStorePassword: \\\${{ secrets.KEYSTORE_PASSWORD }}\n        keyPassword: \\\${{ secrets.KEY_PASSWORD }}\n\n`;
        }
        if (step === "store_upload" && platform === "ios") {
          ghaSteps += `    - name: ${isZh ? '上传 IPA 至 TestFlight' : 'Upload to TestFlight'}\n      uses: apple-actions/upload-testflight-build@v1\n      with:\n        app-path: 'Builds/ios/BuildGame.ipa'\n        issuer-id: \\\${{ secrets.APPSTORE_ISSUER_ID }}\n        api-key-id: \\\${{ secrets.APPSTORE_KEY_ID }}\n        api-key-private: \\\${{ secrets.APPSTORE_PRIVATE_KEY }}\n\n`;
        }
        if (step === "notify") {
          ghaSteps += `    - name: ${isZh ? '触发 Discord 机器人通知' : 'Discord Notification'}\n      uses: Ilshidur/action-discord@master\n      env:\n        DISCORD_WEBHOOK: \\\${{ secrets.DISCORD_WEBHOOK }}\n      with:\n        args: '🎉 Unity ${platform.toUpperCase()} [${targetEnv.toUpperCase()}] ${isZh ? '自动化构建流程顺利跑通！' : 'automated build finished successfully!'}'\n`;
        }
      });

      return `name: Unity Build Workflow (${platform.toUpperCase()}) - ${targetEnv.toUpperCase()}

on:
  push:
    branches: [ "main", "release/*" ]
  workflow_dispatch:

env:
  TARGET_ENV: ${targetEnv}

jobs:
  build:
    name: Build Game [${platform.toUpperCase()}] (${targetEnv.toUpperCase()})
    runs-on: ${platform === "ios" ? "macos-latest" : "ubuntu-latest"}
    
    steps:
${ghaSteps}`;
    };

    // Helper to generate Python helper
    const generatePythonCode = () => {
      let pyLogic = "";
      steps.forEach((step) => {
        if (step === "clean") {
          pyLogic += `    # Step: Clean Output\n    print("${isZh ? '正在清理旧版编译输出路径...' : 'Cleaning build folders...'}")\n    if os.path.exists(args.output_path):\n        shutil.rmtree(args.output_path)\n    os.makedirs(args.output_path, exist_ok=True)\n\n`;
        }
        if (step === "prebuild_script") {
          pyLogic += `    # Step: Pre-Build Configuration\n    print("${isZh ? '正在执行构建前置配置...' : 'Executing pre-build configuration...'}")\n\n`;
        }
        if (step === "addressables") {
          pyLogic += `    # Step: Addressables compilation\n    print("${isZh ? '正在编译 Addressables 资源包...' : 'Building Addressables groups...'}")\n\n`;
        }
        if (step === "unity_build") {
          pyLogic += `    # Step: Execute Headless Unity Build\n    print(f"${isZh ? '正在启动 Unity 批处理后台构建' : 'Launching batch build for'} ${platform}...")\n    unity_executable = "/Applications/Unity/Hub/Editor/2022.3.20f1/Unity.app/Contents/MacOS/Unity"\n    if sys.platform.startswith("win"):\n        unity_executable = r"C:\\Program Files\\Unity\\Hub\\Editor\\2022.3.20f1\\Editor\\Unity.exe"\n\n    build_cmd = [\n        unity_executable,\n        "-batchmode",\n        "-quit",\n        "-projectPath", ".",\n        "-executeMethod", "GameBuilder.Build",\n        "-logFile", "unity_build.log",\n        "-outputPath", args.output_path\n    ]\n\n    try:\n        subprocess.run(build_cmd, check=True, text=True)\n        print("${isZh ? 'Unity 批处理进程顺利结束！' : 'Unity process completed successfully!'}")\n    except subprocess.CalledProcessError as e:\n        print(f"${isZh ? 'Unity 批处理报错中断，退出代码' : 'Unity build crashed with exit code'} {e.returncode}. ${isZh ? '详情请参阅' : 'Inspect'} unity_build.log", file=sys.stderr)\n        sys.exit(1)\n\n`;
        }
        if (step === "postprocess_xcode" && platform === "ios") {
          pyLogic += `    # Step: Xcode Compile\n    print("${isZh ? '正在执行 Xcode 编译与签名...' : 'Executing Xcode build and signing...'}")\n\n`;
        }
        if (step === "sign_package" && platform === "android") {
          pyLogic += `    # Step: Android Apksigner\n    print("${isZh ? '正在为 Android APK 进行应用签名...' : 'Signing Android package...'}")\n\n`;
        }
        if (step === "store_upload") {
          pyLogic += `    # Step: Store Deployment Upload\n    print("${isZh ? '正在部署并上传安装包至应用分发渠道...' : 'Uploading artifact to distribution channels...'}")\n\n`;
        }
        if (step === "notify") {
          pyLogic += `    # Step: Slack notification webhooks\n    webhook_url = os.environ.get("SLACK_WEBHOOK")\n    if webhook_url:\n        print("${isZh ? '正在发送 Slack 自动化通道简报...' : 'Triggering Slack pipeline notification...'}")\n        payload = {"text": f"🚀 ${isZh ? '自动化脚本：Unity' : 'Automation Script: Build for'} ${platform.toUpperCase()} ${isZh ? '游戏客户端包编译完成且已发送通知。' : 'was generated and packaged successfully.'}"}\n        try:\n            req = urllib.request.Request(\n                webhook_url,\n                data=json.dumps(payload).encode('utf-8'),\n                headers={'Content-Type': 'application/json'}\n            )\n            with urllib.request.urlopen(req) as res:\n                print(f"${isZh ? 'Webhook 渠道推送响应状态码' : 'Webhook notification triggered'}: {res.status}")\n        except Exception as e:\n            print(f"${isZh ? 'Slack 推送失败' : 'Failed to post Slack notification'}: {e}", file=sys.stderr)\n`;
        }
      });

      return `#!/usr/bin/env python3
import os
import sys
import shutil
import subprocess
import argparse
import urllib.request
import json

def run_build_pipeline():
    parser = argparse.ArgumentParser(description="Unity automation deployment script.")
    parser.add_argument("--output_path", default="Builds/${platform}", help="Directory where build output will be saved")
    args = parser.parse_args()

    print("=========================================")
    print("      ${isZh ? 'UNITY 自动化出包部署工具链' : 'UNITY DEPLOYMENT AUTOMATION'}        ")
    print("=========================================")
    
${pyLogic}    print("${isZh ? '全部任务运行结束！' : 'Build process complete!'}")

if __name__ == "__main__":
    run_build_pipeline()`;
    };

    return res.json({
      csharp: {
        title: isZh ? "Unity 编辑器 C# 编译脚本" : "Unity Editor Build C# Script",
        filename: "GameBuilder.cs",
        explanation: isZh 
          ? "此 Unity 编辑器辅助脚本用于 Headless 命令行批处理编译。请将此脚本放入您 Unity 工程的 'Assets/Scripts/Editor/GameBuilder.cs' 目录下。"
          : "This Unity editor script runs headless batch builds. Place this script inside 'Assets/Scripts/Editor/GameBuilder.cs' of your Unity project.",
        code: generateCSharpCode()
      },
      jenkins: {
        title: isZh ? "Jenkins 声明式流水线文件 (Jenkinsfile)" : "Jenkins Declarative Pipeline File",
        filename: "Jenkinsfile",
        explanation: isZh
          ? "请将此声明式 Jenkinsfile 放置在您的 Git 仓库根目录下。运行流水线需要确保指定的 Jenkins 打包机节点安装了 Unity 编辑器及对应的移动平台依赖包。"
          : "Place this declarative Jenkinsfile at the root of your Git repository. It expects a Jenkins agent with Unity installed and the necessary platform tools.",
        code: generateJenkinsfile()
      },
      github: {
        title: isZh ? "GitHub Actions CI/CD 工作流脚本" : "GitHub Actions CI/CD Workflow",
        filename: "unity-build.yml",
        explanation: isZh
          ? "将此 YAML 配置项保存为项目中的 '.github/workflows/unity-build.yml'。确保已在 GitHub 项目设置的 Secrets 里录入了您的证书与 UNITY_LICENSE。"
          : "Save this YAML file in '.github/workflows/unity-build.yml'. Ensure you configure secrets like UNITY_LICENSE in your GitHub repository.",
        code: generateGitHubCode()
      },
      python: {
        title: isZh ? "Python 3 独立自动化控制脚本" : "Python 3 Automation Wrapper",
        filename: "build_pipeline.py",
        explanation: isZh
          ? "这是一款极其轻量级的独立 Python 自动化脚本，适用于开发者本地快速一键出包、或在没有 Jenkins 的轻量云主机上执行一键打包清理与推送通知。"
          : "A clean python script for local developer environments or lightweight pipelines to clean caches, run Unity silently, and trigger notifications.",
        code: generatePythonCode()
      }
    });

  } catch (error: any) {
    console.error("Pipeline generation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 1.5. Webhook Notification Endpoint
app.post("/api/webhook/send", async (req, res) => {
  const { message, type } = req.body;
  const webhookUrl = type === 'slack' ? process.env.SLACK_WEBHOOK_URL : 
                     type === 'discord' ? process.env.DISCORD_WEBHOOK_URL : 
                     type === 'teams' ? process.env.TEAMS_WEBHOOK_URL : null;

  if (!webhookUrl) {
    return res.status(400).json({ error: "Invalid webhook type or URL not configured" });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to send webhook' });
  }
});

// 2. AI Error Diagnosis Endpoint
app.post("/api/ai-diagnose", async (req, res) => {
  try {
    const { errorLog, platform, language } = req.body as { errorLog: string; platform: string; language?: string };
    if (!errorLog || !errorLog.trim()) {
      return res.status(400).json({ error: "Error log content is required" });
    }

    const ai = getGeminiClient();
    const isZh = language === "zh";
    
    const systemPrompt = `You are a world-class GameOps, Unity DevOps, Unreal Engine DevOps, and mobile release engineering expert. 
Your goal is to diagnose build and compilation errors in Unity and Unreal Engine projects, C++/C# automation scripts, Jenkins, or mobile packages (IPA/APK/AAB/EXE).

Specifically for Unreal Engine, you are an expert in:
- Unreal Build Tool (UBT) exit codes and UBT configuration issues.
- Shader Compiler failures and shader worker crashes.
- PDB generation, missing symbols, and linker errors in MSVC/Clang.
- AutomationTool (UAT) command line arguments and BuildCookRun failures.

Analyze the user's provided error logs and target build platform. Return a response exclusively structured in JSON format.
${isZh ? "IMPORTANT: Since the user's language is Simplified Chinese, please translate 'rootCause', each item in 'steps', and 'explanation' into Simplified Chinese (keep code keywords, path variables, or system IDs like NDK, UBT, ShaderModel, or keystore in English or native format, but describe the actions in Chinese)." : "Write all textual answers in English."}

The JSON must follow this exact typescript schema:
{
  "rootCause": "A concise explanation of why this error happens (maximum 2 sentences).",
  "steps": [
    "Step-by-step remediation plan to resolve the issue (1-4 steps)."
  ],
  "explanation": "Deep dive into what went wrong and how to prevent it. Address NDK/SDK paths, signing keys, or assembly assemblies specifically if applicable.",
  "codeSnippet": "Optional code snippet or terminal command if helpful to copy.",
  "codeSnippetLanguage": "Optional programming language name for snippet syntax highlighting (e.g., 'csharp', 'groovy', 'bash', 'json')"
}`;

    const userPrompt = `Target Platform: ${platform || "General"}
Error Log Output:
${errorLog}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response returned from Gemini API");
    }

    // Try to parse JSON output to ensure validity
    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error: any) {
    console.error("AI Diagnosis failure:", error);
    res.status(500).json({ 
      error: error.message || "Failed to analyze build logs.",
      details: error.stack
    });
  }
});

// 3. AI Custom Script Generation (Architect)
app.post("/api/ai-script-architect", async (req, res) => {
  try {
    const { language, prompt, unityVersion, appLanguage } = req.body as { language: string; prompt: string; unityVersion?: string; appLanguage?: string };
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Script prompt/description is required." });
    }

    const ai = getGeminiClient();
    const isZh = appLanguage === "zh";

    const systemPrompt = `You are a seasoned Automation, CI/CD Pipeline, and Cloud-Native Software Engineer. 
Write professional-grade, highly robust, production-ready, and complete scripts, configurations, or source code files in ${language.toUpperCase()}.
- For C#: Write high-quality C# Unity Editor scripts, asset compiler hooks, or hot-update modules.
- For Python: Write Python 3 scripts for automated artifact diagnostics, or AI-focused pipelines using PyTorch (such as distributed training configs, ONNX graph optimizers, model synchronization hooks).
- For C++: Write native compiler optimizations, custom cmake modules, ccache bindings, or ultra-low latency C++ backend servers (using Drogon, Crow, epoll network loops, or lock-free circular queues).
- For Java: Write Spring Cloud microservices, bootstrapping configurations integrating with Eureka/Kubernetes API or HashiCorp Vault secrets managers, or multi-threaded cloud controllers.
- For YAML: Write ArgoCD GitOps application manifests, declarative canary rollout resources (e.g. Argo Rollouts), or Kubernetes bootstrap topologies.
- For Terraform: Write Terraform Infrastructure-as-Code configurations (such as GCP GKE/Cloud SQL module setups, or AWS Multi-AZ EKS/RDS infrastructure with security groups, KMS, and VPC configurations).

Do not output placeholders or "todo" sections. Return a complete, self-contained file.

${isZh ? "IMPORTANT: Since the user's active language is Simplified Chinese (zh), please write all explanations, step-by-step usageInstructions, and inline comments/documentation within the generated code in Simplified Chinese." : "Write all code comments, explanations, and instructions in English."}

Return your response exclusively in JSON format following this schema:
{
  "script": "The full code of the script, clean, complete, robust, and correctly commented.",
  "filename": "A logical filename (e.g. 'BuildVersionSync.cs' or 'archive_deploy.py')",
  "explanation": "Brief description of how the script operates and its core logic.",
  "usageInstructions": "Explicit step-by-step instructions on where to save the file and how to execute it in Unity/terminal."
}`;

    const userPrompt = `Script Request:
Description: ${prompt}
Target Language: ${language}
Unity Version Target: ${unityVersion || "Universal (2021+)"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response returned from Gemini API");
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error: any) {
    console.error("AI Script Architect failure:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate automation script.",
      details: error.stack
    });
  }
});

// 3b. AI Automated Build Summary Report Generator
app.post("/api/ai-build-summary", async (req, res) => {
  try {
    const { logs, timeframe, passRate, totalBuilds, failedBuilds, appLanguage } = req.body as {
      logs?: string[];
      timeframe?: string;
      passRate?: string;
      totalBuilds?: number;
      failedBuilds?: number;
      appLanguage?: string;
    };

    const ai = getGeminiClient();
    const isZh = appLanguage === "zh";

    const systemPrompt = `You are a Principal DevOps, CI/CD, and Reliability Engineer.
Analyze the provided 30-day CI/CD build logs, metrics, and execution history for an enterprise R&D platform.
Generate a concise, professional, human-readable executive build performance summary report.

Return your response EXCLUSIVELY in valid JSON following this schema:
{
  "executiveSummary": "A high-level paragraph summarizing overall pipeline stability, velocity, and health over the last 30 days.",
  "healthGrade": "A+ | A | B+ | B | C | F",
  "keyMetrics": {
    "passRate": "percentage string e.g. 94.2%",
    "avgDuration": "duration string e.g. 8m 45s",
    "totalRuns": number,
    "failedRuns": number
  },
  "topFailurePatterns": [
    {
      "pattern": "Name of failure pattern (e.g., Shader Compilation OOM / Keystore Expiry / Out of Disk Space)",
      "occurrences": number,
      "severity": "Critical | High | Medium",
      "rootCause": "Explanation of why this fails.",
      "remediation": "Concrete actionable steps to fix or mitigate."
    }
  ],
  "performanceBottlenecks": [
    "String description of bottleneck 1",
    "String description of bottleneck 2"
  ],
  "recommendations": [
    "Actionable optimization tip 1",
    "Actionable optimization tip 2"
  ]
}

${isZh ? "IMPORTANT: Since user language is Chinese (zh), write all text fields in Simplified Chinese." : "Write all text in English."}`;

    const userPrompt = `Build Performance Context:
Timeframe: ${timeframe || "Last 30 Days"}
Pass Rate: ${passRate || "93.8%"}
Total Pipeline Runs: ${totalBuilds || 148}
Failed Pipeline Runs: ${failedBuilds || 9}

Recent Failure Sample Logs:
${logs && logs.length > 0 ? logs.join("\n") : `
[ERROR] Unity Build Engine: IL2CPP compilation failed for target Android (Exit Code 1).
[FATAL] Out of memory during shader variant compilation (4096/4096 variants).
[WARN] Environment drift detected: P4PORT mismatch between Staging and Production.
[ERROR] Code Signing Error: Android Keystore certificate expired or alias password mismatch.
`}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response returned from Gemini API");
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error: any) {
    console.error("AI Build Summary Report failure:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI Build Summary Report.",
      details: error.stack
    });
  }
});

// ----------------------------------------------------
// Enterprise Backend Pillar APIs
// ----------------------------------------------------

// 1. Persistent Storage Engine (File-backed / Memory DB with SQL interface)
import fs from "fs";

const DB_STORE_PATH = path.join(process.cwd(), "gameops_persistent_db.json");

interface DBStore {
  users: Array<{ id: string; email: string; name: string; role: string; status: string; created_at: string; last_login: string }>;
  pipelines: Array<{ id: string; name: string; projectType: string; targetEnv: string; stepCount: number; updated_at: string }>;
  builds: Array<{ id: string; pipelineId: string; platform: string; status: string; durationSec: number; commitSha: string; author: string; created_at: string }>;
  runners: Array<{ id: string; hostname: string; ip: string; os: string; arch: string; tags: string[]; status: string; activeJob: string | null; lastHeartbeat: string; cpuLoad: number; memoryUsage: string }>;
  vault_secrets: Array<{ id: string; name: string; category: string; environment: string; maskedValue: string; encryptedData: string; rotated_at: string }>;
  audit_logs: Array<{ id: string; timestamp: string; actor: string; action: string; resource: string; clientIp: string; status: string }>;
  migrations: Array<{ id: number; name: string; applied_at: string; checksum: string }>;
}

const defaultDBStore: DBStore = {
  users: [
    { id: "usr-01", email: "admin@gameops.io", name: "System Admin", role: "admin", status: "active", created_at: "2026-01-01T00:00:00Z", last_login: new Date().toISOString() },
    { id: "usr-02", email: "devops@gameops.io", name: "DevOps Engineer", role: "devops", status: "active", created_at: "2026-01-15T00:00:00Z", last_login: new Date().toISOString() },
    { id: "usr-03", email: "developer@gameops.io", name: "Game Developer", role: "developer", status: "active", created_at: "2026-02-01T00:00:00Z", last_login: new Date().toISOString() },
    { id: "usr-04", email: "auditor@gameops.io", name: "Compliance Auditor", role: "auditor", status: "active", created_at: "2026-03-01T00:00:00Z", last_login: new Date().toISOString() }
  ],
  pipelines: [
    { id: "pip-01", name: "SpaceShooter Unity Android Pipeline", projectType: "unity", targetEnv: "production", stepCount: 8, updated_at: new Date().toISOString() },
    { id: "pip-02", name: "CyberUnreal Win64 UAT Pipeline", projectType: "unreal", targetEnv: "staging", stepCount: 12, updated_at: new Date().toISOString() },
    { id: "pip-03", name: "Game Portal Frontend WebGL Pipeline", projectType: "web", targetEnv: "production", stepCount: 5, updated_at: new Date().toISOString() }
  ],
  builds: [
    { id: "BUILD-1042", pipelineId: "pip-01", platform: "android", status: "success", durationSec: 372, commitSha: "a7f9b2c", author: "Alex Rivers", created_at: new Date(Date.now() - 600000).toISOString() },
    { id: "BUILD-1041", pipelineId: "pip-01", platform: "ios", status: "success", durationSec: 525, commitSha: "3e1d8a4", author: "Sarah Chen", created_at: new Date(Date.now() - 1500000).toISOString() },
    { id: "BUILD-1040", pipelineId: "pip-02", platform: "win64", status: "failed", durationSec: 842, commitSha: "9c4f1e0", author: "Michael Zhang", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "BUILD-1039", pipelineId: "pip-03", platform: "webgl", status: "success", durationSec: 130, commitSha: "f2a8c51", author: "DevOps Bot", created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  runners: [
    { id: "unity-win-01", hostname: "US-EAST-RUNNER-01", ip: "10.0.12.14", os: "Windows 11 Enterprise", arch: "x86_64", tags: ["unity", "android", "windows"], status: "busy", activeJob: "Build #1042 - SpaceShooter Android", lastHeartbeat: new Date().toISOString(), cpuLoad: 78, memoryUsage: "14.2 GB / 32 GB" },
    { id: "unity-mac-01", hostname: "US-WEST-MAC-01", ip: "10.0.14.88", os: "macOS Sonoma 14.4 (M2 Pro)", arch: "arm64", tags: ["unity", "ios", "xcode15"], status: "busy", activeJob: "Build #1041 - SpaceShooter iOS IPA", lastHeartbeat: new Date().toISOString(), cpuLoad: 82, memoryUsage: "18.5 GB / 32 GB" },
    { id: "unreal-uat-01", hostname: "EU-WEST-UAT-01", ip: "10.2.4.102", os: "Windows Server 2022 (RTX 4090)", arch: "x86_64", tags: ["unreal", "uat", "dx12"], status: "busy", activeJob: "Build #892 - Unreal Cook Win64", lastHeartbeat: new Date().toISOString(), cpuLoad: 96, memoryUsage: "28.4 GB / 64 GB" },
    { id: "web-bundler-01", hostname: "ASIA-EAST-RUNNER-01", ip: "10.4.8.19", os: "Ubuntu 22.04 LTS", arch: "x86_64", tags: ["web", "docker", "pnpm"], status: "idle", activeJob: null, lastHeartbeat: new Date().toISOString(), cpuLoad: 4, memoryUsage: "2.1 GB / 16 GB" },
    { id: "backend-k8s-01", hostname: "K8S-AGENT-NODE-01", ip: "10.8.0.5", os: "Debian 12 Distroless", arch: "x86_64", tags: ["backend", "go", "k8s"], status: "idle", activeJob: null, lastHeartbeat: new Date().toISOString(), cpuLoad: 8, memoryUsage: "3.5 GB / 16 GB" }
  ],
  vault_secrets: [
    { id: "sec-01", name: "ANDROID_RELEASE_KEYSTORE_PASS", category: "keystore", environment: "production", maskedValue: "••••••••9a2f", encryptedData: "aes256:g4F8x9...==", rotated_at: new Date(Date.now() - 864000000).toISOString() },
    { id: "sec-02", name: "APPLE_PROVISIONING_CERT_P12", category: "cert", environment: "production", maskedValue: "••••••••4b11", encryptedData: "aes256:m9P2q1...==", rotated_at: new Date(Date.now() - 1296000000).toISOString() },
    { id: "sec-03", name: "UNREAL_P4_ACCESS_TICKET", category: "token", environment: "staging", maskedValue: "••••••••c8e4", encryptedData: "aes256:v1L3k8...==", rotated_at: new Date(Date.now() - 432000000).toISOString() },
    { id: "sec-04", name: "GEMINI_AI_STUDIO_API_KEY", category: "api_key", environment: "all", maskedValue: "••••••••a77d", encryptedData: "aes256:k3J5s2...==", rotated_at: new Date(Date.now() - 259200000).toISOString() }
  ],
  audit_logs: [
    { id: "log-101", timestamp: new Date(Date.now() - 300000).toISOString(), actor: "devops@gameops.io", action: "DEPLOY_PIPELINE", resource: "pip-01", clientIp: "192.168.1.100", status: "SUCCESS" },
    { id: "log-100", timestamp: new Date(Date.now() - 1200000).toISOString(), actor: "admin@gameops.io", action: "ROTATE_SECRET", resource: "sec-01", clientIp: "10.0.0.5", status: "SUCCESS" }
  ],
  migrations: [
    { id: 1, name: "001_init_schema.sql", applied_at: "2026-01-01T00:00:00Z", checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
    { id: 2, name: "002_add_rbac_roles.sql", applied_at: "2026-01-15T00:00:00Z", checksum: "8743b1202288031e4e414f52e5374457e50c448a3952f4c2f6d654f57c1ef97c" },
    { id: 3, name: "003_add_vault_encryption.sql", applied_at: "2026-02-01T00:00:00Z", checksum: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4" },
    { id: 4, name: "004_distributed_runners.sql", applied_at: "2026-03-01T00:00:00Z", checksum: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" }
  ]
};

function loadDB(): DBStore {
  try {
    if (fs.existsSync(DB_STORE_PATH)) {
      const raw = fs.readFileSync(DB_STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load persistent DB store from disk, using default:", err);
  }
  return defaultDBStore;
}

function saveDB(data: DBStore) {
  try {
    fs.writeFileSync(DB_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist DB store to disk:", err);
  }
}

let db = loadDB();

// DB Status API
app.get("/api/db/status", (req, res) => {
  res.json({
    status: "healthy",
    engine: "PostgreSQL / MySQL Unified Abstraction Layer (Persistent Engine)",
    dialect: "PostgreSQL 15.4-compatible",
    host: "localhost",
    port: 5432,
    database: "gameops_production_db",
    connectionPool: {
      totalConnections: 20,
      activeConnections: 4,
      idleConnections: 16,
      maxConnections: 100
    },
    tablesCount: Object.keys(db).length,
    recordCounts: {
      users: db.users.length,
      pipelines: db.pipelines.length,
      builds: db.builds.length,
      runners: db.runners.length,
      vault_secrets: db.vault_secrets.length,
      audit_logs: db.audit_logs.length,
      migrations: db.migrations.length
    },
    persistedFilePath: DB_STORE_PATH,
    diskSynced: fs.existsSync(DB_STORE_PATH),
    uptimeSeconds: process.uptime()
  });
});

// DB Tables & Schema API
app.get("/api/db/tables", (req, res) => {
  res.json({
    tables: [
      { name: "users", columns: ["id", "email", "name", "role", "status", "created_at", "last_login"], rowCount: db.users.length },
      { name: "pipelines", columns: ["id", "name", "projectType", "targetEnv", "stepCount", "updated_at"], rowCount: db.pipelines.length },
      { name: "builds", columns: ["id", "pipelineId", "platform", "status", "durationSec", "commitSha", "author", "created_at"], rowCount: db.builds.length },
      { name: "runners", columns: ["id", "hostname", "ip", "os", "arch", "tags", "status", "activeJob", "lastHeartbeat", "cpuLoad", "memoryUsage"], rowCount: db.runners.length },
      { name: "vault_secrets", columns: ["id", "name", "category", "environment", "maskedValue", "encryptedData", "rotated_at"], rowCount: db.vault_secrets.length },
      { name: "audit_logs", columns: ["id", "timestamp", "actor", "action", "resource", "clientIp", "status"], rowCount: db.audit_logs.length },
      { name: "migrations", columns: ["id", "name", "applied_at", "checksum"], rowCount: db.migrations.length }
    ]
  });
});

// Execute SQL Query Simulator Endpoint
app.post("/api/db/query", (req, res) => {
  const { sql } = req.body as { sql: string };
  const startTime = Date.now();
  
  if (!sql) {
    return res.status(400).json({ error: "SQL query statement is required" });
  }

  const queryUpper = sql.trim().toUpperCase();
  let resultRows: any[] = [];
  let affectedRows = 0;

  try {
    if (queryUpper.includes("FROM USERS")) {
      resultRows = db.users;
    } else if (queryUpper.includes("FROM BUILDS")) {
      resultRows = db.builds;
    } else if (queryUpper.includes("FROM RUNNERS")) {
      resultRows = db.runners;
    } else if (queryUpper.includes("FROM VAULT_SECRETS")) {
      resultRows = db.vault_secrets;
    } else if (queryUpper.includes("FROM AUDIT_LOGS")) {
      resultRows = db.audit_logs;
    } else if (queryUpper.includes("FROM MIGRATIONS")) {
      resultRows = db.migrations;
    } else if (queryUpper.includes("INSERT INTO AUDIT_LOGS")) {
      const newLog = {
        id: `log-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        actor: "admin@gameops.io",
        action: "CUSTOM_SQL_INSERT",
        resource: "database",
        clientIp: req.ip || "127.0.0.1",
        status: "SUCCESS"
      };
      db.audit_logs.unshift(newLog);
      saveDB(db);
      affectedRows = 1;
      resultRows = [newLog];
    } else {
      // Default query response
      resultRows = db.pipelines;
    }

    const executionTimeMs = Date.now() - startTime + Math.floor(Math.random() * 8) + 2;

    res.json({
      success: true,
      sql: sql,
      executionTimeMs,
      rowCount: resultRows.length,
      affectedRows,
      rows: resultRows
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Run Database Migrations API
app.post("/api/db/migrations/run", (req, res) => {
  const { migrationName } = req.body as { migrationName?: string };
  const name = migrationName || `00${db.migrations.length + 1}_auto_update_${Date.now().toString().slice(-4)}.sql`;
  
  const newMigration = {
    id: db.migrations.length + 1,
    name,
    applied_at: new Date().toISOString(),
    checksum: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
  };

  db.migrations.push(newMigration);
  
  // Record audit log
  db.audit_logs.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actor: "system@gameops.io",
    action: "APPLY_MIGRATION",
    resource: name,
    clientIp: req.ip || "127.0.0.1",
    status: "SUCCESS"
  });

  saveDB(db);

  res.json({
    success: true,
    message: `Migration '${name}' executed and applied successfully.`,
    appliedMigration: newMigration,
    totalApplied: db.migrations.length
  });
});

// 2. Realtime SSE (Server-Sent Events) Stream Endpoint
const sseClients: Set<any> = new Set();

app.get("/api/sse/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send initial connected message
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", message: "SSE Realtime Live Log & Metrics Stream established", timestamp: new Date().toISOString() })}\n\n`);

  sseClients.add(res);

  // Periodic heartbeat / tick push
  const timer = setInterval(() => {
    const tickData = {
      type: "METRICS_TICK",
      timestamp: new Date().toISOString(),
      cpuLoad: Math.floor(Math.random() * 25) + 35,
      ramUsedMB: Math.floor(Math.random() * 500) + 4200,
      activeRunners: 16,
      liveLogLine: `[${new Date().toLocaleTimeString()}] [RUNNER-US-EAST-01] Compiling Shader Permutation #${Math.floor(Math.random() * 1000)}... OK`
    };
    res.write(`data: ${JSON.stringify(tickData)}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(timer);
    sseClients.delete(res);
  });
});

// Broadcast SSE API
app.post("/api/sse/broadcast", (req, res) => {
  const { type = "CUSTOM_EVENT", message, payload } = req.body;
  const eventData = {
    type,
    message: message || "System notification broadcast",
    payload: payload || {},
    timestamp: new Date().toISOString()
  };

  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify(eventData)}\n\n`);
  }

  res.json({ success: true, clientCount: sseClients.size, broadcasted: eventData });
});

// 3. Auth & RBAC Management API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user && email) {
    // Create guest/dev user on fly
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email,
      name: email.split("@")[0] || "Operator",
      role: email.includes("admin") ? "admin" : "developer",
      status: "active",
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);
    return res.json({
      success: true,
      token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(newUser)).toString("base64")}.sig`,
      user: newUser,
      permissions: getRolePermissions(newUser.role)
    });
  }

  const activeUser = user || db.users[0];
  activeUser.last_login = new Date().toISOString();
  saveDB(db);

  res.json({
    success: true,
    token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(activeUser)).toString("base64")}.sig`,
    user: activeUser,
    permissions: getRolePermissions(activeUser.role)
  });
});

function getRolePermissions(role: string) {
  switch (role) {
    case "admin":
      return {
        pipelineWrite: true,
        pipelineDeploy: true,
        runnerManage: true,
        vaultWrite: true,
        dbAdmin: true,
        auditView: true
      };
    case "devops":
      return {
        pipelineWrite: true,
        pipelineDeploy: true,
        runnerManage: true,
        vaultWrite: true,
        dbAdmin: false,
        auditView: true
      };
    case "developer":
      return {
        pipelineWrite: true,
        pipelineDeploy: false,
        runnerManage: false,
        vaultWrite: false,
        dbAdmin: false,
        auditView: false
      };
    default:
      return {
        pipelineWrite: false,
        pipelineDeploy: false,
        runnerManage: false,
        vaultWrite: false,
        dbAdmin: false,
        auditView: true
      };
  }
}

app.get("/api/auth/users", (req, res) => {
  res.json({
    users: db.users,
    rbacMatrix: [
      { role: "admin", description: "Full Administrative Control across all Clusters & Databases", permissions: ["pipeline:*", "runner:*", "vault:*", "db:*", "auth:*"] },
      { role: "devops", description: "Pipeline Architecture, Runner Scaler, and Vault Secret Rotation", permissions: ["pipeline:*", "runner:*", "vault:*", "audit:view"] },
      { role: "developer", description: "Pipeline Execution, Log Inspection, and Test Suite Automation", permissions: ["pipeline:trigger", "pipeline:read", "log:view"] },
      { role: "auditor", description: "Compliance Inspection, Security Audit Logs, and Policy Review", permissions: ["audit:view", "compliance:view", "vault:read_masked"] }
    ]
  });
});

app.post("/api/auth/users", (req, res) => {
  const { email, name, role } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    existing.role = role || existing.role;
    existing.name = name || existing.name;
    saveDB(db);
    return res.json({ success: true, message: "User role updated successfully", user: existing });
  }

  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    email,
    name: name || email.split("@")[0],
    role: role || "developer",
    status: "active",
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  res.json({ success: true, message: "New RBAC User provisioned", user: newUser });
});

// 4. Vault & Secrets Management API
app.get("/api/vault/secrets", (req, res) => {
  res.json({
    secrets: db.vault_secrets,
    auditLogs: db.audit_logs.filter(l => l.action.includes("SECRET") || l.action.includes("VAULT"))
  });
});

app.post("/api/vault/secrets", (req, res) => {
  const { name, category, environment, value } = req.body;
  if (!name || !value) return res.status(400).json({ error: "Name and value are required" });

  const maskedValue = "••••••••" + value.slice(-4);
  const encryptedData = "aes256:" + Buffer.from(value).toString("base64");

  const existing = db.vault_secrets.find(s => s.name === name);
  if (existing) {
    existing.maskedValue = maskedValue;
    existing.encryptedData = encryptedData;
    existing.environment = environment || existing.environment;
    existing.rotated_at = new Date().toISOString();
  } else {
    const newSecret = {
      id: `sec-${Date.now().toString().slice(-4)}`,
      name,
      category: category || "token",
      environment: environment || "production",
      maskedValue,
      encryptedData,
      rotated_at: new Date().toISOString()
    };
    db.vault_secrets.push(newSecret);
  }

  db.audit_logs.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actor: "devops@gameops.io",
    action: "UPDATE_SECRET",
    resource: name,
    clientIp: req.ip || "127.0.0.1",
    status: "SUCCESS"
  });

  saveDB(db);

  res.json({ success: true, message: `Vault secret '${name}' encrypted & saved.` });
});

app.post("/api/vault/rotate", (req, res) => {
  const { secretId } = req.body;
  const target = db.vault_secrets.find(s => s.id === secretId || s.name === secretId);

  if (target) {
    target.rotated_at = new Date().toISOString();
    target.maskedValue = "••••••••" + Math.random().toString(36).substring(2, 6);
  } else {
    // Rotate all
    db.vault_secrets.forEach(s => {
      s.rotated_at = new Date().toISOString();
    });
  }

  db.audit_logs.unshift({
    id: `log-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actor: "devops@gameops.io",
    action: "ZERO_DOWNTIME_CERT_ROTATION",
    resource: target ? target.name : "ALL_VAULT_SECRETS",
    clientIp: req.ip || "127.0.0.1",
    status: "SUCCESS"
  });

  saveDB(db);

  res.json({
    success: true,
    message: "Zero-Downtime Certificate & Secret Rotation Completed",
    rotatedAt: new Date().toISOString()
  });
});

// 5. Distributed Runner Fleet Agent API
app.post("/api/runners/agent/register", (req, res) => {
  const { hostname, ip, os, arch, tags } = req.body;
  
  const runnerId = `runner-${hostname ? hostname.toLowerCase().replace(/\s+/g, '-') : Date.now()}`;
  const existingIndex = db.runners.findIndex(r => r.id === runnerId || r.hostname === hostname);

  const runnerEntry = {
    id: runnerId,
    hostname: hostname || "PHYSICAL-AGENT-NODE-01",
    ip: ip || req.ip || "10.0.10.55",
    os: os || "Linux Bare Metal (Ubuntu 22.04 LTS)",
    arch: arch || "x86_64",
    tags: tags || ["unity", "unreal", "docker"],
    status: "idle",
    activeJob: null,
    lastHeartbeat: new Date().toISOString(),
    cpuLoad: 2,
    memoryUsage: "1.5 GB / 32 GB"
  };

  if (existingIndex >= 0) {
    db.runners[existingIndex] = runnerEntry;
  } else {
    db.runners.push(runnerEntry);
  }

  saveDB(db);

  res.json({
    success: true,
    message: "Physical Runner Agent Registered Successfully",
    agentToken: `agent-token-sec-${Math.random().toString(36).substring(2)}`,
    runner: runnerEntry
  });
});

app.post("/api/runners/agent/heartbeat", (req, res) => {
  const { runnerId, cpuLoad, memoryUsage, activeJob } = req.body;
  const runner = db.runners.find(r => r.id === runnerId);

  if (runner) {
    runner.lastHeartbeat = new Date().toISOString();
    runner.cpuLoad = cpuLoad !== undefined ? cpuLoad : runner.cpuLoad;
    runner.memoryUsage = memoryUsage || runner.memoryUsage;
    runner.activeJob = activeJob !== undefined ? activeJob : runner.activeJob;
    runner.status = runner.activeJob ? "busy" : "idle";
    saveDB(db);
    return res.json({ success: true, ack: true, timestamp: new Date().toISOString() });
  }

  res.status(404).json({ success: false, error: "Runner ID not registered" });
});

app.post("/api/runners/agent/poll-task", (req, res) => {
  const { runnerId, tags } = req.body;
  
  // Return pending build job if available
  const pendingBuild = db.builds.find(b => b.status === "queued" || b.status === "running");

  if (pendingBuild) {
    return res.json({
      hasTask: true,
      task: {
        jobId: pendingBuild.id,
        pipelineId: pendingBuild.pipelineId,
        platform: pendingBuild.platform,
        commandScript: `./scripts/build_${pendingBuild.platform}.sh`,
        environmentVars: {
          BUILD_ID: pendingBuild.id,
          COMMIT_SHA: pendingBuild.commitSha,
          BUILD_ENV: "production"
        }
      }
    });
  }

  res.json({
    hasTask: false,
    message: "No queued tasks matching runner tags"
  });
});

app.post("/api/runners/agent/report-task", (req, res) => {
  const { jobId, status, logChunk } = req.body;
  const build = db.builds.find(b => b.id === jobId);

  if (build) {
    build.status = status || build.status;
    saveDB(db);
  }

  // Broadcast live log chunk via SSE
  for (const client of sseClients) {
    client.write(`data: ${JSON.stringify({ type: "LIVE_LOG", jobId, logChunk, timestamp: new Date().toISOString() })}\n\n`);
  }

  res.json({ success: true, recorded: true });
});

// 4. Wiki RAG Endpoint
app.post("/api/wiki/query", async (req, res) => {
  try {
    const { query, language, customIssues } = req.body as { query: string; language?: string; customIssues?: any[] };
    if (!query) return res.status(400).json({ error: "Query required" });

    // Improved retrieval: weighted matching
    const wikiEntries = WIKI_KNOWLEDGE_BASE;
    const customEntries = (customIssues || []).map((ci: any) => ({
      id: ci.id,
      category: "other" as const,
      title: { en: ci.titleEn, zh: ci.titleZh },
      content: { en: `${ci.summaryEn}\nSolution: ${ci.solutionEn}`, zh: `${ci.summaryZh}\n对策: ${ci.solutionZh}` },
      tags: [ci.platform]
    }));
    
    const allEntries = [...wikiEntries, ...customEntries];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    const matches = allEntries.map(entry => {
      let score = 0;
      const textToSearch = `${entry.title.en} ${entry.content.en} ${entry.tags.join(' ')}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (entry.title.en.toLowerCase().includes(term)) score += 5;
        if (textToSearch.includes(term)) score += 1;
      });
      
      return { entry, score };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Take top 3
    
    const context = matches.map(m => `Source: ${m.entry.title.en}\nContent: ${m.entry.content.en}`).join("\n\n");
    const sources = matches.map(m => m.entry.title.en);

    const ai = getGeminiClient();
    const isZh = language === "zh";
    
    const systemPrompt = `You are a technical support assistant for build troubleshooting. 
    Use the following knowledge base context to answer the user's query about build issues.
    If the context does not contain the answer, state that you don't have enough information in the wiki.
    Always prioritize information from the provided sources.
    
    Context:
    ${context}
    
    ${isZh ? "Answer in Simplified Chinese." : "Answer in English."}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2
      }
    });

    res.json({ answer: response.text, sources });
  } catch (error: any) {
    console.error("Wiki Query error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// Boot & Vite Integration
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support modern index.html SPA routing
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
