// force-cleanup.js
// Run this script with: node force-cleanup.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Force Cleanup Process...\n');

// Force kill any Node processes
function killNodeProcesses() {
  console.log('🔪 Killing any running Node processes...');
  try {
    if (process.platform === 'win32') {
      execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
    }
  } catch (e) {
    // Ignore errors - no processes to kill
  }
  console.log('✅ Process cleanup done\n');
}

// Force remove with retries
function forceRemove(itemPath, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      if (fs.existsSync(itemPath)) {
        // On Windows, try to unlock files first
        if (process.platform === 'win32') {
          try {
            execSync(`del /f /s /q "${itemPath}" > nul 2>&1`, { stdio: 'ignore' });
            execSync(`rmdir /s /q "${itemPath}" > nul 2>&1`, { stdio: 'ignore' });
          } catch (e) {
            // Try Node.js method
          }
        }
        
        fs.rmSync(itemPath, { recursive: true, force: true, maxRetries: 3 });
        console.log(`  ✓ Removed ${path.basename(itemPath)}`);
        return true;
      }
      return true;
    } catch (error) {
      if (i === retries - 1) {
        console.log(`  ⚠️  Could not remove ${path.basename(itemPath)} - ${error.message}`);
        return false;
      }
      // Wait a bit before retry
      console.log(`  🔄 Retrying removal of ${path.basename(itemPath)}...`);
      const waitTime = (i + 1) * 1000;
      const waitEnd = Date.now() + waitTime;
      while (Date.now() < waitEnd) {
        // Busy wait
      }
    }
  }
}

// Main cleanup function
function cleanupProject() {
  console.log('🧹 Starting aggressive cleanup...\n');
  
  killNodeProcesses();
  
  // Items to remove
  const toRemove = [
    'node_modules',
    'package-lock.json',
    '.next',
    'out',
    '.turbo',
    '.cache'
  ];
  
  toRemove.forEach(item => {
    forceRemove(item);
  });
  
  console.log('\n✅ Cleanup completed!\n');
}

// Fix package.json to ensure clean install
function fixPackageJson() {
  console.log('📦 Checking package.json...');
  
  try {
    const packagePath = 'package.json';
    if (fs.existsSync(packagePath)) {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Ensure critters is in devDependencies
      if (!packageData.devDependencies) {
        packageData.devDependencies = {};
      }
      
      if (!packageData.devDependencies.critters) {
        packageData.devDependencies.critters = "^0.0.22";
        fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
        console.log('  ✓ Added critters to devDependencies');
      }
      
      console.log('✅ package.json checked\n');
    }
  } catch (error) {
    console.error('❌ Error checking package.json:', error.message);
  }
}

// Create missing directories
function createDirectories() {
  console.log('📁 Creating directory structure...');
  
  const dirs = [
    'src/app',
    'src/components/sections',
    'src/components/layout',
    'src/components/ui',
    'src/lib',
    'src/types',
    'public/images',
    'public/assets'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✓ Created ${dir}`);
    }
  });
  
  console.log('✅ Directories created\n');
}

// Main execution
async function main() {
  try {
    console.log('⚠️  This will forcefully clean your project.');
    console.log('📌 Make sure to close VS Code and any other programs using this folder.\n');
    
    // Give user time to close programs
    console.log('Starting in 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run cleanup
    cleanupProject();
    
    // Fix package.json
    fixPackageJson();
    
    // Create directories
    createDirectories();
    
    console.log('🎉 Force cleanup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm install critters --save-dev');
    console.log('3. Run: npm run dev');
    console.log('\n💡 If npm install fails, try:');
    console.log('   npm cache clean --force');
    console.log('   Then run npm install again');
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error.message);
    console.log('\n🔧 Manual cleanup required:');
    console.log('1. Close all programs using this folder');
    console.log('2. Open Task Manager and end any Node.js processes');
    console.log('3. Manually delete the node_modules folder');
    console.log('4. Run: npm install');
    process.exit(1);
  }
}

// Run the script
main();