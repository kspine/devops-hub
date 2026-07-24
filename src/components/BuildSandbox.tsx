import React from "react";
import { Lock } from "lucide-react";

export default function BuildSandbox() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <Lock className="h-4 w-4 text-amber-400" />
        Build Sandbox (gVisor)
      </h3>
      <div className="flex items-center gap-2 p-2 bg-gray-950 border border-gray-800 rounded text-xs text-gray-400">
        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
        Isolated Kernel Environment: ACTIVE
      </div>
      <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-200">
        Run Untrusted Script
      </button>
    </div>
  );
}
