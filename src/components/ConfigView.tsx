import * as React from "react";
import { Plus, Trash2, Sliders, Activity, Key, Check } from "lucide-react";

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
}

interface CacheSettings {
  enableDDC: boolean;
  enableUnityCache: boolean;
  precompileShaders: boolean;
  cleanWorkspaceMode: string;
}

interface PipelineHooks {
  preCompile: string;
  postCompile: string;
}

interface ResourceLimits {
  maxConcurrentRunners: number;
  maxRamAllocation: number;
  maxDiskQuota: number;
  artifactRetentionDays: number;
}

interface ConfigViewProps {
  isZh: boolean;
  envVars: EnvVar[];
  setEnvVars: React.Dispatch<React.SetStateAction<EnvVar[]>>;
  newEnvKey: string;
  setNewEnvKey: (val: string) => void;
  newEnvVal: string;
  setNewEnvVal: (val: string) => void;
  newEnvSecret: boolean;
  setNewEnvSecret: (val: boolean) => void;
  cacheSettings: CacheSettings;
  setCacheSettings: React.Dispatch<React.SetStateAction<CacheSettings>>;
  pipelineHooks: PipelineHooks;
  setPipelineHooks: React.Dispatch<React.SetStateAction<PipelineHooks>>;
  resourceLimits: ResourceLimits;
  setResourceLimits: React.Dispatch<React.SetStateAction<ResourceLimits>>;
  showToast: (msg: string) => void;
}

export default function ConfigView({
  isZh,
  envVars,
  setEnvVars,
  newEnvKey,
  setNewEnvKey,
  newEnvVal,
  setNewEnvVal,
  newEnvSecret,
  setNewEnvSecret,
  cacheSettings,
  setCacheSettings,
  pipelineHooks,
  setPipelineHooks,
  resourceLimits,
  setResourceLimits,
  showToast
}: ConfigViewProps) {
  const handleAddEnv = () => {
    if (!newEnvKey.trim()) return;
    setEnvVars(prev => [...prev, { key: newEnvKey.trim().toUpperCase(), value: newEnvVal || "N/A", isSecret: newEnvSecret }]);
    setNewEnvKey("");
    setNewEnvVal("");
    setNewEnvSecret(false);
    showToast(isZh ? "已成功添加新环境变量！" : "Successfully added environment variable!");
  };

  const handleRemoveEnv = (key: string) => {
    setEnvVars(prev => prev.filter(e => e.key !== key));
    showToast(isZh ? "已移除该环境变量。" : "Environment variable removed.");
  };

  const saveAllConfigs = () => {
    showToast(isZh ? "正在将全局打包参数同步至本地 CI/CD 配置库..." : "Syncing global build parameters to local storage database...");
    setTimeout(() => {
      showToast(isZh ? "全局配置同步成功！" : "Global configurations saved successfully!");
    }, 1000);
  };

  const resetToDefaults = () => {
    setEnvVars([
      { key: "UE_ROOT", value: "C:\\Program Files\\Epic Games\\UE_5.3", isSecret: false },
      { key: "UNITY_PATH", value: "/Applications/Unity/Hub/Editor/2022.3.15f1", isSecret: false },
      { key: "SIGNING_KEY_PASS", value: "••••••••••••••••", isSecret: true },
      { key: "STEAM_SDK_VER", value: "1.57", isSecret: false }
    ]);
    setCacheSettings({
      enableDDC: true,
      enableUnityCache: true,
      precompileShaders: true,
      cleanWorkspaceMode: "increment"
    });
    setPipelineHooks({
      preCompile: "echo \"Syncing static resources & localized text...\"\nnode scripts/sync_resources.js",
      postCompile: "echo \"Deploying compressed archives to storage server...\"\npython scripts/upload_artifacts.py"
    });
    setResourceLimits({
      maxConcurrentRunners: 4,
      maxRamAllocation: 16,
      maxDiskQuota: 100,
      artifactRetentionDays: 14
    });
    showToast(isZh ? "已重置所有高级参数为系统出厂配置。" : "Reset all parameters to factory defaults.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-mono">
                  {isZh ? "编译环境变量与机密密钥" : "Environment Variables & Secrets"}
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
                {envVars.length} Variables
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-gray-900/40 p-3 rounded-xl border border-gray-850">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  placeholder="KEY (e.g., ACCESS_TOKEN)"
                  className="w-full px-2.5 py-1.5 bg-gray-950/50 border border-gray-800 rounded-lg text-xs font-mono text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newEnvVal}
                  onChange={(e) => setNewEnvVal(e.target.value)}
                  placeholder="Value (e.g., token-123x)"
                  className="w-full px-2.5 py-1.5 bg-gray-950/50 border border-gray-800 rounded-lg text-xs font-mono text-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-center gap-1">
                <input
                  type="checkbox"
                  id="is-secret-env"
                  checked={newEnvSecret}
                  onChange={(e) => setNewEnvSecret(e.target.checked)}
                  className="h-3 w-3 accent-indigo-600 rounded border-gray-800"
                />
                <label htmlFor="is-secret-env" className="text-[10px] text-gray-400 select-none cursor-pointer">
                  {isZh ? "敏感密钥" : "Secret"}
                </label>
              </div>
              <div className="sm:col-span-1">
                <button
                  onClick={handleAddEnv}
                  className="w-full h-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer p-1.5"
                  title="Add Environment Variable"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
              {envVars.map((env) => (
                <div key={env.key} className="flex items-center justify-between p-2.5 bg-gray-900 border border-gray-850 rounded-xl text-xs font-mono hover:border-gray-800 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <span className="font-bold text-indigo-400">{env.key}</span>
                    <span className="text-gray-650">=</span>
                    <span className="text-gray-400 truncate max-w-[200px]" title={env.value}>
                      {env.isSecret ? "••••••••••••••••" : env.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {env.isSecret && (
                      <span className="text-[9px] bg-rose-950/80 text-rose-400 border border-rose-900/35 px-1.5 py-0.2 rounded">
                        {isZh ? "机密" : "Secret"}
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveEnv(env.key)}
                      className="p-1 hover:bg-gray-950/30 hover:text-red-400 text-gray-500 rounded transition-colors cursor-pointer"
                      title="Delete key"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-mono">
                {isZh ? "构建缓存与预编译优化" : "Build Cache & Compilation Settings"}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-900/40 border border-gray-850 rounded-xl hover:border-gray-800 transition-all">
                <div>
                  <h4 className="font-bold text-gray-200">
                    {isZh ? "启用 Unreal DDC 统一缓存" : "Unreal Derived Data Cache (DDC)"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {isZh ? "激活共享资源缓存器，大幅减少着色器与材质资源重复烹饪时间" : "Enable shared content cache to speed up Cook times"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cacheSettings.enableDDC}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, enableDDC: e.target.checked })}
                  className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-900/40 border border-gray-850 rounded-xl hover:border-gray-800 transition-all">
                <div>
                  <h4 className="font-bold text-gray-200">
                    {isZh ? "启用 Unity Asset Pipeline Cache" : "Unity Asset Database Cache"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {isZh ? "保存元数据关联和库生成目录，提高脚本增量打包编译速度" : "Store metadata to expedite repetitive C# and asset linking"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cacheSettings.enableUnityCache}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, enableUnityCache: e.target.checked })}
                  className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-900/40 border border-gray-850 rounded-xl hover:border-gray-800 transition-all">
                <div>
                  <h4 className="font-bold text-gray-200">
                    {isZh ? "后台预编译着色器 (Shader Warmup)" : "Precompile Shaders (Shader Warmup)"}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {isZh ? "自动分析着色器编译变体列表并在构建前进行多线程预热" : "Multithread pre-cook shaders to dodge compiler crashes"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={cacheSettings.precompileShaders}
                  onChange={(e) => setCacheSettings({ ...cacheSettings, precompileShaders: e.target.checked })}
                  className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5 p-2.5 bg-gray-900/40 border border-gray-850 rounded-xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-200">{isZh ? "工作空间清理策略" : "Workspace Clean Strategy"}</h4>
                  <select
                    value={cacheSettings.cleanWorkspaceMode}
                    onChange={(e) => setCacheSettings({ ...cacheSettings, cleanWorkspaceMode: e.target.value })}
                    className="px-2 py-1 bg-black border border-gray-800 rounded text-[11px] font-mono text-gray-300 focus:outline-none"
                  >
                    <option value="increment">{isZh ? "增量编译 (保留环境)" : "Incremental Build"}</option>
                    <option value="full-clean">{isZh ? "完全清理 (清空所有临时文件)" : "Full Purge Workspace"}</option>
                    <option value="cache-only">{isZh ? "仅清理编译缓存" : "Cache Dir Only"}</option>
                  </select>
                </div>
                <p className="text-[10px] text-gray-500">
                  {isZh ? "完全清理将拉长打包周期，但能彻底规避多分支开发的代码碎片引起的不一致问题。" : "Full purging reduces cache side-effects but resets startup sync times."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-mono">
                {isZh ? "自动化工作流钩子脚本" : "Automated Workflow Hooks"}
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold block">{isZh ? "编译前置触发钩子 (Pre-Compile Hook)" : "PRE-COMPILE SHELL HOOK"}</span>
                <textarea
                  rows={3}
                  value={pipelineHooks.preCompile}
                  onChange={(e) => setPipelineHooks({ ...pipelineHooks, preCompile: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-850 rounded-xl p-3 text-[11px] leading-relaxed text-gray-300 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-500 font-bold block">{isZh ? "编译后置打包钩子 (Post-Compile Hook)" : "POST-COMPILE SHELL HOOK"}</span>
                <textarea
                  rows={3}
                  value={pipelineHooks.postCompile}
                  onChange={(e) => setPipelineHooks({ ...pipelineHooks, postCompile: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-850 rounded-xl p-3 text-[11px] leading-relaxed text-gray-300 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider font-mono">
                {isZh ? "运行集群资源配额限制" : "Runner Resource Allotment Limits"}
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">{isZh ? "最大并发构建槽位数:" : "Max Concurrent Jobs:"}</span>
                  <span className="text-indigo-400 font-bold">{resourceLimits.maxConcurrentRunners} Runners</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={resourceLimits.maxConcurrentRunners}
                  onChange={(e) => setResourceLimits({ ...resourceLimits, maxConcurrentRunners: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">{isZh ? "单台设备内存上限:" : "RAM Limit Per Runner:"}</span>
                  <span className="text-indigo-400 font-bold">{resourceLimits.maxRamAllocation} GB</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  step="4"
                  value={resourceLimits.maxRamAllocation}
                  onChange={(e) => setResourceLimits({ ...resourceLimits, maxRamAllocation: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">{isZh ? "项目存储配额限制:" : "Storage Quota Limit:"}</span>
                  <span className="text-indigo-400 font-bold">{resourceLimits.maxDiskQuota} GB</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={resourceLimits.maxDiskQuota}
                  onChange={(e) => setResourceLimits({ ...resourceLimits, maxDiskQuota: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-gray-400">{isZh ? "产物留存天数 (TTL):" : "Artifact Retention TTL:"}</span>
                  <span className="text-indigo-400 font-bold">{resourceLimits.artifactRetentionDays} {isZh ? "天" : "Days"}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="90"
                  value={resourceLimits.artifactRetentionDays}
                  onChange={(e) => setResourceLimits({ ...resourceLimits, artifactRetentionDays: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-950 border border-indigo-950 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-gray-400 leading-relaxed max-w-lg">
          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>
            {isZh ? "高级参数与运行配额变更将即时缓存。点击保存同步将自动重构生成的打包工程与依赖脚本。" 
                  : "Configurations are cached locally. Click Sync/Save to apply variables to compiled scripts & pipeline triggers."}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors border border-gray-850"
          >
            {isZh ? "重置为默认值" : "Reset Defaults"}
          </button>
          <button
            onClick={saveAllConfigs}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {isZh ? "保存并同步配置" : "Save & Sync Configs"}
          </button>
        </div>
      </div>
    </div>
  );
}
