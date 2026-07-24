import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Cpu, 
  Clock, 
  Activity, 
  HelpCircle, 
  Sparkles, 
  X, 
  Info,
  Layers,
  ChevronRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip,
  BarChart,
  Bar
} from "recharts";
import { useLanguage } from "../LanguageContext";

export default function BuildCostEstimator() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cost Config parameters
  const [buildsPerDay, setBuildsPerDay] = useState(15);
  const [avgDuration, setAvgDuration] = useState(25);
  const [activeOS, setActiveOS] = useState({
    linux: true,   // WebGL & Android
    windows: true, // Standalone/PC & Unreal
    macos: true,   // iOS
  });
  
  const [machineSize, setMachineSize] = useState<"standard" | "highcpu" | "gpu">("standard");

  // Multipliers & base rates (per minute in USD)
  const baseRates = {
    linux: 0.008,   // Standard Linux container
    windows: 0.046, // Windows build agent
    macos: 0.08,    // macOS runner (highly specialized for iOS/Mac signing)
  };

  const machineMultipliers = {
    standard: 1.0,
    highcpu: 1.8,
    gpu: 3.5
  };

  // Distribution profiles when platforms are active
  // If all are active, we assume builds are distributed: Linux (45%), Windows (35%), macOS (20%)
  // We normalize active profiles dynamically
  const getNormalizedDistribution = () => {
    const weights: Record<string, number> = { linux: 45, windows: 35, macos: 20 };
    let totalWeight = 0;
    
    // Sum active weights
    Object.keys(activeOS).forEach((key) => {
      if (activeOS[key as keyof typeof activeOS]) {
        totalWeight += weights[key];
      }
    });

    if (totalWeight === 0) return { linux: 0, windows: 0, macos: 0 };

    return {
      linux: activeOS.linux ? (weights.linux / totalWeight) : 0,
      windows: activeOS.windows ? (weights.windows / totalWeight) : 0,
      macos: activeOS.macos ? (weights.macos / totalWeight) : 0,
    };
  };

  // Calculate totals
  const dist = getNormalizedDistribution();
  const multiplier = machineMultipliers[machineSize];
  
  const totalBuildsPerMonth = buildsPerDay * 30;
  const totalMinutesPerMonth = totalBuildsPerMonth * avgDuration;

  // OS Individual Minutes
  const minsLinux = totalMinutesPerMonth * dist.linux;
  const minsWindows = totalMinutesPerMonth * dist.windows;
  const minsMacos = totalMinutesPerMonth * dist.macos;

  // Costs
  const costLinux = minsLinux * baseRates.linux * multiplier;
  const costWindows = minsWindows * baseRates.windows * multiplier;
  const costMacos = minsMacos * baseRates.macos * multiplier;
  const totalMonthlySpend = costLinux + costWindows + costMacos;
  const avgCostPerBuild = totalBuildsPerMonth > 0 ? (totalMonthlySpend / totalBuildsPerMonth) : 0;

  // Recharts Data for OS distribution
  const chartDataOS = [
    { name: "Linux (Android/WebGL)", value: parseFloat(costLinux.toFixed(2)), color: "#6366f1" },
    { name: "Windows (Unreal/Standalone)", value: parseFloat(costWindows.toFixed(2)), color: "#3b82f6" },
    { name: "macOS (iOS Native)", value: parseFloat(costMacos.toFixed(2)), color: "#a855f7" },
  ].filter(item => item.value > 0);

  // Generate cost scaling curve data (builds per day vs cost)
  const scalingData = [1, 5, 10, 15, 25, 50, 75, 100].map((runs) => {
    const monthlyRuns = runs * 30;
    const monthlyMins = monthlyRuns * avgDuration;
    const lCost = monthlyMins * dist.linux * baseRates.linux * multiplier;
    const wCost = monthlyMins * dist.windows * baseRates.windows * multiplier;
    const mCost = monthlyMins * dist.macos * baseRates.macos * multiplier;
    return {
      runs: runs,
      [isZh ? "月度预估费用 ($)" : "Monthly Cost ($)"]: parseFloat((lCost + wCost + mCost).toFixed(2))
    };
  });

  return (
    <>
      {/* Mini dashboard Card component in the grid */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-sm hover:border-gray-700 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              {isZh ? "月度构建云资源消耗估算" : "Monthly Runner Cost Est."}
            </h3>
            <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
              {machineSize.toUpperCase()} VM
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-mono font-bold text-gray-100">
              ${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-gray-500">/ {isZh ? "月" : "mo"}</span>
          </div>

          <p className="text-[10px] text-gray-500 font-sans mt-1">
            {isZh 
              ? `基于每日 ${buildsPerDay} 次构建, 单次均长 ${avgDuration} 分钟计算` 
              : `Est. based on ${buildsPerDay} builds/day @ ${avgDuration} mins`}
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 flex items-center justify-between w-full px-2.5 py-1.5 bg-gray-900 hover:bg-gray-850 text-indigo-400 hover:text-indigo-300 border border-gray-800 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer"
        >
          <span>{isZh ? "打开成本分析面板" : "OPEN COST ANALYTICS"}</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Cost Analytics Detailed Overlay Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-500">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
                      {isZh ? "CI/CD 智能资源成本精算面板" : "CI/CD Cloud Runner Cost Analytics"}
                      <span className="text-[10px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        FinOps Simulation
                      </span>
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      {isZh 
                        ? "动态测算不同构建频率、操作系统集群和实例规格下的云端算力消耗成本" 
                        : "Analyze and optimize monthly cloud spend based on instance specifications and scaling workloads."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Upper interactive widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Interactive Parameters */}
                  <div className="lg:col-span-5 space-y-5 bg-gray-950/40 p-5 rounded-xl border border-gray-850">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-indigo-400" />
                      {isZh ? "智能负载与参数因子配置" : "Cost Calculation Factors"}
                    </h4>

                    {/* Checkboxes for OS selection */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold block">
                        {isZh ? "激活的构建环境 (云运行环境权重)" : "Active OS Runners & Base Rates"}
                      </span>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {/* Linux */}
                        <label className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none ${activeOS.linux ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-200" : "bg-gray-900 border-gray-850 text-gray-500 hover:text-gray-400"}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={activeOS.linux}
                              onChange={(e) => setActiveOS(prev => ({ ...prev, linux: e.target.checked }))}
                              className="rounded border-gray-750 text-indigo-600 focus:ring-0 cursor-pointer h-3.5 w-3.5 accent-indigo-500"
                            />
                            <span className="text-xs font-bold font-sans">Linux Runner (WebGL / Android)</span>
                          </div>
                          <span className="text-xs font-mono font-semibold">${baseRates.linux}/min</span>
                        </label>

                        {/* Windows */}
                        <label className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none ${activeOS.windows ? "bg-blue-950/20 border-blue-500/30 text-blue-200" : "bg-gray-900 border-gray-850 text-gray-500 hover:text-gray-400"}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={activeOS.windows}
                              onChange={(e) => setActiveOS(prev => ({ ...prev, windows: e.target.checked }))}
                              className="rounded border-gray-750 text-blue-600 focus:ring-0 cursor-pointer h-3.5 w-3.5 accent-blue-500"
                            />
                            <span className="text-xs font-bold font-sans">Windows (Unreal / Standalone)</span>
                          </div>
                          <span className="text-xs font-mono font-semibold">${baseRates.windows}/min</span>
                        </label>

                        {/* macOS */}
                        <label className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none ${activeOS.macos ? "bg-purple-950/20 border-purple-500/30 text-purple-200" : "bg-gray-900 border-gray-850 text-gray-500 hover:text-gray-400"}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={activeOS.macos}
                              onChange={(e) => setActiveOS(prev => ({ ...prev, macos: e.target.checked }))}
                              className="rounded border-gray-750 text-purple-600 focus:ring-0 cursor-pointer h-3.5 w-3.5 accent-purple-500"
                            />
                            <span className="text-xs font-bold font-sans">macOS Runner (iOS Native Signing)</span>
                          </div>
                          <span className="text-xs font-mono font-semibold">${baseRates.macos}/min</span>
                        </label>
                      </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-4">
                      {/* Daily Builds Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono uppercase">
                          <span className="text-gray-400 font-semibold">{isZh ? "日均构建频率" : "Builds Per Day"}</span>
                          <span className="text-indigo-400 font-bold">{buildsPerDay} runs</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={buildsPerDay}
                          onChange={(e) => setBuildsPerDay(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      {/* Average Duration Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono uppercase">
                          <span className="text-gray-400 font-semibold">{isZh ? "单次均长" : "Average Build Duration"}</span>
                          <span className="text-indigo-400 font-bold">{avgDuration} mins</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          value={avgDuration}
                          onChange={(e) => setAvgDuration(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Machine Size Selector */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold block">
                        {isZh ? "云端实例规格规格配置" : "Runner Performance Tier (Size)"}
                      </span>
                      <div className="grid grid-cols-3 gap-2 bg-gray-900 p-1 rounded-lg border border-gray-850">
                        <button
                          onClick={() => setMachineSize("standard")}
                          className={`py-2 text-center rounded text-xs transition-all ${machineSize === "standard" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-gray-200"}`}
                        >
                          <div className="font-semibold">Standard</div>
                          <div className="text-[8px] opacity-75 font-mono">1.0x Core</div>
                        </button>
                        
                        <button
                          onClick={() => setMachineSize("highcpu")}
                          className={`py-2 text-center rounded text-xs transition-all ${machineSize === "highcpu" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-gray-200"}`}
                        >
                          <div className="font-semibold">High-CPU</div>
                          <div className="text-[8px] opacity-75 font-mono">1.8x Speed</div>
                        </button>

                        <button
                          onClick={() => setMachineSize("gpu")}
                          className={`py-2 text-center rounded text-xs transition-all ${machineSize === "gpu" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-gray-200"}`}
                        >
                          <div className="font-semibold">GPU-Rig</div>
                          <div className="text-[8px] opacity-75 font-mono">3.5x Shader</div>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Calculated Results & Charts */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    
                    {/* Key Metric cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Cost */}
                      <div className="bg-indigo-950/10 border border-indigo-900/20 p-4 rounded-xl flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">{isZh ? "月度预估总成本" : "Estimated Monthly Cost"}</span>
                          <span className="text-xl font-bold font-mono text-gray-200 block">
                            ${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Minutes */}
                      <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl flex items-center gap-3">
                        <div className="h-9 w-9 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">{isZh ? "月度计算总时长" : "Total Runner Minutes"}</span>
                          <span className="text-lg font-bold font-mono text-gray-200 block">
                            {totalMinutesPerMonth.toLocaleString()} <span className="text-[10px] text-gray-500">mins</span>
                          </span>
                        </div>
                      </div>

                      {/* Avg Cost Per Build */}
                      <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl flex items-center gap-3">
                        <div className="h-9 w-9 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">{isZh ? "单次打包均价" : "Cost Per Build"}</span>
                          <span className="text-lg font-bold font-mono text-gray-200 block">
                            ${avgCostPerBuild.toFixed(2)}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Chart panel */}
                    <div className="bg-gray-950/40 border border-gray-850 p-4 rounded-xl flex-1 flex flex-col justify-between min-h-[220px]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">
                          {isZh ? "OS 执行费用分布 (%)" : "OS Spend Distribution ($)"}
                        </span>
                        <span className="text-[9px] text-gray-500">{isZh ? "根据激活系统动态分配权重" : "Dynamic distribution of runtime expenses"}</span>
                      </div>

                      {chartDataOS.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-5 h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartDataOS}
                                  innerRadius={35}
                                  outerRadius={55}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {chartDataOS.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <ChartTooltip 
                                  contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "8px" }} 
                                  itemStyle={{ color: "#e2e8f0", fontSize: "11px", fontFamily: "monospace" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="md:col-span-7 space-y-2">
                            {chartDataOS.map((item) => (
                              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span>{item.name}</span>
                                </div>
                                <div className="text-gray-200 font-bold">
                                  ${item.value.toFixed(2)} ({((item.value / totalMonthlySpend) * 100).toFixed(0)}%)
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-[140px] flex items-center justify-center text-xs text-gray-500">
                          {isZh ? "请至少勾选激活一个操作系统" : "Please select at least one active OS runner"}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Lower Trend Line Chart */}
                <div className="bg-gray-950/40 border border-gray-850 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                      {isZh ? "资源边际费用增长测算模型" : "Cloud Spend Scaling Model & Margin Growth"}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">X: Daily Builds | Y: Est. Cost in USD</span>
                  </div>

                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={scalingData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="runs" 
                          stroke="#4b5563" 
                          fontSize={9} 
                          fontFamily="monospace"
                        />
                        <YAxis 
                          stroke="#4b5563" 
                          fontSize={9} 
                          fontFamily="monospace"
                        />
                        <ChartTooltip
                          contentStyle={{ backgroundColor: "#0b0f19", border: "1px solid #1e293b", borderRadius: "8px" }}
                          itemStyle={{ color: "#818cf8", fontSize: "11px", fontFamily: "monospace" }}
                          labelStyle={{ color: "#94a3b8", fontSize: "10px", fontFamily: "sans-serif" }}
                          labelFormatter={(label) => `${isZh ? "日均构建" : "Daily Builds"}: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={isZh ? "月度预估费用 ($)" : "Monthly Cost ($)"} 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorCost)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-gray-500 mt-2">
                    <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isZh 
                        ? "温馨建议：云服务商的容器镜像启动计费存在基本开销。为了节省费用，可以尝试开启 Production Suite 内置的「分布式构建缓存 (DDC/ACC)」。它可以提高 80%+ 的缓存命中率，使单次构建时长缩短 50%+，从而直接将你的月度云服务器支出降低约 45% 左右。"
                        : "Optimization Advisory: Runner VMs charge by the minute with high spin-up overhead. By enabling our local 'Distributed Cache (DDC/ACC)' inside the Production Suite, you raise cache hits by 80%+, slashing build times in half and saving up to 45% in real-world runner bills."}
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-850 bg-gray-950/40 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-gray-500 uppercase tracking-wide font-mono">
                  {isZh ? "FinOps 云账单审计系统 V2.0" : "FinOps Engine Cloud Broker v2.0"}
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow shadow-indigo-600/20 cursor-pointer"
                >
                  {isZh ? "完成并应用设置" : "Confirm Settings"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
