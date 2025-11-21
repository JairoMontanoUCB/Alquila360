"use client";

import React, { useState } from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  fechaInicio: string;
  fechaFin: string;
  cuotaMensual: string;
  estado: "Vigente" | "Finalizado";
};

const contratosVigentes: Contrato[] = [
  {
    id: "C-001",
    propiedad: "Calle Secundaria 456",
    inquilino: "Maria Gonzalez",
    fechaInicio: "01/01/2024",
    fechaFin: "31/12/2024",
    cuotaMensual: "$85.000",
    estado: "Vigente",
  },
];

export default function ContratosPage() {
  const [showNuevoContrato, setShowNuevoContrato] = useState(false);
  const [showDetalleContrato, setShowDetalleContrato] = useState(false);
  const [showEditarContrato, setShowEditarContrato] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* contenido contratos */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Contratos
            </h1>
            <p className="text-sm text-slate-500">
              Historial de contratos de alquiler
            </p>
          </div>

          <button
            onClick={() => setShowNuevoContrato(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Nuevo Contrato
          </button>
        </header>

        {/* tabla contratos vigentes */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">N° Contrato</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Inquilino</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Fecha Fin</th>
                <th className="p-3">Cuota Mensual</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contratosVigentes.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.propiedad}</td>
                  <td className="p-3">{c.inquilino}</td>
                  <td className="p-3">{c.fechaInicio}</td>
                  <td className="p-3">{c.fechaFin}</td>
                  <td className="p-3">{c.cuotaMensual}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {/* OJITO: abre contrato de locacion */}
                      <button
                        onClick={() => setShowDetalleContrato(true)}
                        className="px-3 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200"
                      >
                        👁️
                      </button>

                      {/* Renovar: por ahora solo placeholder, NO abre editar contrato */}
                      <button
                        onClick={() => {
                          // aqui despues puedes abrir un modal de renovacion
                        }}
                        className="px-3 py-1 rounded-lg text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                      >
                        Renovar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contratosVigentes.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-400">
                    No hay contratos vigentes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* historial contratos finalizados */}
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-[#123528] mb-2">
            Historial de Contratos Finalizados
          </h2>
          <p className="text-sm text-slate-500">
            No hay contratos finalizados para mostrar.
          </p>
        </div>
      </section>

      {/* MODAL: NUEVO CONTRATO */}
      {showNuevoContrato && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#123528]">
                Crear Nuevo Contrato
              </h2>
              <button
                onClick={() => setShowNuevoContrato(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* PARTES DEL CONTRATO */}
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Partes del Contrato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Propiedad
                  </label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                    <option>Seleccionar propiedad</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Inquilino
                  </label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                    <option>Seleccionar inquilino</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Propietario
                  </label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                    <option>Seleccionar propietario</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DURACION DEL CONTRATO */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Duracion del Contrato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Fecha de Finalizacion
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* INFORMACION FINANCIERA */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Informacion Financiera
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Monto del Alquiler ($/mes)
                  </label>
                  <input
                    type="number"
                    defaultValue={85000}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Monto de la Garantia ($)
                  </label>
                  <input
                    type="number"
                    defaultValue={170000}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* DETALLE DE CUOTAS */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Detalle de Cuotas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Frecuencia de Cobro
                  </label>
                  <select className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm">
                    <option>Mensual</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Numero de Cuotas
                  </label>
                  <input
                    type="number"
                    defaultValue={12}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Dia de Vencimiento
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Nota: Todas las cuotas tendran el mismo valor mensual de $0.
              </p>
            </div>

            {/* PENALIDADES */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Penalidades por Incumplimiento
              </h3>
              <textarea
                rows={3}
                placeholder="Ej: Mora del 2% por dia de atraso en el pago. Costo de reparaciones por danos..."
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm resize-none"
              />
            </div>

            {/* CLAUSULAS ADICIONALES */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Clausulas Adicionales
              </h3>
              <textarea
                rows={3}
                placeholder="Agregue cualquier clausula adicional del contrato..."
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-sm resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowNuevoContrato(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm font-semibold">
                Guardar Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VER CONTRATO */}
      {showDetalleContrato && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-5xl p-6 shadow-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#123528]">
                Contrato de Alquiler
              </h2>
              <button
                onClick={() => setShowDetalleContrato(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* titulo grande */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-extrabold text-[#123528] tracking-wide">
                CONTRATO DE LOCACION
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Sistema de Gestion ALQUILA 360
              </p>
              <p className="text-xs text-[#c27a3a] mt-1">
                📄 Contrato N° C-001
              </p>
            </div>

            <hr className="my-4 border-slate-200" />

            {/* PARTES DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                PARTES DEL CONTRATO
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* locador */}
                <div className="border border-emerald-900 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-900 mb-1 flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    LOCADOR (Propietario)
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Juan Carlos Martinez
                  </p>
                  <p className="text-xs text-slate-600 mt-1">DNI: 28.456.789</p>
                  <p className="text-xs text-slate-600">
                    martinez@email.com
                  </p>
                </div>

                {/* locatario */}
                <div className="border border-emerald-900 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-900 mb-1 flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    LOCATARIO (Inquilino)
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    Maria Gonzalez
                  </p>
                  <p className="text-xs text-slate-600 mt-1">DNI: 32.654.987</p>
                  <p className="text-xs text-slate-600">maria@email.com</p>
                </div>
              </div>
            </section>

            {/* INMUEBLE */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-2">
                INMUEBLE
              </h3>

              <div className="bg-[#f7f2e8] border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-2">
                  <span>🏠</span>Direccion de la Propiedad
                </p>
                <p className="text-sm text-slate-800">
                  Avenida Libertador 1234, San Isidro, Buenos Aires
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Tipo: Casa · Superficie: 120 m² · Ambientes: 3
                </p>
              </div>
            </section>

            {/* PLAZO DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                PLAZO DEL CONTRATO
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-900 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">
                    <span>📅</span> Fecha de Inicio
                  </p>
                  <p className="text-sm text-slate-800">
                    01 de Enero de 2024
                  </p>
                </div>

                <div className="border border-emerald-900 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-2">
                    <span>📅</span> Fecha de Finalizacion
                  </p>
                  <p className="text-sm text-slate-800">
                    31 de Diciembre de 2024
                  </p>
                </div>
              </div>
            </section>

            {/* CONDICIONES ECONOMICAS */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                CONDICIONES ECONOMICAS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#f7f2e8] rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <span>💲</span> Alquiler Mensual
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    $85.000
                  </p>
                </div>

                <div className="bg-[#f7f2e8] rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <span>💰</span> Garantia
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    $170.000
                  </p>
                </div>

                <div className="bg-[#f7f2e8] rounded-xl p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-slate-600 mb-1">
                    Vencimiento
                  </p>
                  <p className="text-xl font-bold text-slate-900">Dia 10</p>
                </div>
              </div>
            </section>

            {/* DETALLE DE CUOTAS */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                DETALLE DE CUOTAS
              </h3>

              <div className="border border-emerald-900 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">
                      Frecuencia
                    </p>
                    <p className="text-sm text-slate-800">Mensual</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">
                      Numero de Cuotas
                    </p>
                    <p className="text-sm text-slate-800">12 cuotas</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">
                      Valor por Cuota
                    </p>
                    <p className="text-sm text-slate-800">$85.000</p>
                  </div>
                </div>

                <p className="text-xs text-center text-slate-600">
                  Todas las cuotas tendran el mismo valor mensual sin
                  variacion.
                </p>
              </div>
            </section>

            {/* PENALIDADES */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                PENALIDADES
              </h3>

              <div className="border border-emerald-900 rounded-xl p-4 text-sm text-slate-700 space-y-1">
                <p>• Mora del 2% por dia de atraso en el pago.</p>
                <p>
                  • El locatario sera responsable de los costos de reparacion
                  por danos causados.
                </p>
                <p>
                  • Rescision anticipada: Penalidad equivalente a 2 meses de
                  alquiler.
                </p>
              </div>
            </section>

            {/* CLAUSULAS ADICIONALES */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold text-[#123528] mb-3">
                CLAUSULAS ADICIONALES
              </h3>

              <div className="border border-emerald-900 rounded-xl p-4 text-sm text-slate-700 space-y-1">
                <p>
                  • El locatario se compromete a mantener la propiedad en buen
                  estado.
                </p>
                <p>
                  • No se permiten modificaciones estructurales sin autorizacion
                  escrita.
                </p>
                <p>
                  • Los gastos de servicios publicos correran por cuenta del
                  locatario.
                </p>
                <p>
                  • Prohibida la cesion o subarriendo sin consentimiento del
                  locador.
                </p>
              </div>
            </section>

            {/* FIRMAS */}
            <section className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-8">
                <div>
                  <div className="border-t border-slate-400 w-3/4 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Juan Carlos Martinez
                  </p>
                  <p className="text-xs text-slate-500">Firma del Locador</p>
                </div>
                <div>
                  <div className="border-t border-slate-400 w-3/4 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Maria Gonzalez
                  </p>
                  <p className="text-xs text-slate-500">Firma del Locatario</p>
                </div>
              </div>
            </section>

            {/* botones finales */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg text-sm border border-slate-300 hover:bg-slate-100">
                Imprimir
              </button>

              {/* ESTE EDITAR ES EL QUE ABRE EL MODAL DE EDITAR CONTRATO */}
              <button
                onClick={() => {
                  setShowDetalleContrato(false);
                  setShowEditarContrato(true);
                }}
                className="px-4 py-2 rounded-lg text-sm border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                Editar
              </button>

              <button
                onClick={() => setShowDetalleContrato(false)}
                className="px-4 py-2 rounded-lg text-sm bg-yellow-400 hover:bg-yellow-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CONTRATO */}
      {showEditarContrato && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#123528]">
                Editar Contrato
              </h2>
              <button
                onClick={() => setShowEditarContrato(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* PARTES DEL CONTRATO */}
            <div className="bg-[#f7f2e8] rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Partes del Contrato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Propiedad
                  </label>
                  <select
                    defaultValue="prop"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  >
                    <option value="prop">Seleccionar propiedad</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Inquilino
                  </label>
                  <select
                    defaultValue="inq"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  >
                    <option value="inq">Seleccionar inquilino</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Propietario
                  </label>
                  <select
                    defaultValue="propiet"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"
                  >
                    <option value="propiet">Seleccionar propietario</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DURACION DEL CONTRATO */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Duracion del Contrato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    defaultValue="2024-01-01"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Fecha de Finalizacion
                  </label>
                  <input
                    type="date"
                    defaultValue="2024-12-31"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* INFORMACION FINANCIERA */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Informacion Financiera
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Monto del Alquiler ($/mes)
                  </label>
                  <input
                    type="number"
                    defaultValue={85000}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Monto de la Garantia ($)
                  </label>
                  <input
                    type="number"
                    defaultValue={170000}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* DETALLE DE CUOTAS */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Detalle de Cuotas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Frecuencia de Cobro
                  </label>
                  <select
                    defaultValue="Mensual"
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  >
                    <option>Mensual</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Numero de Cuotas
                  </label>
                  <input
                    type="number"
                    defaultValue={12}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Dia de Vencimiento
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Nota: Todas las cuotas tendran el mismo valor mensual de $0.
              </p>
            </div>

            {/* PENALIDADES */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Penalidades por Incumplimiento
              </h3>
              <textarea
                rows={3}
                defaultValue="Ej: Mora del 2% por dia de atraso en el pago. Costo de reparaciones por danos..."
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm resize-none"
              />
            </div>

            {/* CLAUSULAS ADICIONALES */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Clausulas Adicionales
              </h3>
              <textarea
                rows={3}
                defaultValue="Agregue cualquier clausula adicional del contrato..."
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-slate-100 text-sm resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEditarContrato(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm font-semibold">
                Guardar Contrato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
