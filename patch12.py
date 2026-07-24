import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''              <button
                onClick={() => setSelectedPlatformForModal(null)}
                className="p-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs cursor-pointer font-sans"
              >
                {isZh ? "关闭" : "Close"}
              </button>'''
replacement = '''              <div className="flex gap-2">
                <button
                  onClick={exportPlatformLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs cursor-pointer font-sans transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isZh ? "导出日志" : "Export Logs"}
                </button>
                <button
                  onClick={() => setSelectedPlatformForModal(null)}
                  className="p-1 px-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-xs cursor-pointer font-sans"
                >
                  {isZh ? "关闭" : "Close"}
                </button>
              </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Modal Header.")
else:
    print("Modal Header target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
