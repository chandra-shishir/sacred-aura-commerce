import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: { product_id: string; rating: number; title?: string; content?: string }) => {
      if (!user) throw new Error("Please sign in to leave a review");
      const { data, error } = await supabase
        .from("reviews")
        .insert({ ...review, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
      toast.success("Review submitted! ✨");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
