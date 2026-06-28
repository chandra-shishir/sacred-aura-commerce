import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Truck, Shield, ArrowLeft, MapPin, User, Phone, Mail, Check, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder, useCoupon } from "@/hooks/useOrders";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Checkout = () => {
  const { items, totalPrice, closeCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const applyCoupon = useCoupon();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const tax = totalPrice * 0.18;
  const orderTotal = totalPrice + shippingCost + tax - discount;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const coupon = await applyCoupon.mutateAsync(couponCode);
      if (coupon.discount_type === "percentage") {
        setDiscount(totalPrice * (coupon.discount_value / 100));
      } else {
        setDiscount(coupon.discount_value);
      }
      toast.success(`Coupon applied! You save ₹${discount.toFixed(2)}`);
    } catch (err: any) {
      toast.error(err.message || "Invalid coupon");
    }
  };

  const validateStep1 = () => {
    if (!form.email || !form.firstName || !form.lastName || !form.phone) {
      toast.error("Please fill in all personal details");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (form.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.address || !form.city || !form.state || !form.postalCode) {
      toast.error("Please fill in all address fields");
      return false;
    }
    if (form.postalCode.length < 5) {
      toast.error("Please enter a valid pin/postal code");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(orderTotal.toFixed(2)),
        shipping_address: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address,
          address2: form.address2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        guest_email: !user ? form.email : undefined,
      });
      closeCart();
      navigate("/order-success");
    } catch (error) {
      // Error handled by mutation
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Checkout" description="Your cart is empty." canonical="/checkout" noindex />
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Package size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-display text-3xl text-foreground mb-4">Your cart is empty</p>
            <button onClick={() => navigate("/shop")} className="gradient-purple px-6 py-3 rounded-xl text-primary-foreground font-body text-sm tracking-wider">
              Continue Shopping
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Checkout" description="Complete your Sacred Aura order securely." canonical="/checkout" noindex />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            <span className="text-gradient-primary">Checkout</span>
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-10">
            {[
              { num: 1, label: "Personal Info" },
              { num: 2, label: "Shipping Address" },
              { num: 3, label: "Confirm Order" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm transition-all ${
                  step >= s.num ? "gradient-purple text-primary-foreground glow-purple" : "bg-secondary text-muted-foreground"
                }`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className="font-body text-xs text-muted-foreground hidden sm:block">{s.label}</span>
                {s.num < 3 && <div className={`w-12 h-px ${step > s.num ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left - Form Steps */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-2xl p-6 border-glow">
                    <div className="flex items-center gap-3 mb-6">
                      <User size={20} className="text-primary" />
                      <h2 className="font-display text-xl text-foreground">Personal Details</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">First Name *</label>
                          <input placeholder="John" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Last Name *</label>
                          <input placeholder="Doe" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} required className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block flex items-center gap-1"><Mail size={12} /> Email *</label>
                        <input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} required className={inputClass} />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block flex items-center gap-1"><Phone size={12} /> Phone Number *</label>
                        <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required className={inputClass} />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => validateStep1() && setStep(2)}
                      className="w-full mt-6 py-3.5 rounded-xl gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase glow-purple"
                    >
                      Continue to Address
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Shipping Address */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-2xl p-6 border-glow">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin size={20} className="text-primary" />
                      <h2 className="font-display text-xl text-foreground">Shipping Address</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Address Line 1 *</label>
                        <input placeholder="House/Flat No., Street Name" value={form.address} onChange={(e) => updateField("address", e.target.value)} required className={inputClass} />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Address Line 2</label>
                        <input placeholder="Apartment, Landmark (optional)" value={form.address2} onChange={(e) => updateField("address2", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">City *</label>
                          <input placeholder="Mumbai" value={form.city} onChange={(e) => updateField("city", e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">State *</label>
                          <input placeholder="Maharashtra" value={form.state} onChange={(e) => updateField("state", e.target.value)} required className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">PIN / Postal Code *</label>
                          <input placeholder="400001" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Country</label>
                          <select value={form.country} onChange={(e) => updateField("country", e.target.value)} className={inputClass}>
                            <option value="India">India</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-border text-foreground font-body text-sm tracking-wider hover:bg-secondary transition-colors">
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => validateStep2() && setStep(3)}
                        className="flex-1 py-3.5 rounded-xl gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase glow-purple"
                      >
                        Review Order
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirm Order */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    {/* Delivery Details Summary */}
                    <div className="glass rounded-2xl p-6 border-glow">
                      <h2 className="font-display text-xl text-foreground mb-4">Delivery Details</h2>
                      <div className="grid grid-cols-2 gap-4 font-body text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Name</p>
                          <p className="text-foreground">{form.firstName} {form.lastName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-foreground">{form.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</p>
                          <p className="text-foreground">{form.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Address</p>
                          <p className="text-foreground">{form.address}{form.address2 ? `, ${form.address2}` : ""}</p>
                          <p className="text-foreground">{form.city}, {form.state} {form.postalCode}</p>
                          <p className="text-foreground">{form.country}</p>
                        </div>
                      </div>
                      <button onClick={() => setStep(1)} className="mt-3 font-body text-xs text-primary hover:underline">Edit Details</button>
                    </div>

                    {/* Items */}
                    <div className="glass rounded-2xl p-6 border-glow">
                      <h2 className="font-display text-xl text-foreground mb-4">Order Items</h2>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-border/30">
                            <div>
                              <p className="font-body text-sm text-foreground">{item.product.name}</p>
                              <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.product.price}</p>
                            </div>
                            <span className="font-body text-sm text-foreground font-medium">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl border border-border text-foreground font-body text-sm tracking-wider hover:bg-secondary transition-colors">
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase glow-purple disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Place Order"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mt-8 text-muted-foreground">
                <div className="flex items-center gap-2 font-body text-xs"><Shield size={14} /> Secure Checkout</div>
                <div className="flex items-center gap-2 font-body text-xs"><Truck size={14} /> Free Shipping ₹999+</div>
                <div className="flex items-center gap-2 font-body text-xs"><CreditCard size={14} /> Safe Payment</div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 border-glow sticky top-24">
                <h2 className="font-display text-xl text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-body text-sm text-foreground">{item.product.name}</p>
                        <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-body text-sm text-foreground">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyCoupon.isPending}
                    className="px-4 py-2.5 rounded-lg bg-secondary text-foreground font-body text-xs tracking-wider hover:bg-muted transition-colors border border-border"
                  >
                    {applyCoupon.isPending ? "..." : "Apply"}
                  </button>
                </div>

                <div className="space-y-2 border-t border-border pt-4 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">{shippingCost === 0 ? "Free ✨" : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">₹{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-body text-sm text-green-400">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-gradient-primary">₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
