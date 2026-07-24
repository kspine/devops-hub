import { useState } from "react";
import { Save, FolderOpen } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function PipelinePresets() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const presets = [
    { id: 1, name: "Mobile Production" },
    { id: 2, name: "WebGL Dev-Build" },
  ];

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-sans">
        {isZh ? "流水线预设" : "Pipeline Presets"}
      </h3>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-800">
          <Save className="h-4 w-4" /> {isZh ? "保存" : "Save"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-800">
          <FolderOpen className="h-4 w-4" /> {isZh ? "加载" : "Load"}
        </button>
      </div>
      <div className="text-xs text-gray-500 font-mono">
        {isZh ? "已保存预设:" : "Saved Presets:"}
        <ul className="list-disc list-inside mt-2">
          {presets.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
      </div>
    </div>
  );
}
