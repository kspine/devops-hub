import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''              {(() => {
                const filteredLogs = platformLogs[selectedPlatformForModal].filter(log => {
                  const matchesLevel = logLevelFilter === "all" || log.type === logLevelFilter;
                  const matchesSearch = log.msg.toLowerCase().includes(logSearch.toLowerCase()) || 
                                       log.msgZh.toLowerCase().includes(logSearch.toLowerCase());
                  const matchesCategory = projectType !== "unreal" || logCategoryFilter === "all" || log.msg.includes(`[${logCategoryFilter}]`);
                  return matchesLevel && matchesSearch && matchesCategory;
                });

                if (filteredLogs.length === 0) {
                  return (
                    <div className="text-center py-10 text-xs text-gray-500 font-sans">
                      {isZh ? "无对应级别的日志记录。" : "No logs found for the selected level."}
                    </div>
                  );
                }

                return filteredLogs.map((log, idx) => {'''
replacement = '''              {(() => {
                const logsWithIndex = platformLogs[selectedPlatformForModal].map((log, idx) => ({ ...log, originalIdx: idx }));
                const filteredLogs = logsWithIndex.filter(log => {
                  const logKey = `${selectedPlatformForModal}-${log.originalIdx}`;
                  if (dismissedLogs.has(logKey)) return false;
                  
                  const matchesLevel = logLevelFilter === "all" || log.type === logLevelFilter;
                  const matchesSearch = log.msg.toLowerCase().includes(logSearch.toLowerCase()) || 
                                       log.msgZh.toLowerCase().includes(logSearch.toLowerCase());
                  const matchesCategory = projectType !== "unreal" || logCategoryFilter === "all" || log.msg.includes(`[${logCategoryFilter}]`);
                  return matchesLevel && matchesSearch && matchesCategory;
                });

                if (filteredLogs.length === 0) {
                  return (
                    <div className="text-center py-10 text-xs text-gray-500 font-sans">
                      {isZh ? "无对应级别的日志记录。" : "No logs found for the selected level."}
                    </div>
                  );
                }

                return filteredLogs.map((log) => {
                  const idx = log.originalIdx;
                  const logKey = `${selectedPlatformForModal}-${idx}`;'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Filter.")
else:
    print("Filter target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
