"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUsuarioActual } from "../../utils/auth";
import {
  contratoService,
  ContratoBackend,
  PropiedadBackend,
  InquilinoBackend,
} from "@/services/contratoService";


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
  const usuario = getUsuarioActual();

  if (!usuario) {
    console.error("No hay usuario logueado");
    router.push("/login");
    return;
  }

  if (usuario.role !== "inquilino") {
    console.error("El rol no corresponde:", usuario.role);
    router.push("/login");
    return;
  }

  setInquilinoId(usuario.id);
  setUserLoading(false);
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

    console.log("Cargando contrato actual para inquilino:", inquilinoId);

    const contrato = await contratoService.getContratoActual(inquilinoId);

    if (!contrato) {
      setContratos([]);
      return;
    }

    const transformado: Contrato = {
      id: `C-${String(contrato.id).padStart(3, "0")}`,
      propiedad: contrato.propiedad?.direccion || "Sin dirección",
      direccion: contrato.propiedad?.direccion || "",
      tipoPropiedad: contrato.propiedad?.tipo || "",
      fechaInicio: contrato.fecha_inicio,
      fechaFin: contrato.fecha_fin,
      montoAlquiler: contrato.monto_mensual.toString(),
      montoGarantia: contrato.garantia?.toString() || "0",
      estado: contrato.estado === "activo" ? "Vigente" : "Finalizado",
    };

    setContratos([transformado]);

  } catch (err: any) {
    console.error("Error cargando contrato actual:", err);
    setError("No se pudo cargar el contrato actual.");
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
  <div className="min-h-screen bg-[#f3efe3] flex">
    <SidebarInquilino />

    {/* CONTENEDOR PRINCIPAL CENTRADO COMO EL DASHBOARD */}
    <main className="ml-64 flex-1 px-10 py-10 flex justify-center">

      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <header className="mb-6">
          <h2 className="text-3xl font-extrabold text-[#123528]">Mis Contratos</h2>
          <p className="text-sm text-slate-600">Lista de tus contratos de alquiler</p>
        </header>

        {loading && (
          <p className="text-center py-4 text-slate-600">Cargando...</p>
        )}

        {/* CARD PRINCIPAL COMO EN DASHBOARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6">

          {/* TABLA CENTRADA */}
          <div className="overflow-hidden rounded-xl border border-[#e0d7c5]">
            <table className="w-full text-sm">
              <thead className="bg-[#fdfaf3] border-b border-[#e0d7c5] text-[#4a5a52]">
                <tr>
                  <th className="p-4 text-left font-semibold">N°</th>
                  <th className="p-4 text-left font-semibold">Propiedad</th>
                  <th className="p-4 text-left font-semibold">Fecha Inicio</th>
                  <th className="p-4 text-left font-semibold">Fecha Fin</th>
                  <th className="p-4 text-left font-semibold">Cuota</th>
                  <th className="p-4 text-left font-semibold">Estado</th>
                  <th className="p-4 text-left font-semibold">Descargar</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e0d7c5] bg-[#fefefe]">

                {contratos.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f7f3e8] transition">
                    <td className="p-4 font-semibold text-[#123528]">{c.id}</td>

                    <td className="p-4 text-[#123528]">
                      {c.propiedad}
                      <div className="text-xs text-slate-500">{c.tipoPropiedad}</div>
                    </td>

                    <td className="p-4 text-[#123528]">
                      {formatearFechaBonita(c.fechaInicio)}
                    </td>

                    <td className="p-4 text-[#123528]">
                      {formatearFechaBonita(c.fechaFin)}
                    </td>

                    <td className="p-4 font-semibold text-[#123528]">
                      {formatearMoneda(c.montoAlquiler)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          c.estado === "Vigente"
                            ? "bg-[#d3f7e8] text-[#1b7c4b] border-[#a3e7c9]"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => descargarPDF(c.id)}
                        className="px-4 py-2 rounded-lg border border-[#c4bda9] bg-[#fdfaf3] hover:bg-[#f4f0e4] text-sm text-[#123528] transition"
                      >
                        Imprimir
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && contratos.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-6 text-center text-slate-500"
                    >
                      No tenés contratos disponibles.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>
  </div>
);

}