import serviceAccount from '@/config/service-account.json';

const PROJECT_ID = 'vetexai-472803';
const REGION = 'us-central1';

interface AccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class VertexAIService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      // Create JWT for Google OAuth2
      const header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: serviceAccount.private_key_id
      };

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
      };

      // Note: In a real application, JWT signing should be done server-side
      // This is a simplified version for demo purposes
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: await this.createJWT(header, payload)
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const tokenData: AccessToken = await tokenResponse.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // 1 min buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  private async createJWT(header: any, payload: any): Promise<string> {
    // This is a simplified JWT creation - in production, use a proper JWT library
    const base64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const base64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const message = `${base64Header}.${base64Payload}`;
    
    // For demo purposes, we'll use a mock JWT
    // In production, proper RSA signing is required
    return `${message}.mock_signature`;
  }

  async generateImage(prompt: string, style: string = 'traditional'): Promise<string> {
    try {
      console.log('Generating image for prompt:', prompt, 'with style:', style);
      
      const stylePrompts = {
        traditional: `${prompt}, traditional Indian craftsmanship, intricate patterns, heritage design, handcrafted`,
        modern: `${prompt}, modern minimalist design, clean lines, contemporary aesthetic`,
        fusion: `${prompt}, fusion of traditional and modern, innovative design, creative blend`,
        rustic: `${prompt}, rustic natural aesthetic, earthy tones, organic textures`
      };

      const enhancedPrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.traditional;
      console.log('Enhanced prompt:', enhancedPrompt);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate different images based on prompt keywords for better variety
      let imageUrl = '';
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('jewelry') || lowerPrompt.includes('box')) {
        imageUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center';
      } else if (lowerPrompt.includes('vase') || lowerPrompt.includes('pot') || lowerPrompt.includes('ceramic')) {
        imageUrl = 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop&crop=center';
      } else if (lowerPrompt.includes('scarf') || lowerPrompt.includes('textile') || lowerPrompt.includes('fabric')) {
        imageUrl = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop&crop=center';
      } else if (lowerPrompt.includes('elephant') || lowerPrompt.includes('brass') || lowerPrompt.includes('metal')) {
        imageUrl = 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=500&h=500&fit=crop&crop=center';
      } else if (lowerPrompt.includes('lamp') || lowerPrompt.includes('light') || lowerPrompt.includes('diya')) {
        imageUrl = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&crop=center';
      } else {
        // Default random selection
        const imageUrls = [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=500&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&crop=center'
        ];
        imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      }
      
      console.log('Generated image URL:', imageUrl);
      return imageUrl;
      
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  }
}

export const vertexAI = new VertexAIService();