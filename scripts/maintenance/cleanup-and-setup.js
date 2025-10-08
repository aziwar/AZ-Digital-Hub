// cleanup-and-setup.js
// Run this script with: node cleanup-and-setup.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting AZ Digital Hub Cleanup and Setup Process...\n');

// Configuration
const config = {
  backupDir: 'backup_' + new Date().toISOString().split('T')[0],
  essentialFiles: [
    'package.json',
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
    '.gitignore',
    'README.md'
  ],
  essentialDirs: [
    'src/app',
    'src/components',
    'src/lib',
    'public'
  ],
  filesToCreate: {
    'src/lib/utils.ts': `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
    'src/types/index.ts': `// Type definitions
export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}`,
    '.env.example': `# Environment variables
NEXT_PUBLIC_SITE_URL=https://ahmedziwar.com
NEXT_PUBLIC_GA_ID=your-ga-id`,
  }
};

// Helper functions
function runCommand(command, description) {
  console.log(`📌 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed!\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}: ${error.message}\n`);
    process.exit(1);
  }
}

function createBackup() {
  console.log('📦 Creating backup...');
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  // Backup essential files
  config.essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const destPath = path.join(config.backupDir, file);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(file, destPath);
    }
  });
  
  console.log(`✅ Backup created in ${config.backupDir}\n`);
}

function cleanupProject() {
  console.log('🧹 Cleaning up project...');
  
  // Remove node_modules and lock files
  const toRemove = ['node_modules', 'package-lock.json', '.next', 'out'];
  toRemove.forEach(item => {
    if (fs.existsSync(item)) {
      fs.rmSync(item, { recursive: true, force: true });
      console.log(`  ✓ Removed ${item}`);
    }
  });
  
  console.log('✅ Cleanup completed!\n');
}

function fixGlobalsCss() {
  console.log('🎨 Fixing globals.css...');
  
  const globalsCssPath = 'src/app/globals.css';
  const globalsCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}`;

  fs.writeFileSync(globalsCssPath, globalsCssContent);
  console.log('✅ globals.css fixed!\n');
}

function updateTailwindConfig() {
  console.log('⚙️ Updating tailwind.config.js...');
  
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}`;

  fs.writeFileSync('tailwind.config.js', tailwindConfig);
  console.log('✅ tailwind.config.js updated!\n');
}

function createEssentialFiles() {
  console.log('📄 Creating essential files...');
  
  Object.entries(config.filesToCreate).forEach(([filePath, content]) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Created ${filePath}`);
  });
  
  console.log('✅ Essential files created!\n');
}

function installDependencies() {
  runCommand('npm install', 'Installing dependencies');
  runCommand('npm install critters --save-dev', 'Installing critters');
  runCommand('npm install clsx tailwind-merge --save', 'Installing utility libraries');
}

function createGitignore() {
  console.log('📝 Creating .gitignore...');
  
  const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# backup
backup_*`;

  fs.writeFileSync('.gitignore', gitignoreContent);
  console.log('✅ .gitignore created!\n');
}

// Main execution
async function main() {
  try {
    // Step 1: Create backup
    createBackup();
    
    // Step 2: Clean up project
    cleanupProject();
    
    // Step 3: Fix configuration files
    fixGlobalsCss();
    updateTailwindConfig();
    
    // Step 4: Create essential files
    createEssentialFiles();
    createGitignore();
    
    // Step 5: Install dependencies
    installDependencies();
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run "npm run dev" to start development server');
    console.log('2. Check http://localhost:3000');
    console.log('3. Start building your profile sections');
    console.log('\n💡 Tip: Check the backup folder if you need to restore any files');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();