import { api } from "@/api/http";
import type { FooterConfig } from "@/lib/api/footer.types";

const BASE = "/footer";

/** Backend returns a plain array from GET /footer/getAll */
export async function getAllFooter(opts?: { signal?: AbortSignal }): Promise<FooterConfig[]> {
  const res = await api.get<FooterConfig[] | { message?: string }>(`${BASE}/getAll`, {
    signal: opts?.signal,
  });
  if (Array.isArray(res)) return res;
  return [];
}

/** Latest live footer row (newest first). */
export async function getFooterConfig(): Promise<FooterConfig | null> {
  try {
    const rows = await getAllFooter();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
