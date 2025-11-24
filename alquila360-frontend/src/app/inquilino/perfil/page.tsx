"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contrato", path: "/inquilino/contrato" },
  { label: "Pagos", path: "/inquilino/pagos" },
  { label: "Tickets", path: "/inquilino/tickets" },
  { label: "Expensas", path: "/inquilino/expensas" },
  { label: "Perfil", path: "/inquilino/perfil" },
];

function SidebarInquilino() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
      <div
        className="text-2xl font-extrabold tracking-wide mb-10 px-2 cursor-pointer"
        onClick={() => router.push("/inquilino")}
      >
        ALQUILA 360
      </div>

      <nav className="flex-1 space-y-1">
        {inquilinoMenu.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                active ? "bg-[#4b7f5e] font-semibold" : "hover:bg-[#164332]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 px-2 text-xs text-slate-300">Inquilino</div>
      <button className="mt-2 px-3 py-2 text-xs text-slate-200 hover:bg-[#164332] rounded-lg text-left">
        Cerrar Sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                             PAGINA MI PERFIL                               */
/* -------------------------------------------------------------------------- */

export default function PerfilInquilinoPage() {
  // datos mock del perfil
  const perfil = {
    nombre: "Maria Garcia",
    email: "maria.garcia@example.com",
    telefono: "555-5678",
    rol: "Inquilino",
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528] mb-1">
            Mi Perfil
          </h1>
        </header>

        {/* Card de perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-8 py-6 max-w-3xl">
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Nombre</p>
              <p className="font-semibold text-[#123528]">{perfil.nombre}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-semibold text-[#123528]">{perfil.email}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Telefono</p>
              <p className="font-semibold text-[#123528]">{perfil.telefono}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Rol</p>
              <p className="font-semibold text-[#123528]">{perfil.rol}</p>
            </div>
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg">
              Cerrar Sesion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
