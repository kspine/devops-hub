import React, { useState } from "react";
import { 
  Sparkles, 
  Zap, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  TrendingDown, 
  RefreshCw, 
  Play, 
  FileText,
  Layers,
  ChevronRight,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "./ToastContext";

export interface UnityTweak {
  id: string;
  category: "cache" | "il2cpp" | "addressables" | "compilation" | "texture";
  titleEn: string;
  titleZh: string;
  impactEn: string;
  impactZh: string;
  estimatedTimeSaved: string;
  applied: boolean;
  codeSnippet: string;
  configType: "csharp" | "yaml" | "cmd";
  explanationEn: string;
  explanationZh: string;
}

const SAMPLE_BUILD_LOGS = [
  `[Unity Build] 19:04:12 - Starting StandaloneWindows64 Build...`,
  `[Unity Build] 19:04:18 - Compiling Scripts (Assembly-CSharp.dll)...`,
  `[WARN] No .asmdef files detected in Assets/Scripts/. Recompiling entire codebase on single thread. (Time: 42s)`,
  `[Unity Build] 19:05:00 - Building Addressables Content...`,
  `[WARN] Addressables catalog hash cache miss! Re-building 4,096 Asset Bundles from scratch. (Time: 3m 15s)`,
  `[Unity Build] 19:08:15 - Executing IL2CPP C++ Compilation...`,
  `[WARN] IL2CPP running with default single-thread job queue (--jobs=1). CPU cores underutilized (8% load). (Time: 5m 20s)`,
  `[Unity Build] 19:13:35 - Compiling Shader Variants (4,096/4,096)...`,
  `[WARN] Shader Cache miss in Library/ShaderCache. Local cache size limit (10GB) reached. Evicting old variants. (Time: 2m 10s)`,
  `[Unity Build] 19:15:45 - Compiling ASTC Textures...`,
  `[WARN] High-quality ASTC compression enabled in CI batchmode. Consider fast-compress flag for staging builds. (Time: 1m 50s)`,
  `[Unity Build] 19:17:35 - Build Complete! Total Time: 13m 23s`
];

export default function BuildOptimizationAdvisor() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const { addToast } = useToast();
  const isZh = language === "zh";

  const [rawLogs, setRawLogs] = useState<string>(SAMPLE_BUILD_LOGS.join("\n"));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [tweaks, setTweaks] = useState<UnityTweak[]>([
    {
      id: "tweak-cache-size",
      category: "cache",
      titleEn: "Expand Unity Library & DDC Cache Quota to 100GB",
      titleZh: "将 Unity Library 与 DDC 缓存上限调至 100GB",
      impactEn: "Eliminates shader & asset bundle cache eviction during parallel CI jobs.",
      impactZh: "避免多分支并行 CI 构建时 Shader 及资源包缓存被频繁覆盖清空。",
      estimatedTimeSaved: "3m 15s (-24%)",
      applied: false,
      configType: "csharp",
      explanationEn: "Default Unity local cache is capped at 10GB, causing eviction loops during large builds.",
      explanationZh: "默认 Unity 本地缓存限制为 10GB，多资源工程构建时会导致反复清理与重新烘焙。",
      codeSnippet: `using UnityEditor;

public class BuildCacheOptimizer {
    [InitializeOnLoadMethod]
    public static void ConfigureGlobalCaches() {
        // Set Shader & Asset Cache limit to 100GB
        EditorPrefs.SetInt("ShaderCacheMaxSize", 102400); 
        EditorPrefs.SetBool("CacheServerEnabled", true);
        EditorPrefs.SetString("CacheServerIPAddress", "10.0.4.50:8126");
        UnityEngine.Debug.Log("[CI Optimization] Set Unity Cache Server quota to 100GB");
    }
}`
    },
    {
      id: "tweak-il2cpp-jobs",
      category: "il2cpp",
      titleEn: "Enable IL2CPP Multi-Threaded C++ Compiler (--jobs=16)",
      titleZh: "开启 IL2CPP 多线程 C++ 替代编译器 (--jobs=16)",
      impactEn: "Parallelizes native code generation across available Runner CPU cores.",
      impactZh: "将 IL2CPP 原生 C++ 编译任务平摊至 CI Runner 所有 CPU 核心并行执行。",
      estimatedTimeSaved: "4m 10s (-31%)",
      applied: false,
      configType: "yaml",
      explanationEn: "IL2CPP defaults to low worker count unless explicitly overridden via build arguments.",
      explanationZh: "默认情况下 IL2CPP 线程数受限，通过参数显示指定 `--jobs=16` 可提升 3 倍编译速度。",
      codeSnippet: `# .github/workflows/unity-ci.yml
- name: Run Unity Build with Parallel IL2CPP
  run: |
    /opt/unity/Editor/Unity -batchmode -quit \\
      -projectPath . \\
      -buildTarget StandaloneWindows64 \\
      -customBuildTarget StandaloneWindows64 \\
      -executeMethod BuildScript.PerformBuild \\
      -option IL2CPP_EXTRA_ARGS="--jobs=16 --maximum-compilation-threads=16"`
    },
    {
      id: "tweak-addressables-incremental",
      category: "addressables",
      titleEn: "Enable Addressables Incremental Catalog Hashing",
      titleZh: "开启 Addressables 资源包增量 Hash 校验烘焙",
      impactEn: "Skips unmodified asset bundle re-compression on unchanged prefabs.",
      impactZh: "自动跳过未修改 Prefab 及纹理的重复压缩，仅对增量变更打包。",
      estimatedTimeSaved: "2m 45s (-20%)",
      applied: false,
      configType: "csharp",
      explanationEn: "Forces AddressableAssetSettings to reuse existing hashes rather than rebuilding all bundles.",
      explanationZh: "强制 Addressables 系统的 Content Update 机制复用旧 Hash，避免重复烘焙全部 Bundle。",
      codeSnippet: `using UnityEditor.AddressableAssets;
using UnityEditor.AddressableAssets.Settings;

public static void OptimizeAddressableSettings() {
    var settings = AddressableAssetSettingsDefaultObject.Settings;
    if (settings != null) {
        settings.ContiguousBundles = true;
        settings.NonRecursiveBuilding = true;
        settings.BuildAddressablesWithIncrementalHashing = true;
        EditorUtility.SetDirty(settings);
        UnityEngine.Debug.Log("[CI Optimization] Enabled Incremental Addressables Hash Engine");
    }
}`
    },
    {
      id: "tweak-asmdef-isolation",
      category: "compilation",
      titleEn: "Enforce Script Assembly Definitions (.asmdef) Partitioning",
      titleZh: "强制开启 Assembly Definition (.asmdef) 模块化隔绝",
      impactEn: "Reduces script re-compilation scope from 100% to only modified module.",
      impactZh: "将 C# 脚本重编译范围从全量工程精简至仅发生代码变更的子模块。",
      estimatedTimeSaved: "42s (-5%)",
      applied: false,
      configType: "csharp",
      explanationEn: "Prevents Unity from compiling all scripts into Assembly-CSharp.dll on every change.",
      explanationZh: "防止 Unity 将所有业务逻辑混杂于单一 Assembly-CSharp.dll 导致小改动引发大重编。",
      codeSnippet: `// Assets/Scripts/Core/CoreModule.asmdef
{
    "name": "GameCore.Module",
    "rootNamespace": "GameCore",
    "references": [],
    "includePlatforms": [],
    "excludePlatforms": [],
    "allowUnsafeCode": false,
    "overrideReferences": false,
    "precompiledReferences": [],
    "autoReferenced": true,
    "defineConstraints": [],
    "versionDefines": [],
    "noEngineReferences": false
}`
    },
    {
      id: "tweak-fast-astc",
      category: "texture",
      titleEn: "Use Fast ASTC/ETC2 Compression in Staging Batchmode",
      titleZh: "预发环境 Batchmode 开启 ASTC/ETC2 快速压缩标志",
      impactEn: "Accelerates Android/iOS texture processing during daily dev builds.",
      impactZh: "在大规模每日开发测试包制作中大幅缩短纹理 ASTC 压制耗时。",
      estimatedTimeSaved: "1m 30s (-11%)",
      applied: false,
      configType: "cmd",
      explanationEn: "Best Quality ASTC compression is unnecessary for non-release CI test artifacts.",
      explanationZh: "非最终 Release 上线包无需开启最高质量纹理插值，快速模式精度足以用于自动化回归测试。",
      codeSnippet: `Unity.exe -batchmode -quit -projectPath . \\
  -buildTarget Android \\
  -projectSettings FastTextureCompression \\
  -editorTests`
    }
  ]);

  // Handle Trigger Re-Analysis
  const handleAnalyzeLogs = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast(
        isZh ? "✨ 日志分析完成！自动识别到 5 项 Unity 构建加速优化点" : "✨ Log analysis complete! Identified 5 Unity build acceleration opportunities",
        "success"
      );
    }, 800);
  };

  // Toggle single tweak applied state
  const toggleTweak = (id: string) => {
    setTweaks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.applied;
          addToast(
            nextState
              ? (isZh ? `已应用优化建议: ${t.titleZh}` : `Applied tweak: ${t.titleEn}`)
              : (isZh ? `已撤销优化建议` : `Reverted tweak`),
            nextState ? "success" : "info"
          );
          return { ...t, applied: nextState };
        }
        return t;
      })
    );
  };

  // Apply All Tweaks
  const applyAllTweaks = () => {
    setTweaks((prev) => prev.map((t) => ({ ...t, applied: true })));
    addToast(
      isZh ? "🚀 已一键应用全部 5 项 Unity 构建设定优化！" : "🚀 Applied all 5 Unity build optimization tweaks!",
      "success"
    );
  };

  const copyCode = (tweak: UnityTweak) => {
    navigator.clipboard.writeText(tweak.codeSnippet);
    setCopiedId(tweak.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const appliedCount = tweaks.filter((t) => t.applied).length;

  return (
    <div className={`p-7 rounded-[3rem] border transition-all ${
      mode === "dark" ? "bg-[#08080c] border-white/10" : "bg-white border-gray-100 shadow-sm"
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-accent flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-black tracking-tight ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {isZh ? "Unity 构建性能优化顾问 (Build Optimization Advisor)" : "Unity Build Optimization Advisor"}
              </h3>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold">
                Gemini AI Engine
              </span>
            </div>
            <p className={`text-[11px] font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {isZh ? "分析打包日志并针对 Unity / C# / Addressables 提供一键性能调优与配置代码" : "Analyzes build logs & provides actionable Unity performance tweaks, cache tuning, & scripts"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={applyAllTweaks}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isZh ? "一键应用全部优化" : "Apply All Tweaks"}</span>
          </button>
        </div>
      </div>

      {/* Top Banner Overview */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 mb-6 ${
        mode === 'dark' 
          ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-gray-900 border-indigo-500/20' 
          : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-gray-50 border-indigo-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-lg">
            -60%
          </div>
          <div>
            <div className={`text-xs font-bold ${mode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              {isZh ? "可优化编译耗时潜能: ~12 分钟 ➔ ~4.5 分钟" : "Potential Build Speedup: ~12.5 mins ➔ ~4.5 mins"}
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
              {isZh ? `已应用 ${appliedCount} / ${tweaks.length} 项优化策略` : `Applied ${appliedCount} / ${tweaks.length} optimization tweaks`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`px-3 py-1.5 rounded-xl border text-center flex-1 md:flex-initial ${
            mode === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="text-[9px] font-mono text-gray-500">{isZh ? "分析类型" : "Target Engine"}</div>
            <div className="text-xs font-bold text-indigo-500">Unity 2022/6.0 + IL2CPP</div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-center flex-1 md:flex-initial ${
            mode === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="text-[9px] font-mono text-gray-500">{isZh ? "预计节省" : "Est. Savings"}</div>
            <div className="text-xs font-bold text-emerald-500">8m 22s / cycle</div>
          </div>
        </div>
      </div>

      {/* Raw Build Logs Analyzer Accordion / Box */}
      <div className="mb-6 space-y-2">
        <div className={`flex items-center justify-between text-xs font-bold ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            {isZh ? "Unity 构建日志样本与智能诊断" : "Unity Build Log Input & Analysis"}
          </span>
          <button
            onClick={handleAnalyzeLogs}
            disabled={isAnalyzing}
            className="text-[10px] font-mono text-indigo-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer font-bold"
          >
            <RefreshCw className={`w-3 h-3 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? (isZh ? "正在诊断..." : "Analyzing...") : (isZh ? "重新解析日志" : "Re-Analyze Logs")}</span>
          </button>
        </div>

        <div className="relative rounded-2xl bg-gray-950 border border-gray-800 p-3 font-mono text-[10px] text-gray-300 space-y-1 max-h-36 overflow-y-auto">
          {rawLogs.split("\n").map((line, idx) => (
            <div key={idx} className={line.includes("[WARN]") ? "text-amber-400 font-bold bg-amber-500/10 px-1 rounded" : "text-gray-400"}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Tweaks Cards */}
      <div className="space-y-4">
        <div className={`text-xs font-bold flex items-center justify-between ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
          <span>{isZh ? "推荐 Unity 专属优化建议列表" : "Recommended Unity-Specific Performance Tweaks"}</span>
          <span className="text-[10px] font-mono text-gray-500">
            {isZh ? "点击代码复制按钮或直接应用即可配置" : "Click code button or toggle switch to enable tweak"}
          </span>
        </div>

        <div className="space-y-3">
          {tweaks.map((tweak) => (
            <div
              key={tweak.id}
              className={`p-4 rounded-2xl border transition-all ${
                tweak.applied
                  ? mode === 'dark'
                    ? "bg-emerald-950/10 border-emerald-500/40 shadow-md shadow-emerald-500/5"
                    : "bg-emerald-50/80 border-emerald-300 shadow-sm"
                  : mode === 'dark'
                    ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTweak(tweak.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                      tweak.applied
                        ? "bg-emerald-500 text-white"
                        : mode === 'dark' ? "bg-gray-800 border border-gray-700 hover:border-indigo-500" : "bg-white border border-gray-300 hover:border-indigo-500"
                    }`}
                  >
                    {tweak.applied && <Check className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs font-bold ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {isZh ? tweak.titleZh : tweak.titleEn}
                      </h4>
                      <span className="px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-500 font-mono text-[9px] border border-indigo-500/20 font-bold">
                        {tweak.estimatedTimeSaved}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isZh ? tweak.impactZh : tweak.impactEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => copyCode(tweak)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors border ${
                      mode === 'dark'
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                        : "bg-white border-gray-200 hover:bg-gray-100 text-gray-700 shadow-sm"
                    }`}
                  >
                    {copiedId === tweak.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === tweak.id ? (isZh ? "已复制" : "Copied") : (isZh ? "复制代码" : "Copy Code")}</span>
                  </button>

                  <button
                    onClick={() => toggleTweak(tweak.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      tweak.applied
                        ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                    }`}
                  >
                    {tweak.applied ? (isZh ? "已应用" : "Applied") : (isZh ? "应用此建议" : "Enable Tweak")}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-[10px] text-indigo-300 overflow-x-auto relative group">
                <div className="absolute top-2 right-2 text-[8px] font-mono uppercase text-gray-400 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                  {tweak.configType}
                </div>
                <pre className="leading-relaxed">
                  <code>{tweak.codeSnippet}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
