"use client";

import React from "react";

type TicketAsignado = {
  id: string;
  descripcion: string;
  propiedad: string;
  prioridad: "Urgente" | "Media" | "Baja";
  fecha: string;
  estado: "Abierto" | "En proceso";
};

const tickets: TicketAsignado[] = [
  {
    id: "TKT-001",
    descripcion: "Fuga de agua en el baño principal",
    propiedad: "Calle Secundaria 456",
    prioridad: "Urgente",
    fecha: "2024-11-18",
    estado: "Abierto",
  },
  {
    id: "TKT-002",
    descripcion: "La puerta de entrada no cierra correctamente",
    propiedad: "Calle Secundaria 456",
    prioridad: "Media",
    fecha: "2024-11-15",
    estado: "En proceso",
  },
];

export default function TicketsAsignadosPage() {
  const abiertos = tickets.filter((t) => t.estado === "Abierto").length;
  const enProceso = tickets.filter((t) => t.estado === "En proceso").length;

  const ticketUrgente = tickets[0];

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* SIDEBAR TECNICO */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem label="Home" />
          <SidebarItem label="Tickets Asignados" active />
          <SidebarItem label="Historial" />
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
            Tickets Asignados
          </h1>
          <p className="text-sm text-slate-500">
            Trabajos pendientes y en proceso
          </p>
        </header>

        {/* CARDS RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ResumenCardSimple
            title="Tickets Abiertos"
            value={abiertos.toString()}
          />
          <ResumenCardSimple
            title="En Proceso"
            value={enProceso.toString()}
            color="amber"
          />
        </section>

        {/* BLOQUE TICKET URGENTE */}
        <section className="bg-red-50 border border-red-300 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-red-700">
            <span>⚠️</span>
            <span>Tickets Urgentes - Requieren Atencion Inmediata</span>
          </div>

          <div className="bg-white rounded-lg border border-red-200 shadow-sm px-4 py-3 max-w-xl">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="font-semibold text-slate-800">
                {ticketUrgente.id}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px]">
                Abierto
              </span>
            </div>

            <p className="text-xs text-slate-800 mb-1">
              {ticketUrgente.descripcion}
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              {ticketUrgente.propiedad}
            </p>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 text-sm">
                🛠️
              </div>
              <button className="flex-1 bg-[#f7a81b] hover:bg-[#ec9a03] text-white text-xs font-semibold py-2 rounded-lg">
                Iniciar
              </button>
            </div>
          </div>
        </section>

        {/* TABLA TODOS LOS TICKETS ASIGNADOS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[#123528] text-sm">
              Todos los Tickets Asignados
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-4 py-3">Ticket</th>
                  <th className="text-left px-4 py-3">Descripcion</th>
                  <th className="text-left px-4 py-3">Propiedad</th>
                  <th className="text-left px-4 py-3">Prioridad</th>
                  <th className="text-left px-4 py-3">Fecha</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {t.id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t.descripcion}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {t.propiedad}
                    </td>
                    <td className="px-4 py-3">
                      <PrioridadBadge prioridad={t.prioridad} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {t.fecha}
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={t.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-[11px] hover:bg-slate-50">
                          👁️
                        </button>
                        {t.estado === "Abierto" ? (
                          <button className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold">
                            Iniciar
                          </button>
                        ) : (
                          <button className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold">
                            Finalizar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {tickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No hay tickets asignados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

type ResumenCardSimpleProps = {
  title: string;
  value: string;
  color?: "emerald" | "amber";
};

function ResumenCardSimple({
  title,
  value,
  color = "emerald",
}: ResumenCardSimpleProps) {
  const bg =
    color === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
      <div>
        <span className="text-xs text-slate-500">{title}</span>
        <div className="text-2xl font-bold text-[#123528] mt-1">{value}</div>
      </div>
      <div
        className={`px-4 py-1 rounded-full text-[11px] font-semibold ${bg}`}
      >
        {title}
      </div>
    </div>
  );
}

function PrioridadBadge({ prioridad }: { prioridad: TicketAsignado["prioridad"] }) {
  const base = "px-3 py-1 rounded-full text-[11px] font-semibold";

  if (prioridad === "Urgente") {
    return (
      <span className={`${base} bg-rose-50 text-rose-700 border border-rose-200`}>
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

function EstadoBadge({ estado }: { estado: TicketAsignado["estado"] }) {
  const base = "px-3 py-1 rounded-full text-[11px] font-semibold";

  if (estado === "Abierto") {
    return (
      <span
        className={`${base} bg-blue-50 text-blue-700 border border-blue-200`}
      >
        Abierto
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}
    >
      En proceso
    </span>
  );
}
