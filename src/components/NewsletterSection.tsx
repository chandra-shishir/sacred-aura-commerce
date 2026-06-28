import { motion } from "framer-motion";
import { useState } from "react";
import { RevealOnScroll } from "./ParallaxSection";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the Sacred Circle! ✨");
      setEmail("");
    }
  };

  return (
    <section className="py-24 gradient-section relative overflow-hidden">
      <div className="absolute inset-0 gradient-purple-radial pointer-events-none" />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-purple-bright/40 animate-float" />
      <div className="absolute bottom-1/3 right-20 w-3 h-3 rounded-full bg-purple-glow/30 animate-float animation-delay-200" />
      <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-fuchsia/30 animate-float animation-delay-400" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <RevealOnScroll className="max-w-lg mx-auto">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Stay Aligned
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
            Join the <span className="text-gradient-primary">Sacred Circle</span>
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            Receive guidance, exclusive offers, and first access to new arrivals.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full border border-border bg-secondary font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(270 80% 65% / 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple whitespace-nowrap"
            >
              Join
            </motion.button>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default NewsletterSection;
