import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "./ParallaxSection";

const BestSellers = () => {
  const bestSellers = products.filter(p => p.badge === "Bestseller" || p.badge === "Popular").slice(0, 4);

  return (
    <section className="py-24 md:py-32 gradient-section relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-bright/5 blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Most Loved
              </p>
              <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
                Best <span className="text-gradient-primary">Sellers</span>
              </h2>
            </div>
            <p className="font-body text-muted-foreground mt-4 md:mt-0 max-w-sm">
              Our community's most cherished crystals and spiritual tools, chosen with love.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product, index) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} index={0} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default BestSellers;
