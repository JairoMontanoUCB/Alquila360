"use client";

import React, { useState, useEffect } from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador";
import { PagoBackend, pagoService } from "@/services/pagoService";

type PagoEstado = "Pagado" | "Pendiente";

type Pago = {
  inquilino: string;
  propiedad: string;
  monto: string;
  fecha: string;
  metodo: string;
  estado: PagoEstado;
  periodo?: string;
};

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // CONEXIÓN CON BACKEND
  useEffect(() => {
    const cargarPagosAdministrador = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener todos los pagos del backend
        const todosLosPagos = await pagoService.getAllPagos();
        
        // Transformar datos del backend al formato visual original
        const pagosTransformados: Pago[] = todosLosPagos.map((pago: PagoBackend, index) => {
          const fechaPago = new Date(pago.fecha_pago);
          
          // Determinar estado basado en la cuota
          let estado: PagoEstado = "Pendiente";
          if (pago.cuota?.estado === 'pagada') {
            estado = "Pagado";
          }

          return {
            inquilino: pago.inquilino?.nombre || `Inquilino ${index + 1}`,
            propiedad: pago.contrato?.propiedad?.direccion || `Propiedad ${index + 1}`,
            monto: `$${pago.monto?.toLocaleString() || "0"}`,
            fecha: fechaPago.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            metodo: pago.medio_pago.charAt(0).toUpperCase() + pago.medio_pago.slice(1),
            estado: estado,
            periodo: fechaPago.toLocaleDateString('es-ES', { 
              month: 'long', 
              year: 'numeric' 
            })
          };
        });

        setPagos(pagosTransformados);

      } catch (err) {
        console.error("Error cargando pagos:", err);
        setError("Error al cargar los pagos del sistema");
        setPagos([]); // Array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    cargarPagosAdministrador();
  }, []);

  // Calcular estadísticas basadas en datos reales
  const calcularEstadisticas = () => {
    const pagados = pagos.filter(pago => pago.estado === 'Pagado').length;
    const pendientes = pagos.filter(pago => pago.estado === 'Pendiente').length;
    
    const totalMes = pagos
      .filter(pago => pago.estado === 'Pagado')
      .reduce((sum, pago) => {
        const montoNumerico = parseFloat(pago.monto.replace('$', '').replace('.', '').replace(',', ''));
        return sum + (isNaN(montoNumerico) ? 0 : montoNumerico);
      }, 0);

    return {
      totalMes: `$${totalMes.toLocaleString()}`,
      completados: pagados,
      pendientes: pendientes
    };
  };

  const { totalMes, completados, pendientes } = calcularEstadisticas();

  // Calcular estadísticas para el modal
  const calcularEstadisticasModal = () => {
    const totalGeneral = pagos.reduce((sum, pago) => {
      const montoNumerico = parseFloat(pago.monto.replace('$', '').replace('.', '').replace(',', ''));
      return sum + (isNaN(montoNumerico) ? 0 : montoNumerico);
    }, 0);

    return {
      totalPagos: pagos.length,
      totalRecaudado: `$${totalGeneral.toLocaleString()}`,
      periodo: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
    };
  };

  const { totalPagos, totalRecaudado, periodo } = calcularEstadisticasModal();

  const getEstadoClasses = (estado: PagoEstado) => {
    if (estado === "Pagado") {
      return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    }
    return "bg-amber-100 text-amber-700 border border-amber-300";
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
        <SidebarAdministrador />
        <div className="flex-1 bg-[#f7f5ee] px-10 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b3b2c] mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando pagos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
        <SidebarAdministrador />
        <div className="flex-1 bg-[#f7f5ee] px-10 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0b3b2c] text-white rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Control de pagos de alquileres - {pagos.length} registros
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
          
          {pagos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron pagos registrados</p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL HISTORIAL COMPLETO - CON DATOS REALES */}
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
              Registro de todos los pagos realizados - {pagos.length} registros
            </p>

            {/* RESUMEN - CON DATOS REALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Total de Pagos</p>
                <p className="text-3xl font-bold mt-1">{totalPagos}</p>
              </div>

              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Total Recaudado</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {totalRecaudado}
                </p>
              </div>

              <div className="bg-[#f7f5ee] p-4 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-500">Periodo</p>
                <p className="text-2xl font-semibold mt-1">
                  {periodo}
                </p>
              </div>
            </div>

            {/* TABLA MODAL - CON DATOS REALES */}
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
                  {pagos.map((pago, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{pago.inquilino}</td>
                      <td className="p-3">{pago.propiedad}</td>
                      <td className="p-3">{pago.monto}</td>
                      <td className="p-3">{pago.fecha}</td>
                      <td className="p-3">{pago.metodo}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoClasses(pago.estado)}`}>
                          {pago.estado}
                        </span>
                      </td>
                      <td className="p-3">{pago.periodo || "Sin periodo"}</td>
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