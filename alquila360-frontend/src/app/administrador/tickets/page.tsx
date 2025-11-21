"use client";

import React from "react";
import Link from "next/link";
import SidebarAdministrador from "../../components/sideBarAdministrador";

const activeLabel = "Tickets";

type Prioridad = "Urgente" | "Media" | "Baja";

type EstadoTicket = "Abierto" | "En proceso" | "Cerrado";

type Ticket = {
  id: string;
  prioridad: Prioridad;
  titulo: string;
  descripcion: string;
  direccion: string;
  fecha: string;
  tecnico: string;
  estadoTicket: EstadoTicket;
  estadoTexto: string;
};

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    prioridad: "Urgente",
    titulo: "Fuga de agua en el bano principal",
    descripcion: "",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-18",
    tecnico: "Carlos",
    estadoTicket: "Abierto",
    estadoTexto: "No arreglado",
  },
  {
    id: "TKT-002",
    prioridad: "Media",
    titulo: "La puerta de entrada no cierra correctamente",
    descripcion: "",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-15",
    tecnico: "Carlos",
    estadoTicket: "En proceso",
    estadoTexto: "Derivado",
  },
  {
    id: "TKT-003",
    prioridad: "Baja",
    titulo: "Pintura descascarada en la pared del dormitorio",
    descripcion: "",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-10",
    tecnico: "Carlos",
    estadoTicket: "Abierto",
    estadoTexto: "",
  },
];

export default function TicketsPage() {
  const urgentes = tickets.filter((t) => t.prioridad === "Urgente");
  const medios = tickets.filter((t) => t.prioridad === "Media");
  const bajos = tickets.filter((t) => t.prioridad === "Baja");

  const getEstadoPillClasses = (estado: EstadoTicket) => {
    if (estado === "Abierto")
      return "bg-blue-100 text-blue-700 border border-blue-300";
    if (estado === "En proceso")
      return "bg-amber-100 text-amber-700 border border-amber-300";
    return "bg-emerald-100 text-emerald-700 border border-emerald-300";
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* contenido tickets */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestion de Tickets
            </h1>
            <p className="text-sm text-slate-500">
              Mantenimiento y problemas por prioridad
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#ffb628] hover:bg-[#f2a917] text-black px-4 py-2 rounded-lg font-semibold text-sm">
              <span>+</span>
              <span>Crear Ticket</span>
            </button>

            <button className="border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg text-sm">
              Ver Historico
            </button>
          </div>
        </header>

        {/* URGENTES */}
        <TicketSection
          titulo="Urgentes"
          colorBorder="border-red-300"
          colorDot="bg-red-400"
          tickets={urgentes}
          getEstadoPillClasses={getEstadoPillClasses}
        />

        {/* MEDIOS */}
        <TicketSection
          titulo="Medios"
          colorBorder="border-amber-300"
          colorDot="bg-amber-400"
          tickets={medios}
          getEstadoPillClasses={getEstadoPillClasses}
        />

        {/* BAJOS */}
        <TicketSection
          titulo="Bajos"
          colorBorder="border-emerald-300"
          colorDot="bg-emerald-400"
          tickets={bajos}
          getEstadoPillClasses={getEstadoPillClasses}
        />
      </section>
    </div>
  );
}

/* --------- Subcomponentes --------- */

type TicketSectionProps = {
  titulo: string;
  colorBorder: string;
  colorDot: string;
  tickets: Ticket[];
  getEstadoPillClasses: (e: EstadoTicket) => string;
};

function TicketSection({
  titulo,
  colorBorder,
  colorDot,
  tickets,
  getEstadoPillClasses,
}: TicketSectionProps) {
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-sm font-semibold text-slate-700">{titulo}</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center border ${colorBorder}`}
          >
            {tickets.length}
          </span>
        </div>
      </div>

      <div
        className={`bg-white border ${colorBorder} rounded-xl shadow-sm px-4 py-3`}
      >
        {tickets.map((t) => (
          <article
            key={t.id}
            className="border border-slate-200 rounded-xl px-4 py-3 mb-3 last:mb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <p className="text-xs text-red-500 font-semibold">{t.id}</p>
                <p className="text-sm font-semibold text-slate-800">
                  {t.titulo}
                </p>
                <p className="text-xs text-slate-600">{t.direccion}</p>
                <p className="text-xs text-slate-600">{t.fecha}</p>
                <p className="text-xs text-slate-600">
                  Tecnico: <span className="font-medium">{t.tecnico}</span>
                </p>
                {t.estadoTexto && (
                  <p className="text-xs text-slate-500">{t.estadoTexto}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoPillClasses(
                    t.estadoTicket
                  )}`}
                >
                  {t.estadoTicket}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="p-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs">
                👁️
              </button>
              <button className="p-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs">
                ✏️
              </button>
              <button className="p-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs">
                ✖
              </button>
            </div>
          </article>
        ))}

        {tickets.length === 0 && (
          <p className="text-xs text-slate-400 px-1 py-2">
            No hay tickets en esta prioridad.
          </p>
        )}
      </div>
    </section>
  );
}
