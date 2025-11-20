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

const activeLabel = "Reportes";

export default function ReportesPage() {
  const totalIngresos = "$105,400";
  const crecimiento = "+15.2%";
  const ocupacion = "75%";

  const ingresosMensuales = [7000, 8200, 8600, 9100, 8900, 9400, 9800, 10100];

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

      {/* contenido reportes */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Reportes
            </h1>
            <p className="text-sm text-slate-500">
              Analisis y estadisticas del sistema
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#ffb628] hover:bg-[#f2a917] text-black px-4 py-2 rounded-lg font-semibold text-sm">
            <span>⬇</span>
            <span>Exportar PDF</span>
          </button>
        </header>

        {/* tarjetas resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-500">Total Ingresos</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {totalIngresos}
            </p>
            <p className="text-xs text-slate-500 mt-1">Acumulado 2024</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-500">Crecimiento</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {crecimiento}
            </p>
            <p className="text-xs text-slate-500 mt-1">vs mes anterior</p>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-slate-500">Ocupacion</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {ocupacion}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Propiedades ocupadas
            </p>
          </div>
        </section>

        {/* graficos superiores */}
        <section className="space-y-6 mb-6">
          {/* Ingresos Mensuales */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-700 mb-2">
              Ingresos Mensuales 2024
            </h2>
            <div className="h-56 flex flex-col">
              <div className="flex-1 flex items-end gap-3 pb-4">
                {ingresosMensuales.map((valor, idx) => {
                  const max = Math.max(...ingresosMensuales);
                  const altura = (valor / max) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-7 bg-emerald-600/80 rounded-t"
                        style={{ height: `${altura}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                {["Ene", "Marzo", "Abril", "Mayo", "Junio", "Agosto", "Oct", "Nov"].map(
                  (m) => (
                    <span key={m}>{m}</span>
                  )
                )}
              </div>
              <div className="mt-2 text-[10px] text-center text-slate-400">
                Ingresos [$]
              </div>
            </div>
          </div>

          {/* Distribucion de Propiedades */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-700 mb-4">
              Distribucion de Propiedades
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* pseudo pie chart */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border border-slate-300">
                  {/* verde mitad */}
                  <div className="absolute inset-0 bg-emerald-500" />
                  {/* azul cuarto */}
                  <div className="absolute inset-0 clip-path-pie-blue bg-blue-500" />
                  {/* naranja cuarto */}
                  <div className="absolute inset-0 clip-path-pie-orange bg-orange-400" />
                </div>
              </div>

              {/* leyenda */}
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Disponibles</span>
                  </div>
                  <span>2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Ocupadas</span>
                  </div>
                  <span>1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-400" />
                    <span>Mantenimiento</span>
                  </div>
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* grafico tickets + tarjetas reportes */}
        <section className="space-y-6">
          {/* Evolucion de Tickets */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-700 mb-2">
              Evolucion de Tickets
            </h2>
            <div className="h-56 flex flex-col">
              <div className="flex-1 relative">
                {/* curvas fake con puntos */}
                {["Bajos", "Medios", "Urgentes"].map((serie, serieIdx) => {
                  const valores =
                    serie === "Bajos"
                      ? [12, 15, 11, 18]
                      : serie === "Medios"
                      ? [8, 9, 7, 12]
                      : [5, 6, 4, 8];
                  const color =
                    serie === "Bajos"
                      ? "bg-emerald-500"
                      : serie === "Medios"
                      ? "bg-amber-400"
                      : "bg-red-500";

                  return valores.map((v, i) => (
                    <div
                      key={`${serie}-${i}`}
                      className={`w-2 h-2 rounded-full ${color} absolute`}
                      style={{
                        left: `${10 + i * 23}%`,
                        bottom: `${10 + v * 3}%`,
                      }}
                    />
                  ));
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                {["Jul", "Ago", "Sep", "Oct", "Nov"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>

              <div className="flex justify-center gap-4 text-[10px] text-slate-600 mt-3">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Bajos</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Medios</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Urgentes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reportes Disponibles */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-sm text-slate-700 mb-4">
              Reportes Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <ReportCard
                titulo="Reporte de Pagos"
                descripcion="Historial completo de pagos y mora"
              />
              <ReportCard
                titulo="Reporte de Expensas"
                descripcion="Gastos por propiedad y tipo"
              />
              <ReportCard
                titulo="Reporte de Contratos"
                descripcion="Estado de contratos y renovaciones"
              />
              <ReportCard
                titulo="Reporte de Mantenimiento"
                descripcion="Estadisticas de tickets y tecnicos"
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

/* tarjetas de reporte */

type ReportCardProps = {
  titulo: string;
  descripcion: string;
};

function ReportCard({ titulo, descripcion }: ReportCardProps) {
  return (
    <div className="border border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-50 cursor-pointer transition">
      <p className="text-xs font-semibold text-slate-800">{titulo}</p>
      <p className="text-[11px] text-slate-500 mt-1">{descripcion}</p>
    </div>
  );
}

