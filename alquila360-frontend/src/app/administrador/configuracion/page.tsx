"use client";

import React, { useState } from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador"; 

type Tab = "General" | "Notificaciones" | "Empresa" | "Roles";

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<Tab>("General");

  // ---------- GENERAL ----------
  const [diasGracia, setDiasGracia] = useState("5");
  const [interesMora, setInteresMora] = useState("2.5");
  const [duracionContrato, setDuracionContrato] = useState("12");
  const [diasRecordatorio, setDiasRecordatorio] = useState("30");
  const [alertasUrgentes, setAlertasUrgentes] = useState(true);

  // ---------- NOTIFICACIONES ----------
  const [emailPagoRecibido, setEmailPagoRecibido] = useState(true);
  const [emailPagosMora, setEmailPagosMora] = useState(false);
  const [emailTicketsNuevos, setEmailTicketsNuevos] = useState(true);
  const [emailVencimientoContratos, setEmailVencimientoContratos] =
    useState(true);
  const [pushActividades, setPushActividades] = useState(true);

  // ---------- ROLES ----------
  // Propietario
  const [propGestProp, setPropGestProp] = useState(true);
  const [propVerContratos, setPropVerContratos] = useState(true);
  const [propGestTickets, setPropGestTickets] = useState(true);

  // Inquilino
  const [inqVerContrato, setInqVerContrato] = useState(true);
  const [inqRealizarPagos, setInqRealizarPagos] = useState(true);
  const [inqCrearTickets, setInqCrearTickets] = useState(true);

  // Técnico
  const [tecVerTickets, setTecVerTickets] = useState(true);
  const [tecActualizarTickets, setTecActualizarTickets] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* 👇 SIDEBAR REUTILIZABLE DEL ADMINISTRADOR */}
      <SidebarAdministrador />

      {/* 👇 CONTENIDO PRINCIPAL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-extrabold text-[#123528]">
            Configuracion del Sistema
          </h1>
          <p className="text-sm text-slate-500">
            Ajustes generales de ALQUILA 360
          </p>
        </header>

        {/* tabs */}
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm mb-6">
          <TabButton tab="General" activeTab={tab} setTab={setTab} />
          <TabButton tab="Notificaciones" activeTab={tab} setTab={setTab} />
          <TabButton tab="Empresa" activeTab={tab} setTab={setTab} />
          <TabButton tab="Roles" activeTab={tab} setTab={setTab} />
        </div>

        {/* contenedor grande */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
          {/* ---------- GENERAL ---------- */}
          {tab === "General" && (
            <div className="space-y-8 text-sm">
              {/* Parametros de Mora */}
              <section className="space-y-4">
                <h2 className="font-semibold text-[#123528]">
                  Parametros de Mora
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Dias de gracia para mora
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                      value={diasGracia}
                      onChange={(e) => setDiasGracia(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Interes por mora (%)
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                      value={interesMora}
                      onChange={(e) => setInteresMora(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Parametros de Contratos */}
              <section className="space-y-4">
                <h2 className="font-semibold text-[#123528]">
                  Parametros de Contratos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Duracion por defecto (meses)
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                      value={duracionContrato}
                      onChange={(e) => setDuracionContrato(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Dias previos para recordar renovacion
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                      value={diasRecordatorio}
                      onChange={(e) => setDiasRecordatorio(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Parametros de Tickets */}
              <section className="space-y-3">
                <h2 className="font-semibold text-[#123528]">
                  Parametros de Tickets
                </h2>

                <p className="text-xs text-slate-600">
                  Asignacion automatica de tecnicos
                  <br />
                  <span className="text-slate-500">
                    Asignar tecnicos automaticamente segun disponibilidad
                  </span>
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-slate-600">
                    <p>Alertas de tickets urgentes</p>
                    <p className="text-slate-500">
                      Enviar alertas inmediatas para tickets urgentes
                    </p>
                  </div>
                  <ToggleSwitch
                    activo={alertasUrgentes}
                    onToggle={() => setAlertasUrgentes((valor) => !valor)}
                  />
                </div>
              </section>

              <div className="pt-4 border-t border-slate-200">
                <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black">
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* ---------- NOTIFICACIONES ---------- */}
          {tab === "Notificaciones" && (
            <div className="space-y-8">
              <section>
                <h2 className="font-semibold text-[#123528] mb-4">
                  Notificaciones por Email
                </h2>

                <div className="space-y-4 text-sm">
                  <RowNotificacion
                    titulo="Pagos recibidos"
                    descripcion="Notificar cuando se reciba un pago"
                    activo={emailPagoRecibido}
                    onToggle={() => setEmailPagoRecibido((v) => !v)}
                  />
                  <RowNotificacion
                    titulo="Pagos en mora"
                    descripcion="Alertar sobre pagos vencidos"
                    activo={emailPagosMora}
                    onToggle={() => setEmailPagosMora((v) => !v)}
                  />
                  <RowNotificacion
                    titulo="Nuevos tickets"
                    descripcion="Notificar cuando se cree un ticket"
                    activo={emailTicketsNuevos}
                    onToggle={() => setEmailTicketsNuevos((v) => !v)}
                  />
                  <RowNotificacion
                    titulo="Vencimiento de contratos"
                    descripcion="Recordatorio de contratos proximos a vencer"
                    activo={emailVencimientoContratos}
                    onToggle={() =>
                      setEmailVencimientoContratos((v) => !v)
                    }
                  />
                </div>
              </section>

              <section>
                <h2 className="font-semibold text-[#123528] mb-4">
                  Notificaciones Push
                </h2>

                <RowNotificacion
                  titulo="Actividades importantes"
                  descripcion="Recibir notificaciones push de eventos importantes"
                  activo={pushActividades}
                  onToggle={() => setPushActividades((v) => !v)}
                />
              </section>

              <div className="pt-4 border-t border-slate-200">
                <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black">
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}

          {/* ---------- EMPRESA ---------- */}
          {tab === "Empresa" && (
            <div className="space-y-6">
              <h2 className="font-semibold text-[#123528] text-lg">
                Datos de la Empresa
              </h2>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  defaultValue="ALQUILA 360"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Email de contacto
                </label>
                <input
                  type="email"
                  defaultValue="contacto@alquila360.com"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Telefono
                </label>
                <input
                  type="text"
                  defaultValue="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Direccion
                </label>
                <input
                  type="text"
                  defaultValue="Av. Principal 123, Ciudad"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black">
                  Actualizar Datos
                </button>
              </div>
            </div>
          )}

          {/* ---------- ROLES ---------- */}
          {tab === "Roles" && (
            <div className="space-y-6 text-sm">
              <h2 className="font-semibold text-[#123528]">
                Gestion de Permisos por Rol
              </h2>

              {/* PROPIETARIO */}
              <div className="space-y-3">
                <p className="font-semibold text-slate-800">Propietario</p>

                <RowPermiso
                  texto="Gestionar propiedades"
                  activo={propGestProp}
                  onToggle={() => setPropGestProp((v) => !v)}
                />
                <RowPermiso
                  texto="Ver contratos"
                  activo={propVerContratos}
                  onToggle={() => setPropVerContratos((v) => !v)}
                />
                <RowPermiso
                  texto="Gestionar tickets"
                  activo={propGestTickets}
                  onToggle={() => setPropGestTickets((v) => !v)}
                />
              </div>

              {/* INQUILINO */}
              <div className="space-y-3">
                <p className="font-semibold text-sky-700">Inquilino</p>

                <RowPermiso
                  texto="Ver contrato"
                  activo={inqVerContrato}
                  onToggle={() => setInqVerContrato((v) => !v)}
                />
                <RowPermiso
                  texto="Realizar pagos"
                  activo={inqRealizarPagos}
                  onToggle={() => setInqRealizarPagos((v) => !v)}
                />
                <RowPermiso
                  texto="Crear tickets"
                  activo={inqCrearTickets}
                  onToggle={() => setInqCrearTickets((v) => !v)}
                />
              </div>

              {/* TECNICO */}
              <div className="space-y-3">
                <p className="font-semibold text-amber-600">Tecnico</p>

                <RowPermiso
                  texto="Ver tickets asignados"
                  activo={tecVerTickets}
                  onToggle={() => setTecVerTickets((v) => !v)}
                />
                <RowPermiso
                  texto="Actualizar estado de tickets"
                  activo={tecActualizarTickets}
                  onToggle={() =>
                    setTecActualizarTickets((v) => !v)
                  }
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black">
                  Guardar Permisos
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------- componentes auxiliares ---------- */

type TabButtonProps = {
  tab: Tab;
  activeTab: Tab;
  setTab: (t: Tab) => void;
};

function TabButton({ tab, activeTab, setTab }: TabButtonProps) {
  const active = tab === activeTab;
  return (
    <button
      type="button"
      onClick={() => setTab(tab)}
      className={`px-4 py-1 rounded-full flex items-center gap-2 ${
        active
          ? "bg-white shadow-sm text-[#123528] font-semibold"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {tab}
    </button>
  );
}

type RowNotificacionProps = {
  titulo: string;
  descripcion: string;
  activo: boolean;
  onToggle: () => void;
};

function RowNotificacion({
  titulo,
  descripcion,
  activo,
  onToggle,
}: RowNotificacionProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-800">{titulo}</p>
        <p className="text-xs text-slate-500">{descripcion}</p>
      </div>
      <ToggleSwitch activo={activo} onToggle={onToggle} />
    </div>
  );
}

type RowPermisoProps = {
  texto: string;
  activo: boolean;
  onToggle: () => void;
};

function RowPermiso({ texto, activo, onToggle }: RowPermisoProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-slate-700">{texto}</p>
      <ToggleSwitch activo={activo} onToggle={onToggle} />
    </div>
  );
}

type ToggleProps = {
  activo: boolean;
  onToggle: () => void;
};

function ToggleSwitch({ activo, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${
        activo ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${
          activo ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
