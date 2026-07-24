import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  const [selectedPlatformForModal, setSelectedPlatformForModal] = useState<"android" | "ios" | "webgl" | "unreal" | null>(null);
  const [logLevelFilter, setLogLevelFilter] = useState<"all" | "error" | "warning">("all");
  const [logCategoryFilter, setLogCategoryFilter] = useState<"all" | "UBT" | "Cook" | "ShaderCompiler" | "Linking">("all");
  const [logSearch, setLogSearch] = useState("");'''
replacement = '''  const [selectedPlatformForModal, setSelectedPlatformForModal] = useState<"android" | "ios" | "webgl" | "unreal" | null>(null);
  const [logLevelFilter, setLogLevelFilter] = useState<"all" | "error" | "warning">("all");
  const [logCategoryFilter, setLogCategoryFilter] = useState<"all" | "UBT" | "Cook" | "ShaderCompiler" | "Linking">("all");
  const [logSearch, setLogSearch] = useState("");
  const [copiedLogId, setCopiedLogId] = useState<number | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched states.")
else:
    print("State target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
