export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export function apiFetch(input: string, init?: RequestInit) {
  const url = input.startsWith("/api") && API_BASE ? `${API_BASE}${input}` : input;
  return fetch(url, { credentials: "include", ...init });
}


