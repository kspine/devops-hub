const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("CommandPalette")) {
  code = code.replace(
    /import Header from "\.\/components\/Header";/,
    `import Header from "./components/Header";\nimport CommandPalette from "./components/CommandPalette";\nimport { Activity, CheckCircle2 } from "lucide-react";`
  );
  
  code = code.replace(
    /const \[isOpenMobile, setIsOpenMobile\] = useState\(false\);/,
    `const [isOpenMobile, setIsOpenMobile] = useState(false);\n  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);\n\n  useEffect(() => {\n    const handleOpen = () => setIsCommandPaletteOpen(true);\n    window.addEventListener("open-command-palette", handleOpen);\n    return () => window.removeEventListener("open-command-palette", handleOpen);\n  }, []);`
  );
  
  code = code.replace(
    /return \(\s*<div className="min-h-screen/,
    `return (\n    <div className="min-h-screen` // noop just in case
  );
  
  const footerCode = `
        <footer className="border-t border-gray-900 mt-auto py-2 px-6 text-[10px] font-mono text-gray-500 bg-gray-950/80 backdrop-blur-md sticky bottom-0 z-20">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800/50">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Activity className="w-3 h-3 text-indigo-400" />
                {isZh ? "最近构建流水线状态" : "Latest Pipeline Status"}
              </span>
              <div className="h-3 w-px bg-gray-800" />
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {isZh ? "成功" : "Success"} (iOS-Release-v1.2.0)
              </span>
              <span className="text-gray-600 hidden md:inline-block">
                • {isZh ? "2分钟前" : "2 mins ago"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>{t("footerLine1")}</span>
            </div>
          </div>
        </footer>
  `;
  
  code = code.replace(
    /<footer className="border-t border-gray-900 mt-12 py-6 px-6 text-center text-\[10px\] font-mono text-gray-500">[\s\S]*?<\/footer>/,
    footerCode
  );
  
  // Add CommandPalette at the end
  code = code.replace(
    /<\/div>\s*<\/div>\s*\);\s*\}/,
    `  </div>\n      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
