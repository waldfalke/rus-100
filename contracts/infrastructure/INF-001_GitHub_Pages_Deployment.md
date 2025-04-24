# Infrastructure Contract: INF-001 GitHub Pages Deployment

**Version:** 1.0
**Date:** 2025-07-25
**Author:** Gemini 2.5 Pro

## 1. Overview

**ID:** INF-001
**Name:** GitHub Pages Deployment via GitHub Actions
**Description:** Configuration for automatically building and deploying the static export of the Next.js application to GitHub Pages using GitHub Actions.

## 2. Goals

*   Automate the deployment process for the project website.
*   Host the static website preview directly from the GitHub repository.
*   Ensure reliable updates upon pushes to the main branch.

## 3. Configuration Details

### 3.1. Next.js Configuration (`next.config.mjs`)

*   **Static Export:** The `output: 'export'` option is enabled to generate a fully static site compatible with GitHub Pages.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // ... other config
}
export default nextConfig
```

### 3.2. GitHub Actions Workflow (`.github/workflows/nextjs.yml`)

*   **Trigger:** The workflow runs automatically on pushes to the `main` branch and can be triggered manually (`workflow_dispatch`).
*   **Permissions:** Appropriate permissions (`pages: write`, `id-token: write`) are set for the `GITHUB_TOKEN` to allow deployment.
*   **Build Steps:**
    *   Checkout code.
    *   Detect package manager (pnpm).
    *   Install pnpm using `pnpm/action-setup@v4`.
    *   Setup Node.js (v18) with caching enabled for the detected package manager using `actions/setup-node@v4`.
    *   Configure GitHub Pages using `actions/configure-pages@v5`.
    *   Install dependencies (`pnpm install`).
    *   Build the static site (`pnpm next build`). The output goes to the `./out` directory.
    *   Create a `.nojekyll` file in the `./out` directory to prevent GitHub Pages from running Jekyll.
    *   Upload the `./out` directory as a pages artifact using `actions/upload-pages-artifact@v3`.
*   **Deploy Step:**
    *   Deploy the uploaded artifact to the `github-pages` environment using `actions/deploy-pages@v4`.

### 3.3. GitHub Repository Settings (`Settings -> Pages`)

*   **Source:** Must be set to **"GitHub Actions"**. This allows the workflow defined in `nextjs.yml` to control the deployment process.

## 4. Deployment URL

*   The deployed site is available at: `https://<username>.github.io/<repository-name>/` (e.g., `https://waldfalke.github.io/rus-100/`)

## 5. Dependencies

*   Requires a GitHub repository with Actions enabled.
*   Relies on the Next.js framework configured for static export.

## 6. Maintenance Notes

*   Ensure the Node.js version in the workflow matches project requirements.
*   Monitor workflow runs in the "Actions" tab for successful deployments or errors.
*   Keep Actions (`actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, etc.) updated periodically for security and features. 