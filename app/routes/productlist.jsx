import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../component/navbar";
import ProductCard from "../component/productcard";
import { showToast } from "../component/toaster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";



export default function ProductList(){
   const dispatch = useDispatch()
   const [name,setName] = useState("")
   const [minPrice,setMinPrice] = useState("")
   const [maxPrice,setMaxPrice] = useState("")
   const [products,setProducts] = useState([])
   const [loading,setLoading] = useState(true)
   const [page,setPage] = useState(1)
   const [count,setCount] = useState(0)

   const totalPages = Math.ceil(count / 9)



   useEffect(()=>{
        const res = axios.get(`http://127.0.0.1:8000/api/v1/product/serach_product/?page=${page}&search=${name}&min_price=${minPrice}&max_price=${maxPrice}`)
        .then(res => {
          setProducts(res.data.results)
          setCount(res.data.count)
          console.log("The current page is:",page)
          console.log(res)
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
   },[page])

   async function searchProducts(e){
        e.preventDefault()
        setPage(1)
        const res = await axios.get(`http://127.0.0.1:8000/api/v1/product/serach_product/?page=${page}&search=${name}&min_price=${minPrice}&max_price=${maxPrice}`)
        .then(res => {
          setProducts(res.data.results)
          setCount(res.data.count)
          console.log(res)
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
   }

   function AddToCard(selectedProduct, selectedQuantity = 1){
       if (!selectedProduct) return

       dispatch(addToCart(selectedProduct, selectedQuantity))
       showToast(`${selectedProduct.name} added to cart`, "success")
   }

    return(
        <>
          <Navbar />
          <div className="bg-gray-50/60">
          <div className="flex flex-col mt-5 md:flex-row mx-auto w-full md:w-9/10 gap-4 px-3 md:px-0">
             {/* Filter COntainer */}
             <form className="flex flex-col pl-2 mt-2s gap-5 mx-auto md:mx-0 w-full max-w-sm md:w-80 md:shrink-0" onSubmit={searchProducts}>
                <h5 className="text-gray-950 mt-2 text-lg font-semibold ">Search Criteria</h5> 
                 <div className="flex flex-col gap-2">
                   <label htmlFor="" className="text-gray-950 font-medium">Product Name</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-300 py-2 px-3 rounded-lg w-full"  
                       placeholder="Enter product"
                       onChange={(e)=> setName(e.target.value)}
                     />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label htmlFor="" className="text-gray-950" className="text-gray-950 font-medium">Min Price</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-300 py-2 px-3 rounded-lg w-full"  
                       placeholder="Minimum Price"
                       onChange={(e)=> setMinPrice(e.target.value)}
                     />
                 </div> 
                 <div className="flex flex-col gap-2">
                   <label htmlFor="" className="text-gray-950 font-medium">Max Price</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-300 py-2 px-3 rounded-lg w-full"  
                       placeholder="Maximum Price"
                        onChange={(e)=> setMaxPrice(e.target.value)}
                     />
                 </div>                  
                 
                 <div className="flex flex-col justify-center w-full  gap-3">
                 <button className=" bg-amber-500 text-white font-semibold w-full  px-2 py-2 rounded-lg">Search Products</button>
                 <button type="reset" className=" bg-white w-full border border-gray-300  text-gray-950 px-2 py-2 rounded-lg">Reset</button>
              </div>
             </form>

              {/* Product Container */}
             <div className="w-full min-w-0">
                <div className="ml-3 mb-2">
                    <p className="font-semibold text-xl text-gray-950">Search Results</p>
                    <p className="text-gray-400 font-medium text-sm ">Showing {products.length} product</p>
                </div>
                   
                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4, 6, 7, 8, 9].map((item) => (
                            <div key={item} className="h-72 animate-pulse rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                <div className="h-40 rounded-md bg-gray-100"></div>
                                <div className="mt-4 h-5 w-3/4 rounded bg-gray-100"></div>
                                <div className="mt-3 h-4 w-1/2 rounded bg-gray-100"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {products.map((product,index) => {
                        return(
                         <ProductCard key={product.id ?? index} props={product} number={index} onAddToCart={AddToCard} />
                        )
                })}
                    </div>
                ) : (
                    <div className="rounded-lg  border-gray-300 bg-white px-6 py-12 text-center">
                        <h3 className="text-xl font-bold text-gray-950">No recent products yet</h3>
                        <p className="mt-2 text-gray-500">Products will appear here when they are available.</p>
                    </div>
                )}
                </div>
             </div>
              <div className="flex justify-center gap-4 mt-10">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600" aria-label="Previous page"
                   onClick={()=> setPage(page - 1)}
                   disabled = {page === 1}
                  >    
                  <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  {Array.from({length:totalPages},(_,i)=> (
                    <button
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-black ${
                       i === page -1
                          ? "border-amber-500 bg-amber-500 text-white"
                          : "border-gray-200 text-gray-700 hover:border-amber-300 hover:text-amber-600"
                        }`}                    
                     key={i}
                     onClick={() => setPage(i + 1)}
                    >
                      {i+1}
                    </button>
                  ))}

                  <button
                  onClick={()=> setPage(page + 1)}
                  disabled = {page >= Math.ceil(count / 9)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600" aria-label="Next page"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
              </div>
          </div>
        </>
    )
}
