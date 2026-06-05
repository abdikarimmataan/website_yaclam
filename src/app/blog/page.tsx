import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import { BlogList } from "@/app/blog/blog-list";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("blog");
  return { title: cms.title };
}

export default async function BlogPage() {
  const cms = await getPageCmsConfig("blog");

  return (
    <div>
      {cms.isVisible ? (
        <div className="dark-band py-14 text-white">
          <div className="container">
            <h1 className="mb-2.5 text-[clamp(30px,5vw,46px)] font-semibold">{cms.title}</h1>
            <p className="max-w-xl text-[17px] text-white/72">{cms.subtitle}</p>
          </div>
        </div>
      ) : null}
      <BlogList />
    </div>
  );
}
