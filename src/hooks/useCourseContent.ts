import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  summary: string | null;
  position: number;
}
export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  live_class_url: string | null;
  duration_seconds: number | null;
  position: number;
  is_preview: boolean;
}
export interface CourseAnnouncement {
  id: string;
  course_id: string;
  author_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

export const useCourseCurriculum = (courseId?: string) => {
  return useQuery({
    queryKey: ["curriculum", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data: modules, error } = await supabase
        .from("course_modules")
        .select("*, course_lessons(*)")
        .eq("course_id", courseId!)
        .order("position");
      if (error) throw error;
      // Sort lessons too
      const sorted = (modules || []).map((m: any) => ({
        ...m,
        course_lessons: (m.course_lessons || []).sort(
          (a: any, b: any) => a.position - b.position
        ),
      }));
      return sorted as (CourseModule & { course_lessons: CourseLesson[] })[];
    },
  });
};

export const useEnrollment = (courseId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    enabled: !!courseId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("course_id", courseId!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useEnroll = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("Sign in required");
      const { data, error } = await supabase
        .from("course_enrollments")
        .upsert(
          { user_id: user.id, course_id: courseId, status: "active" },
          { onConflict: "user_id,course_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollment"] });
      qc.invalidateQueries({ queryKey: ["my-enrollments"] });
    },
  });
};

export const useLessonProgress = (courseId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["lesson-progress", courseId, user?.id],
    enabled: !!user && !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, watch_seconds");
      if (error) throw error;
      return data;
    },
  });
};

export const useMarkLessonComplete = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lesson-progress"] });
    },
  });
};

export const useAnnouncements = (courseId?: string) => {
  return useQuery({
    queryKey: ["announcements", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_announcements")
        .select("*")
        .eq("course_id", courseId!)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CourseAnnouncement[];
    },
  });
};

export const useCreateAnnouncement = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      course_id: string;
      title: string;
      body: string;
      pinned?: boolean;
    }) => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("course_announcements").insert({
        ...input,
        author_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement posted");
    },
    onError: (e: any) => toast.error(e.message),
  });
};

// Admin mutations
export const useUpsertModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: Partial<CourseModule> & { course_id: string; title: string }) => {
      const { error } = await supabase.from("course_modules").upsert(m as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["curriculum"] }),
  });
};
export const useDeleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["curriculum"] }),
  });
};
export const useUpsertLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (l: Partial<CourseLesson> & { module_id: string; title: string }) => {
      const { error } = await supabase.from("course_lessons").upsert(l as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["curriculum"] }),
  });
};
export const useDeleteLesson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["curriculum"] }),
  });
};
