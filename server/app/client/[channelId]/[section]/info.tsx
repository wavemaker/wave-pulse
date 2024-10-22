import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

import { AppInfo, PlatformInfo } from "@/types";
import { KeyValuePair, KeyValueProps } from "@/components/key-pair";
import { RefreshIcon } from "@/components/icons";

export type Props = {
    appInfo: AppInfo,
    platformInfo: PlatformInfo,
    refresh: Function
};

export const Info = (props: Props) => {
    const appInfo = props.appInfo;
    const platformInfo = props.platformInfo;
    const [info, setInfo] = useState<KeyValueProps>(null as any);
    useEffect(() => {
        setInfo({
            entries: [{
                key: "Id",
                value: appInfo.applicationId
            },{
                key: "Name",
                value: appInfo.name
            },{
                key: "Version",
                value: appInfo.version
            },{
                key: "Server Path",
                value: appInfo.serverPath
            },{
                key: "Default Theme",
                value: appInfo.defaultTheme
            },{
                key: "Active Theme",
                value: appInfo.activeTheme
            },{
                key: "Default Landing Page",
                value: appInfo.defaultLandingPage
            },{
                key: "Active Landing Page",
                value: appInfo.activeLandingPage
            },{
                key: "Default Locale",
                value: appInfo.defaultLocale
            },{
                key: "Active Locale",
                value: appInfo.selectedLocale
            },{
                key: "Security Enabled",
                value: appInfo.securityEnabled + ''
            },{
                key: "OS",
                value: platformInfo.os
            },{
                key: "OS Version",
                value: platformInfo.version
            },]
        })
    }, [appInfo, platformInfo]);
    return (
        <div className="flex flex-col h-full bottom-8">
            <div className=" bg-zinc-100 px-4 py-1 flex flex-row content-center sticky top-0 w-full ">
                <div className="flex flex-1 flex-col justify-center "></div>
                <div className="flex flex-1 flex-wrap flex-row content-center justify-end">
                    <Button
                        isIconOnly
                        className="bg-transparent w-8 h-6 float-right"
                        onClick={() => props.refresh && props.refresh()}
                    >
                        <RefreshIcon color="#bbb" scale={24}></RefreshIcon>
                    </Button>
                </div>
            </div>
        { info ? (<KeyValuePair {...info}></KeyValuePair>) : null }
        </div>
    );
};