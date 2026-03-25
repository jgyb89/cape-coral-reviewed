/* src/components/blog/BlogCard.js */
"use client";

import Image from "next/image";
import Link from "next/link";
import "./Blog.css";

export default function BlogCard({ post }) {
  const { title, categories, excerpt, slug, imageUrl } = post;

  return (
    <article className="blog-card">
      <div className="blog-card__image-wrapper">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="blog-card__content">
        <div className="blog-card__categories">{categories.join(", ")}</div>
        <h3 className="blog-card__title">{title}</h3>
        <p className="blog-card__excerpt">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="blog-card__read-more">
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
}
