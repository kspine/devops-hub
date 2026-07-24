const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[activePrimary.*?\[activeTab\]\);/s,
  `const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const activePrimary = getPrimaryGroupForTab(activeTab);`
);

code = code.replace(
  /<Sidebar[\s\S]*?setActivePrimary=\{setActivePrimary\}/,
  `<Sidebar \n        activePrimary={activePrimary} \n        setActivePrimary={(groupId) => setActiveTab(PRIMARY_GROUPS.find(g => g.id === groupId)?.defaultTab || "dashboard")}`
);

fs.writeFileSync('src/App.tsx', code);
