import { DatabaseIcon, DatabaseTableIcon } from "@/components/icons";
import { DatabaseInfo } from "@/types";
import { Button, SelectItem, Table, Textarea } from "@heroui/react";
import { Select, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

export const DatabaseExplorer = ({databases, onExecute}: {
    databases: DatabaseInfo[],
    onExecute: (dbName: string, sql: string) => Promise<{rowsEffected: number, rows: any[]}>
}) => {
    const [selectedDb, setSelectedDB] = useState<DatabaseInfo | undefined>(databases?.[0]);
    const [selectedTable, setSelectedTable] = useState(selectedDb?.tables[0]);
    const [showSQL, setShowSQL] = useState(false);
    const [data, setData] = useState([] as any[]);
    const [headerData, setHeaderData] = useState([] as string[]);
    useEffect(() => {
        if (selectedDb) {
            setSelectedDB(databases.find(d => selectedDb.name = d.name) || databases[0]);
        } else if (databases) {
            setSelectedDB(databases[0]);
        } else {
            setSelectedDB(undefined);
        }
    }, [databases]);
    useEffect(() => {
        setSelectedTable(selectedDb?.tables[0])
    }, [selectedDb]);
    const execute = useCallback((sql: string) => {
        if (selectedDb) {
            onExecute(selectedDb?.name, sql).then(result => {
                const data = result?.rows as any[];
                setData(data);
                setHeaderData(Object.keys(((data || [])[0]) || []));
            });
        }
    }, [selectedTable, selectedDb, onExecute]);
    return (
        <div className="flex flex-col h-full bottom-8">
            <div className="flex flex-1 flex-row h-full">
                <div className="min-w-64 h-full border-r-1 overflow-auto">
                    <div className="flex flex-1 flex-row gap-4 justify-start items-center">
                        {databases ? (
                            <Select className="w-full" size="sm" 
                                variant="flat" color="default"
                                label="Database"
                                defaultSelectedKeys={[selectedDb?.name || '']}
                                startContent={<DatabaseIcon size={24} color="#999"/>}
                                onSelectionChange={(e) => {
                                    setSelectedDB(databases.find(d => d.name === e.currentKey)!);
                                }}
                                classNames={{
                                    trigger: 'rounded-none',
                                    value: 'font-bold'
                                }}>
                            {databases?.map((db) => (
                                <SelectItem key={db.name}>{db.name}</SelectItem>
                            ))}
                        </Select>) : null }
                    </div>
                    <div className={`text-sm p-2 ${showSQL ? 'bg-slate-100 font-bold cursor-pointer' : ''}`} 
                        onClick={() => {
                            setShowSQL(true);
                        }}
                    >SQL Query</div>
                    <div className="text-sm p-2 font-bold bg-zinc-100 border-1 border-l-0 border-r-0">Tables</div>
                    {selectedDb?.tables.map((table) => (
                        <div key={table.name} 
                            className={`text-sm p-2 gap-1 flex flex-row 
                                items-center cursor-pointer border-b-1 
                                ${selectedTable?.name === table.name && !showSQL ? 'bg-slate-100 font-bold' : ''}`}
                            onClick={() => {
                                setSelectedTable(table);
                                setShowSQL(false);
                                execute(`Select * from ${table.name}`);
                            }}>
                            <DatabaseTableIcon size={32} color="#999"/>
                            <div>{table.entityName}</div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col flex-1">
                    {showSQL ? (
                    <Textarea className="bg-sky-50 w-full text-white" 
                        variant="underlined"
                        placeholder="Type SQL query here..."
                    ></Textarea>) : null }
                    {!data || data.length === 0? (<div className="text-sm p-4 text-white">0 records found</div>): null}
                    {data && data.length > 0? (
                        <div className="flex flex-col flex-1 bg-gray-900">
                            <div className="flex-1">
                                <Table isStriped
                                    classNames={{
                                        wrapper: 'rounded-none p-0 shadow-none',
                                        td: 'border-b-1 border-r-1'
                                    }}>
                                    <TableHeader className='[&>tr]:first:h-24'>
                                        {headerData.map((h, i) => {
                                            return (<TableColumn key={i}>{h}</TableColumn>);
                                        })}
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((r: any, i: number) => {
                                            return (
                                                <TableRow key={i}>
                                                    {Object.values(r).map((c: any, j: number) => {
                                                        return (
                                                            <TableCell key={j}>{c}</TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="bg-gray-100 h-8">

                            </div>
                        </div>
                    ): null}
                </div>
            </div>
        </div>
    );
};