"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import {
  contratoService,
  ContratoBackend,
  CreateContratoDto,
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
  inquilino: string;
  propietario: string;
  fechaInicio: string;
  fechaFin: string;
  montoAlquiler: string;
  montoGarantia: string;
  frecuenciaCobro: string;
  numeroCuotas: string;
  diaVencimiento: string;
  penalidades: string;
  clausulas: string;
  estado: EstadoContrato;
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contratos", path: "/inquilino/contratos" }, // ← CAMBIADO
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
/*                             PAGINA: CONTRATOS                               */
/* -------------------------------------------------------------------------- */

export default function ContratosInquilinoPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarContratos();
  }, []);

  const cargarContratos = async () => {
    try {
      setLoading(true);

      const [contratosData, propiedadesData, inquilinosData] =
        await Promise.all([
          contratoService.getContratos(),
          contratoService.getPropiedadesDisponibles(),
          contratoService.getInquilinos(),
        ]);

      const contratosArray = Array.isArray(contratosData) ? contratosData : [];
      const propiedadesArray = Array.isArray(propiedadesData)
        ? propiedadesData
        : [];
      const inquilinosArray = Array.isArray(inquilinosData)
        ? inquilinosData
        : [];

      const transformado: Contrato[] = contratosArray.map((c, index) => {
        const propiedad = propiedadesArray.find((p) => p.id === c.id_propiedad);

        const inquilino =
          inquilinosArray[index] || inquilinosArray[0] || {
            nombre: "Inquilino",
            apellido: "No encontrado",
          };

        return {
          id: `C-${String(c.id).padStart(3, "0")}`,
          propiedad: propiedad?.direccion || "Propiedad desconocida",
          inquilino: `${inquilino.nombre} ${inquilino.apellido}`,
          propietario: propiedad?.propietario
            ? `${propiedad.propietario.nombre} ${propiedad.propietario.apellido}`
            : "Propietario no disponible",
          fechaInicio: c.fecha_inicio,
          fechaFin: c.fecha_fin,
          montoAlquiler: c.monto_mensual?.toString() || "0",
          montoGarantia: c.garantia?.toString() || "0",
          frecuenciaCobro: "Mensual",
          numeroCuotas: "12",
          diaVencimiento: "10",
          penalidades: "Mora del 2% por día de atraso...",
          clausulas: "El locatario se compromete...",
          estado: c.estado === "activo" ? "Vigente" : "Finalizado",
        };
      });

      setContratos(transformado);
    } finally {
      setLoading(false);
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
                <th className="p-3">Inquilino</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Fecha Fin</th>
                <th className="p-3">Cuota</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {contratos.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.propiedad}</td>
                  <td className="p-3">{c.inquilino}</td>
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
