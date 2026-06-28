import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "./ParallaxSection";

const testimonials = [
  {
    name: "Aria M.",
    text: "The amethyst cluster I received is absolutely breathtaking. I've never felt such powerful energy from a crystal. Sacred Aura truly curates with intention.",
    rating: 5,
  },
  {
    name: "Luna K.",
    text: "My chakra bracelet is not only beautiful but I genuinely feel more balanced wearing it. The quality is unlike anything I've found elsewhere.",
    rating: 5,
  },
  {
    name: "Sage R.",
    text: "The cleansing kit transformed my meditation space. The selenite wand is museum-quality. I'm forever a Sacred Aura customer.",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 gradient-purple-radial pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <RevealOnScroll className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Voices of Light
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
            What Our <span className="text-gradient-primary">Community</span> Says
          </h2>
        </RevealOnScroll>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 0 50px hsl(270 80% 65% / 0.15)" }}
                className="glass rounded-2xl p-8 border-glow h-full"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-purple-bright text-purple-bright" />
                  ))}
                </div>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                <p className="font-display text-lg font-medium text-foreground">{t.name}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default TestimonialSection;
