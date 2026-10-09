"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import type { ReactNode } from "react";

export function ClerkAppProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorBackground: "var(--auth-panel)",
          colorForeground: "var(--foreground)",
          colorPrimary: "var(--auth-accent)",
          colorPrimaryForeground: "var(--background)",
          colorInput: "var(--input)",
          colorInputForeground: "var(--foreground)",
          colorBorder: "var(--border)",
          colorMuted: "var(--muted)",
          colorMutedForeground: "var(--muted-foreground)",
          colorRing: "var(--ring)",
          colorDanger: "var(--destructive)",
          fontFamily: "var(--font-inter)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
