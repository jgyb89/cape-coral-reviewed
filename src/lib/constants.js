import categoriesData from "./categories-data.json";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://capecoralreviewed.com";

// Dynamically generate directory types from navigation data
export const DIRECTORY_TYPES = categoriesData.map((cat) => ({
  name: cat.title,
  slug: cat.slug,
}));

// Dynamically flatten the navigation data into the ALL_CATEGORIES array shape
export const ALL_CATEGORIES = categoriesData.flatMap((cat) => {
  const parent = {
    name: cat.title,
    slug: cat.slug,
    directoryType: cat.slug,
    isParent: true,
  };
  
  const children = cat.subs.map((sub) => ({
    name: sub.name,
    slug: sub.slug,
    parentSlug: cat.slug,
  }));
  
  return [parent, ...children];
});

export function getLocalizedUrl(path, locale) {
  if (locale === 'es') {
    if (path.startsWith('/es/') || path === '/es') return path;
    return `/es${path.startsWith('/') ? '' : '/'}${path}`;
  }
  return path;
}

export function getCategoryRoute(categoryOrSlug, explicitParentSlug = null) {
  if (!categoryOrSlug) return "/directory";

  const rawSlug =
    typeof categoryOrSlug === "string" ? categoryOrSlug : categoryOrSlug?.slug;
  if (!rawSlug || rawSlug === "all") return "/directory";

  const cleanSlug = rawSlug.replace(/-(en|es)$/, "");

  const rawParentSlug =
    explicitParentSlug ||
    (typeof categoryOrSlug === "object"
      ? categoryOrSlug?.parent?.node?.slug || categoryOrSlug?.parentSlug
      : null);
  const cleanParentSlug = rawParentSlug
    ? rawParentSlug.replace(/-(en|es)$/, "")
    : null;

  // 1. Check local ALL_CATEGORIES match
  const matched = ALL_CATEGORIES.find(
    (c) => c.slug === cleanSlug || c.slug === rawSlug,
  );

  if (matched) {
    if (matched.isParent || matched.directoryType === matched.slug) {
      return `/directory/${matched.slug}`;
    }
    if (matched.parentSlug) {
      return `/directory/${matched.parentSlug}/${matched.slug}`;
    }
  }

  // 2. If parent was provided (e.g. from GraphQL parent node or argument)
  if (cleanParentSlug) {
    return `/directory/${cleanParentSlug}/${cleanSlug}`;
  }

  // 3. Check if cleanSlug is a parent directory type
  const isParentType = DIRECTORY_TYPES.some(
    (dt) => dt.slug === cleanSlug || dt.slug === rawSlug,
  );
  if (isParentType) {
    return `/directory/${cleanSlug}`;
  }

  return "/directory";
}
