import React, { useState } from "react";


export default function ProductCard({props,number,onAddToCart}){
    const [quantity,setQuantity] = useState(1)


    function increaseQuantity(){
         if(quantity < props.quantity){
             setQuantity(quantity + 1)
            console.log(quantity) 
             
        }
    }

    function decreaseQuantity(){
        if(quantity > 0){
            setQuantity(quantity - 1)
            console.log(quantity)
        }
    }
    return(
        <div className="flex shadow-lg w-85 gap-2 px-3 py-4 rounded-lg border-gray-300 mx-auto flex-col border">
            {number}
            <div className="h-50 bg-center bg-contain bg-no-repeat"
              style={{backgroundImage: `url(http://127.0.0.1:8000${props.image})`}}
            >
            </div>
            <div className="w-full h-2/5 flex flex-col gap-3">
            <div className="mt-1">
               <p className="font-medium text-xl">{props.name}</p> 
            </div>
            <div className="flex justify-between  mb-2">
                <p className="text-amber-500 content-center text-xl text-semibold">{props.price}XAF</p>
                <div>
                    <p className="text-gray-500">Quantity Available</p>
                    <p className="text-green-600 text-bold">{props.quantity} in stock</p>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
                <div className="flex text-center">
                    <div className="w-10 border border-gray-400 rounded-lg rounded-r-none py-1 px-0.5" onClick={decreaseQuantity}>-</div>
                    <input type="text" className="w-80 border text-center border-gray-400 border-x-0 py-1 outline-0" onChange={(e) =>{
                        setQuantity(e.target.value)
                        console.log(typeof(quantity))
                    }} value={Number(quantity)} />
                    <div className="w-10 border border-gray-400 rounded-lg rounded-l-none py-1 px-0.5 cursor-pointer" onClick={increaseQuantity}>+</div>
                </div>
                <button className="bg-amber-500 rounded-md px-2 py-2 w-80 text-white font-semibold" id={number} onClick={() => onAddToCart(number, quantity)}>Add to Cart</button>
            </div>
            </div>
        </div>
    )
}


            