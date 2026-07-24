import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''              <div className="flex gap-2">
                <button
                  onClick={exportPlatformLogs}'''
replacement = '''              <div className="flex gap-2">
                {selectedLogs.size > 0 && (
                  <button
                    onClick={() => {
                      setDismissedLogs(prev => {
                        const next = new Set(prev);
                        selectedLogs.forEach(id => next.add(id));
                        return next;
                      });
                      setSelectedLogs(new Set());
                      addToast(isZh ? `已忽略 ${selectedLogs.size} 条日志` : `Dismissed ${selectedLogs.size} logs`, "info");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs cursor-pointer font-sans transition-colors"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    {isZh ? "批量忽略" : "Bulk Dismiss"}
                  </button>
                )}
                <button
                  onClick={exportPlatformLogs}'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Bulk Dismiss Button.")
else:
    print("Bulk Dismiss Button target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
