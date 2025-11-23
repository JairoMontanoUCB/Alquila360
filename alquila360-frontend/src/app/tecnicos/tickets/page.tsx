"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `w-full block px-3 py-2 rounded-lg text-sm transition ${
      pathname === href
        ? "bg-[#4b7f5e] font-semibold text-white"
        : "text-slate-100 hover:bg-[#164332]"
    }`;

  const abiertos = tickets.filter((t) => t.estado === "Abierto").length;
  const enProceso = tickets.filter((t) => t.estado === "En proceso").length;

  const ticketUrgente = tickets[0];

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketAsignado | null>(
    null
  );

  const handleOpenDetail = (ticket: TicketAsignado) => {
    setSelectedTicket(ticket);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
    setOpenDetail(false);
  };

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
            href="/tecnicos/tickets-asignados"
            className={linkClasses("/tecnicos/tickets-asignados")}
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
          <div className="text-slate-300">Técnico</div>
          <button className="flex items-center gap-2 text-slate-200 hover:text-white text-xs">
            <span>↪</span>
            <span>Cerrar Sesión</span>
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
          <ResumenCardSimple title="Tickets Abiertos" value={abiertos.toString()} />
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
            <span>Tickets Urgentes - Requieren Atención Inmediata</span>
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
              <button
                onClick={() => handleOpenDetail(ticketUrgente)}
                className="flex-1 bg-[#f7a81b] hover:bg-[#ec9a03] text-white text-xs font-semibold py-2 rounded-lg"
              >
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
                  <th className="text-left px-4 py-3">Descripción</th>
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
                    <td className="px-4 py-3 text-slate-600">{t.fecha}</td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={t.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenDetail(t)}
                          className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-[11px] hover:bg-slate-50"
                        >
                          👁️
                        </button>
                        {t.estado === "Abierto" ? (
                          <button
                            onClick={() => handleOpenDetail(t)}
                            className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold"
                          >
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

      {/* MODAL DETALLE TICKET */}
      {openDetail && selectedTicket && (
        <TicketDetailModal ticket={selectedTicket} onClose={handleCloseDetail} />
      )}
    </main>
  );
}

/* ----------------- COMPONENTES AUXILIARES ----------------- */

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
    color === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

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

function PrioridadBadge({
  prioridad,
}: {
  prioridad: TicketAsignado["prioridad"];
}) {
  const base = "px-3 py-1 rounded-full text-[11px] font-semibold border";

  if (prioridad === "Urgente") {
    return (
      <span className={`${base} bg-rose-50 text-rose-700 border-rose-200`}>
        Urgente
      </span>
    );
  }
  if (prioridad === "Media") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
        Media
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}
    >
      Baja
    </span>
  );
}

function EstadoBadge({ estado }: { estado: TicketAsignado["estado"] }) {
  const base = "px-3 py-1 rounded-full text-[11px] font-semibold border";

  if (estado === "Abierto") {
    return (
      <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>
        Abierto
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
      En proceso
    </span>
  );
}

/* ----------------- MODAL DETALLE COMPLETO ----------------- */

function TicketDetailModal({
  ticket,
  onClose,
}: {
  ticket: TicketAsignado;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-extrabold text-[#123528]">
              Detalles del Ticket {ticket.id}
            </h2>
            <p className="text-sm text-slate-500">
              Información completa del ticket
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* PRIORIDAD / ESTADO */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-emerald-900/40 rounded-2xl p-4 bg-[#f9f6ef]">
              <p className="text-sm font-semibold text-[#123528] flex items-center gap-2 mb-3">
                ⚠️ Prioridad
              </p>
              <span className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold">
                {ticket.prioridad}
              </span>
            </div>

            <div className="border border-emerald-900/40 rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#123528] flex items-center gap-2 mb-3">
                📄 Estado Actual
              </p>
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold inline-block w-fit mb-1">
                {ticket.estado}
              </span>
              <p className="text-xs text-slate-600">
                Subestado: <span className="font-medium">No arreglado</span>
              </p>
            </div>
          </section>

          {/* INFO PROPIEDAD */}
          <section className="border border-emerald-900/40 rounded-2xl p-4 bg-[#fbf8f0]">
            <p className="text-sm font-semibold text-[#123528] flex items-center gap-2 mb-3">
              📍 Información de la Propiedad
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium mb-1">Dirección:</p>
                <p>{ticket.propiedad}</p>
              </div>

              <div className="md:text-right">
                <p className="font-medium mb-1">Tipo de Ticket:</p>
                <p>Plomería</p>
              </div>
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section className="border border-emerald-900/40 rounded-2xl p-4">
            <p className="text-sm font-semibold text-[#123528] mb-2">
              Descripción del Problema
            </p>
            <p className="text-sm text-slate-700">{ticket.descripcion}</p>
          </section>

          {/* INFO SOLICITANTE */}
          <section className="border border-emerald-900/40 rounded-2xl p-4 bg-[#fbf8f0]">
            <p className="text-sm font-semibold text-[#123528] flex items-center gap-2 mb-3">
              👤 Información del Solicitante
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium">Nombre:</p>
                <p>María García</p>

                <p className="font-medium mt-3">Rol:</p>
                <p>Inquilino</p>
              </div>

              <div className="md:text-right">
                <p className="font-medium">Contacto:</p>
                <p>555-5678</p>
              </div>
            </div>
          </section>

          {/* FECHAS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-emerald-900/40 rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#123528] mb-2">
                📅 Fecha de Creación
              </p>
              <p>{ticket.fecha}</p>
            </div>

            <div className="border border-emerald-900/40 rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#123528] mb-2">
                📅 Fecha de Asignación
              </p>
              <p>{ticket.fecha}</p>
            </div>
          </section>

          {/* COMENTARIOS */}
          <section className="border border-emerald-900/40 rounded-2xl p-4">
            <p className="text-sm font-semibold text-[#123528] mb-3">
              💬 Comentarios del Solicitante
            </p>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-sm">
              <p className="font-semibold text-xs mb-1">
                María García{" "}
                <span className="text-slate-400">{ticket.fecha}</span>
              </p>
              <p>{ticket.descripcion}</p>
            </div>
          </section>

          {/* HISTORIAL */}
          <section className="border border-emerald-900/40 rounded-2xl p-4">
            <p className="text-sm font-semibold text-[#123528] mb-4">
              Historial de Movimientos
            </p>

            <div className="space-y-6 text-sm text-slate-800">
              {/* EVENTO 1 */}
              <div className="flex gap-3">
                <div className="pt-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="font-semibold">
                    Ticket creado{" "}
                    <span className="text-xs text-slate-500">
                      {ticket.fecha}
                    </span>
                  </p>
                  <p className="text-sm">Ticket generado en el sistema</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Por: <span className="font-medium">María García</span>
                  </p>
                </div>
              </div>

              {/* EVENTO 2 */}
              <div className="flex gap-3">
                <div className="pt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold">
                    Técnico asignado{" "}
                    <span className="text-xs text-slate-500">
                      {ticket.fecha}
                    </span>
                  </p>
                  <p className="text-sm">Ticket asignado a técnico</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Por: <span className="font-medium">Administrador</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BOTÓN CERRAR */}
          <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
