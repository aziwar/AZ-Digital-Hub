import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Remove all console statements from production code
const removeConsoleStatements = () => {
  const files = [
    '../lib/openai.ts',
    '../src/lib/openai.ts',
    '../src/app/api/contact/route.ts',
    '../src/components/sections/Contact.tsx',
    '../src/components/sections/EnhancedContact.tsx',
    '../src/components/shared/ErrorBoundary.tsx'
  ];

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove all console.log statements completely
    content = content.replace(/if \(process\.env\.NODE_ENV === "development"\) console\.(log|error)\([^)]*\);?\n?/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Removed console statements from ${file}`);
  });
};

removeConsoleStatements();
