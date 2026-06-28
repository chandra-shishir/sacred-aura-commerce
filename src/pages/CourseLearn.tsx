import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  Megaphone,
  Pin,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useCourse } from "@/hooks/useCourses";
import {
  useCourseCurriculum,
  useEnrollment,
  useLessonProgress,
  useMarkLessonComplete,
  useAnnouncements,
} from "@/hooks/useCourseContent";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formatDuration = (s?: number | null) => {
  if (!s) return "—";
  const m = Math.round(s / 60);
  return `${m} min`;
};

const CourseLearn = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourse(slug || "");
  const { data: modules } = useCourseCurriculum(course?.id);
  const { data: enrollment, isLoading: enrLoading } = useEnrollment(course?.id);
  const { data: progress } = useLessonProgress(course?.id);
  const { data: announcements } = useAnnouncements(course?.id);
  const markComplete = useMarkLessonComplete();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Realtime: refresh announcements on insert
  useEffect(() => {
    if (!course?.id) return;
    const channel = supabase
      .channel(`announcements:${course.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "course_announcements", filter: `course_id=eq.${course.id}` },
        () => {
          // Just refetch via invalidation hook side-effect — easiest: reload page query
          window.dispatchEvent(new CustomEvent("announcement-changed"));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [course?.id]);

  const allLessons = useMemo(
    () => (modules || []).flatMap((m) => m.course_lessons),
    [modules]
  );
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const completedIds = new Set((progress || []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));

  if (authLoading || courseLoading || enrLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" />;
  if (!course) return <Navigate to="/courses" />;

  const isEnrolled =
    !!enrollment &&
    enrollment.status === "active" &&
    (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date());

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-6 text-center max-w-xl">
          <Lock className="mx-auto mb-4 text-primary" size={36} />
          <h1 className="font-display text-3xl text-foreground mb-3">Enrollment required</h1>
          <p className="font-body text-muted-foreground mb-6">
            You're not yet enrolled in <span className="text-foreground">{course.title}</span>.
          </p>
          <Link
            to={`/course-checkout/${slug}`}
            className="inline-block px-6 py-3 rounded-full gradient-purple text-primary-foreground font-body text-sm tracking-widest uppercase glow-purple"
          >
            Enroll Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const canPlay = activeLesson && (activeLesson.video_url || activeLesson.is_preview);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`Learn — ${course.title}`} description={`Continue learning ${course.title}.`} canonical={`/courses/${slug}/learn`} noindex />
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Player + content */}
          <div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border-glow flex items-center justify-center">
              {activeLesson?.video_url ? (
                <video
                  key={activeLesson.id}
                  src={activeLesson.video_url}
                  controls
                  className="w-full h-full"
                  onEnded={() => activeLesson && markComplete.mutate(activeLesson.id)}
                />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Video className="mx-auto mb-3" size={32} />
                  <p className="font-body text-sm">
                    {activeLesson ? "No video for this lesson yet." : "Select a lesson to begin."}
                  </p>
                </div>
              )}
            </div>

            {activeLesson && (
              <div className="mt-5">
                <h1 className="font-display text-2xl text-foreground">{activeLesson.title}</h1>
                {activeLesson.description && (
                  <p className="font-body text-sm text-muted-foreground mt-2">{activeLesson.description}</p>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  {activeLesson.pdf_url && (
                    <a
                      href={activeLesson.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-border text-foreground font-body text-sm hover:bg-secondary transition-colors"
                    >
                      <FileText size={16} /> Download PDF
                    </a>
                  )}
                  {activeLesson.live_class_url && (
                    <a
                      href={activeLesson.live_class_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple"
                    >
                      <Video size={16} /> Join Live Class
                    </a>
                  )}
                  {!completedIds.has(activeLesson.id) && canPlay && (
                    <button
                      onClick={() => markComplete.mutate(activeLesson.id)}
                      disabled={markComplete.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground font-body text-sm hover:bg-secondary/80"
                    >
                      <CheckCircle2 size={16} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bulletin Board */}
            <section className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="text-primary" size={20} />
                <h2 className="font-display text-xl text-foreground">Student Bulletin Board</h2>
              </div>
              {(announcements || []).length === 0 ? (
                <p className="font-body text-sm text-muted-foreground glass rounded-xl p-5 border border-border/40">
                  No announcements yet. Check back later.
                </p>
              ) : (
                <div className="space-y-3">
                  {(announcements || []).map((a) => (
                    <article
                      key={a.id}
                      className="glass rounded-xl p-5 border-glow"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
                          {a.pinned && <Pin size={14} className="text-primary" />}
                          {a.title}
                        </h3>
                        <span className="font-body text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">
                        {a.body}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Curriculum sidebar */}
          <aside className="glass rounded-2xl p-4 border-glow h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-lg text-foreground mb-3 px-2">Curriculum</h3>
            {(modules || []).length === 0 ? (
              <p className="font-body text-sm text-muted-foreground px-2">No lessons published yet.</p>
            ) : (
              <Accordion
                type="multiple"
                defaultValue={(modules || []).map((m) => m.id)}
                className="w-full"
              >
                {(modules || []).map((m) => {
                  const total = m.course_lessons.length;
                  const done = m.course_lessons.filter((l) => completedIds.has(l.id)).length;
                  return (
                    <AccordionItem key={m.id} value={m.id} className="border-border/30">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="text-left flex-1">
                          <p className="font-display text-sm text-foreground">{m.title}</p>
                          <p className="font-body text-xs text-muted-foreground mt-0.5">
                            {done}/{total} complete
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {m.course_lessons.map((l) => {
                            const isActive = activeLesson?.id === l.id;
                            const isDone = completedIds.has(l.id);
                            return (
                              <button
                                key={l.id}
                                onClick={() => setActiveLessonId(l.id)}
                                className={`w-full text-left flex items-start gap-2 px-2 py-2 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-primary/15 text-foreground"
                                    : "hover:bg-secondary text-muted-foreground"
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                                ) : (
                                  <PlayCircle size={14} className="mt-0.5 shrink-0" />
                                )}
                                <span className="flex-1 font-body text-xs">
                                  {l.title}
                                  <span className="block text-[10px] text-muted-foreground/70 mt-0.5">
                                    {formatDuration(l.duration_seconds)}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseLearn;
