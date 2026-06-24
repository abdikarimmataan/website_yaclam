import { WhatsAppFloat } from "@/components/shared/whatsapp-float";
import { getFooterConfig } from "@/lib/api/footer.service";
import { toWhatsAppUrl } from "@/lib/whatsapp.utils";

export const dynamic = "force-dynamic";

export async function WhatsAppLoader() {
  const config = await getFooterConfig();
  const href = toWhatsAppUrl(config?.socials?.whatsapp);
  if (!href) return null;
  return <WhatsAppFloat href={href} />;
}
