# GEMINI.md

## Project Overview

This is a Next.js application that serves as a professional digital marketing portfolio for Ahmed Zewar. It is built with TypeScript and styled with Tailwind CSS. The project is deployed on Vercel and is optimized for mobile devices and performance. It includes features like a contact form, interactive charts, and animations. The project also has a focus on security, with features like API rate limiting.

The project is well-documented, with a detailed `README.md` file that covers architecture, deployment, and more. It also has a number of scripts for building, running, and testing the project.

## Building and Running

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/aziwar/AZ-Digital-Hub.git
cd AZ-Digital-Hub

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev
```

### Building
```bash
# Build for production
npm run build
```

### Testing
```bash
# Run ESLint
npm run lint

# TypeScript validation
npm run type-check

# Quality Gates (Recommended before deployment)
npm run quality-gates
```

## Development Conventions

The project follows standard conventions for Next.js and TypeScript projects. It uses ESLint for code quality and has a number of scripts for validating the code. The project also has a focus on security, with features like API rate limiting.

The project is well-structured, with a `src` directory that contains the majority of the code. The `src` directory is further divided into `app`, `components`, `hooks`, `lib`, `data`, and `types` directories. The `app` directory contains the Next.js App Router, the `components` directory contains the React components, the `hooks` directory contains custom React hooks, the `lib` directory contains utilities and configuration, the `data` directory contains static content, and the `types` directory contains TypeScript definitions.
