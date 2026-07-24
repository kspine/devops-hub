import sys

with open('src/components/PipelineBuilder.tsx', 'r') as f:
    content = f.read()

target = '        {/* Left Control Column */}\n        <div className="lg:col-span-4 space-y-6">'

replacement = '''        {/* Left Control Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tab Switcher */}
          <div className="flex border border-gray-800 bg-gray-950 p-1 rounded-xl w-full">
            <button
              onClick={() => setLeftTab("builder")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all text-center cursor-pointer ${
                leftTab === "builder"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {isZh ? "构建配置" : "Builder"}
            </button>
            <button
              onClick={() => setLeftTab("schedules")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all text-center cursor-pointer ${
                leftTab === "schedules"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {isZh ? "计划任务" : "Schedules"}
            </button>
            <button
              onClick={() => setLeftTab("notifications")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all text-center cursor-pointer ${
                leftTab === "notifications"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {isZh ? "通知" : "Notifications"}
            </button>
          </div>

          <div className={leftTab === "builder" ? "space-y-6 block" : "hidden"}>'''

if target in content:
    new_content = content.replace(target, replacement)
    with open('src/components/PipelineBuilder.tsx', 'w') as f:
        f.write(new_content)
    print("Patched successfully!")
else:
    print("Target not found!")
