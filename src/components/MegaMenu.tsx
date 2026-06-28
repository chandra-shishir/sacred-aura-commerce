import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

const MegaMenu = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { data: categories } = useCategories();

  const { roots, childrenMap } = useMemo(() => {
    const roots: any[] = [];
    const childrenMap: Record<string, any[]> = {};
    (categories || []).forEach((c: any) => {
      if (c.parent_id) (childrenMap[c.parent_id] ||= []).push(c);
      else roots.push(c);
    });
    return { roots, childrenMap };
  }, [categories]);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
        Shop{" "}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[380px] max-h-[70vh] overflow-y-auto glass-strong rounded-2xl border-glow p-4"
          >
            <Link
              to="/shop"
              className="block font-body text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors mb-3 px-3 py-2"
              onClick={() => setOpen(false)}
            >
              View All Products →
            </Link>

            <div className="flex flex-col gap-0.5">
              {roots.map((cat) => {
                const kids = childrenMap[cat.id] || [];
                const hasChildren = kids.length > 0;
                const isOpen = !!expanded[cat.id];
                return (
                  <div
                    key={cat.id}
                    className="border-l-2 border-transparent hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary">
                      <Link
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-sm font-medium text-foreground flex-1"
                      >
                        {cat.name}
                      </Link>
                      {hasChildren && (
                        <button
                          aria-label={`Toggle ${cat.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(cat.id);
                          }}
                          className="p-1 -mr-1 text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-5 pr-2 py-1 flex flex-col gap-0.5">
                              {kids.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={`/shop?category=${encodeURIComponent(sub.name)}`}
                                  onClick={() => setOpen(false)}
                                  className="font-body text-xs text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-lg hover:bg-secondary/60 transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu;
