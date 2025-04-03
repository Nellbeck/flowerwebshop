import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import GDPRBanner from "@/components/GDPRBanner";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // Adjust weights as needed
});

export const metadata = {
  title: "Blåklintens blomsterhandel",
  description: "Köp dina blommor hos Blåklinten",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
          {children}
          <GDPRBanner />
      </body>
    </html>
  );
}

