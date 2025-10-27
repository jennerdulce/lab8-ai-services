// Simple API call using fetch with async/await
export async function getClaudeResponse(userMessage) {
    let DEBUG = false; // Set to false when you have a real API key
    
    // For development/testing without API key
    if (DEBUG) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `Claude says: I received your message "${userMessage}". This is a mock response for testing.`;
    }

    // Replace 'YOUR_ACTUAL_API_KEY_HERE' with your real Claude API key
    const API_KEY = process.env.CLAUDE_API_KEY;

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