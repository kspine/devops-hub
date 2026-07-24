import React from "react";
import { DollarSign, BarChart3 } from "lucide-react";

export default function CostEstimator() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-400" />
        Monthly Build Cost Estimate
      </h3>
      <div className="text-3xl font-extrabold text-white">$4,250.00</div>
      <p className="text-xs text-gray-400">Based on last 30 days of runner utilization.</p>
      <div className="pt-2">
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 w-[65%]"></div>
        </div>
      </div>
    </div>
  );
}
