import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Keyboard, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const globalShortcuts = [
    { keys: ["Ctrl", "K"], descEn: "Toggle Command Palette", descZh: "打开/关闭命令面板" },
    { keys: ["Ctrl", "B"], descEn: "Toggle Sidebar Compact", descZh: "收起/展开侧边栏" },
    { keys: ["Ctrl", "/"], keysAlt: ["?"], descEn: "Show Help & Shortcuts", descZh: "打开快捷键帮助" },
  ];

  const navigationShortcuts = [
    { keys: ["Ctrl", "1"], descEn: "Build Dashboard", descZh: "查看构建仪表盘" },
    { keys: ["Ctrl", "2"], descEn: "Pipeline Designer", descZh: "查看流水线设计器" },
    { keys: ["Ctrl", "L"], descEn: "System Run Logs", descZh: "查看系统运行日志" },
    { keys: ["Ctrl", "3"], descEn: "Build Troubleshooter", descZh: "构建故障排除" },
    { keys: ["Ctrl", "4"], descEn: "AI Script Architect", descZh: "自动化脚本生成" },
    { keys: ["Ctrl", "5"], descEn: "Production Suite", descZh: "生产发布套件" },
    { keys: ["Ctrl", "6"], descEn: "Signing & Credentials", descZh: "证书签名自查" },
    { keys: ["Ctrl", "7"], descEn: "SSH Key Manager", descZh: "SSH 密钥管理" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-950/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Keyboard className="h-4.5 w-4.5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100">
                    {isZh ? "键盘快捷键 & 帮助" : "Keyboard Shortcuts & Help"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {isZh ? "利用全局热键实现高能构建工作流" : "Boost productivity with global key bindings"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-100 hover:bg-gray-800/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Global commands */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                  {isZh ? "全局操作" : "Global Actions"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {globalShortcuts.map((sh, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-950/40 border border-gray-850/60 rounded-xl">
                      <span className="text-[11px] font-medium text-gray-300">
                        {isZh ? sh.descZh : sh.descEn}
                      </span>
                      <div className="flex items-center gap-1">
                        {sh.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span className="text-gray-600 text-[10px]">+</span>}
                            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-gray-900 border border-gray-800 rounded text-indigo-300 shadow shadow-black">
                              {k}
                            </kbd>
                          </React.Fragment>
                        ))}
                        {sh.keysAlt && (
                          <>
                            <span className="text-gray-600 text-[10px]">/</span>
                            {sh.keysAlt.map((k, kIdx) => (
                              <kbd key={kIdx} className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-gray-900 border border-gray-800 rounded text-indigo-300 shadow shadow-black">
                                {k}
                              </kbd>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Shortcuts */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                  {isZh ? "视图与标签导航" : "View & Tab Navigation"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navigationShortcuts.map((sh, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-950/40 border border-gray-850/60 rounded-xl">
                      <span className="text-[11px] font-medium text-gray-300">
                        {isZh ? sh.descZh : sh.descEn}
                      </span>
                      <div className="flex items-center gap-1">
                        {sh.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span className="text-gray-600 text-[10px]">+</span>}
                            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-gray-900 border border-gray-800 rounded text-indigo-300 shadow shadow-black">
                              {k}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro-Tips footer inside modal */}
              <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-2.5">
                <span className="text-xs">💡</span>
                <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                  {isZh ? (
                    <>
                      在任何输入框外部按下 <kbd className="px-1 py-0.5 text-[9px] bg-gray-950 border border-gray-800 rounded mx-0.5">?</kbd> 即可随时调起此快捷键浮窗。
                    </>
                  ) : (
                    <>
                      Press <kbd className="px-1 py-0.5 text-[9px] bg-gray-950 border border-gray-800 rounded mx-0.5">?</kbd> outside of input elements to bring up this helper modal at any time.
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
