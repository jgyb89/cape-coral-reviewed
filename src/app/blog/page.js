/* src/app/blog/page.js */
import BlogView from "@/components/blog/BlogView";
import { getBlogPosts } from "@/lib/actions";
import DOMPurify from "isomorphic-dompurify";

export const metadata = {
  title: "Cape Coral News & Reviews | Blog",
  description: "Explore the latest news, reviews, and featured businesses in Cape Coral.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const formattedPosts = posts.map(node => ({
    id: node.databaseId,
    title: node.title,
    slug: node.slug,
    categories: node.categories.nodes.map(cat => cat.name),
    imageUrl: node.featuredImage?.node?.sourceUrl || '/placeholder-image.jpg',
    excerpt: node.excerpt ? DOMPurify.sanitize(node.excerpt, { ALLOWED_TAGS: [] }) : ""
  }));

  return (
    <main className="blog-page">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem 0' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          color: 'var(--color-text)' 
        }}>
          Cape Coral News & Reviews
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#4a5568', 
          maxWidth: '800px', 
          marginBottom: '3rem' 
        }}>
          Stay up to date with the latest happenings, business spotlights, and local guides in the Cape Coral community.
        </p>
      </div>
      
      <BlogView posts={formattedPosts} />
    </main>
  );
}
