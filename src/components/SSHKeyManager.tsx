import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Key, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  RefreshCw, 
  FileText, 
  Terminal, 
  Info, 
  Calendar, 
  Eye, 
  EyeOff, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Server,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useToast } from "./ToastContext";

interface SSHKey {
  id: string;
  name: string;
  type: "ED25519" | "RSA-4096" | "RSA-2048";
  publicKey: string;
  privateKey: string;
  fingerprint: string;
  strength: "ultra" | "high" | "medium" | "weak";
  created: string;
  lastUsed: string;
  authorizedRunners: string[];
  status: "authorized" | "pending";
}

export default function SSHKeyManager() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isZh = language === "zh";

  // Initial Seed Keys
  const [keys, setKeys] = useState<SSHKey[]>([
    {
      id: "key-1",
      name: "github-actions-prod-runner",
      type: "ED25519",
      publicKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ8q9b9g9M9Z9v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9O admin@devops-hub.prod",
      privateKey: "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nZDI1NTE5AAAAIJ8q9b9g9M9Z9v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9OAAAACDo6Ojo6\nOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ogo=\n-----END OPENSSH PRIVATE KEY-----",
      fingerprint: "SHA256:gJq9b9g9M9Z9v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9O",
      strength: "ultra",
      created: "2026-05-12 14:22:10",
      lastUsed: "2026-07-16 18:40:12",
      authorizedRunners: ["win64-runner-01", "macos-m2-builder"],
      status: "authorized"
    },
    {
      id: "key-2",
      name: "perforce-depot-sync",
      type: "RSA-4096",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDf9R9H9r9G9M9Z9v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9O7D7S7F7G7J7K7L7M7N7O7P7Q7R7S7T7U7V7W7X7Y7Z... p4admin@perforce.internal",
      privateKey: "-----BEGIN RSA PRIVATE KEY-----\nMIIJKQIBAAKCAgEA39U9H9r9G9M9Z9v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9O7D7S7F\n7G7J7K7L7M7N7O7P7Q7R7S7T7U7V7W7X7Y7Z7A7B7C7D7E7F7G7H7I7J7K7L7M7N\n[REDACTED HIGH COMPATIBILITY RSA CRYPTOGRAPHIC DATA BLOCK]\n-----END RSA PRIVATE KEY-----",
      fingerprint: "SHA256:v9K9e9D9H9w9B9Y9L9z9q9S9R9p9T9O7D7S7F7G7J7K",
      strength: "high",
      created: "2026-04-01 09:15:33",
      lastUsed: "2026-07-15 22:11:45",
      authorizedRunners: ["linux-docker-node", "p4-proxy-east"],
      status: "authorized"
    }
  ]);

  // UI state
  const [activeView, setActiveView] = useState<"list" | "generate" | "import">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"pub" | "priv" | null>(null);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Record<string, boolean>>({});

  // Form States for Generation
  const [genName, setGenName] = useState("");
  const [genType, setGenType] = useState<"ED25519" | "RSA-4096" | "RSA-2048">("ED25519");
  const [genPassphrase, setGenPassphrase] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genLogs, setGenLogs] = useState<string[]>([]);

  // Form States for Import
  const [importName, setImportName] = useState("");
  const [importType, setImportType] = useState<"ED25519" | "RSA-4096" | "RSA-2048">("ED25519");
  const [importPubKey, setImportPubKey] = useState("");
  const [importPrivKey, setImportPrivKey] = useState("");
  const [importRunner, setImportRunner] = useState("");

  const filteredKeys = keys.filter(k => 
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.publicKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy Key Utility
  const handleCopy = (text: string, id: string, type: "pub" | "priv") => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedKeyId(null);
      setCopiedType(null);
    }, 2000);
    addToast(
      isZh ? "密钥文本已成功拷贝至剪贴板！" : "Key copied to clipboard successfully!",
      "success"
    );
  };

  // Toggle private key masking
  const togglePrivateKeyVisibility = (id: string) => {
    setVisiblePrivateKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Delete key
  const handleDeleteKey = (id: string, name: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    addToast(
      isZh ? `密钥 "${name}" 已成功从库中移除` : `SSH Key "${name}" removed from Vault`,
      "info"
    );
  };

  // Simulated Key Pair Generation
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim()) {
      addToast(isZh ? "请输入密钥名称" : "Please specify a key name", "warning");
      return;
    }

    setIsGenerating(true);
    setGenLogs([]);

    const logSteps = isZh ? [
      "正在初始化本地安全伪随机数生成器 (PRNG)...",
      `正在使用密码算法方案: ${genType}...`,
      "正在执行质数因子筛选与密钥长度校验...",
      "正在生成高强度非对称公私钥对结构...",
      genPassphrase ? "正在基于 PBKDF2/SHA256 算法对私钥执行密码学加锁..." : "跳过私钥口令保护加密...",
      "正在解析并生成 SHA256 指纹标识...",
      "SSH 密钥对生成成功！正在将其安全归档至密钥管理中心。"
    ] : [
      "Initializing secure pseudo-random number generator (PRNG)...",
      `Targeting cryptographic schema: ${genType}...`,
      "Filtering prime factors and validating key bit-length...",
      "Generating non-asymmetrical public/private key pairs...",
      genPassphrase ? "Applying key derivation PBKDF2/SHA256 protection on private key..." : "Skipping passphrase lock protection...",
      "Generating secure SHA-256 fingerprint fingerprint...",
      "SSH Keypair successfully generated! Safe-vaulting credentials."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setGenLogs(prev => [...prev, logSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Finalize key and add to store
        const uniqueId = `key-${Date.now()}`;
        const randomString = Math.random().toString(36).substring(2, 15).toUpperCase();
        const strength = genType === "ED25519" ? "ultra" : genType === "RSA-4096" ? "high" : "medium";
        
        const newKey: SSHKey = {
          id: uniqueId,
          name: genName.trim(),
          type: genType,
          publicKey: `ssh-${genType.toLowerCase().replace("-", "")} AAAAC3NzaC1${randomString}== custom@devops-hub.gen`,
          privateKey: `-----BEGIN OPENSSH PRIVATE KEY-----\n${randomString}GENERATEDPRIVATEKEYSTUB\n-----END OPENSSH PRIVATE KEY-----`,
          fingerprint: `SHA256:${randomString.substring(0, 12)}...`,
          strength,
          created: new Date().toISOString().replace("T", " ").substring(0, 19),
          lastUsed: "Never",
          authorizedRunners: ["win64-runner-01"],
          status: "authorized"
        };

        setKeys(prev => [newKey, ...prev]);
        setIsGenerating(false);
        setActiveView("list");
        setGenName("");
        setGenPassphrase("");
        
        addToast(
          isZh ? `🎉 成功生成 SSH 密钥对: ${newKey.name}` : `🎉 Successfully generated SSH Key: ${newKey.name}`,
          "success"
        );
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
      }
    }, 450);
  };

  // Import Key
  const handleImportKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importName.trim() || !importPubKey.trim()) {
      addToast(isZh ? "请输入密钥名称与公钥数据" : "Please specify name and public key content", "warning");
      return;
    }

    // Basic format validation
    const cleanPub = importPubKey.trim();
    const isFormatValid = cleanPub.startsWith("ssh-rsa") || cleanPub.startsWith("ssh-ed25519") || cleanPub.startsWith("ecdsa-sha2-nistp256");

    if (!isFormatValid) {
      addToast(
        isZh ? "公钥格式验证失败！须以 'ssh-rsa' 或 'ssh-ed25519' 等开头" : "Public key validation failed! Must start with ssh-rsa or ssh-ed25519",
        "error"
      );
      return;
    }

    const uniqueId = `key-${Date.now()}`;
    const strength = importType === "ED25519" ? "ultra" : importType === "RSA-4096" ? "high" : "medium";
    
    const newKey: SSHKey = {
      id: uniqueId,
      name: importName.trim(),
      type: importType,
      publicKey: cleanPub,
      privateKey: importPrivKey.trim() || "-----BEGIN RSA PRIVATE KEY-----\n[USER IMPORTED ENCRYPTED PRIVATE KEY]\n-----END RSA PRIVATE KEY-----",
      fingerprint: `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}...`,
      strength,
      created: new Date().toISOString().replace("T", " ").substring(0, 19),
      lastUsed: "Never",
      authorizedRunners: importRunner ? [importRunner] : ["all-runners-pool"],
      status: "authorized"
    };

    setKeys(prev => [newKey, ...prev]);
    setActiveView("list");
    setImportName("");
    setImportPubKey("");
    setImportPrivKey("");
    setImportRunner("");

    addToast(
      isZh ? `成功导入 SSH 密钥: ${newKey.name}` : `Successfully imported SSH Key: ${newKey.name}`,
      "success"
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="ssh-vault-panel">
      
      {/* Top Premium Hub Header */}
      <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
              {isZh ? "安全凭证库" : "SECURE CREDENTIAL VAULT"}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isZh ? "高等级加密就绪" : "Encrypted Vault Ready"}</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Key className="h-5.5 w-5.5 text-indigo-400" />
            {isZh ? "SSH 密钥库与自动化凭证安全中心" : "SSH Key Vault & Credential Security Hub"}
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            {isZh 
              ? "集中化管理多主机持续集成（CI/CD）安全通道。模拟生成行业标准的 RSA 4096 / ED25519 高安全性密钥，自动核对编译服务器的连接权限。" 
              : "Consolidated security dashboard for continuous build runner authentication. Interactive keypair generation with strict cryptographic strength enforcement, automated runner node mapping, and status indicators."}
          </p>
        </div>

        {/* Quick Nav Switches */}
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 gap-1.5 self-start md:self-auto flex-shrink-0 z-10">
          <button
            onClick={() => setActiveView("list")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
              activeView === "list"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {isZh ? "密钥库列表" : "Key Vault"}
          </button>
          <button
            onClick={() => setActiveView("generate")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeView === "generate"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isZh ? "在线生成对" : "Gen Keypair"}
          </button>
          <button
            onClick={() => setActiveView("import")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
              activeView === "import"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {isZh ? "导入已有" : "Import"}
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider">{isZh ? "密钥库总数" : "VAULTED KEYS"}</span>
            <span className="text-lg font-bold text-gray-200 mt-0.5">{keys.length} {isZh ? "组" : "Keys"}</span>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider">{isZh ? "平均安全等级" : "VAULT AUDIT"}</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5">{isZh ? "极佳 (A+)" : "Excellent (A+)"}</span>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider">{isZh ? "绑定编译节点" : "BOUND RUNNERS"}</span>
            <span className="text-lg font-bold text-gray-200 mt-0.5">
              {keys.reduce((sum, k) => sum + k.authorizedRunners.length, 0)} {isZh ? "台" : "Nodes"}
            </span>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider">{isZh ? "连接完整性" : "VAULT INTEGRITY"}</span>
            <span className="text-lg font-bold text-gray-200 mt-0.5">100% {isZh ? "正常" : "Secure"}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: KEY LIST & INTERACTIVE SEARCH */}
        {activeView === "list" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search Input Bar */}
            <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="relative w-full sm:max-w-md">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={isZh ? "输入别名、指纹或公钥检索凭据..." : "Search key names, algorithms, or fingerprints..."}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-900/40 hover:bg-gray-900/70 focus:bg-gray-900/80 border border-gray-800 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-500 font-sans"
                />
              </div>

              <div className="text-[11px] text-gray-500 font-mono flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-gray-400" />
                <span>{isZh ? "共筛选出" : "Filtered"} <strong className="text-gray-300 font-bold">{filteredKeys.length}</strong> {isZh ? "个安全密钥对" : "active credentials"}</span>
              </div>
            </div>

            {/* Keys Grid */}
            {filteredKeys.length === 0 ? (
              <div className="bg-gray-950 border border-gray-900 rounded-2xl py-12 text-center text-gray-500 italic text-xs flex flex-col items-center justify-center gap-2.5">
                <Key className="h-8 w-8 text-gray-700 animate-bounce" />
                <span>{isZh ? "未找到符合过滤条件的 SSH 密钥" : "No SSH keys match your query."}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredKeys.map((key) => {
                  const isPrivVisible = !!visiblePrivateKeys[key.id];
                  
                  return (
                    <div 
                      key={key.id}
                      className="bg-gray-950 border border-gray-900 hover:border-gray-800 rounded-2xl p-5 space-y-4 transition-all relative overflow-hidden"
                    >
                      {/* Top Row: Meta info & badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            key.type === "ED25519" 
                              ? "bg-indigo-500/10 text-indigo-400" 
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                            <Key className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xs font-bold text-gray-200 font-mono">{key.name}</h3>
                              <span className="text-[9px] bg-gray-900 border border-gray-850 px-1.5 py-0.2 rounded font-mono text-gray-400 font-semibold">{key.type}</span>
                              
                              {/* Strength indicator */}
                              <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-mono uppercase font-bold tracking-wider ${
                                key.strength === "ultra" 
                                  ? "bg-indigo-950/60 text-indigo-400 border border-indigo-900/40" 
                                  : key.strength === "high"
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                                  : "bg-amber-950/60 text-amber-400 border border-amber-900/40"
                              }`}>
                                {isZh 
                                  ? (key.strength === "ultra" ? "绝密强度" : key.strength === "high" ? "高强度" : "普通强度") 
                                  : `${key.strength} strength`}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono block mt-1">{key.fingerprint}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteKey(key.id, key.name)}
                            className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-950/20 cursor-pointer"
                            title={isZh ? "删除此密钥" : "Delete Key"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Grid: Configuration Fields */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* Public Key Display */}
                        <div className="lg:col-span-6 space-y-1.5 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <Unlock className="h-3.5 w-3.5 text-indigo-400" />
                              {isZh ? "公钥数据 (Public Key)" : "Public Key"}
                            </span>
                            <button
                              onClick={() => handleCopy(key.publicKey, key.id, "pub")}
                              className="text-[10px] font-semibold text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedKeyId === key.id && copiedType === "pub" ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400">{isZh ? "已复制" : "Copied"}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>{isZh ? "复制公钥" : "Copy"}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-900/30 border border-gray-900/60 rounded-xl">
                            <pre className="text-[10px] font-mono text-gray-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
                              {key.publicKey}
                            </pre>
                          </div>
                        </div>

                        {/* Private Key Display (Masked) */}
                        <div className="lg:col-span-6 space-y-1.5 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5 text-indigo-400" />
                              {isZh ? "私钥密语 (Private Key)" : "Private Key"}
                            </span>
                            
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => togglePrivateKeyVisibility(key.id)}
                                className="text-[10px] font-semibold text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {isPrivVisible ? (
                                  <>
                                    <EyeOff className="h-3.5 w-3.5" />
                                    <span>{isZh ? "隐藏私钥" : "Hide"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>{isZh ? "显示私钥" : "Reveal"}</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopy(key.privateKey, key.id, "priv")}
                                className="text-[10px] font-semibold text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {copiedKeyId === key.id && copiedType === "priv" ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span className="text-emerald-400">{isZh ? "已复制" : "Copied"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>{isZh ? "复制私钥" : "Copy"}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-900/30 border border-gray-900/60 rounded-xl relative overflow-hidden">
                            {isPrivVisible ? (
                              <pre className="text-[10px] font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-normal">
                                {key.privateKey}
                              </pre>
                            ) : (
                              <div className="py-2 flex items-center justify-center gap-2 text-gray-600 select-none">
                                <Lock className="h-3.5 w-3.5 text-gray-700 animate-pulse" />
                                <span className="text-[10px] font-mono tracking-widest font-bold">••••••••••••••••••••••••••••••••••••••</span>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Bottom row: Authorized Runners Mapping & SCM Connection Audit */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-900 text-[10.5px] text-gray-500">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono">{isZh ? "授权编译节点:" : "Authorized nodes:"}</span>
                          {key.authorizedRunners.map((run, idx) => (
                            <span key={idx} className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold">
                              {run}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 font-mono text-[10px]">
                          <span>{isZh ? "首次创建时间:" : "Created:"} <strong className="text-gray-400">{key.created}</strong></span>
                          <span>{isZh ? "上次使用时间:" : "Last used:"} <strong className="text-gray-400">{key.lastUsed}</strong></span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: INTERACTIVE SIMULATED KEYPAIR GENERATOR */}
        {activeView === "generate" && (
          <motion.div
            key="generate-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Form Left */}
            <form 
              onSubmit={handleGenerateKey}
              className="lg:col-span-5 bg-gray-950 border border-gray-900 rounded-2xl p-6 space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                  {isZh ? "本地非对称密钥生成器" : "ASYMMETRIC KEYPAIR CREATOR"}
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  {isZh 
                    ? "基于浏览器底层高熵随机数生成安全的专属 SSH 凭证对。" 
                    : "Simulate advanced RSA / ED25519 high-entropy compilation container keys instantly."}
                </p>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">{isZh ? "密钥识别别名 / 备注名称" : "Key Identifier / Name"}</label>
                  <input
                    type="text"
                    value={genName}
                    onChange={e => setGenName(e.target.value)}
                    placeholder="e.g., gitlab-build-node-east"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    disabled={isGenerating}
                  />
                </div>

                {/* Algo Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">{isZh ? "密码算法类型 (Algorithm)" : "Cryptographic Algorithm"}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["ED25519", "RSA-4096", "RSA-2048"] as const).map(type => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setGenType(type)}
                        disabled={isGenerating}
                        className={`py-2.5 px-1 rounded-xl border text-center font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                          genType === type
                            ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 shadow"
                            : "bg-gray-900/40 border-gray-900 text-gray-400 hover:bg-gray-900"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 block leading-relaxed mt-1">
                    {genType === "ED25519" 
                      ? (isZh ? "★ 极力推荐：更小、更快，且具备最高阶的现代防御安全性。" : "★ Highly Recommended: Fast performance, compact size, ultra-high military-grade defense.")
                      : (isZh ? "兼容性：适用于Perforce、老旧服务器系统的代码库同步。" : "Compatible: Ideal for Perforce integration, legacy servers SCM pulling.")}
                  </span>
                </div>

                {/* Passphrase password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-400 font-semibold">{isZh ? "密钥保护口令密码 (可选)" : "Passphrase Protection (Optional)"}</label>
                    <span className="text-[10px] text-gray-500 font-mono">Password-masked</span>
                  </div>
                  <input
                    type="password"
                    value={genPassphrase}
                    onChange={e => setGenPassphrase(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isZh ? "密钥对计算及加固中..." : "Computing bits..."}</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      <span>{isZh ? "生成全新非对称密钥对" : "Generate Secure Keypair"}</span>
                    </>
                  )}
                </button>

              </div>
            </form>

            {/* Simulated Console Logs Right */}
            <div className="lg:col-span-7 bg-gray-950 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-1.5 border-b border-gray-900 pb-3">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  {isZh ? "密钥引擎控制台反馈" : "KEYGEN CONSOLE LOG"}
                </span>
                <p className="text-[10px] text-gray-500">
                  {isZh ? "实时监测非对称加密算法的质数筛选与安全指纹比对流水线。" : "Monitor prime analysis, entropy gathering, and local filesystem sandbox storage loops."}
                </p>
              </div>

              {/* Console Logs Area */}
              <div className="flex-1 my-4 bg-black/40 rounded-xl p-4 font-mono text-[10.5px] leading-relaxed text-indigo-300 overflow-y-auto space-y-2 text-left">
                {genLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-600 italic">
                    {isZh ? "> 准备就绪，等待计算信号发起..." : "> Daemon active. Awaiting generation signal..."}
                  </div>
                ) : (
                  genLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-1 duration-200">
                      <span className="text-indigo-500/80 font-bold font-mono">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-gray-300 font-sans">{log}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Tips block */}
              <div className="p-3.5 bg-indigo-950/15 border border-indigo-900/50 rounded-xl text-[10.5px] text-indigo-300 leading-normal flex gap-2.5">
                <Info className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="font-sans">
                  {isZh 
                    ? "生成的私钥不会传输至任何外部服务器，完全由您决定复制保存或应用于 CI 环境变量绑定中。" 
                    : "Cryptographic secrets are generated client-side via high-entropy entropy pools. Your private keys never touch network sockets."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: MANUAL IMPORT PORTAL */}
        {activeView === "import" && (
          <motion.div
            key="import-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-950 border border-gray-900 rounded-2xl p-6"
          >
            <div className="border-b border-gray-900 pb-4 mb-6 text-left">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Plus className="h-4.5 w-4.5 text-indigo-400" />
                {isZh ? "安全接入外部 SSH 密钥" : "IMPORT EXISTING SSH KEYPAIR"}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-sans">
                {isZh 
                  ? "支持录入并格式化验证现有代码仓库权限密钥，无缝与自动化编译节点对接。" 
                  : "Securely input existing keys into our database. The parser validates formats and handles local runner bindings."}
              </p>
            </div>

            <form onSubmit={handleImportKey} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inputs Column Left */}
              <div className="lg:col-span-4 space-y-4 text-xs text-left">
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">{isZh ? "密钥标识名称" : "Key Name / Alias"}</label>
                  <input
                    type="text"
                    value={importName}
                    onChange={e => setImportName(e.target.value)}
                    placeholder="e.g., prod-gitlab-key"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">{isZh ? "加密算法类型" : "Algorithm Scheme"}</label>
                  <select
                    value={importType}
                    onChange={e => setImportType(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono cursor-pointer"
                  >
                    <option value="ED25519">ED25519 (Ultra strength, fast)</option>
                    <option value="RSA-4096">RSA-4096 (High compatibility)</option>
                    <option value="RSA-2048">RSA-2048 (Medium compatibility)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">{isZh ? "授权映射编译节点 (可选)" : "Assign Target Runner (Optional)"}</label>
                  <input
                    type="text"
                    value={importRunner}
                    onChange={e => setImportRunner(e.target.value)}
                    placeholder="e.g., macos-m2-builder"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isZh ? "安全导入并在本地激活" : "Safe Import and Vault"}</span>
                </button>
              </div>

              {/* Pasting Key Fields Right */}
              <div className="lg:col-span-8 space-y-4 text-xs text-left">
                
                {/* Public Key Paste */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-400 font-semibold flex items-center gap-1.5">
                      <Unlock className="h-3.5 w-3.5 text-indigo-400" />
                      {isZh ? "公钥文件原文 (id_rsa.pub / id_ed25519.pub)" : "Public Key Content (Must start with ssh-...)"}
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">Format: ssh-ed25519 AAA...</span>
                  </div>
                  <textarea
                    rows={3}
                    value={importPubKey}
                    onChange={e => setImportPubKey(e.target.value)}
                    placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* Private Key Paste */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-400 font-semibold flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-indigo-400" />
                      {isZh ? "私钥文件原文 (可选 / 仅做本地加锁托管)" : "Private Key Content (Optional / Kept on local client storage)"}
                    </label>
                    <span className="text-[10px] text-gray-500 font-mono">PEM / OpenSSH format</span>
                  </div>
                  <textarea
                    rows={4}
                    value={importPrivKey}
                    onChange={e => setImportPrivKey(e.target.value)}
                    placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none leading-relaxed"
                  />
                </div>

              </div>

            </form>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Advisory security rules card */}
      <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 text-left space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-2.5">
          <AlertTriangle className="h-4.5 w-4.5 text-indigo-400" />
          <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
            {isZh ? "持续集成（CI）安全合规建议" : "CONTINUOUS INTEGRATION (CI) HARDEING PRINCIPLES"}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-gray-400">
          <div className="space-y-1 bg-gray-900/10 p-3.5 rounded-xl border border-gray-900/50">
            <span className="font-semibold text-gray-200 block">1. {isZh ? "最小权限保护原则" : "Least Privilege Principle"}</span>
            <p className="text-[11px] text-gray-500 leading-normal font-sans">
              {isZh 
                ? "不要将同一个编译 SSH 密钥绑定多个代码仓库，尤其是把开发人员的工作密钥直接放置在 Docker 或云构建 Runner 的全局变量中。" 
                : "Avoid using personal keys for build environments. Always configure distinct deployment/sync keys specifically tied to your SCM workflows."}
            </p>
          </div>

          <div className="space-y-1 bg-gray-900/10 p-3.5 rounded-xl border border-gray-900/50">
            <span className="font-semibold text-gray-200 block">2. {isZh ? "强制启用口令哈希锁" : "Enforce Passphrase Protection"}</span>
            <p className="text-[11px] text-gray-500 leading-normal font-sans">
              {isZh 
                ? "极力推荐为所有 CI 自动拉码密钥加上复杂的 Passphrase，以防发生构建服务器主机被攻破时，私钥被轻易离线打包破解。" 
                : "Always apply passphrases when generating keys. It mitigates immediate off-line compromises if host machines are ever audited."}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
