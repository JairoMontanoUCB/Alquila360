"use client";

import React from "react";

/* ------- Tipos y datos de ejemplo ------- */

type TicketFinalizado = {
  id: string;
  descripcion: string;
  propiedad: string;
  prioridad: "Urgente" | "Media" | "Baja";
  fechaCreacion: string;
  fechaFin: string;
};

const ticketsFinalizados: TicketFinalizado[] = [
  {
    id: "TKT-004",
    descripcion: "Sistema de calefaccion no funciona",
    propiedad: "Av. Principal 123, Piso 5",
    prioridad: "Urgente",
    fechaCreacion: "2024-11-01",
    fechaFin: "2025-11-22",
  },
];

export default function HistorialTicketsTecnicoPage() {
  const totalFinalizados = ticketsFinalizados.length;
  const urgentesResueltos = ticketsFinalizados.filter(
    (t) => t.prioridad === "Urgente"
  ).length;

  // para el ejemplo: ninguno este mes
  const esteMes = 0;

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* SIDEBAR TECNICO */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem label="Home" />
          <SidebarItem label="Tickets Asignados" />
          <SidebarItem label="Historial" active />
          <SidebarItem label="Perfil" />
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
        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Historial de Tickets
          </h1>
          <p className="text-sm text-slate-500">Trabajos finalizados</p>
        </header>

        {/* CARDS RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResumenCard
            title="Total Finalizados"
            value={totalFinalizados.toString()}
            bg="emerald"
          />
          <ResumenCard
            title="Urgentes Resueltos"
            value={urgentesResueltos.toString()}
            bg="rose"
          />
          <ResumenCard title="Este Mes" value={esteMes.toString()} bg="indigo" />
        </section>

        {/* FILTROS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#123528] mb-4">
            <span>⚗️</span>
            <span>Filtros</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <FilterField label="Propiedad">
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50">
                <option>Todas las propiedades</option>
                <option>Av. Principal 123, Piso 5</option>
              </select>
            </FilterField>

            <FilterField label="Prioridad">
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50">
                <option>Todas las prioridades</option>
                <option>Urgente</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </FilterField>

            <FilterField label="Mes">
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50">
                <option>Todos los meses</option>
              </select>
            </FilterField>

            <div className="flex justify-end">
              <button className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* TABLA TICKETS FINALIZADOS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between text-xs text-slate-500">
            <span className="font-semibold text-[#123528]">
              Tickets Finalizados
            </span>
            <span>
              Mostrando {ticketsFinalizados.length} de {ticketsFinalizados.length}{" "}
              tickets
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Ticket</th>
                  <th className="text-left px-4 py-3">Descripcion</th>
                  <th className="text-left px-4 py-3">Propiedad</th>
                  <th className="text-left px-4 py-3">Prioridad</th>
                  <th className="text-left px-4 py-3">Fecha Creacion</th>
                  <th className="text-left px-4 py-3">Fecha Finalizacion</th>
                  <th className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ticketsFinalizados.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {t.id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t.descripcion}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{t.propiedad}</td>
                    <td className="px-4 py-3">
                      <PrioridadBadge prioridad={t.prioridad} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {t.fechaCreacion}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{t.fechaFin}</td>
                    <td className="px-4 py-3">
                      <button className="px-4 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold">
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}

                {ticketsFinalizados.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No hay tickets finalizados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* GRAFICO SIMPLE DE RESUMEN POR PRIORIDAD (FAKE BARS) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <PrioridadCard label="Urgentes" value={1} color="rose" />
          <PrioridadCard label="Media" value={0} color="amber" />
          <PrioridadCard label="Baja" value={0} color="emerald" />
        </section>
      </section>
    </main>
  );
}

/* ----------------- COMPONENTES AUXILIARES ----------------- */

type SidebarItemProps = {
  label: string;
  active?: boolean;
};

function SidebarItem({ label, active }: SidebarItemProps) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition ${
        active
          ? "bg-[#4b7f5e] font-semibold"
          : "hover:bg-[#164332] text-slate-100"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

type ResumenCardProps = {
  title: string;
  value: string;
  bg: "emerald" | "rose" | "indigo";
};

function ResumenCard({ title, value, bg }: ResumenCardProps) {
  const map: Record<typeof bg, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between`}
    >
      <div>
        <span className="text-xs text-slate-500">{title}</span>
        <div className="text-2xl font-bold text-[#123528] mt-1">{value}</div>
      </div>
      <div
        className={`px-4 py-1 rounded-full text-[11px] font-semibold ${map[bg]}`}
      >
        {title}
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function PrioridadBadge({
  prioridad,
}: {
  prioridad: TicketFinalizado["prioridad"];
}) {
  const base = "px-3 py-1 rounded-full text-[11px] font-semibold";

  if (prioridad === "Urgente") {
    return (
      <span
        className={`${base} bg-rose-50 text-rose-700 border border-rose-200`}
      >
        Urgente
      </span>
    );
  }
  if (prioridad === "Media") {
    return (
      <span
        className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}
      >
        Media
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200`}
    >
      Baja
    </span>
  );
}

function PrioridadCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "rose" | "amber" | "emerald";
}) {
  const barColor: Record<typeof color, string> = {
    rose: "bg-rose-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{label}</h3>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${barColor[color]}`}
          style={{ width: `${value > 0 ? 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
