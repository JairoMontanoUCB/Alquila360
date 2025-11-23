"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  fecha: string;
  tecnico: string;
  estado: "Abierto" | "En proceso" | "Cerrado";
  prioridad: "Urgente" | "Media" | "Baja";
}
export default function GestionTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  useEffect(() => {
    // Datos de ejemplo - conecta con tu backend
    setTickets([
      {
        id: "TKT-001",
        titulo: "Fuga de agua en el baño principal",
        descripcion: "Fuga de agua en el baño principal",
        direccion: "Calle Secundaria 456",
        fecha: "2024-11-18",
        tecnico: "Carlos",
        estado: "Abierto",
        prioridad: "Urgente"
      },
      {
        id: "TKT-002",
        titulo: "La puerta de entrada no cierra correctamente",
        descripcion: "La puerta de entrada no cierra correctamente",
        direccion: "Calle Secundaria 456",
        fecha: "2024-11-15",
        tecnico: "Carlos",
        estado: "En proceso",
        prioridad: "Media"
      },
      {
        id: "TKT-003",
        titulo: "Pintura descascarada en la pared del dormitorio",
        descripcion: "Pintura descascarada en la pared del dormitorio",
        direccion: "Calle Secundaria 456",
        fecha: "2024-11-10",
        tecnico: "",
        estado: "Abierto",
        prioridad: "Baja"
      }
    ]);
  }, []);
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Abierto": return "bg-blue-100 text-blue-700";
      case "En proceso": return "bg-orange-100 text-orange-700";
      case "Cerrado": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente": return "text-red-600";
      case "Media": return "text-orange-600";
      case "Baja": return "text-green-600";
      default: return "text-gray-600";
    }
  };
  const ticketsPorPrioridad = {
    urgentes: tickets.filter(t => t.prioridad === "Urgente").length,
    medios: tickets.filter(t => t.prioridad === "Media").length,
    bajos: tickets.filter(t => t.prioridad === "Baja").length
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>
        
              <nav className="flex-1 px-4 space-y-2">
          <Link href="/inquilino" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/inquilino/contratos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link href="/inquilino/pagos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link href="/inquilino/ticket" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link href="/inquilino/expensas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link href="/inquilino/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
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
            <p className="text-gray-600">Mantenimiento y problemas por prioridad</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Ver Histórico
            </button>
            <button className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold flex items-center gap-2">
              <span>➕</span>
              <span>Crear Ticket</span>
            </button>
          </div>
        </header>
        {/* Tickets por Prioridad */}
        <div className="space-y-6">
          {/* Urgentes */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Urgentes</h3>
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                {ticketsPorPrioridad.urgentes}
              </span>
            </div>
            <div className="space-y-4">
              {tickets.filter(t => t.prioridad === "Urgente").map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-red-600">{ticket.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(ticket.estado)} inline-block mt-2`}>
                        {ticket.estado}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{ticket.descripcion}</p>
                  <p className="text-sm text-gray-600 mb-1">📍 {ticket.direccion}</p>
                  <p className="text-sm text-gray-600 mb-2">📅 {ticket.fecha}</p>
                  <p className="text-sm text-gray-600 mb-3">👨‍🔧 Técnico: {ticket.tecnico || "No asignado"}</p>
                  
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Ver">👁️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Editar">✏️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Eliminar">❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Medios */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-orange-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Medios</h3>
              <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                {ticketsPorPrioridad.medios}
              </span>
            </div>
            <div className="space-y-4">
              {tickets.filter(t => t.prioridad === "Media").map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-orange-600">{ticket.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(ticket.estado)} inline-block mt-2`}>
                        {ticket.estado}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{ticket.descripcion}</p>
                  <p className="text-sm text-gray-600 mb-1">📍 {ticket.direccion}</p>
                  <p className="text-sm text-gray-600 mb-2">📅 {ticket.fecha}</p>
                  <p className="text-sm text-gray-600 mb-3">👨‍🔧 Técnico: {ticket.tecnico || "No asignado"}</p>
                  
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Ver">👁️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Editar">✏️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Eliminar">❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Bajos */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-green-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Bajos</h3>
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                {ticketsPorPrioridad.bajos}
              </span>
            </div>
            <div className="space-y-4">
              {tickets.filter(t => t.prioridad === "Baja").map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-green-600">{ticket.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(ticket.estado)} inline-block mt-2`}>
                        {ticket.estado}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-2">{ticket.descripcion}</p>
                  <p className="text-sm text-gray-600 mb-1">📍 {ticket.direccion}</p>
                  <p className="text-sm text-gray-600 mb-2">📅 {ticket.fecha}</p>
                  <p className="text-sm text-gray-600 mb-3">👨‍🔧 Técnico: {ticket.tecnico || "No asignado"}</p>
                  
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Ver">👁️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Editar">✏️</button>
                    <button className="p-2 hover:bg-gray-200 rounded-full" title="Eliminar">❌</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}