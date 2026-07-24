import sys

with open('src/components/PipelineBuilder.tsx', 'r') as f:
    content = f.read()

target = '''                      <button
                        type="button"
                        onClick={() => setWebhookType("discord")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "discord"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Discord
                      </button>
                    </div>'''

replacement = '''                      <button
                        type="button"
                        onClick={() => setWebhookType("discord")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "discord"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Discord
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebhookType("teams")}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          webhookType === "teams"
                            ? "bg-indigo-600 text-white font-bold"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Teams
                      </button>
                    </div>'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/PipelineBuilder.tsx', 'w') as f:
        f.write(content)
    print("Patched Teams button successfully!")
else:
    print("Target not found!")
