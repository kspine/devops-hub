# GameOps CI/CD Toolkit

A comprehensive full-stack toolkit for managing game production pipelines, build configurations, and CI/CD compliance.

## Project Overview

This application provides a suite of tools for GameOps engineers to streamline build pipeline creation, manage production environments, and audit compliance issues.

## Technical Architecture

- **Frontend**: React 18+ with Vite, utilizing Tailwind CSS for styling and `recharts` for visualization.
- **Backend**: Express.js server (`server.ts`) for API routing and server-side logic.
- **State Management**: React Context (`EngineContext`) and local state.
- **Build System**: `npm run build` using `vite` and `esbuild` for production-ready bundling into `dist/server.cjs`.

## Key Modules

### 1. Pipeline Builder (`src/components/PipelineBuilder.tsx`)
Enables the configuration and visualization of custom build pipelines. Supports various platforms (Android, iOS, WebGL, Standalone) and dynamic step management.

### 2. Production Suite (`src/components/ProductionSuite.tsx`)
A command center for production environment operations, including cache management, environment variable settings, and CDN invalidation. It utilizes utility functions from `src/utils/productionCommands.ts` to manage infrastructure commands.

### 3. Signing Helper (`src/components/SigningHelper.tsx`)
Provides automated compliance auditing to detect insecure endpoints, hardcoded sensitive data, and deprecated API usage in the codebase.

## Configuration

The application requires environment variables defined in `.env.example`.

```env
# Define required variables here
```

## Build and Deployment

- **Development**:
  - Run `npm run dev` to start the development server.
- **Production Build**:
  - Run `npm run build`. This bundles the frontend and backend into the `dist/` directory.
- **Production Start**:
  - Run `npm start` to execute the production server (`node dist/server.cjs`).

## Production Readiness

The application has been verified through successful build (`compile_applet`) and linting (`tsc --noEmit`) passes. It is structured for standard production deployment (e.g., Cloud Run).
