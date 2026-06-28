import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  mrp: number | null;
  discount_percent: number | null;
  currency: string;
  category: string;
  category_id: string | null;
  slug: string | null;
  image_url: string | null;
  images: string[] | null;
  rating: number | null;
  reviews_count: number | null;
  badge: string | null;
  benefits: string[] | null;
  spiritual_meaning: string | null;
  stock: number | null;
  is_active: boolean | null;
  specifications: Record<string, string> | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = (filters?: {
  category?: string;
  search?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  crystalType?: string | null;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters?.crystalType) {
        query = query.eq("crystal_type", filters.crystalType);
      }

      switch (filters?.sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "popular":
          query = query.order("reviews_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DbProduct[];
    },
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as DbProduct;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

import { searchProducts } from "@/lib/search";

export const useProductSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["product-search", searchTerm],
    queryFn: () => searchProducts(searchTerm, 8),
    enabled: searchTerm.length >= 2,
  });
};

export const useCrystalTypes = () => {
  return useQuery({
    queryKey: ["crystal-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("crystal_type")
        .not("crystal_type", "is", null);
      if (error) throw error;
      const set = new Set<string>();
      (data || []).forEach((r: any) => r.crystal_type && set.add(r.crystal_type));
      return Array.from(set).sort();
    },
  });
};
