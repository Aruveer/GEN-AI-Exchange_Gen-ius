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
    const { prompt, style = "realistic" } = await req.json();
    
    const vertexApiKey = Deno.env.get('VERTEX_AI_API_KEY');
    if (!vertexApiKey) {
      throw new Error('Vertex AI API key not found');
    }

    console.log('Generating image with Vertex AI:', { prompt, style });

    // Enhanced prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed artwork`;

    // Call Vertex AI Imagen API
    const response = await fetch(
      'https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vertexApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: enhancedPrompt,
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_some",
            personGeneration: "allow_adult"
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vertex AI API error:', response.status, errorText);
      throw new Error(`Vertex AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Vertex AI response:', data);

    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      const imageBase64 = data.predictions[0].bytesBase64Encoded;
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      
      return new Response(
        JSON.stringify({
          imageURL: imageUrl,
          positivePrompt: enhancedPrompt,
          success: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Invalid response format from Vertex AI');
    }

  } catch (error) {
    console.error('Error in generate-vertex-ai-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});