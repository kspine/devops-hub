const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Replace everything inside the Search Bar div
code = code.replace(
  /<div className="flex-1 max-w-md w-full relative" ref=\{containerRef\}>[\s\S]*?<\/div>\s*\{\/\* Global Controls \*\/\}/,
  `<div className="flex-1 max-w-md w-full relative">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="w-full flex items-center justify-between bg-gray-900/40 hover:bg-gray-900/60 text-xs rounded-xl pl-3 pr-3 py-2 transition-all font-sans text-gray-500 border border-gray-800/50 hover:border-gray-700 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>{isZh ? "搜索 (Ctrl+K)..." : "Search (Ctrl+K)..."}</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-gray-900 text-gray-400 rounded border border-gray-700">
              ⌘K
            </kbd>
          </button>
        </div>
        
        {/* Global Controls */}`
);

// Remove unused state and SEARCH_ITEMS imports if any
code = code.replace(/const \[searchQuery, setSearchQuery\] = useState\(""\);/g, "");
code = code.replace(/const \[showResults, setShowResults\] = useState\(false\);/g, "");
code = code.replace(/const containerRef = useRef<HTMLDivElement>\(null\);/g, "");
code = code.replace(/const inputRef = useRef<HTMLInputElement>\(null\);/g, "");
code = code.replace(/\/\/ Hide dropdown on click outside[\s\S]*?\}, \[\]\);/g, "");
code = code.replace(/\/\/ Ctrl\+K shortcut for search[\s\S]*?\}, \[\]\);/g, "");
code = code.replace(/const filteredItems = [\s\S]*?\}\);/g, "");
code = code.replace(/const handleItemSelect = [\s\S]*?setShowResults\(false\);\n  };/g, "");
code = code.replace(/import \{ SEARCH_ITEMS \} from "\.\.\/data";/g, "");

fs.writeFileSync('src/components/Header.tsx', code);
