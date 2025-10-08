// This file contains global type declarations for the project

// Allow importing modules with .js extensions in TypeScript
// This is needed for ESM compatibility
declare module '*.js' {
  const content: unknown;
  export default content;
}

// Global type declarations for process environment
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

// Make this file a module
export {}
