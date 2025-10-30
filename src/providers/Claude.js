/**
 * Claude API Integration Module
 * Provides async communication with Anthropic's Claude API
 * Supports both DEBUG mode (mock responses) and production mode (real API calls)
 */

/**
 * Get a response from Claude AI
 * @param {string} userMessage - The user's message to send to Claude
 * @returns {Promise<string>} The AI response or error message
 */
export async function getClaudeResponse(userMessage) {
    /** @type {boolean} Debug mode flag - set to false for production API calls */
    let DEBUG = true; // Set to false when you have a real API key
    
    // For development/testing without API key
    if (DEBUG) {
        // Simulate API delay for realistic testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `Claude says: I received your message "${userMessage}". This is a mock response for testing.`;
    }

    // const API_KEY = process.env.CLAUDE_API_KEY;
    /** @type {string} API key for Claude authentication */
    API_KEY = prompt('Enter your API key')

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: userMessage
                    }
                ]
            })
        })

        const data = await response.json();
        
        if (response.ok) {
            console.log(data.content[0].text);
            return data.content[0].text;
        } else {
            throw new Error('API Error: ' + JSON.stringify(data));
        }
        
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return `Error: Unable to get Claude response. ${error.message}`;
    }
}