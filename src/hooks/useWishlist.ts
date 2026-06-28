import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useWishlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useToggleWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Please sign in to add to wishlist");

      const { data: existing } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase.from("wishlist").delete().eq("id", existing.id);
        if (error) throw error;
        return { action: "removed" };
      } else {
        const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(result.action === "added" ? "Added to wishlist ♥" : "Removed from wishlist");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
