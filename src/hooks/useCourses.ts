import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCourse = (slug: string) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("rating", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });
};
