const fs = require('fs');
const path = require('path');

// Fix all OpenAI null safety issues comprehensively
const files = [
  { path: '../lib/openai.ts', backup: true },
  { path: '../src/lib/openai.ts', backup: true }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Comprehensive null safety fixes
  content = content.replace(/response\.data\[/g, 'response.data?.[');
  content = content.replace(/response\.data\./g, 'response.data?.');
  content = content.replace(/\.map\(/g, '?.map(');
  content = content.replace(/\|\| \[\](\s*const urls)/g, '|| []\n    $1');
  
  fs.writeFileSync(filePath, content);
  // console.log(`✅ Fixed ${file.path}`);
});

// Fix button.tsx import
const buttonPath = path.join(__dirname, '../src/components/ui/button.tsx');
if (fs.existsSync(buttonPath)) {
  let content = fs.readFileSync(buttonPath, 'utf-8');
  content = content.replace('@/lib/utils', '@/lib/utils/index');
  fs.writeFileSync(buttonPath, content);
  // console.log('✅ Fixed button.tsx import');
}
