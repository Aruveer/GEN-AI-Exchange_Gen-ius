import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Palette, Zap, Send } from "lucide-react";
import { toast } from "sonner";
import { vertexAI } from "@/services/vertexAI";
import Chatbot from "@/components/Chatbot";

const Create = () => {
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { id: "traditional", name: "Traditional", icon: "🏺", description: "Classic Indian craftsmanship" },
    { id: "modern", name: "Modern", icon: "✨", description: "Contemporary minimalist design" },
    { id: "fusion", name: "Fusion", icon: "🌟", description: "Blend of traditional and modern" },
    { id: "rustic", name: "Rustic", icon: "🌿", description: "Natural, earthy aesthetic" },
  ];

  const handleGenerateMockup = async () => {
    if (!description.trim()) {
      toast.error("Please describe your dream product first!");
      return;
    }

    if (!selectedStyle) {
      toast.error("Please select an artistic style!");
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedImageUrl = await vertexAI.generateImage(description, selectedStyle);
      setGeneratedImage(generatedImageUrl);
      
      toast.success("✨ Mockup generated successfully!", {
        description: "Your AI-powered design is ready!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate mockup. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendRequest = () => {
    toast.success("🎯 Request sent to artisan!", {
      description: "You'll receive a response within 24 hours.",
      duration: 4000,
    });
    
    // Reset form
    setDescription("");
    setSelectedStyle("");
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co-Create with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your vision and watch AI bring it to life. Our artisans will craft your dream into reality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Input */}
          <Card className="artisan-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                <span>Describe Your Dream Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Product Description
                </label>
                <Textarea
                  placeholder="e.g., Hand-painted wooden jewelry box with a peacock design, featuring intricate gold details and velvet interior..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              {/* Style Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Artistic Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        selectedStyle === style.id
                          ? "border-saffron bg-saffron/10 shadow-gold"
                          : "border-border bg-card hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="font-medium text-foreground">{style.name}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateMockup}
                disabled={isGenerating}
                className="w-full btn-primary py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Generating Mockup...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Mockup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Panel - Preview */}
          <Card className="artisan-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-saffron" />
                <span>Live AI Mockup Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Creating your mockup...</p>
                      <p className="text-sm text-muted-foreground">AI is painting your vision</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full h-full relative animate-fade-in-up">
                    <img
                      src={generatedImage}
                      alt="Generated mockup"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                ) : (
                  <div className="text-center space-y-3 px-8">
                    <div className="w-20 h-20 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Your AI-generated mockup will appear here
                    </p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-6 space-y-4 animate-fade-in-up">
                  <div className="p-4 bg-gradient-accent/10 rounded-lg border border-gold/20">
                    <p className="text-sm font-medium text-foreground mb-2">AI Analysis:</p>
                    <p className="text-sm text-muted-foreground">
                      Beautiful {selectedStyle} design featuring {description.toLowerCase().includes('peacock') ? 'peacock motifs' : 'intricate patterns'} 
                      with traditional craftsmanship elements. Perfect for skilled artisan creation.
                    </p>
                  </div>

                  <Button
                    onClick={handleSendRequest}
                    className="w-full btn-primary py-3"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Request to Artisan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Create;