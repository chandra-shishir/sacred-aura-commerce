import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useBlogPosts } from "@/hooks/useBlog";
import SEO from "@/components/SEO";

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog — Crystal Wisdom, Reiki & Spiritual Guides"
        description="Explore in-depth guides on crystal healing, chakras, Reiki, meditation, feng shui, and spiritual practice from Sacred Aura's curated journal."
        canonical="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Sacred Aura Blog",
          url: "https://sacredaura.com/blog",
        }}
      />
      <Navbar />
      <CartDrawer />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Sacred Knowledge</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-foreground">
              The <span className="text-gradient-primary">Blog</span>
            </h1>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group card-hover"
                >
                  <Link to={`/blog/${post.slug}`}>
                    {post.cover_image && (
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 border-glow">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span className="font-body text-xs">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                        </span>
                        {post.category && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs">{post.category}</span>
                        )}
                      </div>
                      <h2 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
                      {post.excerpt && (
                        <p className="font-body text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 font-body text-sm text-primary">
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-foreground mb-2">No articles yet</p>
              <p className="font-body text-muted-foreground">Check back soon for spiritual insights</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
