import React from "react";
import { KeyValuePair, KeyValueProps } from "@/components/key-pair";
import { Accordion, AccordionItem, Button, Tab, Table, Tabs, Tooltip } from "@nextui-org/react";
import { CloseIcon } from "@nextui-org/shared-icons";
import { NetworkRequest, TimelineEvent } from "@wavemaker/wavepulse-agent/src/types";
import { useEffect, useState } from "react";
import {Search} from '@/components/search'
import {DropdownComponent} from '@/components/dropdown'
// import React from 'react';
// import { endOfToday, set } from 'date-fns';
//import TimeRange, { TimeRangeProps, OnChangeCallback, OnUpdateCallback } from 'react-timeline-range-slider';

// import { endOfToday, set } from 'date-fns' 

const logColors = {
    get: 'text-green-600 bg-green-200  border-green-600',
    put: 'text-orange-600 bg-orange-200  border-orange-600',
    post: 'text-orange-600 bg-orange-200  border-orange-600',
    delete: 'text-red-600 bg-red-200  border-red-600'
} as any;

export type Props = {
    events: TimelineEvent<any>[]
};

const getEventInfo = (e: TimelineEvent<any>): {
    title: string,
    desc: string
} => {
    const data = e.data;
    switch(e.name) {
        case 'APP_STARTUP': 
            return {title: 'App Startup', 'desc': 'Time taken to App Startup'};
        case 'VARIABLE_INVOKE': 
            return {title: data.name, 'desc': `invoked from ${data.context}`}
        case 'PAGE_READY': 
            return {title: data.name, 'desc': 'Time taken for Page Startup'}

    }
};

export const TimeLine = (props: Props) => {
    const startTime = (props.events[0]?.startTime || 0);
    const endTime = (props.events[props.events.length - 1]?.endTime) || 0;
    const totalTime = endTime - startTime;
    return (
        <div className="w-full h-full flex flex-row relative">
            <div className="flex-1 overflow-x-hidden h-full overflow-y-auto ">
               
    
                <div className=" bg-zinc-100 px-4 py-1 flex flex-row content-center sticky top-0 w-full ">
        
                    <div className="flex flex-1 flex-col justify-center ">
                </div>

                <div className="flex flex-1 flex-wrap flex-row content-center justify-end">
                </div>
            </div>
            {

            }

                <div className="flex flex-row border border-x-0 px-4 py-1 w-svw sticky top-0 bg-zinc-100">
                    <div className="flex-shrink-0 text-xs text-color w-2/12 font-bold">Name</div>
                    <div className="flex-shrink-0 px-8 text-xs w-1/12 font-bold">Time</div>
                    <div className="px-8 text-xs w-7/12 font-bold">Waterfall</div>
                </div>
              
            {
                
                props.events.map((e, i) => {
                    const mx = Math.round((e.startTime - startTime) / totalTime * 100);
                    const w = Math.round((e.endTime - e.startTime) / totalTime * 100);
                    e.info = e.info || getEventInfo(e);
                    return (
                        <div key={`${e.name}-${e.startTime}`} 
                            className={
                                "flex flex-row w-svw border border-x-0 border-t-0 px-4 py-1 cursor-pointer hover:bg-zinc-50 "
                            }>
                                <Tooltip content={e.info.desc}>
                                    
                            <div className="flex-shrink-0 text-xs text-color w-2/12">{e.info.title}</div>
                                </Tooltip>
                            {/* <div className={"flex-shrink-0 px-0 text-xs w-1/12 text-center border rounded-lg " + (logColors[r.method] || '')}>
                            <span>{r.method.toUpperCase()}</span></div> */}
                            {/* <div className="flex-shrink-0 px-8 text-xs w-1/12">{r.status}</div> */}
                            <div className="flex-shrink-0 px-8 text-xs w-1/12">{e.endTime - e.startTime}</div>
                            <div className="px-8 text-xs w-7/12">
                                <div className="h-4 bg-violet-900 text-center text-white" style={{
                                    marginLeft: mx + '%',
                                    width: w ? w + '%' : '2px'
                                }}></div>
                            </div>
                        </div>
                    )  
                })
            }
            </div>
            </div>
    );
};