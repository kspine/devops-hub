import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = '''  const [chartMode, setChartMode] = useState<"engine" | "platform">("engine");'''
replacement1 = '''  const [chartMode, setChartMode] = useState<"engine" | "platform">("engine");
  const [alertThreshold, setAlertThreshold] = useState(85);
  const [currentAvgSuccess, setCurrentAvgSuccess] = useState(94.6);'''

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Patched state variables.")

target2 = '''  const fetchSimulatedHealth = () => {
    setIsHealthFetching(true);
    setTimeout(() => {
      setIsHealthFetching(false);
      const nextOverall = Math.random() > 0.35 ? "Operational" : "Degraded";
      setHealthStatus(nextOverall);
      setLastHealthCheck(new Date().toLocaleTimeString());
      
      if (nextOverall === "Operational") {'''
replacement2 = '''  const fetchSimulatedHealth = () => {
    setIsHealthFetching(true);
    setTimeout(() => {
      setIsHealthFetching(false);
      const nextOverall = Math.random() > 0.35 ? "Operational" : "Degraded";
      setHealthStatus(nextOverall);
      setLastHealthCheck(new Date().toLocaleTimeString());
      
      const nextAvg = nextOverall === "Operational" ? (90 + Math.random() * 8) : (75 + Math.random() * 10);
      setCurrentAvgSuccess(nextAvg);
      
      if (nextAvg < alertThreshold) {
        addToast(isZh ? `警告: 平均成功率 (${nextAvg.toFixed(1)}%) 低于设定的阈值 ${alertThreshold}%` : `Alert: Avg success rate (${nextAvg.toFixed(1)}%) dropped below threshold ${alertThreshold}%!`, "warning");
      }

      if (nextOverall === "Operational") {'''

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Patched fetchSimulatedHealth.")

target3 = '''              <button
                id="refresh-health-btn"
                onClick={fetchSimulatedHealth}
                disabled={isHealthFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50 transition-all font-sans"
              >
                <RefreshCw className={`h-3 w-3 ${isHealthFetching ? "animate-spin" : ""}`} />
                <span>{isHealthFetching ? (isZh ? "获取中..." : "Polling...") : (isZh ? "即时获取" : "Poll Status")}</span>
              </button>'''
replacement3 = '''              <button
                id="refresh-health-btn"
                onClick={fetchSimulatedHealth}
                disabled={isHealthFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50 transition-all font-sans"
              >
                <RefreshCw className={`h-3 w-3 ${isHealthFetching ? "animate-spin" : ""}`} />
                <span>{isHealthFetching ? (isZh ? "获取中..." : "Polling...") : (isZh ? "即时获取" : "Poll Status")}</span>
              </button>
              
              <button
                onClick={() => {
                  addToast(isZh ? "正在批量重启所有降级节点..." : "Restarting all degraded agents...", "info");
                  fetchSimulatedHealth();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-[11px] font-semibold cursor-pointer transition-all font-sans ml-1"
              >
                <RefreshCw className="h-3 w-3 text-red-400" />
                <span>{isZh ? "批量重启失败节点" : "Retry All Failed Builds"}</span>
              </button>'''

if target3 in content:
    content = content.replace(target3, replacement3)
    print("Patched Retry All Failed Builds.")

target4 = '''              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/30">
                {isZh ? "平均成功率: 94.6%" : "Avg Success: 94.6%"}
              </span>
            </div>'''
replacement4 = '''              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500">{isZh ? "告警阈值:" : "Alert Threshold:"}</span>
                  <input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-12 bg-gray-900 border border-gray-800 rounded px-1 py-0.5 text-[10px] text-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-gray-500">%</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${currentAvgSuccess < alertThreshold ? 'text-amber-400 bg-amber-950/30 border-amber-900/30' : 'text-emerald-400 bg-emerald-950/30 border-emerald-900/30'}`}>
                  {isZh ? `平均成功率: ${currentAvgSuccess.toFixed(1)}%` : `Avg Success: ${currentAvgSuccess.toFixed(1)}%`}
                </span>
              </div>
            </div>'''

if target4 in content:
    content = content.replace(target4, replacement4)
    print("Patched Alert Threshold.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
