# AZ Digital Hub - Development Guide

> **Complete development setup and workflow documentation**
> 
> Modern Next.js 15 development with TypeScript, quality gates, and business optimization

[![Development](https://img.shields.io/badge/Development-Next.js_15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)
[![Code Quality](https://img.shields.io/badge/ESLint-Passing-green)](https://eslint.org/)

---

## 🎯 **Development Philosophy**

The AZ Digital Hub follows a **business-first development approach** with emphasis on conversion optimization, mobile experience, and maintainable code architecture.

### **Core Development Principles**
1. **Business Impact First** - Every feature optimized for lead generation
2. **Mobile-First Development** - 95% mobile compatibility target
3. **Performance by Design** - 60fps animations, <200KB bundle
4. **Type Safety** - Full TypeScript implementation
5. **Quality Gates** - Automated code quality enforcement
6. **Component Modularity** - Reusable, testable architecture

---

## 🛠️ **Development Environment Setup**

### **Prerequisites**
```bash
# Required software
Node.js >= 18.0.0
npm >= 8.0.0 (or yarn/pnpm)
Git >= 2.25.0
VS Code (recommended)

# Verify installation
node --version  # v18.x.x or higher
npm --version   # 8.x.x or higher
git --version   # 2.x.x or higher
```

### **IDE Configuration (VS Code)**
```json
// .vscode/settings.json (recommended)
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### **Recommended VS Code Extensions**
```
Essential Extensions:
├── ES7+ React/Redux/React-Native snippets
├── Tailwind CSS IntelliSense  
├── TypeScript Importer
├── ESLint
├── Prettier - Code formatter
├── Auto Rename Tag
├── Bracket Pair Colorizer 2
└── GitLens — Git supercharged
```

---

## 🚀 **Project Setup**

### **Initial Setup**
```bash
# Clone repository
git clone https://github.com/aziwar/AZ-Digital-Hub.git
cd AZ-Digital-Hub

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### **Environment Configuration**
```bash
# .env.local (create this file)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Optional: AI features
OPENAI_API_KEY=your_openai_api_key

# Development configuration
SITE_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📁 **Development Workflow**

### **Git Workflow**
```bash
# Feature development workflow
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Make your changes
# Test locally with quality gates
npm run quality-gates

# Commit with descriptive message
git add .
git commit -m "feat: add mobile optimization for contact form"

# Push feature branch
git push origin feature/your-feature-name

# Create pull request via GitHub
# Merge after review and CI passes
```

### **Branch Naming Convention**
```
Feature branches:     feature/mobile-optimization
Bug fixes:           fix/contact-form-validation  
Hotfixes:            hotfix/critical-security-patch
Documentation:       docs/update-development-guide
Refactoring:         refactor/component-architecture
```

---

## 🧪 **Development Scripts**

### **Core Development Commands**
```bash
# Development server
npm run dev              # Start dev server with hot reload
npm run dev -- --turbo   # Start with Turbo mode (faster)

# Building & Testing
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint validation
npm run type-check       # TypeScript validation

# Quality Gates
npm run quality-gates    # Run all validation stages
npm run pre-deploy       # Pre-deployment validation
npm run deployment-safety # Configuration safety check
```

### **Maintenance Commands**
```bash
# Clean & Reset
npm run clean           # Clean build files (.next, cache)
npm run full-clean      # Full clean + reinstall dependencies

# Dependencies  
npm run audit-fix       # Fix security vulnerabilities
npm run check-deps      # Verify dependency tree
npm outdated            # Check for outdated packages

# Asset Management
npm run generate-assets # AI-powered asset generation (optional)
```

---

## 📊 **Quality Gates Development**

### **Pre-Commit Quality Checks**
```bash
# MANDATORY: Run before every commit
npm run quality-gates

# This runs all 6 stages:
# Stage 1: Configuration Safety
# Stage 2: TypeScript Validation  
# Stage 3: ESLint Compliance
# Stage 4: Dependency Security
# Stage 5: Production Build
# Stage 6: Security Validation
```

### **Quality Gate Details**
```bash
# Individual quality gates for targeted fixes
npm run stage-1-safety      # Validate next.config.js
npm run stage-2-typescript  # Type checking
npm run stage-3-eslint      # Code quality
npm run stage-4-dependencies # Security audit
npm run stage-5-build       # Production build test
npm run stage-6-security    # Security validation
```

---

## 🏗️ **Component Development**

### **Component Architecture Standards**
```typescript
// Component template structure
interface ComponentProps {
  // Props interface with JSDoc
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  children, 
  className 
}) => {
  // Custom hooks
  const { elementRef, isVisible } = useScrollObserver();
  
  // State management
  const [state, setState] = useState<StateType>(initialState);
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies]);
  
  return (
    <section 
      ref={elementRef}
      className={cn(
        'base-classes',
        isVisible && 'visible-classes',
        className
      )}
    >
      {/* Component JSX */}
    </section>
  );
};

export default Component;
```

### **Component Development Guidelines**
```typescript
// 1. Use TypeScript interfaces for all props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 2. Implement proper error boundaries
const ComponentWithErrorBoundary = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Component />
  </ErrorBoundary>
);

// 3. Use performance optimizations
const OptimizedComponent = memo(Component);
const LazyComponent = lazy(() => import('./HeavyComponent'));

// 4. Implement accessibility
const AccessibleComponent = () => (
  <button
    aria-label="Professional consultation booking"
    role="button"
    tabIndex={0}
  >
    Book Consultation
  </button>
);
```

---

## 🎨 **Styling Development**

### **Tailwind CSS Workflow**
```css
/* Global styles structure */
/* 1. Base styles */
@tailwind base;
@tailwind components;  
@tailwind utilities;

/* 2. Custom animations */
@keyframes fadeInUp {
  /* Animation definitions */
}

/* 3. Component-specific styles */
.btn-magnetic {
  @apply transition-all duration-300;
}

/* 4. Responsive modifiers */
@media (hover: none) and (pointer: coarse) {
  /* Mobile-specific styles */
}
```

### **Animation Development**
```css
/* Performance-optimized animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* Intersection Observer classes */
.observe-fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.observe-fade-in.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 🔧 **Custom Hooks Development**

### **Hook Development Pattern**
```typescript
// useScrollObserver.ts example
export function useScrollObserver(options: UseScrollObserverOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(currentElement);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);
    return () => observer.unobserve(currentElement);
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
```

### **Hook Testing Pattern**
```typescript
// Custom hook testing
import { renderHook } from '@testing-library/react';
import { useScrollObserver } from './useScrollObserver';

describe('useScrollObserver', () => {
  test('should initialize with correct defaults', () => {
    const { result } = renderHook(() => useScrollObserver());
    expect(result.current.isVisible).toBe(false);
  });
});
```

---

## 📱 **Mobile-First Development**

### **Mobile Development Workflow**
```bash
# Mobile testing setup
npm run dev
# Open Chrome DevTools
# Toggle device emulation
# Test on: iPhone 12, iPad, Android phones

# Real device testing
# Use ngrok for external access
npx ngrok http 3000
# Test on physical devices
```

### **Mobile-Specific Development**
```typescript
// Touch device detection
const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window);
    };
    checkTouch();
  }, []);
  
  return isTouch;
};

// Mobile-optimized components
const MobileOptimizedButton = ({ children, ...props }) => {
  const isTouch = useTouch();
  
  return (
    <button
      className={cn(
        'py-3 px-6', // Base padding
        isTouch && 'py-4 px-8' // Larger touch targets
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## ⚡ **Performance Development**

### **Performance Monitoring Setup**
```typescript
// Performance monitoring in development
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // Track key metrics
  switch (metric.name) {
    case 'CLS':
    case 'LCP':
    case 'FCP':
    case 'FID':
    case 'TTFB':
      // Log or send to analytics
      break;
  }
}
```

### **Performance Optimization Techniques**
```typescript
// Code splitting
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
);

// Image optimization
<Image
  src="/images/profile.jpg"
  alt="Professional headshot"
  width={400}
  height={400}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Memory optimization
useEffect(() => {
  const controller = new AbortController();
  
  fetchData({ signal: controller.signal });
  
  return () => controller.abort();
}, []);
```

---

## 🧪 **Testing Development**

### **Testing Strategy**
```bash
# Testing commands (when implemented)
npm run test            # Unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

### **Component Testing Pattern**
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  test('validates email input', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

---

## 🔍 **Debugging Development**

### **Debugging Setup**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### **Common Debugging Scenarios**
```typescript
// Debug React component renders
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Component rendered with props:', props);
  }
}, [props]);

// Debug custom hooks
export function useScrollObserver(options: UseScrollObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('useScrollObserver:', { isVisible, options });
    }
  }, [isVisible, options]);
  
  return { elementRef, isVisible };
}

// Debug API routes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', body);
    }
    
    // Process request
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

## 📊 **Development Analytics**

### **Local Analytics Setup**
```typescript
// Development analytics
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  // Track development metrics
  window.devAnalytics = {
    componentRenders: 0,
    apiCalls: 0,
    errors: 0
  };
}

// Performance measurement
const measurePerformance = (name: string, fn: () => void) => {
  if (isDevelopment) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
  } else {
    fn();
  }
};
```

---

## 🔄 **Development Best Practices**

### **Code Quality Standards**
1. **TypeScript First** - All new code must be TypeScript
2. **Component Props** - Always define interfaces for component props
3. **Error Handling** - Implement error boundaries and proper error handling
4. **Performance** - Use React.memo, useMemo, useCallback appropriately
5. **Accessibility** - Include ARIA labels, semantic HTML, keyboard navigation
6. **Mobile-First** - Design and develop for mobile, enhance for desktop

### **Commit Standards**
```bash
# Conventional commit format
feat: add mobile optimization for hero section
fix: resolve contact form validation issue
docs: update component documentation
style: improve button hover animations
refactor: optimize scroll observer performance
test: add unit tests for custom hooks
```

### **Code Review Checklist**
- [ ] TypeScript types properly defined
- [ ] ESLint warnings resolved
- [ ] Mobile responsiveness verified
- [ ] Performance impact assessed
- [ ] Accessibility standards met
- [ ] Error handling implemented
- [ ] Tests added/updated (when applicable)

---

## 🚀 **Development Optimization**

### **Build Performance**
```javascript
// next.config.js optimizations
const nextConfig = {
  experimental: {
    // Package import optimization
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react'
    ],
    // Memory optimizations
    webpackMemoryOptimizations: true,
  },
  
  // Compiler optimizations
  swcMinify: true,
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}'
    }
  }
};
```

### **Development Hot Reload Optimization**
```bash
# Optimize development experience
# Use --turbo for faster builds
npm run dev -- --turbo

# Or configure in package.json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

---

## 📚 **Development Resources**

### **Documentation References**
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Styling framework
- **[React Documentation](https://reactjs.org/docs/)** - React component patterns

### **Internal Documentation**
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
- **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - Component usage patterns
- **[MOBILE_OPTIMIZATION.md](./MOBILE_OPTIMIZATION.md)** - Mobile development guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment processes

---

## 🛠️ **Development Tools**

### **Recommended Browser Extensions**
- **React Developer Tools** - Component debugging
- **Redux DevTools** - State management (if applicable)
- **Lighthouse** - Performance auditing
- **Web Vitals** - Core Web Vitals monitoring

### **Command Line Tools**
```bash
# Useful CLI tools
npx next-bundle-analyzer  # Bundle analysis
npx @next/codemod         # Code migrations
npx create-next-app       # Project scaffolding
npx eslint --init         # ESLint setup
```

---

## 👨‍💼 **Development Team**

**Lead Developer**: Ahmed Zewar  
**Last Updated**: January 2025  
**Next Review**: April 2025

**Contact for Development Questions**:
- 📧 [ahmed@zewar.xyz](mailto:ahmed@zewar.xyz)  
- 📱 [+965 6067 2773](https://wa.me/96560672773)

---

*Excellence in development for Kuwait's digital transformation* 💻