import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar, User } from "lucide-react";
import { blogPosts, getPost } from "@/lib/data/blog";
import { BlogCard } from "@/components/shared/blog-card";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  return { title: p ? p.title : "Article" };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <div>
      <div className="relative overflow-hidden py-16 text-white" style={{ background: `linear-gradient(135deg, ${post.color}, #0D1B4B)` }}>
        <div className="container relative">
          <div className="mb-4 flex items-center gap-1.5 text-[13px] text-white/60">
            <Link href="/blog" className="hover:text-gold">Blog</Link>
            <ChevronRight size={13} /> <span>{post.category}</span>
          </div>
          <span className="inline-flex rounded-md bg-white/15 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wide">{post.category}</span>
          <h1 className="mt-3.5 max-w-3xl text-[clamp(28px,4.5vw,46px)] font-semibold">{post.title}</h1>
          <div className="mt-5 flex flex-wrap gap-5 text-[14px] text-white/80">
            <span className="inline-flex items-center gap-1.5"><User size={15} /> {post.author}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={15} /> {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {post.readTime} min read</span>
          </div>
        </div>
      </div>

      <article className="section container">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 border-l-4 border-gold pl-5 text-[19px] font-medium leading-relaxed text-ink-2">{post.excerpt}</p>
          {post.body.map((para, i) => (
            <p key={i} className="mb-5 text-[17px] leading-[1.8] text-ink-2">{para}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <h2 className="mb-8 text-[26px] font-semibold text-navy">Related articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <BlogCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
