"use client";

import React, { useState } from "react";
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

type HistoricalTicket = {
  id: string;
  prioridad: Prioridad;
  titulo: string;
  propiedad: string;
  inquilino: string;
  tecnico: string;
  fechaCreado: string;
  fechaCerrado: string;
  tiempoResolucion: string; // ej: "2 días"
};

// ---------------- TICKETS ACTUALES (pantalla principal) ----------------
const ticketsIniciales: Ticket[] = [
  {
    id: "TKT-001",
    prioridad: "Urgente",
    titulo: "Fuga de agua en el baño principal",
    descripcion: "Fuga de agua en el baño principal",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-18",
    tecnico: "Carlos Martínez",
    estadoTicket: "Abierto",
    estadoTexto: "No arreglado",
  },
  {
    id: "TKT-002",
    prioridad: "Media",
    titulo: "La puerta de entrada no cierra correctamente",
    descripcion: "La puerta de entrada no cierra correctamente",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-15",
    tecnico: "Carlos Martínez",
    estadoTicket: "En proceso",
    estadoTexto: "Derivado",
  },
  {
    id: "TKT-003",
    prioridad: "Baja",
    titulo: "Pintura descascarada en la pared del dormitorio",
    descripcion: "Pintura descascarada en la pared del dormitorio",
    direccion: "Calle Secundaria 456",
    fecha: "2024-11-10",
    tecnico: "Carlos Martínez",
    estadoTicket: "Abierto",
    estadoTexto: "No arreglado",
  },
];

// ---------------- TICKETS HISTÓRICOS (modal) ----------------
const historicos: HistoricalTicket[] = [
  {
    id: "T-010",
    prioridad: "Urgente",
    titulo: "Reparación de caldera completada",
    propiedad: "San Isidro 1234",
    inquilino: "María González",
    tecnico: "Roberto Sánchez",
    fechaCreado: "2024-10-10",
    fechaCerrado: "2024-10-12",
    tiempoResolucion: "2 días",
  },
  {
    id: "T-011",
    prioridad: "Media",
    titulo: "Cambio de cerraduras finalizado",
    propiedad: "Palermo 5678",
    inquilino: "Carlos Rodríguez",
    tecnico: "Roberto Sánchez",
    fechaCreado: "2024-10-15",
    fechaCerrado: "2024-10-16",
    tiempoResolucion: "1 día",
  },
  {
    id: "T-012",
    prioridad: "Baja",
    titulo: "Pintura de paredes completada",
    propiedad: "Belgrano 910",
    inquilino: "Ana Martínez",
    tecnico: "Roberto Sánchez",
    fechaCreado: "2024-10-20",
    fechaCerrado: "2024-10-25",
    tiempoResolucion: "5 días",
  },
  {
    id: "T-013",
    prioridad: "Urgente",
    titulo: "Reparación de pérdida de agua",
    propiedad: "San Isidro 1234",
    inquilino: "María González",
    tecnico: "Roberto Sánchez",
    fechaCreado: "2024-11-01",
    fechaCerrado: "2024-11-02",
    tiempoResolucion: "1 día",
  },
  {
    id: "T-014",
    prioridad: "Media",
    titulo: "Instalación de aires acondicionados",
    propiedad: "Palermo 5678",
    inquilino: "Carlos Rodríguez",
    tecnico: "Roberto Sánchez",
    fechaCreado: "2024-11-05",
    fechaCerrado: "2024-11-08",
    tiempoResolucion: "3 días",
  },
];

function formatFecha(fecha: string) {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPriorityBanner(prioridad: Prioridad) {
  if (prioridad === "Urgente") {
    return {
      classes: "bg-red-50 border-red-200 text-red-700",
      text: "Prioridad Urgente: Este ticket requiere atención inmediata",
    };
  }
  if (prioridad === "Media") {
    return {
      classes: "bg-amber-50 border-amber-200 text-amber-700",
      text: "Prioridad Media: Este ticket debe atenderse en los próximos días",
    };
  }
  return {
    classes: "bg-emerald-50 border-emerald-200 text-emerald-700",
    text: "Prioridad Baja: Programar la atención según disponibilidad",
  };
}

export default function TicketsPage() {
  // lista en estado para poder agregar y editar tickets
  const [ticketList, setTicketList] = useState<Ticket[]>(ticketsIniciales);

  const urgentes = ticketList.filter((t) => t.prioridad === "Urgente");
  const medios = ticketList.filter((t) => t.prioridad === "Media");
  const bajos = ticketList.filter((t) => t.prioridad === "Baja");

  const [openHistory, setOpenHistory] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // NUEVO: modal de detalles
  const [openView, setOpenView] = useState(false);
  const [ticketToView, setTicketToView] = useState<Ticket | null>(null);

  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);

  // -------- filtros del histórico --------
  const [filtroProp, setFiltroProp] = useState<string>("Todas");
  const [filtroInq, setFiltroInq] = useState<string>("Todos");
  const [filtroPri, setFiltroPri] = useState<string>("Todas");

  const propiedadesOptions = Array.from(
    new Set(historicos.map((h) => h.propiedad))
  );
  const inquilinosOptions = Array.from(
    new Set(historicos.map((h) => h.inquilino))
  );

  const historicosFiltrados = historicos.filter((h) => {
    const matchProp = filtroProp === "Todas" || h.propiedad === filtroProp;
    const matchInq = filtroInq === "Todos" || h.inquilino === filtroInq;
    const matchPri = filtroPri === "Todas" || h.prioridad === filtroPri;
    return matchProp && matchInq && matchPri;
  });

  const totalCerrados = historicos.length;
  const totalUrgentes = historicos.filter((h) => h.prioridad === "Urgente").length;
  const totalMedios = historicos.filter((h) => h.prioridad === "Media").length;
  const totalBajos = historicos.filter((h) => h.prioridad === "Baja").length;

  const getEstadoPillClasses = (estado: EstadoTicket) => {
    if (estado === "Abierto")
      return "bg-blue-100 text-blue-700 border border-blue-300";
    if (estado === "En proceso")
      return "bg-amber-100 text-amber-700 border border-amber-300";
    return "bg-emerald-100 text-emerald-700 border border-emerald-300";
  };

  const getPrioridadPillClasses = (prioridad: Prioridad) => {
    if (prioridad === "Urgente") return "bg-red-100 text-red-700";
    if (prioridad === "Media") return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  };

  // ---------------- FORMULARIO CREAR TICKET ----------------
  const [formPropiedad, setFormPropiedad] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formTipoProblema, setFormTipoProblema] = useState("Plomería");
  const [formPrioridad, setFormPrioridad] = useState<Prioridad>("Media");
  const [formEstado, setFormEstado] = useState<EstadoTicket>("Abierto");
  const [formTecnico, setFormTecnico] = useState("Sin asignar");
  const [formSubestado, setFormSubestado] = useState("Sin subestado");

  const resetForm = () => {
    setFormPropiedad("");
    setFormDescripcion("");
    setFormTipoProblema("Plomería");
    setFormPrioridad("Media");
    setFormEstado("Abierto");
    setFormTecnico("Sin asignar");
    setFormSubestado("Sin subestado");
  };

  const totalTicketsParaId = ticketList.length + historicos.length;
  const nextTicketNumber = `T-${String(
    totalTicketsParaId + 1
  ).padStart(3, "0")}`;

  const priorityBannerCreate = getPriorityBanner(formPrioridad);

  const handleCrearTicket = () => {
    if (!formPropiedad || !formDescripcion) {
      alert("Completa al menos la propiedad y la descripción del problema.");
      return;
    }

    const hoy = new Date().toISOString().slice(0, 10);

    const nuevoTicket: Ticket = {
      id: `TKT-${String(ticketList.length + 1).padStart(3, "0")}`,
      prioridad: formPrioridad,
      titulo: formDescripcion.slice(0, 60) || `Ticket de ${formTipoProblema}`,
      descripcion: formDescripcion,
      direccion: formPropiedad,
      fecha: hoy,
      tecnico: formTecnico === "Sin asignar" ? "Sin asignar" : formTecnico,
      estadoTicket: formEstado,
      estadoTexto:
        formEstado === "Abierto"
          ? "No arreglado"
          : formEstado === "En proceso"
          ? "Derivado"
          : "Resuelto",
    };

    setTicketList((prev) => [nuevoTicket, ...prev]);
    resetForm();
    setOpenCreate(false);
  };

  // ---------------- FORMULARIO EDITAR TICKET ----------------
  const [editPropiedad, setEditPropiedad] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editTipoProblema, setEditTipoProblema] = useState("Plomería");
  const [editPrioridad, setEditPrioridad] = useState<Prioridad>("Media");
  const [editEstado, setEditEstado] = useState<EstadoTicket>("Abierto");
  const [editTecnico, setEditTecnico] = useState("");
  const [editSubestado, setEditSubestado] = useState("No arreglado");

  const handleOpenEdit = (ticket: Ticket) => {
    setTicketToEdit(ticket);
    setEditPropiedad(ticket.direccion);
    setEditDescripcion(ticket.descripcion);
    setEditPrioridad(ticket.prioridad);
    setEditEstado(ticket.estadoTicket);
    setEditTecnico(ticket.tecnico);
    setEditSubestado(ticket.estadoTexto || "No arreglado");
    setEditTipoProblema("Plomería"); // por ahora fijo
    setOpenEdit(true);
  };

  const priorityBannerEdit = getPriorityBanner(editPrioridad);

  const handleGuardarCambios = () => {
    if (!ticketToEdit) return;

    setTicketList((prev) =>
      prev.map((t) =>
        t.id === ticketToEdit.id
          ? {
              ...t,
              prioridad: editPrioridad,
              titulo: editDescripcion.slice(0, 60) || t.titulo,
              descripcion: editDescripcion,
              direccion: editPropiedad,
              tecnico: editTecnico,
              estadoTicket: editEstado,
              estadoTexto: editSubestado || t.estadoTexto,
            }
          : t
      )
    );

    // si el ticket que se está viendo es el mismo, actualizarlo también
    if (ticketToView && ticketToView.id === ticketToEdit.id) {
      setTicketToView((prev) =>
        prev
          ? {
              ...prev,
              prioridad: editPrioridad,
              titulo: editDescripcion.slice(0, 60) || prev.titulo,
              descripcion: editDescripcion,
              direccion: editPropiedad,
              tecnico: editTecnico,
              estadoTicket: editEstado,
              estadoTexto: editSubestado || prev.estadoTexto,
            }
          : prev
      );
    }

    setOpenEdit(false);
    setTicketToEdit(null);
  };

  // ---------------- DETALLES DEL TICKET ----------------
  const handleOpenView = (ticket: Ticket) => {
    setTicketToView(ticket);
    setOpenView(true);
  };

  const handleCerrarTicket = (ticketId: string) => {
    setTicketList((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              estadoTicket: "Cerrado",
              estadoTexto: "Resuelto",
            }
          : t
      )
    );

    if (ticketToView && ticketToView.id === ticketId) {
      setTicketToView({
        ...ticketToView,
        estadoTicket: "Cerrado",
        estadoTexto: "Resuelto",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* contenido tickets */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestión de Tickets
            </h1>
            <p className="text-sm text-slate-500">
              Mantenimiento y problemas por prioridad
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 bg-[#ffb628] hover:bg-[#f2a917] text-black px-4 py-2 rounded-lg font-semibold text-sm"
            >
              <span>+</span>
              <span>Crear Ticket</span>
            </button>

            <button
              onClick={() => setOpenHistory(true)}
              className="border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg text-sm"
            >
              Ver Histórico
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
          onEdit={handleOpenEdit}
          onView={handleOpenView}
        />

        {/* MEDIOS */}
        <TicketSection
          titulo="Medios"
          colorBorder="border-amber-300"
          colorDot="bg-amber-400"
          tickets={medios}
          getEstadoPillClasses={getEstadoPillClasses}
          onEdit={handleOpenEdit}
          onView={handleOpenView}
        />

        {/* BAJOS */}
        <TicketSection
          titulo="Bajos"
          colorBorder="border-emerald-300"
          colorDot="bg-emerald-400"
          tickets={bajos}
          getEstadoPillClasses={getEstadoPillClasses}
          onEdit={handleOpenEdit}
          onView={handleOpenView}
        />
      </section>

      {/* ---------------- MODAL CREAR TICKET ---------------- */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                Crear Nuevo Ticket
              </h2>
              <button
                onClick={() => {
                  setOpenCreate(false);
                  resetForm();
                }}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Información del Ticket */}
              <section className="border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg">
                  Información del Ticket
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Número de Ticket
                    </p>
                    <div className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm flex items-center justify-between">
                      <span>{nextTicketNumber}</span>
                      <span className="text-xs text-slate-500">
                        (se genera automáticamente)
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propiedad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formPropiedad}
                      onChange={(e) => setFormPropiedad(e.target.value)}
                    >
                      <option value="">Seleccionar propiedad</option>
                      <option value="San Isidro 1234">San Isidro 1234</option>
                      <option value="Palermo 5678">Palermo 5678</option>
                      <option value="Belgrano 910">Belgrano 910</option>
                      <option value="Calle Secundaria 456">
                        Calle Secundaria 456
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Descripción del Problema
                  </p>
                  <textarea
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-20"
                    placeholder="Describe el problema o solicitud de mantenimiento..."
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                  />
                </div>
              </section>

              {/* Clasificación */}
              <section className="border border-emerald-900/40 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg">
                  Clasificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Tipo de Problema
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formTipoProblema}
                      onChange={(e) => setFormTipoProblema(e.target.value)}
                    >
                      <option>Plomería</option>
                      <option>Electricidad</option>
                      <option>Gas</option>
                      <option>Pintura</option>
                      <option>Otros</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Prioridad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formPrioridad}
                      onChange={(e) =>
                        setFormPrioridad(e.target.value as Prioridad)
                      }
                    >
                      <option value="Urgente">Urgente</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Estado
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formEstado}
                      onChange={(e) =>
                        setFormEstado(e.target.value as EstadoTicket)
                      }
                    >
                      <option value="Abierto">Abierto</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </div>
                </div>

                {/* Asignar Técnico / Subestado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Asignar Técnico (Opcional)
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formTecnico}
                      onChange={(e) => setFormTecnico(e.target.value)}
                    >
                      <option>Sin asignar</option>
                      <option>Roberto Sánchez</option>
                      <option>Carlos Rodríguez</option>
                      <option>María González</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Subestado (Opcional)
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={formSubestado}
                      onChange={(e) => setFormSubestado(e.target.value)}
                    >
                      <option>Sin subestado</option>
                      <option>En espera de repuestos</option>
                      <option>Visitado</option>
                      <option>Requiere aprobación</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Banner de prioridad */}
              <div
                className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${priorityBannerCreate.classes}`}
              >
                <span className="text-base">📋</span>
                <span>{priorityBannerCreate.text}</span>
              </div>

              {/* Footer botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setOpenCreate(false);
                    resetForm();
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearTicket}
                  className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold"
                >
                  Crear Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL EDITAR TICKET ---------------- */}
      {openEdit && ticketToEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                Editar Ticket
              </h2>
              <button
                onClick={() => {
                  setOpenEdit(false);
                  setTicketToEdit(null);
                }}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Información del Ticket */}
              <section className="border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg">
                  Información del Ticket
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Número de Ticket
                    </p>
                    <div className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm">
                      {ticketToEdit.id}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propiedad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editPropiedad}
                      onChange={(e) => setEditPropiedad(e.target.value)}
                    >
                      <option value="San Isidro 1234">San Isidro 1234</option>
                      <option value="Palermo 5678">Palermo 5678</option>
                      <option value="Belgrano 910">Belgrano 910</option>
                      <option value="Calle Secundaria 456">
                        Calle Secundaria 456
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Descripción del Problema
                  </p>
                  <textarea
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-20"
                    placeholder="Describe el problema o solicitud de mantenimiento..."
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                  />
                </div>
              </section>

              {/* Clasificación */}
              <section className="border border-emerald-900/40 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg">
                  Clasificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Tipo de Problema
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editTipoProblema}
                      onChange={(e) => setEditTipoProblema(e.target.value)}
                    >
                      <option>Plomería</option>
                      <option>Electricidad</option>
                      <option>Gas</option>
                      <option>Pintura</option>
                      <option>Otros</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Prioridad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editPrioridad}
                      onChange={(e) =>
                        setEditPrioridad(e.target.value as Prioridad)
                      }
                    >
                      <option value="Urgente">Urgente</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Estado
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editEstado}
                      onChange={(e) =>
                        setEditEstado(e.target.value as EstadoTicket)
                      }
                    >
                      <option value="Abierto">Abierto</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </div>
                </div>

                {/* Asignar Técnico / Subestado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Asignar Técnico (Opcional)
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editTecnico}
                      onChange={(e) => setEditTecnico(e.target.value)}
                    >
                      <option>Sin asignar</option>
                      <option>Carlos Martínez</option>
                      <option>Roberto Sánchez</option>
                      <option>Carlos Rodríguez</option>
                      <option>María González</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Subestado (Opcional)
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editSubestado}
                      onChange={(e) => setEditSubestado(e.target.value)}
                    >
                      <option>No arreglado</option>
                      <option>Derivado</option>
                      <option>Resuelto</option>
                      <option>En espera de repuestos</option>
                      <option>Visitado</option>
                      <option>Requiere aprobación</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Banner de prioridad */}
              <div
                className={`px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${priorityBannerEdit.classes}`}
              >
                <span className="text-base">⚠</span>
                <span>{priorityBannerEdit.text}</span>
              </div>

              {/* Footer botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setOpenEdit(false);
                    setTicketToEdit(null);
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarCambios}
                  className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL DETALLES DEL TICKET ---------------- */}
      {openView && ticketToView && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123528]">
                  Detalles del Ticket {ticketToView.id}
                </h2>
                <p className="text-sm text-slate-500">
                  Información completa del ticket
                </p>
              </div>
              <button
                onClick={() => setOpenView(false)}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Encabezado con prioridad */}
              <section className="border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-red-500 text-lg">!</span>
                      {ticketToView.id}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Creado el {formatFecha(ticketToView.fecha)}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold bg-red-50 text-red-500">
                      Prioridad: {ticketToView.prioridad}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Descripción del Problema
                  </p>
                  <div className="border border-emerald-900/40 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white">
                    {ticketToView.descripcion}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Propiedad</p>
                    <div className="border border-emerald-900/40 rounded-xl px-4 py-3 text-sm bg-white">
                      {ticketToView.direccion}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Estado</p>
                    <div className="border border-emerald-900/40 rounded-xl px-4 py-3 text-sm bg-white flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoPillClasses(
                          ticketToView.estadoTicket
                        )}`}
                      >
                        {ticketToView.estadoTicket}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Tipo de Problema
                    </p>
                    <div className="border border-emerald-900/40 rounded-xl px-4 py-3 text-sm bg-white">
                      Plomería
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Subestado</p>
                    <div className="border border-emerald-900/40 rounded-xl px-4 py-3 text-sm bg-white">
                      {ticketToView.estadoTexto || "No arreglado"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Asignación de técnico */}
              <section className="border border-emerald-900/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#123528] text-lg">
                    Asignación de Técnico
                  </h3>
                  <button className="px-4 py-2 rounded-lg border border-emerald-900/40 text-sm text-emerald-900 hover:bg-emerald-50">
                    Cambiar Técnico
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="w-9 h-9 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-700">
                    👤
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Técnico asignado</p>
                    <p className="text-sm font-medium text-slate-800">
                      {ticketToView.tecnico}
                    </p>
                  </div>
                </div>
              </section>

              {/* Historial de movimientos */}
              <section className="border border-emerald-900/40 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg">
                  Historial de Movimientos
                </h3>

                <div className="space-y-3">
                  <div className="rounded-xl bg-[#fbf7ef] px-4 py-3 flex gap-3 items-start">
                    <div className="mt-1 text-amber-500 text-xl">📅</div>
                    <div>
                      <p className="text-xs text-slate-500">
                        {formatFecha(ticketToView.fecha)}
                      </p>
                      <p className="text-sm text-slate-800">Ticket creado</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f9f5ee] px-4 py-3 flex gap-3 items-start">
                    <div className="mt-1 text-emerald-600 text-xl">👤</div>
                    <div>
                      <p className="text-xs text-slate-500">
                        {formatFecha(ticketToView.fecha)}
                      </p>
                      <p className="text-sm text-slate-800">
                        Técnico asignado: {ticketToView.tecnico}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => setOpenView(false)}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    if (ticketToView) {
                      handleOpenEdit(ticketToView);
                      setOpenView(false);
                    }
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleCerrarTicket(ticketToView.id)}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
                >
                  Cerrar Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL HISTÓRICO ---------------- */}
      {openHistory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123528]">
                  Histórico de Tickets
                </h2>
                <p className="text-sm text-slate-500">
                  Todos los tickets finalizados y cerrados
                </p>
              </div>
              <button
                onClick={() => setOpenHistory(false)}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* resumen tarjetas */}
            <div className="px-8 pt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-[#f8f5ee] border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Total Cerrados</p>
                <p className="text-3xl font-bold text-[#123528]">
                  {totalCerrados}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Urgentes</p>
                <p className="text-3xl font-bold text-red-500">
                  {totalUrgentes}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Medios</p>
                <p className="text-3xl font-bold text-amber-500">
                  {totalMedios}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Bajos</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {totalBajos}
                </p>
              </div>
            </div>

            {/* filtros */}
            <div className="px-8 pt-6 pb-4 mt-4 border border-slate-200 rounded-2xl mx-6">
              <p className="text-sm font-semibold text-slate-700 mb-4">
                Filtros
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Propiedad</p>
                  <select
                    className="w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={filtroProp}
                    onChange={(e) => setFiltroProp(e.target.value)}
                  >
                    <option value="Todas">Todas las propiedades</option>
                    {propiedadesOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Inquilino</p>
                  <select
                    className="w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={filtroInq}
                    onChange={(e) => setFiltroInq(e.target.value)}
                  >
                    <option value="Todos">Todos los inquilinos</option>
                    {inquilinosOptions.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Prioridad</p>
                  <select
                    className="w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={filtroPri}
                    onChange={(e) => setFiltroPri(e.target.value)}
                  >
                    <option value="Todas">Todas las prioridades</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>
            </div>

            {/* lista histórico */}
            <div className="px-8 py-6 space-y-4">
              {historicosFiltrados.map((t) => (
                <article
                  key={t.id}
                  className="border border-emerald-900/40 rounded-2xl px-5 py-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-emerald-400 text-emerald-600 text-xs font-semibold">
                      ✓
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mr-2">
                      {t.id}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrioridadPillClasses(
                        t.prioridad
                      )}`}
                    >
                      {t.prioridad}
                    </span>
                  </div>

                  <p className="text-base font-semibold text-slate-900 mb-2">
                    {t.titulo}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 mb-3">
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">Propiedad</span>
                        <br />
                        {t.propiedad}
                      </p>
                      <p className="mt-3">
                        <span className="font-semibold">Técnico Asignado</span>
                        <br />
                        👤 {t.tecnico}
                      </p>
                      <p className="mt-3">
                        <span className="font-semibold">Creado:</span>{" "}
                        {formatFecha(t.fechaCreado)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">Inquilino</span>
                        <br />
                        {t.inquilino}
                      </p>
                      <p className="mt-3">
                        <span className="font-semibold">
                          Tiempo de Resolución
                        </span>
                        <br />
                        📅 {t.tiempoResolucion}
                      </p>
                      <p className="mt-3">
                        <span className="font-semibold">Cerrado:</span>{" "}
                        {formatFecha(t.fechaCerrado)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              {historicosFiltrados.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">
                  No hay tickets que coincidan con los filtros seleccionados.
                </p>
              )}
            </div>

            {/* footer */}
            <div className="flex justify-end px-8 py-4 border-t border-slate-200">
              <button
                onClick={() => setOpenHistory(false)}
                className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
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

/* --------- Subcomponentes --------- */

type TicketSectionProps = {
  titulo: string;
  colorBorder: string;
  colorDot: string;
  tickets: Ticket[];
  getEstadoPillClasses: (e: EstadoTicket) => string;
  onEdit: (t: Ticket) => void;
  onView: (t: Ticket) => void;
};

function TicketSection({
  titulo,
  colorBorder,
  colorDot,
  tickets,
  getEstadoPillClasses,
  onEdit,
  onView,
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
                  Técnico: <span className="font-medium">{t.tecnico}</span>
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
              <button
                onClick={() => onView(t)}
                className="p-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs"
              >
                👁️
              </button>
              <button
                onClick={() => onEdit(t)}
                className="p-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs"
              >
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
