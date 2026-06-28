import { Helmet } from "react-helmet-async";

const SITE_NAME = "Sacred Aura";
const DEFAULT_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";
const FALLBACK_ORIGIN = "https://sacredaura.com";

export const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return FALLBACK_ORIGIN;
};

export const absoluteUrl = (path: string = "") => {
  if (!path) return getSiteOrigin();
  if (/^https?:\/\//i.test(path)) return path;
  const origin = getSiteOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

interface SEOProps {
  title: string;
  description: string;
  /** Path like "/shop" or full URL. Defaults to current path. */
  canonical?: string;
  image?: string;
  /** og:type — website, article, product, profile */
  type?: string;
  /** Single JSON-LD object or array of objects */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const path =
    canonical ??
    (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  const canonicalUrl = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
