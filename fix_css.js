const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Remove everything from "/* ==========================================" onwards
const splitPoint = css.indexOf('/* ==========================================');
if (splitPoint !== -1) {
    css = css.substring(0, splitPoint);
}

// Append the new Tailwind variable overrides
css += `
/* ==========================================
   Light Theme Variable Swaps (Tailwind v4)
   ========================================== */
.theme-light {
  /* Swap grays for perfect light mode */
  --color-gray-950: #ffffff; 
  --color-gray-900: oklch(96.7% .003 264.542); /* gray-100 */
  --color-gray-850: oklch(94.8% .004 264.531); /* custom gray-150 */
  --color-gray-800: oklch(92.8% .006 264.531); /* gray-200 */
  --color-gray-700: oklch(87.2% .01 258.338); /* gray-300 */
  --color-gray-600: oklch(70.7% .022 261.325); /* gray-400 */
  --color-gray-500: oklch(55.1% .027 264.364); /* gray-500 */
  --color-gray-400: oklch(44.6% .03 256.802); /* gray-600 */
  --color-gray-300: oklch(37.3% .034 259.733); /* gray-700 */
  --color-gray-200: oklch(27.8% .033 256.848); /* gray-800 */
  --color-gray-100: oklch(21% .034 264.665); /* gray-900 */
  
  /* Swap base body bg */
  background-color: var(--color-gray-950);
}

.theme-light body {
  background-color: var(--color-gray-950);
}

/* Fix Recharts axis for light mode since it doesn't use standard Tailwind vars */
.theme-light .recharts-cartesian-grid line {
  stroke: var(--color-gray-800) !important;
}
.theme-light .recharts-cartesian-axis-tick-value tspan,
.theme-light .recharts-text {
  fill: var(--color-gray-500) !important;
}
.theme-light .recharts-tooltip-wrapper .recharts-default-tooltip {
  background-color: var(--color-gray-950) !important;
  border-color: var(--color-gray-800) !important;
  color: var(--color-gray-100) !important;
}
.theme-light .recharts-tooltip-item-name,
.theme-light .recharts-tooltip-item-value,
.theme-light .recharts-tooltip-item-separator {
  color: var(--color-gray-300) !important;
}

/* Ensure text colors match for custom components */
.theme-light .text-white:not(.bg-indigo-600 *, .bg-emerald-600 *) {
  color: var(--color-gray-100) !important; 
}
`;

fs.writeFileSync('src/index.css', css);
