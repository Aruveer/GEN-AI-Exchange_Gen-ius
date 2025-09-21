import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found');
    }

    console.log('Processing message with Gemini:', { message, historyLength: conversationHistory.length });

    // Build context from conversation history
    const context = conversationHistory.length > 0 
      ? conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') + '\n'
      : '';

    const systemPrompt = `You are a helpful assistant for an AI-powered artisan marketplace. You help users find handcrafted products, understand the co-creation process with AI, and navigate the platform. Keep responses concise and helpful. Focus on topics related to:
- Handcrafted products and artisan work
- AI-powered product design and customization
- The marketplace features and how to use them
- General shopping and product questions

Current conversation:\n${context}user: ${message}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      return new Response(
        JSON.stringify({
          response: generatedText,
          success: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('Error in generate-gemini-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});