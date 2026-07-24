import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Download, 
  Copy, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Server, 
  Workflow, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConsoleLog {
  id: string;
  time: string;
  level: 'info' | 'success' | 'warn' | 'cache' | 'security' | 'cmd';
  message: string;
  subtext?: string;
}

interface DevOpsConsoleSimulatorProps {
  isZh?: boolean;
  onEnter: () => void;
}

const PRESETS = [
  {
    id: 'ue5',
    nameZh: 'Unreal Engine 5.4 主干构建 Pipeline',
    nameEn: 'UE 5.4 Main Build Pipeline',
    target: 'Win64 & PS5 Cross-Platform',
    logs: [
      { level: 'cmd', message: '$ devops-runner build --target=Win64 --config=Development --ue-version=5.4.2' },
      { level: 'info', message: '[18:10:01] Initializing DevOps Studio Runner Fleet v2.8 (Node: us-east-a100-01)' },
      { level: 'info', message: '[18:10:02] Fetching Git LFS artifacts (Target commit #8f32a41 on branch main)' },
      { level: 'cache', message: '[18:10:04] [PCH CACHE HIT 95.8%] Restored 18.4 GB precompiled C++ headers from distributed edge cache' },
      { level: 'info', message: '[18:10:05] Dispatched 48 parallel shader compilation sub-jobs to Incredibuild Runner Grid' },
      { level: 'success', message: '[18:10:12] [SHADER MATRIX] Compiled 14,200 Unreal Material Shaders in 7.2s (Speedup: 16.4x)' },
      { level: 'security', message: '[18:10:15] [HSM VAULT] Requesting hardware code signing key for PS5 & Apple App Store Certificate' },
      { level: 'security', message: '[18:10:17] [SOC2 TYPE II] Cryptographic signature attached. Token: 0x9f83...421b' },
      { level: 'success', message: '[18:10:20] [PIPELINE COMPLETED] Executed in 19.2 seconds. Artifact size: 4.2 GB' },
      { level: 'info', message: '[18:10:21] Uploading build matrix artifacts to global Cloud CDN distribution points...' }
    ]
  },
  {
    id: 'k8s',
    nameZh: '云原生 K8s 微服务 CI/CD 自动化',
    nameEn: 'Cloud Native K8s Microservices',
    target: 'Production Kubernetes Cluster',
    logs: [
      { level: 'cmd', message: '$ devops-pipeline deploy --env=production --helm-chart=./charts/payment-service' },
      { level: 'info', message: '[18:11:00] Triggering Automated Microservice Pipeline #4092' },
      { level: 'info', message: '[18:11:01] Running SAST Code Security Scan & Dependency Audit...' },
      { level: 'success', message: '[18:11:03] [SECURITY] Zero vulnerabilities found (Trivy & Snyk verified)' },
      { level: 'cache', message: '[18:11:05] [DOCKER LAYER CACHE] Hit 8/9 layers in remote registry' },
      { level: 'info', message: '[18:11:08] Executing Canary Deployment strategy (10% traffic routing)' },
      { level: 'success', message: '[18:11:12] [HELM DEPLOY] K8s pods updated successfully. Active Replicas: 12/12' }
    ]
  },
  {
    id: 'ios',
    nameZh: 'iOS / macOS Xcode 矩阵重编译',
    nameEn: 'iOS/macOS Xcode Matrix Pipeline',
    target: 'Apple App Store & TestFlight',
    logs: [
      { level: 'cmd', message: '$ xcodebuild archive -workspace App.xcworkspace -scheme Release -destination "generic/platform=iOS"' },
      { level: 'info', message: '[18:12:01] Provisioning Apple Silicon MacStudio BareMetal Runner (M3 Max)' },
      { level: 'cache', message: '[18:12:03] [SWC & SWIFT PCH] Restored Swift module cache (Saved 4.5 mins)' },
      { level: 'security', message: '[18:12:06] [VAULT OIDC] Injecting Apple Distribution Provisioning Profile' },
      { level: 'success', message: '[18:12:10] [IPA SIGNED] Successfully generated App.ipa (App Store Ready)' }
    ]
  }
];

export default function DevOpsConsoleSimulator({ isZh = true, onEnter }: DevOpsConsoleSimulatorProps) {
  const [activePreset, setActivePreset] = useState('ue5');
  const [activeTab, setActiveTab] = useState<'terminal' | 'nodes' | 'steps' | 'vault'>('terminal');
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [currentStep, setCurrentStep] = useState(3); // 1 to 5
  const [progress, setProgress] = useState(82);
  const [copied, setCopied] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load preset logs
  const selectedPreset = PRESETS.find(p => p.id === activePreset) || PRESETS[0];

  useEffect(() => {
    // Reset and stream logs
    const initialLogs = selectedPreset.logs.map((item, idx) => ({
      id: `log-${idx}`,
      time: new Date(Date.now() - (selectedPreset.logs.length - idx) * 1200).toLocaleTimeString(),
      level: item.level as any,
      message: item.message,
    }));
    setLogs(initialLogs);
    setProgress(85);
    setCurrentStep(4);
  }, [activePreset]);

  // Auto-stream new log lines when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const sampleMessages = [
        { level: 'info', message: `[${new Date().toLocaleTimeString()}] [HEARTBEAT] Runner us-east-a100 ping OK (Latency: 2ms)` },
        { level: 'cache', message: `[${new Date().toLocaleTimeString()}] [PCH MONITOR] Active Cache Hit Ratio: 95.8% (Saved 12.4GB)` },
        { level: 'info', message: `[${new Date().toLocaleTimeString()}] [TELEMETRY] Node CPU Load: 42% | RAM: 38% | GPU Compute: 88%` },
        { level: 'security', message: `[${new Date().toLocaleTimeString()}] [AUDIT LOG] SOC2 Vault Secret Key #4092 accessed by runner daemon` },
        { level: 'success', message: `[${new Date().toLocaleTimeString()}] [ARTIFACT CDN] Synced delta build chunks across 24 edge nodes` }
      ];

      const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      setLogs(prev => [...prev.slice(-30), {
        id: `stream-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        level: randomMsg.level as any,
        message: randomMsg.message
      }]);

      setProgress(prev => (prev >= 98 ? 65 : prev + 2));
    }, 2800);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto scroll to bottom of terminal
  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const handleCopyLogs = () => {
    const text = logs.map(l => l.message).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setLogs([{
      id: 'clear-1',
      time: new Date().toLocaleTimeString(),
      level: 'cmd',
      message: '$ console clear && devops-runner --watch'
    }]);
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 text-gray-100 shadow-2xl overflow-hidden font-sans relative group border-t-accent/40">
      {/* Chrome Header & URL Bar */}
      <div className="px-4 py-3 bg-gray-900/90 border-b border-gray-800 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/90" />
            <div className="w-3 h-3 rounded-full bg-amber-500/90" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
          </div>

          <div className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-gray-800 font-mono text-[11px] text-gray-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="font-bold text-gray-200">DevOps Studio Console</span>
            <span className="text-gray-500">:</span>
            <span className="text-accent font-bold">https://console.devops-studio.io/live-terminal</span>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2">
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME EMULATOR</span>
          </span>

          <button
            onClick={onEnter}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent hover:opacity-90 text-white text-[11px] font-bold transition-all shadow-md shadow-accent/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isZh ? "进入真实控制台" : "Launch Console"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="px-4 py-2.5 bg-black/80 border-b border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-mono text-[11px] font-bold">{isZh ? "预设流水线:" : "Preset:"}</span>
          <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePreset(p.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  activePreset === p.id 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isZh ? p.nameZh : p.nameEn}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-gray-400">{isZh ? "目标平台:" : "Target:"}</span>
          <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
            {selectedPreset.target}
          </span>
        </div>
      </div>

      {/* Console Top Pipeline Progress & Steps Indicator */}
      <div className="p-3 bg-gray-900/60 border-b border-gray-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="font-bold text-gray-200">{selectedPreset.nameZh}</span>
            <span className="text-[10px] text-gray-400">#RUN-88402</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold">{isZh ? "整体构建进度" : "Progress"}: {progress}%</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold animate-pulse">
              RUNNING (STEP {currentStep}/5)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800/80 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-accent via-indigo-500 to-emerald-400 h-1.5 rounded-full" 
            animate={{ width: `${progress}%` }} 
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* 5-Step Visual Pipeline Pipeline Chips */}
        <div className="grid grid-cols-5 gap-1.5 pt-1 text-[10px] font-mono">
          {[
            { step: '1. Git Sync', status: '1.2s', passed: true },
            { step: '2. PCH Cache', status: 'HIT 95%', passed: true },
            { step: '3. Shader Matrix', status: '48 Nodes', passed: true },
            { step: '4. Vault Sign', status: 'Active', active: true },
            { step: '5. CDN Deploy', status: 'Pending', pending: true },
          ].map((s, idx) => (
            <div 
              key={idx}
              className={`p-1.5 rounded border flex flex-col justify-between ${
                s.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                s.active ? 'bg-accent/15 border-accent/40 text-accent animate-pulse font-bold' :
                'bg-gray-900 border-gray-800 text-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{s.step}</span>
                {s.passed && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
              </div>
              <span className="text-[9px] opacity-80 mt-0.5">{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Sub-Tabs Bar */}
      <div className="px-4 py-2 bg-black/90 border-b border-gray-800/80 flex items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-1">
          {[
            { id: 'terminal', labelZh: '终端实况日志', labelEn: 'Live Terminal', icon: Terminal },
            { id: 'nodes', labelZh: '集群节点 (48)', labelEn: 'Runner Grid', icon: Cpu },
            { id: 'steps', labelZh: '拓扑与依赖图', labelEn: 'Topology', icon: Workflow },
            { id: 'vault', labelZh: 'SOC2 密钥审计', labelEn: 'Vault Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                  isActive 
                    ? 'bg-gray-800 text-white shadow border border-gray-700' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isZh ? tab.labelZh : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Terminal Controls */}
        {activeTab === 'terminal' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-1.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-[11px] flex items-center gap-1 cursor-pointer"
              title={isRunning ? "Pause stream" : "Resume stream"}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={handleClearLogs}
              className="p-1.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-[11px] cursor-pointer"
              title="Clear Terminal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 text-[11px] cursor-pointer"
              title="Copy Terminal Output"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Console Tab Content Area */}
      <div className="p-4 bg-gray-950 font-mono text-xs min-h-[300px] max-h-[360px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'terminal' && (
            <motion.div
              key="terminal-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5 text-[11px]"
            >
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-gray-600 shrink-0 font-mono text-[10px] select-none">{log.time}</span>
                  {log.level === 'cmd' && (
                    <span className="text-accent font-bold font-mono">{log.message}</span>
                  )}
                  {log.level === 'info' && (
                    <span className="text-gray-300">{log.message}</span>
                  )}
                  {log.level === 'success' && (
                    <span className="text-emerald-400 font-bold">{log.message}</span>
                  )}
                  {log.level === 'cache' && (
                    <span className="text-amber-400 font-bold">{log.message}</span>
                  )}
                  {log.level === 'security' && (
                    <span className="text-indigo-400 font-bold">{log.message}</span>
                  )}
                  {log.level === 'warn' && (
                    <span className="text-rose-400 font-bold">{log.message}</span>
                  )}
                </div>
              ))}
              
              {/* Terminal Cursor Blink Line */}
              {isRunning && (
                <div className="flex items-center gap-1 text-accent pt-1">
                  <span>devops-studio-runner@east-us-01:~$</span>
                  <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
                </div>
              )}
              <div ref={terminalEndRef} />
            </motion.div>
          )}

          {activeTab === 'nodes' && (
            <motion.div
              key="nodes-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3 font-sans"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'NODE-US-EAST-01 (NVIDIA A100)', cpu: '42%', ram: '38%', gsl: '99.9%', status: 'Running UE5 Shader Matrix' },
                  { name: 'NODE-US-WEST-02 (AMD EPYC 9654)', cpu: '68%', ram: '54%', gsl: '99.8%', status: 'Active PCH Header Cache' },
                  { name: 'NODE-EU-CENTRAL-01 (BareMetal)', cpu: '31%', ram: '28%', gsl: '100%', status: 'SOC2 Vault Cryptography' },
                  { name: 'NODE-CN-SOUTH-02 (MacStudio M3)', cpu: '52%', ram: '48%', gsl: '99.9%', status: 'Xcode iOS Code Signing' },
                ].map((node, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-200 text-[11px]">{node.name}</span>
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ONLINE
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">{node.status}</p>
                    <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px] text-gray-300">
                      <div>CPU: <span className="text-accent font-bold">{node.cpu}</span></div>
                      <div>RAM: <span className="text-indigo-400 font-bold">{node.ram}</span></div>
                      <div>SLA: <span className="text-emerald-400 font-bold">{node.gsl}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'steps' && (
            <motion.div
              key="steps-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3 font-sans"
            >
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2 text-xs">
                <p className="font-bold text-gray-200">{isZh ? "全场景 DAG 流水线依赖拓扑图" : "DAG Pipeline Dependency Graph"}</p>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold">Stage 1: Git Source</span>
                    <p className="text-[10px] text-gray-400 mt-1">Fetched branch main #8f32a41 in 1.2s</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-amber-500/30">
                    <span className="text-amber-400 font-bold">Stage 2: PCH Header Cache</span>
                    <p className="text-[10px] text-gray-400 mt-1">18.4GB restored. Hit rate 95.8%</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-accent/40 animate-pulse">
                    <span className="text-accent font-bold">Stage 3: Shader Compilation</span>
                    <p className="text-[10px] text-gray-400 mt-1">Dispatching 48 parallel workers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div
              key="vault-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2 font-sans"
            >
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-200">{isZh ? "SOC2 Type II 零信任 HSM 密钥管理中心" : "SOC2 Type II Zero-Trust Vault"}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] font-bold">
                    ENCRYPTED
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded bg-black/60 border border-gray-800 flex justify-between items-center">
                    <span className="text-gray-300">PS5 Master Code Signing Key</span>
                    <span className="text-emerald-400 font-bold">HSM-KEY-#4092</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-gray-800 flex justify-between items-center">
                    <span className="text-gray-300">Apple iOS Distribution Certificate</span>
                    <span className="text-emerald-400 font-bold">HSM-KEY-#8812</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-gray-800 flex justify-between items-center">
                    <span className="text-gray-300">GitHub OIDC Service Account Token</span>
                    <span className="text-indigo-400 font-bold">OIDC-VAULT-ACTIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulator Footer Switch Banner */}
      <div 
        onClick={onEnter}
        className="px-4 py-3 bg-gradient-to-r from-indigo-950 via-gray-900 to-black border-t border-gray-800 flex items-center justify-between text-xs cursor-pointer hover:bg-accent/20 transition-all group/footer"
      >
        <div className="flex items-center gap-2 text-gray-300 font-medium">
          <Sparkles className="w-4 h-4 text-accent animate-pulse shrink-0" />
          <span className="font-bold text-gray-100">
            {isZh ? "当前为 DevOps Studio 模拟器实况预览 — 点击直接切换至完全可配置的 DevOps Studio 控制台" : "DevOps Studio Simulator Preview — Click anywhere to switch to full interactive console"}
          </span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white font-bold text-xs shadow-md shadow-accent/20 group-hover/footer:scale-105 transition-transform cursor-pointer shrink-0">
          <span>{isZh ? "进入全功能控制台" : "Open Full Console"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
