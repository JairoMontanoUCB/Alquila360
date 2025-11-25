"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import {
  contratoService,
  ContratoBackend,
  PropiedadBackend,
  InquilinoBackend,
} from "../../../services/ContratoService";

/* -------------------------------------------------------------------------- */
/*                                   TIPOS                                    */
/* -------------------------------------------------------------------------- */

type EstadoContrato = "Vigente" | "Finalizado";

interface Contrato {
  id: string;
  propiedad: string;
  fechaInicio: string;
  fechaFin: string;
  montoAlquiler: string;
  montoGarantia: string;
  estado: EstadoContrato;
  direccion: string;
  tipoPropiedad: string;
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contratos", path: "/inquilino/contratos" },
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
        Cerrar Sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                         FORMATEADORES (FECHA / MONEDA)                     */
/* -------------------------------------------------------------------------- */

function formatearFechaBonita(fecha: string) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatearMoneda(valor: string) {
  const num = Number(valor);
  if (isNaN(num)) return `$${valor}`;
  return `$${num.toLocaleString("es-AR")}`;
}

/* -------------------------------------------------------------------------- */
/*                             PAGINA: CONTRATOS                             */
/* -------------------------------------------------------------------------- */

export default function ContratosInquilinoPage() {
  const router = useRouter();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inquilinoId, setInquilinoId] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // ===== VERIFICACIÓN DE USUARIO =====
  useEffect(() => {
    const obtenerUsuarioLogueado = () => {
      try {
        const usuarioStorage = localStorage.getItem('usuario');
        const role = localStorage.getItem('role');

        if (usuarioStorage && role === 'inquilino') {
          const usuario = JSON.parse(usuarioStorage);
          
          if (usuario && usuario.id) {
            setInquilinoId(usuario.id);
          } else {
            console.error("Usuario no tiene ID");
            router.push('/login');
          }
        } else {
          console.error("No es inquilino o no hay usuario:", { role });
          router.push('/login');
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        router.push('/login');
      } finally {
        setUserLoading(false);
      }
    };

    obtenerUsuarioLogueado();
  }, [router]);

  // ===== CARGA DE CONTRATOS =====
  useEffect(() => {
    if (inquilinoId) {
      cargarContratos();
    }
  }, [inquilinoId]);

  const cargarContratos = async () => {
    if (!inquilinoId) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Cargando contratos para inquilino ID:", inquilinoId);

      // Obtener todos los contratos y filtrar por inquilino
      const [contratosData, propiedadesData] = await Promise.all([
        contratoService.getContratos(),
        contratoService.getPropiedadesDisponibles(),
      ]);

      console.log("📊 Datos recibidos:", {
        contratos: contratosData,
        propiedades: propiedadesData
      });

      // Filtrar contratos del inquilino logueado
      const contratosDelInquilino = contratosData.filter((contrato: any) => {
        // Verificar si el contrato pertenece a este inquilino
        const esDelInquilino = contrato.inquilino && contrato.inquilino.id === inquilinoId;
        console.log(`🔍 Contrato ${contrato.id}:`, { 
          inquilinoContrato: contrato.inquilino?.id, 
          inquilinoLogueado: inquilinoId,
          esDelInquilino 
        });
        return esDelInquilino;
      });

      console.log("✅ Contratos del inquilino:", contratosDelInquilino);

      // Transformar datos
      const transformado: Contrato[] = contratosDelInquilino.map((contrato: any) => {
        // Buscar la propiedad relacionada
        const propiedad = propiedadesData.find((p: any) => p.id === contrato.id_propiedad);

        return {
          id: `C-${String(contrato.id).padStart(3, "0")}`,
          propiedad: propiedad?.direccion || "Propiedad no disponible",
          direccion: propiedad?.direccion || "",
          tipoPropiedad: propiedad?.tipo || "",
          fechaInicio: contrato.fecha_inicio || "",
          fechaFin: contrato.fecha_fin || "",
          montoAlquiler: contrato.monto_mensual?.toString() || "0",
          montoGarantia: contrato.garantia?.toString() || "0",
          estado: (contrato.estado === "activo" || contrato.estado === "Vigente") ? "Vigente" : "Finalizado",
        };
      });

      setContratos(transformado);
      
    } catch (err: any) {
      console.error(" Error cargando contratos:", err);
      setError(`Error cargando contratos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async (contratoId: string) => {
    try {
      const idNumerico = contratoId.replace('C-', '');
      
      await contratoService.descargarContratoPDF(Number(idNumerico));
    } catch (error: any) {
      console.error('Error completo:', error);
      alert(`Error al descargar el PDF: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6 flex items-between justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Mis Contratos
            </h1>
            <p className="text-sm text-slate-500">
              Lista de tus contratos de alquiler
            </p>
          </div>
        </header>

        {loading && (
          <p className="text-center py-4 text-slate-600">Cargando...</p>
        )}

        {/* Tabla */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">N°</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Fecha Fin</th>
                <th className="p-3">Cuota</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Descargar</th>
              </tr>
            </thead>

            <tbody>
              {contratos.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.propiedad}</td>
                  <td className="p-3">{formatearFechaBonita(c.fechaInicio)}</td>
                  <td className="p-3">{formatearFechaBonita(c.fechaFin)}</td>
                  <td className="p-3">{formatearMoneda(c.montoAlquiler)}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        c.estado === "Vigente"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {c.estado}
                    </span>
                  </td>
                    <td>
                      <button 
                    onClick={() => descargarPDF(c.id)}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
                      >
                    Imprimir
                    </button>
                    </td>
                </tr>
              ))}

              {!loading && contratos.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-400">
                    No tenes contratos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
