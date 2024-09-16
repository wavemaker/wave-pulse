import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

import { AppInfo, PlatformInfo } from "@wavemaker/wavepulse-agent/src/types";
import { KeyValuePair, KeyValueProps } from "@/components/key-pair";

export type Props = {
    appInfo: AppInfo,
    platformInfo: PlatformInfo
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
        <div className="max-w-4xl border-r-1">
        { info ? (<KeyValuePair {...info}></KeyValuePair>) : null }
        </div>
    );
};