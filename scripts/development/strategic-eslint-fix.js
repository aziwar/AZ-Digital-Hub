const fs = require('fs');
const path = require('path');

// Strategic ESLint fix - production-safe console logging
const fixConsoleStatements = () => {
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
    
    // Replace console.log with production-safe version
    content = content.replace(/console\.log\(/g, 'if (process.env.NODE_ENV === "development") console.log(');
    content = content.replace(/console\.error\(/g, 'if (process.env.NODE_ENV === "development") console.error(');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed console statements in ${file}`);
  });
};

// Fix import order issues
const fixImportOrder = () => {
  const fixes = [
    {
      file: '../src/app/page.tsx',
      fix: (content) => {
        const lines = content.split('\n');
        const imports = lines.filter(l => l.startsWith('import'));
        imports.sort();
        const nonImports = lines.filter(l => !l.startsWith('import'));
        return [...imports, '', ...nonImports].join('\n');
      }
    }
  ];
  
  fixes.forEach(({ file, fix }) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    content = fix(content);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed import order in ${file}`);
  });
};

// Fix TypeScript any types
const fixAnyTypes = () => {
  const files = [
    {
      path: '../src/components/ui/TypeAnimation.tsx',
      fix: (content) => content.replace(/ as any/g, '')
    },
    {
      path: '../src/components/ui/PerformanceMetrics.tsx', 
      fix: (content) => content.replace(/: any/g, ': number')
    },
    {
      path: '../src/lib/utils/index.ts',
      fix: (content) => content.replace(/: any/g, ': unknown')
    }
  ];
  
  files.forEach(({ path: filePath, fix }) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    content = fix(content);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed any types in ${filePath}`);
  });
};

// Fix type imports
const fixTypeImports = () => {
  const files = [
    {
      path: '../app/api/health/route.ts',
      old: 'import { NextRequest, NextResponse }',
      new: 'import type { NextRequest } from "next/server"\nimport { NextResponse }'
    },
    {
      path: '../src/components/ui/SmoothScroll.tsx',
      old: 'import { ReactNode, useEffect }',
      new: 'import { useEffect } from "react"\nimport type { ReactNode }'
    }
  ];
  
  files.forEach(({ path: filePath, old, new: newImport }) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    content = content.replace(old, newImport);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed type imports in ${filePath}`);
  });
};

// Fix remaining issues
const fixMiscIssues = () => {
  // Remove unused VariantProps
  const buttonPath = path.join(__dirname, '../src/components/ui/button.tsx');
  if (fs.existsSync(buttonPath)) {
    let content = fs.readFileSync(buttonPath, 'utf-8');
    content = content.replace(', type VariantProps', '');
    fs.writeFileSync(buttonPath, content);
    console.log('✅ Fixed unused VariantProps');
  }
  
  // Fix useEffect dependency
  const typeAnimPath = path.join(__dirname, '../src/components/ui/TypeAnimationFramer.tsx');
  if (fs.existsSync(typeAnimPath)) {
    let content = fs.readFileSync(typeAnimPath, 'utf-8');
    content = content.replace('[currentIndex]', '[currentIndex, sequence.length]');
    fs.writeFileSync(typeAnimPath, content);
    console.log('✅ Fixed useEffect dependency');
  }
  
  // Fix ts-ignore to ts-expect-error
  const smoothPath = path.join(__dirname, '../src/components/ui/SmoothScroll.tsx');
  if (fs.existsSync(smoothPath)) {
    let content = fs.readFileSync(smoothPath, 'utf-8');
    content = content.replace('@ts-ignore', '@ts-expect-error');
    fs.writeFileSync(smoothPath, content);
    console.log('✅ Fixed ts-ignore comment');
  }
};

console.log('🚀 Strategic ESLint Fix - Production Safe\n');
fixConsoleStatements();
fixImportOrder();
fixAnyTypes();
fixTypeImports();
fixMiscIssues();
console.log('\n✅ All strategic fixes applied');
