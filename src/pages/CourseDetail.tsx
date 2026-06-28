import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Star, CheckCircle, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourse } from "@/hooks/useCourses";
import courseReiki from "@/assets/course-reiki.jpg";
import SEO, { absoluteUrl } from "@/components/SEO";

interface CourseModule {
  title: string;
  lessons: number;
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(slug || "");

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

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-display text-3xl text-foreground mb-4">Course not found</p>
            <Link to="/courses" className="text-primary font-body text-sm">← Back to Courses</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const modules = (course.modules as unknown as CourseModule[]) || [];
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons || 0), 0);
  const discount = course.mrp ? Math.round(((course.mrp - course.price) / course.mrp) * 100) : 0;

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description || course.subtitle || course.title,
    provider: {
      "@type": "Organization",
      name: "Sacred Aura",
      sameAs: "https://sacredaura.com",
    },
    image: course.image_url ? absoluteUrl(course.image_url) : undefined,
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Courses", item: absoluteUrl("/courses") },
      { "@type": "ListItem", position: 3, name: course.title, item: absoluteUrl(`/courses/${course.slug}`) },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={course.seo_title || `${course.title} — Spiritual Course`}
        description={course.seo_description || course.subtitle || course.description?.slice(0, 155) || course.title}
        canonical={`/courses/${course.slug}`}
        type="article"
        image={course.image_url || undefined}
        jsonLd={[courseJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />

      <section className="pt-24 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-bright/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={16} /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-secondary font-body text-xs text-primary">{course.category}</span>
                <span className="px-3 py-1 rounded-full bg-secondary font-body text-xs text-muted-foreground">{course.level}</span>
                {discount > 0 && (
                  <span className="px-3 py-1 rounded-full gradient-purple font-body text-xs text-primary-foreground">{discount}% OFF</span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-3">{course.title}</h1>
              <p className="font-body text-lg text-muted-foreground mb-4">{course.subtitle}</p>
              {course.instructor && (
                <p className="font-body text-sm text-primary mb-6">Taught by {course.instructor}</p>
              )}

              <div className="flex items-center gap-6 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2"><Clock size={16} /><span className="font-body text-sm">{course.duration}</span></div>
                <div className="flex items-center gap-2"><Users size={16} /><span className="font-body text-sm">{course.enrollment_count?.toLocaleString()} enrolled</span></div>
                <div className="flex items-center gap-2"><Star size={16} className="fill-gold text-gold" /><span className="font-body text-sm">{course.rating} ({course.reviews_count} reviews)</span></div>
                <div className="flex items-center gap-2"><BookOpen size={16} /><span className="font-body text-sm">{totalLessons} lessons</span></div>
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display text-4xl font-medium text-gradient-primary">₹{course.price}</span>
                {course.mrp && <span className="font-body text-xl text-muted-foreground line-through">₹{course.mrp}</span>}
              </div>

              <button onClick={() => navigate(`/course-checkout/${course.slug}`)} className="px-10 py-4 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple">
                Enroll Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-purple-bright/10 blur-2xl pointer-events-none" />
              <img
                src={course.image_url || courseReiki}
                alt={course.title}
                className="relative rounded-3xl w-full aspect-video object-cover border-glow"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="font-display text-2xl text-foreground mb-4">About This Course</h2>
                <p className="font-body text-muted-foreground leading-relaxed">{course.description}</p>
              </div>

              {course.benefits && (course.benefits as string[]).length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-foreground mb-4">What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(course.benefits as string[]).map((b) => (
                      <div key={b} className="flex items-start gap-3 glass rounded-xl p-4 border-glow">
                        <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modules.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-foreground mb-4">Course Curriculum</h2>
                  <div className="space-y-3">
                    {modules.map((mod, i) => (
                      <div key={i} className="glass rounded-xl p-5 border-glow flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center font-body text-xs text-primary-foreground font-medium">
                            {i + 1}
                          </span>
                          <span className="font-display text-base text-foreground">{mod.title}</span>
                        </div>
                        <span className="font-body text-xs text-muted-foreground">{mod.lessons} lessons</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="glass rounded-2xl p-6 border-glow sticky top-28">
                <h3 className="font-display text-lg font-medium text-foreground mb-4">Course Includes</h3>
                <ul className="space-y-3 font-body text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><BookOpen size={14} className="text-primary" /> {totalLessons} video lessons</li>
                  <li className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {course.duration} of content</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" /> Certificate of completion</li>
                  <li className="flex items-center gap-2"><Users size={14} className="text-primary" /> Community access</li>
                  <li className="flex items-center gap-2"><Star size={14} className="text-primary" /> Lifetime access</li>
                </ul>
                <button onClick={() => navigate(`/course-checkout/${course.slug}`)} className="w-full mt-6 py-3 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple">
                  Enroll Now — ₹{course.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
