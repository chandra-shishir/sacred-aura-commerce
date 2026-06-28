import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Star,
  Sparkles,
  Compass,
  Flame,
  Leaf,
} from "lucide-react";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductReviews from "@/components/ProductReviews";
import SEO, { absoluteUrl } from "@/components/SEO";

const VastuProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProductBySlug(slug || "");
  const { data: related } = useProducts({ category: "Vastu Items", limit: 4 });
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-display text-2xl text-muted-foreground">Loading sacred item…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4 text-foreground">Item not found</h1>
          <Link to="/shop" className="font-body text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const image =
    product.image_url ||
    (product.images && product.images[0]) ||
    "/placeholder.svg";

  const usageGuide = [
    {
      icon: Compass,
      title: "Placement",
      text: "Place in the recommended Vastu zone of your home or workspace as per the energy direction it governs.",
    },
    {
      icon: Sparkles,
      title: "Cleansing",
      text: "Cleanse with sage smoke, sunlight, or Ganga jal before first use, then weekly to refresh its vibration.",
    },
    {
      icon: Flame,
      title: "Activation",
      text: "Light a diya or incense beside it on Tuesday or Friday morning while setting a clear intention.",
    },
    {
      icon: Leaf,
      title: "Maintenance",
      text: "Keep the item dust-free. Re-energize during full moon nights or eclipses for amplified effect.",
    },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: image ? [absoluteUrl(image)] : undefined,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: "Sacred Aura" },
    category: "Vastu Items",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/vastu/${product.slug}`),
      priceCurrency: "INR",
      price: product.price,
      availability:
        (product.stock ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      (product.reviews_count ?? 0) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating ?? 0,
            reviewCount: product.reviews_count,
          }
        : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} — Authentic Vastu Remedy | Sacred Aura`}
        description={(product.seo_description || product.description || "").slice(0, 155)}
        canonical={`/vastu/${product.slug}`}
        type="product"
        image={image}
        jsonLd={[productJsonLd]}
      />
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 font-body text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>›</span>
            <Link to="/shop?category=Vastu%20Items" className="hover:text-foreground">Vastu Items</Link>
            <span>›</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-purple-bright/10 blur-2xl pointer-events-none" />
              <div className="relative rounded-3xl overflow-hidden bg-secondary aspect-square border-glow">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-[10px] font-body tracking-widest uppercase bg-gradient-to-r from-purple-600 to-violet-500 text-primary-foreground shadow-lg">
                    {product.badge}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Vastu Items
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-2">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="font-body text-lg text-muted-foreground mb-6">
                  {product.subtitle}
                </p>
              )}

              <div className="flex items-center gap-4 mb-8">
                <span className="font-display text-3xl font-medium text-gradient-primary">
                  ₹{product.price}
                </span>
                {product.mrp && Number(product.mrp) > product.price && (
                  <span className="font-body text-base text-muted-foreground line-through">
                    ₹{product.mrp}
                  </span>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating ?? 0)
                          ? "fill-purple-bright text-purple-bright"
                          : "text-border"
                      }
                    />
                  ))}
                  <span className="font-body text-sm text-muted-foreground ml-1">
                    ({product.reviews_count ?? 0})
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Spiritual meaning */}
              {product.spiritual_meaning && (
                <div className="glass rounded-2xl p-6 mb-8 border-glow">
                  <h3 className="font-display text-lg font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    Spiritual Meaning
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {product.spiritual_meaning}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-lg font-medium text-foreground mb-3">
                    Vastu Benefits
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.benefits.map((b) => (
                      <div
                        key={b}
                        className="flex items-center gap-2 font-body text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-8">
                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      subtitle: product.subtitle || "",
                      price: product.price,
                      category: "Vastu Items",
                      slug: product.slug || product.id,
                      image: image,
                      rating: product.rating ?? 0,
                      reviews: product.reviews_count ?? 0,
                      description: product.description || "",
                      benefits: product.benefits || [],
                      spiritualMeaning: product.spiritual_meaning || "",
                    } as any)
                  }
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Energized", sub: "Hand-charged" },
                  { icon: Truck, label: "Free Shipping", sub: "Across India" },
                  { icon: RotateCcw, label: "30-Day Returns", sub: "No questions" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="glass rounded-xl p-3 text-center border border-border/40"
                  >
                    <Icon size={18} className="mx-auto mb-1 text-primary" />
                    <p className="font-body text-xs text-foreground">{label}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Usage guide */}
          <section className="mt-24">
            <div className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
                Sacred Practice
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
                How to Use & <span className="text-gradient-primary">Activate</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {usageGuide.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-6 border border-border/40 hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center mb-4 glow-purple">
                    <Icon size={18} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-2">{title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <ProductReviews productId={product.id} />

          {/* Related */}
          {related && related.length > 1 && (
            <section className="mt-24">
              <h2 className="font-display text-3xl font-light text-foreground text-center mb-12">
                More <span className="text-gradient-primary">Vastu Remedies</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {related
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((p) => (
                    <Link
                      key={p.id}
                      to={`/vastu/${p.slug}`}
                      className="group block"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-3 border border-border/40 group-hover:border-primary/50 transition">
                        <img
                          src={p.image_url || "/placeholder.svg"}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                      <p className="font-body text-sm text-gradient-primary">₹{p.price}</p>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VastuProductDetail;
