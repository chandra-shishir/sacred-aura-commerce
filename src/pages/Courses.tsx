import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Users, Star, GraduationCap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCourses } from "@/hooks/useCourses";
import courseReiki from "@/assets/course-reiki.jpg";
import SEO from "@/components/SEO";

const Courses = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Spiritual Courses — Reiki, Crystal Healing & Tarot Certification"
        description="Master Reiki, crystal healing, tarot, numerology, and meditation with certified online courses taught by world-class spiritual teachers. Lifetime access."
        canonical="/courses"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Sacred Aura Spiritual Courses",
          itemListElement: (courses || []).slice(0, 30).map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${typeof window !== "undefined" ? window.location.origin : "https://sacredaura.com"}/courses/${c.slug}`,
            name: c.title,
          })),
        }}
      />
      <Navbar />
      <CartDrawer />

      <section className="pt-28 pb-16 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-bright/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-glow/8 blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <GraduationCap size={48} className="mx-auto text-primary mb-6" />
            <h1 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
              Spiritual <span className="text-gradient-primary">Courses</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your practice with certified Reiki, crystal healing, and meditation courses taught by world-class spiritual teachers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses?.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl overflow-hidden border-glow card-hover group"
                >
                  <div className="aspect-video overflow-hidden bg-secondary relative">
                    <img
                      src={course.image_url || courseReiki}
                      alt={course.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {course.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-body tracking-wider uppercase gradient-purple text-primary-foreground">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs text-primary">{course.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs text-muted-foreground">{course.level}</span>
                    </div>
                    <h3 className="font-display text-xl font-medium text-foreground mb-1">{course.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-1">{course.subtitle}</p>
                    {course.instructor && (
                      <p className="font-body text-xs text-primary mb-4">by {course.instructor}</p>
                    )}
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1"><Clock size={14} /><span className="font-body text-xs">{course.duration}</span></div>
                      <div className="flex items-center gap-1"><Users size={14} /><span className="font-body text-xs">{course.enrollment_count?.toLocaleString()} students</span></div>
                      <div className="flex items-center gap-1"><Star size={14} className="fill-gold text-gold" /><span className="font-body text-xs">{course.rating}</span></div>
                    </div>
                    {course.benefits && (
                      <ul className="mb-4 space-y-1">
                        {(course.benefits as string[]).slice(0, 3).map((b) => (
                          <li key={b} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-medium text-gradient-primary">₹{course.price}</span>
                        {course.mrp && <span className="font-body text-sm text-muted-foreground line-through">₹{course.mrp}</span>}
                      </div>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full gradient-purple text-primary-foreground font-body text-xs tracking-wider hover:opacity-90 transition-opacity"
                      >
                        Enroll <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
