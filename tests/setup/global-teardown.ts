import { FullConfig } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Clean up test artifacts if needed
    const testResultsDir = 'test-results';
    const artifactsDir = path.join(testResultsDir, 'artifacts');
    
    // Generate test summary
    const summaryPath = path.join(testResultsDir, 'test-summary.json');
    const summary = {
      timestamp: new Date().toISOString(),
      testRun: {
        completed: true,
        duration: Date.now(), // This would be calculated properly in a real implementation
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
      artifacts: {
        screenshots: 0,
        videos: 0,
        traces: 0,
      },
    };
    
    // Count artifacts
    try {
      const artifacts = await fs.readdir(artifactsDir);
      summary.artifacts.screenshots = artifacts.filter(f => f.endsWith('.png')).length;
      summary.artifacts.videos = artifacts.filter(f => f.endsWith('.webm')).length;
      summary.artifacts.traces = artifacts.filter(f => f.endsWith('.zip')).length;
    } catch (error) {
      // Artifacts directory might not exist
      console.log('📁 No artifacts directory found');
    }
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Test summary written to ${summaryPath}`);
    
    // Clean up old screenshots if running in CI
    if (process.env.CI) {
      console.log('🗑️ Cleaning up old test artifacts in CI...');
      
      try {
        // Keep only the latest test run artifacts
        const files = await fs.readdir(testResultsDir);
        const oldFiles = files.filter(f => 
          f.startsWith('test-results-') && 
          !f.includes(new Date().toISOString().split('T')[0])
        );
        
        for (const file of oldFiles) {
          await fs.rm(path.join(testResultsDir, file), { recursive: true, force: true });
          console.log(`🗑️ Removed old artifact: ${file}`);
        }
      } catch (error) {
        console.log('⚠️ Could not clean up old artifacts:', error);
      }
    }
    
    // Log final statistics
    console.log('📈 Test run statistics:');
    console.log(`   Screenshots: ${summary.artifacts.screenshots}`);
    console.log(`   Videos: ${summary.artifacts.videos}`);
    console.log(`   Traces: ${summary.artifacts.traces}`);
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here as it might mask test failures
  }
  
  console.log('✅ Global teardown completed!');
}

export default globalTeardown;