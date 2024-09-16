

export type KeyValueProps = {
    entries: {
        key: string,
        value: string
    }[]
};

export const KeyValuePair = (props: KeyValueProps) => {
        return props.entries.map(e => (
            <div className="flex flex-row border-b">
                <div className="flex-shrink-0 text-xs font-bold w-4/12 px-4 py-1">{e.key}</div>
                <div className="text-xs  py-1">{e.value === undefined ? '' : e.value}</div>
            </div>
        ));
};