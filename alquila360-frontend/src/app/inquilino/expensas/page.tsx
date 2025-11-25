"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                   TIPOS                                    */
/* -------------------------------------------------------------------------- */

type ExpensaTipo = "Agua" | "Luz" | "Gas" | "Mantenimiento";
type ExpensaEstado = "Pagado" | "No pagado";

type Expensa = {
  id: string;
  propiedad: string;
  tipo: ExpensaTipo;
  descripcion: string;
  mes: string;
  monto: number;
  fecha: string;
  estado: ExpensaEstado;
};

/* -------------------------------------------------------------------------- */
/*                               SIDEBAR INQUILINO                            */
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
        Cerrar Sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DATOS MOCK EXPENSAS                          */
/* -------------------------------------------------------------------------- */

const EXPENSAS_MOCK: Expensa[] = [
  {
    id: "exp1",
    propiedad: "Calle Secundaria 456",
    tipo: "Agua",
    descripcion: "Factura de agua del mes de noviembre",
    mes: "Noviembre 2024",
    monto: 100,
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp2",
    propiedad: "Calle Secundaria 456",
    tipo: "Luz",
    descripcion: "Factura de electricidad del mes de noviembre",
    mes: "Noviembre 2024",
    monto: 120,
    fecha: "2024-11-15",
    estado: "No pagado",
  },
  {
    id: "exp3",
    propiedad: "Calle Secundaria 456",
    tipo: "Gas",
    descripcion: "Factura de gas del mes de noviembre",
    mes: "Noviembre 2024",
    monto: 80,
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp4",
    propiedad: "Calle Secundaria 456",
    tipo: "Mantenimiento",
    descripcion: "Mantenimiento general del edificio",
    mes: "Noviembre 2024",
    monto: 100,
    fecha: "2024-11-10",
    estado: "Pagado",
  },
];

function getTipoIcon(tipo: ExpensaTipo) {
  switch (tipo) {
    case "Agua":
      return "💧";
    case "Luz":
      return "💡";
    case "Gas":
      return "🔥";
    case "Mantenimiento":
      return "🔧";
    default:
      return "📄";
  }
}

/* -------------------------------------------------------------------------- */
/*                               PAGINA EXPENSAS                              */
/* -------------------------------------------------------------------------- */

export default function ExpensasInquilinoPage() {
  const [expensas, setExpensas] = useState<Expensa[]>([]);

  useEffect(() => {
    // aqui conectarias a tu backend
    setExpensas(EXPENSAS_MOCK);
  }, []);

  const totalExpensas = expensas.reduce((acc, e) => acc + e.monto, 0);
  const totalPagadas = expensas
    .filter((e) => e.estado === "Pagado")
    .reduce((acc, e) => acc + e.monto, 0);
  const totalNoPagadas = totalExpensas - totalPagadas;

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528] mb-1">
            Mis Expensas
          </h1>
          <p className="text-sm text-slate-500">
            Gastos asociados a tu propiedad
          </p>
        </header>

        {/* Resumen cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResumenCard
            title="Total Expensas"
            value={`$${totalExpensas.toLocaleString()}`}
            accent="bg-indigo-50 text-indigo-700"
          />
          <ResumenCard
            title="Pagadas"
            value={`$${totalPagadas.toLocaleString()}`}
            accent="bg-emerald-50 text-emerald-700"
          />
          <ResumenCard
            title="No Pagadas"
            value={`$${totalNoPagadas.toLocaleString()}`}
            accent="bg-rose-50 text-rose-700"
          />
        </section>

        {/* Tabla expensas */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#123528]">
              Todas las Expensas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-slate-50 text-left text-[11px] text-slate-500">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Propiedad</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Descripcion</th>
                  <th className="p-3">Mes</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {expensas.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`border-t border-slate-100 ${
                      idx % 2 === 1 ? "bg-slate-50/60" : ""
                    }`}
                  >
                    <td className="p-3">{e.id}</td>
                    <td className="p-3">{e.propiedad}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-2">
                        <span>{getTipoIcon(e.tipo)}</span>
                        <span>{e.tipo}</span>
                      </span>
                    </td>
                    <td className="p-3">{e.descripcion}</td>
                    <td className="p-3">{e.mes}</td>
                    <td className="p-3">{`$${e.monto.toLocaleString()}`}</td>
                    <td className="p-3">{e.fecha}</td>
                    <td className="p-3">
                      <EstadoBadge estado={e.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Info expensas */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 text-xs md:text-sm text-slate-700 space-y-2 mb-10">
          <h2 className="font-semibold text-[#123528] mb-2">
            Informacion sobre expensas
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Las expensas incluyen servicios comunes como agua, luz, gas y
              mantenimiento segun corresponda.
            </li>
            <li>
              Todas las expensas deben ser abonadas dentro de los primeros 10
              dias del mes siguiente.
            </li>
            <li>
              Para consultas sobre expensas especificas, contacta a la
              administracion o propietario.
            </li>
            <li>
              Los comprobantes de pago estan disponibles una vez confirmado el
              pago.
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SUBCOMPONENTES                                 */
/* -------------------------------------------------------------------------- */

type ResumenCardProps = {
  title: string;
  value: string;
  accent: string;
};

function ResumenCard({ title, value, accent }: ResumenCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${accent}`}
      >
        📊
      </div>
      <div>
        <p className="text-[11px] text-slate-500">{title}</p>
        <p className="text-xl font-bold text-[#123528] mt-1">{value}</p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: ExpensaEstado }) {
  const isPagado = estado === "Pagado";
  const classes = isPagado
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold border ${classes}`}
    >
      {estado}
    </span>
  );
}
