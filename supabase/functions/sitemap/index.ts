// Public dynamic sitemap.xml
// Queries products, blog_posts (published), courses (published) and emits XML.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_ORIGIN = Deno.env.get("SITE_ORIGIN") ?? "https://sacredaura.com";

const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
];

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!),
  );

const urlEntry = (
  path: string,
  lastmod?: string | null,
  changefreq = "weekly",
  priority = "0.7",
) => `  <url>
    <loc>${escapeXml(SITE_ORIGIN + path)}</loc>${
      lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const [productsRes, postsRes, coursesRes] = await Promise.all([
      supabase
        .from("products")
        .select("id, slug, updated_at")
        .eq("is_active", true)
        .limit(5000),
      supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("is_published", true)
        .limit(5000),
      supabase
        .from("courses")
        .select("slug, updated_at")
        .eq("is_published", true)
        .limit(5000),
    ]);

    const urls: string[] = STATIC_ROUTES.map((r) =>
      urlEntry(r.path, null, r.changefreq, r.priority),
    );

    for (const p of productsRes.data ?? []) {
      const slug = p.slug || p.id;
      urls.push(urlEntry(`/product/${slug}`, p.updated_at, "weekly", "0.8"));
    }
    for (const post of postsRes.data ?? []) {
      urls.push(urlEntry(`/blog/${post.slug}`, post.updated_at, "monthly", "0.7"));
    }
    for (const c of coursesRes.data ?? []) {
      urls.push(urlEntry(`/courses/${c.slug}`, c.updated_at, "monthly", "0.8"));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("sitemap error", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${String(err)}</error>`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
