import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  Terminal
} from "lucide-react";'''
replacement = '''  Terminal,
  Copy,
  Check,
  ChevronDown
} from "lucide-react";'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched lucide imports.")
else:
    print("Lucide import target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
