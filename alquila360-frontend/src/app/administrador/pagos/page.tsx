"use client";

import React from "react";
import Link from "next/link";
import SidebarAdministrador from "../../components/sideBarAdministrador";

const activeLabel = "Pagos";

type PagoEstado = "Pagado" | "Pendiente";

type Pago = {
  inquilino: string;
  propiedad: string;
  monto: string;
  fecha: string;
  metodo: string;
  estado: PagoEstado;
};

const pagos: Pago[] = [
  {
    inquilino: "Maria Gonzalez",
    propiedad: "San Isidro 1234",
    monto: "$85.000",
    fecha: "20 Nov 2024",
    metodo: "Transferencia",
    estado: "Pagado",
  },
  {
    inquilino: "Carlos Rodriguez",
    propiedad: "Palermo 5678",
    monto: "$120.000",
    fecha: "15 Nov 2024",
    metodo: "Efectivo",
    estado: "Pagado",
  },
  {
    inquilino: "Ana Martinez",
    propiedad: "Belgrano 910",
    monto: "$95.000",
    fecha: "10 Nov 2024",
    metodo: "Debito automatico",
    estado: "Pagado",
  },
  {
    inquilino: "Luis Perez",
    propiedad: "Recoleta 456",
    monto: "$75.000",
    fecha: "05 Dic 2024",
    metodo: "Transferencia",
    estado: "Pendiente",
  },
];

export default function PagosPage() {
  const totalMes = "$300.000";
  const completados = 3;
  const pendientes = 1;

  const getEstadoClasses = (estado: PagoEstado) => {
    if (estado === "Pagado") {
      return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    }
    return "bg-amber-100 text-amber-700 border border-amber-300";
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />
      

      {/* contenido pagos */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestion de Pagos
            </h1>
            <p className="text-sm text-slate-500">
              Control de pagos de alquileres
            </p>
          </div>

          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm">
            <span>⬇</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Recaudado (mes)</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {totalMes}
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Pagos Completados</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {completados}
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Pagos Pendientes</p>
            <p className="text-3xl font-bold text-amber-500 mt-2">
              {pendientes}
            </p>
          </div>
        </section>

        {/* tabla pagos */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Inquilino</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Metodo de Pago</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{pago.inquilino}</td>
                  <td className="p-3">{pago.propiedad}</td>
                  <td className="p-3">{pago.monto}</td>
                  <td className="p-3">{pago.fecha}</td>
                  <td className="p-3">{pago.metodo}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoClasses(
                          pago.estado
                        )}`}
                      >
                        {pago.estado}
                      </span>
                      <button className="px-3 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs flex items-center gap-1 hover:bg-slate-100">
                        <span>Opciones</span>
                        <span>▾</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
