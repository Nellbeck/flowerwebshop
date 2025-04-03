"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar"; // Import the navbar
import Footer from "@/components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // Redirect to the checkout page
  const handleGoToCheckout = () => {
    router.push("/cart/checkout");
  };

  // 🔹 Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🔹 Update cart and sync to localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated")); // Ensure Navbar updates
  };

  // 🔹 Update item quantity, allow removal when quantity goes to 0
  const updateQuantity = (productId, change) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) => {
          if (item.Id === productId) {
            const newQuantity = item.quantity + change;
            return {
              ...item,
              quantity: newQuantity <= 0 ? 0 : newQuantity, // Allow quantity to go to 0
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove the product if quantity is 0 or less

      localStorage.setItem("cart", JSON.stringify(newCart)); // Sync with localStorage

      // Delay the Navbar update using setTimeout to avoid React's render phase conflicts
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 0);

      return newCart;
    });
  };

  // 🔹 Calculate total sum
  const totalSum = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#abc1a9]">
      <Navbar />

      {/* 🔹 Cart Content */}
      <main className="container mx-auto py-8 flex-grow">
  <h1 className="font-bold text-center text-2xl text-black m-10">Kundvagn</h1>

  {cart.length === 0 ? (
    <p className="text-black text-lg text-center">Din kundvagn är tom. 🛒</p>
  ) : (
    <div className="text-black p-6 rounded-lg shadow-lg">
      {/* Cart Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto mb-6 text-center">
          <thead>
            <tr className="">
              <th className="px-4 py-2 text-left">Produkt</th>
              <th className="px-4 py-2 text-center">Antal</th>
              <th className="px-4 py-2 text-center">Pris</th>
              <th className="px-4 py-2 text-right">Totalt</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={item.Id || index} className="border-b">
                {/* Product Info */}
                <td className="px-4 py-2 text-left">
                  <div className="flex items-center gap-4">
                    <img src={item.ImageUrl} alt={item.Name} className="w-16 h-16 object-cover rounded-md " />
                    <span className="pr-5">{item.Name}</span>
                  </div>

                </td>

                {/* Quantity Controls */}
                <td className="px-4 py-2 text-center min-w-50">
                  <button
                    className="px-3 py-1"
                    onClick={() => updateQuantity(item.Id, -1)}
                    disabled={item.quantity <= 0}
                  >
                    ➖
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    className="px-3 py-1"
                    onClick={() => updateQuantity(item.Id, 1)}
                    disabled={item.quantity >= item.Stock}
                  >
                    ➕
                  </button>
                </td>

                {/* Price */}
                <td className="px-4 py-2 text-center">{item.Price} SEK</td>

                {/* Total Price */}
                <td className="px-4 py-2 text-right font-semibold">
                  {(item.Price * item.quantity).toFixed(2)} SEK
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Total Sum Section */}
      {cart.length > 0 && (
        <div className="text-right mt-10">
          <h2 className="text-2xl font-bold text-black">Totalt: {totalSum} SEK</h2>
          <button
            onClick={handleGoToCheckout}
            className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Gå till Kassan
          </button>
        </div>
      )}
    </div>
  )}
</main>

<Footer />
    </div>
  );
}
