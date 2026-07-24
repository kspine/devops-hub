import React, { useState } from "react";
import { Terminal } from "lucide-react";

export default function RemoteShell() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>(["Connected to build-runner-1..."]);

  const executeCommand = () => {
    setHistory([...history, `> ${command}`, `Executing: ${command}...`]);
    setCommand("");
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
        <Terminal className="h-4 w-4 text-indigo-400" />
        Remote Shell
      </h3>
      <div className="h-40 overflow-y-auto bg-black p-3 rounded font-mono text-xs text-green-400 space-y-1">
        {history.map((h, i) => <p key={i}>{h}</p>)}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
          className="flex-1 bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white"
          placeholder="Enter command..."
        />
        <button onClick={executeCommand} className="bg-indigo-600 px-3 py-1 rounded text-xs text-white">Run</button>
      </div>
    </div>
  );
}
