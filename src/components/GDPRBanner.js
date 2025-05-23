"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const GDPRBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gdprConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gdprConsent", "true");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
        <p className="mb-4">
        Vi använder cookies för att förbättra din upplevelse. Läs mer i vår{" "}
        <Link href="/policy" className="underline">
            integritetspolicy
        </Link>
        .
        </p>
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white px-4 py-2 rounded-md ml-4"
        >
          Jag förstår
        </button>
      </div>
    )
  );
};

export default GDPRBanner;
