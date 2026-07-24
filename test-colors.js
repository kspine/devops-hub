const fs = require('fs');
let css = fs.readFileSync('dist/assets/index-*.css', 'utf8');
console.log(css.includes('--color-indigo-400'));
