import React from "react";
import { useLanguage } from "../LanguageContext";
import { PIPELINE_STEPS } from "../data";
import { Settings, Boxes, Flame, Layout, Package, Archive, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface UnrealPipelineEditorProps {
  enabledSteps: string[];
  onToggleStep: (stepId: string) => void;
}

export default function UnrealPipelineEditor({ enabledSteps, onToggleStep }: UnrealPipelineEditorProps) {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const unrealSteps = PIPELINE_STEPS.filter(s => 
    ["cook", "stage", "package", "archive"].includes(s.id)
  );

  const getIcon = (id: string) => {
    switch (id) {
      case "cook": return <Flame className="h-5 w-5" />;
      case "stage": return <Layout className="h-5 w-5" />;
      case "package": return <Package className="h-5 w-5" />;
      case "archive": return <Archive className="h-5 w-5" />;
      default: return <Boxes className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-orange-600/10 border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">
              {isZh ? "Unreal 自动化工具 (UAT) 配置" : "Unreal AutomationTool Config"}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">BuildCookRun Parameter Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">UAT Service Active</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unrealSteps.map((step) => {
            const isActive = enabledSteps.includes(step.id);
            return (
              <motion.button
                key={step.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleStep(step.id)}
                className={`relative group flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  isActive 
                    ? "bg-orange-950/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]" 
                    : "bg-gray-900/40 border-gray-850 hover:border-gray-700"
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  isActive ? "bg-orange-600 text-white shadow-lg" : "bg-gray-800 text-gray-500"
                }`}>
                  {getIcon(step.id)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isActive ? "text-orange-400" : "text-gray-300"}`}>
                      {isZh ? step.nameZh : step.nameEn}
                    </span>
                    {isActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-gray-700" />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal line-clamp-2">
                    {isZh ? step.descZh : step.descEn}
                  </p>
                </div>
                {isActive && (
                  <div className="absolute -right-1 -top-1">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Generated CLI Command</span>
              <span className="text-[9px] text-orange-500 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">UAT 5.3.x</span>
            </div>
            <div className="text-[10px] text-orange-300/80 break-all leading-relaxed bg-gray-950/40 p-3 rounded-lg border border-gray-850">
              RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 
              {enabledSteps.includes('cook') && <span className="text-orange-500 font-bold"> -cook</span>}
              {enabledSteps.includes('stage') && <span className="text-orange-500 font-bold"> -stage</span>}
              {enabledSteps.includes('package') && <span className="text-orange-500 font-bold"> -package</span>}
              {enabledSteps.includes('archive') && <span className="text-orange-500 font-bold"> -archive -archivedirectory="Builds"</span>}
              <span className="text-gray-600"> -nocompile -unattended</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-950/10 border border-blue-900/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-300/70 leading-relaxed">
              {isZh 
                ? "配置提示：Unreal 的 Cook 步骤通常是最耗时的。对于大型项目，建议启用 -iterative 参数以缩短后续构建时间。" 
                : "Pro Tip: Unreal's Cook stage is often the bottleneck. For large projects, consider enabling -iterative to speed up subsequent builds."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
