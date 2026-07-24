import React, { useState } from "react";
import { AlertCircle, FileText, CheckCircle, RefreshCw } from "lucide-react";

interface LeakReport {
  leaks: {
    address: string;
    size: number;
    stack: string[];
  }[];
}

export default function ValgrindLeakDetector() {
  const [log, setLog] = useState("");
  const [report, setReport] = useState<LeakReport | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeLeaks = () => {
    setLoading(true);
    // Simulate parsing
    setTimeout(() => {
      // Mock parsing logic
      const mockLeaks = [
        { address: "0x4005", size: 1024, stack: ["MemoryManager.cpp:123", "UnityPlugin.cpp:45"] },
        { address: "0x4010", size: 512, stack: ["AssetLoader.cpp:88"] }
      ];
      setReport({ leaks: mockLeaks });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
      <h3 className="text-sm font-bold text-gray-200">C++ Memory Leak Diagnostic (Valgrind)</h3>
      <textarea
        value={log}
        onChange={(e) => setLog(e.target.value)}
        placeholder="Paste Valgrind log output here..."
        className="w-full h-40 bg-gray-950 border border-gray-800 rounded p-3 text-xs font-mono text-gray-300"
      />
      <button
        onClick={analyzeLeaks}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center gap-2"
      >
        {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <AlertCircle className="h-3 w-3" />}
        Analyze Memory Leaks
      </button>

      {report && (
        <div className="space-y-2 mt-4">
          {report.leaks.map((leak, i) => (
            <div key={i} className="bg-red-950/20 border border-red-900/40 p-3 rounded text-xs">
              <p className="font-bold text-red-400">Leak at {leak.address} ({leak.size} bytes)</p>
              <ul className="list-disc pl-4 mt-1 text-gray-400">
                {leak.stack.map((s, j) => <li key={j}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
