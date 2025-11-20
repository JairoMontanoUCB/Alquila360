"use client";

import React from "react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/administrador" },
  { label: "Propiedades", href: "/administrador/propiedades" },
  { label: "Usuarios", href: "/administrador/usuarios" },
  { label: "Contratos", href: "/administrador/contratos" },
  { label: "Pagos", href: "/administrador/pagos" },
  { label: "Expensas", href: "/administrador/expensas" },
  { label: "Tickets", href: "/administrador/tickets" },
  { label: "Reportes", href: "/administrador/reportes" },
  { label: "Configuracion", href: "/administrador/configuracion" },
];

const activeLabel = "Expensas";

type EstadoExpensa = "Pagado" | "No pagado";

type Expensa = {
  id: string;
  propiedad: string;
  tipo: string;
  descripcion: string;
  monto: string;
  fecha: string;
  estado: EstadoExpensa;
};

const expensas: Expensa[] = [
  {
    id: "exp1",
    propiedad: "Calle Secundaria 456",
    tipo: "Agua",
    descripcion: "Factura de agua del mes de noviembre",
    monto: "$45",
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp2",
    propiedad: "Calle Secundaria 456",
    tipo: "Luz",
    descripcion: "Factura de electricidad del mes de noviembre",
    monto: "$120",
    fecha: "2024-11-15",
    estado: "No pagado",
  },
  {
    id: "exp3",
    propiedad: "Calle Secundaria 456",
    tipo: "Gas",
    descripcion: "Factura de gas del mes de noviembre",
    monto: "$35",
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp4",
    propiedad: "Calle Secundaria 456",
    tipo: "Mantenimiento",
    descripcion: "Mantenimiento general del edificio",
    monto: "$200",
    fecha: "2024-11-10",
    estado: "Pagado",
  },
];

export default function ExpensasPage() {
  const total = "$400";
  const pagadas = "$280";
  const noPagadas = "$120";

  const getEstadoClasses = (estado: EstadoExpensa) => {
    if (estado === "Pagado") {
      return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    }
    return "bg-red-100 text-red-700 border border-red-300";
  };

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* sidebar */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.label === activeLabel;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full block px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-[#4b7f5e] font-semibold"
                    : "hover:bg-[#164332]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/20 pt-4 px-2 text-xs space-y-1">
          <div>Administrador</div>
          <button className="text-slate-200 hover:underline">
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* contenido expensas */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestion de Expensas
            </h1>
            <p className="text-sm text-slate-500">Gastos por inmueble</p>
          </div>

          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm">
            Registrar Expensa
          </button>
        </header>

        {/* resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Expensas</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{total}</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Pagadas</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{pagadas}</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">No Pagadas</p>
            <p className="text-2xl font-bold text-red-500 mt-2">{noPagadas}</p>
          </div>
        </section>

        {/* tabla expensas */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descripcion</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {expensas.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.id}</td>
                  <td className="p-3">{e.propiedad}</td>
                  <td className="p-3">{e.tipo}</td>
                  <td className="p-3">{e.descripcion}</td>
                  <td className="p-3">{e.monto}</td>
                  <td className="p-3">{e.fecha}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoClasses(
                        e.estado
                      )}`}
                    >
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

