import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";

const BlogPreview = () => {
  const { data: posts, isLoading } = useBlogPosts(3);

  if (isLoading || !posts?.length) return null;

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 gradient-purple-radial pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Sacred Journal
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
              Latest from the <span className="text-gradient-primary">Blog</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-sm tracking-wider text-primary hover:text-foreground transition-colors mt-4 md:mt-0"
          >
            View All Articles <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="rounded-2xl overflow-hidden aspect-[16/10] mb-5 border-glow bg-secondary">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full gradient-purple-subtle flex items-center justify-center">
                      <span className="font-display text-3xl text-muted-foreground/30">✧</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={12} className="text-muted-foreground" />
                  <span className="font-body text-xs text-muted-foreground">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                  </span>
                  {post.category && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs text-primary">
                      {post.category}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-medium text-foreground group-hover:text-gradient-primary transition-all mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
