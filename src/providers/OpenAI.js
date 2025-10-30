/**
 * OpenAI API Integration Module
 * Provides async communication with OpenAI's GPT API
 * Supports both DEBUG mode (mock responses) and production mode (real API calls)
 */

/**
 * Get a response from OpenAI GPT
 * @param {string} userMessage - The user's message to send to OpenAI
 * @returns {Promise<string>} The AI response or error message
 */
export async function getOpenAIResponse(userMessage) {
  /** @type {boolean} Debug mode flag - set to false for production API calls */
  let DEBUG = true; // Set to false when you have a real API key
  
  // For development/testing without API key
  if (DEBUG) {
    // Simulate API delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));
    return `OpenAI GPT says: I received your message "${userMessage}". This is a mock response for testing.`;
  }

//   const API_KEY = process.env.OPENAI_API_KEY;
  /** @type {string} API key for OpenAI authentication */
  API_KEY = prompt('Enter your API key')
  
  /** @type {string} OpenAI API endpoint URL */
  const url = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano", // you can use "gpt-4o-mini" or "gpt-4-turbo" too
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    // Check if the API returned an error
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return `Error: ${data.error.message}`;
    }

    // Extract the assistant's reply
    const reply = data.choices[0].message.content.trim();
    return reply;

  } catch (err) {
    console.error("Request failed:", err);
    return "Sorry, something went wrong with the API request.";
  }
}