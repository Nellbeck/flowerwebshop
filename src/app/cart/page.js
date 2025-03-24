"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ Ensure Link is used for navigation
import Navbar from "../../components/Navbar"; // Import the navbar
import Footer from "@/components/Footer";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  function updateQuantity(productId, change) {
    const updatedCart = cartItems
      .map((item) => {
        if (item.Id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) return null; // Remove item if quantity is 0
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#abc1a9]">
    <Navbar /> 

      {/* 🔹 Cart Content */}
      <main className="container mx-auto py-8 flex-grow">

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty. 🛒</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div key={item.Id} className="p-4 rounded-lg">
                <img src={item.ImageUrl} alt={item.Name} className="w-full h-48 object-contain rounded-md" />
                <h2 className="text-lg mt-2 text-black text-center">{item.Name}</h2>
                <p className="text-gray-600 text-center">{item.Price} SEK</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center mt-2">
                  <button
                    className=" px-3 py-1 rounded-l border border-black"
                    onClick={() => updateQuantity(item.Id, -1)}
                  >➖</button>
                  <span className="px-4 py-1 text-black border border-black">{item.quantity}</span>
                  <button
                    className="px-3 py-1 rounded-r border border-black"
                    onClick={() => updateQuantity(item.Id, 1)}
                  >➕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
        <Footer></Footer>
    </div>
  );
}


