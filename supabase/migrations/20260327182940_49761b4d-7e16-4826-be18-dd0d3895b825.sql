
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Bracelets', 'bracelets', 'Healing crystal bracelets for chakra alignment', 1),
  ('Pendants', 'pendants', 'Crystal pendants and necklaces', 2),
  ('Malas', 'malas', 'Meditation malas and prayer beads', 3),
  ('Healing Stones', 'healing-stones', 'Natural healing crystals and stones', 4),
  ('Chakra Products', 'chakra-products', 'Products for chakra balancing', 5),
  ('Rudraksha', 'rudraksha', 'Authentic rudraksha beads and jewelry', 6),
  ('Feng Shui', 'feng-shui', 'Feng shui crystals and decor', 7),
  ('Evil Eye', 'evil-eye', 'Evil eye protection jewelry', 8),
  ('Jewelry', 'jewelry', 'Crystal rings, earrings and fine jewelry', 9),
  ('Crystals', 'crystals', 'Raw and polished crystals', 10)
