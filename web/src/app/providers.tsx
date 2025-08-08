"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import * as Tooltip from "@/components/ui/tooltip";
// import TrackingCodesProvider from "@/components/tracking-codes-provider";
import Toaster from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Tooltip.TooltipProvider>
          {/* <TrackingCodesProvider /> */}
          {children}
          <Toaster />
        </Tooltip.TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


