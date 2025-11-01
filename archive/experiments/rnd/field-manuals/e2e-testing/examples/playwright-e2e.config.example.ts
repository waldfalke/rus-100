// examples/playwright-e2e.config.example.ts
// Example E2E configuration that satisfies CONTRACT-E2E-TESTING-001
// Copy this file to your project root as playwright-e2e.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ✅ AC-001: Separate E2E config with .spec.ts matching
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',  // Only .spec.ts files
  outputDir: 'test-results/e2e',
  
  // Parallel execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // ✅ Invariant: Retries configurable per environment
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Multiple reporters for better visibility
  reporter: [
    ['html', { outputFolder: 'playwright-report/e2e' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['list']
  ],
  
  use: {
    // ✅ Required prop: baseURL
    baseURL: 'http://localhost:3000',
    
    // Evidence on failures
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // ✅ Constraint: Default viewport for consistency
    viewport: { width: 1280, height: 720 },
  },
  
  // Single browser for E2E (add more if needed)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // ✅ Required: Web server configuration
  webServer: {
    command: 'npm run dev',  // Adjust to your dev server command
    url: 'http://localhost:3000',
    reuseExistingServer: true,  // ✅ Invariant: Must be true
    timeout: 120 * 1000,
  },
});
