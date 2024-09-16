"use client";

import { UIAgentContext } from '@/hooks/hooks';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";

export default function WaitingForConnectionPage({ searchParams }: { searchParams: { section: string } } ) {
  const router = useRouter();
  const uiAgent = useContext(UIAgentContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    uiAgent.onConnect(() => {
      setIsConnected(uiAgent.isConnected);
    });
  }, [uiAgent]);
  useEffect(() => {
    if (isConnected) {
      router.replace(`/pulse/${searchParams.section}`);
    }
  }, [isConnected]);
  return (
    <div>
      <div className="lds-ripple"><div></div><div></div></div>
    </div>
  );
}
