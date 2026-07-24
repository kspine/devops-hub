const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(key === "b"\) \{/,
  `if (key === "k") {
          e.preventDefault();
          setIsCommandPaletteOpen(prev => !prev);
        } else if (key === "b") {`
);

fs.writeFileSync('src/App.tsx', code);
