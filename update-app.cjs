const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace `type ActiveTab = ...;`
code = code.replace(
  /type ActiveTab = "dashboard" \| "designer" \| "logs" \| "signing" \| "troubleshooter" \| "architect" \| "production" \| "sshKeys";/,
  `import { PrimaryGroup, ActiveTab, SECONDARY_TABS, getPrimaryGroupForTab, PRIMARY_GROUPS } from "./navigation";`
);

// Update `const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");`
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<ActiveTab>\("dashboard"\);/,
  `const [activePrimary, setActivePrimary] = useState<PrimaryGroup>("build");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  // When primary group changes, default to its first tab if current tab is not in it
  useEffect(() => {
    if (getPrimaryGroupForTab(activeTab) !== activePrimary) {
      setActiveTab(PRIMARY_GROUPS.find(g => g.id === activePrimary)?.defaultTab || "dashboard");
    }
  }, [activePrimary, activeTab]);

  // When activeTab changes (e.g. from keyboard shortcut or global navigate), update primary group
  useEffect(() => {
    const group = getPrimaryGroupForTab(activeTab);
    if (group !== activePrimary) {
      setActivePrimary(group);
    }
  }, [activeTab]);
`
);

// Update Sidebar props
code = code.replace(
  /<Sidebar[\s\n]*activeTab=\{activeTab\}[\s\n]*setActiveTab=\{setActiveTab\}/,
  `<Sidebar \n        activePrimary={activePrimary} \n        setActivePrimary={setActivePrimary}`
);

// We should also add the secondary tab bar inside `<main>` right above `<AnimatePresence mode="wait">`
const secondaryTabBar = `
        <main className="flex-1 p-4 md:p-8 w-full flex flex-col min-h-0">
          {/* Secondary Tab Navigation */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-900/50 pb-px overflow-x-auto">
            {SECONDARY_TABS[activePrimary].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={\`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap \${
                    isActive 
                      ? "text-indigo-400" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/30 rounded-t-lg"
                  }\`}
                >
                  <Icon className="w-4 h-4" />
                  {isZh ? tab.labelZh : tab.labelEn}
                  {isActive && (
                    <motion.div
                      layoutId="secondaryTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
`;

code = code.replace(
  /<main className="flex-1 p-4 md:p-8 w-full">[\s\n]*<AnimatePresence mode="wait">/,
  secondaryTabBar
);

// Make sure to close the div added for scroll area
code = code.replace(
  /<\/AnimatePresence>[\s\n]*<\/main>/,
  `</AnimatePresence>\n          </div>\n        </main>`
);

fs.writeFileSync('src/App.tsx', code);
