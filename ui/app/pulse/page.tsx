"use client";

import { UIAgentContext } from '@/hooks/hooks';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";

export default function WaitingForConnectionPage() {
    const router = useRouter();
    useEffect(() => {
        router.push('/pulse/elements');
    }, []);
    return (<></>);
}
