import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono flex gap-2.5 ${
                        log.type === "error"
                          ? "bg-red-950/20 border-red-900/40 text-red-300"
                          : "bg-amber-950/20 border-amber-900/40 text-amber-300"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <AlertTriangle className={`h-4 w-4 ${log.type === "error" ? "text-red-400" : "text-amber-400"}`} />
                      </div>
                      <div className="space-y-1">
                        <span className={`text-[9px] uppercase tracking-wider font-bold ${log.type === "error" ? "text-red-400" : "text-amber-400"}`}>
                          {log.type}
                        </span>
                        <p className="leading-relaxed">{isZh ? log.msgZh : log.msg}</p>
                        {docLink}
                      </div>
                    </div>
                  );'''

replacement = '''                  const isExpanded = expandedLogId === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedLogId(isExpanded ? null : idx)}
                      className={`p-3 rounded-lg border text-xs font-mono flex flex-col gap-2 cursor-pointer transition-colors ${
                        log.type === "error"
                          ? "bg-red-950/20 border-red-900/40 hover:bg-red-900/30"
                          : "bg-amber-950/20 border-amber-900/40 hover:bg-amber-900/30"
                      }`}
                    >
                      <div className={`flex gap-2.5 ${log.type === "error" ? "text-red-300" : "text-amber-300"}`}>
                        <div className="mt-0.5 shrink-0">
                          <AlertTriangle className={`h-4 w-4 ${log.type === "error" ? "text-red-400" : "text-amber-400"}`} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-[9px] uppercase tracking-wider font-bold ${log.type === "error" ? "text-red-400" : "text-amber-400"}`}>
                              {log.type}
                            </span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => handleCopyLog(log.msg, idx, e)}
                                className={`p-1 rounded hover:bg-gray-800/50 transition-colors ${copiedLogId === idx ? "text-emerald-400" : "text-gray-400"}`}
                                title={isZh ? "复制到剪贴板" : "Copy to clipboard"}
                              >
                                {copiedLogId === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                          <p className="leading-relaxed">{isZh ? log.msgZh : log.msg}</p>
                          {docLink}
                        </div>
                      </div>
                      
                      {/* Expandable Metadata Section */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-800/50 flex flex-col gap-3 font-sans" onClick={(e) => e.stopPropagation()}>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-gray-500 block mb-0.5">{isZh ? "时间戳:" : "Timestamp:"}</span>
                              <span className="text-xs text-gray-300 font-mono bg-gray-900/50 px-1.5 py-0.5 rounded">
                                {new Date(Date.now() - (10 - idx) * 1000 * 60).toISOString().replace('T', ' ').substring(0, 19)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 block mb-0.5">{isZh ? "节点 ID:" : "Runner ID:"}</span>
                              <span className="text-xs text-gray-300 font-mono bg-gray-900/50 px-1.5 py-0.5 rounded">
                                NODE-0{Math.floor(Math.random() * 5) + 1}-{selectedPlatformForModal === 'unreal' ? 'WIN' : 'MAC'}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Terminal className="h-3 w-3" />
                              {isZh ? "Gemini 快速修复建议" : "Gemini Quick Fix"}
                            </span>
                            <code className="text-[10px] text-gray-300 break-all bg-black/40 px-2 py-1 rounded block mt-1">
                              {log.type === "error" 
                                ? `gameops diagnose --runner ${selectedPlatformForModal} --issue "${log.msg.substring(0, 20)}..." --apply-fix`
                                : `gameops analyze-warning --trace "${log.msg.substring(0, 20)}..."`}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  );'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Row Log.")
else:
    print("Row Log target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
