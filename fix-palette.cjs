const fs = require('fs');
let code = fs.readFileSync('src/components/CommandPalette.tsx', 'utf8');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/components/CommandPalette.tsx', code);
