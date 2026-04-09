const fs = require('fs');
const path = require('path');

function scan(dir) {
  let changed = 0;
  if (!fs.existsSync(dir)) return 0;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      changed += scan(fullPath);
    } else if (fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<') && (content.includes('/>') || content.includes('</'))) {
        if (!content.includes('import React')) {
          const lines = content.split('\n');
          lines.unshift('import React from "react";');
          fs.writeFileSync(fullPath, lines.join('\n'));
          changed++;
          console.log('Fixed:', fullPath);
        }
      }
    }
  });
  return changed;
}

const t1 = scan('./src/components');
const t2 = scan('./src/features');
console.log('Total files fixed:', t1 + t2);
