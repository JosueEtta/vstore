import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import ProductCard from "../component/productcard";
import image from "../assets/watch.jpeg";
import axios from "axios";



export default function ProductList(){
   const [name,setName] = useState("")
   const [minPrice,setMinPrice] = useState("")
   const [maxPrice,setMaxPrice] = useState("")
   const [products,setProducts] = useState([])
   const [card,setCard] = useState(() => {
      if (typeof window !== "undefined") {
         const savedCard = localStorage.getItem("card")
         return savedCard ? JSON.parse(savedCard) : []
      }
      return []
   })
   let productNumber = -1


   useEffect(()=>{
        const res = axios.get(`http://127.0.0.1:8000/api/v1/product/serach_product/?search=${name}&min_price=${minPrice}&max_price=${maxPrice}`)
        .then(res => {
          console.log("You hited it Bor")
          setProducts(res.data)
          console.log(products)
          console.log(res)
        })
        .catch(error => console.log(error))
   },[])

   async function searchProducts(e){
        e.preventDefault()
        const res = await axios.get(`http://127.0.0.1:8000/api/v1/product/serach_product/?search=${name}&min_price=${minPrice}&max_price=${maxPrice}`)
        .then(res => {
          console.log("You hited it Bor")
          setProducts(res.data)
          console.log(products)
          console.log(res)
        })
        .catch(error => console.log(error))
   }

   function AddToCard(productId, selectedQuantity = 1){
       const productIndex = Number(productId)
       const selectedProduct = products[productIndex]
       const quantityToAdd = Number(selectedQuantity) > 0 ? Number(selectedQuantity) : 1

       if (!selectedProduct) return

       setCard((prevCard) => {
          const existingItemIndex = prevCard.findIndex((item) => item?.id === selectedProduct.id)

          if (existingItemIndex !== -1) {
             const updatedCard = prevCard.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: quantityToAdd } : item
             )
             localStorage.setItem("card", JSON.stringify(updatedCard))
             return updatedCard
          }

          const updatedCard = [...prevCard, { ...selectedProduct, quantity: quantityToAdd }]
          localStorage.setItem("card", JSON.stringify(updatedCard))
          return updatedCard
       })
   }

    return(
        <>
          <Navbar />
          <div className="h-30 pl-2  bg-amber-500">
             <h1 className="text-4xl pt-4 font-semibold text-white">Search Products</h1>
             <p className="text-white font-semibold pt-2">Find the product products your looking for</p>
          </div>
          <div className="flex flex-col mt-5 md:flex-row mx-auto md:w-9/10 gap-4 ">
             {/* Filter COntainer */}
             <form className="flex flex-col pl-2 mt-2s gap-2 mx-auto md:mx-0 w-99" onSubmit={searchProducts}>
                <h5 className="text-amber-500 mt-2 text-lg font-semibold">Search Criteria</h5> 
                 <div className="flex flex-col gap-2">
                   <label htmlFor="">Product Name</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-400 py-2 px-3 rounded-lg w-90"  
                       placeholder="Enter product"
                       onChange={(e)=> setName(e.target.value)}
                     />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label htmlFor="">Min Price</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-400 py-2 px-3 rounded-lg w-90"  
                       placeholder="Minimum Price"
                       onChange={(e)=> setMinPrice(e.target.value)}
                     />
                 </div> 
                 <div className="flex flex-col gap-2">
                   <label htmlFor="">Max Price</label>
                     <input type="text" className="border outline-none focus:border-amber-300 
                       border-gray-400 py-2 px-3 rounded-lg w-90"  
                       placeholder="Maximum Price"
                        onChange={(e)=> setMaxPrice(e.target.value)}
                     />
                 </div>                  
                 
                 <div className="flex flex-col justify-center w-full  gap-3">
                 <button className=" bg-amber-500 text-white font-semibold w-90  px-2 py-2 rounded-lg">Search Products</button>
                 <button type="reset" className=" bg-white w-90 border border-gray-400  text-black px-2 py-2 rounded-lg">Reset</button>
              </div>
             </form>

              {/* Product Container */}
             <div>
                <div className="ml-3 mb-2">
                    <p className="font-medium text-xl">Search Results</p>
                    <p className="text-gray-400 font-medium text-sm">Showing {products.length} product</p>
                </div>
                <div className="flex flex-wrap flex-col  md:flex-row gap-4">
                   {products.map(product =>{
                      return(
                        <ProductCard props={product} number={productNumber=productNumber+1} onAddToCart={AddToCard} />
                      )
                   })}
                </div>
             </div>
          </div>
        </>
    )
}