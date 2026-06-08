import { readSession } from "@/lib/auth/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000/api";

type RequestOpts = RequestInit & { auth?: boolean };

function mergeAuthHeaders(options?: RequestOpts): Headers {
  const headers = new Headers(options?.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (options?.auth !== false && typeof window !== "undefined") {
    const token = readSession()?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestOpts): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = mergeAuthHeaders(options);

  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      typeof body?.message === "string" ? body.message : res.statusText || "Request failed";
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string, init?: RequestOpts) {
    return request<T>(endpoint, { ...init, method: "GET" });
  },
  post<T>(endpoint: string, body?: unknown, init?: RequestOpts) {
    const headers = mergeAuthHeaders(init);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return request<T>(endpoint, {
      ...init,
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  patch<T>(endpoint: string, body?: unknown, init?: RequestOpts) {
    const headers = mergeAuthHeaders(init);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return request<T>(endpoint, {
      ...init,
      method: "PATCH",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(endpoint: string, init?: RequestOpts) {
    return request<T>(endpoint, { ...init, method: "DELETE" });
  },
};
