// Unified product search that prefers Algolia when configured,
// and falls back to Supabase ilike search otherwise.
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { supabase } from "@/integrations/supabase/client";

export interface SearchHit {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
}

const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID as string | undefined;
const SEARCH_KEY = import.meta.env.VITE_ALGOLIA_PUBLIC_API_KEY as string | undefined;
const INDEX_NAME =
  (import.meta.env.VITE_ALGOLIA_INDEX_NAME as string | undefined) || "products";

export const isAlgoliaEnabled = Boolean(APP_ID && SEARCH_KEY);

const algoliaClient = isAlgoliaEnabled
  ? algoliasearch(APP_ID as string, SEARCH_KEY as string)
  : null;

export async function searchProducts(query: string, limit = 8): Promise<SearchHit[]> {
  if (!query || query.trim().length < 2) return [];

  if (algoliaClient) {
    try {
      const res = await algoliaClient.search({
        requests: [
          {
            indexName: INDEX_NAME,
            query,
            hitsPerPage: limit,
          },
        ],
      });
      const hits = (res.results[0] as any)?.hits || [];
      return hits.map((h: any) => ({
        id: h.objectID || h.id,
        name: h.name,
        slug: h.slug ?? null,
        price: Number(h.price ?? 0),
        currency: h.currency ?? "₹",
        category: h.category ?? "",
        image_url: h.image_url ?? null,
      }));
    } catch (e) {
      console.warn("Algolia search failed, falling back to DB", e);
    }
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, currency, image_url, category")
    .eq("is_active", true)
    .ilike("name", `%${query}%`)
    .limit(limit);
  if (error) throw error;
  return (data || []) as SearchHit[];
}
