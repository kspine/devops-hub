import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''            <div className="p-5 space-y-3.5 max-h-[350px] overflow-y-auto">'''
replacement = '''            <div className="p-5 space-y-3.5 max-h-[350px] overflow-y-auto">
              {/* Error Category Breakdown Chart */}
              <div className="mb-4 bg-gray-950 p-3 border border-gray-850 rounded-xl">
                <h6 className="text-[10px] font-bold text-gray-500 uppercase mb-2">{isZh ? "错误分布概览" : "Error Category Breakdown"}</h6>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
                  {(() => {
                    const breakdown = selectedPlatformForModal === "unreal" ? [
                      { label: "Linking", val: 35, color: "bg-blue-500" },
                      { label: "UBT", val: 25, color: "bg-orange-500" },
                      { label: "Shader", val: 20, color: "bg-emerald-500" },
                      { label: "Cook", val: 20, color: "bg-indigo-500" },
                    ] : [
                      { label: "Compilation", val: 50, color: "bg-indigo-500" },
                      { label: "Resource", val: 30, color: "bg-teal-500" },
                      { label: "Linking", val: 20, color: "bg-rose-500" },
                    ];
                    return breakdown.map(item => (
                      <div key={item.label} className={`${item.color} h-full`} style={{ width: `${item.val}%` }} title={`${item.label} (${item.val}%)`} />
                    ));
                  })()}
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-gray-400">
                  {(() => {
                    const breakdown = selectedPlatformForModal === "unreal" ? [
                      { label: "Linking", val: 35, color: "text-blue-500" },
                      { label: "UBT", val: 25, color: "text-orange-500" },
                      { label: "Shader", val: 20, color: "text-emerald-500" },
                      { label: "Cook", val: 20, color: "text-indigo-500" },
                    ] : [
                      { label: "Compilation", val: 50, color: "text-indigo-500" },
                      { label: "Resource", val: 30, color: "text-teal-500" },
                      { label: "Linking", val: 20, color: "text-rose-500" },
                    ];
                    return breakdown.map(item => (
                      <span key={item.label} className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`}></span>
                        {item.label}
                      </span>
                    ));
                  })()}
                </div>
              </div>
'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched Bar Chart.")
else:
    print("Target not found.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
