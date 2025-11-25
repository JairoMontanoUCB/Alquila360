"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-[#063F2E]">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white">
        Alquila360
      </Link>

      {/* Botones amarillos */}
      <div className="flex gap-4">
        <Link href="/signup">
          <button className="bg-[#FFC300] text-black font-medium px-5 py-2 rounded-full hover:bg-[#eab308] transition">
            Sign up
          </button>
        </Link>

        <Link href="/login">
          <button className="bg-[#FFC300] text-black font-medium px-5 py-2 rounded-full hover:bg-[#eab308] transition">
            Log in
          </button>
        </Link>
      </div>
    </nav>
  );
}

