import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ShoppingCart, Users, FileText, BarChart3, Plus, Trash2, Edit, Save, X, GraduationCap, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsAdmin, useAdminOrders, useAdminProducts, useUpdateOrderStatus, useDeleteProduct, useUpsertProduct, useAdminBlogPosts, useUpsertBlogPost } from "@/hooks/useAdmin";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import CourseManager from "@/components/admin/CourseManager";

const Admin = () => {
  const { user } = useAuth();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const [tab, setTab] = useState<"dashboard" | "products" | "orders" | "blog" | "courses">("dashboard");

  const { data: products } = useAdminProducts();
  const { data: orders } = useAdminOrders();
  const { data: blogPosts } = useAdminBlogPosts();
  const updateStatus = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();
  const upsertProduct = useUpsertProduct();
  const upsertBlogPost = useUpsertBlogPost();

  const [editingProduct, setEditingProduct] = useState<Record<string, unknown> | null>(null);
  const [editingPost, setEditingPost] = useState<Record<string, unknown> | null>(null);

  if (!user) return <Navigate to="/auth" />;
  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-10 border-glow max-w-md">
          <p className="font-display text-3xl text-foreground mb-2">Access Denied</p>
          <p className="font-body text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <p className="font-body text-xs text-muted-foreground">Contact the administrator to get access.</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0;

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "products" as const, label: "Products", icon: Package },
    { id: "orders" as const, label: "Orders", icon: ShoppingCart },
    { id: "courses" as const, label: "Courses", icon: GraduationCap },
    { id: "blog" as const, label: "Blog", icon: FileText },
  ];

  const saveProduct = async () => {
    if (!editingProduct) return;
    try {
      await upsertProduct.mutateAsync(editingProduct);
      setEditingProduct(null);
    } catch {}
  };

  const saveBlogPost = async () => {
    if (!editingPost) return;
    try {
      await upsertBlogPost.mutateAsync(editingPost);
      setEditingPost(null);
    } catch {}
  };

  const inputClass = "px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-full";

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin Dashboard" description="Sacred Aura admin panel." canonical="/admin" noindex />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen glass-strong border-r border-border p-6 hidden lg:flex flex-col">
          <h2 className="font-display text-xl text-foreground mb-8">
            Sacred<span className="text-gradient-primary">Admin</span>
          </h2>
          <nav className="space-y-2 flex-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-body text-sm transition-all ${
                  tab === t.id ? "gradient-purple text-primary-foreground glow-purple" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </nav>
          <div className="pt-4 border-t border-border">
            <p className="font-body text-xs text-muted-foreground">{user.email}</p>
            <p className="font-body text-xs text-primary">Admin</p>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10 max-w-full overflow-x-hidden">
          {/* Mobile tabs */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs whitespace-nowrap transition-all ${
                  tab === t.id ? "gradient-purple text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {tab === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-2xl text-foreground mb-6">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toFixed(2)}`, icon: BarChart3, color: "text-primary" },
                    { label: "Total Orders", value: orders?.length || 0, icon: ShoppingCart, color: "text-primary" },
                    { label: "Pending", value: pendingOrders, icon: Package, color: "text-yellow-400" },
                    { label: "Products", value: products?.length || 0, icon: Tag, color: "text-primary" },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 border-glow">
                      <stat.icon size={20} className={stat.color + " mb-2"} />
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <p className="font-display text-2xl text-foreground mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <h2 className="font-display text-xl text-foreground mb-4">Recent Orders</h2>
                <div className="glass rounded-xl border-glow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.slice(0, 10).map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 font-body text-sm text-foreground">#{order.id.slice(0, 8)}</td>
                            <td className="px-4 py-3 font-body text-sm text-muted-foreground">{order.guest_email || "Registered"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full font-body text-xs capitalize ${
                                order.status === "completed" ? "bg-green-900/30 text-green-400" :
                                order.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                                order.status === "shipped" ? "bg-blue-900/30 text-blue-400" :
                                "bg-secondary text-muted-foreground"
                              }`}>{order.status}</span>
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-foreground">₹{order.total}</td>
                            <td className="px-4 py-3 font-body text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                          <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-muted-foreground">No orders yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products */}
            {tab === "products" && (
              <motion.div key="prods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-2xl text-foreground">Products ({products?.length || 0})</h1>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingProduct({ name: "", price: 0, category: "Crystals", currency: "₹", stock: 10, is_active: true })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple"
                  >
                    <Plus size={16} /> Add Product
                  </motion.button>
                </div>

                {/* Edit/Add Product Form */}
                <AnimatePresence>
                  {editingProduct && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl border-glow p-6 mb-6 overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display text-lg text-foreground">{editingProduct.id ? "Edit Product" : "Add New Product"}</h3>
                        <button onClick={() => setEditingProduct(null)}><X size={20} className="text-muted-foreground" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Product Name" value={(editingProduct.name as string) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className={inputClass} />
                        <input placeholder="Slug" value={(editingProduct.slug as string) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })} className={inputClass} />
                        <input type="number" placeholder="Price" value={(editingProduct.price as number) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className={inputClass} />
                        <input type="number" placeholder="MRP" value={(editingProduct.mrp as number) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, mrp: parseFloat(e.target.value) })} className={inputClass} />
                        <select value={(editingProduct.category as string) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className={inputClass}>
                          {["Crystals","Bracelets","Malas","Pendants","Rudraksha","Feng Shui","Evil Eye","Healing Tools","Aroma Oils","Candles","Jewelry"].map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input type="number" placeholder="Stock" value={(editingProduct.stock as number) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })} className={inputClass} />
                        <textarea placeholder="Description" value={(editingProduct.description as string) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className={inputClass + " col-span-full"} rows={3} />
                        <input placeholder="Image URL" value={(editingProduct.image_url as string) || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className={inputClass + " col-span-full"} />
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveProduct} disabled={upsertProduct.isPending} className="mt-4 flex items-center gap-2 px-6 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple">
                        <Save size={16} /> {upsertProduct.isPending ? "Saving..." : "Save Product"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="glass rounded-xl border-glow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Stock</th>
                          <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.map((product) => (
                          <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-body text-sm text-foreground">{product.name}</p>
                              <p className="font-body text-xs text-muted-foreground">{product.slug}</p>
                            </td>
                            <td className="px-4 py-3 font-body text-sm text-muted-foreground">{product.category}</td>
                            <td className="px-4 py-3 font-body text-sm text-foreground">₹{product.price}</td>
                            <td className="px-4 py-3 font-body text-sm text-muted-foreground">{product.stock}</td>
                            <td className="px-4 py-3 flex gap-2">
                              <button onClick={() => setEditingProduct(product)} className="text-primary hover:text-primary/80"><Edit size={16} /></button>
                              <button onClick={() => { if (confirm("Delete?")) deleteProduct.mutate(product.id); }} className="text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders */}
            {tab === "orders" && (
              <motion.div key="ords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-2xl text-foreground mb-6">Orders ({orders?.length || 0})</h1>
                <div className="space-y-4">
                  {orders?.map((order) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5 border-glow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="font-body text-sm text-foreground font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="font-body text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()} · {order.guest_email || "Registered User"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus.mutate({ orderId: order.id, status: e.target.value })}
                            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground font-body text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-body text-xs text-muted-foreground">
                            {(order as any).order_items?.length || 0} item(s)
                          </p>
                          {order.shipping_address && (
                            <p className="font-body text-xs text-muted-foreground mt-1">
                              Ship to: {(order.shipping_address as any)?.city}, {(order.shipping_address as any)?.state} {(order.shipping_address as any)?.postalCode}
                            </p>
                          )}
                        </div>
                        <p className="font-display text-lg text-gradient-primary">₹{order.total}</p>
                      </div>
                    </motion.div>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground font-body">No orders yet</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Blog */}
            {tab === "blog" && (
              <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-2xl text-foreground">Blog Posts ({blogPosts?.length || 0})</h1>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingPost({ title: "", slug: "", content: "", is_published: false, category: "Spirituality" })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple"
                  >
                    <Plus size={16} /> New Post
                  </motion.button>
                </div>

                <AnimatePresence>
                  {editingPost && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl border-glow p-6 mb-6 overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display text-lg text-foreground">{(editingPost as any).id ? "Edit Post" : "New Post"}</h3>
                        <button onClick={() => setEditingPost(null)}><X size={20} className="text-muted-foreground" /></button>
                      </div>
                      <div className="space-y-4">
                        <input placeholder="Title" value={(editingPost.title as string) || ""} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} className={inputClass} />
                        <input placeholder="Slug (url-friendly)" value={(editingPost.slug as string) || ""} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} className={inputClass} />
                        <input placeholder="Excerpt" value={(editingPost.excerpt as string) || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} className={inputClass} />
                        <textarea placeholder="Content" value={(editingPost.content as string) || ""} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} className={inputClass} rows={6} />
                        <div className="flex items-center gap-4">
                          <select value={(editingPost.category as string) || ""} onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })} className={inputClass + " max-w-xs"}>
                            {["Spirituality","Healing","Crystals","Divination","Feng Shui","Meditation"].map(c => <option key={c}>{c}</option>)}
                          </select>
                          <label className="flex items-center gap-2 font-body text-sm text-muted-foreground cursor-pointer">
                            <input type="checkbox" checked={!!(editingPost.is_published)} onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked, published_at: e.target.checked ? new Date().toISOString() : null })} className="rounded border-border" />
                            Published
                          </label>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveBlogPost} disabled={upsertBlogPost.isPending} className="mt-4 flex items-center gap-2 px-6 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple">
                        <Save size={16} /> {upsertBlogPost.isPending ? "Saving..." : "Save Post"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {blogPosts?.map((post) => (
                    <div key={post.id} className="glass rounded-xl p-5 border-glow flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-body text-sm text-foreground">{post.title}</p>
                        <p className="font-body text-xs text-muted-foreground">{post.category} · {post.slug}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full font-body text-xs ${post.is_published ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                          {post.is_published ? "Live" : "Draft"}
                        </span>
                        <button onClick={() => setEditingPost(post)} className="text-primary hover:text-primary/80"><Edit size={16} /></button>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground font-body py-8">No blog posts yet</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Courses */}
            {tab === "courses" && (
              <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CourseManager />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Admin;
