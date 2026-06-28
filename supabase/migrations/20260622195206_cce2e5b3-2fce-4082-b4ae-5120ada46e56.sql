
-- Task 2/3: crystal_type column for filtering
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS crystal_type TEXT;
CREATE INDEX IF NOT EXISTS idx_products_crystal_type ON public.products(crystal_type);

-- Task 2/3: Dowsing top-level category
INSERT INTO public.categories (name, slug, parent_id, description, sort_order, is_active)
VALUES ('Dowsing', 'dowsing', NULL, 'Dowsing tools, rods, tensor rings & energy harmonizers', 51, true)
ON CONFLICT (slug) DO NOTHING;
