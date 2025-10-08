#!/usr/bin/env node
/**
 * AZ-Digital-Hub Deployment Safety Protocol v2.0
 * Stage 1: Configuration Safety Validator
 * 
 * CRITICAL: Prevents 58% deployment failure rate through dangerous pattern detection
 * Trust Score Requirement: 9.0+ (Context7 validated patterns)
 * 
 * FORBIDDEN PATTERNS DETECTED:
 * - ignoreDuringBuilds: true (ESLint bypass)
 * - ignoreBuildErrors: true (TypeScript bypass)
 * - skipLibCheck: true (TypeScript skip)
 * - strict: false (TypeScript loose mode)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration patterns that cause systematic deployment failures
const FORBIDDEN_PATTERNS = {
  'next.config.js': [
    /ignoreDuringBuilds:\s*true/,
    /ignoreBuildErrors:\s*true/,
    /eslint:\s*{\s*ignoreDuringBuilds:\s*true/,
    /typescript:\s*{\s*ignoreBuildErrors:\s*true/
  ],
  'tsconfig.json': [
    /"skipLibCheck":\s*true/,
    /"noUnusedLocals":\s*false/,
    /"strict":\s*false/,
    /"noImplicitAny":\s*false/
  ],
  'package.json': [
    /"--ignore-pattern"/,
    /"--max-warnings"/,
    /"--no-eslint"/,
    /"--skip-checks"/
  ],
  '.eslintrc.json': [
    /"off"/g,
    /"warn"/g
  ]
};

// Critical safety validation results
const VALIDATION_RESULTS = {
  dangerousPatterns: [],
  violationCount: 0,
  criticalFiles: [],
  safetyScore: 100
};

/**
 * Scans configuration files for dangerous bypass patterns
 * Implements zero-tolerance policy per deployment safety protocol
 */
function scanConfigurationFiles() {
  console.log('\n🛡️  STAGE 1: Configuration Safety Validation');
  console.log('═══════════════════════════════════════════');
  
  let totalViolations = 0;
  
  Object.entries(FORBIDDEN_PATTERNS).forEach(([filename, patterns]) => {
    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`📁 ${filename}: Not found (skipping)`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          pattern: pattern.toString(),
          matches: matches,
          lineNumber: findLineNumber(content, matches[0])
        });
        totalViolations++;
      }
    });
    
    if (violations.length > 0) {
      console.log(`❌ ${filename}: ${violations.length} DANGEROUS PATTERNS DETECTED`);
      violations.forEach(v => {
        console.log(`   ⚠️  Line ${v.lineNumber}: ${v.matches[0]}`);
        console.log(`   🚫 Pattern: ${v.pattern}`);
      });
      
      VALIDATION_RESULTS.dangerousPatterns.push({
        file: filename,
        violations: violations
      });
      VALIDATION_RESULTS.criticalFiles.push(filename);
    } else {
      console.log(`✅ ${filename}: Safe configuration`);
    }
  });
  
  VALIDATION_RESULTS.violationCount = totalViolations;
  VALIDATION_RESULTS.safetyScore = Math.max(0, 100 - (totalViolations * 25));
  
  return totalViolations === 0;
}

/**
 * Finds line number for dangerous pattern occurrence
 */
function findLineNumber(content, searchText) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchText)) {
      return i + 1;
    }
  }
  return 0;
}

/**
 * Generates detailed violation report
 */
function generateViolationReport() {
  console.log('\n📊 CONFIGURATION SAFETY REPORT');
  console.log('═══════════════════════════════');
  console.log(`Safety Score: ${VALIDATION_RESULTS.safetyScore}/100`);
  console.log(`Total Violations: ${VALIDATION_RESULTS.violationCount}`);
  console.log(`Critical Files: ${VALIDATION_RESULTS.criticalFiles.length}`);
  
  if (VALIDATION_RESULTS.violationCount > 0) {
    console.log('\n🚨 IMMEDIATE REMEDIATION REQUIRED:');
    VALIDATION_RESULTS.dangerousPatterns.forEach(item => {
      console.log(`\n📁 ${item.file}:`);
      item.violations.forEach(v => {
        console.log(`   - Remove line ${v.lineNumber}: ${v.matches[0]}`);
      });
    });
    
    console.log('\n⚡ NEXT ACTIONS:');
    console.log('1. Remove all dangerous bypass flags');
    console.log('2. Fix underlying TypeScript/ESLint violations');
    console.log('3. Re-run validation until 100% safety score');
    console.log('4. Proceed to Stage 2: TypeScript Strict Enforcement');
  }
}

/**
 * Writes validation results for pipeline integration
 */
function writeValidationResults() {
  const resultsFile = path.join(process.cwd(), '.validation-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(VALIDATION_RESULTS, null, 2));
  console.log(`\n💾 Results saved to: ${resultsFile}`);
}

/**
 * Main execution - Stage 1 Quality Gate
 */
function main() {
  console.log('🚀 AZ-Digital-Hub Deployment Safety Protocol v2.0');
  console.log('   Systematic Pattern Elimination Framework');
  console.log(`   Target: Eliminate 58% deployment failure rate\n`);
  
  const isConfigSafe = scanConfigurationFiles();
  generateViolationReport();
  writeValidationResults();
  
  if (!isConfigSafe) {
    console.log('\n❌ STAGE 1 FAILED: Dangerous configurations detected');
    console.log('   Deployment blocked - fix violations before proceeding');
    process.exit(1);
  }
  
  console.log('\n✅ STAGE 1 PASSED: Configuration safety validated');
  console.log('   Ready for Stage 2: TypeScript Strict Enforcement');
  process.exit(0);
}

// Execute if run directly (ESM equivalent)
const isMainModule = import.meta.url.startsWith('file:') && process.argv[1] === __filename;
if (isMainModule) {
  main();
}

export {
  scanConfigurationFiles,
  FORBIDDEN_PATTERNS,
  VALIDATION_RESULTS
};
