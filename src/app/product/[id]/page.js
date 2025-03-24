"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"; // ✅ Importing the Navbar component

export default function ProductPage() {
    const params = useParams(); // This now ensures params is properly accessed
    const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  // 🟢 Fetch product details when page loads

  useEffect(() => {
    if (!params?.id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/"); // Redirect if product not found
      }
    }

    fetchProduct();
  }, [params?.id, router]);

  // 🟢 Load cart from local storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🟢 Update quantity
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, product.Stock)));
  };

  // 🟢 Add product to cart
  const addToCart = () => {
    if (!product) return;

    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.Id === product.Id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.Stock) return alert("Not enough stock!");

      existingItem.quantity = newQuantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="bg-[#abc1a9] flex flex-col min-h-screen">
      {/* 🔹 Navbar */}
      <Navbar /> 

      {/* 🔹 Product Details */}
      <main className="flex-grow container mx-auto py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 🖼 Product Image */}
          <img
            src={product.ImageUrl}
            alt={product.Name}
            className="w-full h-96 object-cover rounded-md shadow-lg transition-transform transform hover:scale-105"
          />

          {/* 📜 Product Details */}
          <div>
            <h2 className="text-3xl text-black">{product.Name}</h2>
            <p className="text-gray-700 text-lg mt-2">{product.Price} SEK</p>
            <p className={`mt-2 ${product.Stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.Stock > 0 ? `I lager: ${product.Stock}` : "Slut i lager"}
            </p>

            {/* 🔢 Quantity Controls */}
            {product.Stock > 0 && (
              <div className="mt-4 flex items-center">
                <button
                  className="px-4 py-2 text-black rounded-l"
                  onClick={() => handleQuantityChange(-1)}
                >
                  ➖
                </button>
                <span className="px-6 py-2 border border-black text-black">{quantity}</span>
                <button
                  className="px-4 py-2 rounded-r"
                  onClick={() => handleQuantityChange(1)}
                >
                  ➕
                </button>
              </div>
            )}

            {/* 🛒 Add to Cart Button */}
            {product.Stock > 0 ? (
              <button
                className="mt-4 px-6 py-3 text-black hover:bg-green-800 rounded-md border border-black"
                onClick={addToCart}
              >
                Lägg i Varukorgen
              </button>
            ) : (
              <button className="mt-4 px-6 py-3 bg-gray-400 text-white rounded-md w-full" disabled>
                Slut i Lager
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

