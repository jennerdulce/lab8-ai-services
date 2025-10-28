import { test, expect } from '@playwright/test';

test.describe('Claude AI Provider Tests (Mock Mode)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/src/index.html');
        await page.selectOption('#ai-provider-dropdown', 'claude');
    });

    test('should respond with mock Claude response', async ({ page }) => {
        const testMessage = 'Hello World';

        await page.fill('#user-input', testMessage);
        await page.click('#send-btn');

        // Wait for user message
        await expect(page.locator('#message-container .user-message')).toHaveCount(1);
        await expect(page.locator('#message-container .user-message .message-text')).toHaveText(testMessage);

        // Wait for Claude's mock response (has 1 second delay)
        await expect(page.locator('#message-container .bot-output')).toHaveCount(1, { timeout: 5000 });

        const botResponse = await page.locator('#message-container .bot-output .message-text').textContent();
        expect(botResponse).toContain('Claude says: I received your message');
        expect(botResponse).toContain(testMessage);
        expect(botResponse).toContain('This is a mock response for testing');
    });

    test('should maintain separate chat history when switching providers', async ({ page }) => {

    });
});