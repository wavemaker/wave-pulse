import React,{ useCallback, useMemo, useState} from "react";
import {  Button,Tooltip } from "@nextui-org/react";
import {  DeleteIcon } from "@nextui-org/shared-icons";
import {  TimelineEvent } from "@/types";
import TimelineRangeSlider from "@/components/timelinerangeslider";

const logColors = {
    'A': 'text-green-600 bg-green-200  border-green-600 ',
    'V': 'text-orange-600 bg-orange-200  border-orange-600 ',
    'P': 'text-red-600 bg-red-200  border-red-600 ',
    'N' : 'text-blue-600 bg-blue-200  border-blue-600 ',
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
    const checkBoxData = useMemo(()=>{
        return [
            {key:'A', value: 'App Startup'},
            {key:'N', value:'Network Request'},
            {key:'V', value: 'Variable'},
            {key:'P', value: 'Page StartUp'}
        ].filter(c => timelineLogs.find(e => e.name.startsWith(c.key)))
    },[timelineLogs])
    const startTime = useMemo(() => ((timelineLogs && timelineLogs[0]?.startTime) || 0), [timelineLogs && timelineLogs[0]?.startTime]);      
    const endTime =  useMemo(() => {
        return Math.max(
            ((timelineLogs[timelineLogs.length - 1]?.endTime) || 0), startTime + 6 * 1000);
    }, [timelineLogs[timelineLogs.length - 1]?.endTime, startTime]);
    const totalTime = useMemo(() => endTime - startTime, [startTime, endTime]);
    const [showTillEnd, setShowTillEnd] = useState(true);
    const [currentstartTime, setcurrentstartTime] = useState(0);
    const [currentendTime, setcurrentendTime] = useState(endTime);
    const [checkboxDataState,setcheckboxDataState] = useState(['A','N','V','P']);
    const [minRange, setminRange]=useState(startTime);
    const [maxRange, setmaxRange]=useState(endTime);


    const onclickCallBack = useCallback((_startTime:number, _endTime:number) => {
        setcurrentstartTime(_startTime);
        setcurrentendTime(_endTime);
        setShowTillEnd(Math.abs(_endTime - endTime) <= 500 && Math.abs(_startTime - startTime) <= 500 );
    }, [currentstartTime, currentendTime]);

    const searchCallBack = useCallback((val1:any,val2:any) => {
        setminRange(val1);
        setmaxRange(val2);
    }, [minRange, maxRange]);
    const _minRange = showTillEnd ? startTime : minRange;
    const _maxRange = showTillEnd ? endTime : maxRange;
    const checkBoxDataCallBack = 
    useCallback(
        (selectedEle:string)=>{
            let container = [...checkboxDataState]
       if (checkboxDataState.includes(selectedEle[0])){
        container.map((ele:any,i:any)=>{
            ele === selectedEle[0] ? container.splice(i,1) : null
        })
       }
       else{
        container.push(selectedEle[0].toUpperCase());
       }
       setcheckboxDataState(container)
    }
    ,[checkboxDataState,])

    return (

        <div className="w-full h-full flex flex-col relative overflow-x-hidden overflow-y-auto">
            <div className="sticky top-0 bg-white" >
                <div className="w-full flex flex-row bg-zinc-100 px-4 py-1">
                    <div className="flex flex-1 flex-col justify-center ">

                    </div>
                    <div className="flex flex-1 flex-wrap flex-row content-center justify-end ">
                        <Button
                            isIconOnly
                            className="bg-transparent w-8 h-6 float-right"
                            onClick={() => clearTimelineLogs()}
                        >
                            <DeleteIcon></DeleteIcon>
                        </Button>
                    </div>
                </div>
                <div className='w-100 flex flex-row' style={{minHeight: '7em'}}>
                    <div className="w-3/12 flex flex-col justify-start pl-4 cursor-pointer">
                    {
                        
                    checkBoxData.map((d,i)=>{
                        return  <div>
                        <div className=" flex w-5/12 flex-row text-xs w-fit p-1" onClick={()=>checkBoxDataCallBack(d.value)}>
                            <div className={checkboxDataState.includes(d.key) ? " text-color w-4 h-4 justify-center items-center  p-1 text-center border rounded-full flex " + logColors[d.value[0].toUpperCase()]  : 'text-color w-4 h-4 justify-center items-center  p-1 text-center border rounded-full flex   text-gray-600 bg-gray-200  border-gray-600 ' }>
                                            {d.key}
                            </div> 
                            <div className="pl-2">{d.value}</div>
                    </div></div>
                    })
                    }
                        

                    </div>
                    <div className="w-9/12">
                    {
                    startTime <= 0  ? null : <TimelineRangeSlider 
                        key={endTime + ''}
                        startTime={new Date(startTime)} 
                        endTime={new Date(endTime)} 
                        currentstartTime={new Date(currentstartTime)} 
                        currentendTime={new Date(showTillEnd ? endTime : currentendTime)} 
                        searchCallBack={searchCallBack}/> 
                    }
                    </div>
                </div>
                <div className="flex flex-row border border-x-0 py-1 w-svw sticky top-0 bg-zinc-100">
                    <div className="flex-shrink-0 text-xs text-color px-4 w-2/12 font-bold">Name</div>
                    <div className="flex-shrink-0 px-8 text-xs w-1/12 font-bold">Time (ms)</div>
                    <div className="px-8 text-xs w-9/12 font-bold">Waterfall</div>
                </div>
            </div>
              
            {
                
                timelineLogs.map((e, i) => {
                    const mx = Math.round((e.startTime - startTime) / totalTime * 100);
                    const w = Math.round((e.endTime - e.startTime) / totalTime * 100);
                    e.info = e.info || getEventInfo(e);
                    return (checkboxDataState.includes(e.name[0]) && (e.startTime >= _minRange && e.endTime <= _maxRange))   ? (
                        <div 
                            className={
                                "flex flex-row w-svw border border-x-0 border-t-0 py-1 cursor-pointer hover:bg-zinc-50 "
                            }
                            key={i + e.startTime}
                            >
                            <Tooltip content={e.info.desc}>
                                <div className="flex flex-row w-2/12 px-4 items-center"> 
                                    <div className={" text-xs text-color w-4 h-4 justify-center items-center  p-1 text-center border rounded-full flex " + logColors[e.name[0].toUpperCase()]}>
                                        {e.name[0]}
                                    </div>      
                                    <div className={" flex text-xs text-color items-center pl-2" } >{e.info.title}</div>
                                </div>
                            </Tooltip>
                            <div className="flex-shrink-0 px-8 w-1/12 text-xs ">{e.endTime - e.startTime}</div>
                            <div className="text-xs w-9/12">
                                <div className={"h-4 text-center border text-white " + logColors[e.name[0].toUpperCase()]} style={{
                                    marginLeft: mx + '%',
                                    width: w ? w + '%' : '2px'
                                }}
                                onClick={()=>onclickCallBack(e.startTime, e.endTime)}
                                ></div>
                            </div>
                        </div>
                    ) :null 
                })
            }
            </div>
    );
};