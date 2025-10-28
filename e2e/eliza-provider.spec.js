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

        // Wait for Eliza response
        await expect(page.locator('#message-container .bot-output')).toHaveCount(1);

        const botResponse = await page.locator('#message-container .bot-output .message-text').textContent();
        expect(botResponse).toBeTruthy();
        expect(botResponse?.length).toBeGreaterThan(0);
    });

    test('should allow editing and deleting user messages', async ({ page }) => {
        await page.fill('#user-input', 'Original message');
        await page.click('#send-btn');

        await expect(page.locator('#message-container .user-message')).toHaveCount(1);

        // Click on user message to show edit options
        await page.click('#message-container .user-message');
        await expect(page.locator('.message-actions')).not.toHaveClass(/hidden/);

        // Test edit functionality
        await page.click('[data-action="edit"]');
        await page.fill('.edit-textarea', 'Edited message');
        await page.click('.edit-save-btn');

        await expect(page.locator('#message-container .user-message .message-text')).toHaveText('Edited message (edited)');
    });

});