"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Function to update cart count from localStorage
  const updateCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = storedCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  };

  // 🔄 Listen for cart updates dynamically
  useEffect(() => {
    updateCart(); // Initialize cart count on mount

    // ✅ Listen for custom "cartUpdated" event
    const handleCartUpdate = () => updateCart();
    window.addEventListener("cartUpdated", handleCartUpdate);

    // ✅ Listen for direct changes to localStorage (incase user updates cart in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "cart") updateCart();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-transparent hover:bg-white transition-colors duration-300 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        {/* <h1 className="text-3xl font-serif text-black">
          <Link href="/">Blåklinten</Link>
        </h1> */}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-lg text-gray-700 font-light">
          <Link href="/" className="hover:text-green-500 transition duration-300">Hem</Link>
          <Link href="/contact" className="hover:text-green-500 transition duration-300">Kontakt</Link>
        </nav>

        {/* Cart Icon */}
        <Link href="/cart" className="relative text-green-700 text-2xl hidden md:flex">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile Menu - Cart & Hamburger */}
        <div className="flex items-center justify-between w-full md:hidden">

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-4 text-3xl text-black focus:outline-none"
          >
            ☰
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-green-700 text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white shadow-lg border-t border-gray-200">
          <Link href="/" className="py-3 w-full text-center text-lg text-gray-700 hover:text-green-500 transition duration-300 border-b" onClick={() => setIsOpen(false)}>Hem</Link>
          <Link href="/contact" className="py-3 w-full text-center text-lg text-gray-700 hover:text-green-500 transition duration-300 border-b" onClick={() => setIsOpen(false)}>Kontakt</Link>
        </div>
      )}
    </header>
  );
}
