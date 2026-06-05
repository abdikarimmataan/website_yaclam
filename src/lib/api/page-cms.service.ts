import { api } from "@/api/http";
import { pageCmsFromConfig, PAGE_CMS_FALLBACKS } from "@/lib/api/page-cms.defaults";
import type { PageCmsConfig, PageCmsKey, PageCmsView } from "@/lib/api/page-cms.types";

const CMS_PATHS: Record<PageCmsKey, string> = {
  course: "/course_cms",
  roadmap: "/roadmap_cms",
  scholarship: "/scholarship_cms",
  blog: "/blog_cms",
  about: "/about_cms",
  contact: "/contact_cms",
};

async function fetchPageCms(base: string): Promise<PageCmsConfig | null> {
  const res = await api.get<PageCmsConfig[] | { message?: string }>(
    `${base}/getAll?page=1&pageSize=100`
  );
  if (!Array.isArray(res) || res.length === 0) return null;
  const live = res.filter((row) => row.del_status !== "Deleted" && row.isVisible !== false);
  return live[0] ?? res[0] ?? null;
}

/** Latest live CMS row for a listing/info page hero (title, subtitle, empty state). */
export async function getPageCmsConfig(key: PageCmsKey): Promise<PageCmsView> {
  try {
    const config = await fetchPageCms(CMS_PATHS[key]);
    return pageCmsFromConfig(config, key);
  } catch {
    return pageCmsFromConfig(null, key);
  }
}

export { PAGE_CMS_FALLBACKS };
