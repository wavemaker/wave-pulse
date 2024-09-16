"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { UIAgentContext } from '@/hooks/hooks';
import { UIAgent } from '@/wavepulse/ui-agent';
import { useState } from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}
const uiAgent = new UIAgent(`ws://localhost:3333`, `http://localhost:3333`);
export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <UIAgentContext.Provider value={uiAgent}>
            {children}
        </UIAgentContext.Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
