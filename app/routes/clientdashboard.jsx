import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBagShopping,
    faBell,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faCircleCheck,
    faHourglassHalf,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import CardDashboard from "../component/dashboardcard";
import { Link } from "react-router";

export default function ClientDashboard(){
    const orders = [
        { id: "#ORD-00024", date: "May 15, 2026", products: "2 items", total: "129.98 XAF", status: "Pending", statusClass: "bg-amber-100 text-amber-700" },
        { id: "#ORD-00023", date: "May 12, 2026", products: "1 item", total: "79.99 XAF", status: "Pending", statusClass: "bg-amber-100 text-amber-700" },
        { id: "#ORD-00022", date: "May 10, 2026", products: "2 items", total: "49.98 XAF", status: "Processing", statusClass: "bg-blue-100 text-blue-700" },
        { id: "#ORD-00021", date: "May 5, 2026", products: "1 item", total: "39.99 XAF", status: "Delivered", statusClass: "bg-green-100 text-green-700" },
        { id: "#ORD-00020", date: "Apr 28, 2026", products: "2 items", total: "149.98 XAF", status: "Delivered", statusClass: "bg-green-100 text-green-700" },
        { id: "#ORD-00019", date: "Apr 20, 2026", products: "1 item", total: "69.99 XAF", status: "Delivered", statusClass: "bg-green-100 text-green-700" },
        { id: "#ORD-00018", date: "Apr 15, 2026", products: "1 item", total: "59.99 XAF", status: "Delivered", statusClass: "bg-green-100 text-green-700" },
    ]

    return(
        <div className="min-h-screen bg-white text-gray-950">
            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-2xl font-black tracking-tight text-gray-950">
                            V<span className="text-amber-500">store</span>
                        </Link>
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
                            <p className="hidden text-sm font-bold sm:block">John Doe</p>
                            <FontAwesomeIcon icon={faChevronDown} className="hidden text-xs text-gray-500 sm:block" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-gray-50/60">
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <section>
                        <h1 className="text-3xl font-black tracking-tight text-gray-950">Welcome back, John!</h1>
                        <p className="mt-2 text-gray-500">Here's an overview of your orders.</p>
                    </section>

                    <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                        <CardDashboard title="Total Orders" value="24" helper="All time orders" icon={faBagShopping} footerIcon={faBagShopping} />
                        <CardDashboard title="Pending Orders" value="5" helper="Awaiting processing" icon={faHourglassHalf} footerIcon={faHourglassHalf} />
                        <CardDashboard title="Successful Orders" value="19" helper="Successfully delivered" icon={faCircleCheck} footerIcon={faCircleCheck} isGreen={true} />
                    </section>

                    <section className="mt-8 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
                            <h2 className="text-xl font-black">Your Orders</h2>
                            <select className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-400">
                                <option>All Orders</option>
                                <option>Pending</option>
                                <option>Processing</option>
                                <option>Delivered</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left text-sm">
                                <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-4 font-black">Order ID</th>
                                        <th className="px-5 py-4 font-black">Date</th>
                                        <th className="px-5 py-4 font-black">Products</th>
                                        <th className="px-5 py-4 font-black">Total</th>
                                        <th className="px-5 py-4 font-black">Status</th>
                                        <th className="px-5 py-4 text-right font-black">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-amber-50/30">
                                            <td className="px-5 py-5 font-bold text-gray-950">{order.id}</td>
                                            <td className="px-5 py-5 text-gray-700">{order.date}</td>
                                            <td className="px-5 py-5 text-gray-700">{order.products}</td>
                                            <td className="px-5 py-5 font-bold text-gray-950">{order.total}</td>
                                            <td className="px-5 py-5">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${order.statusClass}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5 text-right">
                                                <button className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col justify-between gap-4 border-t border-gray-100 px-5 py-5 text-sm sm:flex-row sm:items-center">
                            <p className="font-medium text-gray-700">Showing 1 to 7 of 24 orders</p>
                            <div className="flex items-center gap-2">
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600" aria-label="Previous page">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                {[1, 2, 3, 4].map((page) => (
                                    <button
                                        key={page}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${
                                            page === 1
                                                ? "border-amber-500 bg-amber-500 text-white"
                                                : "border-gray-200 text-gray-700 hover:border-amber-300 hover:text-amber-600"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600" aria-label="Next page">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
