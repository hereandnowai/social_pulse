
import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import { SentimentAnalysisResult, Sentiment, ChatMessage, ProcessedResponse, GroundingChunk } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion, warning handles undefined

let chatInstance: Chat | null = null;

function parseJsonFromText(text: string): any {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON string. Error:", e);
    console.error("Original text received from API:", text); // Log the raw response
    console.error("String attempted for parsing (after potential fence stripping):", jsonStr); // Log the string that failed parsing
    throw new Error("Invalid JSON response from AI");
  }
}

export const analyzeTextSentiment = async (texts: string[]): Promise<SentimentAnalysisResult[]> => {
  if (!API_KEY) {
    console.warn("API Key not found. Returning mock sentiment data for multiple texts.");
    const mockLanguages = ['en', 'fr', 'de', 'es', 'hi', 'unknown'];
    return texts.map(text => {
      const mockSentiments = [Sentiment.Positive, Sentiment.Negative, Sentiment.Neutral];
      const mockEmotions = [["joy", "excitement"], ["anger", "frustration"], ["calm", "indifferent"]];
      const randomIndex = Math.floor(Math.random() * 3);
      const randomLangIndex = Math.floor(Math.random() * mockLanguages.length);
      return {
        sentiment: mockSentiments[randomIndex],
        score: Math.random() * 0.4 + 0.6, // Score between 0.6 and 1.0
        emotions: mockEmotions[randomIndex],
        keywords: ["mock", text.substring(0,10), "example"],
        detectedLanguage: mockLanguages[randomLangIndex],
      };
    });
  }

  const textsJsonArray = JSON.stringify(texts);

  const prompt = `Your entire response MUST be a single, valid JSON array, with no other text, comments, or explanations, neither before, after, nor interleaved within the JSON structure.
Analyze the sentiment and detect the language of each text in the following JSON array:
${textsJsonArray}

You MUST return ONLY this single, valid JSON array. Each element in the array must be an object corresponding to the analysis of the text at the same index in the input array.
Each JSON object in the array must strictly adhere to this exact structure, with no additional fields or conversational text:
{
  "detectedLanguage": "en" | "fr" | "de" | "es" | "hi" | "unknown",
  "sentiment": "Positive" | "Negative" | "Neutral",
  "score": float, 
  "emotions": ["emotion1", "emotion2", ...],
  "keywords": ["keyword1", "keyword2", ...]
}
Detailed field requirements:
- "detectedLanguage": Detect the language of the text. It MUST be one of "en" (English), "fr" (French), "de" (German), "es" (Spanish), "hi" (Hindi). If the language is not one of these or is unclear, return "unknown". The value must be only the language code string.
- "sentiment": Based on the detected language, determine if the sentiment is "Positive", "Negative", or "Neutral". The value must be only the sentiment string.
- "score": Must be a float between 0.0 and 1.0, representing confidence in the sentiment analysis. The value must be only the number.
- "emotions": Based on the detected language, provide a single, final array of strings, containing up to 3 dominant emotions (e.g., joy, anger, sadness, fear, surprise, love, excitement, frustration, calm, indifferent). If no specific emotions, return an empty array. The value for "emotions" MUST be only this array of strings.
- "keywords": Based on the detected language, provide a single, final array of strings, containing up to 5 relevant keywords from the text. Exclude common stop words. If no keywords, return an empty array. The value for "keywords" MUST be only this array of strings and nothing else. Do not output multiple "keywords" fields or any processing notes.

If a specific text cannot be analyzed or results in an error, you MUST return a JSON object for that text strictly adhering to: {"detectedLanguage": (the detected language, or "unknown" if detection failed), "sentiment": "Error", "score": 0, "emotions": [], "keywords": ["error detail if any"]}.
Ensure the entire response is exclusively this single JSON array of result objects. No extra text, comments, processing notes, or explanations are allowed.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ role: "user", parts: [{text: prompt}] }],
      config: {
        responseMimeType: "application/json"
      },
    });

    const parsedJsonArray = parseJsonFromText(response.text);
    
    if (!Array.isArray(parsedJsonArray)) {
        console.error("Parsed sentiment data is not an array:", parsedJsonArray);
        throw new Error("Invalid data structure received from AI: Expected an array.");
    }

    return parsedJsonArray.map((item: any, index: number) => {
      if (typeof item !== 'object' || item === null) {
        console.warn(`Item at index ${index} is not an object:`, item, ". Defaulting to Error sentiment.");
        return {
          detectedLanguage: 'unknown',
          sentiment: Sentiment.Error,
          score: 0,
          emotions: [],
          keywords: ["parsing error"],
        };
      }
      
      let apiSentiment = item.sentiment?.toString().toLowerCase();
      let sentimentEnum: Sentiment;

      if (apiSentiment === "positive") sentimentEnum = Sentiment.Positive;
      else if (apiSentiment === "negative") sentimentEnum = Sentiment.Negative;
      else if (apiSentiment === "neutral") sentimentEnum = Sentiment.Neutral;
      else if (apiSentiment === "error") sentimentEnum = Sentiment.Error;
      else {
          console.warn(`Unexpected sentiment value for item at index ${index}: "${item.sentiment}". Defaulting to Neutral.`);
          sentimentEnum = Sentiment.Neutral;
      }
      
      const detectedLanguage = ['en', 'fr', 'de', 'es', 'hi'].includes(item.detectedLanguage) ? item.detectedLanguage : 'unknown';
      const score = typeof item.score === 'number' ? Math.max(0, Math.min(1, item.score)) : 0;
      const emotions = Array.isArray(item.emotions) ? item.emotions.map(String) : [];
      const keywords = Array.isArray(item.keywords) ? item.keywords.map(String) : [];

      return {
        detectedLanguage: detectedLanguage,
        sentiment: sentimentEnum,
        score: score,
        emotions: emotions,
        keywords: keywords,
      };
    });

  } catch (error) {
    console.error("Error in analyzeTextSentiment (batch):", error);
    return texts.map(() => ({
      detectedLanguage: 'unknown',
      sentiment: Sentiment.Error,
      score: 0,
      emotions: [],
      keywords: error instanceof Error && error.message.startsWith("Invalid JSON response") ? ["API JSON error"] : ["processing error"],
    }));
  }
};


const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: GEMINI_TEXT_MODEL,
      config: {
        systemInstruction: "You are Caramel AI, a friendly and helpful AI assistant for the Social Pulse application. You work for HERE AND NOW AI. Your goal is to assist users in understanding social media sentiment analysis results and provide insightful marketing recommendations or answer general questions related to social media marketing. Be concise and professional. If asked about current events or specific data you don't have, use Google Search grounding if appropriate. Always cite your sources if you use Google Search.",
        tools: [{googleSearch: {}}], 
      },
    });
  }
  return chatInstance;
};

export const getChatbotResponse = async (history: ChatMessage[], newMessage: string): Promise<ProcessedResponse> => {
  if (!API_KEY) {
     console.warn("API Key not found. Returning mock chatbot response.");
     return { text: "I'm currently in a demo mode as the API key is not set. I can't process your request right now.", sources: [] };
  }

  const chat = getChatInstance();
  
  try {
    const result: GenerateContentResponse = await chat.sendMessage({
        message: newMessage,
    });

    const sources: GroundingChunk[] = result.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
        (chunk): chunk is GroundingChunk => chunk.web !== undefined && chunk.web.uri !== undefined && chunk.web.title !== undefined
      ) || [];

    return {
      text: result.text,
      sources: sources,
    };

  } catch (error) {
    console.error("Error calling Gemini API for chatbot response:", error);
    chatInstance = null; // Reset chat instance on error so it's re-created on next call
    throw error; // Re-throw to be caught by the UI
  }
};
