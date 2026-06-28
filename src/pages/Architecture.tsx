import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layout,
  Server,
  ShieldCheck,
  Database,
  Zap,
  ArrowRight,
  FileCode,
  X,
} from "lucide-react";
import SEO from "@/components/SEO";

type NodeId = "frontend" | "api" | "auth" | "database" | "edge";

interface ArchNode {
  id: NodeId;
  title: string;
  subtitle: string;
  tech: string;
  icon: React.ElementType;
  color: string;
  files: { path: string; desc: string }[];
}

const NODES: Record<NodeId, ArchNode> = {
  frontend: {
    id: "frontend",
    title: "Frontend",
    subtitle: "React UI rendered in the browser",
    tech: "React 18 · TypeScript · Vite · Tailwind · Framer Motion · R3F",
    icon: Layout,
    color: "from-purple-500/30 to-purple-700/10",
    files: [
      { path: "src/App.tsx", desc: "Root app + routes" },
      { path: "src/main.tsx", desc: "Vite entry point" },
      { path: "src/pages/Index.tsx", desc: "Home page" },
      { path: "src/pages/Shop.tsx", desc: "Product catalog" },
      { path: "src/pages/ProductDetail.tsx", desc: "Single product view" },
      { path: "src/pages/Checkout.tsx", desc: "3-step checkout flow" },
      { path: "src/components/Navbar.tsx", desc: "Top navigation + mega menu" },
      { path: "src/components/ProductCard.tsx", desc: "Product tile" },
      { path: "src/context/CartContext.tsx", desc: "Cart state (local)" },
      { path: "src/index.css", desc: "Design tokens (HSL)" },
      { path: "tailwind.config.ts", desc: "Tailwind theme config" },
    ],
  },
  api: {
    id: "api",
    title: "API Layer",
    subtitle: "TanStack Query hooks calling Supabase SDK",
    tech: "TypeScript · @tanstack/react-query · @supabase/supabase-js",
    icon: Server,
    color: "from-blue-500/30 to-blue-700/10",
    files: [
      { path: "src/integrations/supabase/client.ts", desc: "Supabase client (auto-generated)" },
      { path: "src/hooks/useProducts.ts", desc: "Read products" },
      { path: "src/hooks/useOrders.ts", desc: "Create + list orders, validate coupons" },
      { path: "src/hooks/useReviews.ts", desc: "Product reviews" },
      { path: "src/hooks/useWishlist.ts", desc: "Wishlist CRUD" },
      { path: "src/hooks/useBlog.ts", desc: "Blog post queries" },
      { path: "src/hooks/useCourses.ts", desc: "Course queries" },
      { path: "src/hooks/useAdmin.ts", desc: "Admin orders/products/blog mutations" },
    ],
  },
  auth: {
    id: "auth",
    title: "Authentication",
    subtitle: "Email/password + Google OAuth via Supabase Auth",
    tech: "Supabase Auth · React Context · RLS-aware policies",
    icon: ShieldCheck,
    color: "from-emerald-500/30 to-emerald-700/10",
    files: [
      { path: "src/context/AuthContext.tsx", desc: "Session provider + signOut" },
      { path: "src/pages/Auth.tsx", desc: "Sign in / Sign up UI" },
      { path: "src/hooks/useAdmin.ts", desc: "useIsAdmin via has_role()" },
      { path: "supabase (function)", desc: "handle_new_user → creates profile" },
      { path: "supabase (function)", desc: "has_role(user_id, role) → RLS gate" },
    ],
  },
  database: {
    id: "database",
    title: "Database",
    subtitle: "Postgres tables with Row-Level Security",
    tech: "PostgreSQL · SQL · PL/pgSQL · RLS policies",
    icon: Database,
    color: "from-amber-500/30 to-amber-700/10",
    files: [
      { path: "table: products", desc: "Catalog (public read, admin write)" },
      { path: "table: categories", desc: "Hierarchical categories" },
      { path: "table: orders + order_items", desc: "Owned by user; admins see all" },
      { path: "table: profiles", desc: "User profile (auto-created on signup)" },
      { path: "table: user_roles", desc: "RBAC — never store on profiles" },
      { path: "table: blog_posts / courses", desc: "Published content" },
      { path: "table: reviews / wishlist / coupons", desc: "Engagement + promos" },
      { path: "src/integrations/supabase/types.ts", desc: "Generated TS types" },
    ],
  },
  edge: {
    id: "edge",
    title: "Edge Functions",
    subtitle: "Serverless Deno functions",
    tech: "Deno · TypeScript · Supabase service role",
    icon: Zap,
    color: "from-pink-500/30 to-pink-700/10",
    files: [
      { path: "supabase/functions/sitemap/index.ts", desc: "Dynamic /sitemap.xml" },
      { path: "supabase/config.toml", desc: "Function config (verify_jwt)" },
    ],
  },
};

const FLOWS: { from: NodeId; to: NodeId; label: string }[] = [
  { from: "frontend", to: "api", label: "hooks" },
  { from: "frontend", to: "auth", label: "session" },
  { from: "api", to: "database", label: "SQL via SDK" },
  { from: "auth", to: "database", label: "RLS check" },
  { from: "frontend", to: "edge", label: "fetch" },
  { from: "edge", to: "database", label: "service role" },
];

const Architecture = () => {
  const [selected, setSelected] = useState<NodeId | null>("frontend");
  const node = selected ? NODES[selected] : null;

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <SEO
        title="System Architecture"
        description="Interactive architecture diagram of the Sacred Aura platform — frontend, API, auth, database, and edge functions."
        canonical="/architecture"
        noindex
      />

      <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-purple-bright/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-purple-glow/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <Link
            to="/"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mt-4">
            System <span className="text-gradient-primary">Architecture</span>
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-2xl">
            Click any node to inspect the files and modules that power that layer.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Diagram */}
          <div className="glass rounded-2xl p-8 border-glow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Frontend */}
              <NodeCard
                node={NODES.frontend}
                selected={selected === "frontend"}
                onClick={() => setSelected("frontend")}
                className="md:col-span-3"
              />

              <Connector label="hooks · queries" />
              <Connector label="session" />
              <Connector label="fetch /functions" />

              {/* Middle row */}
              <NodeCard
                node={NODES.api}
                selected={selected === "api"}
                onClick={() => setSelected("api")}
              />
              <NodeCard
                node={NODES.auth}
                selected={selected === "auth"}
                onClick={() => setSelected("auth")}
              />
              <NodeCard
                node={NODES.edge}
                selected={selected === "edge"}
                onClick={() => setSelected("edge")}
              />

              <Connector label="SQL" />
              <Connector label="RLS" />
              <Connector label="service role" />

              {/* Database (full width) */}
              <NodeCard
                node={NODES.database}
                selected={selected === "database"}
                onClick={() => setSelected("database")}
                className="md:col-span-3"
              />
            </div>

            {/* Flow legend */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Data flow
              </p>
              <div className="flex flex-wrap gap-2">
                {FLOWS.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs font-body text-muted-foreground"
                  >
                    <span className="text-foreground">{NODES[f.from].title}</span>
                    <ArrowRight size={12} />
                    <span className="text-foreground">{NODES[f.to].title}</span>
                    <span className="text-muted-foreground/70">· {f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="glass rounded-2xl p-6 border-glow h-fit lg:sticky lg:top-6">
            <AnimatePresence mode="wait">
              {node && (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center border border-border`}
                      >
                        <node.icon size={20} className="text-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl text-foreground">{node.title}</h2>
                        <p className="font-body text-xs text-muted-foreground">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mb-4 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                    <p className="font-body text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">Stack:</span> {node.tech}
                    </p>
                  </div>

                  <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Relevant files
                  </p>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {node.files.map((f) => (
                      <div
                        key={f.path}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border hover:border-primary/40 transition-colors"
                      >
                        <FileCode
                          size={14}
                          className="text-primary mt-0.5 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-foreground break-all">
                            {f.path}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {!node && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-body text-sm text-muted-foreground text-center py-12"
                >
                  Select a node to see its files.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const NodeCard = ({
  node,
  selected,
  onClick,
  className = "",
}: {
  node: ArchNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) => {
  const Icon = node.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative text-left rounded-2xl p-5 border transition-all bg-gradient-to-br ${
        node.color
      } ${
        selected
          ? "border-primary glow-purple"
          : "border-border hover:border-primary/40"
      } ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-background/40 backdrop-blur flex items-center justify-center border border-border">
          <Icon size={18} className="text-foreground" />
        </div>
        <h3 className="font-display text-lg text-foreground">{node.title}</h3>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed">
        {node.subtitle}
      </p>
      <p className="font-mono text-[10px] text-muted-foreground/70 mt-2 truncate">
        {node.tech}
      </p>
    </motion.button>
  );
};

const Connector = ({ label }: { label: string }) => (
  <div className="hidden md:flex flex-col items-center gap-1 py-1">
    <div className="w-px h-6 bg-gradient-to-b from-primary/60 to-transparent" />
    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
    <div className="w-px h-6 bg-gradient-to-t from-primary/60 to-transparent" />
  </div>
);

export default Architecture;
