import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-semibold mb-4 text-foreground">
              Sacred<span className="text-gradient-primary">Aura</span>
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Premium crystals and spiritual tools, curated with intention for your sacred journey. Ethically sourced from 12+ countries.
            </p>
            <div className="flex gap-4">
              {["Instagram", "Pinterest", "TikTok", "YouTube"].map((social) => (
                <a key={social} href="#" className="font-body text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
          {[
            {
              title: "Shop",
              links: [
                { label: "All Products", to: "/shop" },
                { label: "Crystals", to: "/shop?category=Crystals" },
                { label: "Bracelets", to: "/shop?category=Bracelets" },
                { label: "Malas", to: "/shop?category=Malas" },
                { label: "Pendants", to: "/shop?category=Pendants" },
                { label: "Rudraksha", to: "/shop?category=Rudraksha" },
              ],
            },
            {
              title: "Learn",
              links: [
                { label: "Reiki Courses", to: "/courses" },
                { label: "Blog", to: "/blog" },
                { label: "Crystal Guide", to: "/blog/crystal-healing-guide-beginners" },
                { label: "Chakra Guide", to: "/blog/understanding-7-chakras-deep-dive" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Shipping & Returns", to: "/contact" },
                { label: "FAQ", to: "/contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-muted-foreground">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-muted-foreground">© 2026 Sacred Aura. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="font-body text-xs text-muted-foreground">Privacy Policy</span>
            <span className="font-body text-xs text-muted-foreground">Terms of Service</span>
            <span className="font-body text-xs text-muted-foreground">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
