import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''  return (
    <div className={`min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans transition-colors duration-150 ${theme === "light" ? "theme-light" : ""}`}>'''
replacement = '''  const exportPlatformLogs = () => {
    if (!selectedPlatformForModal) return;
    const logs = platformLogs[selectedPlatformForModal].filter(log => {
      const matchesLevel = logLevelFilter === "all" || log.type === logLevelFilter;
      const matchesSearch = log.msg.toLowerCase().includes(logSearch.toLowerCase()) || 
                            log.msgZh.toLowerCase().includes(logSearch.toLowerCase());
      const matchesCategory = projectType !== "unreal" || logCategoryFilter === "all" || log.msg.includes(`[${logCategoryFilter}]`);
      return matchesLevel && matchesSearch && matchesCategory;
    });

    const csvContent = [
      "Level,Message,LocalizedMessage,Category",
      ...logs.map(log => `"${log.type}","${log.msg.replace(/"/g, '""')}","${log.msgZh.replace(/"/g, '""')}","${log.msg.match(/\[(.*?)\]/) ? log.msg.match(/\[(.*?)\]/)![1] : 'General'}"`)
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedPlatformForModal}_logs.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(isZh ? "日志已导出" : "Logs exported successfully", "success");
  };

  const handleCopyLog = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedLogId(idx);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  return (
    <div className={`min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans transition-colors duration-150 ${theme === "light" ? "theme-light" : ""}`}>'''

if target in content:
    content = content.replace(target, replacement)
    print("Patched methods.")
else:
    print("Method target not found!")

with open('src/App.tsx', 'w') as f:
    f.write(content)
