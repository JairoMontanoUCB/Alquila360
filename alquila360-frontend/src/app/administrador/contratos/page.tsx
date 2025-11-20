"use client";

import React from "react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/administrador" },
  { label: "Propiedades", href: "/administrador/propiedades" },
  { label: "Usuarios", href: "/administrador/usuarios" },
  { label: "Contratos", href: "/administrador/contratos" },
  { label: "Pagos", href: "#" },
  { label: "Expensas", href: "#" },
  { label: "Tickets", href: "#" },
  { label: "Reportes", href: "#" },
  { label: "Configuracion", href: "#" },
];

const activeLabel = "Contratos";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  fechaInicio: string;
  fechaFin: string;
  cuotaMensual: string;
  estado: "Vigente" | "Finalizado";
};

const contratosVigentes: Contrato[] = [
  {
    id: "cont1",
    propiedad: "Calle Secundaria 456",
    inquilino: "Maria Garcia",
    fechaInicio: "31/12/2023",
    fechaFin: "31/12/2024",
    cuotaMensual: "$250",
    estado: "Vigente",
  },
];

export default function ContratosPage() {
  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* sidebar */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.label === activeLabel;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full block px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-[#4b7f5e] font-semibold"
                    : "hover:bg-[#164332]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/20 pt-4 px-2 text-xs space-y-1">
          <div>Administrador</div>
          <button className="text-slate-200 hover:underline">
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* contenido contratos */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Contratos
            </h1>
            <p className="text-sm text-slate-500">
              Historial de contratos de alquiler
            </p>
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
            Nuevo Contrato
          </button>
        </header>

        {/* tabla contratos vigentes */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Inquilino</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Fecha Fin</th>
                <th className="p-3">Cuota Mensual</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contratosVigentes.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.propiedad}</td>
                  <td className="p-3">{c.inquilino}</td>
                  <td className="p-3">{c.fechaInicio}</td>
                  <td className="p-3">{c.fechaFin}</td>
                  <td className="p-3">{c.cuotaMensual}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200">
                        👁️
                      </button>
                      <button className="px-3 py-1 rounded-lg text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                        Renovar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contratosVigentes.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-400">
                    No hay contratos vigentes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* historial contratos finalizados */}
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-[#123528] mb-2">
            Historial de Contratos Finalizados
          </h2>
          <p className="text-sm text-slate-500">
            No hay contratos finalizados para mostrar.
          </p>
        </div>
      </section>
    </main>
  );
}
