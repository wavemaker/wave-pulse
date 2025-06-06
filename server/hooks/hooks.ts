"use client";
import { CALLS, EVENTS } from "@/wavepulse/constants";
import { AppInfo, NetworkRequest, LogInfo, PlatformInfo, TimelineEvent, DatabaseInfo } from "@/types";
import { UIAgent } from "@/wavepulse/ui-agent";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const UIAgentContext = createContext<UIAgent>(null as any);
const MAX_CONSOLE_LOGS = 500;
const MAX_NETWORK_REQUETS = 100;
const MAX_TIME_LINE_EVENTS = 100;

export const useLocation = () => {
    const [location, setLocation] = useState(null as any);
    useEffect(() => {
        setLocation(window && window.location);
    }, []);
    return location;
};

export const useLocalStorage = () => {
    const [localStorage, setLocalStorage] = useState(null as any);
    useEffect(() => {
        setLocalStorage(window && window.localStorage);
    }, []);
    return localStorage;
};

export const useConsole = () => {
    const uiAgent = useContext(UIAgentContext);
    const [logs, setLogs] = useState([] as LogInfo[]);
    const clearLogs = useCallback(() => {
        setLogs([]);
    }, [logs]);
    useEffect(() => {
        setLogs(uiAgent.sessionData.logs || []);
    }, [uiAgent.sessionData]);
    useEffect(() => {
        const destroy = uiAgent.subscribe(EVENTS.CONSOLE.LOG, (args) => {
            const logInfo = args[0] as LogInfo;
            setLogs((logs) => {
                const newVal = [...logs, {...logInfo}];
                while (newVal.length > MAX_CONSOLE_LOGS) {
                    newVal.shift();
                }
                return newVal;
            });
        });
        return destroy;
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.logs = logs;
        (window as any).remoteEvaL = (expr: string) => {
            uiAgent.invoke(CALLS.EXPRESSION.EVAL, [{expr}]).then((data) => {
                console.log(`Eval: ${expr} => ${JSON.stringify(data)}`);
            });
        };
    }, [logs]);
    return {logs, clearLogs};
};

export const useAppConnected = () => {
    const uiAgent = useContext(UIAgentContext);
    const [ showReloadAlert, setShowReloadAlert ] = useState(false);
    useEffect(() => {
        uiAgent.onInvoke(CALLS.HANDSHAKE.RELOAD, () => {
            if (uiAgent.isConnected) {
                setShowReloadAlert(true);
            }
            return Promise.resolve('Hello');
        });
    }, [uiAgent])
    return { showReloadAlert };
};

export const useAppInfo = () => {
    const uiAgent = useContext(UIAgentContext);
    const [appInfo, setAppInfo] = useState({} as AppInfo);
    const refreshAppInfo = useCallback(() => {
        uiAgent.invoke(CALLS.APP.INFO, [])
        .then((args: any) => {
            const appInfo = args as AppInfo;
            setAppInfo(appInfo);
        });
    }, [appInfo]);
    useEffect(() => {
        setAppInfo(uiAgent.sessionData.appInfo || {});
    }, [uiAgent.sessionData]);
    useEffect(() => {
        refreshAppInfo();
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.appInfo = appInfo;
    }, [appInfo]);
    return { appInfo, refreshAppInfo };
};

export const useStorageEntries = () => {
    const uiAgent = useContext(UIAgentContext);
    const [storage, setStorage] = useState({});
    const refreshStorage = useCallback(() => {
        uiAgent.invoke(CALLS.STORAGE.GET_ALL, [])
        .then((args: any) => {
            setStorage(args);
        });
    }, [storage]);
    useEffect(() => {
        setStorage(uiAgent.sessionData.storage || {});
    }, [uiAgent.sessionData]);
    useEffect(() => {
        refreshStorage();
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.storage = storage;
    }, [storage]);
    return {storage, refreshStorage};
};

export const usePlatformInfo = () => {
    const uiAgent = useContext(UIAgentContext);
    const [platformInfo, setPlatformInfo] = useState({} as PlatformInfo);
    const refreshPlatformInfo = useCallback(() => {
        uiAgent.invoke(CALLS.PLATFORM.INFO, [])
        .then((args: any) => {
            const platformInfo = args as PlatformInfo;
            setPlatformInfo(platformInfo);
        });
    }, [platformInfo]);
    useEffect(() => {
        setPlatformInfo(uiAgent.sessionData.platformInfo || {});
    }, [uiAgent.sessionData]);
    useEffect(() => {
        refreshPlatformInfo();
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.platformInfo = platformInfo;
    }, [platformInfo]);
    return {platformInfo, refreshPlatformInfo};
};

export const useDatabases = () => {
    const uiAgent = useContext(UIAgentContext);
    const [databases, setDatbases] = useState([] as DatabaseInfo[]);
    const executeSQl = useCallback((dbName: string, sql: string) => {
        return uiAgent.invoke(CALLS.DATABASE.EXECUTE_SQL, [dbName, sql])
        .then((args: any) => {
            return {
                rowsEffected: args.rowsEffected,
                rows: args.rows as any[]
            }
        });
    }, [databases]);
    const refreshDatabases = useCallback(() => {
        uiAgent.invoke(CALLS.DATABASE.INFO, [])
        .then((args: any) => {
            setDatbases(args as DatabaseInfo[]);
        });
    }, [databases]);
    useEffect(() => {
        setDatbases(uiAgent.sessionData.databases || []);
    }, [uiAgent.sessionData]);
    useEffect(() => {
        refreshDatabases();
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.databases = databases;
    }, [databases]);
    return {databases, executeSQl};
};

export const useVariables = () => {
    const uiAgent = useContext(UIAgentContext);
    const [variables, setVariables] = useState([] as any[]);
    useEffect(() => {
        setVariables(uiAgent.sessionData.variables || []);
    }, [uiAgent.sessionData]);
    const clearVariables = useCallback(() => {
        setVariables([]);
    }, [variables])
    useEffect(() => {
        const destroy = uiAgent.subscribe(EVENTS.VARIABLE.AFTER_INVOKE, (args) => {
            const variable = args[0] as any;
            setVariables(variables => [...variables, {...variable}]);
        });
        return destroy;
    }, []);
    useEffect(() => {
        uiAgent.currentSessionData.variables = variables;
    }, [variables]);
    return [variables, clearVariables];
};

export const useNetworkRequests = () => {
    const uiAgent = useContext(UIAgentContext);
    const [requests, setRequests] = useState([] as NetworkRequest[]);
    useEffect(() => {
        setRequests(uiAgent.sessionData.requests || []);
    }, [uiAgent.sessionData]);
    const clearRequests = useCallback(() => {
        setRequests([]);
    }, [requests]);
    useEffect(() => {
        const destroy = uiAgent.subscribe(EVENTS.SERVICE.AFTER_CALL, ([req, res]) => {
            const request = {
                id: Date.now() + '',
                name: req.url?.split('?')[0].split('/').findLast((s: string) => s),
                path: req.url,
                method: req.method,
                status: res.status,
                time: ((req.__endTime || 0) - (req.__startTime || 0)),
                req: req,
                res: res
            } as NetworkRequest;
            setRequests((requests) => {
                const newVal = [...requests, {...request}];
                while (newVal.length > MAX_NETWORK_REQUETS) {
                    newVal.shift();
                }
                return newVal;
            });
        });
        return destroy;
    }, [requests]);
    useEffect(() => {
        uiAgent.currentSessionData.requests = requests;
    }, [requests]);
    return {requests, clearRequests};
};

export const useComponentTree = () => {
    const uiAgent = useContext(UIAgentContext);
    const [componentTree, setComponentTree] = useState(null as any);
    useEffect(() => {
        setComponentTree(uiAgent.sessionData.componentTree || null);
    }, [uiAgent.sessionData]);
    const highlight = useCallback((widetId: string) => {
        uiAgent.invoke(CALLS.WIDGET.HIGHLIGHT, [widetId]);
    }, []);
    const refreshComponentTree = useCallback(() => {
        uiAgent.invoke(CALLS.WIDGET.TREE, []).then((data) => {
            setComponentTree(data);
        });
    }, []);
    useEffect(() => {
        const destroy =  uiAgent.subscribe(EVENTS.TIMELINE.EVENT, (args) => {
            const logInfo = args[0] as TimelineEvent<any>;
            if (logInfo.name === 'PAGE_READY') {
                refreshComponentTree();
            }
        });
        return destroy;
    }, [refreshComponentTree]);
    useEffect(refreshComponentTree, []);
    useEffect(() => {
        uiAgent.currentSessionData.componentTree = componentTree;
    }, [componentTree]);
    return {componentTree, refreshComponentTree, highlight};
};

export const useTimelineLog = () => {
    const uiAgent = useContext(UIAgentContext);
    const [timelineLogs, setTimelineLogs] = useState([] as TimelineEvent<any>[]);
    const clearTimelineLogs = useCallback(() => {
        setTimelineLogs([]);
    }, [timelineLogs]);
    const startProfile = useCallback(() => {
        const destroy =  uiAgent.subscribe(EVENTS.TIMELINE.EVENT, (args) => {
            const logInfo = args[0] as TimelineEvent<any>;
            setTimelineLogs(timelineLogs => {
                const newVal = [...timelineLogs];
                const i = newVal.findIndex(v => {
                    return v.startTime > logInfo.startTime;
                });
                if (i < 0) {
                    newVal.push(logInfo);
                } else {
                    newVal.splice(i, 0, logInfo);
                }
                while (newVal.length > MAX_TIME_LINE_EVENTS) {
                    newVal.shift();
                }
                return newVal;
            });
        });
        return destroy;
    }, [uiAgent]);
    useEffect(() => {
        return startProfile();
    }, [])
    useEffect(() => {
        setTimelineLogs(uiAgent.sessionData.timelineLogs || []);
    }, [uiAgent.sessionData]);
    useEffect(() => {
        uiAgent.currentSessionData.timelineLogs = timelineLogs;
    }, [timelineLogs]);
    return {timelineLogs, clearTimelineLogs, startProfile};
};