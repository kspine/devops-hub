import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useWorkspace } from "../WorkspaceContext";
import { 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Terminal, 
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Lock
} from "lucide-react";

export default function SigningHelper() {
  const { activeWorkspace } = useWorkspace();
  const projectType = activeWorkspace?.projectType || 'web';
  const [activePlatform, setActivePlatform] = useState<"ios" | "android">("ios");
  
  // Compliance Check States
  const [complianceStatus, setComplianceStatus] = useState<"idle" | "scanning" | "passed" | "failed">("idle");
  const [complianceLogs, setComplianceLogs] = useState<string[]>([]);
  const [complianceIssues, setComplianceIssues] = useState<Array<{ id: string; type: "critical" | "warning"; rule: string; detail: string; status: "active" | "fixed" }>>([
    { id: "ip-1", type: "warning", rule: "Hardcoded Test IP", detail: "Found internal staging database IP: '10.231.142.8' in NetworkConfig.ts:54", status: "active" },
    { id: "api-1", type: "warning", rule: "Forbidden API Usage", detail: "Using deprecated non-secured 'android.webkit.WebView.clearCache' in WebController.java:120", status: "active" },
    { id: "http-1", type: "warning", rule: "Insecure HTTP Link", detail: "Unencrypted endpoints detected: 'https://api.staging-game.net/v1' in ServerRoutes.cs:18", status: "active" }
  ]);

  const handleRunCompliance = () => {
    setComplianceStatus("scanning");
    setComplianceLogs([]);
    
    const logs = isZh ? [
      "正在检测 AndroidManifest.xml 和 Info.plist 合规配置...",
      "正在检索源代码中是否存在硬编码测试环境 IP 地址 (IPv4/IPv6)...",
      "正在扫描高危禁用 API (例如 clearCache, Debug.getBinderDeathObjectCount) 使用情况...",
      "正在审查嵌入式资源及 AssetBundle 内部明文 HTTP 链接...",
      "比对完成。发现高危安全与合规风险，建议修复后再导出签名。"
    ] : [
      "Analyzing PlayerSettings, AndroidManifest.xml and Info.plist for privacy leaks...",
      "Searching codebase for hardcoded testing environment IPs & subnets...",
      "Scanning source code for forbidden/deprecated SDK APIs (e.g. clearCache)...",
      "Auditing configuration scripts for unencrypted HTTP URL paths...",
      "Scan complete. Found active warning items requiring manual or auto redaction."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setComplianceLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setComplianceStatus("failed");
      }
    }, 400);
  };

  const handleAutoFix = () => {
    setComplianceStatus("scanning");
    setTimeout(() => {
      setComplianceIssues(prev => prev.map(issue => ({ ...issue, status: "fixed" })));
      setComplianceStatus("passed");
    }, 1000);
  };
  
  // iOS States
  const [profileType, setProfileType] = useState<"development" | "adhoc" | "appstore">("appstore");
  const [bundleId, setBundleId] = useState("com.company.game");
  const [teamId, setTeamId] = useState("98A7B6C5D4");
  const [appSpecificPassword, setAppSpecificPassword] = useState("");
  
  // Android States
  const [keystoreName, setKeystoreName] = useState("user.keystore");
  const [keystoreAlias, setKeystoreAlias] = useState("release-alias");
  const [keystorePass, setKeystorePass] = useState("password123");
  const [keyPass, setKeyPass] = useState("password123");
  const [validityDays, setValidityDays] = useState(10000);
  const [keyAlgorithm, setKeyAlgorithm] = useState<"RSA" | "EC">("RSA");

  // SSH States
  const [sshKeyName, setSshKeyName] = useState("id_rsa_buildserver");
  const [sshPrivateKey, setSshPrivateKey] = useState("-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----");
  const [sshGitUrl, setSshGitUrl] = useState("git@github.com:my-studio/my-game.git");

  const [copied, setCopied] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const isZh = language === "zh";

  const getExportOptionsPlist = () => {
    const method = profileType === "appstore" ? "app-store" : profileType === "adhoc" ? "ad-hoc" : "development";
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>teamID</key>
    <string>${teamId.toUpperCase()}</string>
    <key>method</key>
    <string>${method}</string>
    <key>compileBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>manual</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>${bundleId}</key>
        <string>${bundleId.replace(/\./g, "_")}_${method}_profile</string>
    </dict>
</dict>
</plist>`;
  };

  const getAltoolCommand = () => {
    return `xcrun altool --upload-app --type ios \\
  -f Builds/ios/BuildGame.ipa \\
  -u "seankspine@gmail.com" \\
  -p "${appSpecificPassword || "xxxx-xxxx-xxxx-xxxx"}"`;
  };

  const getKeytoolCommand = () => {
    return `keytool -genkey -v \\
  -keystore ${keystoreName || "user.keystore"} \\
  -alias ${keystoreAlias || "release-alias"} \\
  -keyalg ${keyAlgorithm} \\
  -keysize 2048 \\
  -validity ${validityDays} \\
  -storepass "${keystorePass || "password123"}" \\
  -keypass "${keyPass || "password123"}" \\
  -dname "CN=GameDev, OU=Ops, O=Studio, L=Seattle, S=WA, C=US"`;
  };

  const getApksignerCommand = () => {
    return `apksigner sign \\
  --ks ${keystoreName || "user.keystore"} \\
  --ks-key-alias ${keystoreAlias || "release-alias"} \\
  --ks-pass pass:"${keystorePass || "password123"}" \\
  --key-pass pass:"${keyPass || "password123"}" \\
  --out Builds/android/ReleaseGame_signed.apk \\
  Builds/android/ReleaseGame_unsigned.apk`;
  };

  const getGradleSigningConfig = () => {
    return `signingConfigs {
    release {
        storeFile file("../${keystoreName || "user.keystore"}")
        storePassword "${keystorePass || "password123"}"
        keyAlias "${keystoreAlias || "release-alias"}"
        keyPassword "${keyPass || "password123"}"
    }
}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6" id="signing-helper">
      
      {/* Sub-tab Platform Switcher */}
      <div className="flex border-b border-gray-800 bg-gray-950 p-1 rounded-xl gap-1 max-w-sm">
        <button
          onClick={() => setActivePlatform("ios")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wide transition-all text-center cursor-pointer ${
            activePlatform === "ios"
              ? "bg-indigo-600 text-white shadow font-bold"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {isZh ? "iOS 描述文件与证书" : "iOS Provisioning"}
        </button>
        <button
          onClick={() => setActivePlatform("android")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wide transition-all text-center cursor-pointer ${
            activePlatform === "android"
              ? "bg-indigo-600 text-white shadow font-bold"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {isZh ? "Android 密钥签名" : "Android Keystore"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANE: Inputs & Controls */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-6">
          
          {activePlatform === "ios" ? (
            /* iOS Input Panel */
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-400" />
                  {t("profileSimulator")}
                </h3>
                <p className="text-xs text-gray-400">
                  {t("profileDesc")}
                </p>
              </div>

              <div className="space-y-4">
                {/* Profile Type */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">{t("deliveryChannel")}</label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">iOS Provisioning Methods:</span>
                        • App Store: For App Store & TestFlight release.<br />
                        • Ad-Hoc: For designated device IDs (limited to 100).<br />
                        • Dev: For local Xcode testing during development.
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["development", "adhoc", "appstore"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setProfileType(type)}
                        className={`py-2 px-1 rounded-lg border text-center font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                          profileType === type
                            ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                            : "bg-gray-900/40 border-gray-800 text-gray-400 hover:bg-gray-900"
                        }`}
                      >
                        {type === "appstore" ? "App Store" : type === "adhoc" ? "Ad-Hoc" : "Dev"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bundle Identifier */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">{t("appIdLabel")}</label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">Bundle Identifier:</span>
                        {projectType === "unity" 
                          ? "Must match the Bundle Identifier specified in Unity Player Settings exactly (e.g. com.studio.game). Wildcards block push notification capabilities."
                          : "Must match the Bundle Identifier specified in Unreal Project Settings exactly (e.g. com.studio.game). Wildcards block push notification capabilities."}
                      </div>
                    </div>
                  </div>
                  <input
                    id="bundle-id-input"
                    type="text"
                    value={bundleId}
                    onChange={e => setBundleId(e.target.value)}
                    placeholder="com.yourcompany.gamename"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Apple Team ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">{t("teamIdLabel")}</label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">Apple Team ID:</span>
                        A 10-character alphanumeric code assigned by Apple (found in your Apple Developer Account portal). Used to sign and bind provisioning profiles.
                      </div>
                    </div>
                  </div>
                  <input
                    id="team-id-input"
                    type="text"
                    value={teamId}
                    maxLength={10}
                    onChange={e => setTeamId(e.target.value)}
                    placeholder="A1B2C3D4E5"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* App specific password */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {t("appSpecificPwd")} <span className="text-[10px] text-gray-500">({t("optional")})</span>
                    </label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">App-Specific Password:</span>
                        Mandatory for altool / Xcode CLI app uploading. Avoids using your primary Apple ID password in automated shell environments.
                      </div>
                    </div>
                  </div>
                  <input
                    id="app-password-input"
                    type="password"
                    value={appSpecificPassword}
                    onChange={e => setAppSpecificPassword(e.target.value)}
                    placeholder="abcd-efgh-ijkl-mnop"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Validation Warnings */}
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t("entitlementCheck")}</span>
                
                {bundleId.includes("*") ? (
                  <div className="bg-amber-950/20 border border-amber-900/60 rounded-lg p-3 text-[11px] text-amber-300 flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {t("wildcardWarn")}
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-950/20 border border-green-900/40 rounded-lg p-3 text-[11px] text-green-300 flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {t("explicitOk")}
                    </p>
                  </div>
                )}

                {profileType === "appstore" && (
                  <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-lg p-3 text-[11px] text-indigo-300 flex gap-2">
                    <FileText className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {t("appstoreCerts")}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : activePlatform === "android" ? (
            /* Android Input Panel */
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-400" />
                  {isZh ? "Android 密钥库模拟器" : "Android Keystore Configuration"}
                </h3>
                <p className="text-xs text-gray-400">
                  {isZh 
                    ? "设置密钥库名称、别名与密码，在右侧实时获得生成的 keytool 命令行、Gradle 签名配置和 APK 手动签署指令。" 
                    : "Configure Keystore values to generate keytool provision command line, Gradle signing configs, and manual apksigner rules."}
                </p>
              </div>

              <div className="space-y-4">
                {/* Keystore Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "密钥库文件名 (.keystore / .jks)" : "Keystore Filename"}
                    </label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">Keystore File:</span>
                        Typically a file ending in .keystore or .jks containing one or more private keys for your organization.
                      </div>
                    </div>
                  </div>
                  <input
                    id="keystore-name-input"
                    type="text"
                    value={keystoreName}
                    onChange={e => setKeystoreName(e.target.value)}
                    placeholder="user.keystore"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Keystore Alias */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "证书别名 (Key Alias)" : "Key Alias"}
                    </label>
                    <div className="relative group/help">
                      <HelpCircle className="h-3 w-3 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2.5 rounded-lg bg-gray-900 border border-gray-850 text-[10px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity duration-150 z-50 leading-relaxed font-sans font-normal text-left shadow-xl border-gray-800">
                        <span className="font-semibold text-gray-100 block mb-0.5">Key Alias:</span>
                        The internal name used to reference the specific signing key within the multi-key keystore.
                      </div>
                    </div>
                  </div>
                  <input
                    id="keystore-alias-input"
                    type="text"
                    value={keystoreAlias}
                    onChange={e => setKeystoreAlias(e.target.value)}
                    placeholder="release-alias"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Algorithm and Validity Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "加密算法 (Alg)" : "Algorithm"}
                    </label>
                    <select
                      id="key-alg-select"
                      value={keyAlgorithm}
                      onChange={e => setKeyAlgorithm(e.target.value as "RSA" | "EC")}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                    >
                      <option value="RSA">RSA (Recommended)</option>
                      <option value="EC">Elliptic Curve (EC)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "有效期 (天)" : "Validity (Days)"}
                    </label>
                    <input
                      id="keystore-validity-input"
                      type="number"
                      value={validityDays}
                      onChange={e => setValidityDays(Number(e.target.value))}
                      placeholder="10000"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Keystore Password & Key Password */}
                <div className="space-y-3.5 pt-1.5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "密钥库访问密码 (Store Password)" : "Keystore Password"}
                    </label>
                    <input
                      id="keystore-storepass-input"
                      type="password"
                      value={keystorePass}
                      onChange={e => setKeystorePass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold font-sans">
                      {isZh ? "证书别名密码 (Key Password)" : "Key Password"}
                    </label>
                    <input
                      id="keystore-keypass-input"
                      type="password"
                      value={keyPass}
                      onChange={e => setKeyPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

              </div>

              {/* Security Audit Analysis */}
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {isZh ? "安全审计与最佳实践" : "Keystore Security Audit"}
                </span>

                {keystorePass === keyPass ? (
                  <div className="bg-green-950/20 border border-green-900/40 rounded-lg p-3 text-[11px] text-green-300 flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isZh 
                        ? "Store 密码与 Key 密码完全一致。这是 Google Play 自动化分发推荐配置，可有效规避部分老旧 Gradle 编译器打包签名崩溃问题。" 
                        : "Keystore password matches the key password. Fully compatible with Google Play App Signing & automated shell pipelines."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-950/20 border border-amber-900/60 rounded-lg p-3 text-[11px] text-amber-300 flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isZh 
                        ? "检测到 Store 密码与 Key 密码不同。部分 CI/CD 自动化构建流程中无法分开指定两个密码，可能导致打包机中抛出 'UnrecoverableKeyException' 错误。" 
                        : "Separate Store and Key passwords detected. Be sure your automated build runner specifically supports separate credentials inputs."}
                    </p>
                  </div>
                )}

                {validityDays < 9125 ? (
                  <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3 text-[11px] text-red-300 flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isZh 
                        ? "密钥库有效期不足 25 年 (9125天)。Google Play 上架要求新应用证书有效期必须保证能够支撑到 2049 年 10 月 22 日以后，建议调大有效期。" 
                        : "Validity is less than 25 years. Google Play requires signing keys to remain valid at least until October 22, 2049."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3 text-[11px] text-emerald-300 flex gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isZh 
                        ? "证书有效期通过 Google Play 标准检测，大于 25 年，确保可顺畅发布长期版本维护。" 
                        : "Certificate validity exceeds 25 years. Compatible with long-term release lifecycle requirements."}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* SSH Input Panel */
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-1 font-sans flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-400" />
                  {isZh ? "SSH 与凭据管理" : "SSH & Credentials Management"}
                </h3>
                <p className="text-xs text-gray-400">
                  {isZh 
                    ? "管理构建服务器通过 SSH 拉取代码或上传制品的密钥。" 
                    : "Manage SSH keys for build server git authentication."}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold font-sans">
                    {isZh ? "远程 Git 仓库地址 (SSH)" : "Remote Git Repo URL (SSH)"}
                  </label>
                  <input
                    type="text"
                    value={sshGitUrl}
                    onChange={e => setSshGitUrl(e.target.value)}
                    placeholder="git@github.com:my-studio/my-game.git"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold font-sans">
                    {isZh ? "SSH 密钥文件名" : "SSH Key Filename"}
                  </label>
                  <input
                    type="text"
                    value={sshKeyName}
                    onChange={e => setSshKeyName(e.target.value)}
                    placeholder="id_rsa"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold font-sans">
                    {isZh ? "私钥内容 (Private Key)" : "Private Key Content"}
                  </label>
                  <textarea
                    rows={6}
                    value={sshPrivateKey}
                    onChange={e => setSshPrivateKey(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-[10px] font-mono text-gray-100 focus:outline-none focus:border-indigo-500 transition-colors whitespace-pre"
                  />
                </div>
              </div>
            </>
          )}

          {/* Compliance Check Gate Widget */}
          <div className="mt-6 pt-6 border-t border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {complianceStatus === "passed" ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400 animate-bounce" />
                ) : (
                  <ShieldAlert className={`h-4 w-4 ${complianceStatus === "failed" ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
                )}
                <span className="text-xs font-bold text-gray-200 uppercase tracking-wider font-sans">
                  {isZh ? "包体发布前安全合规性扫描" : "Pre-signing Compliance Guard"}
                </span>
              </div>
              <button
                onClick={handleRunCompliance}
                disabled={complianceStatus === "scanning"}
                className="px-2 py-1 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 text-[10px] font-bold text-indigo-400 rounded transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`h-3 w-3 ${complianceStatus === "scanning" ? "animate-spin text-indigo-400" : ""}`} />
                <span>{complianceStatus === "scanning" ? (isZh ? "扫描中" : "Scanning") : (isZh ? "执行扫描" : "Run Scan")}</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              {isZh 
                ? "在签署最终二进制包前，强制扫描硬编码测试服务器 IP、泄露敏感凭据及禁用高危 API (例如 getBinderDeathObjectCount)。" 
                : "Simulates scans for forbidden API usage, unencrypted cleartext HTTP domains, or raw testing environment IPs in code before final signing."}
            </p>

            {complianceStatus === "scanning" && (
              <div className="bg-gray-950/60 border border-gray-850 p-3 rounded-lg font-mono text-[9px] text-indigo-300 space-y-1">
                {complianceLogs.map((log, i) => (
                  <div key={i} className="flex gap-1.5 items-start">
                    <span className="text-gray-600">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="h-1.5 w-full bg-gray-900 rounded overflow-hidden mt-2 relative">
                  <div className="h-full bg-indigo-500 rounded animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {complianceStatus === "failed" && (
              <div className="space-y-2.5">
                <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{isZh ? "检测到高危安全缺陷 (CI/CD 熔断阻断)" : "Security & Privacy Red Flags Identified"}</span>
                  </div>
                  
                  <div className="divide-y divide-red-950/40 space-y-2 pt-1 text-[10px]">
                    {complianceIssues.map((issue) => (
                      <div key={issue.id} className="pt-2 flex justify-between items-start gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-red-300 font-sans">[{issue.rule}]</span>
                          <p className="text-gray-400 font-mono leading-relaxed">{issue.detail}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          issue.status === "fixed" 
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                            : "bg-red-950/40 text-rose-400 border border-red-900/30"
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={handleAutoFix}
                      className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      <span>{isZh ? "一键自动脱敏 & 修复警告" : "Auto Redact & Harden Code"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {complianceStatus === "passed" && (
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs space-y-1 text-emerald-400">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>{isZh ? "安全与合规审计 100% 通过" : "All Safety Checks Succeeded"}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  {isZh 
                    ? "无残留测试环境 IP，无高危禁用 APIs，全网通信信道已强制升级至 HTTPS。代码已签名加固，流水线放行。" 
                    : "Raw internal staging IP replaced with configurations, unencrypted cleartext routes fully hardened. Signing allowed."}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANE: Code Viewers & Guides */}
        <div className="lg:col-span-7 space-y-6">
          
          {activePlatform === "ios" ? (
            /* iOS Right Outputs */
            <>
              {/* ExportOptions plist viewer */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>ExportOptions.plist</span>
                  </div>
                  <button
                    id="copy-plist-btn"
                    onClick={() => handleCopy(getExportOptionsPlist(), "plist")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-gray-100 transition-colors cursor-pointer"
                  >
                    {copied === "plist" ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-semibold">{copied === "plist" ? t("copied") : "Copy Plist"}</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-950/40 font-mono text-[11px] text-gray-300 leading-relaxed overflow-auto max-h-[220px]">
                  <pre>{getExportOptionsPlist()}</pre>
                </div>
                <div className="p-3 bg-gray-900/20 text-[10px] text-gray-400 border-t border-gray-800">
                  {t("exportOptionsDesc")} <code className="text-indigo-400 font-mono">xcodebuild -exportArchive -exportOptionsPlist ExportOptions.plist</code>
                </div>
              </div>

              {/* TestFlight command-line tool */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>TestFlight altool CLI Upload</span>
                  </div>
                  <button
                    id="copy-cli-btn"
                    onClick={() => handleCopy(getAltoolCommand(), "cli")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-gray-100 transition-colors cursor-pointer"
                  >
                    {copied === "cli" ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-semibold">{copied === "cli" ? t("copied") : "Copy Command"}</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-950/40 font-mono text-[11px] text-gray-300 leading-relaxed overflow-auto">
                  <pre className="whitespace-pre-wrap">{getAltoolCommand()}</pre>
                </div>
                <div className="p-3 bg-gray-900/20 text-[10px] text-gray-400 border-t border-gray-800">
                  {t("testflightDesc")}
                </div>
              </div>

              {/* iOS submission guide */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  {t("checklistTitle")}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 space-y-1.5">
                    <span className="font-semibold text-gray-200 block">{t("checkStep1Title")}</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {t("checkStep1Desc")}
                    </p>
                  </div>
                  <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 space-y-1.5">
                    <span className="font-semibold text-gray-200 block">{t("checkStep2Title")}</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {t("checkStep2Desc")}
                    </p>
                  </div>
                  <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 space-y-1.5">
                    <span className="font-semibold text-gray-200 block">{t("checkStep3Title")}</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {t("checkStep3Desc")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : activePlatform === "android" ? (
            /* Android Right Outputs */
            <>
              {/* Provisioning Command: keytool */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isZh ? "生成密钥库命令行" : "Generate Keystore CLI Tool"}</span>
                  </div>
                  <button
                    id="copy-keytool-btn"
                    onClick={() => handleCopy(getKeytoolCommand(), "keytool")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-gray-100 transition-colors cursor-pointer"
                  >
                    {copied === "keytool" ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-semibold">{copied === "keytool" ? t("copied") : "Copy Command"}</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-950/40 font-mono text-[11px] text-gray-300 leading-relaxed overflow-auto">
                  <pre className="whitespace-pre-wrap">{getKeytoolCommand()}</pre>
                </div>
                <div className="p-3 bg-gray-900/20 text-[10px] text-gray-400 border-t border-gray-800">
                  {isZh 
                    ? "在终端运行此 Java keytool 命令。它将在当前目录生成一个高强度安全的密钥库文件，确保应用长久签名有效。" 
                    : "Execute this command in your terminal. It leverages Java SDK keytool utility to instantiate a durable cryptographic signature key."}
                </div>
              </div>

              {/* Gradle Config template */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isZh ? "Gradle 脚本签名块 (build.gradle)" : "Gradle signingConfigs Block"}</span>
                  </div>
                  <button
                    id="copy-gradle-btn"
                    onClick={() => handleCopy(getGradleSigningConfig(), "gradle")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-gray-100 transition-colors cursor-pointer"
                  >
                    {copied === "gradle" ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-semibold">{copied === "gradle" ? t("copied") : "Copy Gradle"}</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-950/40 font-mono text-[11px] text-gray-300 leading-relaxed overflow-auto">
                  <pre>{getGradleSigningConfig()}</pre>
                </div>
                <div className="p-3 bg-gray-900/20 text-[10px] text-gray-400 border-t border-gray-800">
                  {isZh 
                    ? (projectType === "unity" ? "将此段配置粘贴到 Unity 导出的 Android Gradle 签名配置中，或者直接应用到 CI/CD 自动打包容器设置中。" : "将此段配置粘贴到 Unreal 导出的 Android Gradle 签名配置中，或者直接应用到 CI/CD 自动打包容器设置中。")
                    : (projectType === "unity" ? "Embed this block inside launcher/build.gradle's android {} context to automate release package signing in Unity headless compilation." : "Embed this block inside the Android build configuration to automate release package signing in Unreal Engine builds.")}
                </div>
              </div>

              {/* apksigner tool */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isZh ? "apksigner 手动签署 APK 命令行" : "apksigner CLI Sign Tool"}</span>
                  </div>
                  <button
                    id="copy-apksigner-btn"
                    onClick={() => handleCopy(getApksignerCommand(), "apksigner")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-indigo-600 hover:text-gray-100 transition-colors cursor-pointer"
                  >
                    {copied === "apksigner" ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-semibold">{copied === "apksigner" ? t("copied") : "Copy Command"}</span>
                  </button>
                </div>
                <div className="p-4 bg-gray-950/40 font-mono text-[11px] text-gray-300 leading-relaxed overflow-auto">
                  <pre className="whitespace-pre-wrap">{getApksignerCommand()}</pre>
                </div>
                <div className="p-3 bg-gray-900/20 text-[10px] text-gray-400 border-t border-gray-800">
                  {isZh 
                    ? "适用于对未经签署的 (Unsigned) APK 进行命令行最终手动签名，支持最新的 V2 和 V3 验证机制。" 
                    : "For manual post-build signing of raw unsigned APK packages. apksigner validates V1 to V4 signature schemes natively."}
                </div>
              </div>

              {/* Security Advisory card */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm text-xs leading-relaxed">
                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-sans flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  {isZh ? "Android 签名安全与发布常识清单" : "Android Keystore Best Practices"}
                </h4>

                <div className="space-y-3 text-gray-400">
                  <p>
                    <strong className="text-gray-200">1. {isZh ? "Google Play 应用签名计划" : "Google Play App Signing"}:</strong>{" "}
                    {isZh 
                      ? "现代分发机制极力推荐在 Google Play Console 中启用‘谷歌应用签名’。您只需在本地保管好用于打包上传的上传密钥 (Upload Key)，谷歌会在云端保护和应用您最终对外的正式发布密钥 (Release Key)，避免泄露风险。" 
                      : "We highly recommend using Google Play App Signing. You upload using your Upload Key, and Google securely manages the final App Signing Key, preventing tragic permanent lockouts if you lose your keystore."}
                  </p>
                  <p>
                    <strong className="text-gray-200">2. {isZh ? "密钥库遗失的严重后果" : "Consequences of Key Loss"}:</strong>{" "}
                    {isZh 
                      ? "对于未启用谷歌签名服务、完全使用本地密钥库的老应用，一旦遗失 Keystore 文件或忘记访问密码，您将永远无法针对已安装应用的手机推送版本覆盖更新。请将其进行多副本离线冷备份。" 
                      : "For legacy non-Play app signing, losing your keystore means you will NEVER be able to update existing apps on user devices. Backup your keystore safely in password-encrypted offline repositories."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* SSH Right Outputs */
            <>
              {/* SSH Config script viewer */}
              <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border-b border-gray-800 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    <span>~/.ssh/config Setup Script</span>
                  </div>
                  <button
                    onClick={() => handleCopy(`mkdir -p ~/.ssh\nchmod 700 ~/.ssh\n\ncat << \'EOF\' > ~/.ssh/${sshKeyName}\n${sshPrivateKey}\nEOF\n\nchmod 600 ~/.ssh/${sshKeyName}\n\ncat << \'EOF\' >> ~/.ssh/config\nHost *\n  StrictHostKeyChecking no\n  IdentityFile ~/.ssh/${sshKeyName}\nEOF`, 'ssh-setup')}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {copied === "ssh-setup" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isZh ? "复制" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-[11px] font-mono leading-relaxed text-indigo-300">
                    <span className="text-gray-500"># 1. Create SSH directory & set permissions</span>{"\n"}
                    mkdir -p ~/.ssh{"\n"}
                    chmod 700 ~/.ssh{"\n\n"}
                    <span className="text-gray-500"># 2. Save private key</span>{"\n"}
                    cat {"<<"} 'EOF' {">"} ~/.ssh/{sshKeyName}{"\n"}
                    <span className="text-gray-400">{sshPrivateKey}</span>{"\n"}
                    EOF{"\n\n"}
                    chmod 600 ~/.ssh/{sshKeyName}{"\n\n"}
                    <span className="text-gray-500"># 3. Configure SSH client</span>{"\n"}
                    cat {"<<"} 'EOF' {">>"} ~/.ssh/config{"\n"}
                    Host *{"\n"}
                    {"  "}StrictHostKeyChecking no{"\n"}
                    {"  "}IdentityFile ~/.ssh/{sshKeyName}{"\n"}
                    EOF{"\n\n"}
                    <span className="text-gray-500"># 4. Clone repository</span>{"\n"}
                    git clone {sshGitUrl}
                  </pre>
                </div>
              </div>

              {/* SSH Security notice */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    {isZh ? "凭据泄露警告" : "Credential Leakage Warning"}
                  </h4>
                  <p className="text-[11px] text-amber-200/70 leading-relaxed font-sans">
                    {isZh 
                      ? "SSH 私钥必须妥善保管。请勿将此脚本或私钥原文提交到任何公开或未加密的代码库。强烈建议在 CI/CD 系统中使用 Secret 变量注入机制。" 
                      : "SSH private keys must be handled securely. Never commit this script or the raw private key to any public or unencrypted repository. We strongly recommend using CI/CD secret injection variables."}
                  </p>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
