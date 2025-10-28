// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Eliza AI Provider Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/src/index.html');
        await page.selectOption('#ai-provider-dropdown', 'eliza');
    });

    test('should respond to basic user message', async ({ page }) => {

    });

});