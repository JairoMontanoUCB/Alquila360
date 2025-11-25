"use client";

import React, { useState } from "react";
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
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
      <div
        className="text-2xl font-extrabold tracking-wide mb-10 px-2 cursor-pointer"
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
              <span>{item.label}</span>
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
/*                                  DATOS MOCK                                */
/* -------------------------------------------------------------------------- */

type Ticket = {
  id: string;
  prioridad: "Urgente" | "Media" | "Baja";
  descripcion: string;
  direccion: string;
  fecha: string;
  estado: "Abierto" | "En proceso" | "Cerrado";
  tecnico: string;
  nota: string;
};

const ticketsMock: Ticket[] = [
  {
    id: "TKT-001",
    prioridad: "Urgente",
    descripcion: "Fuga de agua en el baño principal",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-18",
    estado: "Abierto",
    tecnico: "Carlos",
    nota: "No arreglado",
  },
  {
    id: "TKT-002",
    prioridad: "Media",
    descripcion: "La puerta de entrada no cierra correctamente",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-15",
    estado: "En proceso",
    tecnico: "Carlos",
    nota: "Derivado",
  },
  {
    id: "TKT-003",
    prioridad: "Baja",
    descripcion: "Pintura descascarada en la pared del dormitorio",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-10",
    estado: "Abierto",
    tecnico: "Carlos",
    nota: "Sin revision",
  },
];

/* -------------------------------------------------------------------------- */
/*                              PAGINA DE TICKETS                             */
/* -------------------------------------------------------------------------- */

export default function TicketsInquilinoPage() {
  const [showHistorial, setShowHistorial] = useState(false);
  const [showReportar, setShowReportar] = useState(false);
  const [reportStep, setReportStep] = useState<1 | 2>(1);

  const [openDetalle, setOpenDetalle] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null
  );

  const totalTickets = ticketsMock.length;
  const urgentes = ticketsMock.filter((t) => t.prioridad === "Urgente");
  const medios = ticketsMock.filter((t) => t.prioridad === "Media");
  const bajos = ticketsMock.filter((t) => t.prioridad === "Baja");
  const enProceso = ticketsMock.filter((t) => t.estado === "En proceso").length;
  const resueltos = ticketsMock.filter((t) => t.estado === "Cerrado").length;

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Mis Tickets
            </h1>
            <p className="text-xs text-slate-500">
              Reportes de mantenimiento y problemas
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistorial(true)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white hover:bg-slate-100 flex items-center gap-2"
            >
              <span>📊</span>
              <span>Ver Historico</span>
            </button>
            <button
              onClick={() => {
                setReportStep(1);
                setShowReportar(true);
              }}
              className="px-3 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
            >
              <span>➕</span>
              <span>Reportar Problema</span>
            </button>
          </div>
        </header>

        {/* Cards resumen */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <ResumenCard
            titulo="Total de Tickets"
            valor={totalTickets.toString()}
          />
          <ResumenCard titulo="Urgentes" valor={urgentes.length.toString()} />
          <ResumenCard titulo="En Proceso" valor={enProceso.toString()} />
          <ResumenCard titulo="Resueltos" valor={resueltos.toString()} />
        </section>

        {/* Urgentes */}
        <TicketGrupo
          titulo="Urgentes"
          contador={urgentes.length}
          colorBadge="bg-rose-100 text-rose-700"
        >
          {urgentes.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onVerDetalle={() => {
                setTicketSeleccionado(t);
                setOpenDetalle(true);
              }}
            />
          ))}
        </TicketGrupo>

        {/* Medios */}
        <TicketGrupo
          titulo="Medios"
          contador={medios.length}
          colorBadge="bg-amber-100 text-amber-700"
        >
          {medios.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onVerDetalle={() => {
                setTicketSeleccionado(t);
                setOpenDetalle(true);
              }}
            />
          ))}
        </TicketGrupo>

        {/* Bajos */}
        <TicketGrupo
          titulo="Bajos"
          contador={bajos.length}
          colorBadge="bg-emerald-100 text-emerald-700"
        >
          {bajos.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onVerDetalle={() => {
                setTicketSeleccionado(t);
                setOpenDetalle(true);
              }}
            />
          ))}
        </TicketGrupo>
      </section>

      {/* ----------------------------- MODAL HISTORICO ----------------------------- */}
      {showHistorial && (
        <ModalBase onClose={() => setShowHistorial(false)}>
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-lg">Historico de Tickets</h2>
            <p className="text-xs text-slate-500">
              Todos los tickets finalizados y cerrados
            </p>
          </div>

          <div className="px-6 py-4 space-y-4 text-sm">
            {/* Resumen top */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <HistCard titulo="Total Cerrados" valor="5" />
              <HistCard titulo="Urgentes" valor="2" />
              <HistCard titulo="Medios" valor="2" />
              <HistCard titulo="Bajos" valor="1" />
            </div>

            {/* Filtros */}
            <div className="border rounded-lg bg-white p-3 space-y-3">
              <p className="text-[11px] text-slate-500">Filtros</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <FiltroCaja label="Propiedad" value="Todas las propiedades" />
                <FiltroCaja label="Inquilino" value="Todos los inquilinos" />
                <FiltroCaja label="Prioridad" value="Todas las prioridades" />
              </div>
            </div>

            {/* Lista de historico (mock estatico) */}
            <div className="space-y-3">
              <TicketHistItem
                id="T-010"
                prioridad="Urgente"
                propiedad="San Isidro 1234"
                inquilino="Maria Gonzalez"
                tecnico="Carlos Martinez"
                tiempo="1 dia"
              />
              <TicketHistItem
                id="T-011"
                prioridad="Media"
                propiedad="Palermo 5678"
                inquilino="Carlos Rodriguez"
                tecnico="Roberto Sanchez"
                tiempo="1 dia"
              />
              <TicketHistItem
                id="T-012"
                prioridad="Baja"
                propiedad="Belgrano 910"
                inquilino="Ana Martinez"
                tecnico="Roberto Sanchez"
                tiempo="5 dias"
              />
              <TicketHistItem
                id="T-013"
                prioridad="Urgente"
                propiedad="San Isidro 1234"
                inquilino="Maria Gonzalez"
                tecnico="Roberto Sanchez"
                tiempo="3 dias"
              />
              <TicketHistItem
                id="T-014"
                prioridad="Media"
                propiedad="Palermo 5678"
                inquilino="Carlos Rodriguez"
                tecnico="Roberto Sanchez"
                tiempo="3 dias"
              />
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 border-t bg-white rounded-b-xl">
            <button
              onClick={() => setShowHistorial(false)}
              className="px-4 py-2 text-xs border rounded-lg hover:bg-slate-100"
            >
              Cerrar
            </button>
          </div>
        </ModalBase>
      )}

      {/* ----------------------------- MODAL REPORTAR ----------------------------- */}
      {showReportar && (
        <ModalBase
          onClose={() => {
            setShowReportar(false);
            setReportStep(1);
          }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm">Reportar Problema</h2>
            </div>
            <button
              onClick={() => {
                setShowReportar(false);
                setReportStep(1);
              }}
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-4 text-xs space-y-4">
            {reportStep === 1 && (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-[11px] text-slate-600">
                    Describe el problema de forma clara y detallada. Un tecnico
                    sera asignado para revisar tu solicitud.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">
                      Propiedad Asociada *
                    </p>
                    <div className="border rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center">
                      <span>Selecciona la propiedad</span>
                      <span>▾</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">
                      Descripcion del Problema *
                    </p>
                    <textarea
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                      rows={3}
                      placeholder="Describe detalladamente el problema que estas experimentando..."
                    />
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">
                      Prioridad *
                    </p>
                    <div className="border rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center">
                      <span>Media (Atencion en 24-48 horas)</span>
                      <span>▾</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-500 mb-1">
                      Adjuntar Imagenes (Opcional)
                    </p>
                    <div className="border-dashed border-2 border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center text-[11px] text-slate-500">
                      <span>📤</span>
                      <span>Haz clic para seleccionar imagenes</span>
                      <span>PNG, JPG hasta 5MB</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {reportStep === 2 && (
              <>
                <div>
                  <div className="border-dashed border-2 border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center text-[11px] text-slate-500 mb-4">
                    <span>📤</span>
                    <span>Haz clic para seleccionar imagenes</span>
                    <span>PNG, JPG hasta 5MB</span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-1">
                    Comentarios Adicionales (Opcional)
                  </p>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs mb-4"
                    rows={3}
                    placeholder="Agrega informacion adicional que consideres relevante..."
                  />

                  <div className="border rounded-lg bg-white p-3">
                    <p className="text-[11px] text-slate-500 mb-2">
                      Resumen del Reporte
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <p className="text-slate-500">Estado inicial:</p>
                        <p className="font-semibold">Abierto</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Prioridad:</p>
                        <p className="font-semibold">Media</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Imagenes adjuntas:</p>
                        <p className="font-semibold">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white rounded-b-xl text-xs">
            <button
              onClick={() => {
                setShowReportar(false);
                setReportStep(1);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-slate-100"
            >
              Cancelar
            </button>
            {reportStep === 1 && (
              <button
                onClick={() => setReportStep(2)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Siguiente
              </button>
            )}
            {reportStep === 2 && (
              <button
                onClick={() => {
                  setShowReportar(false);
                  setReportStep(1);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Crear Ticket
              </button>
            )}
          </div>
        </ModalBase>
      )}

      {/* ----------------------------- MODAL DETALLE TICKET ----------------------------- */}
      {openDetalle && ticketSeleccionado && (
        <ModalBase
          onClose={() => {
            setOpenDetalle(false);
            setTicketSeleccionado(null);
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">
                Informacion completa del ticket
              </p>
              <h2 className="font-bold text-sm">
                Detalles del Ticket {ticketSeleccionado.id}
              </h2>
            </div>
            <button
              onClick={() => {
                setOpenDetalle(false);
                setTicketSeleccionado(null);
              }}
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-4 space-y-4 text-xs">
            {/* Bloque superior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-500 mb-1">
                  Descripcion del Problema
                </p>
                <p className="font-semibold">
                  {ticketSeleccionado.descripcion}
                </p>
              </div>
              <div className="border rounded-lg bg-white p-3 flex flex-col gap-2">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Prioridad
                  </p>
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                    {ticketSeleccionado.prioridad}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Estado</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] bg-sky-50 text-sky-700 border border-sky-200">
                    {ticketSeleccionado.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Propiedad / tipo / subestado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg bg-white p-3">
                <p className="text-[11px] text-slate-500 mb-1">Propiedad</p>
                <p>{ticketSeleccionado.direccion}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-lg bg-white p-3">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Tipo de Problema
                  </p>
                  <p>Plomeria</p>
                </div>
                <div className="border rounded-lg bg-white p-3">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Subestado
                  </p>
                  <p>{ticketSeleccionado.nota}</p>
                </div>
              </div>
            </div>

            {/* Asignacion de tecnico */}
            <div className="border rounded-lg bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-slate-500">
                  Asignacion de Tecnico
                </p>
                <button className="px-3 py-1 text-[11px] border rounded-lg hover:bg-slate-100">
                  Cambiar Tecnico
                </button>
              </div>
              <p className="text-[11px] text-slate-600">
                Tecnico asignado:{" "}
                <span className="font-semibold">
                  {ticketSeleccionado.tecnico} Martinez
                </span>
              </p>
            </div>

            {/* Historial de movimientos */}
            <div className="border rounded-lg bg-white p-3 space-y-2">
              <p className="text-[11px] text-slate-500 mb-1">
                Historial de Movimientos
              </p>
              <div className="bg-slate-50 rounded-md p-2">
                <p className="text-[11px] text-slate-600">
                  {ticketSeleccionado.fecha}
                </p>
                <p className="text-[11px] text-slate-600">Ticket creado</p>
              </div>
              <div className="bg-slate-50 rounded-md p-2">
                <p className="text-[11px] text-slate-600">
                  Tecnico asignado: {ticketSeleccionado.tecnico} Martinez
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white rounded-b-xl text-xs">
            <button
              onClick={() => {
                setOpenDetalle(false);
                setTicketSeleccionado(null);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">
              Editar
            </button>
            <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
              Cerrar Ticket
            </button>
          </div>
        </ModalBase>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SUBCOMPONENTES UI                             */
/* -------------------------------------------------------------------------- */

function ResumenCard({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <p className="text-[11px] text-slate-500">{titulo}</p>
      <p className="text-2xl font-bold text-[#123528] mt-2">{valor}</p>
    </div>
  );
}

function TicketGrupo({
  titulo,
  contador,
  colorBadge,
  children,
}: {
  titulo: string;
  contador: number;
  colorBadge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-[#123528]">{titulo}</p>
          <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${colorBadge}`}
          >
            {contador}
          </span>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function TicketCard({
  ticket,
  onVerDetalle,
}: {
  ticket: Ticket;
  onVerDetalle: () => void;
}) {
  const estadoStyles =
    ticket.estado === "Abierto"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : ticket.estado === "En proceso"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm text-xs flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] text-slate-500">{ticket.id}</p>
          <p className="font-semibold text-[#123528]">{ticket.descripcion}</p>
          <p className="text-[11px] text-slate-500">{ticket.direccion}</p>
          <p className="text-[11px] text-slate-500">{ticket.fecha}</p>
          <p className="text-[11px] text-slate-500">
            Tecnico: <span>{ticket.tecnico}</span>
          </p>
          <p className="inline-flex mt-1 px-2 py-1 rounded-full bg-slate-100 text-[10px]">
            {ticket.nota}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${estadoStyles}`}
        >
          {ticket.estado}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 mt-1">
        {/* Boton ver detalle (ojo) */}
        <button
          onClick={onVerDetalle}
          className="text-slate-600 hover:text-emerald-600 text-lg"
          title="Ver detalle"
        >
          👁️
        </button>
      </div>
    </div>
  );
}

/* -------------------------- componentes Historico ------------------------- */

function HistCard({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <p className="text-[11px] text-slate-500">{titulo}</p>
      <p className="text-xl font-bold text-[#123528] mt-1">{valor}</p>
    </div>
  );
}

function FiltroCaja({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <div className="border rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center">
        <span>{value}</span>
        <span>▾</span>
      </div>
    </div>
  );
}

type TicketHistProps = {
  id: string;
  prioridad: "Urgente" | "Media" | "Baja";
  propiedad: string;
  inquilino: string;
  tecnico: string;
  tiempo: string;
};

function TicketHistItem({
  id,
  prioridad,
  propiedad,
  inquilino,
  tecnico,
  tiempo,
}: TicketHistProps) {
  const prioridadStyles =
    prioridad === "Urgente"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : prioridad === "Media"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="border rounded-lg bg-white p-3 text-[11px] space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{id}</span>
          <span className={`px-2 py-1 rounded-full border ${prioridadStyles}`}>
            {prioridad}
          </span>
        </div>
        <p className="text-slate-500">
          Tiempo de Resolucion: <span className="font-semibold">{tiempo}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <p className="text-slate-500">Propiedad</p>
          <p>{propiedad}</p>
        </div>
        <div>
          <p className="text-slate-500">Inquilino</p>
          <p>{inquilino}</p>
        </div>
        <div>
          <p className="text-slate-500">Tecnico Asignado</p>
          <p>{tecnico}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Modal base ------------------------------- */

function ModalBase({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f7f5ee] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-slate-300 relative">
        {children}
      </div>
      <button
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
      />
    </div>
  );
}
