"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contrato", path: "/inquilino/contratos" },
  { label: "Pagos", path: "/inquilino/pagos" },
  { label: "Tickets", path: "/inquilino/ticket" },
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
/*                              MOCK DE INFORMACION                           */
/* -------------------------------------------------------------------------- */

const contratoActual = {
  inicio: "31/12/2023",
  fin: "31/12/2024",
  cuota: "$2,500",
  estado: "Vigente",
};

const proximoPago = {
  monto: 2500,
  descripcion: "Diciembre 2024 · Vence el 2024-12-10",
};

const resumenDashboard = {
  ticketsAbiertos: "3",
  expensasPendientes: "1",
};

const ticketsRecientes = [
  {
    id: "TKT-001",
    descripcion: "Fuga de agua en el baño principal",
    fecha: "2024-11-18",
    estado: "Abierto",
  },
  {
    id: "TKT-002",
    descripcion: "La puerta de entrada no cierra correctamente",
    fecha: "2024-11-15",
    estado: "En proceso",
  },
  {
    id: "TKT-003",
    descripcion: "Interruptor descalibrado en la pared del dormitorio",
    fecha: "2024-11-10",
    estado: "Abierto",
  },
];

/* -------------------------------------------------------------------------- */
/*                               PAGINA PRINCIPAL                             */
/* -------------------------------------------------------------------------- */

export default function DashboardInquilino() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      {/* Contenido principal */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528] mb-1">
            Mi Dashboard
          </h1>
          <p className="text-sm text-slate-500">Resumen de tu alquiler</p>
        </header>

        {/* Tarjetas superiores */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard
            title="Contrato Activo"
            value="Vigente"
            icon="📄"
            pill="Activo"
            pillColor="bg-emerald-100 text-emerald-700"
          />
          <DashboardCard
            title="Proximo Pago"
            value="$2,500"
            icon="💰"
            pill="Diciembre"
            pillColor="bg-amber-100 text-amber-700"
          />
          <DashboardCard
            title="Tickets Abiertos"
            value={resumenDashboard.ticketsAbiertos}
            icon="🛠️"
            pill="Abiertos"
            pillColor="bg-sky-100 text-sky-700"
          />
          <DashboardCard
            title="Expensas Pendientes"
            value={resumenDashboard.expensasPendientes}
            icon="📑"
            pill="Pendientes"
            pillColor="bg-rose-100 text-rose-700"
          />
        </section>

        {/* Bloque reportar problema */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#123528]">
              Tienes algun problema?
            </p>
            <p className="text-xs text-slate-500">
              Reporta cualquier inconveniente en tu vivienda y lo resolveremos
              pronto.
            </p>
          </div>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold"
            onClick={() => setShowReportModal(true)}
          >
            Reportar Problema
          </button>
        </section>

        {/* Mi contrato actual */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 px-5 py-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[#123528] text-sm">
              Mi Contrato Actual
            </h2>
            <button className="text-xs px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100">
              Ver Detalle Completo
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <InfoLine label="Fecha Inicio" value={contratoActual.inicio} />
            <InfoLine label="Fecha Fin" value={contratoActual.fin} />
            <InfoLine label="Cuota Mensual" value={contratoActual.cuota} />
            <EstadoBadge estado={contratoActual.estado} />
          </div>
        </section>

        {/* Proximo pago */}
        <section className="bg-yellow-50 border border-amber-300 rounded-xl shadow-sm mb-6 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#123528]">Proximo Pago</p>
            <p className="text-xs text-slate-500">
              {proximoPago.descripcion}
            </p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-xs rounded-lg font-semibold">
            Pagar Ahora
          </button>
        </section>

        {/* Tickets recientes */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[#123528] text-sm">
              Mis Tickets Recientes
            </span>
            <button className="text-xs px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100">
              Ver Todos
            </button>
          </div>

          <div className="space-y-3">
            {ticketsRecientes.map((t) => (
              <TicketItem key={t.id} {...t} />
            ))}
          </div>
        </section>
      </section>

      {showReportModal && (
        <ReportProblemModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           MODAL REPORTAR PROBLEMA                          */
/* -------------------------------------------------------------------------- */

type ReportProblemModalProps = {
  onClose: () => void;
};

function ReportProblemModal({ onClose }: ReportProblemModalProps) {
  const [propiedad, setPropiedad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<"Baja" | "Media" | "Alta">("Media");
  const [imagenes, setImagenes] = useState<FileList | null>(null);
  const [comentarios, setComentarios] = useState("");

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImagenes(e.target.files);
  };

  const handleCrearTicket = () => {
    console.log({
      propiedad,
      descripcion,
      prioridad,
      imagenesCantidad: imagenes?.length ?? 0,
      comentarios,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-300 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-[#123528]">
            Reportar Problema
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] text-slate-700">
            Describe el problema de forma clara y detallada. Un tecnico sera
            asignado para revisar tu solicitud.
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Propiedad Asociada *
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-[12px]"
              value={propiedad}
              onChange={(e) => setPropiedad(e.target.value)}
            >
              <option value="">Selecciona la propiedad</option>
              <option value="Av. Principal 123, Piso 5">
                Av. Principal 123, Piso 5
              </option>
              <option value="Calle Secundaria 456">
                Calle Secundaria 456
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Descripcion del Problema *
            </label>
            <textarea
              className="w-full min-h-[80px] border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white resize-none"
              placeholder="Describe detalladamente el problema que estas experimentando..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Prioridad *
            </label>
            <div className="flex flex-col gap-1">
              {["Baja", "Media", "Alta"].map((nivel) => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => setPrioridad(nivel as any)}
                  className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-[11px] ${
                    prioridad === nivel
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <span>
                    {nivel === "Baja" &&
                      "Baja (Atencion en 72 horas)"}
                    {nivel === "Media" &&
                      "Media (Atencion en 24-48 horas)"}
                    {nivel === "Alta" && "Alta (Atencion inmediata)"}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      prioridad === nivel
                        ? "border-emerald-600 bg-emerald-500"
                        : "border-slate-400 bg-white"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Adjuntar Imagenes (Opcional)
            </label>
            <input
              id="upload-imagenes"
              type="file"
              multiple
              accept="image/*"
              className="w-full text-[11px]"
              onChange={handleFilesChange}
            />
            <p className="text-[10px] text-slate-400">
              Archivos seleccionados: {imagenes?.length ?? 0}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Comentarios Adicionales (Opcional)
            </label>
            <textarea
              className="w-full min-h-[70px] border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white resize-none"
              placeholder="Agrega informacion adicional que consideres relevante..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white rounded-b-xl text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrearTicket}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Crear Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           SUBCOMPONENTES REUTILIZABLES                     */
/* -------------------------------------------------------------------------- */

type DashboardCardProps = {
  title: string;
  value: string;
  icon: string;
  pill: string;
  pillColor: string;
};

function DashboardCard({
  title,
  value,
  icon,
  pill,
  pillColor,
}: DashboardCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-xl font-bold text-[#123528]">{value}</p>
          <span
            className={`px-2 py-[2px] rounded-full text-[10px] font-semibold ${pillColor}`}
          >
            {pill}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="font-semibold text-[#123528] text-sm">{value}</p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">Estado</p>
      <span className="px-3 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold inline-block mt-1">
        {estado}
      </span>
    </div>
  );
}

type TicketItemProps = {
  id: string;
  descripcion: string;
  fecha: string;
  estado: string;
};

function TicketItem({ id, descripcion, fecha, estado }: TicketItemProps) {
  const color =
    estado === "Abierto"
      ? "text-sky-700 bg-sky-50 border-sky-200"
      : estado === "En proceso"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-slate-700 bg-slate-50 border-slate-200";

  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs md:text-sm">
      <div>
        <p className="font-semibold text-[#123528]">{id}</p>
        <p className="text-slate-600">{descripcion}</p>
        <p className="text-[11px] text-slate-400">{fecha}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${color}`}
      >
        {estado}
      </span>
    </div>
  );
}
