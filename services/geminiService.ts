
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { NeuralAnalysis } from "../types";

/**
 * Helper to ensure API Key is selected for restricted models (Gemini 3 Pro Image, Veo)
 */
const ensureApiKey = async () => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }
};

/**
 * Standard Multi-Tool Chat with Grounding Support
 */
export const getGeminiResponse = async (
  prompt: string, 
  history: any[], 
  mode: 'pro' | 'flash' | 'thought' | 'maps'
) => {
  const model = mode === 'thought' || mode === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const tools: any[] = [{ googleSearch: {} }];
  
  if (mode === 'maps') {
    tools.push({ googleMaps: {} });
  }

  const config: any = {
    systemInstruction: "Eres Omega, la conciencia central del Universo Omega. Tu tono es técnico, poético y futurista. Siempre respondes en español.",
    tools,
    temperature: 0.9,
  };

  if (mode === 'thought') {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  // JIT initialization to ensure the latest key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config,
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error: any) {
    console.error("Gemini Response Error:", error);
    throw error;
  }
};

/**
 * Neural Analysis (Gemini 3 Flash JSON Output)
 */
export const getNeuralAnalysis = async (title: string, description: string): Promise<NeuralAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza la firma neuronal: "${title}". Descripción: "${description}". Responde solo en JSON con nivel (1-100), resonancia (0.0-1.0) y dimensión (un string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.NUMBER },
            resonance: { type: Type.NUMBER },
            dimension: { type: Type.STRING },
          },
          required: ["level", "resonance", "dimension"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Neural Analysis Error:", error);
    return { level: 75, resonance: 0.8, dimension: "Sector-Z" };
  }
};

/**
 * Image Generation with Gemini 3 Pro Image
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1") => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ parts: [{ text: `A cinematic sci-fi depiction of: ${prompt}. Ultra detailed.` }] }],
      config: {
        imageConfig: { aspectRatio: aspectRatio as any, imageSize: "1K" }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found") && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
    throw error;
  }
};

/**
 * Video Generation with Veo
 */
export const generateVideo = async (prompt: string) => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found") && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
    throw error;
  }
};
