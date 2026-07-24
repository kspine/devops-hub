import sys

with open('src/components/SigningHelper.tsx', 'r') as f:
    content = f.read()

# Replace the last `          )}` with `          ) : (` and then append the SSH part
parts = content.rsplit('          )}', 1)

new_content = parts[0] + '''          ) : (
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
                    onClick={() => handleCopy(`mkdir -p ~/.ssh\\nchmod 700 ~/.ssh\\n\\ncat << \\'EOF\\' > ~/.ssh/${sshKeyName}\\n${sshPrivateKey}\\nEOF\\n\\nchmod 600 ~/.ssh/${sshKeyName}\\n\\ncat << \\'EOF\\' >> ~/.ssh/config\\nHost *\\n  StrictHostKeyChecking no\\n  IdentityFile ~/.ssh/${sshKeyName}\\nEOF`, 'ssh-setup')}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {copied === "ssh-setup" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isZh ? "复制" : "Copy"}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-[11px] font-mono leading-relaxed text-indigo-300">
                    <span className="text-gray-500"># 1. Create SSH directory & set permissions</span>{"\\n"}
                    mkdir -p ~/.ssh{"\\n"}
                    chmod 700 ~/.ssh{"\\n\\n"}
                    <span className="text-gray-500"># 2. Save private key</span>{"\\n"}
                    cat {"<<"} 'EOF' {">"} ~/.ssh/{sshKeyName}{"\\n"}
                    <span className="text-gray-400">{sshPrivateKey}</span>{"\\n"}
                    EOF{"\\n\\n"}
                    chmod 600 ~/.ssh/{sshKeyName}{"\\n\\n"}
                    <span className="text-gray-500"># 3. Configure SSH client</span>{"\\n"}
                    cat {"<<"} 'EOF' {">>"} ~/.ssh/config{"\\n"}
                    Host *{"\\n"}
                    {"  "}StrictHostKeyChecking no{"\\n"}
                    {"  "}IdentityFile ~/.ssh/{sshKeyName}{"\\n"}
                    EOF{"\\n\\n"}
                    <span className="text-gray-500"># 4. Clone repository</span>{"\\n"}
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
          )}''' + parts[1]

with open('src/components/SigningHelper.tsx', 'w') as f:
    f.write(new_content)
