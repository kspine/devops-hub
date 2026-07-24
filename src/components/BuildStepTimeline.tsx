import { useState } from "react";
import { useLanguage } from "../LanguageContext";

import { ProjectType } from "../types";

export default function BuildStepTimeline({ projectType }: { projectType: ProjectType }) {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [showAverage, setShowAverage] = useState(false);

  const unitySteps = [
    { name: isZh ? "环境检查" : "Setup", progress: 100, avg: 100 },
    { name: isZh ? "资源编译" : "Addressables", progress: 100, avg: 90 },
    { name: isZh ? "Unity 编译" : "Unity Build", progress: 65, avg: 85 },
    { name: isZh ? "签名打包" : "Packaging", progress: 0, avg: 100 },
  ];

  const unrealSteps = [
    { name: isZh ? "获取源码" : "Fetch Source", progress: 100, avg: 100 },
    { name: isZh ? "UBT 编译" : "UBT Build", progress: 100, avg: 95 },
    { name: isZh ? "资源烘焙" : "Cooking", progress: 45, avg: 75 },
    { name: isZh ? "打包分发" : "Packaging", progress: 0, avg: 100 },
  ];

  const genericSteps = [
    { name: isZh ? "依赖拉取" : "Install Dependencies", progress: 100, avg: 100 },
    { name: isZh ? "单元测试" : "Unit Testing", progress: 100, avg: 98 },
    { name: isZh ? "正式构建" : "Build Artifact", progress: 70, avg: 85 },
    { name: isZh ? "分发上线" : "Distribution", progress: 0, avg: 100 },
  ];

  const steps = projectType === "unity" ? unitySteps : projectType === "unreal" ? unrealSteps : genericSteps;
  const efficiencyScore = 0.95;

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
            {isZh ? "构建进度分解" : "Build Progress Breakdown"}
          </h3>
          <button 
            onClick={() => setShowAverage(!showAverage)}
            className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${showAverage ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400'}`}
          >
            {isZh ? "显示历史平均" : "Show Avg"}
          </button>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">
           {isZh ? "效率评分:" : "Efficiency:"} {(efficiencyScore * 100).toFixed(0)}%
        </span>
      </div>
      <div className="space-y-4">
        {steps.map(step => (
          <div key={step.name}>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>{step.name}</span>
              <div className="flex gap-2">
                {showAverage && <span className="text-gray-600">Avg: {step.avg}%</span>}
                <span>{step.progress}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 relative z-10" 
                style={{ width: `${step.progress}%` }}
              />
              {showAverage && (
                <div 
                  className="absolute top-0 h-full bg-indigo-500/30 border-r border-indigo-400/50 transition-all duration-500" 
                  style={{ width: `${step.avg}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
