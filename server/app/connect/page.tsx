"use client";

import { Button } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from "react";

export function ConnectPage() {
    const searchParams = useSearchParams();
    const [time, setTime] = useState(5);
    const launch = useCallback(() => {
        const launchUrl = decodeURIComponent(searchParams.get('launchUrl') || '').trim();
        if (!launchUrl.startsWith('http')
            && !launchUrl.startsWith('://')) {
            window.location.href= launchUrl;
        }
    }, [searchParams.get('launchUrl')]);
    useEffect(() => {
        if (time > 0) {
            setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        }
    }, [time]);
    useEffect(() => {
        if (time === 0) {
            launch();
        }
    }, [time, launch]);
    return (
    <div className='flex flex-col justify-center items-center h-svh'>
        {
            time > 0 ? (
                <div className='text-sm'>
                    App should be automatically opened in <span className='font-bold text-large text-red-600'>{time}</span> seconds
                </div>
            ) : null
        }
        {
            time > 0 ? null : (
                <>
                <div className='text-sm py-4'>
                    If the app is not opened yet, please click on the below button.
                </div>
                <Button 
                    className='text-sm bg-green-900 px-4 text-white'
                    style={{backgroundColor: '#284cad'}}
                    onClick={launch}>
                    Launch App in Debug mode
                </Button>
                </>
            )
        }
    </div>);
}

export default () => {
    return (
        <Suspense>
            <ConnectPage />
        </Suspense>
    )
}
