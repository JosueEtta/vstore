import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Navbar from "../component/navbar";

const initialFormState = {
  Street: "",
  city: "",
  country: "",
  payment_method: "Cash on delivery",
  order_status: "pending",
  payment_status: "pending",
};

export default function Payment() {
  const cartItems = useSelector((state) => state.items || []);
  const [form, setForm] = useState(initialFormState);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 1;
        return total + price * quantity;
      }, 0),
    [cartItems]
  );

  const transportFee = subtotal > 0 ? 1000 : 0;
  const totalCost = subtotal + transportFee;

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function submitOrder(event) {
    event.preventDefault();

    const payload = {
      amount: totalCost,
      order_status: form.order_status,
      payment_status: form.payment_status,
      payment_method: form.payment_method,
      user_id: 1,
      Street: form.Street,
      city: form.city,
      country: form.country,
    };

    console.log("Order payload ready:", payload);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Checkout</p>
              <h1 className="text-2xl font-black text-slate-950 md:text-3xl">Payment details</h1>
            </div>
            <Link to="/products" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-600">
              Continue shopping
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <section className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-xl font-black text-slate-900">Your cart is empty.</p>
              <p className="mt-2 text-sm text-gray-500">Choose some products first before completing the payment.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-amber-200 hover:bg-amber-600">
                Browse products
              </Link>
            </section>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Order summary</h2>
                    <p className="text-sm text-gray-500">{cartItems.length} item{cartItems.length === 1 ? "" : "s"} ready for checkout</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <article key={`${item.id ?? item.name ?? index}`} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <img
                        src={`http://127.0.0.1:8000${item.image}`}
                        alt={item?.name ?? "Product image"}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-950">{item?.name ?? "Product"}</p>
                            <p className="mt-1 text-sm font-semibold text-amber-600">{Number(item?.price || 0).toLocaleString()} XAF</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-gray-200">
                            Qty {Number(item?.quantity || 1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                          <span>Line total</span>
                          <span className="font-bold text-slate-900">
                            {(Number(item?.price || 0) * Number(item?.quantity || 1)).toLocaleString()} XAF
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{subtotal.toLocaleString()} XAF</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>Transport</span>
                    <span className="font-semibold text-slate-900">{transportFee.toLocaleString()} XAF</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                    <span className="text-base font-black text-slate-950">Total</span>
                    <span className="text-base font-black text-amber-600">{totalCost.toLocaleString()} XAF</span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-950">Delivery and payment</h2>
                  <p className="text-sm text-gray-500">Complete the order form to match your backend `Order` model.</p>
                </div>

                <form className="space-y-4" onSubmit={submitOrder}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                      Street
                      <input
                        type="text"
                        name="Street"
                        value={form.Street}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Enter street"
                        required
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      City
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Enter city"
                        required
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Country
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Enter country"
                        required
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Payment method
                      <select
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                      >
                        <option>Cash on delivery</option>
                        <option>MTN Mobile Money</option>
                        <option>Orange Money</option>
                        <option>Card</option>
                      </select>
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Order status
                      <input
                        type="text"
                        name="order_status"
                        value={form.order_status}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-slate-700">
                      Payment status
                      <input
                        type="text"
                        name="payment_status"
                        value={form.payment_status}
                        onChange={handleFieldChange}
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-amber-400 focus:bg-white"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-bold">Order amount ready for submission</p>
                    <p className="mt-1">{totalCost.toLocaleString()} XAF</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600"
                  >
                    Submit order
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
}