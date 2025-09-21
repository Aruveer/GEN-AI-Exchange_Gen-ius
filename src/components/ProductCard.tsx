import { useState } from "react";
import { Flame, Star, MapPin } from "lucide-react";
import { Product } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const [hypePoints, setHypePoints] = useState(product.hypePoints);
  const [hasGivenHype, setHasGivenHype] = useState(false);

  const handleGiveHype = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasGivenHype) return;

    setHypePoints(prev => prev + 1);
    setHasGivenHype(true);
    
    toast.success("🔥 Hype given!", {
      description: `You supported ${product.artisan.name}!`,
      duration: 2000,
    });
  };

  return (
    <Card className={`artisan-card masonry-item overflow-hidden group cursor-pointer ${className}`}>
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge for high hype items */}
        {hypePoints > 150 && (
          <div className="absolute top-3 left-3 bg-gradient-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium animate-glow-pulse">
            ✨ Featured
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Title */}
          <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Artisan Info */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">
                {product.artisan.name.charAt(0)}
              </span>
            </div>
            <span className="font-medium">{product.artisan.name}</span>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{product.artisan.location}</span>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-xl text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-medium text-muted-foreground">
                {product.artisan.rating}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hype Points and Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-saffron" />
              <span className="text-sm font-medium text-foreground">
                {hypePoints.toLocaleString()} hype
              </span>
            </div>
            
            <Button
              size="sm"
              variant={hasGivenHype ? "secondary" : "default"}
              className={hasGivenHype ? "opacity-60 cursor-not-allowed" : "hype-button"}
              onClick={handleGiveHype}
              disabled={hasGivenHype}
            >
              <Flame className="w-3 h-3 mr-1" />
              {hasGivenHype ? "Hyped!" : "Give Hype"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;