#!/usr/bin/env node

/**
 * AZ Digital Hub - Automated Type Animation Fix
 * 
 * This script automatically fixes the type animation component 
 * by switching from external dependency to Framer Motion solution.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Starting TypeAnimation fix process...');

// Define paths
const heroSectionPath = path.join(process.cwd(), 'src', 'components', 'sections', 'HeroSection.tsx');
const typeAnimationFramerPath = path.join(process.cwd(), 'src', 'components', 'ui', 'TypeAnimationFramer.tsx');

// Check if files exist
if (!fs.existsSync(heroSectionPath)) {
  console.error('❌ HeroSection.tsx not found at:', heroSectionPath);
  process.exit(1);
}

if (!fs.existsSync(typeAnimationFramerPath)) {
  console.error('❌ TypeAnimationFramer.tsx not found at:', typeAnimationFramerPath);
  process.exit(1);
}

// Read HeroSection.tsx
let heroSectionContent = fs.readFileSync(heroSectionPath, 'utf8');

// Check if already using TypeAnimationFramer
if (heroSectionContent.includes("import('@/components/ui/TypeAnimationFramer')")) {
  console.log('✅ Already using TypeAnimationFramer. No changes needed.');
} else {
  // Replace TypeAnimation with TypeAnimationFramer
  const updatedContent = heroSectionContent.replace(
    "import('@/components/ui/TypeAnimation')",
    "import('@/components/ui/TypeAnimationFramer')"
  );

  // Write the updated content back to the file
  fs.writeFileSync(heroSectionPath, updatedContent, 'utf8');
  console.log('✅ Updated HeroSection.tsx to use TypeAnimationFramer');
}

// Clean build cache
console.log('🧹 Cleaning build cache...');
try {
  if (process.platform === 'win32') {
    execSync('if exist .next rmdir /s /q .next', { stdio: 'inherit' });
  } else {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  console.log('✅ Build cache cleaned successfully');
} catch (error) {
  console.error('❌ Error cleaning build cache:', error.message);
}

// Run build check
console.log('🔨 Running build check...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n✨ Fix applied successfully! ✨');
console.log('The project now uses the Framer Motion-based TypeAnimation component.');
console.log('\nRecommendation: Run the development server to verify the animation:');
console.log('npm run dev');
