import React from "react";
import { Scale } from "lucide-react";

export default function RunnerScaler() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <Scale className="h-4 w-4 text-indigo-400" />
        KEDA Runner Scaler
      </h3>
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Queue Depth Trigger</label>
        <input type="range" className="w-full accent-indigo-600" />
      </div>
      <p className="text-[10px] text-gray-500">Scaling rules based on build queue depth.</p>
    </div>
  );
}
