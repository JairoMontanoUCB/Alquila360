"use client";

 import React, { useState, useEffect } from "react";
 import Link from "next/link";
 import { PagoBackend, pagoService } from "@/services/pagoService";
import { usePathname, useRouter } from "next/navigation";

type EstadoPago = "Pagado" | "Pendiente" | "En Mora";

 interface Pago {
   id: string;
   periodo: string;
   fechaLimite: string;
   monto: number;
    estado: EstadoPago;
   fechaPago: string | null;
   mes?: string;
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
  const [totalPagado, setTotalPagado] = useState(0);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalMora, setTotalMora] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showHistorial, setShowHistorial] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

  // CONEXIÓN CON BACKEND PARA INQUILINO - CORREGIDA
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
       
        // ✅ CORRECCIÓN: Usar el endpoint específico para inquilino
        const pagosInquilino = await pagoService.getPagosByInquilino(inquilinoId);
        
        console.log("Pagos del inquilino:", pagosInquilino);
       
        // Transformar datos del backend al formato del frontend
        const pagosTransformados: Pago[] = pagosInquilino.map((pago: PagoBackend) => {
          const fechaPago = pago.fecha_pago ? new Date(pago.fecha_pago) : new Date();
         
          // Usar fecha de vencimiento de la cuota o calcular basado en fecha de pago
          let fechaVencimiento: Date;
          if (pago.cuota?.fecha_vencimiento) {
            fechaVencimiento = new Date(pago.cuota.fecha_vencimiento);
          } else {
            fechaVencimiento = new Date(fechaPago);
            fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
          }
         
          // Determinar estado basado en la cuota y fechas
          let estado: EstadoPago;
          if (pago.cuota?.estado === 'pagada') {
            estado = "Pagado";
          } else if (fechaVencimiento < new Date()) {
            estado = "En Mora";
          } else {
            estado = "Pendiente";
          }

          return {
            id: pago.id.toString(),
            periodo: fechaPago.toLocaleDateString('es-ES', { 
              month: 'long', 
              year: 'numeric' 
            }),
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

        const calculoTotalPagado = pagosTransformados
          .filter(p => p.estado === "Pagado")
          .reduce((sum, p) => sum + p.monto, 0);
       
        const calculoTotalPendiente = pagosTransformados
          .filter(p => p.estado === "Pendiente")
          .reduce((sum, p) => sum + p.monto, 0);
       
        const calculoTotalMora = pagosTransformados
          .filter(p => p.estado === "En Mora")
          .reduce((sum, p) => sum + p.monto, 0);

        setTotalPagado(calculoTotalPagado);
        setTotalPendiente(calculoTotalPendiente);
        setTotalMora(calculoTotalMora);

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

    //Estados de carga y error
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
            
             {pagos.length === 0 && (
               <div className="text-center py-8">
                 <p className="text-slate-500">No se encontraron pagos registrados</p>
               </div>
             )}
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
       </main>
     </div>
   );
 }

 /* -------------------------------------------------------------------------- */
 /*                      MODAL: HISTORIAL COMPLETO                             */
 /* -------------------------------------------------------------------------- */
function PagoResumenCard({ titulo, monto, colorValor, bg }: any) {
  return (
    <div className={`${bg} border border-slate-300 rounded-xl p-4 shadow-sm`}>
      <p className="text-xs text-slate-500">{titulo}</p>
      <p className={`text-3xl font-bold mt-2 ${colorValor}`}>{monto}</p>
    </div>
  );
}

function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  const getEstadoColor = (estado: EstadoPago) => {
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

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(estado)}`}>
      {estado}
    </span>
  );
}

function HistCard({ 
  titulo, 
  monto, 
  detalle, 
  bg, 
  color 
}: { 
  titulo: string;
  monto: string;
  detalle: string;
  bg: string;
  color: string;
}) {
  return (
    <div className={`${bg} border border-slate-300 rounded-xl p-4 shadow-sm`}>
      <p className="text-xs text-slate-500">{titulo}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{monto}</p>
      <p className="text-xs text-slate-400 mt-1">{detalle}</p>
    </div>
  );
}
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
              
               {pagos.length === 0 && (
                 <div className="text-center py-8">
                   <p className="text-slate-500">No hay pagos para mostrar</p>
                 </div>
               )}
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

 function RealizarPagoModal({ pago, onClose }: { pago: Pago, onClose: () => void }) {
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

        {step === 1 && (
          <>
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