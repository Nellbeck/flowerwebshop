"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "@/components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulate a delay for the database to wake up, or fetch data
    const timer = setTimeout(() => {
      setIsLoading(false); // Data is now "loaded"
    }, 2000); // Adjust this delay according to your actual data load time

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

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

  const updateCartCount = (cart) => {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  };

  const updateQuantity = (productId, change) => {
    let updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.Id === productId);
    const product = products.find((p) => p.Id === productId);

    if (!product) return;

    if (existingItem) {
      existingItem.quantity += change;
      if (existingItem.quantity <= 0) {
        updatedCart = updatedCart.filter((item) => item.Id !== productId);
      }
    } else if (change > 0) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount(updatedCart);
  };

  return (
    <div className="min-h-screen bg-[#abc1a9]">
      <Navbar cartCount={cartCount} />

      {/* 🔹 Hero Section */}
      <section className="relative h-[1000px] bg-cover bg-center flex items-center justify-center text-center bg-[#abc1a9]">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="https://videos.pexels.com/video-files/4269187/4269187-uhd_2732_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 bg-black/40 p-8 rounded-lg text-white max-w-lg">
        <h2 className="text-5xl font-bold">Vackra Blommor för Alla Tillfällen</h2>
        <p className="text-lg mt-2 font-light">Skicka omtanke med noggrant utvalda buketter.</p>
      </div>
      </section>

      {/* 🔹 Product Grid */}
      <main className="container mx-auto py-12 border-b border-black">
        <h3 className="text-3xl mb-6 text-black text-center">Buketter</h3>

        <section className="overflow-x-auto">
          {/* Show loading message while data is being fetched */}
          {isLoading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Vänligen vänta, laddar...</p>
            </div>
          ) : (
            <div className="flex justify-center gap-8 min-w-max">
              {products.slice(0, 4).map((product) => (
                <Link key={product.Id} href={`/product/${product.Id}`} className="block inline-block">
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
          )}
        </section>

        <div className="text-center mt-8">
          <Link href="/product" className="bg-green-800 text-white px-6 py-3 rounded-md hover:bg-green-900">
            Se Alla Varor
          </Link>
        </div>
      </main>

      
      {/* 🔹 Inspiration Section */}
      <section className="container mx-auto py-12 border-b border-black">
        <h3 className="text-3xl mb-6 text-black text-center"></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mx-4">
          <img 
            src="https://static.bonniernews.se/ba/4fc79006-8d62-45cd-9e2b-9319e123543d.jpeg?width=640&format=pjpg&auto=webp" 
            alt="Beautiful flower bouquet shaped as a heart"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://hitta.florist/images/AWYs27w3vsXMHLI2i5BZmKtaHKf8iB_zGMz6PKQypXB4zYRvjk00RRPXTqtvNy39LshGT4VK65SlgUnCDv8Q28gVTO-dCvn3gCjkyvYNmNXenuStaJvkgf2qz0A_0rm7cjf_rSbLADVGJFgSTr_mJu5Nw2TdtyusHPrNhFlQxR-ISwLS5poY.jpg" 
            alt="Mix of flowers"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://static.bonniernews.se/ba/06a4cc1e-0e3d-48b3-9e7e-417330e18ac7.jpeg?width=1400&format=pjpg&auto=webp" 
            alt="Woman with flowers"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="container mx-auto py-10">
        <h3 className="text-3xl mb-6 text-black text-center"></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mx-4">

          <img 
            src="https://i.pinimg.com/736x/47/cb/53/47cb5315c8a455eb04a6bfb951af5af0.jpg" 
            alt="Mix of flowers"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <img 
            src="https://i.pinimg.com/736x/40/d3/26/40d32603f77b7d459817cb27edacc982.jpg" 
            alt="Woman with flowers"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
}
