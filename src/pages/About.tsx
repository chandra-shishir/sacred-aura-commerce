import { motion } from "framer-motion";
import { Heart, Globe, Leaf, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import storyImage from "@/assets/story-meditation.jpg";
import SEO from "@/components/SEO";

const values = [
  { icon: Heart, title: "Intention", desc: "Every product is selected with spiritual integrity and genuine healing purpose." },
  { icon: Globe, title: "Global Sourcing", desc: "We source from ethical mines and artisans across 12+ countries worldwide." },
  { icon: Leaf, title: "Sustainability", desc: "Eco-friendly packaging and carbon-neutral shipping on every order." },
  { icon: Shield, title: "Authenticity", desc: "Every crystal is certified genuine with a certificate of authenticity." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="About Sacred Aura — Our Story & Mission"
      description="Sacred Aura curates premium crystals, healing tools, and spiritual courses sourced ethically from 12+ countries. Born from reverence — built on intention."
      canonical="/about"
    />
    <Navbar />
    <CartDrawer />

    <section className="pt-28 pb-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-bright/10 blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-foreground mb-6">
            Born from <span className="text-gradient-primary italic">Reverence</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            Sacred Aura was founded with a singular belief: that the tools of spiritual practice deserve the same reverence as the practice itself. We curate crystals and healing instruments of extraordinary quality for seekers worldwide.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-purple-bright/10 blur-2xl" />
            <img src={storyImage} alt="Sacred Aura meditation" className="relative rounded-3xl w-full object-cover aspect-[4/3] border-glow" loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
              Where ancient wisdom meets <span className="text-gradient-primary">modern seeking</span>
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>What began as a personal journey of healing through crystals has grown into a global community of over 10,000 conscious souls across 50+ countries.</p>
              <p>Every crystal in our collection is hand-selected by our team of certified crystal healers and Reiki practitioners. We travel to the source — the amethyst mines of Uruguay, the quartz formations of Brazil, the sacred Rudraksha groves of Nepal — to ensure the highest vibrational quality.</p>
              <p>We don't just sell crystals. We bridge the gap between Earth's ancient wisdom and your modern spiritual practice.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 gradient-section">
      <div className="container mx-auto px-6">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-3xl md:text-4xl font-light text-foreground text-center mb-16">
          Our <span className="text-gradient-primary">Values</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-8 border-glow text-center card-hover">
              <v.icon size={32} className="mx-auto text-primary mb-4" />
              <h3 className="font-display text-xl font-medium text-foreground mb-2">{v.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
