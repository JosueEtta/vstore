import React from "react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./modal";
import { faBars, faCartShopping, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router"
import { hydrateCart, removeFromCart, updateCartQuantity } from "../redux/cartSlice";

export default function Navbar() {
     const dispatch = useDispatch()
     const savedCard = useSelector((state) => state.items || [])
     const [isOpen, setIsOpen] = useState(false)
     const [hiddenNav, sethiddenNav] = useState("hidden")
     const [borderBottom, setBorderBottom] = useState("border-b-gray-400")
     const navigate = useNavigate()

     useEffect(() => {
          if (typeof window === "undefined") return undefined

          const syncCartFromStorage = () => {
               const nextStoredItems = JSON.parse(localStorage.getItem("card") || "[]")
               dispatch(hydrateCart(nextStoredItems))
          }

          window.addEventListener("storage", syncCartFromStorage)
          return () => window.removeEventListener("storage", syncCartFromStorage)
     }, [dispatch])

     function openCartModal() {
          setIsOpen(true)
     }

     const cartDisplayCount = savedCard.length > 99 ? "99+" : savedCard.length
     const navLinks = [
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: "About", to: "/login" },
          { label: "Contact", to: "/login" },
     ]

     const subtotal = savedCard.reduce((total, item) => {
          const price = Number(item?.price) || 0
          const quantity = Number(item?.quantity) || 1
          return total + price * quantity
     }, 0)

     const transportFee = subtotal > 0 ? 1000 : 0
     const totalCost = subtotal + transportFee

     function swichNavHidden() {
          if (hiddenNav == "hidden") {
               sethiddenNav("")
               setBorderBottom("border-b-gray-400")
          } else {
               sethiddenNav("hidden")
               setBorderBottom("border-b-0")
          }
     }

     function updateQuantity(item, nextQuantity) {
          const safeQuantity = Math.max(1, Number(nextQuantity) || 1)
          const availableQuantity = Number(item?.stock || item?.quantity || safeQuantity)
          const boundedQuantity = Math.min(safeQuantity, availableQuantity || safeQuantity)

          dispatch(updateCartQuantity(item?.id ?? `${item?.name ?? "product"}-${item?.image ?? "image"}`, boundedQuantity))
     }

     function removeCartItem(item) {
          dispatch(removeFromCart(item?.id ?? `${item?.name ?? "product"}-${item?.image ?? "image"}`))
     }

     function routeToDashbaord(){
          const role = localStorage.getItem("userRole")
          console.log("User Role is: ", role)
          if(role === "admin"){
               navigate("/admindashboard")
          }else if(role === "client"){
               navigate("/clientdashboard")
          }else{
               navigate("/login")
          }
     }

     return (
          <>
               {/* Mobile Navbar */}
               <nav className={`sticky top-0 z-20 flex-col border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:hidden ` + borderBottom}>
                    <div className="flex items-center justify-between">
                         <Link to="/" className="text-2xl font-black tracking-tight text-gray-950">
                              V<span className="text-amber-500">store</span>
                         </Link>
                         <div className="flex items-center gap-4">
                              <div className="relative cursor-pointer" aria-label="View cart" onClick={openCartModal}>
                                   <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-600" />
                                   <div className="absolute -right-3 -top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">{cartDisplayCount}</div>
                              </div>
                              <Link to="/login" className="text-gray-700" aria-label="Login">
                                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-200">
                                        <FontAwesomeIcon icon={faUser} className="text-base text-gray-600" />
                                   </div>
                              </Link>
                              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700" onClick={swichNavHidden} aria-label="Toggle navigation">
                                   <FontAwesomeIcon icon={hiddenNav == "hidden" ? faBars : faXmark} className="text-lg" />
                              </button>
                         </div>
                    </div>
                    <div onClick={swichNavHidden} className={`${hiddenNav} pt-4`}>
                         <div className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-gray-50 text-center">
                              {navLinks.map((link) => (
                                   <Link key={link.label} to={link.to} className="border-b border-gray-100 py-3 font-medium text-gray-700 last:border-b-0 hover:text-amber-600">{link.label}</Link>
                              ))}
                         </div>
                         <div className="mt-4 grid grid-cols-2 gap-3">
                              <Link to="/login" className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center font-semibold text-gray-900">Login</Link>
                              <Link to="/signup" className="rounded-lg bg-amber-500 px-4 py-2.5 text-center font-semibold text-white shadow-sm shadow-amber-200">Sign up</Link>
                         </div>
                    </div>
               </nav>

               {/* Tablet and Desktop Navbar */}
               <nav className="sticky top-0 z-20 hidden items-center justify-between border-b border-gray-100 bg-white/95 px-8 py-4 shadow-sm backdrop-blur md:flex">
                    <Link to="/" className="text-3xl font-black tracking-tight text-gray-950">
                         V<span className="text-amber-500">store</span>
                    </Link>
                    <div className="flex items-center gap-8 text-sm font-semibold text-gray-600">
                         {navLinks.map((link) => (
                              <Link key={link.label} to={link.to} className="hover:text-amber-600">{link.label}</Link>
                         ))}
                    </div>

                    <div className="flex cursor-pointer items-center gap-4">
                         <div className="relative mr-1" aria-label="View cart" onClick={openCartModal}>
                              <FontAwesomeIcon icon={faCartShopping} className="text-xl text-gray-600" />
                              <div className="absolute -right-3 -top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">{cartDisplayCount}</div>
                         </div>
                         <div onClick={routeToDashbaord} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-200" aria-label="Login">
                              <FontAwesomeIcon icon={faUser} className="text-base text-gray-600" />
                         </div>
                         <Link to="/login" className="rounded-lg border border-gray-200 px-5 py-2.5 font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600">Login</Link>
                         <Link to="/signup" className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-amber-200 hover:bg-amber-600">Sign up</Link>
                    </div>
               </nav>

               <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="bg-white">
                         <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                              <div>
                                   <p className="text-lg font-black text-gray-950">Your cart</p>
                                   <p className="text-sm text-gray-500">{savedCard.length} item{savedCard.length === 1 ? "" : "s"}</p>
                              </div>
                              <button
                                   type="button"
                                   onClick={() => setIsOpen(false)}
                                   className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-600"
                              >
                                   Close
                              </button>
                         </div>

                         <div className="max-h-[55vh] space-y-3 overflow-y-auto p-4">
                              {savedCard.length === 0 ? (
                                   <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                        Your cart is empty.
                                   </div>
                              ) : (
                                   savedCard.map((item, index) => (
                                        <div key={`${item.id ?? item.name ?? index}`} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                             <img
                                                  src={`http://127.0.0.1:8000${item.image}`}
                                                  alt={item?.name ?? "Product image"}
                                                  className="h-24 w-24 rounded-lg object-cover"
                                             />
                                             <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                                  <div className="flex items-start justify-between gap-3">
                                                       <div className="min-w-0">
                                                            <p className="truncate text-sm font-bold text-gray-950">{item?.name ?? "Product"}</p>
                                                            <p className="mt-1 text-sm font-semibold text-amber-600">{Number(item?.price || 0).toLocaleString()} XAF</p>
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeCartItem(item)}
                                                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                                                       >
                                                            Remove
                                                       </button>
                                                  </div>

                                                  <div className="flex items-center justify-between gap-3">
                                                       <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                                                            <button
                                                                 type="button"
                                                                 onClick={() => updateQuantity(item, (Number(item?.quantity) || 1) - 1)}
                                                                 className="h-9 w-9 text-lg font-semibold text-gray-700 hover:text-amber-600"
                                                            >
                                                                 −
                                                            </button>
                                                            <input
                                                                 type="number"
                                                                 min="1"
                                                                 value={Number(item?.quantity) || 1}
                                                                 onChange={(e) => updateQuantity(item, e.target.value)}
                                                                 className="w-14 border-x border-gray-200 bg-transparent text-center text-sm font-semibold outline-none"
                                                            />
                                                            <button
                                                                 type="button"
                                                                 onClick={() => updateQuantity(item, (Number(item?.quantity) || 1) + 1)}
                                                                 className="h-9 w-9 text-lg font-semibold text-gray-700 hover:text-amber-600"
                                                            >
                                                                 +
                                                            </button>
                                                       </div>
                                                       <p className="text-sm font-bold text-gray-900">
                                                            {(Number(item?.price || 0) * Number(item?.quantity || 1)).toLocaleString()} XAF
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   ))
                              )}
                         </div>

                         <div className="border-t border-gray-100 bg-gray-50 p-4">
                              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                   <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-900">{subtotal.toLocaleString()} XAF</span>
                                   </div>
                                   <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                        <span>Transport</span>
                                        <span className="font-semibold text-gray-900">{transportFee.toLocaleString()} XAF</span>
                                   </div>
                                   <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <span className="text-base font-black text-gray-950">Total</span>
                                        <span className="text-base font-black text-amber-600">{totalCost.toLocaleString()} XAF</span>
                                   </div>
                                   <Link
                                        to="/payment"
                                        className="mt-4 block rounded-lg bg-amber-500 px-4 py-3 text-center text-sm font-bold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600"
                                   >
                                        Proceed to payment
                                   </Link>
                              </div>
                         </div>
                    </div>
               </Modal>
          </>
     )
}
