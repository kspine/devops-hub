import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                <div className="flex justify-between mt-2 text-[9px] text-gray-400">
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
              </div>'''

replacement = '''                <div className="flex justify-between mt-2 text-[9px] text-gray-400">
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
                
                <h6 className="text-[10px] font-bold text-gray-500 uppercase mb-2 mt-4">{isZh ? "24小时错误频率" : "Error Frequency (24h)"}</h6>
                <div className="h-16 w-full -ml-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={errorFrequencyData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <ChartTooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '10px' }} 
                        itemStyle={{ color: '#f87171' }}
                        formatter={(value) => [value, isZh ? "次错误" : "Errors"]}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                      <Line type="stepAfter" dataKey="errors" stroke="#f87171" strokeWidth={2} dot={{ r: 2, fill: '#f87171' }} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched error frequency chart.")
else:
    print("Error frequency chart target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
