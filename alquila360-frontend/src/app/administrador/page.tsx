"use client";

import React from "react";
import Link from "next/link";

const menuItems = [
  { label: "Dashboard", href: "/administrador" },
  { label: "Propiedades", href: "/administrador/propiedades" },
  { label: "Usuarios", href: "/administrador/usuarios" },
  { label: "Contratos", href: "/administrador/contratos" }, // <-- NUEVO
  { label: "Pagos", href: "/administrador/pagos" },
  { label: "Expensas", href: "/administrador/expensas" },
  { label: "Tickets", href: "/administrador/tickets" },
  { label: "Reportes", href: "/administrador/reportes" },
  { label: "Configuracion", href: "/administrador/configuracion" },
];

const activeLabel = "Dashboard";

/* tipos */
type SummaryProps = {
  title: string;
  value: string;
};

type TicketBlockProps = {
  title: string;
  count: number;
  description: string;
  borderColor: string;
};

type PanelProps = {
  title: string;
  children: React.ReactNode;
};

/* pagina dashboard */
export default function AdministradorPage() {
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

      {/* contenido principal */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Dashboard Administrativo
          </h1>
          <p className="text-sm text-slate-500">
            Vista general del sistema ALQUILA 360
          </p>
        </header>

        {/* resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Total Propiedades" value="8" />
          <SummaryCard title="Total Usuarios" value="4" />
          <SummaryCard title="Contratos Activos" value="1" />
          <SummaryCard title="Pagos del Mes" value="1" />
          <SummaryCard title="Expensas del Mes" value="4" />
          <SummaryCard title="Tickets Abiertos" value="3" />
        </section>

        {/* tickets */}
        <section className="space-y-4 mb-6">
          <TicketBlock
            title="Tickets Urgentes"
            count={1}
            description="Requieren atencion inmediata"
            borderColor="border-red-300"
          />
          <TicketBlock
            title="Tickets Medios"
            count={1}
            description="En seguimiento"
            borderColor="border-amber-300"
          />
          <TicketBlock
            title="Tickets Bajos"
            count={1}
            description="Bajo seguimiento"
            borderColor="border-emerald-300"
          />
        </section>

        {/* paneles */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Panel title="Ingresos Mensuales">
              <FakeBarChart />
            </Panel>
            <Panel title="Actividad de Tickets">
              <FakeLineChart />
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Alertas del Sistema">
              <AlertsList />
            </Panel>

            <Panel title="Actividad Reciente">
              <ActivityList />
            </Panel>
          </div>
        </section>
      </section>
    </main>
  );
}

/* componentes auxiliares */

function SummaryCard({ title, value }: SummaryProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <span className="text-xs text-slate-500">{title}</span>
      <span className="text-2xl font-bold text-[#1f5237] mt-2 block">
        {value}
      </span>
    </div>
  );
}

function TicketBlock({
  title,
  count,
  description,
  borderColor,
}: TicketBlockProps) {
  return (
    <div className={`bg-white rounded-xl p-4 border-2 ${borderColor} shadow-sm`}>
      <h2 className="font-semibold text-[#143829] mb-2">{title}</h2>
      <div className="text-3xl font-bold text-[#b03030]">{count}</div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Panel({ title, children }: PanelProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <h2 className="font-semibold mb-3 text-[#143829]">{title}</h2>
      {children}
    </div>
  );
}

function FakeBarChart() {
  return (
    <div className="h-40 flex items-end justify-between gap-2">
      {[75, 80, 78, 82, 90].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-emerald-600/80 rounded"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function FakeLineChart() {
  return (
    <div className="h-40 flex items-end justify-between gap-4 relative">
      {[40, 55, 35, 70, 45].map((h, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-amber-500 absolute"
          style={{ bottom: `${h}%`, left: `${i * 20}%` }}
        />
      ))}
    </div>
  );
}

function AlertsList() {
  return (
    <ul className="space-y-2 text-sm">
      <li className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <span className="font-semibold text-red-700">
          Hay 1 tickets urgentes sin asignar tecnico
        </span>
      </li>
      <li className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <span className="font-semibold text-amber-700">
          Hay 1 pagos en mora
        </span>
      </li>
      <li className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        <span className="font-semibold text-blue-700">
          Hay 1 expensas pendientes
        </span>
      </li>
    </ul>
  );
}

function ActivityList() {
  return (
    <ul className="space-y-3 text-sm">
      <li className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-[#143829]">Nuevo contrato creado</p>
          <p className="text-xs text-slate-500">Contrato CONT-001</p>
        </div>
        <span className="text-xs text-slate-400">Hace 2 horas</span>
      </li>

      <li className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-[#143829]">Pago recibido</p>
          <p className="text-xs text-slate-500">$2,500 - Noviembre 2024</p>
        </div>
        <span className="text-xs text-slate-400">Hace 5 horas</span>
      </li>

      <li className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-[#143829]">Ticket urgente creado</p>
          <p className="text-xs text-slate-500">TKT-001 - Fuga de agua</p>
        </div>
        <span className="text-xs text-slate-400">Hace 1 dia</span>
      </li>
    </ul>
  );
}
