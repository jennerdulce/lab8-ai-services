export async function getOpenAIResponse(userMessage) {
  const API_KEY = process.env.OPENAI_API_KEY;
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