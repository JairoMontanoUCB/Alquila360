"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TicketHistorial {
  id: number;
  descripcion: string;
  fecha_completado: string;
  propiedad: {
    direccion: string;
  };
}

export default function Historial() {
  const [tickets, setTickets] = useState<TicketHistorial[]>([]);

  useEffect(() => {
    setTickets([
      {
        id: 3,
        descripcion: "Sistema de calefacción no funciona",
        fecha_completado: "2024-11-10",
        propiedad: { direccion: "Boulevard Central 789" }
      },
      {
        id: 4,
        descripcion: "Reparación de ventana rota",
        fecha_completado: "2024-11-05",
        propiedad: { direccion: "Avenida Norte 321" }
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
            <span>Home</span>
          </Link>
          <Link href="/tecnico/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🎫</span>
            <span>Tickets Asignados</span>
          </Link>
          <Link href="/tecnico/historial" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
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
          <h2 className="text-3xl font-bold text-gray-800">Historial de Tickets</h2>
          <p className="text-gray-600">Tickets completados</p>
        </header>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-600">No hay tickets completados aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        TKT-{String(ticket.id).padStart(3, '0')}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Completado
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{ticket.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📍 {ticket.propiedad.direccion}</span>
                      <span>✅ Completado: {ticket.fecha_completado}</span>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-[#1a5f4a] text-white rounded-lg hover:bg-[#156b52] transition">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}