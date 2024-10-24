"use client";

import { Button } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from "react";

export function ConnectPage() {
    const searchParams = useSearchParams();
    const [time, setTime] = useState(5);
    const launchUrl = decodeURIComponent(searchParams.get('launchUrl') || '').trim();
    const launch = useCallback(() => {
        if (!launchUrl.startsWith('http')
            && !launchUrl.startsWith('://')) {
            window.location.href= launchUrl;
        }
    }, [launchUrl]);
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
    const appId = launchUrl.split('://')[0];
    return (
    <div className='flex flex-col justify-center items-center h-svh p-4'>
        {
            time > 0 ? (
                <>
                <div className='text-sm'>
                    App should be automatically opened in <span className='font-bold text-large text-red-600'>{time}</span> seconds
                </div>

                <div className='text-sm py-1 text-center'>
                    <span>App Id:</span> <span className='font-bold'>{appId}</span>
                </div>
                </>
            ) : null
        }
        {
            time > 0 ? null : (
                <>
                <div className='text-sm py-1 text-center'>
                    If the app is not opened yet, please click on the below button.
                </div>

                <div className='text-sm py-1 text-center'>
                    <span className='italic'>App Id:</span> <span className='font-bold'>{appId}</span>
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
