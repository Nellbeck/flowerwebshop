"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#abc1a9]">
      <Navbar />
      {/* 🔹 Product Grid */}
      <main className="container mx-auto py-18">
        <h3 className="text-3xl mb-6 text-black text-center">Alla Varor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product.Id} href={`/product/${product.Id}`} className="block">
              <div className="p-6 rounded-lg transform transition-transform hover:scale-105 cursor-pointer">
                <img
                  src={product.ImageUrl}
                  alt={product.Name}
                  className="w-full h-56 object-cover rounded-md"
                />
                <h4 className="text-xl mt-3 text-black text-center">{product.Name}</h4>
                <p className="text-gray-700 font-medium mt-2 text-center">{product.Price} SEK</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

