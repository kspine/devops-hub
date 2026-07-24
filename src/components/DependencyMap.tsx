import React from "react";
import { GitBranch } from "lucide-react";

export default function DependencyMap() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-emerald-400" />
        Build Dependency Map
      </h3>
      <div className="h-64 flex items-center justify-center bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-500">
        [Force-directed graph placeholder]
      </div>
    </div>
  );
}
