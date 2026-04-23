import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "UC Motors - Rivendita Moto e Scooter",
  description: "UC Motors di Umberto Carrà – Rivendita moto e scooter usate, tagliandi e manutenzione.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F0EB]">{children}</body>
    </html>
  );
}
