import React from "react";
import { ShieldAlert, CheckCircle } from "lucide-react";

export default function PolicyAudit() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-rose-400" />
        CI/CD Policy Audit Engine
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <CheckCircle className="h-3 w-3 text-emerald-400" /> Signed Commits: Validated
        </div>
        <div className="flex items-center gap-2 text-xs text-rose-300">
          <ShieldAlert className="h-3 w-3" /> Hardcoded Secrets: Found in /src/configs
        </div>
      </div>
    </div>
  );
}
