"use client";

import React from "react";
import Link from "next/link";

export default function TecnicoDashboardPage() {
  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          {/* Home (ACTIVO en esta pagina) */}
          <Link
            href="/tecnicos"
            className="w-full block px-3 py-2 rounded-lg text-sm bg-[#4b7f5e] font-semibold"
          >
            Home
          </Link>

          {/* Tickets Asignados */}
          <Link
            href="/tecnicos/tickets"
            className="w-full block px-3 py-2 rounded-lg text-sm text-slate-100 hover:bg-[#164332]"
          >
            Tickets Asignados
          </Link>

          {/* Historial */}
          <Link
            href="/tecnicos/historial"
            className="w-full block px-3 py-2 rounded-lg text-sm text-slate-100 hover:bg-[#164332]"
          >
            Historial
          </Link>

          {/* Perfil */}
          <Link
            href="/tecnicos/perfil"
            className="w-full block px-3 py-2 rounded-lg text-sm text-slate-100 hover:bg-[#164332]"
          >
            Perfil
          </Link>
        </nav>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs px-2 space-y-1">
          <div className="text-slate-300">Tecnico</div>
          <button className="flex items-center gap-2 text-slate-200 hover:text-white text-xs">
            <span>↪</span>
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL – Dashboard del tecnico */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Dashboard del Tecnico
          </h1>
          <p className="text-sm text-slate-500">
            Resumen de tus asignaciones
          </p>
        </header>

        {/* Tarjetas resumen superiores */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard title="Tickets Asignados" value="1" />
          <DashboardCard title="En Proceso" value="1" />
          <DashboardCard title="Finalizados" value="1" />
        </section>

        {/* Tickets recientes + urgentes + estadisticas (puedes ajustar como quieras) */}
        {/* Aqui deja el contenido que ya tenias, o usa este ejemplo simplificado */}

        {/* Tickets recientes */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-[#123528] mb-3">
            Tickets Recientes
          </h2>

          <div className="space-y-3 text-sm">
            <TicketItem
              codigo="TKT-001"
              prioridad="Urgente"
              descripcion="Fuga de agua en el bano principal"
              estado="Abierto"
            />
            <TicketItem
              codigo="TKT-002"
              prioridad="Media"
              descripcion="La puerta de entrada no cierra correctamente"
              estado="En proceso"
            />
            <TicketItem
              codigo="TKT-004"
              prioridad="Urgente"
              descripcion="Sistema de calefaccion no funciona"
              estado="Cerrado"
            />
          </div>
        </section>

        {/* Estadisticas del mes y tickets urgentes (simplificado) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-semibold text-[#123528] mb-3">
              Estadisticas del Mes
            </h2>
            <div className="space-y-2 text-sm">
              <StatRow label="Total Atendidos" value="2" />
              <StatRow label="Pendientes" value="1" />
              <StatRow label="Tasa de Resolucion" value="33%" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-semibold text-[#123528] mb-3">
              Tickets Urgentes
            </h2>
            <p className="text-sm text-slate-600">
              TKT-001 - Fuga de agua en el bano principal (Abierto)
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

/* ---------- componentes auxiliares ---------- */

type DashboardCardProps = {
  title: string;
  value: string;
};

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
      <span className="text-xs text-slate-500">{title}</span>
      <span className="text-2xl font-bold text-[#1f5237] mt-2">{value}</span>
    </div>
  );
}

type TicketItemProps = {
  codigo: string;
  prioridad: string;
  descripcion: string;
  estado: string;
};

function TicketItem({ codigo, prioridad, descripcion, estado }: TicketItemProps) {
  return (
    <div className="border border-slate-200 rounded-lg px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#123528] text-sm">{codigo}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            {prioridad}
          </span>
        </div>
        <p className="text-xs text-slate-500">{descripcion}</p>
      </div>
      <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start md:self-auto">
        {estado}
      </span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-[#123528]">{value}</span>
    </div>
  );
}
