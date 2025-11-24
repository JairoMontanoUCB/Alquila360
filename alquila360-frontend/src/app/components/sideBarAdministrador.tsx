"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarAdministrador() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: "📊", href: "/administrador" },
    { label: "Propiedades", icon: "🏢", href: "/administrador/propiedades" },
    { label: "Usuarios", icon: "👥", href: "/administrador/usuarios" },
    { label: "Contratos", icon: "📄", href: "/administrador/contratos" },
    { label: "Pagos", icon: "💳", href: "/administrador/pagos" },
    { label: "Cuotas", icon: "💰", href: "/administrador/cuotas" },
    { label: "Tickets", icon: "🎫", href: "/administrador/tickets" },
    { label: "Reportes", icon: "📑", href: "/administrador/reportes" },
    { label: "Configuración", icon: "⚙️", href: "/administrador/configuracion" },
  ];

  return (
    <aside className="w-64 bg-[#0a3a2b] text-white flex flex-col min-h-screen">
      {/* LOGO */}
      <div className="px-8 py-6 border-b border-white/10">
        <h1 className="text-[22px] font-extrabold tracking-[0.18em] leading-none">
          ALQUILA 360
        </h1>
        <p className="text-xs text-gray-300 mt-1">Administrador</p>
      </div>

      {/* MENÚ */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                ${
                  isActive
                    ? "bg-[#7fa27c] text-white"
                    : "text-gray-100 hover:bg-white/10"
                }
              `}
            >
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-white/40 text-xs">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-white/10 text-xs text-gray-100">
        <div className="mb-2">Administrador</div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-[11px] text-red-100 hover:text-white"
        >
          <span>⏎</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
