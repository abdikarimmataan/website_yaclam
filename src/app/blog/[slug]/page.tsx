import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, User } from "lucide-react";
import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { BlogCard } from "@/components/shared/blog-card";
import { uploadUrl } from "@/lib/api/cms";
import {
  BLOG_RELATED_COUNT,
  getBlogPostDetail,
  getRelatedBlogPosts,
} from "@/lib/api/blog.service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostDetail(slug);
  return { title: post ? post.title : "Article" };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostDetail(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, BLOG_RELATED_COUNT);
  const coverSrc = uploadUrl(post.coverImage);
  const published = post.date
    ? new Date(post.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div>
      <div
        className="relative overflow-hidden py-16 text-white"
        style={
          coverSrc
            ? undefined
            : { background: `linear-gradient(135deg, ${post.color}, #0D1B4B)` }
        }
      >
        {coverSrc ? (
          <>
            <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/70" />
          </>
        ) : null}
        <div className="container relative">
          <div className="mb-4 flex items-center gap-1.5 text-[13px] text-white/60">
            <Link href="/blog" className="hover:text-gold">
              Blog
            </Link>
            <ChevronRight size={13} /> <span>{post.category}</span>
          </div>
          <span className="inline-flex rounded-md bg-white/15 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wide">
            {post.category}
          </span>
          <h1 className="mt-3.5 max-w-3xl text-[clamp(28px,4.5vw,46px)] font-semibold">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-5 text-[14px] text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <User size={15} /> {post.author}
            </span>
            {published ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={15} /> {published}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {post.readTime} min read
            </span>
          </div>
        </div>
      </div>

      <article className="section container">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 border-l-4 border-gold pl-5 text-[19px] font-medium leading-relaxed text-ink-2">
            {post.excerpt}
          </p>
          {post.contentHtml ? (
            <BlogArticleContent html={post.contentHtml} />
          ) : (
            post.body.map((para, i) => (
              <p key={i} className="mb-5 text-[17px] leading-[1.8] text-ink-2">
                {para}
              </p>
            ))
          )}
        </div>
      </article>

      <section className="section bg-surface">
        <div className="container">
          <h2 className="mb-8 text-[26px] font-semibold text-navy">Related articles</h2>
          {related.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-ink-3">No other articles in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
