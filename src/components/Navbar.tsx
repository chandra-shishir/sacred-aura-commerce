import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Heart, User, LogOut, GraduationCap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MegaMenu from "@/components/MegaMenu";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
          Sacred<span className="text-gradient-primary">Aura</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <MegaMenu />
          <Link to="/courses" className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
          <Link to="/blog" className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          <Link to="/about" className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar />
          <Link to="/account" className="hidden md:block text-muted-foreground hover:text-foreground transition-colors" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <button onClick={toggleCart} className="relative text-muted-foreground hover:text-foreground transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full gradient-purple text-primary-foreground text-xs flex items-center justify-center font-body"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Account">
                <User size={20} />
              </Link>
              <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Sign out">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Sign in">
              <User size={20} />
            </Link>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden glass-strong border-t border-border"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">Shop All</Link>
              <Link to="/shop?category=Bracelets" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Bracelets</Link>
              <Link to="/shop?category=Pendants" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Pendants</Link>
              <Link to="/shop?category=Malas" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Malas</Link>
              <Link to="/shop?category=Crystals" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Crystals</Link>
              <Link to="/shop?category=Rudraksha" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Rudraksha</Link>
              <Link to="/shop?category=Feng+Shui" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Feng Shui</Link>
              <Link to="/shop?category=Evil+Eye" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground pl-4">Evil Eye</Link>
              <Link to="/courses" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">Courses</Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">Blog</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground">Contact</Link>
              {user ? (
                <Link to="/account" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-primary hover:text-foreground">My Account</Link>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="font-body text-sm tracking-widest uppercase text-primary hover:text-foreground">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
