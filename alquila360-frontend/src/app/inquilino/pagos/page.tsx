"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contrato", path: "/inquilino/contrato" },
  { label: "Pagos", path: "/inquilino/pagos" },
  { label: "Tickets", path: "/inquilino/tickets" },
  { label: "Expensas", path: "/inquilino/expensas" },
  { label: "Perfil", path: "/inquilino/perfil" },
];

function SidebarInquilino() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
      <div
        className="text-2xl font-extrabold tracking-wide mb-10 px-2 cursor-pointer"
        onClick={() => router.push("/inquilino")}
      >
        ALQUILA 360
      </div>

      <nav className="flex-1 space-y-1">
        {inquilinoMenu.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                active ? "bg-[#4b7f5e] font-semibold" : "hover:bg-[#164332]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 px-2 text-xs text-slate-300">Inquilino</div>
      <button className="mt-2 px-3 py-2 text-xs text-slate-200 hover:bg-[#164332] rounded-lg text-left">
        Cerrar sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DATOS DE PAGOS                                */
/* -------------------------------------------------------------------------- */

type EstadoPago = "Pagado" | "Pendiente" | "En mora";

type Pago = {
  id: string;
  periodo: string;
  fechaLimite: string;
  monto: string;
  estado: EstadoPago;
  fechaPago: string;
};

const pagosMock: Pago[] = [
  {
    id: "pay1",
    periodo: "Noviembre 2024",
    fechaLimite: "2024-11-10",
    monto: "$2.500",
    estado: "Pagado",
    fechaPago: "2024-11-01",
  },
  {
    id: "pay2",
    periodo: "Diciembre 2024",
    fechaLimite: "2024-12-10",
    monto: "$2.500",
    estado: "Pendiente",
    fechaPago: "-",
  },
  {
    id: "pay3",
    periodo: "Octubre 2024",
    fechaLimite: "2024-10-10",
    monto: "$2.500",
    estado: "En mora",
    fechaPago: "-",
  },
];

const totalPagado = "$2.500";
const totalPendiente = "$2.500";
const totalMora = "$2.500";
const totalGeneral = "$7.500";

/* -------------------------------------------------------------------------- */
/*                              PAGINA DE PAGOS                               */
/* -------------------------------------------------------------------------- */

export default function PagosInquilinoPage() {
  const [openHistorial, setOpenHistorial] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);
  const [stepPago, setStepPago] = useState<1 | 2>(1);
  const [referencia, setReferencia] = useState("");

  const abrirPago = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setStepPago(1);
    setReferencia("");
  };

  const cerrarPago = () => {
    setPagoSeleccionado(null);
    setStepPago(1);
    setReferencia("");
  };

  const confirmarPago = () => {
    if (!referencia.trim()) {
      alert("Ingresa el numero de referencia para confirmar el pago.");
      return;
    }
    // Aquí podrias actualizar el estado real del pago si quisieras.
    alert("Pago confirmado (maqueta).");
    cerrarPago();
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Mis Pagos
            </h1>
            <p className="text-sm text-slate-500">
              Historial de cuotas y alquileres
            </p>
          </div>

          <button
            onClick={() => setOpenHistorial(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-xs font-semibold text-white shadow-sm"
          >
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* Tarjetas resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <PagoResumenCard
            titulo="Pagos Realizados"
            monto={totalPagado}
            colorValor="text-emerald-600"
            bg="bg-emerald-50"
          />
          <PagoResumenCard
            titulo="Pagos Pendientes"
            monto={totalPendiente}
            colorValor="text-amber-600"
            bg="bg-amber-50"
          />
          <PagoResumenCard
            titulo="En Mora"
            monto={totalMora}
            colorValor="text-rose-600"
            bg="bg-rose-50"
          />
        </section>

        {/* Tabla de pagos */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#123528]">
              Todas las Cuotas
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Mes/Periodo</th>
                <th className="p-3 text-left">Fecha Limite</th>
                <th className="p-3 text-left">Monto</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Fecha de Pago</th>
                <th className="p-3 text-left">Accion</th>
              </tr>
            </thead>
            <tbody>
              {pagosMock.map((pago) => (
                <tr key={pago.id} className="border-t border-slate-100">
                  <td className="p-3 text-xs md:text-sm">{pago.id}</td>
                  <td className="p-3 text-xs md:text-sm">{pago.periodo}</td>
                  <td className="p-3 text-xs md:text-sm">{pago.fechaLimite}</td>
                  <td className="p-3 text-xs md:text-sm">{pago.monto}</td>
                  <td className="p-3 text-xs md:text-sm">
                    <EstadoPagoBadge estado={pago.estado} />
                  </td>
                  <td className="p-3 text-xs md:text-sm">{pago.fechaPago}</td>
                  <td className="p-3 text-xs md:text-sm">
                    {pago.estado === "Pagado" ? (
                      <span className="text-[11px] text-slate-400">
                        Sin accion
                      </span>
                    ) : (
                      <button
                        onClick={() => abrirPago(pago)}
                        className="px-3 py-1 rounded-lg text-xs bg-amber-400 hover:bg-amber-500 text-white font-semibold"
                      >
                        Realizar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/*                         MODAL HISTORIAL COMPLETO                      */}
      {/* ---------------------------------------------------------------------- */}
      {openHistorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#f7f5ee] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-emerald-900/20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/20">
              <h2 className="text-sm md:text-base font-semibold text-[#123528]">
                Historial Completo de Pagos
              </h2>
              <button
                onClick={() => setOpenHistorial(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 text-sm">
              {/* Totales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <HistCard
                  titulo="Total Pagado"
                  monto={totalPagado}
                  detalle="1 pago realizados"
                  bg="bg-emerald-50"
                  color="text-emerald-600"
                />
                <HistCard
                  titulo="Total Pendiente"
                  monto={totalPendiente}
                  detalle="1 pago pendiente"
                  bg="bg-amber-50"
                  color="text-amber-600"
                />
                <HistCard
                  titulo="Total en Mora"
                  monto={totalMora}
                  detalle="1 pago en mora"
                  bg="bg-rose-50"
                  color="text-rose-600"
                />
              </div>

              {/* Detalle tabla */}
              <section>
                <p className="text-xs text-slate-500 mb-2">
                  Detalle de Todos los Pagos
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Periodo</th>
                        <th className="p-3 text-left">Monto</th>
                        <th className="p-3 text-left">Fecha Limite</th>
                        <th className="p-3 text-left">Fecha de Pago</th>
                        <th className="p-3 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosMock.map((pago) => (
                        <tr key={pago.id} className="border-t border-slate-100">
                          <td className="p-3">{pago.id}</td>
                          <td className="p-3">{pago.periodo}</td>
                          <td className="p-3">{pago.monto}</td>
                          <td className="p-3">{pago.fechaLimite}</td>
                          <td className="p-3">{pago.fechaPago}</td>
                          <td className="p-3">
                            <EstadoPagoBadge estado={pago.estado} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Total general */}
              <section className="border border-slate-200 rounded-lg bg-white px-4 py-3 text-xs md:text-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[#123528]">Total General</p>
                  <p className="text-slate-500">
                    3 pagos registrados
                  </p>
                </div>
                <p className="text-lg font-bold text-[#123528]">
                  {totalGeneral}
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-emerald-900/10 bg-white/70 rounded-b-xl">
              <button
                onClick={() => setOpenHistorial(false)}
                className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 rounded-lg text-xs bg-amber-400 text-white hover:bg-amber-500">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/*                           MODAL REALIZAR PAGO                          */}
      {/* ---------------------------------------------------------------------- */}
      {pagoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#f7f5ee] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-emerald-900/20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/20">
              <div className="flex items-center gap-2">
                <span>💳</span>
                <h2 className="text-sm md:text-base font-semibold text-[#123528]">
                  Realizar Pago
                </h2>
              </div>
              <button
                onClick={cerrarPago}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {stepPago === 1 && (
              <>
                <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
                  {/* Detalles del pago */}
                  <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Detalles del Pago
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-slate-500">ID de Pago</p>
                        <p className="font-semibold text-[#123528]">
                          {pagoSeleccionado.id}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-3">
                          Fecha Limite
                        </p>
                        <p className="font-semibold text-[#123528]">
                          {pagoSeleccionado.fechaLimite}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Periodo</p>
                        <p className="font-semibold text-[#123528]">
                          {pagoSeleccionado.periodo}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-3">
                          Monto a Pagar
                        </p>
                        <p className="text-2xl font-bold text-amber-500">
                          {pagoSeleccionado.monto}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Metodo de pago */}
                  <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Metodo de Pago *
                    </p>
                    <div className="border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                      <span>Transferencia Bancaria</span>
                      <span>▾</span>
                    </div>
                  </section>

                  {/* Datos bancarios */}
                  <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Datos Bancarios del Propietario
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[11px] text-slate-500">Banco:</p>
                        <p className="font-semibold text-[#123528]">
                          Banco Nacion
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2">CBU:</p>
                        <p>0110599520000001234567</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Alias:</p>
                        <p>ALQUILA.PAGO.360</p>
                        <p className="text-[11px] text-slate-500 mt-2">
                          Titular:
                        </p>
                        <p>Juan Carlos Martinez</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Footer step 1 */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-emerald-900/10 bg-white/70 rounded-b-xl">
                  <button
                    onClick={cerrarPago}
                    className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setStepPago(2)}
                    className="px-4 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {stepPago === 2 && (
              <>
                <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
                  {/* Datos bancarios (resumen) */}
                  <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Datos Bancarios del Propietario
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[11px] text-slate-500">Banco:</p>
                        <p className="font-semibold text-[#123528]">
                          Banco Nacion
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2">CBU:</p>
                        <p>0110599520000001234567</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Alias:</p>
                        <p>ALQUILA.PAGO.360</p>
                        <p className="text-[11px] text-slate-500 mt-2">
                          Titular:
                        </p>
                        <p>Juan Carlos Martinez</p>
                      </div>
                    </div>
                  </section>

                  {/* Numero de referencia */}
                  <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Numero de Referencia *
                    </p>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                      placeholder="Ingresa el numero de comprobante de la transferencia"
                    />
                  </section>

                  {/* Confirmacion */}
                  <section className="border border-emerald-300 bg-emerald-50 rounded-lg px-4 py-3 text-xs md:text-sm flex gap-3">
                    <div className="mt-1">✅</div>
                    <div>
                      <p className="font-semibold text-[#123528] mb-1">
                        Confirmar Pago
                      </p>
                      <p className="text-slate-600">
                        Al confirmar, aceptas que has realizado o realizaras el
                        pago de <span className="font-semibold">{pagoSeleccionado.monto}</span>{" "}
                        correspondiente al periodo{" "}
                        <span className="font-semibold">
                          {pagoSeleccionado.periodo}
                        </span>{" "}
                        mediante el metodo seleccionado.
                      </p>
                    </div>
                  </section>
                </div>

                {/* Footer step 2 */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-emerald-900/10 bg-white/70 rounded-b-xl">
                  <button
                    onClick={cerrarPago}
                    className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarPago}
                    className="px-4 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Confirmar Pago
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           SUBCOMPONENTES AUXILIARES                         */
/* -------------------------------------------------------------------------- */

type ResumenProps = {
  titulo: string;
  monto: string;
  colorValor: string;
  bg: string;
};

function PagoResumenCard({
  titulo,
  monto,
  colorValor,
  bg,
}: ResumenProps) {
  return (
    <div className={`rounded-xl border border-slate-200 ${bg} p-4 shadow-sm`}>
      <p className="text-xs text-slate-500">{titulo}</p>
      <p className={`text-2xl font-bold mt-2 ${colorValor}`}>{monto}</p>
    </div>
  );
}

type HistCardProps = {
  titulo: string;
  monto: string;
  detalle: string;
  bg: string;
  color: string;
};

function HistCard({ titulo, monto, detalle, bg, color }: HistCardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 ${bg} p-4`}>
      <p className="text-xs text-slate-500 mb-1">{titulo}</p>
      <p className={`text-xl font-bold ${color}`}>{monto}</p>
      <p className="text-[11px] text-slate-500 mt-1">{detalle}</p>
    </div>
  );
}

function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  let classes =
    "bg-slate-50 text-slate-600 border-slate-200";

  if (estado === "Pagado") {
    classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (estado === "Pendiente") {
    classes = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (estado === "En mora") {
    classes = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold border ${classes}`}
    >
      {estado}
    </span>
  );
}
