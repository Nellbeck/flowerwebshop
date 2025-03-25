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

  // 🔹 Update item quantity
  const updateQuantity = (productId, change) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) =>
          item.Id === productId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0); // Remove item if quantity reaches 0
  
      localStorage.setItem("cart", JSON.stringify(newCart)); // Sync with localStorage
      
      // Delay the Navbar update using setTimeout to avoid React's render phase conflicts
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 0);
  
      return newCart;
    });
  };
  
  
  
  // 🔹 Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.Id !== id);
    updateCart(updatedCart);
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
            {/* Table Header */}
            <div className="grid grid-cols-4 font-semibold border-b border-black pb-3 text-lg">
              <div className="text-left">Produkt</div>
              <div className="text-center">Antal</div>
              <div className="text-center">Pris</div>
              <div className="text-right">Totalt</div>
            </div>

            {/* Cart Items */}
            {cart.map((item, index) => (
              <div key={item.Id || index} className="grid grid-cols-4 items-center py-4 border-b border-black">
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img src={item.ImageUrl} alt={item.Name} className="w-16 h-16 object-cover rounded-md" />
                  <span className="text-black">{item.Name}</span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center">
                  <button className="px-3 py-1" onClick={() => updateQuantity(item.Id, -1)}>➖</button>
                  <span className="px-4">{item.quantity}</span>
                  <button className="px-3 py-1" onClick={() => updateQuantity(item.Id, 1)}>➕</button>
                </div>

                {/* Price */}
                <div className="text-center">{item.Price} SEK</div>

                {/* Total Price */}
                <div className="text-right font-semibold">{(item.Price * item.quantity).toFixed(2)} SEK</div>
              </div>
            ))}

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
