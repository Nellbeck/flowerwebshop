import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black text-black py-6">
      <div className="flex justify-between max-w-[1000px] mx-auto px-6">

        {/* Opening hours - Left side */}
        <div>
          <h3 className="text-lg">Öppettider</h3>
          <ul className="mt-2">
            <li>Måndag: 10:00–18:00</li>
            <li>Tisdag: 10:00–18:00</li>
            <li>Onsdag: 10:00–18:00</li>
            <li>Torsdag: 10:00–18:00</li>
            <li>Fredag: 10:00–18:00</li>
            <li>Lördag: 10:00–15:00</li>
            <li>Söndag: <span>STÄNGT</span></li>
          </ul>
        </div>

        {/* Navigation Links - Right side */}
        <div className="flex flex-col items-end">
          <Link href="/" className="hover:underline">Hem</Link>
          <Link href="/contact" className="hover:underline">Kontakt</Link>
        </div>
      </div>

      {/* Copyright text centered below */}
      <p className="text-center mt-6 text-lg">© 2025 Blåklinten Blommor. Alla rättigheter förbehållna.</p>
    </footer>
  );
}


