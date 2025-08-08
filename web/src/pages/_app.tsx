"use client";

import type { AppProps } from "next/app";
import { AppProviders } from "@/app/providers";
import "@/app/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}


