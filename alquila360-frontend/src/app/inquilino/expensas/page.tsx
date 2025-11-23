"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Expensa {
  id: string;
  propiedad: string;
  tipo: "Agua" | "Luz" | "Gas" | "Mantenimiento";
  descripcion: string;
  monto: number;
  fecha: string;
  estado: "Pagado" | "No pagado";
}
export default function GestionExpensas() {
  const [expensas, setExpensas] = useState<Expensa[]>([]);
  const [totalExpensas, setTotalExpensas] = useState(400);
  const [pagadas, setPagadas] = useState(280);
  const [noPagadas, setNoPagadas] = useState(120);
  useEffect(() => {
    // Datos de ejemplo - conecta con tu backend
    setExpensas([
      {
        id: "exp1",
        propiedad: "Calle Secundaria 456",
        tipo: "Agua",
        descripcion: "Factura de agua del mes de noviembre",
        monto: 45,
        fecha: "2024-11-15",
        estado: "Pagado"
      },
      {
        id: "exp2",
        propiedad: "Calle Secundaria 456",
        tipo: "Luz",
        descripcion: "Factura de electricidad del mes de noviembre",
        monto: 120,
        fecha: "2024-11-15",
        estado: "No pagado"
      },
      {
        id: "exp3",
        propiedad: "Calle Secundaria 456",
        tipo: "Gas",
        descripcion: "Factura de gas del mes de noviembre",
        monto: 3,
        fecha: "2024-11-15",
        estado: "Pagado"
      },
      {
        id: "exp4",
        propiedad: "Calle Secundaria 456",
        tipo: "Mantenimiento",
        descripcion: "Mantenimiento general del edificio",
        monto: 20,
        fecha: "2024-11-10",
        estado: "Pagado"
      }
    ]);
  }, []);
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Agua": return "💧";
      case "Luz": return "💡";
      case "Gas": return "🔥";
      case "Mantenimiento": return "🔧";
      default: return "📄";
    }
  };
  const getEstadoColor = (estado: string) => {
    return estado === "Pagado" 
      ? "bg-green-100 text-green-700" 
      : "bg-red-100 text-red-700";
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
            <h2 className="text-3xl font-bold text-gray-800">Gestión de Expensas</h2>
            <p className="text-gray-600">Gastos por inmueble</p>
          </div>
          <button className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold">
            Registrar Expensa
          </button>
        </header>
        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Expensas</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">${totalExpensas}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pagadas</h3>
              <span className="text-3xl">💵</span>
            </div>
            <p className="text-3xl font-bold text-green-600">${pagadas}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">No Pagadas</h3>
              <span className="text-3xl">📛</span>
            </div>
            <p className="text-3xl font-bold text-red-600">${noPagadas}</p>
          </div>
        </div>
        {/* Tabla de Expensas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expensas.map((expensa) => (
                  <tr key={expensa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expensa.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expensa.propiedad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="flex items-center gap-2">
                        <span>{getTipoIcon(expensa.tipo)}</span>
                        <span>{expensa.tipo}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {expensa.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${expensa.monto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expensa.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(expensa.estado)}`}>
                        {expensa.estado}
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