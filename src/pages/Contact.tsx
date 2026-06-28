import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Sacred Aura — Customer Support & Inquiries"
        description="Get in touch with Sacred Aura for product questions, order support, wholesale inquiries, or spiritual guidance. We respond within 24 hours."
        canonical="/contact"
      />
      <Navbar />
      <CartDrawer />

      <section className="pt-28 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-bright/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
              Get in <span className="text-gradient-primary">Touch</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-lg mx-auto">
              We'd love to hear from you. Whether you have a question about our products or need guidance on your spiritual journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@sacredaura.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "Los Angeles, CA" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-6 border-glow"
                >
                  <item.icon size={24} className="text-primary mb-3" />
                  <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-display text-lg text-foreground">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="md:col-span-2 glass rounded-2xl p-8 border-glow space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Name</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Subject</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">Message</label>
                <textarea
                  required
                  maxLength={2000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple">
                <Send size={16} /> Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
