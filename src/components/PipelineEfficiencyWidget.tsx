import React from "react";
import { TrendingUp, GitBranch } from "lucide-react";

export default function PipelineEfficiencyWidget() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-sky-400" />
        Pipeline Efficiency
      </h3>
      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold text-white">88%</div>
          <div className="text-[10px] text-gray-400">Cache Hit Ratio</div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-2xl font-bold text-rose-400">+$120</div>
          <div className="text-[10px] text-gray-400">Branch 'feat/unity-rebuild' Cost</div>
        </div>
      </div>
    </div>
  );
}
