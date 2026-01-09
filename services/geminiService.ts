
import { GoogleGenAI, Type } from "@google/genai";

// Lazy initialization to avoid errors when API key is missing
let ai: GoogleGenAI | null = null;

function getAIClient() {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function fetchGeminiInsights(productName: string) {
  try {
    const client = getAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 futuristic marketing insights or technical advantages for a product named ${productName}. 
      The product is an Advanced Active Power Factor Correction (APFC) system.
      Focus on energy efficiency, grid stability, and industrial ROI.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              content: { type: Type.STRING },
              impactScore: { type: Type.NUMBER }
            },
            required: ["topic", "content", "impactScore"]
          }
        }
      }
    });

    // Directly access the .text property from GenerateContentResponse
    const textOutput = response.text;
    return JSON.parse(textOutput?.trim() || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      {
        topic: "Grid Resilience",
        content: "Enhances local grid stability by eliminating harmonic reflections and optimizing phase alignment.",
        impactScore: 95
      }
    ];
  }
}
