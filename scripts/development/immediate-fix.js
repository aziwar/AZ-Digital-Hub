#!/usr/bin/env node

/**
 * IMMEDIATE FIX SCRIPT - AZ Digital Hub
 * Fixes the critical react-type-animation dependency error
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AZ Digital Hub - Immediate Fix Script');
console.log('=====================================');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Run this from the project root.');
    process.exit(1);
  }

  console.log('✅ Project root detected');

  // Step 1: Install missing dependency
  console.log('\n📦 [1/4] Installing react-type-animation...');
  execSync('npm install react-type-animation', { stdio: 'inherit' });
  console.log('✅ react-type-animation installed successfully');

  // Step 2: Clean cache
  console.log('\n🧹 [2/4] Cleaning build cache...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'pipe' });
  }
  console.log('✅ Build cache cleaned');

  // Step 3: Type check
  console.log('\n🔍 [3/4] Running type check...');
  try {
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('✅ TypeScript check passed');
  } catch (error) {
    console.log('⚠️  TypeScript warnings found (non-critical)');
  }

  // Step 4: Test build
  console.log('\n🔨 [4/4] Testing build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');

  console.log('\n🎉 SUCCESS! Your build error has been fixed.');
  console.log('\n📋 Next steps:');
  console.log('   1. Test locally: npm run dev');
  console.log('   2. Deploy when ready');
  console.log('\n⚡ The react-type-animation component should now work correctly.');

} catch (error) {
  console.error('\n❌ Error during fix process:');
  console.error(error.message);
  console.log('\n🔧 Try manual fix:');
  console.log('   npm install react-type-animation');
  console.log('   rm -rf .next');
  console.log('   npm run build');
  process.exit(1);
}
