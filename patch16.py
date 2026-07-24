import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  const [successRateData, setSuccessRateData] = useState(['''
replacement = '''  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [dismissedLogs, setDismissedLogs] = useState<Set<string>>(new Set());
  const [aiDiagnosis, setAiDiagnosis] = useState<Record<string, any>>({});
  const [isDiagnosing, setIsDiagnosing] = useState<Record<string, boolean>>({});

  const errorFrequencyData = [
    { time: "00:00", errors: 2 },
    { time: "04:00", errors: 5 },
    { time: "08:00", errors: 12 },
    { time: "12:00", errors: 8 },
    { time: "16:00", errors: 15 },
    { time: "20:00", errors: 4 },
    { time: "24:00", errors: 7 },
  ];

  const getSeverity = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes('fatal') || lower.includes('crash') || lower.includes('aborted') || lower.includes('critical')) return 'Critical';
    if (lower.includes('failed') || lower.includes('error') || lower.includes('mismatch')) return 'Major';
    return 'Minor';
  };

  const handleDiagnose = async (platform: string, logMsg: string, logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDiagnosing(prev => ({ ...prev, [logId]: true }));
    try {
      const res = await fetch("/api/ai-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorLog: logMsg, platform, language })
      });
      const data = await res.json();
      setAiDiagnosis(prev => ({ ...prev, [logId]: data }));
    } catch (error) {
      console.error(error);
    }
    setIsDiagnosing(prev => ({ ...prev, [logId]: false }));
  };

  const [successRateData, setSuccessRateData] = useState(['''

if target in content:
    content = content.replace(target, replacement)
    print("Patched states and helpers.")
else:
    print("State target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
