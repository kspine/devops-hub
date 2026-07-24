import React from "react";
import { DollarSign, Server, Clock, AlertTriangle } from "lucide-react";

interface ProviderData {
  provider: "AWS" | "GCP" | "Azure";
  cost: string;
  uptime: string;
  status: "Healthy" | "Degraded";
}

const mockProviders: ProviderData[] = [
  { provider: "AWS", cost: "$1,240", uptime: "99.99%", status: "Healthy" },
  { provider: "GCP", cost: "$890", uptime: "99.95%", status: "Healthy" },
  { provider: "Azure", cost: "$1,100", uptime: "99.90%", status: "Degraded" },
];

export default function CloudResourceMonitor() {
  return (
    <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
        <Server className="h-4 w-4 text-indigo-400" />
        Cloud Resource Monitor
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockProviders.map((p) => (
          <div key={p.provider} className="bg-gray-900/50 border border-gray-800 p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-200">{p.provider}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded ${p.status === 'Healthy' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>{p.status}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <DollarSign className="h-3 w-3" /> Cost: {p.cost}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" /> Uptime: {p.uptime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
