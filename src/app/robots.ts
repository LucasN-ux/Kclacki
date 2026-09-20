import type { MetadataRoute } from "next";
import { SITE_URL } from "@/domain/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Result and favorites pages hold nothing but the visitor's own choices.
      disallow: ["/en/search", "/fr/search", "/en/favorites", "/fr/favorites"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
