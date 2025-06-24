import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './automation',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:3000', // assuming Next.js runs here
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
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
});
