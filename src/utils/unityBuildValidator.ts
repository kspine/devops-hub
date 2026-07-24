export interface UnityValidationIssue {
  id: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  titleZh: string;
  titleEn: string;
  messageZh: string;
  messageEn: string;
  recommendationZh: string;
  recommendationEn: string;
  fixSnippet?: string;
  autoFixable?: boolean;
}

export function validateUnityScriptConfig(
  text: string, 
  language: string = 'csharp', 
  unityVersion: string = '2022.3 LTS'
): UnityValidationIssue[] {
  if (!text || text.trim().length === 0) return [];

  const issues: UnityValidationIssue[] = [];
  const lowerText = text.toLowerCase();
  const isCsharp = language === 'csharp' || text.includes('using Unity') || text.includes('PlayerSettings') || text.includes('BuildPipeline');

  // 1. Missing #if UNITY_EDITOR Guard on Editor APIs
  const usesEditorAPI = /PlayerSettings|BuildPipeline|EditorUserBuildSettings|AssetDatabase|EditorUtility|AddressableAssetSettingsDefaultObject|BuildPlayerOptions/.test(text);
  const hasEditorGuard = text.includes('#if UNITY_EDITOR') || text.includes('UNITY_EDITOR') || text.includes('/Editor/');
  
  if (isCsharp && usesEditorAPI && !hasEditorGuard) {
    issues.push({
      id: 'missing-editor-guard',
      code: 'UNITY_EDITOR_GUARD_MISSING',
      severity: 'error',
      titleZh: '缺少 #if UNITY_EDITOR 编译隔离保护',
      titleEn: 'Missing #if UNITY_EDITOR Preprocessor Guard',
      messageZh: '检测到脚本使用了 UnityEditor 级别的 API (如 PlayerSettings, BuildPipeline)，但在非 Editor 打包运行时包含该脚本会导致 Player 构建报错。',
      messageEn: 'Detected UnityEditor APIs (e.g. PlayerSettings, BuildPipeline). Without #if UNITY_EDITOR, stand-alone player builds will fail compilation.',
      recommendationZh: '将代码放入 Editor/ 文件夹下或用 `#if UNITY_EDITOR ... #endif` 块包裹。',
      recommendationEn: 'Place script under an Editor/ folder or wrap with `#if UNITY_EDITOR ... #endif`.',
      autoFixable: true,
      fixSnippet: '#if UNITY_EDITOR\nusing UnityEditor;\n#endif\n'
    });
  }

  // 2. Hardcoded Absolute Local Paths
  const hasHardcodedPath = /(?:[A-Za-z]:\\|(?:\/[a-zA-Z0-9_\-]+){3,})/.test(text) && 
    !text.includes('Application.dataPath') && 
    !text.includes('Application.persistentDataPath') && 
    !text.includes('System.IO.Path.Combine');

  if (hasHardcodedPath && (isCsharp || lowerText.includes('path') || lowerText.includes('build'))) {
    issues.push({
      id: 'hardcoded-absolute-path',
      code: 'HARDCODED_ABSOLUTE_PATH',
      severity: 'warning',
      titleZh: '使用了硬编码绝对盘符路径',
      titleEn: 'Hardcoded Absolute File System Path',
      messageZh: '检测到脚本中包含了本地绝对路径 (如 C:\\, /Users/...)。跨平台 CI/CD Runner 或团队其他成员将无法找到该路径。',
      messageEn: 'Hardcoded absolute paths found. CI/CD cloud runners or teammates on different OS environments will fail to locate this path.',
      recommendationZh: '使用 Application.dataPath、Path.Combine 或相对工程目录路径。',
      recommendationEn: 'Use Application.dataPath, Path.Combine, or relative project paths.',
      autoFixable: true
    });
  }

  // 3. Unprotected Keystore / Password Secrets
  const hasKeystorePass = /keystorepass\s*=\s*["'][^"']+["']|keyaliaspass\s*=\s*["'][^"']+["']|android\.keystorepass/i.test(text);
  if (hasKeystorePass) {
    issues.push({
      id: 'unprotected-keystore-secret',
      code: 'HARDCODED_KEYSTORE_PASSWORD',
      severity: 'error',
      titleZh: '发现硬编码的 Android 密钥库 (Keystore) 密码',
      titleEn: 'Hardcoded Keystore Credentials Detected',
      messageZh: '密钥库密码直接硬编码在 C#/构建脚本中，存在严重的代码凭据泄漏风险。',
      messageEn: 'Keystore passwords are hardcoded in source files, exposing sensitive production credentials.',
      recommendationZh: '应通过 System.Environment.GetEnvironmentVariable("KEYSTORE_PASS") 或 Vault 秘钥动态读取。',
      recommendationEn: 'Retrieve passwords dynamically via System.Environment.GetEnvironmentVariable() or Vault secrets.',
      autoFixable: true
    });
  }

  // 4. Batchmode missing EditorApplication.Exit(0)
  const isBatchModeScript = lowerText.includes('batchmode') || lowerText.includes('buildplayer') || lowerText.includes('autobuild') || lowerText.includes('commandline');
  const hasExitCall = text.includes('EditorApplication.Exit') || text.includes('System.Environment.Exit');
  if (isCsharp && isBatchModeScript && !hasExitCall) {
    issues.push({
      id: 'batchmode-missing-exit',
      code: 'BATCHMODE_NO_EXIT_CODE',
      severity: 'warning',
      titleZh: 'CLI Batchmode 自动化构建缺失 Exit 退出指令',
      titleEn: 'Batchmode Build Script Missing EditorApplication.Exit()',
      messageZh: '静默命令行模式 (-batchmode) 下完成打包后未调用 EditorApplication.Exit(0)，可能导致 CI/CD 进程挂起阻塞。',
      messageEn: 'CLI batchmode builds lacking EditorApplication.Exit(0) may cause CI/CD runners to hang indefinitely.',
      recommendationZh: '请在构建完成或捕获异常末尾添加 `EditorApplication.Exit(0);` 或 `EditorApplication.Exit(1);`。',
      recommendationEn: 'Add `EditorApplication.Exit(0);` upon build completion or `EditorApplication.Exit(1);` on failure.',
      autoFixable: true
    });
  }

  // 5. iOS Bitcode Deprecation Warning
  if (lowerText.includes('enable_bitcode') || lowerText.includes('enablebitcode = true') || lowerText.includes('bitcode')) {
    issues.push({
      id: 'ios-bitcode-deprecated',
      code: 'IOS_BITCODE_DEPRECATED',
      severity: 'warning',
      titleZh: 'iOS Bitcode 选项已过时废弃',
      titleEn: 'iOS Bitcode Deprecated in Xcode 14+',
      messageZh: 'Apple 在 Xcode 14/15 中已全面废弃并移除 Bitcode 支持。启用 Bitcode 可能导致 iOS 上架 App Store 构建失败。',
      messageEn: 'Apple deprecated Bitcode starting Xcode 14 and removed support in Xcode 15. Enabling it can cause App Store upload rejection.',
      recommendationZh: '建议显式设置 PlayerSettings.iOS.appleEnableAutomaticSigning 或禁用 Bitcode。',
      recommendationEn: 'Set PlayerSettings.iOS.appleEnableAutomaticSigning and disable Bitcode in PlayerSettings.',
      autoFixable: false
    });
  }

  // 6. Addressables Null Check
  if (lowerText.includes('addressable') && !lowerText.includes('addressableassetsettingsdefaultobject.settings')) {
    issues.push({
      id: 'addressables-null-check',
      code: 'ADDRESSABLES_SETTINGS_NULL_CHECK',
      severity: 'info',
      titleZh: 'Addressables Settings 空指针检查提示',
      titleEn: 'Addressables Settings Initialization Check',
      messageZh: '构建 Addressables 资源包前建议预先校验 AddressableAssetSettingsDefaultObject.Settings 是否初始化成功。',
      messageEn: 'Ensure AddressableAssetSettingsDefaultObject.Settings is validated before executing hot-update builds.',
      recommendationZh: '增加 `if (AddressableAssetSettingsDefaultObject.Settings == null)` 保护逻辑。',
      recommendationEn: 'Include a check for `AddressableAssetSettingsDefaultObject.Settings == null`.',
      autoFixable: false
    });
  }

  return issues;
}

export function autoFixUnityScript(
  codeOrPrompt: string, 
  issueId: string
): string {
  let fixed = codeOrPrompt;

  if (issueId === 'missing-editor-guard') {
    if (!fixed.includes('#if UNITY_EDITOR')) {
      fixed = `#if UNITY_EDITOR\nusing UnityEditor;\n#endif\n\n${fixed}`;
    }
  } else if (issueId === 'hardcoded-absolute-path') {
    fixed = fixed
      .replace(/["'][A-Za-z]:\\[^"']+["']/g, 'System.IO.Path.Combine(UnityEngine.Application.dataPath, "Builds")')
      .replace(/["']\/(?:Users|home|var)\/[^"']+["']/g, 'System.IO.Path.Combine(UnityEngine.Application.dataPath, "Builds")');
  } else if (issueId === 'unprotected-keystore-secret') {
    fixed = fixed
      .replace(/keystorePass\s*=\s*["'][^"']+["']/gi, 'keystorePass = System.Environment.GetEnvironmentVariable("KEYSTORE_PASS")')
      .replace(/keyaliasPass\s*=\s*["'][^"']+["']/gi, 'keyaliasPass = System.Environment.GetEnvironmentVariable("KEYALIAS_PASS")');
  } else if (issueId === 'batchmode-missing-exit') {
    if (!fixed.includes('EditorApplication.Exit')) {
      fixed = `${fixed}\n\n// Exit Unity Editor with status 0 for CI/CD runners\n#if UNITY_EDITOR\nUnityEditor.EditorApplication.Exit(0);\n#endif`;
    }
  }

  return fixed;
}
