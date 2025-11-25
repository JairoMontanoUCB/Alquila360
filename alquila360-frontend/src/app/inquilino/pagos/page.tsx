"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                   TIPOS                                    */
/* -------------------------------------------------------------------------- */

type EstadoPago = "Pagado" | "Pendiente" | "En Mora";

type Pago = {
  id: string;
  periodo: string;
  fechaLimite: string;
  monto: number;
  estado: EstadoPago;
  fechaPago: string | null;
};

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
    <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4 min-h-screen">
      <div
        className="text-2xl font-extrabold tracking-wide mb-8 px-2 cursor-pointer"
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
/*                             DATOS MOCK DE PAGOS                            */
/* -------------------------------------------------------------------------- */

const pagosMock: Pago[] = [
  {
    id: "pay1",
    periodo: "Octubre 2024",
    fechaLimite: "2024-10-10",
    monto: 2500,
    estado: "Pagado",
    fechaPago: "2024-10-01",
  },
  {
    id: "pay2",
    periodo: "Noviembre 2024",
    fechaLimite: "2024-11-10",
    monto: 2500,
    estado: "En Mora",
    fechaPago: null,
  },
  {
    id: "pay3",
    periodo: "Diciembre 2024",
    fechaLimite: "2024-12-10",
    monto: 2500,
    estado: "Pendiente",
    fechaPago: null,
  },
];

/* -------------------------------------------------------------------------- */
/*                             PAGINA: PAGOS                                  */
/* -------------------------------------------------------------------------- */

export default function PagosInquilinoPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

  useEffect(() => {
    // aqui conectarias con tu backend, por ahora mock
    setPagos(pagosMock);
  }, []);

  const totalPagado = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((s, p) => s + p.monto, 0);
  const totalPendiente = pagos
    .filter((p) => p.estado === "Pendiente")
    .reduce((s, p) => s + p.monto, 0);
  const totalMora = pagos
    .filter((p) => p.estado === "En Mora")
    .reduce((s, p) => s + p.monto, 0);

  const abrirPago = (pago: Pago) => {
    setPagoSeleccionado(pago);
  };

  const cerrarPago = () => {
    setPagoSeleccionado(null);
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
            onClick={() => setShowHistorial(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-xs font-semibold text-white shadow-sm"
          >
            <span>⬇️</span>
            <span>Descargar historial</span>
          </button>
        </header>

        {/* Tarjetas resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <PagoResumenCard
            titulo="Pagos realizados"
            monto={`$${totalPagado.toLocaleString()}`}
            colorValor="text-emerald-600"
            bg="bg-emerald-50"
          />
          <PagoResumenCard
            titulo="Pagos pendientes"
            monto={`$${totalPendiente.toLocaleString()}`}
            colorValor="text-amber-600"
            bg="bg-amber-50"
          />
          <PagoResumenCard
            titulo="En mora"
            monto={`$${totalMora.toLocaleString()}`}
            colorValor="text-rose-600"
            bg="bg-rose-50"
          />
        </section>

        {/* Tabla de pagos */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#123528]">
              Todas las cuotas
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Mes/Periodo</th>
                  <th className="p-3 text-left">Fecha limite</th>
                  <th className="p-3 text-left">Monto</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Fecha de pago</th>
                  <th className="p-3 text-left">Accion</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {pagos.map((pago) => {
                  const puedePagar = pago.estado !== "Pagado";
                  return (
                    <tr key={pago.id} className="hover:bg-slate-50">
                      <td className="p-3 text-xs md:text-sm">{pago.id}</td>
                      <td className="p-3 text-xs md:text-sm">
                        {pago.periodo}
                      </td>
                      <td className="p-3 text-xs md:text-sm">
                        {pago.fechaLimite}
                      </td>
                      <td className="p-3 text-xs md:text-sm">
                        ${pago.monto.toLocaleString()}
                      </td>
                      <td className="p-3 text-xs md:text-sm">
                        <EstadoPagoBadge estado={pago.estado} />
                      </td>
                      <td className="p-3 text-xs md:text-sm">
                        {pago.fechaPago || "-"}
                      </td>
                      <td className="p-3 text-xs md:text-sm">
                        {puedePagar ? (
                          <button
                            onClick={() => abrirPago(pago)}
                            className="px-3 py-1 rounded-lg text-xs bg-amber-400 hover:bg-amber-500 text-white font-semibold"
                          >
                            Realizar pago
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Sin accion
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODAL HISTORIAL */}
        {showHistorial && (
          <HistorialPagosModal pagos={pagos} onClose={() => setShowHistorial(false)} />
        )}

        {/* MODAL REALIZAR PAGO */}
        {pagoSeleccionado && (
          <RealizarPagoModal pago={pagoSeleccionado} onClose={cerrarPago} />
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                      MODAL: HISTORIAL COMPLETO                             */
/* -------------------------------------------------------------------------- */

function HistorialPagosModal({
  pagos,
  onClose,
}: {
  pagos: Pago[];
  onClose: () => void;
}) {
  const totalPagado = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = pagos
    .filter((p) => p.estado === "Pendiente")
    .reduce((sum, p) => sum + p.monto, 0);
  const totalMora = pagos
    .filter((p) => p.estado === "En Mora")
    .reduce((sum, p) => sum + p.monto, 0);
  const totalGeneral = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold text-[#123528]">
            Historial completo de pagos
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 text-sm">
          {/* Cards totales */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <HistCard
              titulo="Total pagado"
              monto={`$${totalPagado.toLocaleString()}`}
              detalle="Pagos realizados"
              bg="bg-emerald-50"
              color="text-emerald-600"
            />
            <HistCard
              titulo="Total pendiente"
              monto={`$${totalPendiente.toLocaleString()}`}
              detalle="Pagos pendientes"
              bg="bg-amber-50"
              color="text-amber-600"
            />
            <HistCard
              titulo="Total en mora"
              monto={`$${totalMora.toLocaleString()}`}
              detalle="Pagos en mora"
              bg="bg-rose-50"
              color="text-rose-600"
            />
          </section>

          {/* Tabla detalle */}
          <section>
            <p className="text-xs text-slate-500 mb-2">
              Detalle de todos los pagos
            </p>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Periodo</th>
                    <th className="p-3 text-left">Monto</th>
                    <th className="p-3 text-left">Fecha limite</th>
                    <th className="p-3 text-left">Fecha de pago</th>
                    <th className="p-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-t border-slate-100">
                      <td className="p-3">{pago.id}</td>
                      <td className="p-3">{pago.periodo}</td>
                      <td className="p-3">${pago.monto.toLocaleString()}</td>
                      <td className="p-3">{pago.fechaLimite}</td>
                      <td className="p-3">{pago.fechaPago || "-"}</td>
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
          <section className="border border-slate-200 rounded-lg bg-white px-4 py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#123528]">Total general</p>
              <p className="text-xs text-slate-500">
                {pagos.length} pagos registrados
              </p>
            </div>
            <p className="text-lg font-bold text-[#123528]">
              ${totalGeneral.toLocaleString()}
            </p>
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                      MODAL: REALIZAR PAGO                                  */
/* -------------------------------------------------------------------------- */

function RealizarPagoModal({
  pago,
  onClose,
}: {
  pago: Pago;
  onClose: () => void;
}) {
  const [referencia, setReferencia] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const confirmar = () => {
    if (!referencia.trim()) {
      alert("Ingresa el numero de referencia para confirmar el pago.");
      return;
    }
    console.log("Pago confirmado", pago.id, referencia);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span>💳</span>
            <h2 className="text-sm md:text-base font-semibold text-[#123528]">
              Realizar pago
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Paso 1: detalle y datos bancarios */}
        {step === 1 && (
          <>
            <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
              <section className="border border-slate-200 rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500 mb-2">Detalles del pago</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-500">ID de pago</p>
                    <p className="font-semibold text-[#123528]">{pago.id}</p>
                    <p className="text-[11px] text-slate-500 mt-3">
                      Fecha limite
                    </p>
                    <p className="font-semibold text-[#123528]">
                      {pago.fechaLimite}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Periodo</p>
                    <p className="font-semibold text-[#123528]">
                      {pago.periodo}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-3">
                      Monto a pagar
                    </p>
                    <p className="text-2xl font-bold text-amber-500">
                      ${pago.monto.toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                <p className="text-xs text-slate-500 mb-2">Metodo de pago *</p>
                <div className="border border-slate-300 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                  <span>Transferencia bancaria</span>
                  <span>▾</span>
                </div>
              </section>

              <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                <p className="text-xs text-slate-500 mb-2">
                  Datos bancarios del propietario
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

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white/80 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Paso 2: referencia y confirmacion */}
        {step === 2 && (
          <>
            <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
              <section className="border border-slate-200 rounded-lg bg-white px-4 py-3">
                <p className="text-xs text-slate-500 mb-2">
                  Numero de referencia *
                </p>
                <input
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="Ingresa el numero de comprobante de la transferencia"
                />
              </section>

              <section className="border border-emerald-300 bg-emerald-50 rounded-lg px-4 py-3 flex gap-3">
                <div className="mt-1">✅</div>
                <div>
                  <p className="font-semibold text-[#123528] mb-1">
                    Confirmar pago
                  </p>
                  <p className="text-slate-600">
                    Al confirmar, aceptas que has realizado o realizaras el pago
                    de{" "}
                    <span className="font-semibold">
                      ${pago.monto.toLocaleString()}
                    </span>{" "}
                    correspondiente al periodo{" "}
                    <span className="font-semibold">{pago.periodo}</span>.
                  </p>
                </div>
              </section>

              <section className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-slate-700">
                Nota: el propietario podra verificar el comprobante asociado al
                numero de referencia ingresado.
              </section>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white/80 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs border border-slate-300 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                className="px-4 py-2 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirmar pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           SUBCOMPONENTES                                   */
/* -------------------------------------------------------------------------- */

type ResumenProps = {
  titulo: string;
  monto: string;
  colorValor: string;
  bg: string;
};

function PagoResumenCard({ titulo, monto, colorValor, bg }: ResumenProps) {
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
  let classes = "bg-slate-50 text-slate-600 border-slate-200";

  if (estado === "Pagado") {
    classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (estado === "Pendiente") {
    classes = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (estado === "En Mora") {
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
