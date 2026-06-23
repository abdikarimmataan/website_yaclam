import { FooterGate } from "@/components/layout/footer-gate";
import { footerFromConfig } from "@/lib/api/footer.defaults";
import { getFooterConfig } from "@/lib/api/footer.service";
import { getSiteSettings } from "@/lib/api/settings.service";

/** Always fetch fresh footer CMS data from GET /footer/getAll */
export const dynamic = "force-dynamic";

export async function FooterLoader() {
  const [config, settings] = await Promise.all([getFooterConfig(), getSiteSettings()]);
  const data = footerFromConfig(config);
  return <FooterGate data={data} settings={settings} />;
}
