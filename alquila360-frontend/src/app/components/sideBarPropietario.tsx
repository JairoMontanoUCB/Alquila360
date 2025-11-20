"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const items = [
    { label: "Home", icon: "🏠", href: "/propietarios" },
    { label: "Propiedades", icon: "🏢", href: "/propietarios/propiedades" },
    { label: "Contratos", icon: "📄", href: "/propietarios/contratos" },
    { label: "Pagos", icon: "💳", href: "/propietarios/pagos" },
    { label: "Tickets", icon: "🛠️", href: "/propietarios/tickets" },
    { label: "Expensas", icon: "💰", href: "/expensas" },
    { label: "Perfil", icon: "👤", href: "/perfil" },
  ];

  return (
    <aside className="w-64 bg-[#0a3a2b] text-white flex flex-col">
      {/* LOGO */}
      <div className="px-8 py-6 border-b border-white/10">
        <h1 className="text-[22px] font-extrabold tracking-[0.18em] leading-none">
          ALQUILA 360
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-1 text-[14px]">
        {items.map((item) => {
          const active = path.includes(item.href);

          return (
            <Link
              href={item.href}
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition 
                ${
                  active
                    ? "bg-[#7fa27c] text-white"
                    : "text-gray-100 hover:bg-white/10"
                }`}
            >
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-white/40 text-xs">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-6 border-t border-white/10 text-xs text-gray-100">
        <div className="mb-2">Propietario</div>
        <button className="inline-flex items-center gap-2 text-[11px] text-red-100 hover:text-white">
          <span>⏎</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
