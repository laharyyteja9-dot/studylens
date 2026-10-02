export async function callGeminiJSON<T>(prompt: string, schema?: any): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API Key');
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      ...(schema && { responseSchema: schema })
    }
  };

  const attempt = async () => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API Error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Empty response from Gemini');
    
    return JSON.parse(content) as T;
  };

  try {
    return await attempt();
  } catch (error) {
    console.warn("First LLM attempt failed, retrying once...", error);
    try {
      return await attempt();
    } catch (retryError) {
      console.error("LLM retry failed", retryError);
      throw new Error("Sorry, the AI is having trouble right now. Please try again later.");
    }
  }
}
