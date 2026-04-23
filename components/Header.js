"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vetrina", label: "Vetrina" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="UC Motors"
              width={200}
              height={60}
              className="h-9 w-auto md:h-11"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "text-[#E8000E]"
                    : "text-[#333333] hover:text-[#E8000E]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/tagliando"
              className="bg-[#E8000E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
            >
              Prenota Tagliando
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-[#333333] transition-all duration-200 origin-center ${
                  open ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#333333] transition-all duration-200 ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#333333] transition-all duration-200 origin-center ${
                  open ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          open ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-red-50 text-[#E8000E]"
                  : "text-[#333333] hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/tagliando"
            onClick={() => setOpen(false)}
            className="block mt-2 bg-[#E8000E] text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center hover:bg-red-700 transition-colors"
          >
            Prenota Tagliando
          </Link>
        </div>
      </div>
    </header>
  );
}
