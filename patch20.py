import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                  const isExpanded = expandedLogId === idx;
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
                            </span>'''
replacement = '''                  const isExpanded = expandedLogId === idx;
                  const severity = getSeverity(log.msg);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono flex flex-col gap-2 transition-colors ${
                        log.type === "error"
                          ? "bg-red-950/20 border-red-900/40"
                          : "bg-amber-950/20 border-amber-900/40"
                      }`}
                    >
                      <div className={`flex gap-2.5 ${log.type === "error" ? "text-red-300" : "text-amber-300"}`}>
                        <div className="mt-0.5 shrink-0 flex items-start gap-2">
                          <input 
                            type="checkbox" 
                            checked={selectedLogs.has(logKey)}
                            onChange={(e) => {
                              setSelectedLogs(prev => {
                                const next = new Set(prev);
                                if (e.target.checked) next.add(logKey);
                                else next.delete(logKey);
                                return next;
                              });
                            }}
                            className="mt-1 cursor-pointer"
                          />
                          <AlertTriangle className={`h-4 w-4 ${log.type === "error" ? "text-red-400" : "text-amber-400"}`} />
                        </div>
                        <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setExpandedLogId(isExpanded ? null : idx)}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] uppercase tracking-wider font-bold ${log.type === "error" ? "text-red-400" : "text-amber-400"}`}>
                                {log.type}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                severity === 'Critical' ? 'bg-red-900/50 text-red-300' :
                                severity === 'Major' ? 'bg-orange-900/50 text-orange-300' :
                                'bg-yellow-900/50 text-yellow-300'
                              }`}>
                                {severity}
                              </span>
                            </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched rendering of log item.")
else:
    print("Log item target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
