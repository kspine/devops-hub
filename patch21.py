import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                          <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Terminal className="h-3 w-3" />
                              {isZh ? "Gemini 快速修复建议" : "Gemini Quick Fix"}
                            </span>
                            <code className="text-[10px] text-gray-300 break-all bg-black/40 px-2 py-1 rounded block mt-1">
                              {log.type === "error" 
                                ? `gameops diagnose --runner ${selectedPlatformForModal} --issue "${log.msg.substring(0, 20)}..." --apply-fix`
                                : `gameops analyze-warning --trace "${log.msg.substring(0, 20)}..."`}
                            </code>
                          </div>'''

replacement = '''                          <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Terminal className="h-3 w-3" />
                                {isZh ? "Gemini 智能分析与修复建议" : "Gemini AI Diagnosis"}
                              </span>
                              {!aiDiagnosis[logKey] && (
                                <button
                                  onClick={(e) => handleDiagnose(selectedPlatformForModal, log.msg, logKey, e)}
                                  disabled={isDiagnosing[logKey]}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-[10px] font-bold tracking-wide flex items-center gap-1 transition-colors"
                                >
                                  {isDiagnosing[logKey] ? (isZh ? "分析中..." : "Analyzing...") : (isZh ? "生成修复方案" : "Generate Fix")}
                                </button>
                              )}
                            </div>
                            
                            {aiDiagnosis[logKey] ? (
                              <div className="space-y-3 mt-2 text-xs text-gray-300">
                                <div>
                                  <strong className="text-gray-100 block mb-1">{isZh ? "根本原因" : "Root Cause"}:</strong>
                                  <p>{aiDiagnosis[logKey].rootCause}</p>
                                </div>
                                <div>
                                  <strong className="text-gray-100 block mb-1">{isZh ? "修复步骤" : "Remediation Steps"}:</strong>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {aiDiagnosis[logKey].steps.map((step: string, i: number) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                                {aiDiagnosis[logKey].codeSnippet && (
                                  <div className="mt-2">
                                    <code className="text-[10px] text-indigo-300 break-all bg-black/40 p-2 rounded block whitespace-pre-wrap font-mono">
                                      {aiDiagnosis[logKey].codeSnippet}
                                    </code>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <code className="text-[10px] text-gray-500 break-all bg-black/40 px-2 py-1 rounded block mt-1">
                                {log.type === "error" 
                                  ? `gameops diagnose --runner ${selectedPlatformForModal} --issue "${log.msg.substring(0, 20)}..." --apply-fix`
                                  : `gameops analyze-warning --trace "${log.msg.substring(0, 20)}..."`}
                              </code>
                            )}
                          </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Generate Fix button.")
else:
    print("Generate Fix target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
