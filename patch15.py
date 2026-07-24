import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  const handleCopyLog = (text: string, idx: number, e: React.MouseEvent) => {'''
replacement = '''  const handleCopyLog = (text: string, idx: number, e: any) => {'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched React.MouseEvent.")
else:
    print("React.MouseEvent target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
