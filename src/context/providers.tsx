"use client";

import { StrictMode } from "react";

import { ThemeProvider } from "@/context/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="next-ui-theme">
        {children}
      </ThemeProvider>
    </StrictMode>
  );
}
