import React from "react";
import { ShieldCheck, AlertTriangle, FileCode } from "lucide-react";

export default function ComplianceDashboard() {
  const violations = [
    { rule: "CIS-1.1: Use non-root user", severity: "High" },
    { rule: "CIS-2.3: Read-only root filesystem", severity: "Medium" },
  ];

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        Compliance & Governance
      </h3>
      <div className="space-y-2">
        {violations.map((v, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 p-2 rounded text-xs">
            <span className="text-gray-300">{v.rule}</span>
            <span className={`px-2 py-0.5 rounded ${v.severity === 'High' ? 'bg-rose-900 text-rose-300' : 'bg-amber-900 text-amber-300'}`}>{v.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
