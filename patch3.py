import sys

with open('src/components/PipelineBuilder.tsx', 'r') as f:
    content = f.read()

# Wrap Schedules
target1 = '          {/* Pipeline Schedules list & form */}'
replacement1 = '''          </div>
          <div className={leftTab === "schedules" ? "space-y-6 block" : "hidden"}>
          {/* Pipeline Schedules list & form */}'''

# Wrap Notifications
target2 = '          {/* Webhook Notifications Panel */}'
replacement2 = '''          </div>
          <div className={leftTab === "notifications" ? "space-y-6 block" : "hidden"}>
          {/* Webhook Notifications Panel */}'''


if target1 in content and target2 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    with open('src/components/PipelineBuilder.tsx', 'w') as f:
        f.write(content)
    print("Patched wrappers successfully!")
else:
    print("Targets not found!")
