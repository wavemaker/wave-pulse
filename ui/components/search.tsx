import React, {  memo } from "react";
import {Input} from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";

export const Search = ({onSearchChange,searchTermVal}:any) =>{
    return ( <Input
        classNames={{
          base: "max-w-full sm:max-w-[20rem] h-6 justify-center ",
          mainWrapper: "h-6",
          input: "text-xs",
          inputWrapper:
            "h-6 min-h-6 font-normal text-xs bg-default-400/20 dark:bg-default-500/20 ",
        }}
        variant="bordered"
        placeholder="Type to search..."
        startContent={<SearchIcon size={18} />}
        type="search"
        value={searchTermVal}               
        onValueChange={(value) => {
          onSearchChange(value);
        }}
      />)
}

export default memo(Search);

