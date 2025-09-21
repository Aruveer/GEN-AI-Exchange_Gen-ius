import { Product } from "@/data/sampleData";
import ProductCard from "./ProductCard";

interface MasonryGridProps {
  products: Product[];
  className?: string;
}

const MasonryGrid = ({ products, className = "" }: MasonryGridProps) => {
  return (
    <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          className={`break-inside-avoid mb-6`}
        />
      ))}
    </div>
  );
};

export default MasonryGrid;