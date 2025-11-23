"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Pago {
  id: string;
  mes: string;
  monto: number;
  fechaLimite: string;
  fechaPago: string | null;
  estado: "Pagado" | "Pendiente" | "En Mora";
}
export default function GestionPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [pagosRecibidos, setPagosRecibidos] = useState(2500);
  const [pagosPendientes, setpagosPendientes] = useState(2500);
  const [enMora, setEnMora] = useState(2500);
  useEffect(() => {
    // Datos de ejemplo - conecta con tu backend
    setPagos([
      {
        id: "pay1",
        mes: "Noviembre 2024",
        monto: 250,
        fechaLimite: "2024-11-10",
        fechaPago: "2024-11-01",
        estado: "Pagado"
      },
      {
        id: "pay2",
        mes: "Diciembre 2024",
        monto: 250,
        fechaLimite: "2024-12-10",
        fechaPago: null,
        estado: "Pendiente"
      },
      {
        id: "pay3",
        mes: "Octubre 2024",
        monto: 250,
        fechaLimite: "2024-10-10",
        fechaPago: null,
        estado: "En Mora"
      }
    ]);
  }, []);
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagado": return "bg-green-100 text-green-700";
      case "Pendiente": return "bg-yellow-100 text-yellow-700";
      case "En Mora": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
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
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h2>
            <p className="text-gray-600">Historial de cuotas y pagos</p>
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center gap-2">
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>
        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pagos Recibidos</h3>
              <span className="text-3xl">📄</span>
            </div>
            <p className="text-3xl font-bold text-green-600">${pagosRecibidos}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pagos Pendientes</h3>
              <span className="text-3xl">💵</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">${pagosPendientes}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">En Mora</h3>
              <span className="text-3xl">📛</span>
            </div>
            <p className="text-3xl font-bold text-red-600">${enMora}</p>
          </div>
        </div>
        {/* Tabla de Pagos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pago.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pago.mes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${pago.monto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pago.fechaLimite}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pago.fechaPago || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(pago.estado)}`}>
                        {pago.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}