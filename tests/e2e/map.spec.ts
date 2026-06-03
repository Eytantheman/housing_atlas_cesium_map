import { test, expect } from '@playwright/test';

test('map loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('.maplibregl-map')).toBeVisible({ timeout: 10000 });
});

test('project list shows 29 projects', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('button:has-text("List")');
  const cards = page.locator('[data-testid="project-card"]');
  await expect(cards).toHaveCount(29);
});
