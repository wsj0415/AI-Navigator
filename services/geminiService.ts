import { GoogleGenAI, Type } from "@google/genai";
import { LinkItem } from "../types";

export const summarizeUrl = async (url: string): Promise<{ title: string; description: string; topic: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Based on the content found at the URL "${url}", provide:
1. A concise title.
2. A one-sentence description.
3. A single category for it from this list: AI/ML, Web Development, Design, Productivity, Career, Other.

Format your response exactly like this, with each item on a new line:
Title: [The title]
Description: [The description]
Topic: [The category]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

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


export const findRelatedLinks = async (sourceLink: LinkItem, candidateLinks: LinkItem[]): Promise<string[]> => {
    if (candidateLinks.length === 0) return [];
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const sourceContent = `Title: ${sourceLink.title}\nDescription: ${sourceLink.description}\nNotes: ${sourceLink.notes || ''}`.trim();
        
        const candidates = candidateLinks.map(link => ({ id: link.id, title: link.title }));

        const prompt = `
            Analyze the Source Resource and determine which of the Candidate Resources are strongly related to it.
            
            Source Resource:
            ---
            ${sourceContent}
            ---

            Candidate Resources:
            ---
            ${JSON.stringify(candidates, null, 2)}
            ---

            Return a JSON object with a single key "relatedIds" which is an array of strings. Each string should be the ID of a strongly related candidate resource. Only include candidates that have a direct and significant connection. If no candidates are related, return an empty array.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relatedIds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.relatedIds)) {
            return result.relatedIds;
        }

        return [];

    } catch (error) {
        console.error("Error finding related links with Gemini:", error);
        return [];
    }
};
