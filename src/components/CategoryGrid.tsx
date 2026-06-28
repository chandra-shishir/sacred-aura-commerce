import { Link } from "react-router-dom";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "./ParallaxSection";
import bracelet from "@/assets/product-bracelet.jpg";
import crystal from "@/assets/product-crystal.jpg";
import mala from "@/assets/product-mala.jpg";
import pendant from "@/assets/product-pendant.jpg";
import rudraksha from "@/assets/product-rudraksha.jpg";
import fengShui from "@/assets/product-feng-shui.jpg";
import evilEye from "@/assets/product-evil-eye.jpg";
import tourmaline from "@/assets/product-tourmaline.jpg";

const cats = [
  { name: "Crystals", image: crystal, slug: "Crystals", color: "from-purple-600/40" },
  { name: "Bracelets", image: bracelet, slug: "Bracelets", color: "from-rose-500/40" },
  { name: "Malas", image: mala, slug: "Malas", color: "from-amber-600/40" },
  { name: "Pendants", image: pendant, slug: "Pendants", color: "from-cyan-500/40" },
  { name: "Rudraksha", image: rudraksha, slug: "Rudraksha", color: "from-orange-500/40" },
  { name: "Feng Shui", image: fengShui, slug: "Feng+Shui", color: "from-blue-500/40" },
  { name: "Evil Eye", image: evilEye, slug: "Evil+Eye", color: "from-indigo-500/40" },
  { name: "Healing Stones", image: tourmaline, slug: "Healing+Tools", color: "from-emerald-500/40" },
];

const CategoryGrid = () => (
  <section className="py-24 md:py-32 relative">
    <div className="absolute inset-0 gradient-purple-radial pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      <RevealOnScroll className="text-center mb-16">
        <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Explore by Category
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
          Shop by <span className="text-gradient-primary">Intention</span>
        </h2>
      </RevealOnScroll>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {cats.map((cat) => (
          <StaggerItem key={cat.name}>
            <Link
              to={`/shop?category=${cat.slug}`}
              className="group relative block overflow-hidden rounded-2xl aspect-square border-glow"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-background/30 to-transparent group-hover:opacity-80 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-display text-lg md:text-xl font-medium text-foreground group-hover:text-gradient-primary transition-all">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default CategoryGrid;
