import { useState, useEffect } from "react";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import { sampleProducts, sampleArtisans } from "@/data/sampleData";
import MasonryGrid from "@/components/MasonryGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chatbot from "@/components/Chatbot";
import { toast } from "sonner";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState(sampleProducts.filter(p => p.hypePoints > 120));
  const [allProducts] = useState(sampleProducts);

  const handleGiveHype = (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    setFeaturedProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, hypePoints: product.hypePoints + 1 }
          : product
      )
    );

    toast.success("🔥 Hype given!", {
      description: `You supported ${product.artisan.name}!`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground">
              Where <span className="text-transparent bg-gradient-primary bg-clip-text">AI</span> Meets{" "}
              <span className="text-transparent bg-gradient-accent bg-clip-text">Artisan</span> Craft
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover unique handcrafted treasures or co-create your dream product with AI-powered design and master artisans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="btn-primary px-8 py-4 text-lg" asChild>
                <a href="/create">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-muted/50">
                <TrendingUp className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              ✨ Featured of the Week
            </h2>
            <Button variant="ghost" className="text-saffron hover:text-saffron/80">
              View All <span className="ml-2">→</span>
            </Button>
          </div>
          
          {/* Horizontal Scroll Grid */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {featuredProducts.map((product) => (
                <Card key={product.id} className="artisan-card w-80 flex-shrink-0">
                  <div className="relative">
                     <img
                       src={product.image}
                       alt={product.name}
                       className="w-full h-48 object-cover rounded-t-2xl"
                     />
                    <div className="absolute top-3 left-3 bg-gradient-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium animate-glow-pulse">
                      🔥 {product.hypePoints} hype
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif font-semibold text-lg text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {product.artisan.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {product.artisan.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span className="text-sm font-medium">
                          {product.artisan.rating}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-serif font-semibold text-xl text-foreground">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <Button 
                        size="sm" 
                        className="hype-button"
                        onClick={() => handleGiveHype(product.id)}
                      >
                        Give Hype
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Spotlight */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Master Artisans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleArtisans.map((artisan) => (
              <Card key={artisan.id} className="artisan-card text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-foreground">
                      {artisan.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">
                    {artisan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {artisan.location}
                  </p>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="text-sm font-medium">{artisan.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({artisan.totalOrders} orders)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {artisan.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Products - Masonry Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Discover Unique Creations
            </h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-saffron" />
              <span>AI Recommended</span>
            </div>
          </div>
          
          <MasonryGrid products={allProducts} />
        </div>
      </section>
      <Chatbot />
    </div>
  );
};

export default Index;
