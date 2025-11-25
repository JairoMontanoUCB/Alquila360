"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/sideBarPropietario";
import Link from "next/link";
import { PagoBackend, pagoService } from "@/services/pagoService";

export default function PagosPage() {
  const [pagos, setPagos] = useState<PagoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propietarioId, setPropietarioId] = useState<number | null>(null);

  // Obtener el usuario del localStorage al cargar el componente
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setPropietarioId(user.id); // Aquí obtienes el ID del propietario
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Error al cargar información del usuario");
      }
    } else {
      setError("Usuario no autenticado");
    }
  }, []);

  useEffect(() => {
    const cargarPagos = async () => {
      // Esperar hasta que tengamos el propietarioId
      if (!propietarioId) return;

      try {
        setLoading(true);
        // ✅ Usar el endpoint específico para propietario con el ID real
        const pagosData = await pagoService.getPagosByPropietario(propietarioId);
        setPagos(pagosData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar los pagos");
        console.error("Error cargando pagos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPagos();
  }, [propietarioId]); // Se ejecuta cuando propietarioId cambia

  const calcularResumen = () => {
    const recibidos = pagos
      .filter(pago => pago.fecha_pago && new Date(pago.fecha_pago) <= new Date())
      .reduce((sum, pago) => sum + Number(pago.monto), 0);

    const pendientes = pagos
      .filter(pago => !pago.fecha_pago || new Date(pago.fecha_pago) > new Date())
      .reduce((sum, pago) => sum + Number(pago.monto), 0);

    const enMora = pagos
      .filter(pago => {
        if (!pago.cuota?.fecha_vencimiento) return false;
        const fechaVencimiento = new Date(pago.cuota.fecha_vencimiento);
        const hoy = new Date();
        return (!pago.fecha_pago || new Date(pago.fecha_pago) > fechaVencimiento) && hoy > fechaVencimiento;
      })
      .reduce((sum, pago) => sum + Number(pago.monto), 0);

    return { recibidos, pendientes, enMora };
  };

  const resumen = calcularResumen();

  const getEstadoBadge = (pago: PagoBackend) => {
    if (pago.fecha_pago && new Date(pago.fecha_pago) <= new Date()) {
      return "bg-[#d3f7e8] text-[#1b7c4b]";
    }
    
    if (pago.cuota?.fecha_vencimiento) {
      const fechaVencimiento = new Date(pago.cuota.fecha_vencimiento);
      const hoy = new Date();
      
      if (hoy > fechaVencimiento) {
        return "bg-[#ffd9dd] text-[#d8454f]";
      }
    }
    
    return "bg-[#ffeac0] text-[#d18b1a]";
  };

  const getEstadoTexto = (pago: PagoBackend) => {
    if (pago.fecha_pago && new Date(pago.fecha_pago) <= new Date()) {
      return "Pagado";
    }
    
    if (pago.cuota?.fecha_vencimiento) {
      const fechaVencimiento = new Date(pago.cuota.fecha_vencimiento);
      const hoy = new Date();
      
      if (hoy > fechaVencimiento) {
        return "En mora";
      }
    }
    
    return "Pendiente";
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(monto);
  };

  const handleDescargarPDF = async (pagoId: number) => {
    try {
      const blob = await pagoService.downloadReciboPdf(pagoId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recibo-pago-${pagoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
      alert("Error al descargar el recibo");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
        <Sidebar />
        <main className="flex-1 px-10 py-10 flex items-center justify-center">
          <div className="text-lg">Cargando pagos...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
        <Sidebar />
        <main className="flex-1 px-10 py-10 flex items-center justify-center">
          <div className="text-lg text-red-500">{error}</div>
        </main>
      </div>
    );
  }

  if (!propietarioId && !error) {
    return (
      <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
        <Sidebar />
        <main className="flex-1 px-10 py-10 flex items-center justify-center">
          <div className="text-lg">Cargando información del usuario...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Gestión de Pagos</h2>
            <p className="text-sm text-gray-600">
              Historial de cuotas y pagos
            </p>
          </div>

          <button 
            className="flex items-center gap-2 border border-[#15352b] rounded-lg px-4 py-2 text-sm hover:bg-[#eae4d7] transition"
          >
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* TARJETAS RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#d3f7e8] flex items-center justify-center text-[#1b7c4b] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">Pagos</p>
            <p className="text-sm text-gray-700 mb-1">Recibidos</p>
            <p className="text-2xl font-bold text-[#1b7c4b]">
              {formatMoneda(resumen.recibidos)}
            </p>
          </div>

          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#fff4d9] flex items-center justify-center text-[#e4a526] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">Pagos</p>
            <p className="text-sm text-gray-700 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-[#e4a526]">
              {formatMoneda(resumen.pendientes)}
            </p>
          </div>

          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#ffd9dd] flex items-center justify-center text-[#d8454f] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">En Mora</p>
            <p className="text-2xl font-bold text-[#d8454f]">
              {formatMoneda(resumen.enMora)}
            </p>
          </div>
        </section>

        {/* TABLA PAGOS */}
        <section>
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Inquilino</th>
                  <th className="py-4 px-4">Propiedad</th>
                  <th className="py-4 px-4">Monto</th>
                  <th className="py-4 px-4">Fecha de Pago</th>
                  <th className="py-4 px-4">Medio de Pago</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pagos.map((pago) => (
                  <tr
                    key={pago.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">PAY-{pago.id}</td>
                    <td className="py-3 px-4 text-sm">
                      {pago.inquilino?.nombre} {pago.inquilino?.apellido}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {pago.contrato?.propiedad?.direccion || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm">{formatMoneda(pago.monto)}</td>
                    <td className="py-3 px-4 text-sm">
                      {formatFecha(pago.fecha_pago)}
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">
                      {pago.medio_pago}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getEstadoBadge(pago)}`}
                      >
                        {getEstadoTexto(pago)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {pago.ruta_pdf && (
                        <button
                          onClick={() => handleDescargarPDF(pago.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Descargar PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {pagos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay pagos registrados
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}