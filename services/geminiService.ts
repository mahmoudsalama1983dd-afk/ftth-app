import { GoogleGenAI, Type } from "@google/genai";
import { VideoScript } from "../types";

// Helper to get client with current key
const getAiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateWeeklyPlan = async (sourceText: string): Promise<VideoScript[]> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a professional YouTube Content Strategist for the Egyptian market.
    Analyze the following text about "AI in FTTH Networks in Egypt".
    Create a 7-day content plan (one video per day) optimized for YouTube Shorts.
    
    The content should be engaging, technical but accessible, and highly visual.
    Output must be in Arabic (Egyptian dialect preferred for hooks).
    
    Source Text:
    ${sourceText}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "Day of the week (e.g., Saturday)" },
            title: { type: Type.STRING, description: "Catchy video title" },
            hook: { type: Type.STRING, description: "First 3 seconds hook to grab attention" },
            scriptBody: { type: Type.STRING, description: "Main script content (approx 45 seconds)" },
            visualDescription: { type: Type.STRING, description: "Detailed description of the background visuals needed (in English for generation tools)" },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            estimatedDuration: { type: Type.STRING }
          },
          required: ["day", "title", "hook", "scriptBody", "visualDescription", "hashtags", "estimatedDuration"]
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as VideoScript[];
  }
  throw new Error("Failed to generate plan");
};

export const generateVeoVideo = async (prompt: string): Promise<string> => {
  const ai = getAiClient(); // Always re-init to get fresh key if changed
  
  // Using Veo fast model for quicker previews in this dashboard context
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic, futuristic, high quality, 9:16 vertical video. ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    }
  });

  // Polling mechanism
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!videoUri) {
    throw new Error("Video generation failed or no URI returned.");
  }

  // Append key for playback
  return `${videoUri}&key=${process.env.API_KEY}`;
};