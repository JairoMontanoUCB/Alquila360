"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PagoBackend, pagoService } from "@/services/pagoService";

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
  const [pagosRecibidos, setPagosRecibidos] = useState(0);
  const [pagosPendientes, setPagosPendientes] = useState(0);
  const [enMora, setEnMora] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showHistorial, setShowHistorial] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

  // CONEXIÓN CON BACKEND PARA INQUILINO
  useEffect(() => {
    const cargarPagosInquilino = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = localStorage.getItem('user');
      if (!userData) {
        setError("Usuario no autenticado");
        return;
      }
      
      const user = JSON.parse(userData);
      const inquilinoId = user.id;
      
      console.log("Cargando pagos para inquilino ID:", inquilinoId);
      
        
        // Obtener todos los pagos del backend
        const todosLosPagos = await pagoService.getAllPagos();
        
        // Filtrar pagos del inquilino actual
        const pagosInquilino = todosLosPagos.filter(pago => 
        pago.inquilino?.id === inquilinoId
        );
        console.log("Pagos del inquilino:", pagosInquilino);
        
        // Transformar datos del backend al formato del frontend
        const pagosTransformados: Pago[] = pagosInquilino.map((pago: PagoBackend) => {
          const fechaPago = new Date(pago.fecha_pago);
          
          // Calcular fecha límite basada en la fecha de pago + 30 días
          const fechaVencimiento = new Date(fechaPago);
          fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
          
          // Determinar estado basado en la cuota y fechas
          let estado: "Pagado" | "Pendiente" | "En Mora";
          if (pago.cuota?.estado === 'pagada') {
            estado = "Pagado";
          } else if (fechaVencimiento < new Date()) {
            estado = "En Mora";
          } else {
            estado = "Pendiente";
          }

          return {
            id: pago.id.toString(),
            mes: fechaPago.toLocaleDateString('es-ES', { 
              month: 'long', 
              year: 'numeric' 
            }),
            monto: pago.monto,
            fechaLimite: fechaVencimiento.toISOString().split('T')[0],
            fechaPago: pago.cuota?.estado === 'pagada' ? fechaPago.toISOString().split('T')[0] : null,
            estado: estado
          };
        });

        setPagos(pagosTransformados);

        // Calcular estadísticas con datos reales del backend
        const totalPagado = pagosTransformados
          .filter(p => p.estado === "Pagado")
          .reduce((sum, p) => sum + p.monto, 0);
        
        const totalPendiente = pagosTransformados
          .filter(p => p.estado === "Pendiente")
          .reduce((sum, p) => sum + p.monto, 0);
        
        const totalMora = pagosTransformados
          .filter(p => p.estado === "En Mora")
          .reduce((sum, p) => sum + p.monto, 0);

        setPagosRecibidos(totalPagado);
        setPagosPendientes(totalPendiente);
        setEnMora(totalMora);

      } catch (err) {
        console.error("Error cargando pagos:", err);
        setError("Error al cargar los pagos del sistema");
        setPagos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPagosInquilino();
  }, []);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ee] flex">
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b3b2c] text-white flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-wide">ALQUILA 360</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/inquilino"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              href="/inquilino/contratos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>📄</span>
              <span>Contrato</span>
            </Link>
            <Link
              href="/inquilino/pagos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#4b7f5e]"
            >
              <span>💳</span>
              <span>Pagos</span>
            </Link>
            <Link
              href="/inquilino/ticket"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>🔧</span>
              <span>Tickets</span>
            </Link>
            <Link
              href="/inquilino/expensas"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>📊</span>
              <span>Expensas</span>
            </Link>
            <Link
              href="/inquilino/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>👤</span>
              <span>Perfil</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-white/10">
            <p className="text-sm text-slate-200 mb-2">Inquilino</p>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#164332] text-sm">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b3b2c] mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando pagos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ee] flex">
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b3b2c] text-white flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-wide">ALQUILA 360</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/inquilino"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              href="/inquilino/contratos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>📄</span>
              <span>Contrato</span>
            </Link>
            <Link
              href="/inquilino/pagos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#4b7f5e]"
            >
              <span>💳</span>
              <span>Pagos</span>
            </Link>
            <Link
              href="/inquilino/ticket"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>🔧</span>
              <span>Tickets</span>
            </Link>
            <Link
              href="/inquilino/expensas"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>📊</span>
              <span>Expensas</span>
            </Link>
            <Link
              href="/inquilino/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
            >
              <span>👤</span>
              <span>Perfil</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-white/10">
            <p className="text-sm text-slate-200 mb-2">Inquilino</p>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#164332] text-sm">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0b3b2c] text-white rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagado":
        return "bg-emerald-100 text-emerald-700";
      case "Pendiente":
        return "bg-amber-100 text-amber-700";
      case "En Mora":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const abrirPago = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setShowPagoModal(true);
  };

  const cerrarPago = () => {
    setPagoSeleccionado(null);
    setShowPagoModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b3b2c] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wide">ALQUILA 360</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/inquilino"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link
            href="/inquilino/contratos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
          >
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link
            href="/inquilino/pagos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#4b7f5e]"
          >
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link
            href="/inquilino/ticket"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
          >
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link
            href="/inquilino/expensas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
          >
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link
            href="/inquilino/perfil"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332]"
          >
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-sm text-slate-200 mb-2">Inquilino</p>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[#164332] text-sm">
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#123528]">Mis Pagos</h2>
            <p className="text-slate-600">Historial de cuotas y alquileres - {pagos.length} registros</p>
          </div>
          <button
            onClick={() => setShowHistorial(true)}
            className="px-6 py-2 bg-[#f7a81b] text-[#123528] rounded-lg hover:bg-[#ec9a03] transition font-semibold flex items-center gap-2 text-sm border border-[#d89313]"
          >
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Pagos</p>
                <h3 className="text-sm font-semibold text-[#123528]">
                  Realizados
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                ✅
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600">
              ${pagosRecibidos}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Pagos</p>
                <h3 className="text-sm font-semibold text-[#123528]">
                  Pendientes
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                📅
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-500">
              ${pagosPendientes}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">En Mora</p>
                <h3 className="text-sm font-semibold text-[#123528]">Total</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-xl">
                💳
              </div>
            </div>
            <p className="text-3xl font-extrabold text-rose-500">${enMora}</p>
          </div>
        </div>

        {/* Tabla de Pagos */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-[#123528]">
              Todas las Cuotas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Mes/Periodo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Fecha Límite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Fecha de Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {pagos.map((pago) => {
                  const puedePagar = pago.estado !== "Pagado";
                  return (
                    <tr key={pago.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {pago.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {pago.mes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {pago.fechaLimite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        ${pago.monto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                            pago.estado
                          )}`}
                        >
                          {pago.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {pago.fechaPago || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {puedePagar ? (
                          <button
                            onClick={() => abrirPago(pago)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f7a81b] hover:bg-[#ec9a03] text-[#123528] text-xs font-semibold border border-[#d89313]"
                          >
                            <span>💳</span>
                            <span>Realizar Pago</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            - Pagado -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {pagos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">No se encontraron pagos registrados</p>
              </div>
            )}
          </div>
        </section>

        {/* MODAL HISTORIAL COMPLETO */}
        {showHistorial && (
          <HistorialPagosModal
            pagos={pagos}
            onClose={() => setShowHistorial(false)}
          />
        )}

        {/* MODAL REALIZAR PAGO */}
        {showPagoModal && pagoSeleccionado && (
          <RealizarPagoModal pago={pagoSeleccionado} onClose={cerrarPago} />
        )}
      </main>
    </div>
  );
}

/* ------------ MODAL: HISTORIAL COMPLETO ------------ */

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

  const countPagado = pagos.filter((p) => p.estado === "Pagado").length;
  const countPendiente = pagos.filter((p) => p.estado === "Pendiente").length;
  const countMora = pagos.filter((p) => p.estado === "En Mora").length;

  const totalGeneral = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold text-[#123528]">
            Historial Completo de Pagos
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Cards de totales */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-100 rounded-xl px-6 py-4">
              <p className="text-sm font-semibold text-emerald-900 mb-1">
                Total Pagado
              </p>
              <p className="text-3xl font-bold text-emerald-700">
                ${totalPagado}
              </p>
              <p className="text-xs text-emerald-900 mt-2">
                {countPagado} pago(s) realizados
              </p>
            </div>

            <div className="bg-amber-100 rounded-xl px-6 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Total Pendiente
              </p>
              <p className="text-3xl font-bold text-amber-700">
                ${totalPendiente}
              </p>
              <p className="text-xs text-amber-900 mt-2">
                {countPendiente} pago(s) pendientes
              </p>
            </div>

            <div className="bg-rose-100 rounded-xl px-6 py-4">
              <p className="text-sm font-semibold text-rose-900 mb-1">
                Total en Mora
              </p>
              <p className="text-3xl font-bold text-rose-700">
                ${totalMora}
              </p>
              <p className="text-xs text-rose-900 mt-2">
                {countMora} pago(s) en mora
              </p>
            </div>
          </section>

          {/* Título detalle */}
          <p className="text-sm font-semibold text-[#123528] mt-2">
            Detalle de Todos los Pagos
          </p>

          {/* Tabla detalle */}
          <section className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      Fecha Límite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      Fecha de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr
                      key={pago.id}
                      className="border-b border-slate-200 last:border-b-0"
                    >
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {pago.id}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {pago.mes}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        ${pago.monto}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {pago.fechaLimite}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {pago.fechaPago || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            pago.estado === "Pagado"
                              ? "bg-emerald-100 text-emerald-700"
                              : pago.estado === "Pendiente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {pagos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500">No hay pagos para mostrar</p>
                </div>
              )}
            </div>
          </section>

          {/* Total general */}
          <section className="border border-slate-300 rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">
                Total General
              </p>
              <p className="text-xs text-slate-600">
                {pagos.length} pagos registrados
              </p>
            </div>
            <p className="text-3xl font-bold text-[#123528]">${totalGeneral}</p>
          </section>

          {/* Footer botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={() => console.log("Descargar PDF")}
              className="px-6 py-2 rounded-lg bg-[#f7a81b] hover:bg-[#ec9a03] text-white text-sm font-semibold flex items-center gap-2"
            >
              <span>⬇️</span>
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------ MODAL: REALIZAR PAGO ------------ */

function RealizarPagoModal({ pago, onClose }: { pago: Pago; onClose: () => void }) {
  const [referencia, setReferencia] = useState("");

  const handleConfirm = () => {
    console.log("Confirmar pago", pago.id, referencia);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-400 bg-amber-50 flex items-center justify-center text-lg">
              💳
            </div>
            <h2 className="text-xl font-semibold text-[#123528]">
              Realizar Pago
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Detalles del pago */}
          <section className="bg-[#fbf8f0] border border-slate-200 rounded-2xl px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-[#123528]">
              <p className="text-base font-semibold mb-1">Detalles del Pago</p>
              <div>
                <p className="font-medium">ID de Pago</p>
                <p className="text-slate-700">{pago.id}</p>
              </div>
              <div>
                <p className="font-medium">Fecha Límite</p>
                <p className="text-slate-700">{pago.fechaLimite}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#123528] md:text-right">
              <div>
                <p className="font-medium">Periodo</p>
                <p className="text-slate-700">{pago.mes}</p>
              </div>
              <div>
                <p className="font-medium">Monto a Pagar</p>
                <p className="text-3xl font-extrabold text-amber-500">
                  ${pago.monto}
                </p>
              </div>
            </div>
          </section>

          {/* Método de pago */}
          <section className="space-y-2">
            <p className="text-sm font-semibold text-[#123528]">
              Método de Pago *
            </p>
            <div className="border border-slate-200 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 flex items-center justify-between">
              <span>Transferencia Bancaria</span>
              <span>▾</span>
            </div>
          </section>

          {/* Datos bancarios + referencia + confirmación */}
          <section className="border border-[#1a5f4a] rounded-2xl px-6 py-5 space-y-5">
            {/* Datos bancarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#123528]">
              <div>
                <p className="text-base font-semibold mb-3">
                  Datos Bancarios del Propietario
                </p>
                <p className="font-medium mb-1">Banco:</p>
                <p className="text-slate-700">Banco Nación</p>
                <p className="font-medium mt-3 mb-1">CBU:</p>
                <p className="text-slate-700">0110599520000001234567</p>
              </div>
              <div className="md:text-right">
                <p className="font-medium mb-1">Alias:</p>
                <p className="text-slate-700">ALQUILA.PAGO.360</p>
                <p className="font-medium mt-3 mb-1">Titular:</p>
                <p className="text-slate-700">Juan Carlos Martínez</p>
              </div>
            </div>

            {/* Número de referencia */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#123528]">
                Número de Referencia *
              </p>
              <input
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full border border-slate-200 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ingresa el número de comprobante de la transferencia"
              />
            </div>

            {/* Confirmar pago */}
            <div className="border border-emerald-500 rounded-2xl bg-emerald-50/60 px-5 py-4 flex flex-col gap-2 text-sm text-[#123528]">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-6 h-6 rounded-full border border-emerald-500 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>Confirmar Pago</span>
              </div>
              <p className="text-xs md:text-sm text-slate-700">
                Al confirmar, aceptas que has realizado o realizarás el pago de{" "}
                <span className="font-semibold">
                  ${pago.monto}
                </span>{" "}
                correspondiente al periodo{" "}
                <span className="font-semibold">{pago.mes}</span> mediante el
                método seleccionado.
              </p>
            </div>
          </section>

          {/* Nota */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 text-xs md:text-sm text-slate-700">
            <span className="font-semibold">Nota:</span> Una vez confirmado el
            pago, el estado de la cuota cambiará y el propietario podrá
            verificar la información del comprobante.
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg bg-[#1a5f4a] hover:bg-[#164332] text-white text-sm font-semibold flex items-center gap-2"
            >
              <span>✓</span>
              <span>Confirmar Pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}