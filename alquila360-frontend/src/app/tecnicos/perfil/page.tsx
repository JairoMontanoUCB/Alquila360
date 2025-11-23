"use client";

import React from "react";

export default function PerfilTecnicoPage() {
  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* SIDEBAR TECNICO */}
      <aside className="w-64 bg-[#0b3b2c] text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold tracking-wide mb-10 px-2">
          ALQUILA 360
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem label="Home" />
          <SidebarItem label="Tickets Asignados" />
          <SidebarItem label="Historial" />
          <SidebarItem label="Perfil" active />
        </nav>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs px-2 space-y-1">
          <div className="text-slate-300">Tecnico</div>
          <button className="flex items-center gap-2 text-slate-200 hover:text-white text-xs">
            <span>↪</span>
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PERFIL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528]">Mi Perfil</h1>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl">
          <ProfileRow label="Nombre" value="Carlos Martinez" />
          <ProfileRow
            label="Email"
            value="carlos.martinez@example.com"
            className="mt-6"
          />
          <ProfileRow label="Telefono" value="555-9012" className="mt-6" />
          <ProfileRow label="Rol" value="Tecnico" className="mt-6" />

          <div className="mt-10">
            <button className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">
              Cerrar Sesion
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------- componentes auxiliares -------- */

type SidebarItemProps = {
  label: string;
  active?: boolean;
};

function SidebarItem({ label, active }: SidebarItemProps) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition ${
        active
          ? "bg-[#4b7f5e] font-semibold"
          : "hover:bg-[#164332] text-slate-100"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

function ProfileRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-sm text-slate-800 mt-1">{value}</div>
    </div>
  );
}

