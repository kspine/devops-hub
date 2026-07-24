const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.theme-light \[class\*="bg-indigo-"\],[\s\S]*?--color-white: #ffffff;/m, 
`.theme-light .bg-indigo-500,
.theme-light .bg-emerald-500,
.theme-light .bg-orange-500,
.theme-light .bg-rose-500,
.theme-light .bg-red-500,
.theme-light .bg-indigo-600,
.theme-light .bg-emerald-600,
.theme-light .bg-orange-600,
.theme-light .bg-rose-600,
.theme-light .bg-red-600,
.theme-light .hover\\:bg-indigo-500:hover,
.theme-light .hover\\:bg-emerald-500:hover,
.theme-light .hover\\:bg-orange-500:hover,
.theme-light .hover\\:bg-rose-500:hover,
.theme-light .hover\\:bg-red-500:hover {
  --color-white: #ffffff;
}`);

fs.writeFileSync('src/index.css', css);
