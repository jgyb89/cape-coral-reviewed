import { BASE_URL } from "@/lib/constants";

export function formatImageUrl(sourceUrl) {
  if (!sourceUrl) return "/placeholder-image.jpg";

  const stagingDomain = "https://staging.capecoralreviewed.com";
  const productionDomain = BASE_URL;

  // Prevent staging URLs from leaking into the production build
  if (sourceUrl.includes(stagingDomain)) {
    return sourceUrl.replace(stagingDomain, productionDomain);
  }

  // Return the live URL untouched
  return sourceUrl;
}
