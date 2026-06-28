import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useProducts, useCategories, useCrystalTypes } from "@/hooks/useProducts";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [crystalType, setCrystalType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useCategories();
  const { data: crystalTypes } = useCrystalTypes();
  const { data: products, isLoading } = useProducts({
    category: activeCategory,
    sortBy,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
    crystalType,
  });

  const allCategories = useMemo(() => {
    const cats = (categories || []).filter((c: any) => !c.parent_id).map((c: any) => c.name);
    return ["All", ...cats];
  }, [categories]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  // Show crystal filter if "All" selected, or category is crystal-adjacent
  const showCrystalFilter =
    activeCategory === "All" ||
    /crystal|healing|stone|mala|bracelet|pendant/i.test(activeCategory);

  const mappedProducts = products?.map((p) => ({
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    subtitle: p.subtitle || "",
    price: p.price,
    mrp: p.mrp,
    discountPercent: p.discount_percent,
    currency: p.currency,
    category: p.category,
    image: p.image_url || "",
    rating: p.rating || 0,
    reviews: p.reviews_count || 0,
    badge: p.badge || undefined,
    description: p.description || "",
    benefits: p.benefits || [],
    spiritualMeaning: p.spiritual_meaning || "",
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: activeCategory === "All" ? "All Products" : activeCategory,
    itemListElement: (mappedProducts || []).slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${typeof window !== "undefined" ? window.location.origin : "https://sacredaura.com"}/product/${p.slug}`,
      name: p.name,
    })),
  };

  const filterPanel = (
    <Accordion
      type="multiple"
      defaultValue={["category", "price", "crystal", "sort"]}
      className="w-full"
    >
      <AccordionItem value="category" className="border-border/40">
        <AccordionTrigger className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:no-underline">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`block w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                  activeCategory === cat
                    ? "gradient-purple text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price" className="border-border/40">
        <AccordionTrigger className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:no-underline">
          Price Range
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24 px-2 py-1.5 rounded-lg bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
              min={0}
            />
            <span className="text-muted-foreground">—</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24 px-2 py-1.5 rounded-lg bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
              min={0}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {showCrystalFilter && (
        <AccordionItem value="crystal" className="border-border/40">
          <AccordionTrigger className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:no-underline">
            Crystal Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setCrystalType(null)}
                className={`block w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                  crystalType === null
                    ? "gradient-purple text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Any
              </button>
              {(crystalTypes || []).map((ct) => (
                <button
                  key={ct}
                  onClick={() => setCrystalType(ct)}
                  className={`block w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                    crystalType === ct
                      ? "gradient-purple text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {ct}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="sort" className="border-border/40 border-b-0">
        <AccordionTrigger className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:no-underline">
          Sort By
        </AccordionTrigger>
        <AccordionContent>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={activeCategory === "All" ? "Shop All Crystals & Spiritual Tools" : `${activeCategory} — Shop`}
        description={`Browse our curated collection of ${activeCategory === "All" ? "premium crystals, malas, bracelets and spiritual tools" : activeCategory.toLowerCase()}.`}
        canonical={activeCategory === "All" ? "/shop" : `/shop?category=${encodeURIComponent(activeCategory)}`}
        jsonLd={itemListJsonLd}
      />
      <Navbar />
      <CartDrawer />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Sacred Collection
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-foreground">
              {activeCategory === "All" ? (
                <>
                  Shop <span className="text-gradient-primary">All</span>
                </>
              ) : (
                <span className="text-gradient-primary">{activeCategory}</span>
              )}
            </h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="glass rounded-2xl p-5 border-glow sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-foreground">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-muted-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>
                {filterPanel}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-muted-foreground font-body text-sm"
                >
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <span className="font-body text-sm text-muted-foreground">
                  {mappedProducts?.length || 0} products
                </span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-secondary animate-pulse" />
                  ))}
                </div>
              ) : mappedProducts && mappedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mappedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product as any} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-display text-2xl text-foreground mb-2">No products found</p>
                  <p className="font-body text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
