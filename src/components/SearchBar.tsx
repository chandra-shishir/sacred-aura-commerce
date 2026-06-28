import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductSearch } from "@/hooks/useProducts";
import { productImages } from "@/lib/images";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: results } = useProductSearch(query);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
            onClick={() => { setOpen(false); setQuery(""); }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="max-w-2xl mx-auto mt-24 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong rounded-2xl p-4 border-glow">
                <div className="flex items-center gap-3 mb-4">
                  <Search size={20} className="text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search crystals, bracelets, malas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-foreground font-body text-lg placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button onClick={() => { setOpen(false); setQuery(""); }}>
                    <X size={20} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {results && results.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-2 max-h-80 overflow-y-auto">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`${product.category?.toLowerCase().includes("vastu") ? "/vastu" : "/product"}/${product.slug || product.id}`}
                        onClick={() => { setOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
                      >
                        <img
                          src={product.image_url || productImages[product.id] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-body text-sm text-foreground">{product.name}</p>
                          <p className="font-body text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="font-body text-sm text-gradient-primary">
                          ₹{product.price}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {query.length >= 2 && results && results.length === 0 && (
                  <p className="text-center text-muted-foreground font-body text-sm py-4">
                    No products found for "{query}"
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
