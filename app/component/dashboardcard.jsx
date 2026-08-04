import React, { useEffect, useState }  from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";


export default function CardDashboard({
    title = "Total Orders",
    value = "24",
    helper = "All time orders",
    icon = faBagShopping,
    footerIcon = faBagShopping,
    isGreen=false,
    key,
}){
    const [greenStyle,setGreenStyle] = useState("amber")
    const [style,setStyle] = useState("")

    useEffect(()=>{
        checkGreen();
    },[])
     function checkGreen(){
        if(!isGreen){
            console.log(isGreen)
            setGreenStyle("amber")
            setStyle("bg-amber-200 text-amber-500")
        }
        else{
            setGreenStyle("green")
            setStyle("bg-green-200 text-green-500")

        }
    }
  return(
    <div key={key} className="flex min-h-40  flex-col rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="flex flex-1 items-center gap-5 p-6">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ring-1 ring-amber-100 + ${style}`}>
                <FontAwesomeIcon icon={icon} className="text-3xl"/>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-950">{title}</p>
                <p className="mt-2 text-3xl font-black text-gray-950">{value}</p>
            </div>
        </div> 
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">{helper}</p>
            <FontAwesomeIcon icon={footerIcon} className="text-lg text-gray-300" />
        </div>
    </div>
  )
}
