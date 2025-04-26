# Project Setup Documentation Template

## Overview
This document outlines the steps required to set up the project environment and get started with development.

## Prerequisites
- **Operating System**: [Specify OS]
- **Dependencies**: [List any dependencies]
- **Tools**: [List any required tools]

## Installation
1. **Clone the Repository**
   ```sh
   git clone [repository-url]
   cd [project-directory]
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```sh
     API_KEY=your_api_key
     DATABASE_URL=your_database_url
     ```

4. **Database Setup**
   - Run the database migrations:
     ```sh
     npm run migrate
     ```

5. **Start the Development Server**
   ```sh
   npm run dev
   ```

## Testing
- Run the test suite:
  ```sh
  npm test
  ```

## Deployment
- Build the project:
  ```sh
  npm run build
  ```

- Deploy the project:
  ```sh
  npm run deploy
  ```

## Additional Notes
- [Any additional notes or tips]

# Project Setup and Build Configuration

## Build Configurations

### Next.js Configuration (next.config.mjs)
```javascript
const isProd = process.env.NODE_ENV === 'production'
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/rus-100' : '',
  assetPrefix: isGithubPages ? '/rus-100/' : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
}
```

### Available Build Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev",                    // Development mode (localhost:3000)
    "build": "next build",                // Production build for localhost
    "build:gh-pages": "GITHUB_PAGES=true next build", // Production build for GitHub Pages
    "start": "next start",                // Start Next.js server
    "start:static": "serve out",          // Serve static build locally
    "lint": "next lint"                   // Run linter
  }
}
```

### Build Environments

1. **Development Mode**
   - Command: `npm run dev`
   - URL: `localhost:3000`
   - Features: Hot reload, development tools
   - No basePath prefix

2. **Local Production**
   - Build: `npm run build`
   - Serve: `npm run start:static`
   - URL: `localhost:3000`
   - Features: Optimized production build
   - No basePath prefix

3. **GitHub Pages Production**
   - Build: `npm run build:gh-pages`
   - URL: `https://waldfalke.github.io/rus-100/`
   - Features: Optimized production build
   - With basePath prefix `/rus-100`

### Key Environment Variables
- `NODE_ENV`: 'production' | 'development'
- `GITHUB_PAGES`: 'true' | undefined

### Dependencies
- `serve`: Required for local static file serving
- `next`: Core framework
- `react` and `react-dom`: UI library
- Various UI components and utilities

### Notes
- Static export is used (`output: 'export'`)
- Image optimization is disabled for static export
- TypeScript errors are not ignored during build
- ESLint errors are ignored during build
- No trailing slashes in URLs for better compatibility