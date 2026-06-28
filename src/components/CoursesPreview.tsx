import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, Star, GraduationCap } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";
import courseReiki from "@/assets/course-reiki.jpg";

const CoursesPreview = () => {
  const { data: courses, isLoading } = useFeaturedCourses();

  if (isLoading) return null;

  return (
    <section className="py-24 md:py-32 gradient-section relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-glow/5 blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Learn & Transform
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
            Spiritual <span className="text-gradient-primary">Courses</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Master Reiki, crystal healing, and meditation with our certified online courses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses?.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass rounded-2xl overflow-hidden border-glow card-hover group"
            >
              <div className="aspect-video overflow-hidden bg-secondary">
                <img
                  src={course.image_url || courseReiki}
                  alt={course.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs text-primary">
                    {course.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary font-body text-xs text-muted-foreground">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">{course.title}</h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4">{course.subtitle}</p>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span className="font-body text-xs">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span className="font-body text-xs">{course.enrollment_count?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-gold text-gold" />
                    <span className="font-body text-xs">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-medium text-gradient-primary">
                      ₹{course.price}
                    </span>
                    {course.mrp && (
                      <span className="font-body text-sm text-muted-foreground line-through">
                        ₹{course.mrp}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 font-body text-xs tracking-wider text-primary hover:text-foreground transition-colors"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-purple-bright/30 font-body text-sm tracking-widest uppercase text-foreground hover:bg-secondary transition-colors"
          >
            <GraduationCap size={18} />
            View All Courses
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesPreview;
