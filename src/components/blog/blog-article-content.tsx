type BlogArticleContentProps = {
  html: string;
};

export function BlogArticleContent({ html }: BlogArticleContentProps) {
  return (
    <div
      className="blog-article-content text-[17px] leading-[1.8] text-ink-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
