import React, { useCallback, useEffect, useState } from "react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";


let count =0;
export const BreadcrumbsComponent = (props:any) => {

 

  const [scroll, setScroll]=useState("");

  const onselectBreadCrumb = (data:any) => {
    props.onselectBreadCrumbCallback(data)
  }
 
  return (
    <div className="flex flex-row "> 
      <div className="bg-slate-300 flex flex-row justify-center items-center" onClick={() => {
        
        if(scroll==='translate-x')
        {
          count+=3;
          setScroll(`${'translate-x'}-${count}`);
        }
        else{
          count+=3;
          setScroll(`${'translate-x'}-${count}`);
        }
      }}>&lt;&lt;</div>
    <Breadcrumbs underline={'none'} maxItems={20} classNames={{
      'base': 'px-8 py-1 flex flex-1 '+(scroll)
    }}
    >
    { props?.data?.map((data:any) => {
          return  <BreadcrumbItem 
            classNames={{
              'item': 'text-xs'
            }}
            onPress={()=>onselectBreadCrumb(data)} 
          >{data.tagName}</BreadcrumbItem>
       })
      }
    </Breadcrumbs>
    <div className="bg-slate-300 flex flex-row justify-center items-center">&gt;&gt;</div>
    </div>
  )
}


