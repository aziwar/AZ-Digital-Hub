#!/usr/bin/env node

/**
 * ENHANCED DEPENDENCY FIX SCRIPT - AZ Digital Hub
 * Context7-reviewed comprehensive solution with multiple options
 * Based on Next.js and Framer Motion best practices
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

class EnhancedDependencyFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.fixes = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m',
      bold: '\x1b[1m'
    };
    
    const color = colors[type] || colors.info;
    // console.log(`${color}${message}${colors.reset}`);
  }

  async runCommand(command, suppressOutput = false) {
    try {
      const result = execSync(command, { 
        cwd: this.projectRoot,
        stdio: suppressOutput ? 'pipe' : 'inherit',
        encoding: 'utf8'
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error.message, output: error.stdout };
    }
  }

  async showFixOptions() {
    this.log('\n🚀 AZ DIGITAL HUB - ENHANCED BUILD FIXER', 'bold');
    this.log('===============================================', 'info');
    this.log('\n📋 Missing Dependency Issue: react-type-animation', 'warning');
    this.log('\nAvailable Solutions:', 'info');
    this.log('1. QUICK FIX: Install react-type-animation (adds ~50KB)', 'info');
    this.log('2. OPTIMIZED: Use Framer Motion solution (0KB - uses existing deps)', 'info');
    this.log('3. LIGHTWEIGHT: Use native Web API solution (0KB - pure React)', 'info');
    this.log('4. MINIMAL: Simple text rotator (0KB - smallest bundle)', 'info');
    
    const choice = await askQuestion('\nChoose option (1-4) or press Enter for Quick Fix (1): ');
    return choice.trim() || '1';
  }

  async applyQuickFix() {
    this.log('\n🔧 Applying Quick Fix - Installing react-type-animation...', 'info');
    
    const result = await this.runCommand('npm install react-type-animation');
    if (result.success) {
      this.log('✅ react-type-animation installed successfully', 'success');
      this.fixes.push('Installed react-type-animation dependency');
    } else {
      this.log('❌ Failed to install react-type-animation', 'error');
      throw new Error('Quick fix failed');
    }
  }

  async applyFramerMotionFix() {
    this.log('\n🔧 Applying Framer Motion Fix - Using existing dependencies...', 'info');
    
    // Update the TypeAnimation import in HeroSection
    const heroPath = path.join(this.projectRoot, 'src/components/sections/HeroSection.tsx');
    
    if (fs.existsSync(heroPath)) {
      let content = fs.readFileSync(heroPath, 'utf8');
      
      // Replace the import
      content = content.replace(
        "const TypeAnimation = dynamic(() => import('@/components/ui/TypeAnimation'), {",
        "const TypeAnimation = dynamic(() => import('@/components/ui/TypeAnimationFramer'), {"
      );
      
      fs.writeFileSync(heroPath, content);
      this.log('✅ Updated HeroSection to use Framer Motion TypeAnimation', 'success');
      this.fixes.push('Replaced TypeAnimation with Framer Motion solution');
    }
  }

  async applyNativeFix() {
    this.log('\n🔧 Applying Native Fix - Using Web API solution...', 'info');
    
    const heroPath = path.join(this.projectRoot, 'src/components/sections/HeroSection.tsx');
    
    if (fs.existsSync(heroPath)) {
      let content = fs.readFileSync(heroPath, 'utf8');
      
      content = content.replace(
        "const TypeAnimation = dynamic(() => import('@/components/ui/TypeAnimation'), {",
        "const TypeAnimation = dynamic(() => import('@/components/ui/NativeTypeAnimation'), {"
      );
      
      fs.writeFileSync(heroPath, content);
      this.log('✅ Updated HeroSection to use Native TypeAnimation', 'success');
      this.fixes.push('Replaced TypeAnimation with native Web API solution');
    }
  }

  async applyMinimalFix() {
    this.log('\n🔧 Applying Minimal Fix - Simple text rotator...', 'info');
    
    const heroPath = path.join(this.projectRoot, 'src/components/sections/HeroSection.tsx');
    
    if (fs.existsSync(heroPath)) {
      let content = fs.readFileSync(heroPath, 'utf8');
      
      // Replace TypeAnimation with FastTypeAnimation
      content = content.replace(
        "const TypeAnimation = dynamic(() => import('@/components/ui/TypeAnimation'), {",
        "const TypeAnimation = dynamic(() => import('@/components/ui/TypeAnimationFramer').then(mod => ({ default: mod.FastTypeAnimation })), {"
      );
      
      fs.writeFileSync(heroPath, content);
      this.log('✅ Updated HeroSection to use minimal TypeAnimation', 'success');
      this.fixes.push('Replaced TypeAnimation with minimal solution');
    }
  }

  async performStandardFixes() {
    this.log('\n🔧 Performing standard optimizations...', 'info');
    
    // Update Next.js
    this.log('Updating Next.js...', 'info');
    const nextResult = await this.runCommand('npm install next@latest', true);
    if (nextResult.success) {
      this.log('✅ Next.js updated', 'success');
      this.fixes.push('Updated Next.js to latest version');
    }

    // Clean cache
    this.log('Cleaning build cache...', 'info');
    if (fs.existsSync(path.join(this.projectRoot, '.next'))) {
      await this.runCommand('rm -rf .next', true);
    }
    this.log('✅ Build cache cleaned', 'success');

    // Add development utilities
    this.log('Installing development utilities...', 'info');
    const devResult = await this.runCommand('npm install --save-dev cross-env husky lint-staged', true);
    if (devResult.success) {
      this.fixes.push('Added development utilities');
    }
  }

  async testBuild() {
    this.log('\n🔍 Testing build...', 'info');
    
    const buildResult = await this.runCommand('npm run build', true);
    if (buildResult.success) {
      this.log('✅ Build successful!', 'success');
      return true;
    } else {
      this.log('❌ Build failed', 'error');
      this.log('Build output:', 'warning');
      // console.log(buildResult.output);
      return false;
    }
  }

  generateReport() {
    this.log('\n📊 ENHANCED FIX REPORT', 'bold');
    this.log('========================', 'info');
    
    if (this.fixes.length === 0) {
      this.log('No fixes were applied.', 'warning');
    } else {
      this.log('✅ Applied fixes:', 'success');
      this.fixes.forEach(fix => this.log(`  • ${fix}`, 'info'));
    }
    
    this.log('\n📋 Next steps:', 'info');
    this.log('  1. Test development: npm run dev', 'info');
    this.log('  2. Verify TypeAnimation works on hero section', 'info');
    this.log('  3. Test production build: npm run build', 'info');
    this.log('  4. Deploy when ready', 'info');
    
    this.log('\n💡 Performance Notes:', 'info');
    this.log('  • Framer Motion solution: Best animation quality', 'info');
    this.log('  • Native solution: Smallest bundle impact', 'info');
    this.log('  • react-type-animation: Most features but adds size', 'info');
  }

  async run() {
    try {
      const choice = await this.showFixOptions();
      
      switch (choice) {
        case '1':
          await this.applyQuickFix();
          break;
        case '2':
          await this.applyFramerMotionFix();
          break;
        case '3':
          await this.applyNativeFix();
          break;
        case '4':
          await this.applyMinimalFix();
          break;
        default:
          this.log('Invalid choice, applying quick fix...', 'warning');
          await this.applyQuickFix();
      }

      await this.performStandardFixes();
      
      const buildSuccess = await this.testBuild();
      
      if (!buildSuccess) {
        this.log('\n🔄 Build failed, trying quick fix as fallback...', 'warning');
        await this.applyQuickFix();
        const retryBuild = await this.testBuild();
        
        if (!retryBuild) {
          this.log('\n💥 Build still failing. Manual intervention required.', 'error');
        }
      }

      this.generateReport();
      this.log('\n🎉 Enhanced dependency fix completed!', 'success');
      
    } catch (error) {
      this.log(`💥 Error during fix process: ${error.message}`, 'error');
    } finally {
      rl.close();
    }
  }
}

// Run the enhanced fixer
const fixer = new EnhancedDependencyFixer();
fixer.run().catch(console.error);
