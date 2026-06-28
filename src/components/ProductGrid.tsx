import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";
import { RevealOnScroll } from "./ParallaxSection";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating", label: "Top Rated" },
];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [visible, setVisible] = useState(9);

  const filtered = useMemo(() => {
    let list = activeCategory === "All"
      ? products
      : products.filter(p => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "rating": sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return sorted;
  }, [activeCategory, search, sortBy]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: products.length };
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);

  return (
    <section id="collection" className="py-24 md:py-32 relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 gradient-purple-radial pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-purple-bright/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <RevealOnScroll>
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-glow mb-6">
              <Sparkles size={14} className="text-primary" />
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground">
                Curated with Intention
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
              The <span className="text-gradient-primary italic">Collection</span>
            </h2>
            <p className="font-body text-muted-foreground text-base md:text-lg leading-relaxed">
              Hand-picked spiritual treasures, ethically sourced and energetically attuned to elevate your sacred practice.
            </p>
          </div>
        </RevealOnScroll>

        {/* Toolbar: search + sort */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-3 mb-8 max-w-3xl mx-auto"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(9); }}
              placeholder="Search crystals, malas, pendants..."
              className="w-full pl-11 pr-4 py-3 rounded-full glass border border-border/50 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="relative flex items-center gap-2 px-4 py-3 rounded-full glass border border-border/50">
            <SlidersHorizontal size={14} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-body text-sm text-foreground focus:outline-none cursor-pointer pr-2"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Category chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2.5 mb-12"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisible(9); }}
                className={`group relative px-5 py-2.5 rounded-full font-body text-sm tracking-wider transition-all duration-300 ${
                  isActive
                    ? "gradient-purple text-primary-foreground glow-purple shadow-lg"
                    : "glass border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {cat}
                  {counts[cat] !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-secondary"
                    }`}>
                      {counts[cat]}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Results meta */}
        <div className="flex items-center justify-between mb-8 px-1">
          <p className="font-body text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{shown.length}</span> of{" "}
            <span className="text-foreground font-medium">{filtered.length}</span> products
          </p>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            View full shop
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {shown.length > 0 ? (
            <motion.div
              key={activeCategory + search + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {shown.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex w-20 h-20 rounded-full glass border-glow items-center justify-center mb-6">
                <Search size={28} className="text-muted-foreground" />
              </div>
              <p className="font-display text-2xl text-foreground mb-2">Nothing found</p>
              <p className="font-body text-muted-foreground mb-6">Try a different search or category</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="px-6 py-2.5 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-wider hover:opacity-90 transition-opacity"
              >
                Reset filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={() => setVisible(v => v + 9)}
              className="group relative px-10 py-4 rounded-full glass border border-primary/30 text-foreground font-body text-sm tracking-[0.2em] uppercase overflow-hidden hover:border-primary/60 transition-all"
            >
              <span className="absolute inset-0 gradient-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                Reveal More
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
