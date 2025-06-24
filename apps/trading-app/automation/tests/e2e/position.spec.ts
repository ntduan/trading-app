import { test, expect } from '@playwright/test';

test('Order appears in Positions widget', async ({ page }) => {
  await page.goto('http://localhost:3000/trade/BTCUSDT'); // Adjust URL as needed

  await expect(page).toHaveURL(/trade\/BTCUSDT/);
  
  await page.waitForSelector('[data-testid="buy-price-input"]');
  await expect(page.getByTestId('buy-price-input')).toHaveValue(/^\d+(\.\d+)?$/);

  await page.fill('[data-testid="buy-amount-input"]', '1');
  await page.click('[data-testid="buy-submit-button"]');

  await expect(page.getByTestId('order-row-1')).toBeVisible();
  await expect(page.getByTestId('order-row-1')).toContainText('1.0000'); // or other identifying info
  await expect(page.getByTestId('order-row-1')).toContainText('BTCUSDT');
});