import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-black text-black py-6">
      <div className="flex justify-between max-w-[1000px] mx-auto px-6">

        {/* Opening hours - Left side */}
        <div>
          <h3 className="text-lg font-bold">Öppettider</h3>
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
          <section className="text-right">
          <h2 className="font-bold text-lg">Kontakta oss</h2>
          <p>Köpmangatan 19 A</p>
          <p>826 30 SÖDERHAMN</p>
          <p>Tel: +4627041487</p>
        </section>
        <section className="my-4 flex flex-col items-end">
        <Link href="/" className="hover:underline">Hem</Link>
        <Link href="/product" className="hover:underline">Varor</Link>


        </section>

        <Link href="/policy" className="hover:underline text-gray-600 text-sm">
          Integritetspolicy
        </Link>
        </div>
      </div>

      <div className="mt-4">
          <Link href="https://www.swish.nu" passHref>
              <Image
                src="/Swish.png"  // Path to your Swish banner
                alt="Swish Payment"
                width={80}  // Adjust the width as needed
                height={50}  // Adjust the height as needed
                className="mx-auto"  // Centering the banner
              />
          </Link>
        </div>

      {/* Copyright text centered below */}
      <p className="text-center mt-6 text-lg">© 2025. Alla rättigheter förbehållna.</p>

    </footer>
  );
}


