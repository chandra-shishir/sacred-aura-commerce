import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Package, Heart, User, MapPin, Save, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders } = useOrders();
  const { data: wishlist } = useWishlist();
  const [tab, setTab] = useState<"orders" | "wishlist" | "profile">("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          display_name: data.display_name || "",
          phone: data.phone || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          country: data.country || "",
        });
      }
    };
    fetchProfile();
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated! ✨");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="My Account" description="Manage your Sacred Aura profile, orders, and wishlist." canonical="/account" noindex />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-3xl text-foreground">
              My <span className="text-gradient-primary">Account</span>
            </h1>
            <button onClick={() => signOut()} className="flex items-center gap-2 text-muted-foreground hover:text-destructive font-body text-sm transition-colors">
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm transition-all whitespace-nowrap ${
                  tab === t.id ? "gradient-purple text-primary-foreground glow-purple" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {tab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 border-glow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-foreground">Personal Information</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-primary font-body text-sm hover:opacity-80">
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple disabled:opacity-50"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save"}
                  </motion.button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Email</p>
                  <p className="font-body text-sm text-foreground">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Display Name</label>
                    {editing ? (
                      <input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} className={inputClass} />
                    ) : (
                      <p className="font-body text-sm text-foreground">{profile.display_name || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1 block">Phone</label>
                    {editing ? (
                      <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
                    ) : (
                      <p className="font-body text-sm text-foreground">{profile.phone || "Not set"}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-primary" />
                    <h3 className="font-display text-lg text-foreground">Address</h3>
                  </div>
                  <div className="space-y-4">
                    {editing ? (
                      <>
                        <input value={profile.address_line1} onChange={(e) => setProfile({ ...profile, address_line1: e.target.value })} placeholder="Address Line 1" className={inputClass} />
                        <input value={profile.address_line2} onChange={(e) => setProfile({ ...profile, address_line2: e.target.value })} placeholder="Address Line 2" className={inputClass} />
                        <div className="grid grid-cols-2 gap-4">
                          <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="City" className={inputClass} />
                          <input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} placeholder="State" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input value={profile.postal_code} onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })} placeholder="PIN Code" className={inputClass} />
                          <input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Country" className={inputClass} />
                        </div>
                      </>
                    ) : (
                      <div className="font-body text-sm text-foreground">
                        {profile.address_line1 ? (
                          <>
                            <p>{profile.address_line1}</p>
                            {profile.address_line2 && <p>{profile.address_line2}</p>}
                            <p>{profile.city}{profile.city && profile.state && ", "}{profile.state} {profile.postal_code}</p>
                            <p>{profile.country}</p>
                          </>
                        ) : (
                          <p className="text-muted-foreground">No address saved</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border-glow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-body text-sm text-foreground font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="font-body text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-body text-xs capitalize ${
                        order.status === "completed" ? "bg-green-900/30 text-green-400" :
                        order.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                        order.status === "shipped" ? "bg-blue-900/30 text-blue-400" :
                        "bg-secondary text-muted-foreground"
                      }`}>{order.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-body text-sm text-muted-foreground">{(order as any).order_items?.length || 0} item(s)</p>
                      <p className="font-display text-lg text-gradient-primary">₹{order.total}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package size={40} className="mx-auto text-muted-foreground mb-4" />
                  <p className="font-display text-xl text-foreground mb-2">No orders yet</p>
                  <p className="font-body text-sm text-muted-foreground mb-4">Start shopping to see your orders here</p>
                  <Link to="/shop" className="gradient-purple px-6 py-3 rounded-xl text-primary-foreground font-body text-sm tracking-wider inline-block">
                    Browse Shop
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {tab === "wishlist" && (
            <div className="space-y-4">
              {wishlist && wishlist.length > 0 ? (
                wishlist.map((item: any) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 border-glow flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-body text-sm text-foreground">{item.products?.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{item.products?.category}</p>
                    </div>
                    <p className="font-body text-sm text-gradient-primary">₹{item.products?.price}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart size={40} className="mx-auto text-muted-foreground mb-4" />
                  <p className="font-display text-xl text-foreground mb-2">Wishlist is empty</p>
                  <p className="font-body text-sm text-muted-foreground">Save your favorite items here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
