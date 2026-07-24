const fs = require('fs');
let code = fs.readFileSync('src/components/views/DevOpsHubView.tsx', 'utf8');

// replace <step.icon ... /> with <Icon ... /> and extract Icon
code = code.replace(/<step\.icon className=\{\`h-5 w-5 \$\{step\.color\}\`\} \/>/g, 
  '{(() => { const Icon = step.icon; return <Icon className={`h-5 w-5 ${step.color}`} />; })()}'
);

fs.writeFileSync('src/components/views/DevOpsHubView.tsx', code, 'utf8');
