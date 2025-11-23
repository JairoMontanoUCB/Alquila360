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

type Movimiento = {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  por: string;
  color: "blue" | "orange" | "yellow" | "green";
};

type Ticket = {
  id: string;
  descripcion: string;
  propiedad: string;
  prioridad: "Urgente" | "Media" | "Baja";
  fechaCreacion: string;
  fechaFin: string;
  estado: "Cerrado";

  // datos extra para el modal
  estadoSub: string;
  direccion: string;
  tipoPropiedad: string;
  tipoTicket: string;
  solicitanteNombre: string;
  solicitanteRol: string;
  solicitanteContacto: string;
  comentarioSolicitante: string;
  movimientos: Movimiento[];
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

    estadoSub: "Pagado",
    direccion: "Av. Principal 123, Piso 5",
    tipoPropiedad: "Casa",
    tipoTicket: "Climatizacion",
    solicitanteNombre: "Juan Perez",
    solicitanteRol: "Propietario",
    solicitanteContacto: "555-1234",
    comentarioSolicitante: "Sistema de calefaccion no funciona",
    movimientos: [
      {
        id: 1,
        titulo: "Ticket creado",
        fecha: "2024-11-01",
        descripcion: "Ticket generado en el sistema",
        por: "Juan Perez",
        color: "blue",
      },
      {
        id: 2,
        titulo: "Tecnico asignado",
        fecha: "2024-11-01",
        descripcion: "Ticket asignado a tecnico",
        por: "Administrador",
        color: "orange",
      },
      {
        id: 3,
        titulo: "En proceso",
        fecha: "2025-11-22",
        descripcion: "Trabajo iniciado",
        por: "Pedro Garcia",
        color: "yellow",
      },
      {
        id: 4,
        titulo: "Finalizado",
        fecha: "2025-11-22",
        descripcion: "Trabajo completado exitosamente",
        por: "Pedro Garcia",
        color: "green",
      },
    ],
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
            <FiltroSelect
              label="Propiedad"
              placeholder="Todas las propiedades"
            />
            <FiltroSelect
              label="Prioridad"
              placeholder="Todas las prioridades"
            />
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
              Mostrando {ticketsFinalizados.length} de{" "}
              {ticketsFinalizados.length} tickets
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

        {/* Bloques inferiores (Urgentes / Media / Baja) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SmallBarCard title="Urgentes" total={1} colorClass="bg-rose-500" />
          <SmallBarCard title="Media" total={0} colorClass="bg-amber-400" />
          <SmallBarCard title="Baja" total={0} colorClass="bg-emerald-500" />
        </section>
      </section>

      {/* Modal Detalles Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#f7f5ee] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-emerald-900/20">
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
                className="text-slate-500 hover:text-slate-700 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 text-sm">
              {/* Prioridad / Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Prioridad</p>
                  <PrioridadBadge prioridad={selectedTicket.prioridad} />
                </div>
                <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Estado Actual</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                    Cerrado
                  </span>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Subestado: {selectedTicket.estadoSub}
                  </p>
                </div>
              </div>

              {/* Info propiedad */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-emerald-50/40">
                <p className="text-xs text-slate-500 mb-1">
                  Informacion de la Propiedad
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Direccion:</span>{" "}
                  {selectedTicket.direccion}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Tipo:</span>{" "}
                  {selectedTicket.tipoPropiedad}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Tipo de Ticket:</span>{" "}
                  {selectedTicket.tipoTicket}
                </p>
              </div>

              {/* Descripcion problema */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                <p className="text-xs text-slate-500 mb-1">
                  Descripcion del Problema
                </p>
                <p className="text-sm text-slate-700">
                  {selectedTicket.descripcion}
                </p>
              </div>

              {/* Info solicitante */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-amber-50/60">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Informacion del Solicitante
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-[11px] text-slate-500">Nombre</p>
                    <p className="font-semibold">
                      {selectedTicket.solicitanteNombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Rol</p>
                    <p className="font-semibold">
                      {selectedTicket.solicitanteRol}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Contacto</p>
                    <p className="font-semibold">
                      {selectedTicket.solicitanteContacto}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comentarios solicitante */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-yellow-50/70">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Comentarios del Solicitante
                </p>
                <p className="text-xs text-slate-700">
                  {selectedTicket.comentarioSolicitante}
                </p>
              </div>

              {/* Historial de movimientos */}
              <div className="border border-emerald-900/20 rounded-lg p-3 bg-white">
                <p className="text-xs font-semibold text-slate-600 mb-3">
                  Historial de Movimientos
                </p>
                <div className="relative pl-4">
                  {/* linea vertical */}
                  <div className="absolute left-1 top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {selectedTicket.movimientos.map((mov) => (
                      <div key={mov.id} className="relative pl-4 text-xs">
                        {/* punto de color */}
                        <span
                          className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow ${
                            mov.color === "blue"
                              ? "bg-blue-500"
                              : mov.color === "orange"
                              ? "bg-orange-500"
                              : mov.color === "yellow"
                              ? "bg-amber-400"
                              : "bg-emerald-500"
                          }`}
                        />
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-semibold">{mov.titulo}</span>
                          <span className="text-[11px] text-slate-500">
                            {mov.fecha}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {mov.descripcion}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Por: {mov.por}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-emerald-900/10 bg-white/80 rounded-b-xl">
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

