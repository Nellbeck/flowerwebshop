import Link from "next/link";

export default function Navbar({ cartCount }) {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-black">
          <Link href="/">Blåklinten</Link>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex gap-6 text-gray-700">
            <li><Link href="/" className="hover:text-green-500">Home</Link></li>
            <li><Link href="/contact" className="hover:text-green-500">Contact</Link></li>
          </ul>
        </nav>

        <div className="relative">
            <input 
              type="text" 
              placeholder="Search flowers..." 
              className="bg-black text-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-green-400"
            />
            <svg className="absolute left-3 top-3 w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A8.5 8.5 0 1010.5 19a8.5 8.5 0 006.15-2.85z" />
            </svg>
          </div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-black">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
      </div>
    </header>
  );
}
