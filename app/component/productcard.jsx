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
        if(quantity > 1){
            setQuantity(quantity - 1)
            console.log(quantity)
        }
    }
    return(
        // <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        //     <div className="h-44 w-full bg-gray-50 bg-center bg-contain bg-no-repeat sm:h-48"
        //       style={{backgroundImage: `url(http://127.0.0.1:8000${props.image})`}}
        //     >
        //     </div>
        //     <div className="flex flex-1 flex-col gap-4 p-4">
        //     <div>
        //        <p className="line-clamp-2 min-h-14 text-lg font-semibold text-gray-900">{props.name}</p> 
        //     </div>
        //     <div className="flex items-start justify-between gap-3">
        //         <p className="text-xl font-bold text-amber-500">{props.price} XAF</p>
        //         <div className="text-right text-sm">
        //             <p className="text-gray-500">In stock</p>
        //             <p className="font-semibold text-green-600">{props.quantity}</p>
        //         </div>
        //     </div>
        //     <div className="mt-auto flex flex-col justify-center gap-3">
        //         <div className="flex h-10 text-center">
        //             <button type="button" className="w-11 rounded-lg rounded-r-none border border-gray-300 bg-gray-50 font-semibold hover:bg-gray-100" onClick={decreaseQuantity}>-</button>
        //             <input type="text" className="w-full border border-x-0 border-gray-300 text-center outline-0" onChange={(e) =>{
        //                 setQuantity(Number(e.target.value))
        //                 console.log(typeof(quantity))
        //             }} value={Number(quantity)} />
        //             <button type="button" className="w-11 rounded-lg rounded-l-none border border-gray-300 bg-gray-50 font-semibold hover:bg-gray-100" onClick={increaseQuantity}>+</button>
        //         </div>
        //         <button className="w-full rounded-md bg-amber-500 px-3 py-2.5 font-semibold text-white hover:bg-amber-600" id={number} onClick={() => onAddToCart(props, quantity)}>Add to Cart</button>
        //     </div>
        //     </div>
        // </div>


          <div key={props.id} className="group flex h-full  flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="aspect-4/3 overflow-hidden bg-gray-100">
                        <img src={`http://127.0.0.1:8000${props.image}`} alt={props.name} className="h-full w-full bg-cover transition duration-300 group-hover:scale-105" />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="line-clamp-2 min-h-12 text-lg font-bold text-gray-950">{props.name}</p>
                        <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                                <p className="text-md font-semibold  tracking-wide text-gray-400">Price</p>
                                <p className="text-xl font-black text-amber-600">{props.price} XAF</p>
                            </div>
                            <div className="text-right">
                                <p className="text-md font-semibold  tracking-wide text-gray-400">in stock</p>
                                <p className="font-bold text-green-600">{props.quantity}</p>
                            </div>
                        </div>
                        <div className="mt-auto flex flex-col justify-center gap-3">
                          <div className="flex h-10 text-center">
                            <button type="button" className="w-11 rounded-lg rounded-r-none border border-gray-300 bg-gray-50 font-semibold hover:bg-gray-100" onClick={decreaseQuantity}>-</button>
                            <input type="text" className="w-full border border-x-0 border-gray-300 text-center outline-0" onChange={(e) =>{
                              setQuantity(Number(e.target.value))
                              console.log(typeof(quantity))
                               }} value={Number(quantity)} />
                              <button type="button" className="w-11 rounded-lg rounded-l-none border border-gray-300 bg-gray-50 font-semibold hover:bg-gray-100" onClick={increaseQuantity}>+</button>
                          </div>
                           <button className="w-full rounded-md bg-amber-500 px-3 py-2.5 font-semibold text-white hover:bg-amber-600" id={number} onClick={() => onAddToCart(props, quantity)}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
    )
}


            
