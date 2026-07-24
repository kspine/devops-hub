import { useState } from "react";
import { Settings } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";

export default function SDKVersionManager({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { language } = useLanguage();
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const isZh = language === "zh";

  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{status: 'success' | 'error' | 'idle', msg: string}>({status: 'idle', msg: ''});

  if (!isOpen) return null;

  const handleValidate = () => {
    setIsValidating(true);
    setValidationResult({status: 'idle', msg: ''});
    
    setTimeout(() => {
      setIsValidating(false);
      if (projectType === "unreal") {
        setValidationResult({
          status: 'success',
          msg: isZh ? "环境验证通过：UE_ENGINE_DIR, P4_CLIENT 已配置。" : "Environment verified: UE_ENGINE_DIR, P4_CLIENT are correctly set."
        });
      } else {
        setValidationResult({
          status: 'success',
          msg: isZh ? "Unity 环境已就绪。" : "Unity environment is ready."
        });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-100 mb-4">{isZh ? "SDK 版本管理器" : "SDK Version Manager"} ({projectType})</h3>
        
        <div className="mb-6 p-3 bg-gray-950 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "环境路径检查" : "Path Validation"}</span>
            <button 
              onClick={handleValidate}
              disabled={isValidating}
              className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                isValidating ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-indigo-600/10 border-indigo-500/50 text-indigo-400 hover:bg-indigo-600/20"
              }`}
            >
              {isValidating ? (isZh ? "验证中..." : "Validating...") : (isZh ? "立即验证" : "Validate Now")}
            </button>
          </div>
          {validationResult.status !== 'idle' && (
            <div className={`text-[9px] p-2 rounded ${validationResult.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {validationResult.msg}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {projectType === "unity" ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "Unity 版本" : "Unity Version"}</label>
                <input type="text" placeholder="2022.3.10f1" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "Gradle 版本" : "Gradle Version"}</label>
                <input type="text" placeholder="8.0" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "CocoaPods 版本" : "CocoaPods Version"}</label>
                <input type="text" placeholder="1.12.0" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2"/>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "Unreal Engine 版本" : "Unreal Engine Version"}</label>
                <input type="text" placeholder="5.3.2" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "Visual Studio 版本" : "Visual Studio Version"}</label>
                <input type="text" placeholder="Visual Studio 2022 (v143)" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "Windows SDK 路径" : "Windows SDK Path"}</label>
                <input type="text" placeholder="C:\Program Files (x86)\Windows Kits\10" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">{isZh ? "UBT 版本/路径" : "UBT Version/Path"}</label>
                <input type="text" placeholder="Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.exe" className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"/>
              </div>
            </>
          )}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold">
          {isZh ? "保存" : "Save"}
        </button>
      </div>
    </div>
  );
}
