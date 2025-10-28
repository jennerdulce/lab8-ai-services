// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Eliza AI Provider Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/src/index.html');
        await page.selectOption('#ai-provider-dropdown', 'eliza');
    });

    test('should respond to basic user message', async ({ page }) => {
        await page.fill('#user-input', 'hello world');
        await page.click('#send-btn');

        // Wait for user message
        await expect(page.locator('#message-container .user-message')).toHaveCount(1);
        await expect(page.locator('#message-container .user-message .message-text')).toHaveText('hello world');

        // Wait for Eliza response (immediate)
        await expect(page.locator('#message-container .bot-output')).toHaveCount(1);

        const botResponse = await page.locator('#message-container .bot-output .message-text').textContent();
        expect(botResponse).toBeTruthy();
        expect(botResponse?.length).toBeGreaterThan(0);
    });

});