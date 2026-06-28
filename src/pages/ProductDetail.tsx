import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingBag, Heart, Shield, Truck, RotateCcw } from "lucide-react";
import { products } from "@/data/products";
import { productImages } from "@/lib/images";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEO, { absoluteUrl } from "@/components/SEO";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4 text-foreground">Product not found</h1>
          <Link to="/" className="font-body text-primary hover:underline">Return home</Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.id !== product.id).slice(0, 3);
  const productImage = productImages[product.slug || product.id] || "";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: productImage ? [absoluteUrl(productImage)] : undefined,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Sacred Aura" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.id}`),
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: product.reviews > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    } : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      { "@type": "ListItem", position: 3, name: product.category, item: absoluteUrl(`/shop?category=${encodeURIComponent(product.category)}`) },
      { "@type": "ListItem", position: 4, name: product.name, item: absoluteUrl(`/product/${product.id}`) },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} — ${product.subtitle}`}
        description={product.description.slice(0, 155)}
        canonical={`/product/${product.id}`}
        type="product"
        image={productImage}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> Back to Collection
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-purple-bright/10 blur-2xl pointer-events-none" />
              <div className="relative rounded-3xl overflow-hidden bg-secondary aspect-square border-glow">
                <img src={productImages[product.slug || product.id] || ""} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{product.category}</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-2">{product.name}</h1>
              <p className="font-body text-lg text-muted-foreground mb-6">{product.subtitle}</p>

              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-3xl font-medium text-gradient-primary">₹{product.price}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-purple-bright text-purple-bright" : "text-border"} />
                  ))}
                  <span className="font-body text-sm text-muted-foreground ml-1">({product.reviews} reviews)</span>
                </div>
              </div>

              <p className="font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="mb-8">
                <h3 className="font-display text-lg font-medium text-foreground mb-3">Benefits</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.benefits.map(b => (
                    <div key={b} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-8 border-glow">
                <h3 className="font-display text-lg font-medium text-foreground mb-2">✧ Spiritual Meaning</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.spiritualMeaning}</p>
              </div>

              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => addItem(product)}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
                <button className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              <div className="flex gap-6">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: Shield, label: "Authentic" },
                  { icon: RotateCcw, label: "30-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-muted-foreground">
                    <Icon size={16} />
                    <span className="font-body text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <section className="mt-24">
            <h2 className="font-display text-3xl font-light text-foreground text-center mb-12">
              You May Also <span className="text-gradient-primary">Love</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
