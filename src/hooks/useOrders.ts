import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      items: { product_id: string; product_name: string; price: number; quantity: number }[];
      subtotal: number;
      shipping_cost: number;
      tax: number;
      total: number;
      shipping_address: Record<string, string>;
      guest_email?: string;
      currency?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          guest_email: orderData.guest_email || null,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shipping_cost,
          tax: orderData.tax,
          total: orderData.total,
          shipping_address: orderData.shipping_address,
          currency: orderData.currency || "INR",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully! ✨");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
    },
  });
};

export const useCoupon = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error) throw new Error("Invalid coupon code");

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error("Coupon has expired");
      }
      if (data.max_uses && (data.used_count ?? 0) >= data.max_uses) {
        throw new Error("Coupon usage limit reached");
      }

      return data;
    },
  });
};
