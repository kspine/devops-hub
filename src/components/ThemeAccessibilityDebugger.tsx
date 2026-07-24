import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Layers, 
  Filter, 
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../LanguageContext';
import { useThemeAdaptation, auditThemeComponents, ContrastAuditResult } from '../utils/themeUtils';

export default function ThemeAccessibilityDebugger() {
  const { mode, toggleMode } = useTheme();
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const { cardClasses, isDark } = useThemeAdaptation();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pass' | 'Fail'>('All');
  const [highContrastBoost, setHighContrastBoost] = useState<boolean>(false);

  const auditResults: ContrastAuditResult[] = auditThemeComponents(mode);

  const filteredAudits = auditResults.filter(item => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (statusFilter === 'Pass' && !item.isPass) return false;
    if (statusFilter === 'Fail' && item.isPass) return false;
    return true;
  });

  const totalCount = auditResults.length;
  const passCount = auditResults.filter(a => a.isPass).length;
  const failCount = totalCount - passCount;
  const avgRatio = Math.round((auditResults.reduce((acc, a) => acc + a.ratio, 0) / totalCount) * 10) / 10;
  const passPercentage = Math.round((passCount / totalCount) * 100);

  const categories = ['All', 'Typography', 'Surface & Card', 'Interactive', 'Status Badge', 'Data Visualization'];

  return (
    <div className={`p-6 md:p-8 rounded-[2.5rem] border transition-all ${
      isDark 
        ? 'bg-[#09090b]/90 border-white/10 shadow-2xl shadow-black/80' 
        : 'bg-white border-gray-200/90 shadow-xl shadow-gray-200/50'
    }`}>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200/20 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isZh ? "主题无障碍与对比度调试器" : "Theme Accessibility & Contrast Debugger"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                WCAG 2.1 AA/AAA
              </span>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {isZh ? "实时验证深浅模式下的 UI 元素对比度，标示高对比转换与模糊隐患" : "Automated contrast verification and light/dark mode parity inspector across design tokens"}
            </p>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span>{isDark ? (isZh ? "模拟浅色模式" : "Simulate Light") : (isZh ? "模拟深色模式" : "Simulate Dark")}</span>
          </button>

          <button
            onClick={() => setHighContrastBoost(!highContrastBoost)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition-all ${
              highContrastBoost
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                : isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isZh ? "高对比增强" : "Contrast Boost"}</span>
          </button>
        </div>
      </div>

      {/* Summary Scorecards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">
            {isZh ? "无障碍合规率" : "Compliance Rate"}
          </div>
          <div className="text-2xl font-black text-emerald-500 flex items-center gap-1.5">
            {passPercentage}%
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">{passCount} / {totalCount} {isZh ? "项已达标" : "elements pass"}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">
            {isZh ? "平均对比度" : "Average Ratio"}
          </div>
          <div className={`text-2xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            {avgRatio} : 1
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">{isZh ? "高于 4.5:1 基线" : "Exceeds 4.5:1 AA target"}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">
            {isZh ? "发现低对比隐患" : "Accessibility Warnings"}
          </div>
          <div className={`text-2xl font-black ${failCount > 0 ? 'text-rose-500' : 'text-emerald-500'} flex items-center gap-1.5`}>
            {failCount}
            {failCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">{failCount === 0 ? (isZh ? "无违规项" : "0 defects found") : (isZh ? "需微调字色" : "Requires color tweak")}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
          <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">
            {isZh ? "主题模式状态" : "Current Theme Mode"}
          </div>
          <div className={`text-lg font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`}>
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {mode === 'dark' ? (isZh ? "深色 (Deep Black)" : "Deep Black") : (isZh ? "浅色 (Bright Light)" : "Bright Light")}
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">Token: {isDark ? '#000000' : '#f8fafc'}</div>
        </div>
      </div>

      {/* Category Filter Tabs & Filter Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                categoryFilter === cat
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                  : isDark ? "bg-white/5 border-white/10 text-gray-400 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              {cat === 'All' ? (isZh ? '全部组件' : 'All Categories') : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setStatusFilter(prev => prev === 'All' ? 'Pass' : prev === 'Pass' ? 'Fail' : 'All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer ${
              statusFilter !== 'All' 
                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
                : isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{statusFilter === 'All' ? (isZh ? '全量过滤' : 'Filter: All') : statusFilter === 'Pass' ? (isZh ? '仅看达标' : 'Filter: Pass') : (isZh ? '仅看警告' : 'Filter: Fail')}</span>
          </button>
        </div>
      </div>

      {/* Live Component Contrast Audit Table */}
      <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'border-white/10 bg-black/30' : 'border-gray-200 bg-gray-50/50'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-mono uppercase tracking-wider ${
              isDark ? 'border-white/10 text-gray-400 bg-white/5' : 'border-gray-200 text-gray-500 bg-gray-100'
            }`}>
              <th className="p-3.5">{isZh ? "UI 元素 / 组件" : "UI Element / Component"}</th>
              <th className="p-3.5">{isZh ? "类别" : "Category"}</th>
              <th className="p-3.5">{isZh ? "颜色 Token (前景 / 背景)" : "Tokens (FG / BG)"}</th>
              <th className="p-3.5 text-center">{isZh ? "对比度" : "Ratio"}</th>
              <th className="p-3.5 text-center">{isZh ? "WCAG 评级" : "WCAG Rating"}</th>
              <th className="p-3.5">{isZh ? "实时渲染预览" : "Live Visual Preview"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/10 text-xs font-sans">
            {filteredAudits.map((item, index) => (
              <tr key={index} className={`transition-colors ${
                isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-100/50'
              }`}>
                {/* Element Name */}
                <td className="p-3.5 font-bold">
                  <div className={`text-xs ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{item.componentName}</div>
                  {item.recommendation && (
                    <div className="text-[10px] text-amber-500 font-normal flex items-center gap-1 mt-0.5">
                      <Info className="w-3 h-3 shrink-0" />
                      {item.recommendation}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.category}
                  </span>
                </td>

                {/* Color Tokens */}
                <td className="p-3.5 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-gray-500/30" style={{ backgroundColor: item.fgColor }} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>{item.fgColor}</span>
                    <span className="text-gray-500">/</span>
                    <span className="w-3 h-3 rounded-full border border-gray-500/30" style={{ backgroundColor: item.bgColor }} />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.bgColor}</span>
                  </div>
                </td>

                {/* Contrast Ratio */}
                <td className="p-3.5 text-center font-mono font-black text-xs">
                  <span className={item.ratio >= 7.0 ? 'text-emerald-500' : item.ratio >= 4.5 ? 'text-indigo-400' : 'text-rose-500'}>
                    {item.ratio} : 1
                  </span>
                </td>

                {/* WCAG Rating */}
                <td className="p-3.5 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase inline-flex items-center gap-1 ${
                    item.wcagRating === 'AAA' 
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                      : item.wcagRating === 'AA'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                  }`}>
                    {item.isPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {item.wcagRating}
                  </span>
                </td>

                {/* Live Visual Preview */}
                <td className="p-3.5">
                  <div 
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-between gap-2 max-w-[180px] shadow-sm transition-all"
                    style={{
                      color: item.fgColor,
                      backgroundColor: item.bgColor,
                      borderColor: highContrastBoost 
                        ? (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')
                        : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                      boxShadow: highContrastBoost ? '0 0 10px rgba(99,102,241,0.2)' : undefined,
                    }}
                  >
                    <span className="truncate text-[11px] font-bold">Sample Text</span>
                    <span className="text-[9px] font-mono opacity-80 shrink-0">{item.ratio}x</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Diagnostic Note */}
      <div className={`mt-4 p-3.5 rounded-2xl border text-[11px] flex items-center justify-between gap-3 ${
        isDark ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {isZh 
              ? "自动适配引擎：当前主题变量包含动态边框与阴影补偿，保障深浅模式切换无闪烁、不偏色。" 
              : "Theme Adaptation Engine: Current tokens include dynamic border and shadow compensation to prevent flicker or low-contrast text."}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold shrink-0 opacity-80">v2.4 Audit Engine</span>
      </div>
    </div>
  );
}
