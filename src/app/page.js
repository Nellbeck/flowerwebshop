"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import the navbar

export default function Home() {

    const [products, setProducts] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState([]);
  
    useEffect(() => {
      // Fetch products from API
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : []))
        .catch((error) => console.error("Error fetching products:", error));
  
      // Get cart from localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      updateCartCount(storedCart);
    }, []);
  
    // Update cart count (total items in cart)
    const updateCartCount = (cart) => {
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };

    // 🛒 Add or update product quantity
    const updateQuantity = (productId, change) => {
      let updatedCart = [...cart];
      const existingItem = updatedCart.find((item) => item.Id === productId);
      const product = products.find((p) => p.Id === productId);

      if (!product) return;

      if (existingItem) {
        // Increase or decrease quantity
        existingItem.quantity += change;

        // If quantity is 0, remove the product
        if (existingItem.quantity <= 0) {
          updatedCart = updatedCart.filter((item) => item.Id !== productId);
        }
      } else if (change > 0) {
        // Add new product if it doesn't exist
        updatedCart.push({ ...product, quantity: 1 });
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      updateCartCount(updatedCart);
    };

  return (
    <div className="min-h-screen bg-white">

    <Navbar cartCount={cartCount}  />

      {/* 🔹 Hero Section */}
      <section className="relative h-[500px] bg-cover bg-center text-white flex items-center justify-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="bg-black/50 p-6 text-center rounded">
          <h2 className="text-4xl font-bold">Send Flowers with Love</h2>
          <p className="text-lg mt-2">Beautiful bouquets for every occasion.</p>
        </div>
      </section>

      {/* 🔹 Product Grid */}
      <main className="container mx-auto py-8 bg-white">
        <h3 className="text-2xl font-bold mb-4 text-black">Our Bestsellers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
            const cartItem = cart.find((item) => item.Id === product.Id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const stockLeft = product.Stock - quantity;

            return (
              <div key={product.Id} className="bg-white shadow-md p-4 rounded-lg border border-black">
                <img src={product.ImageUrl} alt={product.Name} className="w-full h-48 object-contain rounded-md"/>
                <h4 className="text-lg font-bold mt-2 text-black">{product.Name}</h4>
                <p className="text-gray-600 mt-1">{product.Description}</p>
                <p className="text-gray-600">{product.Price} SEK</p>

                {/* 🔹 Show quantity controls after first click */}
                {quantity > 0 ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-center">
                      <button className="bg-gray-300 px-3 py-1 rounded-l" onClick={() => updateQuantity(product.Id, -1)}>➖</button>
                      <span className="px-4 text-black">{quantity}</span>
                      <button 
                        className={`px-3 py-1 rounded-r ${stockLeft > 0 ? 'bg-gray-300' : 'bg-gray-500 cursor-not-allowed'}`} 
                        onClick={() => updateQuantity(product.Id, 1)}
                        disabled={stockLeft <= 0}
                      >
                        ➕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className={`mt-2 px-4 py-2 rounded-md w-full ${product.Stock > 0 ? 'bg-green-600 text-white' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={() => updateQuantity(product.Id, 1)}
                    disabled={product.Stock <= 0}
                  >
                    {product.Stock > 0 ? "Buy Now" : "Out of Stock"}
                  </button>
                )}
              </div>
            );
          })}
          </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2025 Flower Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
