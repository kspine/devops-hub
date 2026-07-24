import React from "react";
import { useLanguage } from "../LanguageContext";
import { PIPELINE_STEPS } from "../data";
import { Package, Archive, Layout, Flame } from "lucide-react";

interface UnrealPipelineManagerProps {
  enabledSteps: string[];
  onToggleStep: (stepId: string) => void;
}

export default function UnrealPipelineManager({ enabledSteps, onToggleStep }: UnrealPipelineManagerProps) {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const unrealSpecificSteps = PIPELINE_STEPS.filter(s => 
    ["cook", "stage", "package", "archive"].includes(s.id)
  );

  const getIcon = (id: string) => {
    switch (id) {
      case "cook": return <Flame className="h-4 w-4" />;
      case "stage": return <Layout className="h-4 w-4" />;
      case "package": return <Package className="h-4 w-4" />;
      case "archive": return <Archive className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-orange-400 flex items-center gap-2">
          <Package className="h-4 w-4" />
          {isZh ? "Unreal 自动化流水线管理" : "Unreal Automation Manager"}
        </h3>
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
          Engine: Unreal
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {unrealSpecificSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => onToggleStep(step.id)}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
              enabledSteps.includes(step.id)
                ? "bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/20"
                : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              enabledSteps.includes(step.id) ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400"
            }`}>
              {getIcon(step.id)}
            </div>
            <div>
              <div className={`text-xs font-bold ${enabledSteps.includes(step.id) ? "text-orange-400" : "text-gray-300"}`}>
                {isZh ? step.nameZh : step.nameEn}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                {isZh ? step.descZh : step.descEn}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-orange-950/20 border border-orange-900/30 rounded-lg p-3">
        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter mb-2">
          {isZh ? "自动化工具 (UAT) 配置提示" : "AutomationTool (UAT) Configuration Tip"}
        </h4>
        <p className="text-[10px] text-orange-200/60 leading-relaxed">
          {isZh 
            ? "启用上述步骤后，构建脚本将自动注入 -cook -stage -package -archive 参数。请确保您的构建节点已安装 Unreal AutomationTool 且环境变量正确配置。" 
            : "Enabling these steps will automatically inject -cook -stage -package -archive parameters into the build script. Ensure UAT is installed on the build agent."}
        </p>
      </div>
    </div>
  );
}
