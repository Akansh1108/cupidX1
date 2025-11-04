
import { GoogleGenAI, Type } from "@google/genai";
import { ScreeningData, IntakeAnswer, FullBlueprint, VibeCheckQuestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateIntakeQuestions = async (screeningData: ScreeningData): Promise<string[]> => {
  const prompt = `You are CupidX, an emotionally-intelligent AI compatibility coach. Based on this user profile: ${JSON.stringify(screeningData)}, generate 10 insightful, open-ended questions to help them explore their emotional patterns, attachment style, and relationship needs. Frame the questions in a warm, curious, and non-judgmental tone. The questions should cover topics like conflict resolution, emotional expression, core values, and past relationship lessons. Return the questions as a JSON array of strings.`;

  const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
          }
      }
  });
  
  const text = response.text.trim();
  return JSON.parse(text);
};


export const generateBlueprintAndProfile = async (screeningData: ScreeningData, answers: IntakeAnswer[]): Promise<FullBlueprint> => {
  const prompt = `You are CupidX, an emotionally-intelligent AI compatibility coach. A user has provided the following information about themselves:
  - Profile: ${JSON.stringify(screeningData)}
  - Their answers to introspective questions: ${JSON.stringify(answers)}
  
  Analyze their responses through the lens of behavioral psychology and attachment theory. Generate a comprehensive 'Emotional Blueprint' for them. The tone should be warm, insightful, and empowering. Structure the output as a single JSON object with the exact keys and structure as defined in the response schema.`;

  const response = await model.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotionalBlueprint: {
                type: Type.STRING,
                description: "A 3-4 paragraph summary of their emotional patterns, attachment style, and core needs.",
              },
              partnerFitProfile: {
                type: Type.OBJECT,
                properties: {
                  archetypes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of compatible partner archetypes (e.g., 'The Creative Soul', 'The Stable Anchor')." },
                  greenFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive signs to look for in a partner." },
                  frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of potential areas of conflict or disagreement." },
                  communicationTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable tips for healthy communication with a compatible partner." },
                },
                required: ['archetypes', 'greenFlags', 'frictionPoints', 'communicationTips'],
              },
              actionKit: {
                type: Type.OBJECT,
                properties: {
                  bioRewrite: { type: Type.STRING, description: "A suggested rewrite of their dating app bio to attract compatible partners." },
                  conversationOpeners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 personalized conversation starters." },
                  microHabits: { type: Type.STRING, description: "A 7-day plan of small, actionable habits for self-growth in relationships." },
                },
                 required: ['bioRewrite', 'conversationOpeners', 'microHabits'],
              },
            },
            required: ['emotionalBlueprint', 'partnerFitProfile', 'actionKit'],
          }
      }
  });

  const text = response.text.trim();
  return JSON.parse(text);
};

export const generateVibeCheckQuestions = async (blueprintSummary: string): Promise<VibeCheckQuestion[]> => {
    const prompt = `You are CupidX. Based on the user's Emotional Blueprint summary: "${blueprintSummary}", generate 5 personalized 'Vibe Check' questions they can ask a potential partner to gauge compatibility. For each question, provide an example of an 'aligned answer' (a green flag) and a 'friction signal' (a red flag). The questions should be subtle and conversational. Return the result as a JSON array of objects, each with 'question', 'alignedAnswer', and 'frictionSignal' keys.`;

    const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "The conversational question to ask." },
                        alignedAnswer: { type: Type.STRING, description: "An example of a positive, compatible answer (a 'green flag')." },
                        frictionSignal: { type: Type.STRING, description: "An example of a problematic or incompatible answer (a 'red flag')." }
                    },
                    required: ['question', 'alignedAnswer', 'frictionSignal']
                }
            }
        }
    });

    const text = response.text.trim();
    return JSON.parse(text);
};


export const analyzeContext = async (text: string, imageFile?: File): Promise<string> => {
    const prompt = `You are CupidX, an emotionally-intelligent AI compatibility coach. Analyze the following context from a user's dating life. It could be a chat screenshot or a recap of a date. Here is the user's recap/message: '${text}'. Based on this, provide a warm, non-judgmental analysis. Identify potential communication patterns, emotional cues, and underlying dynamics. Offer one clear, actionable suggestion for how the user could respond or proceed. Keep the analysis concise and empathetic.`;

    const contents: any = { parts: [{ text: prompt }] };

    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        contents.parts.unshift(imagePart);
    }
    
    const response = await model.generateContent({
        model: 'gemini-2.5-pro',
        contents,
    });
    
    return response.text;
};
