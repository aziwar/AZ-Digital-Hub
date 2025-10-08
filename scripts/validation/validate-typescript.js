#!/usr/bin/env node
/**
 * AZ-Digital-Hub Deployment Safety Protocol v2.0
 * Stage 2: TypeScript Strict Enforcement Pipeline
 * 
 * Implements Context7-validated TypeScript safety patterns
 * Zero-tolerance for type errors that cause deployment failures
 * Trust Score Requirement: 8.0+ for all TypeScript validations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TypeScript safety configuration requirements
const TYPESCRIPT_SAFETY_REQUIREMENTS = {
  compilerOptions: {
    strict: true,
    noImplicitAny: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    skipLibCheck: false
  },
  include: [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
};

/**
 * Stage 2: TypeScript Strict Mode Enforcement
 * Validates TypeScript configuration and performs type checking
 */
function executeTypeScriptValidation() {
  console.log('\n🔒 STAGE 2: TypeScript Strict Enforcement');
  console.log('═══════════════════════════════════════════');
  
  // Step 1: Validate tsconfig.json configuration
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log('❌ tsconfig.json not found');
    process.exit(1);
  }
  
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  validateTypeScriptConfig(tsconfig);
  
  // Step 2: Execute TypeScript compilation check
  try {
    console.log('\n🔍 Running TypeScript compilation check...');
    const result = execSync('npx tsc --noEmit --strict --noUnusedLocals --noUnusedParameters', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ TypeScript compilation successful');
    return true;
    
  } catch (error) {
    console.log('❌ TypeScript compilation failed:');
    console.log(error.stdout || error.message);
    
    // Parse and categorize TypeScript errors
    categorizeTypeScriptErrors(error.stdout || error.message);
    return false;
  }
}

/**
 * Validates tsconfig.json against safety requirements
 */
function validateTypeScriptConfig(tsconfig) {
  console.log('\n📋 Validating tsconfig.json configuration...');
  
  const compilerOptions = tsconfig.compilerOptions || {};
  let violations = 0;
  
  Object.entries(TYPESCRIPT_SAFETY_REQUIREMENTS.compilerOptions).forEach(([option, required]) => {
    const current = compilerOptions[option];
    
    if (current !== required) {
      console.log(`❌ ${option}: Expected ${required}, got ${current}`);
      violations++;
    } else {
      console.log(`✅ ${option}: ${required}`);
    }
  });
  
  if (violations > 0) {
    console.log(`\n🚨 ${violations} TypeScript configuration violations detected`);
    console.log('Fix tsconfig.json before proceeding to Stage 3');
    process.exit(1);
  }
  
  console.log('\n✅ TypeScript configuration meets safety requirements');
}

/**
 * Categorizes TypeScript errors for targeted resolution
 */
function categorizeTypeScriptErrors(errorOutput) {
  const errors = {
    nullSafety: [],
    unusedVariables: [],
    typeDefinitions: [],
    imports: [],
    other: []
  };
  
  const lines = errorOutput.split('\n');
  
  lines.forEach(line => {
    if (line.includes('possibly undefined') || line.includes('possibly null')) {
      errors.nullSafety.push(line);
    } else if (line.includes('unused') || line.includes('never read')) {
      errors.unusedVariables.push(line);
    } else if (line.includes('Cannot find module') || line.includes('Module not found')) {
      errors.imports.push(line);
    } else if (line.includes('Property') && line.includes('does not exist')) {
      errors.typeDefinitions.push(line);
    } else if (line.trim() && line.includes('error TS')) {
      errors.other.push(line);
    }
  });
  
  console.log('\n📊 ERROR CATEGORIZATION:');
  console.log(`   Null Safety Issues: ${errors.nullSafety.length}`);
  console.log(`   Unused Variables: ${errors.unusedVariables.length}`);
  console.log(`   Type Definitions: ${errors.typeDefinitions.length}`);
  console.log(`   Import Issues: ${errors.imports.length}`);
  console.log(`   Other Issues: ${errors.other.length}`);
  
  // Focus on critical null safety issues first (deployment protocol priority)
  if (errors.nullSafety.length > 0) {
    console.log('\n🎯 PRIORITY: Null safety violations (critical for deployment):');
    errors.nullSafety.slice(0, 5).forEach(error => console.log(`   ${error}`));
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 TypeScript Strict Enforcement Pipeline');
  
  const passed = executeTypeScriptValidation();
  
  if (!passed) {
    console.log('\n❌ STAGE 2 FAILED: TypeScript validation errors detected');
    console.log('   Fix TypeScript issues before proceeding to Stage 3');
    process.exit(1);
  }
  
  console.log('\n✅ STAGE 2 PASSED: TypeScript strict mode validated');
  console.log('   Ready for Stage 3: ESLint Zero-Tolerance Enforcement');
  process.exit(0);
}

// Execute if run directly (ESM equivalent)
const isMainModule = import.meta.url.startsWith('file:') && process.argv[1] === __filename;
if (isMainModule) {
  main();
}

export { executeTypeScriptValidation };
