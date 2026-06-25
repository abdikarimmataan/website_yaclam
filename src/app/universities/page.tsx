import { UniversitiesExplorerLive } from "@/components/universities/universities-explorer-live";
import { getPageCmsConfig } from "@/lib/api/page-cms.service";
import { getHomeScholarships } from "@/lib/api/scholarship.service";
import { getUniversityLevelTabs } from "@/lib/api/university-category.service";
import { getUniversitiesFromManage } from "@/lib/api/university-manage.service";
import { getAllUniversities, toUniversity } from "@/lib/api/university.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const cms = await getPageCmsConfig("university");
  return { title: cms.title };
}

export default async function UniversitiesPage() {
  const [cms, manageUniversities, universitiesRes, scholarships, levelTabs] = await Promise.all([
    getPageCmsConfig("university"),
    getUniversitiesFromManage(),
    getAllUniversities({ page: 1, pageSize: 500, isPublished: true }),
    getHomeScholarships(),
    getUniversityLevelTabs(),
  ]);

  const universities =
    manageUniversities.length > 0
      ? manageUniversities
      : Array.isArray(universitiesRes.data)
        ? universitiesRes.data
            .filter((u) => u.isVisible !== false && u.isPublished !== false)
            .map(toUniversity)
        : [];

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

      <section className="section container">
        <UniversitiesExplorerLive
          initialUniversities={universities}
          initialLevelTabs={levelTabs}
          scholarships={scholarships}
          emptyStateText={cms.emptyStateText}
        />
      </section>
    </div>
  );
}
