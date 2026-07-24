import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";

export default function LiveTail() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] Building...`]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <Activity className="h-4 w-4 text-emerald-400" />
        Live Tail Logs
      </h3>
      <div className="h-40 overflow-y-auto bg-black p-3 rounded font-mono text-[10px] text-gray-300 space-y-0.5">
        {logs.map((log, i) => <p key={i}>{log}</p>)}
      </div>
    </div>
  );
}
