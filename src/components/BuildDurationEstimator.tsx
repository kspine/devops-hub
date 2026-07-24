import { useState } from "react";
import { Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "motion/react";

export default function BuildDurationEstimator() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  // Rolling 10 successful builds durations in seconds
  const historicalBuilds = [
    { buildNum: "#12083", duration: 610, date: "10m ago" },
    { buildNum: "#12084", duration: 595, date: "9m ago" },
    { buildNum: "#12085", duration: 615, date: "8m ago" },
    { buildNum: "#12086", duration: 620, date: "7m ago" },
    { buildNum: "#12087", duration: 605, date: "6m ago" },
    { buildNum: "#12088", duration: 590, date: "5m ago" },
    { buildNum: "#12089", duration: 612, date: "4m ago" },
    { buildNum: "#12090", duration: 600, date: "3m ago" },
    { buildNum: "#12091", duration: 618, date: "2m ago" },
    { buildNum: "#12092", duration: 605, date: "1m ago" },
  ];

  // Current build duration in seconds
  const [currentDuration, setCurrentDuration] = useState(765); // 12m 45s (initially slow / an anomaly!)
  const [showHistory, setShowHistory] = useState(false);

  // Calculate rolling average
  const totalHistorical = historicalBuilds.reduce((sum, b) => sum + b.duration, 0);
  const rollingAverage = Math.round(totalHistorical / historicalBuilds.length);

  // Anomaly calculation: if current build is > 20% above rolling average
  const percentDeviation = Math.round(((currentDuration - rollingAverage) / rollingAverage) * 100);
  const isAnomaly = percentDeviation >= 20;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3 shadow-sm relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-2">
          <Clock className={`h-4 w-4 ${isAnomaly ? "text-amber-500 animate-pulse" : "text-emerald-400"}`} />
          {isZh ? "预计构建耗时" : "Estimated Build Duration"}
        </h3>
        
        {isAnomaly && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className={`text-2xl font-mono font-bold transition-colors ${isAnomaly ? "text-amber-400" : "text-gray-100"}`}>
            {formatDuration(currentDuration)}
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            {isZh ? `滚动均值 (10次): ${formatDuration(rollingAverage)}` : `Rolling Avg (Last 10): ${formatDuration(rollingAverage)}`}
          </p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-[9px] px-1.5 py-1 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200 font-mono flex items-center gap-1 cursor-pointer"
        >
          <span>{isZh ? "历史" : "Hist"}</span>
          {showHistory ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
        </button>
      </div>

      {/* Anomaly Indicator Panel */}
      <AnimatePresence>
        {isAnomaly && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-amber-300 leading-normal"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <span className="font-bold block font-mono">
                {isZh ? `⚠️ 检测到耗时异常 (+${percentDeviation}%)` : `⚠️ TIME ANOMALY (+${percentDeviation}%)`}
              </span>
              <span>
                {isZh
                  ? "当前耗时明显高出滚动基线，原因通常是：新资源引入未压缩、着色器重构或磁盘读写瓶颈。"
                  : "Build exceeds rolling baseline. Likely cause: major uncompressed asset commit, shader refactoring, or IO bottlenecks."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Controller for testing anomalies */}
      <div className="pt-2 border-t border-gray-900/60 flex flex-col gap-1.5 text-[9px] text-gray-500">
        <span className="font-mono">{isZh ? "模拟调整当前耗时:" : "Adjust build duration (Demo):"}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentDuration(605)}
            className={`flex-1 py-1 rounded border transition-all cursor-pointer ${
              currentDuration === 605 
                ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-semibold" 
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
            }`}
          >
            {isZh ? "正常" : "Normal"}
          </button>
          <button
            onClick={() => setCurrentDuration(825)}
            className={`flex-1 py-1 rounded border transition-all cursor-pointer ${
              currentDuration === 825 
                ? "bg-amber-600/20 border-amber-500/50 text-amber-400 font-semibold" 
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
            }`}
          >
            {isZh ? "偏慢 (+35%)" : "Slow (+35%)"}
          </button>
          <button
            onClick={() => setCurrentDuration(1150)}
            className={`flex-1 py-1 rounded border transition-all cursor-pointer ${
              currentDuration === 1150 
                ? "bg-rose-600/20 border-rose-500/50 text-rose-400 font-bold" 
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300"
            }`}
          >
            {isZh ? "极慢 (+88%)" : "Very Slow (+88%)"}
          </button>
        </div>
      </div>

      {/* Expandable History Table */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-gray-900 space-y-1.5 overflow-hidden"
          >
            <div className="text-[9px] font-bold text-gray-400 font-mono uppercase tracking-wider">
              {isZh ? "滚动 10 次成功构建记录" : "Rolling 10 Success History"}
            </div>
            <div className="grid grid-cols-1 gap-1 text-[9px] font-mono text-gray-500">
              {historicalBuilds.map((b) => (
                <div key={b.buildNum} className="flex justify-between border-b border-gray-900/30 pb-0.5">
                  <span className="text-gray-400">{b.buildNum} ({b.date})</span>
                  <span className="text-emerald-400 font-semibold">{formatDuration(b.duration)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
