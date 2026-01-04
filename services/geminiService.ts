
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchGeminiInsights(productName: string) {
  try {
    const response = await ai.models.generateContent({
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
