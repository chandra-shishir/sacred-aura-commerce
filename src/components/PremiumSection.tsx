import { motion } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import rubyBracelet from "@/assets/premium-ruby-bracelet.jpg";
import rubyPendant from "@/assets/premium-ruby-pendant.jpg";
import emeraldBracelet from "@/assets/premium-emerald-bracelet.jpg";
import emeraldPendant from "@/assets/premium-emerald-pendant.jpg";

const items = [
  { name: "Royal Ruby Cluster Bracelet", subtitle: "Natural Burmese rubies · 18k gold", price: 49999, mrp: 79999, img: rubyBracelet, slug: "royal-ruby-cluster-bracelet" },
  { name: "Royal Ruby Cluster Pendant", subtitle: "Pigeon-blood ruby · 18k gold", price: 39999, mrp: 64999, img: rubyPendant, slug: "royal-ruby-cluster-pendant" },
  { name: "Imperial Emerald Bracelet", subtitle: "Colombian emeralds · 18k gold", price: 54999, mrp: 89999, img: emeraldBracelet, slug: "imperial-emerald-cluster-bracelet" },
  { name: "Imperial Emerald Pendant", subtitle: "Muzo emerald · 18k gold", price: 44999, mrp: 74999, img: emeraldPendant, slug: "imperial-emerald-cluster-pendant" },
];

const PremiumSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0709]">
      {/* Glittery background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(180,83,9,0.15),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, #d4af37 1px, transparent 1px), radial-gradient(circle at 80% 70%, #f5d76e 1px, transparent 1px), radial-gradient(circle at 50% 50%, #d4af37 1px, transparent 1px)",
          backgroundSize: "60px 60px, 90px 90px, 120px 120px"
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/5 mb-6">
            <Crown size={14} className="text-amber-300" />
            <span className="font-jost text-[11px] tracking-[0.3em] uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Rare &amp; Exclusive
            </span>
          </div>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            The Premium Collection
          </h2>
          <p className="font-jost text-amber-100/60 text-sm md:text-base mt-4 max-w-xl mx-auto tracking-wide">
            Museum-grade rubies and emeralds, set in 18k gold — for the connoisseur of light, lineage and luxury.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/product/${p.slug}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden border border-amber-400/20 bg-gradient-to-b from-amber-950/30 to-black p-1 transition-all duration-500 hover:border-amber-400/60 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.4)] hover:-translate-y-1">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-black">
                    <img
                      src={p.img}
                      alt={p.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-amber-400/40">
                      <Sparkles size={10} className="text-amber-300" />
                      <span className="font-jost text-[10px] tracking-widest uppercase text-amber-200">Exclusive</span>
                    </div>
                  </div>

                  <div className="px-3 pt-4 pb-3">
                    <h3 className="font-cormorant text-xl text-amber-50 leading-tight">{p.name}</h3>
                    <p className="font-jost text-[11px] text-amber-200/50 mt-1 tracking-wider uppercase">{p.subtitle}</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-cormorant text-2xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <span className="font-jost text-xs text-amber-200/40 line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop?category=Premium%20Collection"
            className="inline-block px-10 py-3.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 transition-all"
          >
            <span className="font-jost text-xs tracking-[0.3em] uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Explore the Collection
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
