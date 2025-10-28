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
        // Send message with Claude
        await page.fill('#user-input', 'Hello from Claude test');
        await page.click('#send-btn');

        await expect(page.locator('#message-container .bot-output')).toHaveCount(1, { timeout: 5000 });

        // Switch to Eliza
        await page.selectOption('#ai-provider-dropdown', 'eliza');
        await expect(page.locator('#message-container li')).toHaveCount(0);

        // Send message with Eliza
        await page.fill('#user-input', 'Hello from Eliza test');
        await page.click('#send-btn');
        await expect(page.locator('#message-container .bot-output')).toHaveCount(1);

        // Switch back to Claude - should restore Claude's chat
        await page.selectOption('#ai-provider-dropdown', 'claude');
        await expect(page.locator('#message-container li')).toHaveCount(2);

        const claudeResponse = await page.locator('#message-container .bot-output .message-text').textContent();
        expect(claudeResponse).toContain('Hello from Claude test');
    });
});