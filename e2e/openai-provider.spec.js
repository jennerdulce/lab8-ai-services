import { test, expect } from '@playwright/test';

test.describe('OpenAI Provider Tests (Mock Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/index.html');
    await page.selectOption('#ai-provider-dropdown', 'openai');
  });

  test('should respond with mock OpenAI response', async ({ page }) => {
   
  });

  test('should export chat with OpenAI provider name in filename', async ({ page }) => {
   
  });
});