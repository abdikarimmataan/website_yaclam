import { api } from "@/api/http";
import { contactCmsFromConfig } from "@/lib/api/contact-cms.defaults";
import type { ContactCmsConfig, ContactCmsView } from "@/lib/api/contact-cms.types";

const BASE = "/contact_cms";

/** Latest live contact CMS row from GET /contact_cms/getAll (plain array). */
export async function getContactCmsConfig(): Promise<ContactCmsView> {
  try {
    const res = await api.get<ContactCmsConfig[] | { message?: string }>(`${BASE}/getAll`);
    if (!Array.isArray(res) || res.length === 0) return contactCmsFromConfig(null);
    const live = res.filter((row) => row.del_status !== "Deleted");
    return contactCmsFromConfig(live[0] ?? null);
  } catch {
    return contactCmsFromConfig(null);
  }
}
