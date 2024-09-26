import { AxiosRequestConfig, AxiosResponse } from "axios";

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
    children: WidgetNode[]
};

export type TimelineEvent<T> = {
    name: 'APP_STARTUP' | 'VARIABLE_INVOKE' | 'PAGE_READY';
    data: T;
    info?: {
        title: string,
        desc: string
    },
    startTime: number;
    endTime: number;
    timestamp: number;
};