import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Playwright configuration for BDD tests (.feature files) and visual regression testing
 * @see https://playwright.dev/docs/test-configuration
 */

const testDir = defineBddConfig({
  features: 'tests/e2e/*.feature',
  steps: [
    'tests/e2e/steps.ts',              // Ручные бизнес-шаги
    'tests/e2e/generated-steps.ts'     // Автогенерированные технические шаги
  ],
});

export default defineConfig({
  testDir, // BDD сгенерированные тесты
  /* Output folder for test artifacts */
  outputDir: 'test-results/artifacts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/visual-test-results.xml' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3001',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
  },
  
  /* Global test timeout */
  timeout: 30 * 1000,
  
  /* Expect timeout for assertions */
  expect: {
    /* Timeout for expect() calls */
    timeout: 10 * 1000,
    
    /* Threshold for visual comparisons */
    toHaveScreenshot: {
      threshold: 0.2,
      mode: 'strict',
    },
    
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Ensure consistent rendering for visual tests
        viewport: { width: 1280, height: 720 },
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    /* High contrast and accessibility testing */
    {
      name: 'High Contrast',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark',
        extraHTTPHeaders: {
          'prefers-contrast': 'high',
        },
      },
    },

    /* Reduced motion testing */
    {
      name: 'Reduced Motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true, // Используем уже запущенный сервер
    timeout: 120 * 1000,
  },
});
