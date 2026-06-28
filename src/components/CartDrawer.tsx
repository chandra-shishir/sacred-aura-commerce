import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { productImages } from "@/lib/images";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display text-2xl font-medium text-foreground">
                Your Cart <span className="text-muted-foreground font-body text-sm">({items.reduce((s, i) => s + i.quantity, 0)})</span>
              </h2>
              <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                </motion.div>
                <p className="font-body">Your cart is empty</p>
                <button onClick={() => { closeCart(); navigate("/shop"); }} className="gradient-purple px-5 py-2 rounded-full text-primary-foreground font-body text-sm tracking-wider">
                  Browse Shop
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 py-4 border-b border-border/50"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border-glow">
                          <img
                            src={item.product.image || productImages[item.product.slug || item.product.id] || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-base font-medium text-foreground truncate">{item.product.name}</h3>
                          <p className="font-body text-sm text-gradient-primary font-medium">
                            ₹{item.product.price}
                            {item.product.mrp && (
                              <span className="text-muted-foreground line-through ml-2 text-xs">₹{item.product.mrp}</span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-body text-sm w-6 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X size={16} />
                          </button>
                          <span className="font-body text-sm text-foreground font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="px-6 py-6 border-t border-border bg-card">
                  <div className="flex justify-between mb-2">
                    <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl font-medium text-gradient-primary">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-4">Shipping & taxes calculated at checkout</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight size={16} />
                  </motion.button>
                  <button
                    onClick={closeCart}
                    className="w-full py-3 font-body text-xs text-center text-muted-foreground hover:text-foreground transition-colors mt-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
