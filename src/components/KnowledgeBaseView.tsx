import React, { useState, useEffect } from "react";
import { BookOpen, Search, Filter, Plus, Trash2, Check, Copy, Code, HelpCircle, Cpu, Shield, Zap, Sparkles, Terminal } from "lucide-react";
import { QUICK_ISSUES, LocalizedQuickIssue } from "../data";
import { WIKI_KNOWLEDGE_BASE, wikiEntryToIssue } from "../wikiData";
import { BuildPlatform } from "../types";
import { useWorkspace } from "../WorkspaceContext";

interface KnowledgeBaseViewProps {
  isZh: boolean;
  customIssues: LocalizedQuickIssue[];
  setCustomIssues: React.Dispatch<React.SetStateAction<LocalizedQuickIssue[]>>;
  onSelectIssue: (issueId: string) => void;
  onLoadSample: (sample: string, platform: BuildPlatform) => void;
  showToast: (msg: string) => void;
}

export default function KnowledgeBaseView({
  isZh,
  customIssues,
  setCustomIssues,
  onSelectIssue,
  onLoadSample,
  showToast,
}: KnowledgeBaseViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { activeWorkspace } = useWorkspace();
  const engine = activeWorkspace?.projectType || 'web';
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  
  // Rules Matcher Sandbox state
  const [sandboxLog, setSandboxLog] = useState("");
  const [matchedRule, setMatchedRule] = useState<LocalizedQuickIssue | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  
  // Editor state for adding a custom rule
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleZh, setNewTitleZh] = useState("");
  const [newPlatform, setNewPlatform] = useState<string>("android");
  const [newEngine, setNewEngine] = useState<"unity" | "unreal" | "both">("both");
  const [newSummaryEn, setNewSummaryEn] = useState("");
  const [newSummaryZh, setNewSummaryZh] = useState("");
  const [newSampleError, setNewSampleError] = useState("");
  const [newSolutionEn, setNewSolutionEn] = useState("");
  const [newSolutionZh, setNewSolutionZh] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // All rules: static (pre-defined) + custom
  const allIssues = [...QUICK_ISSUES, ...WIKI_KNOWLEDGE_BASE.map(wikiEntryToIssue), ...customIssues];

  // Helper to determine severity / impact based on issue properties
  const getSeverityKey = (issue: LocalizedQuickIssue): "blocker" | "warning" | "optimization" => {
    if (issue.platform === "ios" || issue.platform === "il2cpp" || issue.id.includes("signing") || issue.id.includes("exit")) {
      return "blocker";
    }
    if (issue.platform === "android" || issue.id.includes("shader") || issue.id.includes("ref")) {
      return "warning";
    }
    return "optimization";
  };

  const getIssueSeverity = (issue: LocalizedQuickIssue) => {
    const key = getSeverityKey(issue);
    if (key === "blocker") return { label: isZh ? "严重 (Blocker)" : "Blocker", color: "text-red-400 border-red-950 bg-red-950/20" };
    if (key === "warning") return { label: isZh ? "警告 (Warning)" : "Warning", color: "text-amber-400 border-amber-950 bg-amber-950/20" };
    return { label: isZh ? "建议 (Info)" : "Optimization", color: "text-sky-400 border-sky-950 bg-sky-950/20" };
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(isZh ? "代码片段已成功复制！" : "Remediation code snippet copied!");
  };

  // Perform a fast local regex/substring scanning on sandboxLog
  const runRulesMatcher = () => {
    if (!sandboxLog.trim()) {
      showToast(isZh ? "请输入要匹配的日志文本" : "Please enter log text to test match");
      return;
    }

    let bestMatch: LocalizedQuickIssue | null = null;
    let highestScore = 0;

    allIssues.forEach((issue) => {
      let score = 0;
      
      // 1. Direct sampleError match
      const sampleLines = issue.sampleError.split("\n");
      sampleLines.forEach((line) => {
        const cleanLine = line.trim();
        if (cleanLine.length > 10 && sandboxLog.toLowerCase().includes(cleanLine.toLowerCase())) {
          score += 40;
        }
      });

      // 2. Keyword matching
      const keywords = issue.id.split("-");
      keywords.forEach((kw) => {
        if (sandboxLog.toLowerCase().includes(kw.toLowerCase())) {
          score += 15;
        }
      });

      // 3. Platform keyword matching
      if (issue.platform !== "all" && sandboxLog.toLowerCase().includes(issue.platform.toLowerCase())) {
        score += 5;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = issue;
      }
    });

    if (highestScore > 10) {
      setMatchedRule(bestMatch);
      // Bound the match score between 10% and 100%
      setMatchScore(Math.min(highestScore, 100));
      showToast(isZh ? "成功检索到匹配的知识库规则！" : "Successfully matched expert packaging rule!");
    } else {
      setMatchedRule(null);
      setMatchScore(0);
      showToast(isZh ? "未找到高置信度的匹配规则。" : "No high confidence matching rule found.");
    }
  };

  const [chatQuery, setChatQuery] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatSources, setChatSources] = useState<string[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Add custom rule and save to localStorage
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: LocalizedQuickIssue = {
      id: `custom-issue-${Date.now()}`,
      platform: newPlatform as any,
      sampleError: newSampleError,
      titleEn: newTitleEn,
      titleZh: newTitleZh,
      summaryEn: newSummaryEn,
      summaryZh: newSummaryZh,
      solutionEn: newSolutionEn,
      solutionZh: newSolutionZh,
    };
    setCustomIssues([...customIssues, newRule]);
    setShowAddForm(false);
    showToast(isZh ? "规则已录入本地库" : "Custom rule added to local KB");
  };

  const handleDeleteCustomRule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomIssues(customIssues.filter(i => i.id !== id));
    showToast(isZh ? "规则已删除" : "Rule deleted");
  };

  const handleChat = async () => {
    if (!chatQuery.trim()) return;
    setIsChatLoading(true);
    setChatAnswer("");
    try {
      const res = await fetch("/api/wiki/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatQuery, language: isZh ? "zh" : "en", customIssues })
      });
      const data = await res.json();
      setChatAnswer(data.answer);
      setChatSources(data.sources || []);
    } catch (e) {
      showToast(isZh ? "查询失败" : "Query failed");
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filters logic
  const filteredIssues = allIssues.filter((issue) => {
    // Platform filter
    if (platformFilter !== "all" && issue.platform !== platformFilter && issue.platform !== "all") {
      return false;
    }

    // Severity filter
    if (severityFilter !== "all" && getSeverityKey(issue) !== severityFilter) {
      return false;
    }

    // Engine filter
    if (issue.engine && issue.engine !== "both" && issue.engine !== engine) {
      return false;
    }

    // Search query mapping (En & Zh title & summary)
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      issue.titleEn.toLowerCase().includes(q) ||
      issue.titleZh.toLowerCase().includes(q) ||
      issue.summaryEn.toLowerCase().includes(q) ||
      issue.summaryZh.toLowerCase().includes(q);

    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Upper Dashboard: Stats Grid & Pattern Matcher Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Bento: Stats Overview */}
        <div className="lg:col-span-4 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              {isZh ? "知识库概览 (Knowledge Stats)" : "Knowledge Overview"}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-lg">
              <div className="text-2xl font-bold text-white">{allIssues.length}</div>
              <div className="text-[10px] text-gray-400">{isZh ? "总规则条目" : "Total Rules"}</div>
            </div>
            <div className="bg-gray-950/40 border border-gray-850 p-3 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{allIssues.filter(i => getSeverityKey(i) === "blocker").length}</div>
              <div className="text-[10px] text-gray-400">{isZh ? "阻塞性问题" : "Blockers"}</div>
            </div>
          </div>
        </div>

        {/* Right Bento: Sandbox Pattern Matcher */}
        <div className="lg:col-span-8 bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                {isZh ? "知识匹配沙盒 (Offline Log Matcher)" : "Offline Log Matcher Sandbox"}
              </h4>
              <p className="text-[11px] text-gray-400">
                {isZh ? "贴入打包报错日志进行快速本地指纹匹配，秒级比对匹配关联的知识库条目。" : "Paste your console error to execute quick local fingerprint scanning against matching rules."}
              </p>
            </div>
            
            <button
              onClick={() => {
                setSandboxLog(
                  `Execution failed for task ':launcher:mergeProjectDexDebug'.\nCannot fit requested classes in a single dex file (# methods: 78241 > 65536)`
                );
              }}
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer underline"
            >
              {isZh ? "加载测试日志" : "Load Test Log"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Log Input Area */}
            <div className="md:col-span-7 space-y-2">
              <textarea
                rows={4}
                value={sandboxLog}
                onChange={(e) => setSandboxLog(e.target.value)}
                placeholder={isZh ? "在此粘贴需要进行指纹识别的本地日志或编译器控制台崩溃堆栈..." : "Paste local log strings or compiler crash trace here..."}
                className="w-full h-32 bg-gray-950/40 border border-gray-850 rounded-lg p-3 font-mono text-[11px] text-gray-300 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={runRulesMatcher}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/10 transition-all cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isZh ? "立即进行特征匹配" : "Run Fingerprint Match"}</span>
              </button>
            </div>

            {/* Matching Result Preview */}
            <div className="md:col-span-5 bg-gray-900/40 border border-gray-800 rounded-lg p-3.5 flex flex-col justify-between h-32 md:h-full">
              {matchedRule ? (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 font-mono">
                      {isZh ? "匹配度" : "Confidence"}: {matchScore}%
                    </span>
                    <span className="text-[9px] uppercase font-mono text-gray-500">Matched Rule</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-200 truncate">
                      {isZh ? matchedRule.titleZh : matchedRule.titleEn}
                    </h5>
                    <p className="text-[11px] text-gray-400 line-clamp-2">
                      {isZh ? matchedRule.summaryZh : matchedRule.summaryEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-900/60">
                    <button
                      onClick={() => onLoadSample(matchedRule!.sampleError, matchedRule!.platform as any)}
                      className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900 text-indigo-300 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {isZh ? "加载报错样本" : "Load Sample"}
                    </button>
                    <button
                      onClick={() => onSelectIssue(matchedRule!.id)}
                      className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900 text-emerald-300 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {isZh ? "查看完整对策" : "View Resolution"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-3 text-gray-500 font-sans space-y-2">
                  <HelpCircle className="h-7 w-7 text-gray-700 animate-pulse" />
                  <div className="text-[11px]">
                    {isZh ? "无匹配项" : "No Match Active"}
                  </div>
                  <p className="text-[10px] text-gray-600 max-w-xs">
                    {isZh ? "贴入日志并点击匹配，规则引擎会扫描并提取最接近的解决方案。" : "Paste error text and match to load associated diagnostic guidelines instantly."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Wiki AI Chat Section */}
      <div className="bg-gray-950 border border-gray-900 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          {isZh ? "Wiki 知识库 AI 问答" : "Wiki Knowledge Base AI Chat"}
        </h4>
        <div className="flex gap-2">
          <input
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder={isZh ? "输入问题，让 AI 根据知识库为你解答..." : "Ask the AI based on the wiki..."}
            className="flex-1 bg-gray-950/40 border border-gray-850 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleChat}
            disabled={isChatLoading}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            {isChatLoading ? (isZh ? "思考中..." : "Thinking...") : (isZh ? "提问" : "Ask")}
          </button>
        </div>
        {chatAnswer && (
          <div className="space-y-2">
            <div className="p-3 bg-gray-900/40 border border-gray-800 rounded-lg text-xs text-gray-300 font-sans leading-relaxed">
              {chatAnswer}
            </div>
            {chatSources.length > 0 && (
              <div className="text-[10px] text-gray-500 font-mono">
                {isZh ? "参考来源: " : "Sources: "}{chatSources.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Browse Section */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-5">
        
        {/* Controls Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-4">
          <div className="flex flex-1 items-center gap-3 bg-gray-900/60 border border-gray-850 px-3 py-1.5 rounded-lg max-w-md">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isZh ? "搜索诊断规则、关键字、报错代码..." : "Search diagnostic rules, keywords..."}
              className="bg-transparent border-none text-xs text-gray-200 placeholder:text-gray-650 focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Platform */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-gray-900 border border-gray-850 text-xs text-gray-300 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">{isZh ? "所有打包平台" : "All Platforms"}</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="webgl">WebGL</option>
              <option value="standalone">Standalone</option>
              <option value="unreal">Unreal Engine</option>
            </select>

            {/* Filter by Severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-gray-900 border border-gray-850 text-xs text-gray-300 rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">{isZh ? "所有严重程度" : "All Severities"}</option>
              <option value="blocker">{isZh ? "严重 (Blocker)" : "Blocker"}</option>
              <option value="warning">{isZh ? "警告 (Warning)" : "Warning"}</option>
              <option value="optimization">{isZh ? "建议 (Info)" : "Info"}</option>
            </select>

            {/* Add Custom Rule button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-indigo-600/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isZh ? "录入专有规则" : "Add Custom Rule"}</span>
            </button>
          </div>
        </div>

        {/* Add custom rule form popup modal */}
        {showAddForm && (
          <form onSubmit={handleAddRule} className="bg-gray-900/40 border border-indigo-950 p-5 rounded-xl space-y-4 animate-in slide-in-from-top-4 duration-350">
            <div className="flex items-center justify-between border-b border-indigo-950 pb-2.5">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                {isZh ? "知识录入系统 (DevOps Studio Custom Curation)" : "Knowledge Curation Portal"}
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[10px] text-gray-500 hover:text-gray-300"
              >
                {isZh ? "取消" : "Cancel"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "中文规则标题 (必填):" : "Chinese Rule Title (Required):"}</label>
                <input
                  type="text"
                  required
                  value={newTitleZh}
                  onChange={(e) => setNewTitleZh(e.target.value)}
                  placeholder="例如：IL2CPP 签名过期报错"
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "英文规则标题 (必填):" : "English Rule Title (Required):"}</label>
                <input
                  type="text"
                  required
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. IL2CPP code signing expired"
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "发布平台:" : "Target Platform:"}</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="webgl">WebGL</option>
                  <option value="standalone">Standalone</option>
                  <option value="il2cpp">IL2CPP Target</option>
                  <option value="unreal">Unreal General</option>
                  <option value="all">Cross-platform</option>
                </select>
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "适用技术栈:" : "Target Stack:"}</label>
                <select
                  value={newEngine}
                  onChange={(e) => setNewEngine(e.target.value as any)}
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="both">All Engines / General</option>
                  <option value="unity">Unity Player</option>
                  <option value="unreal">Unreal Engine</option>
                </select>
              </div>

              <div className="md:col-span-12 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "中文简要概述 (必填):" : "Chinese Short Summary (Required):"}</label>
                <textarea
                  required
                  rows={2}
                  value={newSummaryZh}
                  onChange={(e) => setNewSummaryZh(e.target.value)}
                  placeholder="用 1-2 句话阐明此异常的核心成因..."
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-12 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "错误控制台日志样本 (用于特征指纹搜索):" : "Sample Error Log (Used for local fingerprint index scanning):"}</label>
                <textarea
                  rows={2}
                  value={newSampleError}
                  onChange={(e) => setNewSampleError(e.target.value)}
                  placeholder="输入部分编译器报错或崩溃的核心特征行..."
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-12 space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">{isZh ? "中文对策与解决方案步骤 (必填):" : "Chinese Steps & Solution Remediation (Required):"}</label>
                <textarea
                  required
                  rows={4}
                  value={newSolutionZh}
                  onChange={(e) => setNewSolutionZh(e.target.value)}
                  placeholder="列出具体的命令行、引擎路径配置或代码补丁..."
                  className="w-full text-xs bg-gray-950/40 border border-gray-850 rounded p-2 font-mono text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full"
            >
              <Check className="h-4 w-4" />
              <span>{isZh ? "将新条目同步编排入本地知识库" : "Inject Rule into Knowledge Database"}</span>
            </button>
          </form>
        )}

        {/* Rules Grid Display */}
        {filteredIssues.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <HelpCircle className="h-10 w-10 text-gray-750 mx-auto mb-2" />
            <p className="text-xs">{isZh ? "没有检索到与当前筛选条件匹配的故障对策条目。" : "No expert rules match your search queries."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIssues.map((issue) => {
              const severity = getIssueSeverity(issue);
              const isCustom = issue.id.startsWith("custom-issue-");
              const title = isZh ? issue.titleZh : issue.titleEn;
              const summary = isZh ? issue.summaryZh : issue.summaryEn;
              const solution = isZh ? issue.solutionZh : issue.solutionEn;

              return (
                <div 
                  key={issue.id} 
                  className="bg-gray-900/30 hover:bg-gray-900/50 border border-gray-850/80 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:border-gray-800"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-gray-950 border border-gray-800 px-2 py-0.5 rounded text-indigo-400">
                            {issue.platform.toUpperCase()}
                          </span>
                          <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase font-mono ${severity.color}`}>
                            {severity.label}
                          </span>
                          {isCustom && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/30 px-1.5 py-0.5 rounded font-mono">
                              Custom Rule
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-200 mt-1">{title}</h4>
                      </div>

                      {isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomRule(issue.id, e)}
                          className="p-1.5 bg-gray-950 hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded-lg border border-gray-900 hover:border-red-900/30 transition-all cursor-pointer"
                          title={isZh ? "删除此自定义项" : "Delete custom item"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">{summary}</p>

                    {/* Code solutions or steps */}
                    <div className="p-3 bg-gray-950/50 border border-gray-950 rounded-lg text-[11px] font-mono text-gray-300 space-y-2 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                      <span className="text-[9px] text-gray-500 uppercase font-bold block border-b border-gray-950 pb-1 flex items-center gap-1">
                        <Code className="h-3.5 w-3.5 text-indigo-500" />
                        {isZh ? "执行步骤与修复对策" : "Standard Remediation Details"}
                      </span>
                      {solution}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-900/60 justify-end">
                    <button
                      onClick={() => handleCopyCode(solution, issue.id)}
                      className="px-3 py-1.5 bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white rounded-lg border border-gray-850 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedId === issue.id ? (isZh ? "已复制" : "Copied!") : (isZh ? "复制对策" : "Copy Steps")}</span>
                    </button>
                    <button
                      onClick={() => onLoadSample(issue.sampleError, issue.platform as any)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{isZh ? "注入诊断台" : "Load Sample Logs"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
