"use client";

import React, { useState } from "react";
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

const activeLabel = "Configuracion";

const tabs = ["General", "Notificaciones", "Empresa", "Roles"] as const;
type Tab = (typeof tabs)[number];

export default function ConfiguracionPage() {
  const [tabActiva, setTabActiva] = useState<Tab>("General");
  const [alertasUrgentes, setAlertasUrgentes] = useState(true);

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

      {/* contenido configuracion */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Configuracion del Sistema
          </h1>
          <p className="text-sm text-slate-500">
            Ajustes generales de ALQUILA 360
          </p>
        </header>

        {/* tabs superiores */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          {tabs.map((t) => {
            const active = t === tabActiva;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTabActiva(t)}
                className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                  active
                    ? "bg-white border-slate-300 text-[#123528] font-semibold"
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {/* iconitos simples */}
                <span className="text-xs">⚙</span>
                <span>{t}</span>
              </button>
            );
          })}
        </div>

        {/* solo implementamos la vista General, las demas tabs podrian mostrar un placeholder */}
        {tabActiva === "General" ? (
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-6 space-y-6">
            {/* Parametros de Mora */}
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Parametros de Mora
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoTexto
                  label="Dias de gracia para mora"
                  valor="5"
                />
                <CampoTexto
                  label="Interes por mora (%)"
                  valor="2.5"
                />
              </div>
            </section>

            {/* Parametros de Contratos */}
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Parametros de Contratos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoTexto
                  label="Duracion por defecto (meses)"
                  valor="12"
                />
                <CampoTexto
                  label="Dias previos para recordar renovacion"
                  valor="30"
                />
              </div>
            </section>

            {/* Parametros de Tickets */}
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Parametros de Tickets
              </h2>
              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <p>Asignacion automatica de tecnicos</p>
                <p>Asignar tecnicos automaticamente segun disponibilidad</p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <div className="text-xs text-slate-700">
                  <p className="font-semibold">Alertas de tickets urgentes</p>
                  <p className="text-slate-500">
                    Enviar alertas inmediatas para tickets urgentes
                  </p>
                </div>

                {/* switch simple */}
                <button
                  type="button"
                  onClick={() => setAlertasUrgentes((v) => !v)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition ${
                    alertasUrgentes ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition ${
                      alertasUrgentes ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </section>

            <div className="pt-2">
              <button className="w-full md:w-auto bg-[#ffb628] hover:bg-[#f2a917] text-black font-semibold text-sm px-6 py-2 rounded-lg">
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          // placeholder simple para las otras tabs
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-6 text-sm text-slate-500">
            Configuracion de <span className="font-semibold">{tabActiva}</span>{" "}
            aun no implementada. (Solo se maqueta la pestaña General para el
            prototipo).
          </div>
        )}
      </section>
    </main>
  );
}

/* subcomponente para inputs de solo lectura */

type CampoTextoProps = {
  label: string;
  valor: string;
};

function CampoTexto({ label, valor }: CampoTextoProps) {
  return (
    <label className="text-xs text-slate-700 space-y-1 block">
      <span>{label}</span>
      <input
        type="text"
        value={valor}
        readOnly
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
      />
    </label>
  );
}
