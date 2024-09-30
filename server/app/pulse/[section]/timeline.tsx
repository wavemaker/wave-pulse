import React from "react";
import {  Button,Tooltip } from "@nextui-org/react";
import {  DeleteIcon } from "@nextui-org/shared-icons";
import {  TimelineEvent } from "@wavemaker/wavepulse-agent/src/types";


const logColors = {
    'A': 'text-green-600 bg-green-200  border-green-600',
    'V': 'text-orange-600 bg-orange-200  border-orange-600',
    'P': 'text-red-600 bg-red-200  border-red-600',
    'N' : 'text-blue-600 bg-blue-200  border-blue-600'
} as any;

export type Props = {
    timelineLogs: TimelineEvent<any>[],
    clearTimelineLogs: Function
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
            return {title: data.name, 'desc': `invoked from ${data.context}`};
        case 'PAGE_READY': 
            return {title: `${data.name} Startup`, 'desc': 'Time taken for Page Startup'};
        case 'NETWORK_REQUEST':
            return {title: data.url.split('?')[0].split('/').pop(), 'desc': `Request to ${data.url}.`};
    }
};

export const TimeLine = ({timelineLogs, clearTimelineLogs}: Props) => {
    const startTime = (timelineLogs[0]?.startTime || 0);
    const endTime = (timelineLogs[timelineLogs.length - 1]?.endTime) || 0;
    const totalTime = endTime - startTime;
  
    return (
        <div className="w-full h-full flex flex-row relative">
            <div className="flex-1 overflow-x-hidden h-full overflow-y-auto ">
    
                <div className=" bg-zinc-100 px-4 py-1 flex flex-row content-center sticky top-0 w-full ">
        
                    <div className="flex flex-1 flex-col justify-center ">
                </div>

                <div className="flex flex-1 flex-wrap flex-row content-center justify-end">
                <Button
                    isIconOnly
                    className="bg-transparent w-8 h-6 float-right"
                    onClick={() => clearTimelineLogs()}
                >
                    <DeleteIcon></DeleteIcon>
                </Button>
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
                
                timelineLogs.map((e, i) => {
                    const mx = Math.round((e.startTime - startTime) / totalTime * 100);
                    const w = Math.round((e.endTime - e.startTime) / totalTime * 100);
                    e.info = e.info || getEventInfo(e);
                    console.log('e',e);
                    return (
                        <div key={`${e.name}-${e.startTime}`} 
                            className={
                                "flex flex-row w-svw border border-x-0 border-t-0 px-4 py-1 cursor-pointer hover:bg-zinc-50 "
                            }>
                            <Tooltip content={e.info.desc}>
                                <div className="flex flex-row w-2/12 items-center"> 
                                    <div className={" text-xs text-color w-4 h-4 justify-center items-center  p-1 text-center border rounded-full flex " + logColors[e.name[0].toUpperCase()]}>
                                        {e.name[0]}
                                    </div>      
                                    <div className={" flex text-xs text-color items-center pl-2" } >{e.info.title}</div>
                                </div>
                            </Tooltip>
                            <div className="flex-shrink-0 px-8 text-xs ">{e.endTime - e.startTime}</div>
                            <div className="px-8 text-xs w-7/12">
                                <div className={"h-4 text-center border text-white " + logColors[e.name[0].toUpperCase()]} style={{
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