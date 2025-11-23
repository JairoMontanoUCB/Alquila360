"use client";

import { useState } from "react";
import Link from "next/link";

export default function InquilinoDashboard() {
  const [contratoActivo] = useState({
    estado: "Vigente",
    fechaInicio: "31/12/2023",
    fechaFin: "31/12/2024",
    cuotaMensual: 2500
  });

  const [proximoPago] = useState({
    monto: 2500,
    fecha: "Diciembre 2024",
    vencimiento: "2024-12-10"
  });

  const [tickets] = useState({
    abiertos: 3,
    pendientes: 1
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
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

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Mi Dashboard</h2>
          <p className="text-gray-600">Resumen de tu alquiler</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Contrato Activo</h3>
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{contratoActivo.estado}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Próximo Pago</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">${proximoPago.monto}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Tickets Abiertos</h3>
              <span className="text-2xl">🔧</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{tickets.abiertos}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Expensas Pendientes</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{tickets.pendientes}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mi Contrato Actual</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha Inicio</p>
              <p className="font-semibold">{contratoActivo.fechaInicio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha Fin</p>
              <p className="font-semibold">{contratoActivo.fechaFin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Cuota Mensual</p>
              <p className="font-semibold">${contratoActivo.cuotaMensual}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Próximo Pago</p>
                <p className="text-sm text-gray-600">{proximoPago.fecha} - Vence el {proximoPago.vencimiento}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-gray-800">${proximoPago.monto}</p>
              <button className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold">
                Pagar Ahora
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Reportar Problema</h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <span>➕</span>
              <span>Nuevo Ticket</span>
            </button>
          </div>
          <p className="text-gray-600">
            ¿Tienes algún problema en tu vivienda? Crea un ticket de mantenimiento y nos encargaremos de solucionarlo.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Tickets Recientes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">TKT-001 - Fuga de agua en el baño principal</p>
                <p className="text-sm text-gray-600">2024-11-18</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Abierto
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">TKT-002 - La puerta de entrada no cierra correctamente</p>
                <p className="text-sm text-gray-600">2024-11-15</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                En proceso
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">TKT-003 - Pintura descascarada en la pared del dormitorio</p>
                <p className="text-sm text-gray-600">2024-11-10</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Abierto
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}