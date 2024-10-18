import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SVGProps } from "react";

export type LogInfo = {
    type: 'debug' | 'info' | 'error' | 'log' | 'warn'
    date: number,
    message: string
};

export type NetworkRequest = {
    id: string;
    name: string;
    path: string;
    method: string;
    status: string;
    time: number;
    req: AxiosRequestConfig;
    res: AxiosResponse;
};

export type AppInfo  = {
    name: string,
    version: string,
    applicationId: string,
    description: string,
    icon: string,
    defaultLocale: string,
    selectedLocale: string,
    defaultTheme: string,
    activeTheme: string,
    activeLandingPage: string,
    defaultLandingPage: string,
    securityEnabled: boolean,
    serverPath: string
};

export type PlatformInfo  = {
    os: string,
    version: string,
    device: string
};

export type WidgetNode = {
    name: string,
    tagName: string,
    id: string,
    children: WidgetNode[],
    selected?: boolean
};

export type TimelineEvent<T> = {
    name: 'APP_STARTUP' | 'VARIABLE_INVOKE' | 'PAGE_READY' | 'NETWORK_REQUEST';
    data: T;
    info?: {
        title: string,
        desc: string
    },
    startTime: number;
    endTime: number;
    timestamp: number;
};

export type SessionData = {
    data:string,
    index:number,
};

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
