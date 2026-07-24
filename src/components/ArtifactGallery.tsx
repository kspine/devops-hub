import { Download, Package, HardDrive, Clock } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function ArtifactGallery() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  const artifacts = [
    { 
      id: 1, 
      version: "1.2.0", 
      platform: "Android", 
      filename: "game-release-v1.2.0.apk", 
      size: "145.2 MB", 
      timestamp: "2026-07-13 14:32:10 UTC" 
    },
    { 
      id: 2, 
      version: "1.1.9", 
      platform: "iOS", 
      filename: "game-release-v1.1.9.ipa", 
      size: "210.8 MB", 
      timestamp: "2026-07-12 09:15:44 UTC" 
    },
    { 
      id: 3, 
      version: "1.1.8", 
      platform: "Android", 
      filename: "game-release-v1.1.8.aab", 
      size: "132.5 MB", 
      timestamp: "2026-07-10 16:45:00 UTC" 
    },
  ];

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4 font-sans flex items-center gap-2">
        <Package className="h-4 w-4 text-purple-400" />
        {isZh ? "构建产物 (Build Artifacts)" : "Build Artifacts"}
      </h3>
      <div className="space-y-3">
        {artifacts.map(art => (
          <div key={art.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-900/40 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-200">v{art.version}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded font-mono uppercase tracking-wider">
                  {art.platform}
                </span>
              </div>
              <p className="text-[11px] font-mono text-indigo-400 truncate max-w-[200px] sm:max-w-[250px]">
                {art.filename}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  <span>{art.size}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{art.timestamp}</span>
                </div>
              </div>
            </div>
            <button 
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-colors self-start sm:self-center"
              title={isZh ? "下载构建产物" : "Download Artifact"}
            >
              <Download className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase">{isZh ? "下载" : "Download"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
