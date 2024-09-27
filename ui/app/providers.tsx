"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { UIAgentContext, useLocalStorage, useLocation } from '@/hooks/hooks';
import { UIAgent } from '@/wavepulse/ui-agent';
import { useState } from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const location = useLocation();
  const localStorage = useLocalStorage();
  const [uiAgent, setUIAgent] = useState<UIAgent>(null as any);
  React.useEffect(() => {
    if (!location || !localStorage) {
      return;
    }
    const server = location.href.split('/pulse')[0];
    setUIAgent(new UIAgent(server.replace(/(http:\/\/)/, 'ws://'), server, localStorage));
  }, [location, localStorage]);
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {uiAgent && <UIAgentContext.Provider value={uiAgent}>
            {children}
        </UIAgentContext.Provider>}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
