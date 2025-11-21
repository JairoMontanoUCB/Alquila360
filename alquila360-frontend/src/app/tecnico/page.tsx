"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: "Urgente" | "Media" | "Baja";
  estado: "En proceso" | "Pendiente" | "Cerrado";
  fechaAsignada: string;
  propiedad: string;
}

export default function TecnicoDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalAtendidos: 2,
    pendientes: 1,
    tasaResolucion: "Excelente"
  });

  useEffect(() => {
    const ticketsEjemplo: Ticket[] = [
      {
        id: "TKT-001",
        titulo: "Fuga de agua en el baño principal",
        descripcion: "Fuga de agua en el baño principal",
        prioridad: "Urgente",
        estado: "Pendiente",
        fechaAsignada: "2024-11-18",
        propiedad: "Calle Secundaria 456"
      },
      {
        id: "TKT-002",
        titulo: "La puerta de entrada no cierra correctamente",
        descripcion: "La puerta de entrada no cierra correctamente",
        prioridad: "Media",
        estado: "En proceso",
        fechaAsignada: "2024-11-15",
        propiedad: "Avenida Principal 123"
      },
      {
        id: "TKT-003",
        titulo: "Sistema de calefacción no funciona",
        descripcion: "Sistema de calefacción no funciona",
        prioridad: "Urgente",
        estado: "Cerrado",
        fechaAsignada: "2024-11-10",
        propiedad: "Boulevard Central 789"
      }
    ];
    
    setTickets(ticketsEjemplo);
  }, []);

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente": return "bg-red-100 text-red-700";
      case "Media": return "bg-yellow-100 text-yellow-700";
      case "Baja": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-blue-100 text-blue-700";
      case "En proceso": return "bg-orange-100 text-orange-700";
      case "Cerrado": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/tecnico" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52] hover:bg-[#0f5641]">
            <span>🏠</span>
            <span>HOME</span>
          </Link>
          <Link href="/tecnico/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🎫</span>
            <span>Tickets Asignados</span>
          </Link>
          <Link href="/tecnico/historial" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>📜</span>
            <span>Historial</span>
          </Link>
          <Link href="/tecnico/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#156b52]">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard del Técnico</h2>
          <p className="text-gray-600">Resumen de tus asignaciones</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Tickets Asignados</h3>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {tickets.filter(t => t.estado !== "Cerrado").length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">En Proceso</h3>
              <span className="text-2xl">⚙️</span>
            </div>
            <p className="text-4xl font-bold text-orange-600">
              {tickets.filter(t => t.estado === "En proceso").length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Finalizados</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {tickets.filter(t => t.estado === "Cerrado").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Tickets Recientes</h3>
          </div>
          <div className="p-6 space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-800">{ticket.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-1">{ticket.descripcion}</p>
                  <p className="text-sm text-gray-500">{ticket.fechaAsignada}</p>
                </div>
                <button className="ml-4 px-4 py-2 bg-[#1a5f4a] text-white rounded-lg hover:bg-[#156b52] transition">
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas del Mes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Atendidos</span>
                <span className="font-semibold text-gray-800">{estadisticas.totalAtendidos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pendientes</span>
                <span className="font-semibold text-gray-800">{estadisticas.pendientes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tasa de Resolución</span>
                <span className="font-semibold text-green-600">{estadisticas.tasaResolucion}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Próximas Tareas</h3>
            <div className="space-y-3">
              {tickets
                .filter(t => t.estado !== "Cerrado")
                .slice(0, 2)
                .map(ticket => (
                  <div key={ticket.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">{ticket.id}</p>
                      <p className="text-sm text-gray-600">{ticket.propiedad}</p>
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