"use client";

import { AuthInitializer } from "./auth-initializer";
import { StoreProvider } from "./store-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthInitializer />
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  );
}
