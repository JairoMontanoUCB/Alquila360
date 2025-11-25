"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4 min-h-screen">
      <div
        className="text-2xl font-extrabold tracking-wide mb-8 px-2 cursor-pointer"
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
  const [nombre, setNombre] = useState("Maria Garcia");
  const [email, setEmail] = useState("maria.garcia@example.com");
  const [telefono, setTelefono] = useState("555-5678");
  const [rol] = useState("Inquilino");

  const handleGuardar = () => {
    // aqui conectarias con tu backend para actualizar
    alert("Perfil actualizado correctamente");
    console.log({ nombre, email, telefono });
  };

  const handleCerrarSesion = () => {
    alert("Cerrando sesion...");
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
          <p className="text-sm text-slate-500">
            Informacion de tu cuenta de inquilino
          </p>
        </header>

        {/* Card de perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-8 py-6 max-w-3xl">
          <div className="space-y-4 text-sm">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Telefono */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Telefono
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Rol */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Rol
              </label>
              <p className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {rol}
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleGuardar}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleCerrarSesion}
              className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
