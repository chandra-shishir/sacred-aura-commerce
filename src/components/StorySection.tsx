import { motion } from "framer-motion";
import { ParallaxImage, RevealOnScroll } from "./ParallaxSection";
import storyImage from "@/assets/story-meditation.jpg";

const StorySection = () => {
  return (
    <section id="story" className="py-24 md:py-32 gradient-section relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-bright/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-purple-bright/10 blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border-glow aspect-[4/3]">
                <ParallaxImage
                  src={storyImage}
                  alt="Crystal meditation ritual"
                  className="w-full h-full"
                />
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight text-foreground mb-8">
              Energy is the language
              <br />
              of the <span className="italic text-gradient-primary">universe</span>
            </h2>
            <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
              <p>
                Sacred Aura was born from a deep reverence for Earth's ancient treasures. Each crystal, mala, and healing tool in our collection is hand-selected for its energetic integrity and beauty.
              </p>
              <p>
                We believe that spiritual practice deserves objects of extraordinary quality — tools that honor the sacred journey of self-discovery and transformation.
              </p>
            </div>
            <div className="mt-10 flex gap-12">
              {[
                { value: "10K+", label: "Happy Souls" },
                { value: "50+", label: "Countries" },
                { value: "100%", label: "Ethically Sourced" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  <p className="font-display text-3xl font-semibold text-gradient-primary">{stat.value}</p>
                  <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
