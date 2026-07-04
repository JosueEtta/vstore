import React, { use, useEffect, useState } from "react";
import image from "../assets/watch.jpeg";
import Navbar from "../component/navbar";
import axios from "axios";
import { Link } from "react-router";

export default function Home(){
    const [products,setProducts] = useState([])

    useEffect(() => {
           const res = axios.get("http://127.0.0.1:8000/api/v1/product/get_recent_products/")
           .then(res => {
              console.log(res.data)
              setProducts(res.data)
           })
           .catch(error => console.log(error))
      }
    ,[])
    
    return(
        <>
        <Navbar />
        <main className="md:flex ">
            <div className="md:w-3/5 flex flex-col items-center">
                <h1 className="text-3xl ml-2 font-semibold text-amber-300  md:my-auto md:text-5xl">Quality Product with reliable delivery</h1>
                <Link to="/login" className="cursor-pointer"><button className=" bg-amber-300 mt-2 text-black px-0.5 py-2 w-25 rounded-lg">Shop now</button></Link>
            </div>
            <img src={image} alt="Watch image"  className="md:w-2/5 h-1/10" />
        </main>
        <section>
             <div>
                {products.map(product => {
                    return(
                    <div key={product.id}>
                      <img src={`http://127.0.0.1:8000${product.image}`} />
                      <p>{product.name}</p>
                      <p>{product.quantity}</p>
                      <p>{product.price}</p>
                    </div>
                    )
                })}
             </div>
        </section>
       </>
    )
}