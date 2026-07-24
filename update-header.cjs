const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Update imports
code = code.replace(
  /import \{ useEngine \} from "\.\.\/EngineContext";/,
  `import { useEngine } from "../EngineContext";\nimport { PrimaryGroup, ActiveTab, PRIMARY_GROUPS, SECONDARY_TABS, getPrimaryGroupForTab } from "../navigation";`
);

// Update props
code = code.replace(
  /activeTab: string;/, // Wait, let's find the exact props type
  ``
);
// I'll just use regex replacement for the text
code = code.replace(
  /interface HeaderProps \{[\s\S]*?\}/,
  `interface HeaderProps {
  activeTab: ActiveTab;
  isCompact: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}`
);

// Update breadcrumbs rendering
const newBreadcrumb = `
          <div className="hidden md:flex items-center text-[10px] font-mono text-gray-400">
             <span className="text-gray-500">{isZh ? "工作空间" : "Workspace"}</span>
             <span className="mx-2 text-gray-700">/</span>
             <span className="text-gray-400">
               {isZh 
                 ? PRIMARY_GROUPS.find(g => g.id === getPrimaryGroupForTab(activeTab))?.labelZh 
                 : PRIMARY_GROUPS.find(g => g.id === getPrimaryGroupForTab(activeTab))?.labelEn}
             </span>
             <span className="mx-2 text-gray-700">/</span>
             <span className="font-semibold text-indigo-400 capitalize">
               {isZh 
                 ? Object.values(SECONDARY_TABS).flat().find(t => t.id === activeTab)?.labelZh 
                 : Object.values(SECONDARY_TABS).flat().find(t => t.id === activeTab)?.labelEn}
             </span>
          </div>
`;

code = code.replace(
  /<div className="hidden md:flex items-center text-\[10px\] font-mono text-gray-400">[\s\S]*?<\/div>/,
  newBreadcrumb
);

fs.writeFileSync('src/components/Header.tsx', code);
