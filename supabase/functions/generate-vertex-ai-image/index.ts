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
    
    console.log('Generating image with Vertex AI:', { prompt, style });

    // Get credentials
    const credentialsJson = Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
    if (!credentialsJson) {
      throw new Error('GOOGLE_CLOUD_CREDENTIALS not found');
    }

    const credentials = JSON.parse(credentialsJson);
    console.log('Using project:', credentials.project_id);

    // Enhanced prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed artwork`;

    // Get access token using Google Auth Library approach
    const jwtPayload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    };

    // Create JWT header
    const jwtHeader = { alg: 'RS256', typ: 'JWT' };
    
    // Encode JWT
    const encoder = new TextEncoder();
    const headerB64 = btoa(JSON.stringify(jwtHeader)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const payloadB64 = btoa(JSON.stringify(jwtPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const unsignedToken = `${headerB64}.${payloadB64}`;
    
    // Import and sign with private key
    const privateKeyPem = credentials.private_key
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyPem), c => c.charCodeAt(0));
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      encoder.encode(unsignedToken)
    );
    
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const jwt = `${unsignedToken}.${signatureB64}`;

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Token error:', tokenData);
      throw new Error('Failed to get access token');
    }

    console.log('Got access token, calling Vertex AI...');

    // Call Vertex AI using the project_id from credentials
    const response = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${credentials.project_id}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: enhancedPrompt }],
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