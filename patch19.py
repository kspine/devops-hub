import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  const exportPlatformLogs = () => {
    if (!selectedPlatformForModal) return;
    const logs = platformLogs[selectedPlatformForModal].filter(log => {'''
replacement = '''  const exportPlatformLogs = () => {
    if (!selectedPlatformForModal) return;
    const logs = platformLogs[selectedPlatformForModal].map((log, idx) => ({ ...log, originalIdx: idx })).filter(log => {
      const logKey = `${selectedPlatformForModal}-${log.originalIdx}`;
      if (dismissedLogs.has(logKey)) return false;'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched export logs filter.")
else:
    print("Export logs target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
