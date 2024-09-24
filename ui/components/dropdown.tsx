import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
  } from "@nextui-org/react";


  export const DropdownComponent = ({allOptions,itemonPressCallback,onSelectionChangecallBack, selectedKeys,selectedValue}:any) => {
    console.log('inside of dropdown');
    return (<Dropdown>
        <DropdownTrigger>
          <Button variant="light" className="capitalize text-xs h-6" >
            {selectedValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Multiple selection example"
          variant="flat"
          closeOnSelect={false}
          disallowEmptySelection
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(e) =>
           {
            onSelectionChangecallBack(e)}
            }
        >
          {allOptions.map((i: any) => {
            return (
              <DropdownItem
                key={`${i}`}
                onPress={() => itemonPressCallback(i)}
                className="capitalize text-xs"
              >
                {i}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>)
  }