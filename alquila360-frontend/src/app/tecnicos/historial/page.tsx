"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Ticket = {
  id: string;
  titulo: string;
  direccion: string;
  fecha: string;
  prioridad: "Urgente" | "Media" | "Baja";
  estado: "Cerrado";
};

const historialTickets: Ticket[] = [
  {
    id: "TKT-004",
    titulo: "Sistema de calefaccion no funciona",
    direccion: "Av. Principal 123, Piso 5",
    fecha: "15/11/2024",
    prioridad: "Urgente",
    estado: "Cerrado",
  },
  {
    id: "TKT-002",
    titulo: "La puerta de entrada no cierra correctamente",
    direccion: "Calle Secundaria 456",
    fecha: "10/10/2024",
    prioridad: "Media",
    estado: "Cerrado",
  },
];

export default function HistorialTecnicoPage() {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `w-full block px-3 py-2 rounded-lg text-sm transition ${
      pathname === href
        ? "bg-[#4b7f5e] font-semibold text-white"
        : "text-slate-100 hover:bg-[#164332]"
    }`;

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* SIDEBAR TECNICO */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/tecnicos" className={linkClasses("/tecnicos")}>
            Home
          </Link>

          <Link
            href="/tecnicos/tickets"
            className={linkClasses("/tecnicos/tickets")}
          >
            Tickets Asignados
          </Link>

          <Link
            href="/tecnicos/historial"
            className={linkClasses("/tecnicos/historial")}
          >
            Historial
          </Link>

          <Link
            href="/tecnicos/perfil"
            className={linkClasses("/tecnicos/perfil")}
          >
            Perfil
          </Link>
        </nav>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs px-2 space-y-1">
          <div className="text-slate-300">Tecnico</div>
          <button className="flex items-center gap-2 text-slate-200 hover:text-white text-xs">
            <span>↪</span>
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Historial de Tickets
          </h1>
          <p className="text-sm text-slate-500">
            Tickets ya atendidos o cerrados
          </p>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Titulo</th>
                <th className="p-3">Direccion</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Prioridad</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialTickets.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.titulo}</td>
                  <td className="p-3">{t.direccion}</td>
                  <td className="p-3">{t.fecha}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full 
                        ${
                          t.prioridad === "Urgente"
                            ? "bg-rose-100 text-rose-700"
                            : t.prioridad === "Media"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      `}
                    >
                      {t.prioridad}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      Cerrado
                    </span>
                  </td>
                </tr>
              ))}

              {historialTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-slate-400"
                  >
                    No hay tickets finalizados para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
