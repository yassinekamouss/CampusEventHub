import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const aiService = {
  askCampusAI: async (userQuery: string, eventsContext: string): Promise<string> => {
    if (!apiKey) {
      throw new Error("La clé API Gemini est manquante. Vérifiez EXPO_PUBLIC_GEMINI_API_KEY.");
    }
    
    // Le prompt demande d'utiliser le modèle gemini-3-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: "Tu es l'assistant intelligent de la FST Tanger. Ton rôle est d'aider les étudiants à naviguer dans la vie du campus. Sois concis, professionnel et utilise UNIQUEMENT les informations des événements fournis pour répondre. Si aucune information n'est pertinente, suggère poliment de contacter le BDE ou l'administration.",
    });

    const promptContext = `Contexte des événements actuels :\n${eventsContext}\n\nQuestion de l'étudiant : ${userQuery}`;

    const result = await model.generateContent(promptContext);
    const response = await result.response;
    return response.text();
  }
};
