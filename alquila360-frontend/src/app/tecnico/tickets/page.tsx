"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Ticket {
  id: number;
  descripcion: string;
  prioridad: string;
  estado: string;
  fecha_limite: string;
  propiedad: {
    direccion: string;
  };
}

export default function TicketsAsignados() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setTickets([
      {
        id: 1,
        descripcion: "Fuga de agua en el baño principal",
        prioridad: "roja",
        estado: "pendiente",
        fecha_limite: "2024-11-18",
        propiedad: { direccion: "Calle Secundaria 456" }
      },
      {
        id: 2,
        descripcion: "La puerta de entrada no cierra correctamente",
        prioridad: "naranja",
        estado: "en_proceso",
        fecha_limite: "2024-11-15",
        propiedad: { direccion: "Calle Primaria 123" }
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/tecnico" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🏠</span>
            <span>HOME</span>
          </Link>
          <Link href="/tecnico/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
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
          <h2 className="text-3xl font-bold text-gray-800">Tickets Asignados</h2>
          <p className="text-gray-600">Trabajos pendientes y en proceso</p>
        </header>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      TKT-{String(ticket.id).padStart(3, '0')}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      {ticket.prioridad}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {ticket.estado}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{ticket.descripcion}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📍 {ticket.propiedad.direccion}</span>
                    <span>📅 {ticket.fecha_limite}</span>
                  </div>
                </div>

                <button className="px-4 py-2 bg-[#1a5f4a] text-white rounded-lg hover:bg-[#156b52] transition">
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}