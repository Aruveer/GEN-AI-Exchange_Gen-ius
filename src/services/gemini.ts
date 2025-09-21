const GEMINI_API_KEY = 'AIzaSyDDKSzeZL_0vlcTCQ2Q4Lmx4xjfF1vtCoA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class GeminiService {
  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const context = conversationHistory.length > 0 
        ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n'
        : '';

      const systemPrompt = `You are a helpful assistant for an AI-powered artisan marketplace. You help users find handcrafted products, understand the co-creation process with AI, and navigate the platform. Keep responses concise and helpful. Focus on topics related to:
- Handcrafted products and artisan work
- AI-powered product design and customization
- The marketplace features and how to use them
- General shopping and product questions

Current conversation:\n${context}user: ${message}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();