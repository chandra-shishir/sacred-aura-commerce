import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Order Confirmed" description="Thank you for your order from Sacred Aura." canonical="/order-success" noindex />
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center mx-auto mb-6 glow-purple"
          >
            <CheckCircle size={40} className="text-primary-foreground" />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Order <span className="text-gradient-primary">Confirmed</span> ✨
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Thank you for your purchase! Your sacred items are being prepared with love and intention.
          </p>

          <div className="glass rounded-2xl p-6 border-glow mb-8">
            <div className="flex items-center gap-3 text-left">
              <Package size={24} className="text-primary shrink-0" />
              <div>
                <p className="font-body text-sm text-foreground">We'll send you an email with tracking details once your order ships.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="gradient-purple px-6 py-3 rounded-xl text-primary-foreground font-body text-sm tracking-wider flex items-center gap-2 justify-center">
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link to="/account" className="px-6 py-3 rounded-xl bg-secondary text-foreground font-body text-sm tracking-wider hover:bg-muted transition-colors text-center">
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
