import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowTrendUp,
    faBox,
    faCalendarDays,
    faCartShopping,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faClock,
    faDollarSign,
    faGrip,
    faMagnifyingGlass,
    faPen,
    faPlus,
    faRightFromBracket,
    faTableList,
    faTrash,
    faXmark,
    faBars,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import CardDashboard from "../component/dashboardcard";
import Modal from "../component/modal"
import NavDashboard from "../component/dashboardnav";
import { showToast } from "../component/toaster";
import api from "../api/axiosClient";


const sidebarLinks = [
    { label: "Dashboard", icon: faGrip, to: "/admindashboard", active: true },
    { label: "Orders", icon: faBox, to: "/orders",active: false },
    { label: "Logout", icon: faRightFromBracket, to: "/login", divider: true },
];


function StatusBadge({ status }) {
    const classes = {
        "In Stock": "bg-green-100 text-green-700",
        "Low Stock": "bg-amber-100 text-amber-700",
        "Out of Stock": "bg-red-100 text-red-700",
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}>
            {status}
        </span>
    );
}

export default function AdminDashboard(){
     const navigate = useNavigate()
     const [createProdcut,setCreateProduct] = useState(false)
     const [editingProduct,setEditingProduct] = useState(null)
     const [hiddenNav,sethiddenNav] = useState("hidden")
     const [products,setProducts] = useState([])
     const [search,setSearch] = useState("")
     const [page,setPage] = useState(1)
     const [count,setCount] = useState(0)
     const [productToDelete,setProductToDelete] = useState(null)
     const [isDeleting,setIsDeleting] = useState(false)
     const [formData, setFormData] = useState({
         name: "",
         price: "",
         quantity: "",
         image: null,
     })
     const [imagePreview, setImagePreview] = useState("")

      async function fetchProducts() {
         const accessToken = localStorage.getItem("accessToken")
         const userRole = localStorage.getItem("userRole")

         if (!accessToken || userRole !== "admin") {
             showToast("Admin access is required", "error")
             navigate("/login")
             return
         }

         try {
             const res = await api.get(`/api/v1/product/?admin=true&page=${page}`)
             setProducts(res.data.results)
             setCount(res.data.count)
         } catch (error) {
             const status = error?.response?.status
             if (status === 401 || status === 403) {
                 showToast("You are not authorized to access the admin dashboard", "error")
                 navigate("/login")
                 return
             }

             showToast("Unable to load products", "error")
         }
     }

     useEffect(()=>{
         fetchProducts()
   },[page])

    const totalPages = Math.ceil(count / 8)

    function handleCreateProductChange(event) {
        const { name, value, files } = event.target

        if (name === "image") {
            const selectedFile = files?.[0] ?? null
            setFormData((currentData) => ({ ...currentData, image: selectedFile }))
            setImagePreview(selectedFile ? URL.createObjectURL(selectedFile) : "")
            return
        }

        setFormData((currentData) => ({ ...currentData, [name]: value }))
    }

    function resetCreateProductForm() {
        setFormData({ name: "", price: "", quantity: "", image: null })
        setImagePreview("")
        setEditingProduct(null)
    }

    function openCreateProductModal() {
        resetCreateProductForm()
        setCreateProduct(true)
    }

    function openEditProductModal(product) {
        setEditingProduct(product)
        setFormData({
            name: product.name ?? "",
            price: product.price ?? "",
            quantity: product.quantity ?? "",
            image: null,
        })
        setImagePreview(product.image ? `http://127.0.0.1:8000${product.image}` : "")
        setCreateProduct(true)
    }

    async function submitCreateProduct(event) {
        event.preventDefault()

        const payload = new FormData()
        payload.append("name", formData.name)
        payload.append("price", formData.price)
        payload.append("quantity", formData.quantity)

        if (formData.image) {
            payload.append("image", formData.image)
        }

        try {
            const requestConfig = {
                headers: {},
            }

            if (editingProduct) {
                await api.put(`/api/v1/product/${editingProduct.id}/`, payload, requestConfig)
                showToast("Product updated successfully", "success")
            } else {
                await api.post("/api/v1/product/", payload, requestConfig)
                showToast("Product created successfully", "success")
            }

            setCreateProduct(false)
            resetCreateProductForm()
            await fetchProducts()
        } catch (error) {
            const errorMessage = error?.response?.data?.message ?? `Unable to ${editingProduct ? "update" : "create"} product`
            showToast(errorMessage, "error")
        }
    }

    function openDeleteProductModal(product) {
        setProductToDelete(product)
    }

    function closeDeleteProductModal() {
        if (isDeleting) return
        setProductToDelete(null)
    }

    async function confirmDeleteProduct() {
        if (!productToDelete?.id) return

        setIsDeleting(true)
        try {
            await api.delete(`/api/v1/product/${productToDelete.id}/`, {
                headers: {},
            })
            showToast("Product deleted successfully", "success")
            setProductToDelete(null)
            await fetchProducts()
        } catch (error) {
            const errorMessage = error?.response?.data?.message ?? "Unable to delete product"
            showToast(errorMessage, "error")
        } finally {
            setIsDeleting(false)
        }
    }


     const stats = [
        { title: "Total Products", value: "128", change: "12%", icon: faBox, iconClass: "bg-amber-100 text-amber-500", changeClass: "text-green-600",isGreen:false },
        { title: "Total Orders", value: "256", change: "18%", icon: faCartShopping, iconClass: "bg-orange-100 text-orange-500", changeClass: "text-green-600",isGreen:false },
        { title: "Pending Orders", value: "18", change: "6%", icon: faClock, iconClass: "bg-amber-100 text-amber-500", changeClass: "text-orange-600",isGreen:false },
        { title: "Total Revenue", value: "$12,450.00", change: "22%", icon: faDollarSign, iconClass: "bg-green-100 text-green-600", changeClass: "text-green-600",isGreen:true },
     ];




function swichNavHidden(){
    if(hiddenNav == "hidden"){
        sethiddenNav("")
    }
    else{
        sethiddenNav("hidden")
        }
    }

    async function searchProducts(){
      const res =  await api.get(`/api/v1/product/?search=${search}`)
      console.log("Search response is",res)
       setProducts(res.data.results)
       setCount(res.data.count)
    }

    useEffect(()=>{
        searchProducts()
    },[search])
    return(
     <>   
        <div className="min-h-screen flex flex-col  bg-white/55  text-gray-950">
        <aside className="border-b  border-gray-100 flex-col  bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
            <div className=" sticky z-30 top-0 md:static  w-screen  md:w-auto flex flex-row justify-between h-18.5 items-center border-b border-gray-100 px-6 ">
               <Link to="/" className="text-2xl font-black tracking-tight text-gray-950">
                 V<span className="text-amber-500">store</span>
               </Link>

                 <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 lg:hidden" onClick={swichNavHidden} aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={hiddenNav == "hidden" ? faBars : faXmark} className="text-lg"/>
                 </button>
            </div>

            <nav className={`lg:flex flex-col gap-2 overflow-x-auto px-4 py-3 lg:flex-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-5 lg:py-8 + ${hiddenNav}`}>
                {sidebarLinks.map((item) => (
                    <Link
                        key={item.label}
                        to={item.to}
                        className={`flex  md:justify-center h-12 min-w-fit items-center gap-3 rounded-lg px-4 text-sm font-bold transition ${
                            item.divider ? "lg:mt-4 lg:border-t lg:border-gray-100 lg:pt-7" : ""
                        } ${
                            item.active
                                ? "bg-amber-50 text-amber-600 shadow-[inset_3px_0_0_#f59e0b]"
                                : "text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                        }`}
                    >
                        <FontAwesomeIcon icon={item.icon} className="w-5 text-base" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>            
            <div className="lg:pl-60">
                {/* <NavDashboard /> */}
            <header className=" sticky md:top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <nav className="hidden items-center gap-6 text-sm font-bold text-gray-600 md:flex">
                            <Link to="/" className="hover:text-amber-600">Home</Link>
                            <Link to="/products" className="hover:text-amber-600">Products</Link>
                            <Link to="/clientdashboard" className="text-amber-600">Dashboard</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <p className="text-sm font-bold sm:block">John Doe</p>
                            <FontAwesomeIcon icon={faChevronDown} className="hidden text-xs text-gray-500 sm:block" />
                        </div>
                    </div>
                </div>
            </header>


                <main className="px-4 py-7 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-gray-950">Dashboard</h1>
                                <p className="mt-2 text-sm font-medium text-gray-500">Welcome back! Here's what's happening with your store today.</p>
                            </div>
                        </section>

                        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {stats.map((stat,index) => (
                                <CardDashboard key={index} title={stat.title} value={stat.value} helper="Hello" icon={stat.icon} footerIcon={stat.icon} isGreen={stat.isGreen} />
                            ))}
                        </section>

                        <section className="mt-9 rounded-lg border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Products</h2>
                                    <p className="mt-2 text-sm font-medium text-gray-500">Manage and monitor all your store products.</p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <label className="relative block sm:w-72">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="search"
                                            onChange={(e)=>setSearch(e.target.value)}
                                            placeholder="Search products..."
                                            className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm font-medium outline-none focus:border-amber-400"
                                        />
                                    </label>
                                    <button type="button" className="flex h-12 items-center justify-center gap-3 rounded-lg bg-amber-500 px-5 text-sm font-black text-white shadow-sm shadow-amber-200 hover:bg-amber-600"
                                     onClick={openCreateProductModal}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        Create Product
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-255 text-left text-sm">
                                    <thead className="border-b border-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-1 py-5 font-black">Product</th>
                                            <th className="px-4 py-5 font-black">Price</th>
                                            <th className="px-4 py-5 font-black">Stock</th>
                                            <th className="px-4 py-5 text-right font-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product.id ?? product.name} className="hover:bg-amber-50/30">
                                                <td className="px-4 py-4 font-medium text-gray-800">{product.name}</td>
                                                <td className="px-4 py-4 font-medium text-gray-950">{product.price} XAF</td>
                                                <td className="px-4 py-4 font-medium text-gray-950">{product.quantity}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600" aria-label={`Edit ${product.name}`}
                                                        onClick={() => openEditProductModal(product)}
                                                        >
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600" aria-label={`Delete ${product.name}`} onClick={() => openDeleteProductModal(product)}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col justify-between gap-4 pt-7 text-sm sm:flex-row sm:items-center">
                                <p className="font-medium text-gray-950">Showing {page} to {totalPages} of {count} products</p>
                                <div className="flex items-center gap-2">
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
                        </section>
                    </div>
                </main>
            </div>
        </div>
            <Modal isOpen={createProdcut} onClose={() => {
                setCreateProduct(false)
                resetCreateProductForm()
            }} >
              <form className="mx-auto w-full max-w-4xl p-6" onSubmit={submitCreateProduct}>
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-500">Inventory</p>
                        <h3 className="text-2xl font-black text-gray-950">{editingProduct ? "Update product" : "Create product"}</h3>
                    </div>
                    <button
                        type="button"
                        className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-600"
                        onClick={() => {
                            setCreateProduct(false)
                            resetCreateProductForm()
                        }}
                    >
                        Close
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-950">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleCreateProductChange}
                                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                                placeholder="Nike shoe"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-950">Price (XAF)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleCreateProductChange}
                                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                                placeholder="2000"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-950">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleCreateProductChange}
                                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400"
                                placeholder="50"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-gray-950">Product Image</label>
                        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Product preview" className="max-h-60 w-full rounded-xl object-cover" />
                            ) : (
                                <div className="space-y-2 text-sm text-gray-500">
                                    <p className="font-semibold text-gray-700">Upload an image</p>
                                    <p>Choose a product image to be seen in the catalog.</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleCreateProductChange}
                            className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-black text-white shadow-sm shadow-amber-200 hover:bg-amber-600">
                        {editingProduct ? "Update Product" : "Create Product"}
                    </button>
                </div>
             </form>
          </Modal>
          <Modal isOpen={Boolean(productToDelete)} onClose={closeDeleteProductModal}>
            <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">Delete product</p>
                        <h3 className="mt-1 text-2xl font-black text-gray-950">Remove {productToDelete?.name}?</h3>
                    </div>
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={closeDeleteProductModal}
                        disabled={isDeleting}
                        aria-label="Close delete confirmation"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <p className="text-sm font-medium text-gray-600">
                    This action will permanently delete this product from your store inventory.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-black text-gray-700 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={closeDeleteProductModal}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-black text-white shadow-sm shadow-red-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                        onClick={confirmDeleteProduct}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Product"}
                    </button>
                </div>
            </div>
          </Modal>
    </>
    )
}
