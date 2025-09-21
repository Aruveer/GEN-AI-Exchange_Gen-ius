import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to get OAuth2 token using service account
async function getAccessToken() {
  const credentialsJson = Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
  if (!credentialsJson) {
    throw new Error('GOOGLE_CLOUD_CREDENTIALS not found');
  }

  const credentials = JSON.parse(credentialsJson);
  
  // Create JWT for service account authentication
  const jwtHeader = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(JSON.stringify(jwtHeader));
  const payloadBytes = encoder.encode(JSON.stringify(jwtPayload));
  
  const headerB64 = btoa(String.fromCharCode(...headerBytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(String.fromCharCode(...payloadBytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const unsignedToken = `${headerB64}.${payloadB64}`;
  
  // Import private key
  const privateKeyPem = credentials.private_key.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '');
  const privateKeyBuffer = Uint8Array.from(atob(privateKeyPem), c => c.charCodeAt(0));
  
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
  
  // Sign the token
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(unsignedToken)
  );
  
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const jwt = `${unsignedToken}.${signature}`;
  
  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style = "realistic" } = await req.json();
    
    console.log('Generating image with Vertex AI:', { prompt, style });

    // Get OAuth2 access token
    const accessToken = await getAccessToken();

    // Enhanced prompt with style
    const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed artwork`;

    // Call Vertex AI Imagen API with proper project ID
    const response = await fetch(
      'https://us-central1-aiplatform.googleapis.com/v1/projects/Vetexai/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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