import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBlogPost } from "@/hooks/useBlog";
import SEO, { absoluteUrl } from "@/components/SEO";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-display text-3xl text-foreground mb-4">Post not found</p>
            <Link to="/blog" className="text-primary font-body text-sm">← Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.cover_image ? [absoluteUrl(post.cover_image)] : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: { "@type": "Organization", name: "Sacred Aura" },
    publisher: {
      "@type": "Organization",
      name: "Sacred Aura",
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.ico") },
    },
    description: post.excerpt || post.seo_description || post.title,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || post.title}
        canonical={`/blog/${post.slug}`}
        type="article"
        image={post.cover_image || undefined}
        jsonLd={articleJsonLd}
      />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {post.cover_image && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 border-glow">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4 text-muted-foreground">
              <Calendar size={14} />
              <span className="font-body text-xs">
                {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
              </span>
              {post.category && (
                <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs">{post.category}</span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl text-foreground mb-6">{post.title}</h1>

            <div
              className="prose prose-invert max-w-none font-body text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h3]:font-display [&_h3]:text-foreground [&_a]:text-primary [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-secondary font-body text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
