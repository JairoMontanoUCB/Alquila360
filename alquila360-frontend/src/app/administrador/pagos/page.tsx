"use client";

import React from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador";

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

  const [openModal, setOpenModal] = React.useState(false);

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

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm"
          >
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

      {/* MODAL HISTORIAL COMPLETO */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 p-8 relative">
            {/* BOTON CERRAR */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* TITULO */}
            <h1 className="text-3xl font-extrabold text-[#123528] mb-1">
              Historial Completo de Pagos
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Registro de todos los pagos realizados
            </p>

            {/* RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Total de Pagos</p>
                <p className="text-3xl font-bold mt-1">8</p>
              </div>

              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Total Recaudado</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  $805.000
                </p>
              </div>

              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Periodo</p>
                <p className="text-2xl font-semibold mt-1">
                  Sep - Nov 2024
                </p>
              </div>
            </div>

            {/* TABLA MODAL */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Inquilino</th>
                    <th className="p-3 text-left">Propiedad</th>
                    <th className="p-3 text-left">Monto</th>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Método</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Periodo</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    {
                      inquilino: "María González",
                      propiedad: "San Isidro 1234",
                      monto: "$85.000",
                      fecha: "20 Nov 2024",
                      metodo: "Transferencia",
                      estado: "Pagado",
                      periodo: "Noviembre 2024",
                    },
                    {
                      inquilino: "Carlos Rodríguez",
                      propiedad: "Palermo 5678",
                      monto: "$120.000",
                      fecha: "15 Nov 2024",
                      metodo: "Efectivo",
                      estado: "Pagado",
                      periodo: "Noviembre 2024",
                    },
                  ].map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{row.inquilino}</td>
                      <td className="p-3">{row.propiedad}</td>
                      <td className="p-3">{row.monto}</td>
                      <td className="p-3">{row.fecha}</td>
                      <td className="p-3">{row.metodo}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-semibold">
                          {row.estado}
                        </span>
                      </td>
                      <td className="p-3">{row.periodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BOTONES ABAJO */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200"
              >
                Cerrar
              </button>

              <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                <span>⬇</span>
                Exportar a PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
