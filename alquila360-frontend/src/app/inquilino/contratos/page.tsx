"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/app/utils/axios.util";

// INTERFAZ REALISTA DEL CONTRATO
interface Contrato {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_mensual: number;
  estado: string;
  propiedad: {
    id: number;
    direccion: string;
    ciudad: string;
    tipo: string;
    descripcion: string | null;
    precio_referencia: number;
    fotos: { url: string }[];
    propietario: {
      id: number;
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}



export default function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadContrato = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) return;

      const res = await fetch(`http://localhost:3001/contrato/actual/${userId}`);
      const data = await res.json();

      if (!data || !data.id) {
        setContratos([]);
        setLoading(false);
        return;
      }

      setContratos([data]);  
      setLoading(false);

    } catch (error) {
      console.error("Error cargando contrato:", error);
      setLoading(false);
    }
  };

  loadContrato();
}, []);



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a5f4a] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ALQUILA 360</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/inquilino" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#156b52]">
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/inquilino/contratos" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#156b52]">
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

      {/* MAIN */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Contratos</h2>
            <p className="text-gray-600">Historial de contratos de alquiler</p>
          </div>
          <button className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition font-semibold">
            Nuevo Contrato
          </button>
        </header>

        {/* TABLA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propiedad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inquilino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuota Mensual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Cargando contratos...
                    </td>
                  </tr>
                )}

                {!loading && contratos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No tienes contratos registrados
                    </td>
                  </tr>
                )}

                {contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">📄 {c.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
  {c.propiedad?.direccion ?? "Sin dirección"}
  <br />
  <span className="text-gray-400 text-xs">
    {c.propiedad?.tipo}
  </span>
</td>

                    <td className="px-6 py-4 text-sm text-gray-600">
  Usted mismo
</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.fecha_inicio}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.fecha_fin}</td>
                    
<td className="px-6 py-4 text-sm font-semibold text-gray-900">
  ${c.monto_mensual}
</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HISTORIAL FINALIZADOS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Historial de Contratos Finalizados</h3>
          <p className="text-gray-600">No hay contratos finalizados para mostrar.</p>
        </div>
      </main>
    </div>
  );
}
