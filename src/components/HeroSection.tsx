import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroCrystal from "@/assets/hero-crystal.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Ambient purple glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full bg-purple-bright/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-glow/10 blur-[100px] animate-pulse-glow animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet/5 blur-[150px] animate-float" />
        <div className="absolute top-10 right-1/3 w-[300px] h-[300px] rounded-full bg-fuchsia/8 blur-[80px] animate-pulse-glow animation-delay-400" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(270 60% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(270 60% 50% / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            Premium Spiritual Lifestyle
          </motion.p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-6">
            Awaken
            <br />
            Your <span className="text-gradient-primary italic font-medium">Inner</span>
            <br />
            <span className="text-gradient-shimmer">Energy</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-body text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Curated crystals, malas, and healing tools sourced with intention — designed to elevate your spiritual practice.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#collection"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full gradient-purple font-body text-sm tracking-widest uppercase text-primary-foreground hover:opacity-90 transition-opacity glow-purple"
            >
              Explore Collection
            </a>
            <a
              href="#story"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-purple-bright/30 font-body text-sm tracking-widest uppercase text-foreground hover:bg-secondary transition-colors"
            >
              Our Story
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            {/* Purple glow behind image */}
            <div className="absolute -inset-6 rounded-3xl bg-purple-bright/20 blur-3xl" />
            <div className="absolute -inset-3 rounded-3xl border border-purple-bright/10" />
            <img
              src={heroCrystal}
              alt="Sacred Aura amethyst crystal"
              width={1920}
              height={1080}
              className="relative rounded-3xl w-full max-w-lg object-cover aspect-[4/3] shadow-soft"
            />
            {/* Orbiting particle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-purple-glow/60 blur-[2px] animate-orbit" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#collection" className="text-muted-foreground animate-float">
          <ArrowDown size={24} />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
