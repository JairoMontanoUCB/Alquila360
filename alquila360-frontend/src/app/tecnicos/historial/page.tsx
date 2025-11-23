"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ---------------------------- Sidebar Tecnico ---------------------------- */

const tecnicoMenu = [
  { label: "Home", path: "/tecnicos" },
  { label: "Tickets Asignados", path: "/tecnicos/tickets" },
  { label: "Historial", path: "/tecnicos/historial" },
  { label: "Perfil", path: "/tecnicos/perfil" },
];

function SidebarTecnico() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
      <div
        className="text-2xl font-extrabold tracking-wide mb-10 px-2 cursor-pointer"
        onClick={() => router.push("/tecnicos")}
      >
        ALQUILA 360
      </div>

      <nav className="flex-1 space-y-1">
        {tecnicoMenu.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                active ? "bg-[#4b7f5e] font-semibold" : "hover:bg-[#164332]"
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 px-2 text-xs text-slate-300">Tecnico</div>
      <button className="mt-2 px-3 py-2 text-xs text-slate-200 hover:bg-[#164332] rounded-lg text-left">
        Cerrar sesion
      </button>
    </aside>
  );
}

/* ------------------------------- Datos Mock ------------------------------ */

type Ticket = {
  id: string;
  descripcion: string;
  propiedad: string;
  prioridad: "Urgente" | "Media" | "Baja";
  fechaCreacion: string;
  fechaFin: string;
  estado: "Cerrado";
};

const ticketsFinalizados: Ticket[] = [
  {
    id: "TKT-004",
    descripcion: "Sistema de calefaccion no funciona",
    propiedad: "Av. Principal 123, Piso 5",
    prioridad: "Urgente",
    fechaCreacion: "2024-11-01",
    fechaFin: "2025-11-22",
    estado: "Cerrado",
  },
];

/* ---------------------------- Pagina Historial --------------------------- */

export default function HistorialTicketsTecnicoPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const totalFinalizados = ticketsFinalizados.length;
  const urgentesResueltos = ticketsFinalizados.filter(
    (t) => t.prioridad === "Urgente"
  ).length;
  const esteMes = totalFinalizados; // mock

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarTecnico />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Historial de Tickets
          </h1>
          <p className="text-sm text-slate-500">Trabajos finalizados</p>
        </header>

        {/* Cards resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResumenCard
            titulo="Total Finalizados"
            valor={totalFinalizados.toString()}
            color="text-emerald-600"
          />
          <ResumenCard
            titulo="Urgentes Resueltos"
            valor={urgentesResueltos.toString()}
            color="text-rose-500"
          />
          <ResumenCard
            titulo="Este Mes"
            valor={esteMes.toString()}
            color="text-sky-500"
          />
        </section>

        {/* Filtros (solo UI) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#123528]">
              Filtros
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <FiltroSelect label="Propiedad" placeholder="Todas las propiedades" />
            <FiltroSelect label="Prioridad" placeholder="Todas las prioridades" />
            <FiltroSelect label="Mes" placeholder="Todos los meses" />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-3 py-2 text-xs rounded-lg border border-slate-300 hover:bg-slate-100">
              Limpiar Filtros
            </button>
          </div>
        </section>

        {/* Tabla Tickets Finalizados */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 text-sm">
            <span className="font-semibold text-[#123528]">
              Tickets Finalizados
            </span>
            <span className="text-xs text-slate-400">
              Mostrando {ticketsFinalizados.length} de {ticketsFinalizados.length} tickets
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="p-3">Ticket</th>
                <th className="p-3">Descripcion</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Prioridad</th>
                <th className="p-3">Fecha Creacion</th>
                <th className="p-3">Fecha Finalizacion</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ticketsFinalizados.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="p-3 text-xs md:text-sm">{t.id}</td>
                  <td className="p-3 text-xs md:text-sm">{t.descripcion}</td>
                  <td className="p-3 text-xs md:text-sm">{t.propiedad}</td>
                  <td className="p-3 text-xs md:text-sm">
                    <PrioridadBadge prioridad={t.prioridad} />
                  </td>
                  <td className="p-3 text-xs md:text-sm">{t.fechaCreacion}</td>
                  <td className="p-3 text-xs md:text-sm">{t.fechaFin}</td>
                  <td className="p-3 text-xs md:text-sm">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="px-3 py-1 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Grafiquitos de barras simples (como en la maqueta) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SmallBarCard
            title="Urgentes"
            total={1}
            colorClass="bg-rose-500"
          />
          <SmallBarCard
            title="Media"
            total={0}
            colorClass="bg-amber-400"
          />
          <SmallBarCard
            title="Baja"
            total={0}
            colorClass="bg-emerald-500"
          />
        </section>
      </section>

      {/* Modal Detalles Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#f7f5ee] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-emerald-900/20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/20">
              <div>
                <h2 className="text-lg font-extrabold text-[#123528]">
                  Detalles del Ticket {selectedTicket.id}
                </h2>
                <p className="text-xs text-slate-500">
                  Informacion completa del ticket
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 text-sm">
              {/* Prioridad / Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-900/20 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Prioridad</p>
                  <PrioridadBadge prioridad={selectedTicket.prioridad} />
                </div>
                <div className="border border-emerald-900/20 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Estado Actual</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                    Cerrado
                  </span>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Subestado: Pagado
                  </p>
                </div>
              </div>

              {/* Info propiedad */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-white/60">
                <p className="text-xs text-slate-500 mb-1">
                  Informacion de la Propiedad
                </p>
                <p className="text-sm font-semibold text-[#123528]">
                  Direccion:
                  <span className="font-normal ml-1">{selectedTicket.propiedad}</span>
                </p>
                <p className="text-sm">
                  Tipo: <span className="text-slate-600">Casa</span>
                </p>
                <p className="text-sm">
                  Tipo de Ticket:{" "}
                  <span className="text-slate-600">Climatizacion</span>
                </p>
              </div>

              {/* Descripcion */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                <p className="text-xs text-slate-500 mb-1">
                  Descripcion del Problema
                </p>
                <p className="text-sm text-slate-700">
                  {selectedTicket.descripcion}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-emerald-900/10 bg-white/70 rounded-b-xl">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Subcomponentes ---------------------------- */

type ResumenProps = {
  titulo: string;
  valor: string;
  color: string;
};

function ResumenCard({ titulo, valor, color }: ResumenProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <span className="text-xs text-slate-500">{titulo}</span>
      <span className={`text-2xl font-bold mt-2 ${color}`}>{valor}</span>
    </div>
  );
}

type FiltroProps = {
  label: string;
  placeholder: string;
};

function FiltroSelect({ label, placeholder }: FiltroProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500">{label}</label>
      <div className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-xs text-slate-600 flex justify-between items-center">
        <span>{placeholder}</span>
        <span>▾</span>
      </div>
    </div>
  );
}

function PrioridadBadge({ prioridad }: { prioridad: Ticket["prioridad"] }) {
  const styles =
    prioridad === "Urgente"
      ? "bg-rose-50 text-rose-600 border-rose-200"
      : prioridad === "Media"
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-emerald-50 text-emerald-600 border-emerald-200";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}
    >
      {prioridad}
    </span>
  );
}

type SmallBarProps = {
  title: string;
  total: number;
  colorClass: string;
};

function SmallBarCard({ title, total, colorClass }: SmallBarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${colorClass} w-4/5`} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Total: <span className="font-semibold text-slate-700">{total}</span>
      </p>
    </div>
  );
}
