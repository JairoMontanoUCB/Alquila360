"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTicketsUsuario, crearTicket } from "@/services/ticketService";

interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  fecha: string;
  tecnico: string;
  estado: "Abierto" | "En proceso" | "Cerrado";
  prioridad: "Urgente" | "Media" | "Baja";
  tipoProblema?: string;
  subestado?: string;
  fechaCreacion?: string;
  fechaCerrado?: string;
  inquilino?: string;
  historial?: Array<{
    fecha: string;
    accion: string;
    detalle: string;
  }>;
}

export default function GestionTickets() {
  const [fotoArchivo, setFotoArchivo] = useState<File | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsHistorico, setTicketsHistorico] = useState<Ticket[]>([]);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(
    null
  );

  // Formulario Crear
  const [propiedadNueva, setPropiedadNueva] = useState("");
  const [descripcionNueva, setDescripcionNueva] = useState("");
  const [tipoProblema, setTipoProblema] = useState("Plomería");
  const [prioridadNueva, setPrioridadNueva] = useState("Media");
  const [estadoNuevo, setEstadoNuevo] = useState("Abierto");

  // Formulario Editar
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [tipoProblemaEdit, setTipoProblemaEdit] = useState("");
  const [prioridadEdit, setPrioridadEdit] = useState("");
  const [estadoEdit, setEstadoEdit] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        const data = await getTicketsUsuario(userId);
        setTickets(data);
      } catch (e) {
        console.error("Error cargando tickets:", e);
      }
    };

    load();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Abierto":
        return "bg-blue-100 text-blue-700";
      case "En proceso":
        return "bg-orange-100 text-orange-700";
      case "Cerrado":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPrioridadCount = (prioridad: string) => {
    return tickets.filter(
      (t) => t.prioridad === prioridad && t.estado !== "Cerrado"
    ).length;
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente":
        return "text-red-600";
      case "Media":
        return "text-yellow-600";
      case "Baja":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // ---------- CREAR TICKET (BACKEND) ----------
  const handleCrearTicket = async () => {
    try {
      if (!propiedadNueva || !descripcionNueva) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }

      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        alert("No se encontró tu sesión");
        return;
      }

      const formData = new FormData();
      formData.append("descripcion", descripcionNueva);
      formData.append("propiedadId", propiedadNueva);
      formData.append("tipo", tipoProblema);
      formData.append("prioridad", prioridadNueva);
      formData.append("estado", estadoNuevo);

      if (fotoArchivo) {
        formData.append("fotos", fotoArchivo);
      }

      await crearTicket(formData);

      alert("✔ Ticket creado correctamente");
      setModalCrear(false);

      // Limpiar formulario
      setPropiedadNueva("");
      setDescripcionNueva("");
      setTipoProblema("Plomería");
      setPrioridadNueva("Media");
      setEstadoNuevo("Abierto");
      setFotoArchivo(null);

      // Recargar tickets reales
      const data = await getTicketsUsuario(userId);
      setTickets(data);
    } catch (error) {
      console.error(error);
      alert("❌ Error creando ticket");
    }
  };

  // ---------- DETALLE / EDITAR / CERRAR (solo front) ----------
  const abrirDetalle = (ticket: Ticket) => {
    setTicketSeleccionado(ticket);
    setModalDetalle(true);
  };

  const abrirEditar = (ticket: Ticket) => {
    setTicketSeleccionado(ticket);
    setDescripcionEdit(ticket.descripcion);
    setTipoProblemaEdit(ticket.tipoProblema || "Plomería");
    setPrioridadEdit(ticket.prioridad);
    setEstadoEdit(ticket.estado);
    setModalEditar(true);
  };

  const handleGuardarEdicion = () => {
    if (!ticketSeleccionado) return;

    const ticketsActualizados = tickets.map((t) =>
      t.id === ticketSeleccionado.id
        ? {
            ...t,
            descripcion: descripcionEdit,
            tipoProblema: tipoProblemaEdit,
            prioridad: prioridadEdit as Ticket["prioridad"],
            estado: estadoEdit as Ticket["estado"],
          }
        : t
    );

    setTickets(ticketsActualizados);
    alert("✔ Ticket actualizado correctamente");
    setModalEditar(false);
  };

  const cerrarTicket = (ticket: Ticket) => {
    const confirmacion = confirm(
      `¿Estás seguro de cerrar el ticket ${ticket.id}?`
    );
    if (!confirmacion) return;

    // Lo saco de la lista de activos y lo paso al histórico
    const restantes = tickets.filter((t) => t.id !== ticket.id);
    const cerrado: Ticket = { ...ticket, estado: "Cerrado" };

    setTickets(restantes);
    setTicketsHistorico([...ticketsHistorico, cerrado]);

    alert("✔ Ticket cerrado correctamente");
    setModalDetalle(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/inquilino"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]"
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link
            href="/inquilino/contrato"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]"
          >
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link
            href="/inquilino/pagos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]"
          >
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link
            href="/inquilino/tickets"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]"
          >
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link
            href="/inquilino/expensas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]"
          >
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link
            href="/inquilino/perfil"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]"
          >
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#156b52]">
          <p className="text-sm text-gray-300 mb-2">Inquilino</p>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#156b52]">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Tickets</h2>
            <p className="text-gray-600">
              Mantenimiento y problemas por prioridad
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModalHistorico(true)}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Ver Histórico
            </button>
            <button
              onClick={() => setModalCrear(true)}
              className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold"
            >
              Crear Ticket
            </button>
          </div>
        </header>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total de Tickets</p>
            <p className="text-3xl font-bold text-gray-800">
              {tickets.filter((t) => t.estado !== "Cerrado").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">En Proceso</p>
            <p className="text-3xl font-bold text-orange-600">
              {tickets.filter((t) => t.estado === "En proceso").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Resueltos</p>
            <p className="text-3xl font-bold text-green-600">
              {ticketsHistorico.length}
            </p>
          </div>
        </div>

        {/* Tickets por Prioridad */}
        <div className="space-y-6">
          {/* Urgentes */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Urgentes</h3>
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                {getPrioridadCount("Urgente")}
              </span>
            </div>

            {tickets
              .filter((t) => t.prioridad === "Urgente" && t.estado !== "Cerrado")
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gray-50 rounded-lg p-4 mb-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-800">
                          {ticket.id}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            ticket.estado
                          )}`}
                        >
                          {ticket.estado}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {ticket.descripcion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {ticket.direccion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📅 {ticket.fecha}
                      </p>
                      <p className="text-sm text-gray-600">
                        👨‍🔧 Técnico: {ticket.tecnico || "No arreglado"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirDetalle(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Ver"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => abrirEditar(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => cerrarTicket(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Cerrar"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Medios */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Medios</h3>
              <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold">
                {getPrioridadCount("Media")}
              </span>
            </div>

            {tickets
              .filter((t) => t.prioridad === "Media" && t.estado !== "Cerrado")
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gray-50 rounded-lg p-4 mb-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-800">
                          {ticket.id}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            ticket.estado
                          )}`}
                        >
                          {ticket.estado}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {ticket.descripcion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {ticket.direccion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📅 {ticket.fecha}
                      </p>
                      <p className="text-sm text-gray-600">
                        👨‍🔧 Técnico: {ticket.tecnico || "Derivado"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirDetalle(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Ver"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => abrirEditar(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => cerrarTicket(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Cerrar"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Bajos */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Bajos</h3>
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                {getPrioridadCount("Baja")}
              </span>
            </div>

            {tickets
              .filter((t) => t.prioridad === "Baja" && t.estado !== "Cerrado")
              .map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-gray-50 rounded-lg p-4 mb-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-800">
                          {ticket.id}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            ticket.estado
                          )}`}
                        >
                          {ticket.estado}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {ticket.descripcion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {ticket.direccion}
                      </p>
                      <p className="text-sm text-gray-600">
                        📅 {ticket.fecha}
                      </p>
                      <p className="text-sm text-gray-600">
                        👨‍🔧 Técnico: {ticket.tecnico || "No asignado"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirDetalle(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Ver"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => abrirEditar(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => cerrarTicket(ticket)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Cerrar"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* MODAL: Histórico */}
      {modalHistorico && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Histórico de Tickets
                </h3>
                <p className="text-sm text-gray-600">
                  Todos los tickets finalizados y cerrados
                </p>
              </div>
              <button
                onClick={() => setModalHistorico(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Cerrados</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {ticketsHistorico.length}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Urgentes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      ticketsHistorico.filter(
                        (t) => t.prioridad === "Urgente"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Medios</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      ticketsHistorico.filter(
                        (t) => t.prioridad === "Media"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Bajos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      ticketsHistorico.filter(
                        (t) => t.prioridad === "Baja"
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {ticketsHistorico.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-green-600">
                            {ticket.id}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(
                              ticket.prioridad || "Baja"
                            )}`}
                          >
                            {ticket.prioridad}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium mb-2">
                          {ticket.descripcion}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              Propiedad: {ticket.direccion}
                            </p>
                            <p className="text-gray-600">
                              Inquilino: {ticket.inquilino || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              Técnico: {ticket.tecnico}
                            </p>
                            <p className="text-gray-600">
                              Creado: {ticket.fechaCreacion} | Cerrado:{" "}
                              {ticket.fechaCerrado}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setModalHistorico(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Crear Ticket */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Crear Nuevo Ticket
              </h3>
              <button
                onClick={() => setModalCrear(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Ticket
                </label>
                <input
                  value={`TKT-00${tickets.length + 1} (Se genera automáticamente)`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propiedad *
                </label>
                <select
                  value={propiedadNueva}
                  onChange={(e) => setPropiedadNueva(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a]"
                >
                  <option value="">Selecciona la propiedad</option>
                  <option value="1">Calle Secundaria 456</option>
                  {/* usa el id real de la propiedad en value */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Problema *
                </label>
                <textarea
                  value={descripcionNueva}
                  onChange={(e) => setDescripcionNueva(e.target.value)}
                  placeholder="Describe el problema de forma clara y detallada"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Problema
                  </label>
                  <select
                    value={tipoProblema}
                    onChange={(e) => setTipoProblema(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Plomería">Plomería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Cerrajería">Cerrajería</option>
                    <option value="Pintura">Pintura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={prioridadNueva}
                    onChange={(e) => setPrioridadNueva(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={estadoNuevo}
                    onChange={(e) => setEstadoNuevo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En proceso">En proceso</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar Imágenes (Opcional)
                </label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer">
                  <p className="text-gray-500">
                    📷 Haz clic para seleccionar imágenes
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG hasta 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFotoArchivo(e.target.files?.[0] ?? null)
                    }
                  />
                  {fotoArchivo && (
                    <p className="mt-2 text-sm text-gray-600">
                      Archivo seleccionado: {fotoArchivo.name}
                    </p>
                  )}
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setModalCrear(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearTicket}
                  className="flex-1 px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold"
                >
                  Crear Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detalle del Ticket */}
      {modalDetalle && ticketSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Detalles del Ticket {ticketSeleccionado.id}
              </h3>
              <button
                onClick={() => setModalDetalle(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {ticketSeleccionado.id}
                    </h4>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Prioridad: {ticketSeleccionado.prioridad}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                        ticketSeleccionado.estado
                      )}`}
                    >
                      {ticketSeleccionado.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Creado el {ticketSeleccionado.fecha}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">
                  Descripción del Problema
                </h5>
                <p className="text-gray-700">
                  {ticketSeleccionado.descripcion}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Propiedad</p>
                  <p className="font-semibold text-gray-800">
                    {ticketSeleccionado.direccion}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                      ticketSeleccionado.estado
                    )}`}
                  >
                    {ticketSeleccionado.estado}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Tipo de Problema
                  </p>
                  <p className="font-semibold text-gray-800">
                    {ticketSeleccionado.tipoProblema || "Plomería"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Subestado</p>
                  <p className="font-semibold text-gray-800">
                    {ticketSeleccionado.subestado || "No arreglado"}
                  </p>
                </div>
              </div>

              {ticketSeleccionado.tecnico && (
                <div className="border-2 border-[#1a5f4a] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Técnico Asignado
                      </p>
                      <p className="font-semibold text-gray-800">
                        👨‍🔧 {ticketSeleccionado.tecnico}
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                      Cambiar Técnico
                    </button>
                  </div>
                </div>
              )}

              {ticketSeleccionado.historial &&
                ticketSeleccionado.historial.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">
                      Historial de Movimientos
                    </h5>
                    <div className="space-y-3">
                      {ticketSeleccionado.historial.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="w-8 h-8 bg-[#1a5f4a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-800">
                                {item.accion}
                              </p>
                              <p className="text-xs text-gray-500">
                                📅 {item.fecha}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.detalle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setModalDetalle(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setModalDetalle(false);
                    abrirEditar(ticketSeleccionado);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => cerrarTicket(ticketSeleccionado)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Cerrar Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Editar Ticket */}
      {modalEditar && ticketSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                Editar Ticket {ticketSeleccionado.id}
              </h3>
              <button
                onClick={() => setModalEditar(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Ticket
                </label>
                <input
                  value={ticketSeleccionado.id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propiedad
                </label>
                <input
                  value={ticketSeleccionado.direccion}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Problema *
                </label>
                <textarea
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                  placeholder="Describe el problema de forma clara y detallada"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f4a]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Problema
                  </label>
                  <select
                    value={tipoProblemaEdit}
                    onChange={(e) => setTipoProblemaEdit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Plomería">Plomería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Cerrajería">Cerrajería</option>
                    <option value="Pintura">Pintura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={prioridadEdit}
                    onChange={(e) => setPrioridadEdit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={estadoEdit}
                    onChange={(e) => setEstadoEdit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {prioridadEdit === "Urgente"
                    ? "Prioridad Urgente: Este ticket requiere atención inmediata"
                    : "Recuerda actualizar el estado según el avance del ticket"}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setModalEditar(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarEdicion}
                  className="flex-1 px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
