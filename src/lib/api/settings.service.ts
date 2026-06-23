import { api } from "@/api/http";
import type { SiteSettings } from "@/lib/api/settings.types";

function isNoData(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const message = (body as { message?: string }).message;
  return typeof message === "string" && /no data/i.test(message);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await api.get<SiteSettings | { message?: string }>("/settings");
    if (isNoData(data)) return null;
    return data as SiteSettings;
  } catch {
    return null;
  }
}
