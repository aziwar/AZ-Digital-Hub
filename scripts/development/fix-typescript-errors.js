import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fix all TypeScript unused variable errors
const fixes = [
  {
    file: '../app/api/health/route.ts',
    fix: (content) => content.replace('request: Request', '_request: Request')
  },
  {
    file: '../lib/openai.ts',
    fixes: [
      (content) => content.replace(/baseImagePath:\s*string,/, '_baseImagePath: string,'),
      (content) => content.replace(/count:\s*number\s*=\s*4/, '_count: number = 4'),
      (content) => content.replace(/count:\s*number\s*=\s*8/, '_count: number = 8')
    ]
  },
  {
    file: '../src/lib/openai.ts',
    fixes: [
      (content) => content.replace(/baseImagePath:\s*string,/, '_baseImagePath: string,'),
      (content) => content.replace(/count:\s*number\s*=\s*4/, '_count: number = 4'),
      (content) => content.replace(/count:\s*number\s*=\s*8/, '_count: number = 8')
    ]
  },
  {
    file: '../src/components/ui/button.tsx',
    fix: (content) => content.replace('import type { VariantProps }', '// import type { VariantProps }')
  }
];

fixes.forEach(({ file, fix, fixes: multipleFixes }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (fix) {
    content = fix(content);
  }
  if (multipleFixes) {
    multipleFixes.forEach(f => content = f(content));
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${file}`);
});

// Fix @/lib/utils import
const libPath = path.join(__dirname, '../lib');
const utilsFile = path.join(libPath, 'utils.ts');
if (!fs.existsSync(utilsFile)) {
  const srcUtils = path.join(__dirname, '../src/lib/utils.ts');
  if (fs.existsSync(srcUtils)) {
    fs.copyFileSync(srcUtils, utilsFile);
    console.log('✅ Copied utils.ts to lib directory');
  }
}
