import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBlogPosts = (limit?: number) => {
  return useQuery({
    queryKey: ["blog-posts", limit],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
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
