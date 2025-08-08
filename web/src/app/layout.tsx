import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TrackingCodesProvider } from "@/components/tracking-codes-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "GrowFastWithUs",
  description: "Business automation and AI integration solutions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
