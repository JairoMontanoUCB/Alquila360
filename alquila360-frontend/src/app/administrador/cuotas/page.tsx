"use client";

import { useState } from "react";
import Sidebar from "../../components/sideBarPropietario";

export default function PagosPage() {
  // ---------------- DATOS ----------------
  const pagos = [
    {
      id: "pay1",
      mes: "Noviembre 2024",
      monto: "$2.500",
      fechaLimite: "2024-11-10",
      fechaPago: "2024-11-01",
      estado: "Pagado",
      tipo: "Cuota", 
    },
    {
      id: "pay2",
      mes: "Diciembre 2024",
      monto: "$2.500",
      fechaLimite: "2024-12-10",
      fechaPago: "-",
      estado: "Pendiente",
      tipo: "Cuota",
    },
    {
      id: "pay3",
      mes: "Octubre 2024",
      monto: "$2.500",
      fechaLimite: "2024-10-10",
      fechaPago: "-",
      estado: "En mora",
      tipo: "Expensa", 
    },
  ];

  // --- helpers para montos ---
  const parseMonto = (monto: string) =>
    Number(monto.replace(/[^0-9.-]/g, "")) || 0;

  const totalRecibido = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((acc, p) => acc + parseMonto(p.monto), 0);

  const totalPendiente = pagos
    .filter((p) => p.estado === "Pendiente")
    .reduce((acc, p) => acc + parseMonto(p.monto), 0);

  const totalMora = pagos
    .filter((p) => p.estado === "En mora")
    .reduce((acc, p) => acc + parseMonto(p.monto), 0);

  const totalGeneral = pagos.reduce((acc, p) => acc + parseMonto(p.monto), 0);

  /* ------------------------------------------
       ESTADO PARA MODAL DE RECIBO INDIVIDUAL
  -------------------------------------------*/
  const [modalPago, setModalPago] = useState<null | any>(null);

  /* ------------------------------------------
       ESTADO PARA MODAL DE HISTORIAL COMPLETO
  -------------------------------------------*/
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const getEstadoBadge = (estado: string) => {
    if (estado === "Pagado") {
      return "bg-[#d3f7e8] text-[#1b7c4b]";
    }
    if (estado === "Pendiente") {
      return "bg-[#ffeac0] text-[#d18b1a]";
    }
    return "bg-[#ffd9dd] text-[#d8454f]";
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* ---------------- HEADER ---------------- */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Gestión de Pagos</h2>
            <p className="text-sm text-gray-600">
              Historial de cuotas y pagos
            </p>
          </div>

          <button
            className="flex items-center gap-2 border border-[#15352b] rounded-lg px-4 py-2 text-sm hover:bg-[#eae4d7] transition"
            onClick={() => setMostrarHistorial(true)}
          >
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* ------------ TARJETAS RESUMEN ------------ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            titulo="Pagos Recibidos"
            valor={totalRecibido}
            color="#1b7c4b"
            bg="#d3f7e8"
          />
          <Card
            titulo="Pagos Pendientes"
            valor={totalPendiente}
            color="#e4a526"
            bg="#fff4d9"
          />
          <Card
            titulo="En Mora"
            valor={totalMora}
            color="#d8454f"
            bg="#ffd9dd"
          />
        </section>

        {/* ---------------- TABLA DE PAGOS ---------------- */}
        <section>
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Mes</th>
                  <th className="py-4 px-4">Monto</th>
                  <th className="py-4 px-4">Fecha Límite</th>
                  <th className="py-4 px-4">Fecha de Pago</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Tipo</th> 
                </tr>
              </thead>

              <tbody>
                {pagos.map((pago) => (
                  <tr
                    key={pago.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">{pago.id}</td>
                    <td className="py-3 px-4 text-sm">{pago.mes}</td>
                    <td className="py-3 px-4 text-sm">{pago.monto}</td>
                    <td className="py-3 px-4 text-sm">{pago.fechaLimite}</td>

                    {/* FECHA + BOTÓN RECIBO INDIVIDUAL */}
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{pago.fechaPago}</span>

                        {pago.estado === "Pagado" && (
                          <button
                            onClick={() => setModalPago(pago)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md border border-[#15352b] text-xs hover:bg-[#eae4d7] transition"
                          >
                            ⬇️ Recibo
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getEstadoBadge(
                          pago.estado
                        )}`}
                      >
                        {pago.estado}
                      </span>
                    </td>

                    {/* 👇 TIPO AL LADO DE ESTADO */}
                    <td className="py-3 px-4 text-sm">{pago.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* -----------------------------------------------
          MODAL — RECIBO DEL PAGO SELECCIONADO
      ------------------------------------------------ */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-[#cfc7b4]">
            {/* Header modal */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Comprobante de Pago</h2>
                <p className="text-sm text-gray-600">
                  Detalle del pago <b>{modalPago.id}</b>
                </p>
              </div>

              <button
                className="text-xl px-3 py-1 text-gray-600 hover:text-black"
                onClick={() => setModalPago(null)}
              >
                ✕
              </button>
            </div>

            {/* Datos */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <Field label="Mes / Periodo" value={modalPago.mes} />
              <Field label="Monto" value={modalPago.monto} />
              <Field label="Fecha Límite" value={modalPago.fechaLimite} />
              <Field label="Fecha de Pago" value={modalPago.fechaPago} />
              <Field label="Estado" value={modalPago.estado} />
              <Field label="Tipo de pago" value={modalPago.tipo} /> {/* 👈 NUEVO */}
            </div>

            <hr className="border-[#e0d7c8] mb-4" />

            <p className="text-xs text-gray-500 mb-6">
              *Este comprobante es una representación digital del pago
              registrado en el sistema.
            </p>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalPago(null)}
                className="px-4 py-2 border rounded-lg border-[#15352b] text-sm hover:bg-[#eae4d7]"
              >
                Cerrar
              </button>

              <button className="px-4 py-2 rounded-lg bg-[#f1b814] hover:bg-[#e0a90f] text-sm font-semibold text-black">
                ⬇️ Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------
          MODAL — HISTORIAL COMPLETO DE PAGOS
      ------------------------------------------------ */}
      {mostrarHistorial && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg.white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-[#cfc7b4]">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-[#d9d2c3]">
              <h2 className="text-xl md:text-2xl font-semibold">
                Historial Completo de Pagos
              </h2>
              <button
                className="text-xl px-3 py-1 text-gray-600 hover:text-black"
                onClick={() => setMostrarHistorial(false)}
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Tarjetas resumen dentro del modal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#d3f7e8] px-6 py-4">
                  <p className="text-sm text-[#15352b] mb-1">Total Recibido</p>
                  <p className="text-4xl font-bold text-[#1b7c4b]">
                    ${totalRecibido.toLocaleString()}
                  </p>
                  <p className="text-xs mt-2 text-[#1b7c4b]">
                    {pagos.filter((p) => p.estado === "Pagado").length} pagos
                    realizados
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fff4d9] px-6 py-4">
                  <p className="text-sm text-[#15352b] mb-1">Total Pendiente</p>
                  <p className="text-4xl font-bold text-[#e4a526]">
                    ${totalPendiente.toLocaleString()}
                  </p>
                  <p className="text-xs mt-2 text-[#e4a526]">
                    {pagos.filter((p) => p.estado === "Pendiente").length} pagos
                    pendientes
                  </p>
                </div>

                <div className="rounded-2xl bg-[#ffd9dd] px-6 py-4">
                  <p className="text-sm text-[#15352b] mb-1">Total en Mora</p>
                  <p className="text-4xl font-bold text-[#d8454f]">
                    ${totalMora.toLocaleString()}
                  </p>
                  <p className="text-xs mt-2 text-[#d8454f]">
                    {pagos.filter((p) => p.estado === "En mora").length} pagos
                    en mora
                  </p>
                </div>
              </div>

              {/* Tabla detalle */}
              <section>
                <h3 className="text-base font-semibold mb-3">
                  Detalle de Todos los Pagos
                </h3>

                <div className="border border-[#15352b] rounded-2xl overflow-hidden">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-[#f7f3e8] text-left">
                      <tr>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Inquilino</th>
                        <th className="py-3 px-4">Propiedad</th>
                        <th className="py-3 px-4">Periodo</th>
                        <th className="py-3 px-4">Monto</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4">Tipo</th> {/* 👈 NUEVA COLUMNA */}
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((pago) => (
                        <tr
                          key={pago.id}
                          className="border-t border-[#ded7c7]"
                        >
                          <td className="py-3 px-4">{pago.id}</td>
                          <td className="py-3 px-4">María González</td>
                          <td className="py-3 px-4">San Isidro 1234</td>
                          <td className="py-3 px-4">{pago.mes}</td>
                          <td className="py-3 px-4">{pago.monto}</td>
                          <td className="py-3 px-4">
                            {pago.fechaPago !== "-"
                              ? pago.fechaPago
                              : pago.fechaLimite}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 text-sm rounded-full ${getEstadoBadge(
                                pago.estado
                              )}`}
                            >
                              {pago.estado}
                            </span>
                          </td>
                          <td className="py-3 px-4">{pago.tipo}</td> {/* 👈 NUEVO */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Total general */}
              <div className="border border-[#15352b] rounded-2xl px-6 py-4 mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Total General (Todos los Estados)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {pagos.length} pagos registrados
                  </p>
                </div>
                <p className="text-4xl font-bold text-[#15352b]">
                  ${totalGeneral.toLocaleString()}
                </p>
              </div>

              {/* Footer botones */}
              <div className="border-t border-[#d9d2c3] pt-4 mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setMostrarHistorial(false)}
                  className="px-5 py-2 rounded-lg border border-[#15352b] bg-white text-sm hover:bg-[#eae4d7]"
                >
                  Cerrar
                </button>
                <button className="px-5 py-2 rounded-lg bg-[#f1b814] hover.bg-[#e0a90f] text-sm font-semibold text.black flex items-center gap-2">
                  <span>⬇️</span>
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTES AUXILIARES ---------- */

function Card({ titulo, valor, color, bg }: any) {
  return (
    <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center text-xl mb-3"
        style={{ background: bg, color }}
      >
        💳
      </div>
      <p className="text-sm text-gray-700 mb-1">{titulo}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        ${valor.toLocaleString()}
      </p>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
