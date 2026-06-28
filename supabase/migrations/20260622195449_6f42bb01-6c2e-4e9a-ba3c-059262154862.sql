
-- Allow authenticated users to read; admins to write to course buckets
CREATE POLICY "Authenticated read course content" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('course-videos','course-resources','course-thumbnails'));

CREATE POLICY "Admins write course content" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('course-videos','course-resources','course-thumbnails') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update course content" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('course-videos','course-resources','course-thumbnails') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete course content" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('course-videos','course-resources','course-thumbnails') AND public.has_role(auth.uid(), 'admin'));
