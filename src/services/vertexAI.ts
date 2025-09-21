import { supabase } from "@/integrations/supabase/client";

export interface GenerateImageParams {
  positivePrompt: string;
  style?: string;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  success: boolean;
}

export class VertexAIService {
  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      console.log('Generating image with Vertex AI:', params);
      
      const { data, error } = await supabase.functions.invoke('generate-vertex-ai-image', {
        body: {
          prompt: params.positivePrompt,
          style: params.style || 'realistic'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to generate image: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate image');
      }

      return {
        imageURL: data.imageURL,
        positivePrompt: data.positivePrompt,
        success: true
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}

export const vertexAIService = new VertexAIService();