import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Intercept fetch to support external API base for static hosting (Netlify/Vercel)
// If VITE_API_BASE_URL is set, prefix all "/api" requests with it.
(() => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";
  if (!apiBase) return;

  const originalFetch: typeof window.fetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    let url: string | URL = input as any;
    if (typeof url === "string" && url.startsWith("/api")) {
      url = `${apiBase}${url}`;
    }
    return originalFetch(url as any, init);
  };
})();

createRoot(document.getElementById("root")!).render(<App />);
