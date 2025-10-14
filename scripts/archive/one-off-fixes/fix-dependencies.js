#!/usr/bin/env node

/**
 * Comprehensive dependency fix script for AZ Digital Hub
 * This script identifies and fixes missing dependencies, outdated packages, and build issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DependencyFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.issues = [];
    this.fixes = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    const color = colors[type] || colors.info;
    // // console.log(`${color}${message}${colors.reset}`);
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

  readPackageJson() {
    try {
      const content = fs.readFileSync(this.packageJsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      this.log(`Error reading package.json: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  writePackageJson(packageData) {
    try {
      fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageData, null, 2));
      this.log('Updated package.json', 'success');
    } catch (error) {
      this.log(`Error writing package.json: ${error.message}`, 'error');
    }
  }

  async checkMissingDependencies() {
    this.log('🔍 Checking for missing dependencies...', 'info');
    
    const missingDependencies = [
      'react-type-animation'
    ];

    const packageJson = this.readPackageJson();
    
    for (const dep of missingDependencies) {
      if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
        this.issues.push(`Missing dependency: ${dep}`);
        this.fixes.push(`npm install ${dep}`);
      }
    }
  }

  async scanForImports() {
    this.log('🔍 Scanning for imported packages...', 'info');
    
    const srcDir = path.join(this.projectRoot, 'src');
    if (!fs.existsSync(srcDir)) return;

    const packageJson = this.readPackageJson();
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    // Common imports that need checking
    const imports = [
      'react-type-animation',
      'react-countup',
      'framer-motion',
      '@heroicons/react',
      'react-icons'
    ];

    for (const importName of imports) {
      if (!allDependencies[importName]) {
        // Check if it's actually used in the code
        const result = await this.runCommand(`grep -r "from '${importName}'" src/`, true);
        if (result.success && result.output.trim()) {
          this.issues.push(`Missing dependency used in code: ${importName}`);
          this.fixes.push(`npm install ${importName}`);
        }
      }
    }
  }

  async checkNextJSVersion() {
    this.log('🔍 Checking Next.js version...', 'info');
    
    const packageJson = this.readPackageJson();
    const currentNext = packageJson.dependencies.next;
    
    if (currentNext && currentNext.includes('14.2.29')) {
      this.issues.push('Next.js version is outdated (14.2.29)');
      this.fixes.push('npm install next@latest');
    }
  }

  async runTypeCheck() {
    this.log('🔍 Running TypeScript check...', 'info');
    
    const result = await this.runCommand('npm run type-check', true);
    if (!result.success) {
      this.issues.push('TypeScript compilation errors detected');
      this.log('TypeScript errors found:', 'warning');
      // // console.log(result.output);
    }
  }

  async checkBuildCommand() {
    this.log('🔍 Testing build command...', 'info');
    
    const result = await this.runCommand('npm run build', true);
    if (!result.success) {
      this.issues.push('Build command fails');
      this.log('Build errors found:', 'warning');
      // // console.log(result.output);
    }
  }

  async fixMissingDependencies() {
    this.log('🔧 Installing missing dependencies...', 'info');
    
    // Critical dependencies that need to be installed
    const criticalDeps = [
      'react-type-animation'
    ];

    for (const dep of criticalDeps) {
      this.log(`Installing ${dep}...`, 'info');
      const result = await this.runCommand(`npm install ${dep}`);
      if (result.success) {
        this.log(`✅ Successfully installed ${dep}`, 'success');
      } else {
        this.log(`❌ Failed to install ${dep}`, 'error');
      }
    }
  }

  async updateNextJS() {
    this.log('🔧 Updating Next.js...', 'info');
    
    const result = await this.runCommand('npm install next@latest');
    if (result.success) {
      this.log('✅ Successfully updated Next.js', 'success');
    } else {
      this.log('❌ Failed to update Next.js', 'error');
    }
  }

  async cleanAndReinstall() {
    this.log('🧹 Cleaning and reinstalling dependencies...', 'info');
    
    // Remove node_modules and package-lock.json
    if (fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
      this.log('Removing node_modules...', 'info');
      await this.runCommand('rm -rf node_modules');
    }
    
    if (fs.existsSync(path.join(this.projectRoot, 'package-lock.json'))) {
      this.log('Removing package-lock.json...', 'info');
      fs.unlinkSync(path.join(this.projectRoot, 'package-lock.json'));
    }
    
    if (fs.existsSync(path.join(this.projectRoot, '.next'))) {
      this.log('Removing .next cache...', 'info');
      await this.runCommand('rm -rf .next');
    }
    
    this.log('Reinstalling dependencies...', 'info');
    const result = await this.runCommand('npm install');
    if (result.success) {
      this.log('✅ Successfully reinstalled dependencies', 'success');
    } else {
      this.log('❌ Failed to reinstall dependencies', 'error');
    }
  }

  async addPreventiveMeasures() {
    this.log('🛡️ Adding preventive measures...', 'info');
    
    const packageJson = this.readPackageJson();
    
    // Add useful scripts if they don't exist
    const scriptsToAdd = {
      'clean': 'rm -rf .next node_modules/.cache',
      'full-clean': 'rm -rf .next node_modules package-lock.json && npm install',
      'check-deps': 'npm ls',
      'audit-fix': 'npm audit fix',
      'build-check': 'npm run type-check && npm run lint && npm run build',
      'pre-deploy': 'npm run clean && npm run build-check'
    };

    let updated = false;
    for (const [script, command] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        updated = true;
        this.log(`Added script: ${script}`, 'success');
      }
    }

    if (updated) {
      this.writePackageJson(packageJson);
    }
  }

  async createPrecommitHook() {
    this.log('🪝 Setting up pre-commit hooks...', 'info');
    
    const huskyDir = path.join(this.projectRoot, '.husky');
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }
    
    const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run lint
`;
    
    fs.writeFileSync(preCommitPath, preCommitContent);
    fs.chmodSync(preCommitPath, '755');
    
    this.log('✅ Pre-commit hook created', 'success');
  }

  generateReport() {
    this.log('\n📊 DEPENDENCY FIX REPORT', 'info');
    this.log('========================', 'info');
    
    if (this.issues.length === 0) {
      this.log('✅ No issues found!', 'success');
    } else {
      this.log('❌ Issues found:', 'error');
      this.issues.forEach(issue => this.log(`  • ${issue}`, 'warning'));
      
      this.log('\n🔧 Recommended fixes:', 'info');
      this.fixes.forEach(fix => this.log(`  • ${fix}`, 'info'));
    }
    
    this.log('\n📋 Next steps:', 'info');
    this.log('  1. Run: npm run build-check', 'info');
    this.log('  2. Test development: npm run dev', 'info');
    this.log('  3. Test production build: npm run build', 'info');
    this.log('  4. Monitor for future issues', 'info');
  }

  async run() {
    this.log('🚀 Starting comprehensive dependency fix...', 'info');
    this.log('==========================================', 'info');
    
    try {
      // Phase 1: Diagnosis
      await this.checkMissingDependencies();
      await this.scanForImports();
      await this.checkNextJSVersion();
      
      // Phase 2: Immediate fixes
      await this.fixMissingDependencies();
      await this.updateNextJS();
      
      // Phase 3: Clean rebuild
      await this.cleanAndReinstall();
      
      // Phase 4: Validation
      await this.runTypeCheck();
      await this.checkBuildCommand();
      
      // Phase 5: Preventive measures
      await this.addPreventiveMeasures();
      
      // Phase 6: Report
      this.generateReport();
      
      this.log('\n🎉 Dependency fix completed!', 'success');
      
    } catch (error) {
      this.log(`💥 Error during fix process: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the fixer
const fixer = new DependencyFixer();
fixer.run().catch(console.error);
