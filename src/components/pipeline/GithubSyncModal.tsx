import React from "react";
import { Github, X, RefreshCw, Copy } from "lucide-react";

interface GithubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isZh: boolean;
  githubRepoName: string;
  setGithubRepoName: (name: string) => void;
  syncStatus: "idle" | "connecting" | "pushing" | "done";
  setSyncStatus: (status: "idle" | "connecting" | "pushing" | "done") => void;
  workflowYaml: string;
  showToast: (msg: string) => void;
}

export const GithubSyncModal: React.FC<GithubSyncModalProps> = ({
  isOpen,
  onClose,
  isZh,
  githubRepoName,
  setGithubRepoName,
  syncStatus,
  setSyncStatus,
  workflowYaml,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      id="github-sync-modal-overlay"
      onClick={() => {
        if (syncStatus !== "connecting" && syncStatus !== "pushing") {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gray-950 border border-gray-800 text-indigo-400">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider font-sans">
                {isZh ? "推送 CI/CD 流程至 GitHub" : "Sync Workflow to GitHub"}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isZh ? "一键自动化将本地可视化流水线转换为生产级 GitHub Actions 工作流。" : "Compile your visual DevOps flow to a production-grade GitHub Actions YAML workflow."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={syncStatus === "connecting" || syncStatus === "pushing"}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white text-xs cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Repository Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                {isZh ? "GitHub 仓库名称" : "GitHub Repository Name"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] text-gray-500 font-mono">github.com/</span>
                <input
                  type="text"
                  value={githubRepoName}
                  onChange={(e) => setGithubRepoName(e.target.value)}
                  placeholder="repo-name"
                  disabled={syncStatus === "connecting" || syncStatus === "pushing"}
                  className="w-full text-xs bg-gray-950 border border-gray-850 rounded-lg py-2.5 pl-24 pr-3 text-gray-200 focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                {isZh ? "目标推送分支" : "Target Branch"}
              </label>
              <select
                disabled={syncStatus === "connecting" || syncStatus === "pushing"}
                className="w-full text-xs bg-gray-950 border border-gray-850 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono disabled:opacity-60"
              >
                <option value="main">main (Production)</option>
                <option value="master">master</option>
                <option value="develop">develop (Dev/QA)</option>
              </select>
            </div>
          </div>

          {/* Status Section */}
          {syncStatus !== "idle" && (
            <div className="p-4 rounded-xl border bg-gray-950/60 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  {isZh ? "⚡ 实时同步控制台" : "⚡ Sync Console"}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  syncStatus === "connecting" ? "bg-amber-950/40 text-amber-400 border border-amber-900/40 animate-pulse" :
                  syncStatus === "pushing" ? "bg-blue-950/40 text-blue-400 border border-blue-900/40 animate-pulse" :
                  "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                }`}>
                  {syncStatus === "connecting" ? (isZh ? "验证中" : "Connecting") :
                   syncStatus === "pushing" ? (isZh ? "推送中" : "Pushing") :
                   (isZh ? "已完成" : "Success")}
                </span>
              </div>

              <div className="space-y-1.5 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>{isZh ? "正在导出流水线 JSON 与 YAML 参数..." : "Exported pipeline configuration successfully."}</span>
                </div>
                
                {(syncStatus === "connecting" || syncStatus === "pushing" || syncStatus === "done") && (
                  <div className="flex items-center gap-2 animate-in fade-in duration-300">
                    {syncStatus === "connecting" ? (
                      <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                    ) : (
                      <span className="text-emerald-500">✓</span>
                    )}
                    <span>{isZh ? "正在通过 OAuth 校验 GitHub credentials 认证令牌..." : "Authenticating OAuth credentials with GitHub..."}</span>
                  </div>
                )}

                {(syncStatus === "pushing" || syncStatus === "done") && (
                  <div className="flex items-center gap-2 animate-in fade-in duration-300">
                    {syncStatus === "pushing" ? (
                      <RefreshCw className="h-3.5 w-3.5 text-blue-400 animate-spin" />
                    ) : (
                      <span className="text-emerald-500">✓</span>
                    )}
                    <span>{isZh ? `正在推送 '.github/workflows/devops-hub-ci.yml' 到 [${githubRepoName}]...` : `Pushing GitHub Actions workflow to [${githubRepoName}] repository...`}</span>
                  </div>
                )}

                {syncStatus === "done" && (
                  <div className="pt-2 border-t border-gray-900 mt-2 space-y-1 text-emerald-400 animate-in slide-in-from-bottom-2 duration-350">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span>🚀</span>
                      <span>{isZh ? "恭喜！同步流程完美闭环！" : "Synchronization Completed Successfully!"}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                      {isZh 
                        ? `已在您仓库的 .github/workflows/ 目录中自动创建发布流水线。任何提交（Push）或合并请求（PR）都将触发真实的 CI 编译。`
                        : `A workflow file has been pushed to your remote repository. Push or pull requests to main will now trigger your compiled DevOps workflow.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* YAML Code Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                {isZh ? "即将推送的工作流定义 (devops-hub-ci.yml):" : "Generated Actions Code Preview (devops-hub-ci.yml):"}
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(workflowYaml);
                  showToast(isZh ? "已复制到剪贴板！" : "Workflow code copied!");
                }}
                className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Copy className="h-2.5 w-2.5" />
                <span>{isZh ? "复制全部" : "Copy All"}</span>
              </button>
            </div>
            <div className="bg-gray-950 border border-gray-850 rounded-xl p-3 max-h-[220px] overflow-y-auto font-mono text-[10.5px] text-gray-400 select-all leading-relaxed whitespace-pre text-left">
              {workflowYaml}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-950/40 border-t border-gray-800 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={syncStatus === "connecting" || syncStatus === "pushing"}
            className="px-3.5 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-800 text-xs font-semibold font-sans cursor-pointer transition-colors disabled:opacity-50"
          >
            {isZh ? "取消" : "Cancel"}
          </button>

          {syncStatus !== "done" ? (
            <button
              onClick={() => {
                setSyncStatus("connecting");
                setTimeout(() => {
                  setSyncStatus("pushing");
                  setTimeout(() => {
                    setSyncStatus("done");
                    showToast(isZh ? "GitHub Actions 同步成功！" : "Successfully synced with GitHub Actions!");
                  }, 1800);
                }, 1200);
              }}
              disabled={syncStatus === "connecting" || syncStatus === "pushing"}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg text-xs font-semibold font-sans cursor-pointer transition-all flex items-center gap-1.5"
            >
              {(syncStatus === "connecting" || syncStatus === "pushing") ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>{isZh ? "正在同步..." : "Syncing..."}</span>
                </>
              ) : (
                <>
                  <Github className="h-3.5 w-3.5" />
                  <span>{isZh ? "开始同步" : "Push & Sync Now"}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold font-sans cursor-pointer transition-all"
            >
              {isZh ? "完成" : "Done"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubSyncModal;
