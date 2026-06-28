import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean | null;
  created_at: string;
  user_id: string;
}

interface Props {
  productId: string;
}

const ProductReviews = ({ productId }: Props) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to leave a review.");
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title: title || null,
        content: content || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review submitted — thank you ✦");
      setTitle("");
      setContent("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (e: any) => toast.error(e.message || "Could not submit review"),
  });

  const avg =
    reviews && reviews.length
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-20">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-3xl font-light text-foreground">
          Devotee <span className="text-gradient-primary">Reviews</span>
        </h2>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star size={16} className="fill-purple-bright text-purple-bright" />
            <span className="font-body text-sm">
              {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Write form */}
        <div className="glass rounded-2xl p-6 border-glow lg:col-span-1 h-fit">
          <h3 className="font-display text-xl text-foreground mb-4">Share your experience</h3>
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit.mutate();
              }}
              className="space-y-4"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${n} star`}
                  >
                    <Star
                      size={22}
                      className={
                        n <= rating
                          ? "fill-purple-bright text-purple-bright"
                          : "text-border"
                      }
                    />
                  </button>
                ))}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full bg-background/40 border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your experience with this sacred item…"
                rows={4}
                className="w-full bg-background/40 border border-border rounded-lg px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-primary resize-none"
              />
              <button
                type="submit"
                disabled={submit.isPending}
                className="w-full py-3 rounded-full gradient-purple text-primary-foreground font-body text-xs tracking-widest uppercase hover:opacity-90 transition-opacity glow-purple disabled:opacity-60"
              >
                {submit.isPending ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="font-body text-sm text-muted-foreground">
              Please <a href="/auth" className="text-primary underline">sign in</a> to leave a review.
            </p>
          )}
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading && (
            <p className="font-body text-sm text-muted-foreground">Loading reviews…</p>
          )}
          {reviews && reviews.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="font-body text-muted-foreground">
                Be the first to share your experience with this sacred piece.
              </p>
            </div>
          )}
          {reviews?.map((r) => (
            <div key={r.id} className="glass rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={14}
                      className={
                        n <= r.rating
                          ? "fill-purple-bright text-purple-bright"
                          : "text-border"
                      }
                    />
                  ))}
                </div>
                <span className="font-body text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {r.title && (
                <h4 className="font-display text-lg text-foreground mb-1">{r.title}</h4>
              )}
              {r.content && (
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {r.content}
                </p>
              )}
              {r.is_verified_purchase && (
                <p className="mt-2 font-body text-[10px] tracking-widest uppercase text-primary">
                  ✓ Verified Purchase
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
