import { GoogleGenAI } from "@google/genai";

export const summarizeUrl = async (url: string): Promise<{ title: string; description: string; topic: string }> => {
  try {
    // FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Based on the content found at the URL "${url}", provide:
1. A concise title.
2. A one-sentence description.
3. A single category for it from this list: AI/ML, Web Development, Design, Productivity, Career, Other.

Format your response exactly like this, with each item on a new line:
Title: [The title]
Description: [The description]
Topic: [The category]`;

    // FIX: Use generateContent with googleSearch tool for URL summarization, as models cannot directly access URLs.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    // FIX: Access generated text via the .text property on the response.
    const text = response.text.trim();
    let title = "Untitled";
    let description = "No description available.";
    let topic = "Other";
    
    const titleRegex = /Title:\s*(.*)/i;
    const descriptionRegex = /Description:\s*(.*)/i;
    const topicRegex = /Topic:\s*(.*)/i;

    const titleMatch = text.match(titleRegex);
    if (titleMatch) title = titleMatch[1].trim();

    const descriptionMatch = text.match(descriptionRegex);
    if (descriptionMatch) description = descriptionMatch[1].trim();

    const topicMatch = text.match(topicRegex);
    if (topicMatch) topic = topicMatch[1].trim();

    // Fallback parsing for simpler line-by-line format
    if (title === "Untitled" && description === "No description available.") {
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line.toLowerCase().startsWith("title:")) {
                title = line.substring(6).trim();
            } else if (line.toLowerCase().startsWith("description:")) {
                description = line.substring(12).trim();
            } else if (line.toLowerCase().startsWith("topic:")) {
                topic = line.substring(6).trim();
            }
        });
    }

    return { title, description, topic };

  } catch (error) {
    console.error("Error summarizing URL with Gemini:", error);
    return {
      title: "Error Summarizing",
      description: "Could not fetch summary. Please check the URL.",
      topic: "Other"
    };
  }
};
