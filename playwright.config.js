// @ts-check
// @ts-ignore
import { defineConfig, devices } from '@playwright/test';
/**
 * @see https://playwright.dev/docs/test-configuration
 */

// Set environment dynamically (default to 'staging' if not provided)
//const ENV = process.env.ENV || 'staging';
const ENV = process.env.ENV && ['staging', 'production'].includes(process.env.ENV)
  ? process.env.ENV
  : 'staging';
const config = {
  staging: { baseURL: 'https://team.hownowindia.com' },
  production: { baseURL: 'https://qateam.hownow.app' },
};

// Log the environment being used
console.log(`Running tests in ${ENV.toUpperCase()} environment: ${config[ENV].baseURL}`);

export default defineConfig({
  testDir: './tests',
  timeout: 240000,

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    baseURL: config[ENV].baseURL,  // ✅ Apply baseURL dynamically
    headless: true, // Run in headless mode by default
    ignoreHTTPSErrors: true, // Ignore SSL errors (Certificate Issue)
    // trace: process.env.CI ? 'on' : 'retain-on-failure', // Debugging traces
    // video: process.env.CI ? 'on' : 'retain-on-failure', // Capture videos for failed tests
    // screenshot: 'only-on-failure', // Capture screenshots only on test failure
    expect: { timeout: 60000 }, // Increase assertion timeout
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});

