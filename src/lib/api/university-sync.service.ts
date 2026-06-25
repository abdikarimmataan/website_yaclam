import { api } from "@/api/http";

type UniversitySyncVersionResponse = {
  version: string;
};

export async function fetchUniversityDataVersion(): Promise<string> {
  const res = await api.get<UniversitySyncVersionResponse>("/university_sync/version");
  return String(res.version ?? "");
}
