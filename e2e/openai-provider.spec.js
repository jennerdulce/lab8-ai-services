import { test, expect } from '@playwright/test';

test.describe('OpenAI Provider Tests (Mock Mode)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/src/index.html');
        await page.selectOption('#ai-provider-dropdown', 'openai');
    });

    test('should respond with mock OpenAI response', async ({ page }) => {
        const testMessage = 'hello world';

        await page.fill('#user-input', testMessage);
        await page.click('#send-btn');

        // Wait for user message
        await expect(page.locator('#message-container .user-message')).toHaveCount(1);
        await expect(page.locator('#message-container .user-message .message-text')).toHaveText(testMessage);

        // Wait for OpenAI's mock response (has 500ms delay)
        await expect(page.locator('#message-container .bot-output')).toHaveCount(1, { timeout: 3000 });

        const botResponse = await page.locator('#message-container .bot-output .message-text').textContent();
        expect(botResponse).toContain('OpenAI GPT says: I received your message');
        expect(botResponse).toContain(testMessage);
        expect(botResponse).toContain('This is a mock response for testing');
    });

    test('should export chat with OpenAI provider name in filename', async ({ page }) => {
        // Send a message first to have something to export
        await page.fill('#user-input', 'Test message for export');
        await page.click('#send-btn');

        await expect(page.locator('#message-container .bot-output')).toHaveCount(1, { timeout: 3000 });

        // Set up download listener
        const downloadPromise = page.waitForEvent('download');

        // Click export button
        await page.click('#export-chat-btn');

        // Wait for download
        const download = await downloadPromise;

        // Check filename contains provider name
        expect(download.suggestedFilename()).toContain('openai');
        expect(download.suggestedFilename()).toContain('chat-export');
    });
});