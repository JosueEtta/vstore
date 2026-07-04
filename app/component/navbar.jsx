import React from "react";
import { useState } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmarkCircle,faCamera} from "@fortawesome/free-regular-svg-icons";
import {Link} from "react-router"
import cartIcon from "../assets/cart2.svg"




export default function Navbar(){
     const [hiddenNav,sethiddenNav] = useState("hidden")
     const [borderBottom,setBorderBottom] = useState("border-b-gray-400")


      function swichNavHidden(){
             if(hiddenNav == "hidden"){
                 sethiddenNav("")
                 setBorderBottom("border-b-gray-400")
             }
             else{
                 sethiddenNav("hidden")
                 setBorderBottom("border-b-0")
             }
         }

    return(
        <>
           {/* // Mobile Navbar */}
        <nav className={`gap-2 sticky top-0 bg-white flex-col border-b pb-4  md:hidden z-10 `+ borderBottom}>
            <div className="flex justify-between"> 
               <h2 className="text-amber-500 ml-2  text-3xl font-semibold">Vstore</h2>
               <div className="flex gap-5">
                 <div className="mr-2 relative">
                   <img src={cartIcon} alt="" className="top-0 h-8 w-8 mr-2 mt-2" />
                   <div className="rounded-full h-5 w-5 bg-amber-500 absolute top-0.5 left-5 text-white font-bold flex justify-center items-center">0</div>
                 </div>
                   <FontAwesomeIcon icon={faXmarkCircle} className="text-2xl mr-2 mt-2" onClick={swichNavHidden}/>
               </div>
            </div>
            <div onClick={swichNavHidden} className={hiddenNav}>
               <div className="flex flex-col gap-0 text-center">
                 <Link to="/signup" className="py-1.5 border-x-0">Home</Link>
                 <Link to="/login" className="py-1.5 border-x-0">About us</Link> 
                 <Link to="/login" className="py-1.5 border-x-0">Product</Link>   
                 <Link to="/login" className="w-full py-1.5 border-x-0">Contact</Link> 
              </div>
              <div className="flex flex-col justify-center gap-1 w-90 mx-auto">
                 <button className=" bg-amber-500 w-full text-black px-0.5 py-2  rounded-lg">Login</button>
                 <button className=" bg-amber-500 w-full text-black px-0.5 py-2  rounded-lg">Siginup</button>
              </div>
            </div>
            
        </nav>

        {/* // Tablet and Desktop Navbar */}
         <nav className="gap-2 flex-row justify-between pb-2 rounded-b-xl hidden md:flex">
            <h2 className="text-amber-500 ml-2 mt-2 text-3xl font-semibold">Vstore</h2>
            <div className="grid grid-cols-4 gap-2 mt-2 text-center lg:gap-8 xl:gap-14">
              <Link to="/signup" className="py-1.5 border-x-0 hover:text-amber-300">Home</Link>
              <Link to="/login" className="py-1.5 border-x-0  hover:text-amber-300">About us</Link> 
              <Link to="/login" className="py-1.5 border-x-0  hover:text-amber-300">Product</Link>   
              <Link to="/login" className="w-full py-1.5 border-x-0  hover:text-amber-300">Contact</Link> 
            </div>

            <div className="flex gap-2 mr-4">
                 <div className="mr-2  relative">
                   <img src={cartIcon} alt="" className="top-0 h-8 w-8 mr-2 mt-2" />
                   <div className="rounded-full h-5 w-5 bg-amber-500 absolute top-0.5 left-5 text-white font-bold flex justify-center items-center">0</div>
                 </div>
                 <Link to="/login" className="cursor-pointer"><button className=" border border-gray-400 mt-2 font-semibold px-0.5 py-2 w-25 rounded-lg">Login</button></Link>
                 <Link to="/signup" className="cursor-pointer"><button className=" bg-amber-500 mt-2 font-semibold text-white px-0.5 py-2 w-25 rounded-lg">Siginup</button></Link>
            </div>
        </nav>

        </>
    )
}