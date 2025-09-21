import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeminiResponse {
  response: string;
  success: boolean;
}

export class GeminiService {
  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      console.log('Sending message to Gemini via Edge Function:', { message, historyLength: conversationHistory.length });
      
      const { data, error } = await supabase.functions.invoke('generate-gemini-response', {
        body: {
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get response: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to get response');
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();