import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/react";
import { CheckIcon, Delete, DeleteIcon } from "@nextui-org/shared-icons";
import { LogInfo } from "@wavemaker/wavepulse-agent/src/types";

const logColors = {
    debug: 'text-green-600',
    info: 'text-light-blue',
    warn: 'text-orange-600',
    error: 'text-red-600'
} as any;

export const Choices = (props: {
    entries: {
        key: string,
        value: string
    }
}) => {

};

const getMessageStr = (message: any) => {
    if (message === undefined || message === null) {
        return '';
    }
    if (typeof message === 'string') {
        return message;
    }
    return JSON.stringify(message);
}

export const Console = function (props: {
    logs: LogInfo[],
    clear: Function
}) {
    return (
        <div>
            <div className=" bg-zinc-100 px-4 py-1 flex flex-row content-center">
                <div className="flex flex-1 flex-wrap flex-row content-center">
                    <Chip 
                        size="sm" 
                        className="mx-2 min-w-16 text-center px-4"
                        startContent={<CheckIcon color=""/>}>All</Chip>
                    <Chip size="sm" variant="faded" className="mx-2 min-w-16 text-center">Debug</Chip>
                    <Chip size="sm" variant="faded"  className="mx-2 min-w-16 text-center">Warn</Chip>
                    <Chip size="sm" variant="faded"  className="mx-2 min-w-16 text-center">Info</Chip>
                    <Chip size="sm" variant="faded"  className="mx-2 min-w-16 text-center">Error</Chip>
                </div>
                <div>
                    <Button 
                        isIconOnly
                        className="bg-transparent w-8 h-8 float-right"
                        onClick={() => {
                            props.clear();
                        }}
                    >
                        <DeleteIcon></DeleteIcon>
                    </Button>
                </div>
            </div>
            {
                props.logs.map((log, i) => {
                    return (
                        <div key={log.date + '_' + i} className="flex flex-col border border-x-0 border-t-0">
                            <div className={"flex flex-row w-full " + (logColors[log.type] || '')}>
                                <div className="flex-shrink-0 text-xs text-color">{new Date(log.date).toLocaleString()}</div>
                                <div className="px-8 text-xs">{getMessageStr(log.message && log.message[0])}</div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};