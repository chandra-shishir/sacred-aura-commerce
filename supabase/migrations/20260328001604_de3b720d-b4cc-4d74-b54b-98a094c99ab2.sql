-- Create courses table
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text,
  description text,
  instructor text,
  duration text,
  level text DEFAULT 'Beginner',
  price numeric NOT NULL DEFAULT 0,
  mrp numeric,
  currency text NOT NULL DEFAULT '$',
  image_url text,
  category text DEFAULT 'Reiki',
  modules jsonb DEFAULT '[]'::jsonb,
  benefits text[] DEFAULT '{}'::text[],
  is_published boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  enrollment_count integer DEFAULT 0,
  rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses viewable by everyone" ON public.courses FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();