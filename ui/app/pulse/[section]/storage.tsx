import React, { useEffect, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

import { AppInfo, PlatformInfo } from "@wavemaker/wavepulse-agent/src/types";
import { KeyValuePair, KeyValueProps } from "@/components/key-pair";

export type Props = {
    data: any
};

export const Storage = (props: Props) => {
    const storage = props.data;
    const [storageProps, setStorageProps] = useState<KeyValueProps>(null as any);
    useEffect(() => {
        setStorageProps({
            entries: Object.entries(storage).map(e => ({
                key: e[0],
                value: e[1] as string || ''
            })) || []
        });
    }, [storage]);
    return (
        <div className="max-w-full border-r-1">
        { storageProps ? (<KeyValuePair {...storageProps}></KeyValuePair>) : null }
        </div>
    );
};