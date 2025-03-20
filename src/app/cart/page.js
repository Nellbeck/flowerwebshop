"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ Ensure Link is used for navigation
import Navbar from "../../components/Navbar"; // Import the navbar

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
    <div className="min-h-screen flex flex-col bg-white">
    <Navbar /> 

      {/* 🔹 Cart Content */}
      <main className="container mx-auto py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-black">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty. 🛒</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div key={item.Id} className="bg-white shadow-md p-4 rounded-lg border border-black">
                <img src={item.ImageUrl} alt={item.Name} className="w-full h-48 object-contain rounded-md" />
                <h2 className="text-lg font-bold mt-2 text-black">{item.Name}</h2>
                <p className="text-gray-600">{item.Price} SEK</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center mt-2">
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-l"
                    onClick={() => updateQuantity(item.Id, -1)}
                  >➖</button>
                  <span className="px-4 text-black">{item.quantity}</span>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-r"
                    onClick={() => updateQuantity(item.Id, 1)}
                  >➕</button>
                </div>

                {/* 🗑 Remove Button */}
                <button
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => updateQuantity(item.Id, -item.quantity)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔹 Sticky Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>© 2025 Flower Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}


