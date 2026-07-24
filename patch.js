const fs = require('fs');
let code = fs.readFileSync('src/components/views/DevOpsHubView.tsx', 'utf8');
code = code.replace(/<step\.icon className=\{\`h-5 w-5 \$\{step\.color\}\`\} \/>/g, '{React.createElement(step.icon, { className: `h-5 w-5 ${step.color}` })}');
fs.writeFileSync('src/components/views/DevOpsHubView.tsx', code, 'utf8');
