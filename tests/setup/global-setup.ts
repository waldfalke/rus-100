import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for dev server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3001';
    console.log(`⏳ Waiting for dev server at ${baseURL}...`);
    
    let retries = 0;
    const maxRetries = 30;
    
    while (retries < maxRetries) {
      try {
        const response = await page.goto(baseURL, { 
          waitUntil: 'networkidle',
          timeout: 5000 
        });
        
        if (response?.ok()) {
          console.log('✅ Dev server is ready!');
          break;
        }
      } catch (error) {
        retries++;
        console.log(`⏳ Attempt ${retries}/${maxRetries} - Server not ready yet...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (retries >= maxRetries) {
      throw new Error('Dev server failed to start within timeout period');
    }
    
    // Pre-warm the application
    console.log('🔥 Pre-warming application...');
    
    // Load main demo page
    await page.goto(`${baseURL}/demo`);
    await page.waitForSelector('[data-testid="theme-provider"]', { timeout: 10000 });
    
    // Load context demo page
    await page.goto(`${baseURL}/demo/context`);
    await page.waitForSelector('[data-testid="context-demo"]', { timeout: 10000 });
    
    // Load token display page
    await page.goto(`${baseURL}/demo/tokens`);
    await page.waitForSelector('[data-testid="token-display"]', { timeout: 10000 });
    
    console.log('✅ Application pre-warming completed!');
    
    // Set up test data or state if needed
    await page.evaluate(() => {
      // Clear any existing localStorage/sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Set consistent test environment
      localStorage.setItem('test-mode', 'true');
      
      // Disable animations globally for consistent screenshots
      const style = document.createElement('style');
      style.id = 'test-animations-disabled';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    console.log('✅ Test environment configured!');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎉 Global setup completed successfully!');
}

export default globalSetup;