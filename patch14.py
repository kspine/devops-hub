import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  Copy,
  Check,
  ChevronDown
} from "lucide-react";'''
replacement = '''  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched ChevronUp.")
else:
    print("ChevronUp target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
