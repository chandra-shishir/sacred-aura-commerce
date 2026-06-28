import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { productImages } from "@/lib/images";

interface ProductCardProps {
  product: Product;
  index: number;
}

// Category-based color theming
const getCategoryTheme = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("crystal")) return {
    gradient: "from-purple-600/20 via-violet-500/10 to-transparent",
    glow: "hsl(270 80% 65% / 0.2)",
    accent: "hsl(270 80% 65%)",
    badge: "from-purple-600 to-violet-500",
    border: "hsl(270 60% 40% / 0.3)",
  };
  if (cat.includes("bracelet") || cat.includes("jewelry")) return {
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    glow: "hsl(340 80% 55% / 0.2)",
    accent: "hsl(340 80% 60%)",
    badge: "from-rose-500 to-pink-500",
    border: "hsl(340 60% 40% / 0.3)",
  };
  if (cat.includes("mala") || cat.includes("rudraksha")) return {
    gradient: "from-amber-600/20 via-orange-500/10 to-transparent",
    glow: "hsl(30 80% 50% / 0.2)",
    accent: "hsl(30 80% 55%)",
    badge: "from-amber-600 to-orange-500",
    border: "hsl(30 60% 35% / 0.3)",
  };
  if (cat.includes("pendant")) return {
    gradient: "from-cyan-500/20 via-teal-400/10 to-transparent",
    glow: "hsl(180 70% 45% / 0.2)",
    accent: "hsl(180 70% 50%)",
    badge: "from-cyan-500 to-teal-400",
    border: "hsl(180 50% 35% / 0.3)",
  };
  if (cat.includes("healing") || cat.includes("chakra")) return {
    gradient: "from-emerald-500/20 via-green-400/10 to-transparent",
    glow: "hsl(150 70% 40% / 0.2)",
    accent: "hsl(150 70% 45%)",
    badge: "from-emerald-500 to-green-400",
    border: "hsl(150 50% 30% / 0.3)",
  };
  if (cat.includes("feng") || cat.includes("evil")) return {
    gradient: "from-blue-500/20 via-indigo-400/10 to-transparent",
    glow: "hsl(230 70% 55% / 0.2)",
    accent: "hsl(230 70% 55%)",
    badge: "from-blue-500 to-indigo-500",
    border: "hsl(230 50% 35% / 0.3)",
  };
  if (cat.includes("candle")) return {
    gradient: "from-yellow-500/20 via-amber-400/10 to-transparent",
    glow: "hsl(45 90% 55% / 0.2)",
    accent: "hsl(45 80% 55%)",
    badge: "from-yellow-500 to-amber-400",
    border: "hsl(45 60% 35% / 0.3)",
  };
  if (cat.includes("aroma") || cat.includes("oil")) return {
    gradient: "from-lime-500/20 via-emerald-400/10 to-transparent",
    glow: "hsl(100 60% 40% / 0.2)",
    accent: "hsl(100 60% 45%)",
    badge: "from-lime-500 to-emerald-400",
    border: "hsl(100 40% 30% / 0.3)",
  };
  // Default purple
  return {
    gradient: "from-purple-600/20 via-violet-500/10 to-transparent",
    glow: "hsl(270 80% 65% / 0.2)",
    accent: "hsl(270 80% 65%)",
    badge: "from-purple-600 to-violet-500",
    border: "hsl(270 60% 40% / 0.3)",
  };
};

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addItem } = useCart();
  const theme = getCategoryTheme(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <Link to={`${product.category?.toLowerCase().includes("vastu") ? "/vastu" : "/product"}/${product.slug || product.id}`} className="block">
        <div
          className="relative overflow-hidden rounded-2xl bg-secondary mb-4 aspect-square"
          style={{ borderColor: theme.border, borderWidth: "1px" }}
        >
          <img
            src={productImages[product.slug || product.id] || productImages["amethyst-cluster"]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Category-colored gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ boxShadow: `inset 0 0 60px ${theme.glow}` }}
          />

          {product.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body tracking-wider uppercase bg-gradient-to-r ${theme.badge} text-primary-foreground shadow-lg`}>
              {product.badge}
            </span>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <motion.button
              onClick={(e) => { e.preventDefault(); addItem(product); }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:text-primary-foreground transition-colors"
              style={{ backgroundColor: `${theme.accent}33` }}
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
            </motion.button>
            <motion.button
              onClick={(e) => e.preventDefault()}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:text-primary-foreground transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} />
            </motion.button>
          </div>
        </div>
      </Link>

      <div className="px-1">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-xl font-medium text-foreground mb-1">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-2">{product.subtitle}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-body text-lg font-medium" style={{ color: theme.accent }}>
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gold text-sm">★</span>
            <span className="font-body text-sm text-muted-foreground">{product.rating} ({product.reviews})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
