import styles from "./page.module.css";
/* src/app/blog/page.js */
import { Suspense } from "react";
import PropTypes from "prop-types";
import BlogView from "@/components/blog/BlogView";
import { getBlogPosts } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import DOMPurify from "isomorphic-dompurify";
import { formatImageUrl } from "@/lib/formatImageUrl";
export const metadata = {
  title: "Cape Coral News & Reviews | Blog",
  description: "Explore the latest news, reviews, and featured businesses in Cape Coral."
};
export default async function BlogPage({
  params
}) {
  const {
    locale
  } = await params;
  const dict = await getDictionary(locale);
  const posts = await getBlogPosts();
  const t = dict?.blog || {};
  const formattedPosts = posts.map(node => ({
    id: node.databaseId,
    title: node.title,
    slug: node.slug,
    categories: node.categories.nodes.map(cat => cat.name),
    categorySlugs: node.categories.nodes.map(cat => cat.slug),
    imageUrl: formatImageUrl(node.featuredImage?.node?.sourceUrl),
    excerpt: node.excerpt ? DOMPurify.sanitize(node.excerpt, {
      ALLOWED_TAGS: []
    }) : ""
  }));
  return <main className="blog-page">
      <div className={styles["inline-style-1"]}>
        <h1 className={styles["inline-style-2"]}>
          {t.title || "Cape Coral News & Reviews"}
        </h1>
        <p className={styles["inline-style-3"]}>
          {t.subtitle || "Stay up to date with the latest happenings, business spotlights, and local guides in the Cape Coral community."}
        </p>
      </div>
      
      <Suspense fallback={<div className={styles["inline-style-4"]}>Loading posts...</div>}>
        <BlogView posts={formattedPosts} dict={dict} locale={locale} />
      </Suspense>
    </main>;
}
BlogPage.propTypes = {
  params: PropTypes.object.isRequired
};