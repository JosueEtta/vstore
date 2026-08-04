import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import image from "../assets/watch.jpeg";
import Navbar from "../component/navbar";
import ProductCard from "../component/productcard";
import { showToast } from "../component/toaster";
import axios from "axios";
import { Link } from "react-router";
import { addToCart } from "../redux/cartSlice";

export default function Home(){
    const dispatch = useDispatch()
    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
           axios.get("http://127.0.0.1:8000/api/v1/product/get_recent_products/")
           .then(res => {
              setProducts(res.data)
           })
           .catch(error => console.log(error))
           .finally(() => setLoading(false))
      }
    ,[])

   function AddToCard(selectedProduct, selectedQuantity = 1){
       if (!selectedProduct) return

       dispatch(addToCart(selectedProduct, selectedQuantity))
       showToast(`${selectedProduct.name} added to cart`, "success")
   }
    
    return(
        <div className="">
        <Navbar />
        <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16 lg:px-8">
            <div className="max-w-2xl">
                <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                    Quality products with reliable delivery
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                    Find everyday essentials, standout accessories, and trusted deals in one clean shopping experience.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link to="/products" className="rounded-lg bg-amber-500 px-6 py-3 text-center font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600">
                        Shop now
                    </Link>
                    <Link to="/signup" className="rounded-lg border border-gray-200 px-6 py-3 text-center font-bold text-gray-900 transition hover:border-amber-300 hover:text-amber-600">
                        Create account
                    </Link>
                </div>
            </div>

            <div className="relative min-h-85 overflow-hidden rounded-lg bg-gray-950 shadow-2xl shadow-gray-200 md:min-h-[520px]">
                <img src={image} alt="Featured watch" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950/75 via-gray-950/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                    <h2 className="mt-2 text-2xl font-black">Premium style, ready to ship</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                        A sharper way to browse the products your customers are already looking for.
                    </p>
                </div>
            </div>
        </main>

        <section className="bg-gray-50 py-12">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">Recent products</h2>
                    </div>
                    <Link to="/products" className="font-bold text-amber-600 hover:text-amber-700">
                        View all products
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-72 animate-pulse rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                <div className="h-40 rounded-md bg-gray-100"></div>
                                <div className="mt-4 h-5 w-3/4 rounded bg-gray-100"></div>
                                <div className="mt-3 h-4 w-1/2 rounded bg-gray-100"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product,index) => {
                    return(
                         <ProductCard key={product.id} props={product} number={index} onAddToCart={AddToCard} />
                    )
                })}
                    </div>
                ) : (
                    <div className="rounded-lg  border-gray-300 bg-white px-6 py-12 text-center">
                        <h3 className="text-xl font-bold text-gray-950">No recent products yet</h3>
                        <p className="mt-2 text-gray-500">Products from the API will appear here when they are available.</p>
                        <Link to="/products" className="mt-6 inline-flex rounded-lg bg-amber-500 px-5 py-3 font-bold text-white hover:bg-amber-600">
                            Browse products
                        </Link>
                    </div>
                )}
             </div>
        </section>
       </div>
    )
}
