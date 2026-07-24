import { useTheme } from '../context/ThemeContext';

export interface ContrastAuditResult {
  componentName: string;
  category: 'Typography' | 'Surface & Card' | 'Interactive' | 'Status Badge' | 'Data Visualization';
  fgColor: string;
  bgColor: string;
  ratio: number;
  wcagRating: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  isPass: boolean;
  recommendation?: string;
}

/**
 * Converts HEX color to RGB array [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    return [0, 0, 0];
  }
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates WCAG 2.1 relative luminance for an RGB tuple
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const R = rsRGB <= 0.04045 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const G = gsRGB <= 0.04045 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const B = bsRGB <= 0.04045 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates contrast ratio between foreground and background colors
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const [r1, g1, b1] = hexToRgb(fgHex);
  const [r2, g2, b2] = hexToRgb(bgHex);

  const l1 = getRelativeLuminance(r1, g1, b1);
  const l2 = getRelativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

/**
 * Maps contrast ratio to WCAG rating
 */
export function getWCAGRating(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3.0) return 'AA Large';
  return 'Fail';
}

/**
 * Preset key UI element definitions for Light and Dark modes
 */
export function auditThemeComponents(mode: 'light' | 'dark'): ContrastAuditResult[] {
  const audits: {
    componentName: string;
    category: ContrastAuditResult['category'];
    lightFg: string;
    lightBg: string;
    darkFg: string;
    darkBg: string;
    recLight?: string;
    recDark?: string;
  }[] = [
    {
      componentName: 'Primary Heading (H1/H2)',
      category: 'Typography',
      lightFg: '#09090b',
      lightBg: '#ffffff',
      darkFg: '#ffffff',
      darkBg: '#000000',
    },
    {
      componentName: 'Card Body Text',
      category: 'Typography',
      lightFg: '#18181b',
      lightBg: '#ffffff',
      darkFg: '#e4e4e7',
      darkBg: '#0a0a0a',
    },
    {
      componentName: 'Secondary / Subtitle Text',
      category: 'Typography',
      lightFg: '#52525b',
      lightBg: '#f4f4f5',
      darkFg: '#a1a1aa',
      darkBg: '#121212',
    },
    {
      componentName: 'Muted Code Labels',
      category: 'Typography',
      lightFg: '#71717a',
      lightBg: '#f4f4f5',
      darkFg: '#71717a',
      darkBg: '#0a0a0a',
      recLight: 'Slightly darken text for low-contrast small labels',
    },
    {
      componentName: 'Main Card Surface',
      category: 'Surface & Card',
      lightFg: '#09090b',
      lightBg: '#fafafa',
      darkFg: '#ffffff',
      darkBg: '#0a0a0a',
    },
    {
      componentName: 'Elevated Modal Backdrop',
      category: 'Surface & Card',
      lightFg: '#09090b',
      lightBg: '#ffffff',
      darkFg: '#ffffff',
      darkBg: '#121212',
    },
    {
      componentName: 'Accent Button (Indigo)',
      category: 'Interactive',
      lightFg: '#ffffff',
      lightBg: '#4f46e5',
      darkFg: '#ffffff',
      darkBg: '#6366f1',
    },
    {
      componentName: 'Secondary Outline Button',
      category: 'Interactive',
      lightFg: '#18181b',
      lightBg: '#f4f4f5',
      darkFg: '#f4f4f5',
      darkBg: '#18181b',
    },
    {
      componentName: 'Input Field Placeholder',
      category: 'Interactive',
      lightFg: '#71717a',
      lightBg: '#ffffff',
      darkFg: '#71717a',
      darkBg: '#0a0a0a',
      recLight: 'Ensure placeholder contrast exceeds 4.5:1 ratio',
    },
    {
      componentName: 'Success Badge (Passed)',
      category: 'Status Badge',
      lightFg: '#047857',
      lightBg: '#ecfdf5',
      darkFg: '#34d399',
      darkBg: '#064e3b',
    },
    {
      componentName: 'Warning Badge (Alert)',
      category: 'Status Badge',
      lightFg: '#b45309',
      lightBg: '#fffbeb',
      darkFg: '#fbbf24',
      darkBg: '#78350f',
    },
    {
      componentName: 'Failure Badge (Error)',
      category: 'Status Badge',
      lightFg: '#be123c',
      lightBg: '#fff1f2',
      darkFg: '#f87171',
      darkBg: '#881337',
    },
    {
      componentName: 'D3 Chart Grid Lines',
      category: 'Data Visualization',
      lightFg: '#e4e4e7',
      lightBg: '#ffffff',
      darkFg: '#27272a',
      darkBg: '#000000',
    },
    {
      componentName: 'Telemetry Metric Sparkline',
      category: 'Data Visualization',
      lightFg: '#6366f1',
      lightBg: '#f8fafc',
      darkFg: '#818cf8',
      darkBg: '#030712',
    },
  ];

  return audits.map(item => {
    const fg = mode === 'light' ? item.lightFg : item.darkFg;
    const bg = mode === 'light' ? item.lightBg : item.darkBg;
    const ratio = calculateContrastRatio(fg, bg);
    const wcagRating = getWCAGRating(ratio);
    const isPass = ratio >= 4.5;

    return {
      componentName: item.componentName,
      category: item.category,
      fgColor: fg,
      bgColor: bg,
      ratio,
      wcagRating,
      isPass,
      recommendation: isPass
        ? undefined
        : mode === 'light'
        ? item.recLight || 'Increase text darkness or brighten background for WCAG AA compliance.'
        : item.recDark || 'Increase text brightness or darken background for WCAG AA compliance.',
    };
  });
}

/**
 * Custom hook providing theme adaptation tokens and dynamic styles
 */
export function useThemeAdaptation() {
  const { mode, theme } = useTheme();

  const isDark = mode === 'dark';

  return {
    mode,
    theme,
    isDark,

    // Dynamic class generator helpers
    cardClasses: isDark
      ? 'bg-[#0a0a0a] border-white/10 text-white shadow-2xl shadow-black/60'
      : 'bg-white border-gray-200/80 text-gray-900 shadow-sm shadow-gray-200/50',

    surfaceClasses: isDark
      ? 'bg-[#121212] border-white/5 text-gray-200'
      : 'bg-gray-50/80 border-gray-200/60 text-gray-800',

    inputClasses: isDark
      ? 'bg-black/50 border-white/10 text-white placeholder-gray-500 focus:border-indigo-500/50'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30',

    borderClasses: isDark ? 'border-white/10' : 'border-gray-200',

    textPrimaryClasses: isDark ? 'text-white' : 'text-gray-900',
    textSecondaryClasses: isDark ? 'text-gray-400' : 'text-gray-600',
    textMutedClasses: isDark ? 'text-gray-500' : 'text-gray-500',

    // Inline style overrides if needed
    cardStyle: {
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border-subtle)',
      color: 'var(--text-primary)',
    },

    surfaceStyle: {
      backgroundColor: 'var(--bg-surface)',
      borderColor: 'var(--border-subtle)',
      color: 'var(--text-primary)',
    },

    shadowStyle: isDark
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',

    contrastRatioMin: isDark ? 4.5 : 7.0,

    auditComponents: () => auditThemeComponents(mode),
  };
}
