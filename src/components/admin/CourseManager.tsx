import { useState } from "react";
import { Plus, Trash2, Save, X, ChevronDown, Megaphone, FileUp, Video as VideoIcon } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import {
  useCourseCurriculum,
  useUpsertModule,
  useDeleteModule,
  useUpsertLesson,
  useDeleteLesson,
  useAnnouncements,
  useCreateAnnouncement,
} from "@/hooks/useCourseContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const inputClass =
  "px-3 py-2 rounded-lg bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-full";

const CourseManager = () => {
  const { data: courses } = useCourses();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const courseId = activeCourseId || courses?.[0]?.id || null;
  const activeCourse = courses?.find((c) => c.id === courseId);

  const { data: modules } = useCourseCurriculum(courseId || undefined);
  const { data: announcements } = useAnnouncements(courseId || undefined);

  const upsertModule = useUpsertModule();
  const deleteModule = useDeleteModule();
  const upsertLesson = useUpsertLesson();
  const deleteLesson = useDeleteLesson();
  const createAnnouncement = useCreateAnnouncement();

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [annoTitle, setAnnoTitle] = useState("");
  const [annoBody, setAnnoBody] = useState("");
  const [annoPinned, setAnnoPinned] = useState(false);
  const [uploading, setUploading] = useState<"video" | "pdf" | null>(null);

  const addModule = async () => {
    if (!courseId || !newModuleTitle.trim()) return;
    const pos = (modules?.length || 0);
    await upsertModule.mutateAsync({ course_id: courseId, title: newModuleTitle, position: pos });
    setNewModuleTitle("");
    toast.success("Module added");
  };

  const saveLesson = async () => {
    if (!editingLesson?.module_id || !editingLesson.title) return;
    await upsertLesson.mutateAsync(editingLesson);
    setEditingLesson(null);
    toast.success("Lesson saved");
  };

  const uploadFile = async (file: File, bucket: "course-videos" | "course-resources") => {
    setUploading(bucket === "course-videos" ? "video" : "pdf");
    const path = `${courseId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      setUploading(null);
      toast.error(error.message);
      return null;
    }
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    setUploading(null);
    return data?.signedUrl || null;
  };

  const postAnnouncement = async () => {
    if (!courseId || !annoTitle.trim() || !annoBody.trim()) return;
    await createAnnouncement.mutateAsync({
      course_id: courseId,
      title: annoTitle,
      body: annoBody,
      pinned: annoPinned,
    });
    setAnnoTitle("");
    setAnnoBody("");
    setAnnoPinned(false);
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground mb-6">Course Manager</h1>

      <div className="mb-6">
        <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Active Course
        </label>
        <select
          value={courseId || ""}
          onChange={(e) => setActiveCourseId(e.target.value)}
          className={inputClass + " max-w-md"}
        >
          {(courses || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {!courseId ? (
        <p className="font-body text-muted-foreground">Create a course first to manage its curriculum.</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* Curriculum */}
          <div className="glass rounded-2xl border-glow p-5">
            <h2 className="font-display text-lg text-foreground mb-4">Curriculum — {activeCourse?.title}</h2>

            <div className="flex gap-2 mb-5">
              <input
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="New module title"
                className={inputClass}
              />
              <button
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple shrink-0"
              >
                <Plus size={16} /> Add Module
              </button>
            </div>

            {(modules || []).length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No modules yet.</p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {(modules || []).map((m) => (
                  <AccordionItem key={m.id} value={m.id} className="border-border/30">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span className="font-display text-sm text-foreground">{m.title}</span>
                        <span className="font-body text-xs text-muted-foreground">
                          {m.course_lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 mb-3">
                        {m.course_lessons.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between gap-3 px-3 py-2 bg-secondary/40 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm text-foreground truncate">{l.title}</p>
                              <p className="font-body text-xs text-muted-foreground">
                                {l.video_url ? "🎬 video" : ""} {l.pdf_url ? " · 📄 pdf" : ""}{" "}
                                {l.live_class_url ? " · 🔴 live" : ""}
                              </p>
                            </div>
                            <button
                              onClick={() => setEditingLesson(l)}
                              className="text-primary text-xs font-body"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete lesson?")) deleteLesson.mutate(l.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingLesson({
                              module_id: m.id,
                              title: "",
                              position: m.course_lessons.length,
                              is_preview: false,
                            })
                          }
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-foreground font-body text-xs"
                        >
                          <Plus size={12} /> Add Lesson
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this module and all its lessons?"))
                              deleteModule.mutate(m.id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive font-body text-xs"
                        >
                          <Trash2 size={12} /> Delete Module
                        </button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Lesson Editor */}
            {editingLesson && (
              <div className="mt-6 p-5 rounded-xl border border-primary/40 bg-background">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-md text-foreground">
                    {editingLesson.id ? "Edit Lesson" : "New Lesson"}
                  </h3>
                  <button onClick={() => setEditingLesson(null)}>
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Title"
                    value={editingLesson.title || ""}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    className={inputClass + " md:col-span-2"}
                  />
                  <textarea
                    placeholder="Description"
                    value={editingLesson.description || ""}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, description: e.target.value })
                    }
                    className={inputClass + " md:col-span-2"}
                    rows={2}
                  />
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-muted-foreground flex items-center gap-2 mb-1">
                      <VideoIcon size={12} /> Video
                    </label>
                    <div className="flex gap-2">
                      <input
                        placeholder="Video URL"
                        value={editingLesson.video_url || ""}
                        onChange={(e) =>
                          setEditingLesson({ ...editingLesson, video_url: e.target.value })
                        }
                        className={inputClass}
                      />
                      <label className="px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-xs cursor-pointer shrink-0 hover:bg-secondary/80">
                        <FileUp size={14} className="inline mr-1" />
                        {uploading === "video" ? "..." : "Upload"}
                        <input
                          type="file"
                          accept="video/*"
                          hidden
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const url = await uploadFile(f, "course-videos");
                            if (url) setEditingLesson({ ...editingLesson, video_url: url });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-body text-xs text-muted-foreground flex items-center gap-2 mb-1">
                      📄 PDF Resource
                    </label>
                    <div className="flex gap-2">
                      <input
                        placeholder="PDF URL"
                        value={editingLesson.pdf_url || ""}
                        onChange={(e) =>
                          setEditingLesson({ ...editingLesson, pdf_url: e.target.value })
                        }
                        className={inputClass}
                      />
                      <label className="px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-xs cursor-pointer shrink-0 hover:bg-secondary/80">
                        <FileUp size={14} className="inline mr-1" />
                        {uploading === "pdf" ? "..." : "Upload"}
                        <input
                          type="file"
                          accept="application/pdf"
                          hidden
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const url = await uploadFile(f, "course-resources");
                            if (url) setEditingLesson({ ...editingLesson, pdf_url: url });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <input
                    placeholder="Live Class URL (Zoom/Meet)"
                    value={editingLesson.live_class_url || ""}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, live_class_url: e.target.value })
                    }
                    className={inputClass + " md:col-span-2"}
                  />
                  <input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={editingLesson.duration_seconds || ""}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        duration_seconds: parseInt(e.target.value) || null,
                      })
                    }
                    className={inputClass}
                  />
                  <input
                    type="number"
                    placeholder="Position"
                    value={editingLesson.position ?? 0}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, position: parseInt(e.target.value) || 0 })
                    }
                    className={inputClass}
                  />
                  <label className="flex items-center gap-2 md:col-span-2 text-sm text-foreground font-body">
                    <input
                      type="checkbox"
                      checked={!!editingLesson.is_preview}
                      onChange={(e) =>
                        setEditingLesson({ ...editingLesson, is_preview: e.target.checked })
                      }
                    />
                    Free preview lesson
                  </label>
                </div>
                <button
                  onClick={saveLesson}
                  disabled={upsertLesson.isPending}
                  className="mt-4 flex items-center gap-2 px-5 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple"
                >
                  <Save size={14} /> {upsertLesson.isPending ? "Saving..." : "Save Lesson"}
                </button>
              </div>
            )}
          </div>

          {/* Bulletin board admin */}
          <div className="glass rounded-2xl border-glow p-5 h-fit">
            <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
              <Megaphone size={18} className="text-primary" /> Student Bulletin Board
            </h2>
            <div className="space-y-3 mb-4">
              <input
                placeholder="Announcement title"
                value={annoTitle}
                onChange={(e) => setAnnoTitle(e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder="What's new?"
                value={annoBody}
                onChange={(e) => setAnnoBody(e.target.value)}
                className={inputClass}
                rows={4}
              />
              <label className="flex items-center gap-2 text-sm text-foreground font-body">
                <input
                  type="checkbox"
                  checked={annoPinned}
                  onChange={(e) => setAnnoPinned(e.target.checked)}
                />
                Pin to top
              </label>
              <button
                onClick={postAnnouncement}
                disabled={createAnnouncement.isPending}
                className="w-full px-4 py-2 rounded-xl gradient-purple text-primary-foreground font-body text-sm glow-purple"
              >
                {createAnnouncement.isPending ? "Posting..." : "Post Announcement"}
              </button>
            </div>

            <div className="space-y-2 mt-5 border-t border-border/40 pt-4">
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Recent ({announcements?.length || 0})
              </p>
              {(announcements || []).slice(0, 5).map((a) => (
                <div key={a.id} className="p-3 bg-secondary/40 rounded-lg">
                  <p className="font-body text-sm text-foreground">{a.title}</p>
                  <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-1">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
