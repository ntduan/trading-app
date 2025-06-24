import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './automation',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:3000', // assuming Next.js runs here
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
