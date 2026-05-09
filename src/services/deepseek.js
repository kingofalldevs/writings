const getApiKey = () => import.meta.env.VITE_DEEPSEEK_API_KEY || "";

export const getDeepSeekResponse = async (userMessage, context) => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    console.error("DeepSeek API Key is missing.");
    return "I can't find your DeepSeek API key! Please add VITE_DEEPSEEK_API_KEY to your .env file.";
  }

  try {
    const systemPrompt = `You are Aria, the Crescendo AI companion—a perceptive creative writing partner.
Your tone is natural, professional, and grounded.

You have access to two layers of context:
1. CURRENT EDITOR CONTENT: The specific document the user is currently working on.
2. IDEABASE REFERENCE: The user's broader collection of notes, research, and ideas.

When answering:
- Prioritize the CURRENT EDITOR CONTENT if they ask about what they are writing right now.
- Use the IDEABASE REFERENCE to provide thematic consistency, reference research, or recall ideas from other notes.
- If the user asks a general question, use both to provide a holistic answer.
- Keep responses concise and focused on the user's creative process.
- Avoid overanalyzing small snippets unless asked.

CONTEXT:
---
${context || "No context provided yet."}
---`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `DeepSeek API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content;
    
    if (!text) {
      throw new Error("Received an empty response from DeepSeek.");
    }

    return text;
  } catch (error) {
    console.error("DeepSeek API Error Detail:", error);
    return `AI Error: ${error.message || "I hit a snag while thinking. Check your console for details!"}`;
  }
};
