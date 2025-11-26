import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TripPreferences } from "../types";

const getSystemInstruction = (prefs: TripPreferences) => `
You are an expert travel guide. Plan a detailed 2-day weekend itinerary (Saturday and Sunday) for ${prefs.destination}.
The user is looking for a "${prefs.vibe}" experience with a "${prefs.budget}" budget.

Structure your response clearly using Markdown:
1. Start with a catchy title and a 1-sentence summary.
2. Use "## Saturday" and "## Sunday" as main sections.
3. Break down each day by Morning, Afternoon, and Evening.
4. For each activity, suggest SPECIFIC real places (restaurants, parks, museums, landmarks).
5. Explain *why* these places fit the "${prefs.vibe}" vibe.
6. Keep it practical (consider travel time between spots).

Do NOT output JSON. Output readable Markdown text. 
Important: I will use Google Maps grounding to find the places you mention, so be precise with names.
`;

export const generateItinerary = async (prefs: TripPreferences): Promise<{ text: string; groundingMetadata?: any }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Plan a weekend trip to ${prefs.destination}.`,
      config: {
        systemInstruction: getSystemInstruction(prefs),
        temperature: 0.7,
        tools: [{ googleMaps: {} }], // Enable Maps Grounding
      },
    });

    return {
      text: response.text || "Sorry, I couldn't generate an itinerary at this time.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
