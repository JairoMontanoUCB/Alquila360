"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

const inquilinoMenu = [
  { label: "Home", path: "/inquilino" },
  { label: "Contrato", path: "/inquilino/contratos" },
  { label: "Pagos", path: "/inquilino/pagos" },
  { label: "Tickets", path: "/inquilino/ticket" },
  { label: "Expensas", path: "/inquilino/expensas" },
  { label: "Perfil", path: "/inquilino/perfil" },
];

function SidebarInquilino() {
  const router = useRouter();
  const pathname = usePathname();
import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";

// IMPORTAR SERVICES
import { getContratoActual } from "@/services/contratoService";
//import { getProximoPago } from "@/services/pagoService";
import { pagoService } from "@/services/pagoService";
import { getTicketsUsuario, crearTicket } from "@/services/ticketService";
import { getExpensasPendientes } from "@/services/expensaService";

export default function InquilinoDashboard() {
  // ESTADOS REALES (antes hardcodeados)
  const [contratoActivo, setContratoActivo] = useState<any>(null);
  const [proximoPago, setProximoPago] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [expensasPendientes, setExpensasPendientes] = useState(0);

  const [openReport, setOpenReport] = useState(false);

  // CARGAR DATOS REALES
  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        const contrato = await getContratoActual(userId);
        setContratoActivo(contrato);

        //const pago = await getProximoPago(contrato.id);
        const pago = await pagoService.getProximoPago(userId);
        setProximoPago(pago);

        const tks = await getTicketsUsuario(userId);
        setTickets(tks);

        const exp = await getExpensasPendientes(userId);
        setExpensasPendientes(exp.total ?? 0);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    loadData();
  }, []);

  const ticketsAbiertos = tickets.filter((t) => t.estado === "Abierto").length;

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
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/inquilino"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#4b7f5e] text-sm font-medium"
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/inquilino/contratos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm">
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link href="/inquilino/pagos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm">
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link href="/inquilino/ticket" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm">
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link href="/inquilino/expensas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm">
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link href="/inquilino/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm">
            <span>👤</span>
            <span>Perfil</span>
          </Link>
        </nav>

      <div className="mt-6 px-2 text-xs text-slate-300">Inquilino</div>
      <button className="mt-2 px-3 py-2 text-xs text-slate-200 hover:bg-[#164332] rounded-lg text-left">
        Cerrar Sesion
      </button>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MOCK DE INFORMACION                           */
/* -------------------------------------------------------------------------- */

const contratoActual = {
  inicio: "31/12/2023",
  fin: "31/12/2024",
  cuota: "$2,500",
  estado: "Vigente",
};

const proximoPago = {
  monto: 2500,
  descripcion: "Diciembre 2024 · Vence el 2024-12-10",
};

const resumenDashboard = {
  ticketsAbiertos: "3",
  expensasPendientes: "1",
};

const ticketsRecientes = [
  {
    id: "TKT-001",
    descripcion: "Fuga de agua en el baño principal",
    fecha: "2024-11-18",
    estado: "Abierto",
  },
  {
    id: "TKT-002",
    descripcion: "La puerta de entrada no cierra correctamente",
    fecha: "2024-11-15",
    estado: "En proceso",
  },
  {
    id: "TKT-003",
    descripcion: "Interruptor descalibrado en la pared del dormitorio",
    fecha: "2024-11-10",
    estado: "Abierto",
  },
];

/* -------------------------------------------------------------------------- */
/*                               PAGINA PRINCIPAL                             */
/* -------------------------------------------------------------------------- */

export default function DashboardInquilino() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarInquilino />

      {/* Contenido principal */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#123528] mb-1">
            Mi Dashboard
          </h1>
          <p className="text-sm text-slate-500">Resumen de tu alquiler</p>
        </header>

        {/* Tarjetas superiores */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard
            title="Contrato Activo"
            value="Vigente"
            icon="📄"
            pill="Activo"
            pillColor="bg-emerald-100 text-emerald-700"
          />
          <DashboardCard
            title="Proximo Pago"
            value="$2,500"
            icon="💰"
            pill="Diciembre"
            pillColor="bg-amber-100 text-amber-700"
          />
          <DashboardCard
            title="Tickets Abiertos"
            value={resumenDashboard.ticketsAbiertos}
            icon="🛠️"
            pill="Abiertos"
            pillColor="bg-sky-100 text-sky-700"
          />
          <DashboardCard
            title="Expensas Pendientes"
            value={resumenDashboard.expensasPendientes}
            icon="📑"
            pill="Pendientes"
            pillColor="bg-rose-100 text-rose-700"
          />
        </section>
        {/* CARDS RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* CONTRATO */}
          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e2f3ea] flex items-center justify-center text-xl">📄</div>
            <div>
              <p className="text-xs text-[#4a5a52]">Contrato Activo</p>
              <p className="text-2xl font-bold text-[#1b7c4b]">
                {contratoActivo?.estado ?? "Cargando..."}
              </p>
            </div>
          </div>

          {/* PAGO */}
          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fff2cf] flex items-center justify-center text-xl">💳</div>
            <div>
              <p className="text-xs text-[#4a5a52]">Próximo Pago</p>
              <p className="text-2xl font-bold text-[#f4a000]">
                {proximoPago?.monto ? "$" + proximoPago.monto.toLocaleString() : "---"}
              </p>
            </div>
          </div>

          {/* TICKETS */}
          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ffe7df] flex items-center justify-center text-xl">🔧</div>
            <div>
              <p className="text-xs text-[#4a5a52]">Tickets Abiertos</p>
              <p className="text-2xl font-bold text-[#f59a1b]">{ticketsAbiertos}</p>
            </div>
          </div>

          {/* EXPENSAS */}
          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ffe3e3] flex items-center justify-center text-xl">📊</div>
            <div>
              <p className="text-xs text-[#4a5a52]">Expensas Pendientes</p>
              <p className="text-2xl font-bold text-[#c0392b]">{expensasPendientes}</p>
            </div>
          </div>
        </div>

        {/* Bloque reportar problema */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between px-5 py-4">
        {/* BLOQUE REPORTAR */}
        <div className="bg-[#f4f0e4] border border-[#cfc7b4] rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#123528]">
              Tienes algun problema?
            </p>
            <p className="text-xs text-slate-500">
              Reporta cualquier inconveniente en tu vivienda y lo resolveremos
              pronto.
            </p>
            <p className="text-sm font-semibold text-[#123528]">¿Tienes algún problema?</p>
            <p className="text-sm text-slate-600">Reporta cualquier inconveniente en tu vivienda.</p>
          </div>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold"
            onClick={() => setShowReportModal(true)}
          >
            Reportar Problema
            <span>➕</span> <span>Reportar Problema</span>
          </button>
        </section>

        {/* Mi contrato actual */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 px-5 py-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[#123528] text-sm">
              Mi Contrato Actual
            </h2>
            <button className="text-xs px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100">
        {/* CONTRATO ACTUAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123528]">Mi Contrato Actual</h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Detalle Completo
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <InfoLine label="Fecha Inicio" value={contratoActual.inicio} />
            <InfoLine label="Fecha Fin" value={contratoActual.fin} />
            <InfoLine label="Cuota Mensual" value={contratoActual.cuota} />
            <EstadoBadge estado={contratoActual.estado} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Fecha Inicio</p>
              <p className="font-semibold text-[#123528]">
                {contratoActivo?.fecha_inicio ?? "---"}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Fecha Fin</p>
              <p className="font-semibold text-[#123528]">
                {contratoActivo?.fecha_fin ?? "---"}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Cuota Mensual</p>
              <p className="font-semibold text-[#123528]">
                {contratoActivo?.cuota_mensual
                  ? "$" + contratoActivo.cuota_mensual.toLocaleString()
                  : "---"}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Estado</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#d3f7e8] text-[#1b7c4b]">
                {contratoActivo?.estado ?? "---"}
              </span>
            </div>
          </div>
        </section>

        {/* Proximo pago */}
        <section className="bg-yellow-50 border border-amber-300 rounded-xl shadow-sm mb-6 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#123528]">Proximo Pago</p>
            <p className="text-xs text-slate-500">
              {proximoPago.descripcion}
            </p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-xs rounded-lg font-semibold">
            Pagar Ahora
          </button>
        </section>
        {/* PRÓXIMO PAGO */}
        <div className="bg-[#fff7e3] border-2 border-[#f4b000] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f4b000] flex items-center justify-center">
                <span className="text-2xl text-white">⚠️</span>
              </div>
              <div>
                <p className="font-semibold text-[#123528]">Próximo Pago</p>
                <p className="text-sm text-slate-700">
                  {proximoPago?.fecha ?? "—"} - Vence el {proximoPago?.vencimiento ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-[#123528]">
                {proximoPago?.monto ? "$" + proximoPago.monto.toLocaleString() : "---"}
              </p>
              <button className="px-6 py-2 rounded-lg bg-[#f4b000] text-[#123528] font-semibold text-sm hover:bg-[#e0a000]">
                Pagar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Tickets recientes */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[#123528] text-sm">
              Mis Tickets Recientes
            </span>
            <button className="text-xs px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-100">
        {/* TICKETS RECIENTES */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123528]">Mis Tickets Recientes</h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Todos
            </button>
          </div>

          <div className="space-y-3">
            {ticketsRecientes.map((t) => (
              <TicketItem key={t.id} {...t} />
            ))}
          <div className="space-y-3 text-sm">
            {tickets.slice(0, 3).map((t) => (
              <TicketRow
                key={t.id}
                id={t.codigo}
                desc={t.descripcion}
                fecha={t.fecha}
                estado={t.estado}
                color={t.estado === "Abierto" ? "blue" : "amber"}
              />
            ))}
          </div>
        </section>
      </section>

      {showReportModal && (
        <ReportProblemModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           MODAL REPORTAR PROBLEMA                          */
/* -------------------------------------------------------------------------- */

type ReportProblemModalProps = {
  onClose: () => void;
};

function ReportProblemModal({ onClose }: ReportProblemModalProps) {
/* ----------------- COMPONENTES AUXILIARES ----------------- */

function TicketRow({ id, desc, fecha, estado, color }: any) {
  const base = "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center";
  const styles =
    color === "blue"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#f7f3e8] rounded-xl border border-[#e0d7c5]">
      <div className="flex-1">
        <p className="font-semibold text-[#123528]">
          {id} - {desc}
        </p>
        <p className="text-xs text-slate-600">{fecha}</p>
      </div>
      <span className={`${base} ${styles}`}>{estado}</span>
    </div>
  );
}

/* ----------------- MODAL REPORTAR PROBLEMA ----------------- */
function ReportarProblemaModal({ onClose }: { onClose: () => void }) {
  const [propiedad, setPropiedad] = useState("");
  const [propiedades, setPropiedades] = useState<any[]>([]);

  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<"Baja" | "Media" | "Alta">("Media");
  const [imagenes, setImagenes] = useState<FileList | null>(null);
  const [comentarios, setComentarios] = useState("");

  /** ✔ Carga propiedades reales del inquilino */
  useEffect(() => {
    const loadProps = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        const res = await fetch(
          `http://localhost:3001/propiedad/inquilino/${userId}`
        );
        const data = await res.json();
        setPropiedades(data);
      } catch (e) {
        console.error("Error cargando propiedades:", e);
      }
    };

    loadProps();
  }, []);

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImagenes(e.target.files);
  };

  const handleCrearTicket = () => {
    console.log({
      propiedad,
      descripcion,
      prioridad,
      imagenesCantidad: imagenes?.length ?? 0,
      comentarios,
    });
    onClose();
  /** ✔ ENVÍO REAL AL BACKEND */
  const handleCrear = async () => {
    const form = new FormData();
    const userId = localStorage.getItem("userId");

    form.append("usuarioId", userId || "");
    form.append("descripcion", descripcion);
form.append(
  "prioridad",
  prioridad.startsWith("Alta")
    ? "alta"
    : prioridad.startsWith("Media")
    ? "media"
    : "baja"
);    form.append("propiedadId", propiedad);
    
    imagenes.forEach((file) => form.append("fotos", file)); // ✔ Name correcto para backend

    try {
      await crearTicket(form);
      alert("Ticket creado correctamente");
      onClose();
    } catch (error) {
      console.error("Error creando ticket:", error);
      alert("No se pudo crear el ticket");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-300 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-[#123528]">
            Reportar Problema
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-[#d2ccb9] max-h-[92vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#d2ccb9]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border border-[#f4b000] flex items-center justify-center text-[#f4b000]">⚠️</span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">Reportar Problema</h2>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-black text-xl">✕</button>
        </div>

        {/* body */}
        <div className="px-6 py-4 space-y-4 text-xs md:text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[11px] text-slate-700">
            Describe el problema de forma clara y detallada. Un tecnico sera
            asignado para revisar tu solicitud.
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Propiedad Asociada *
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-[12px]"
              value={propiedad}
              onChange={(e) => setPropiedad(e.target.value)}
            >
              <option value="">Selecciona la propiedad</option>
              <option value="Av. Principal 123, Piso 5">
                Av. Principal 123, Piso 5
              </option>
              <option value="Calle Secundaria 456">
                Calle Secundaria 456
              </option>
            </select>
          </div>
        <div className="px-8 py-6 space-y-6">

          {/* AVISO */}
          <div className="rounded-2xl bg-[#fff4c7] px-6 py-4 text-sm text-[#555222]">
            Describe el problema. Un técnico será asignado para revisarlo.
          </div>

          {/* FORMULARIO */}
          <div className="space-y-5">

            {/* ✔ PROPIEDADES DINÁMICAS */}
            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">Propiedad *</p>

              <select
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700"
                value={propiedad}
                onChange={(e) => setPropiedad(e.target.value)}
              >
                <option value="">Selecciona la propiedad</option>

                {propiedades.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.direccion}
                  </option>
                ))}
              </select>
            </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Descripcion del Problema *
            </label>
            <textarea
              className="w-full min-h-[80px] border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white resize-none"
              placeholder="Describe detalladamente el problema que estas experimentando..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">Descripción *</p>
              <textarea
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700 h-24"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Prioridad *
            </label>
            <div className="flex flex-col gap-1">
              {["Baja", "Media", "Alta"].map((nivel) => (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => setPrioridad(nivel as any)}
                  className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-[11px] ${
                    prioridad === nivel
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  <span>
                    {nivel === "Baja" &&
                      "Baja (Atencion en 72 horas)"}
                    {nivel === "Media" &&
                      "Media (Atencion en 24-48 horas)"}
                    {nivel === "Alta" && "Alta (Atencion inmediata)"}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      prioridad === nivel
                        ? "border-emerald-600 bg-emerald-500"
                        : "border-slate-400 bg-white"
                    }`}
                  />
                </button>
              ))}
            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">Prioridad *</p>
              <select
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option>Alta (Atención inmediata)</option>
                <option>Media (Atención en 24-48 horas)</option>
                <option>Baja (Puede esperar)</option>
              </select>
            </div>
          </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Adjuntar Imagenes (Opcional)
            </label>
            <input
              id="upload-imagenes"
              type="file"
              multiple
              accept="image/*"
              className="w-full text-[11px]"
              onChange={handleFilesChange}
            />
            <p className="text-[10px] text-slate-400">
              Archivos seleccionados: {imagenes?.length ?? 0}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">
              Comentarios Adicionales (Opcional)
            </label>
            <textarea
              className="w-full min-h-[70px] border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white resize-none"
              placeholder="Agrega informacion adicional que consideres relevante..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white rounded-b-xl text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrearTicket}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Crear Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           SUBCOMPONENTES REUTILIZABLES                     */
/* -------------------------------------------------------------------------- */

type DashboardCardProps = {
  title: string;
  value: string;
  icon: string;
  pill: string;
  pillColor: string;
};

function DashboardCard({
  title,
  value,
  icon,
  pill,
  pillColor,
}: DashboardCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-xl font-bold text-[#123528]">{value}</p>
          <span
            className={`px-2 py-[2px] rounded-full text-[10px] font-semibold ${pillColor}`}
          >
            {pill}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="font-semibold text-[#123528] text-sm">{value}</p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">Estado</p>
      <span className="px-3 py-1 rounded-full text-[11px] bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold inline-block mt-1">
        {estado}
      </span>
    </div>
  );
}

type TicketItemProps = {
  id: string;
  descripcion: string;
  fecha: string;
  estado: string;
};

function TicketItem({ id, descripcion, fecha, estado }: TicketItemProps) {
  const color =
    estado === "Abierto"
      ? "text-sky-700 bg-sky-50 border-sky-200"
      : estado === "En proceso"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-slate-700 bg-slate-50 border-slate-200";

  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs md:text-sm">
      <div>
        <p className="font-semibold text-[#123528]">{id}</p>
        <p className="text-slate-600">{descripcion}</p>
        <p className="text-[11px] text-slate-400">{fecha}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${color}`}
      >
        {estado}
      </span>
          {/* ARCHIVOS */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#123528]">Adjuntar imágenes</p>
            <label className="block rounded-2xl border-2 border-[#1e4633] border-dashed bg-white px-4 py-10 text-center text-sm text-[#1e4633] cursor-pointer">
              <input type="file" multiple className="hidden" onChange={handleFiles} />
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">⬆️</span>
                <p>Haz clic para seleccionar imágenes</p>
              </div>
            </label>
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#d2ccb9] mt-4">
            <button onClick={onClose} className="px-5 py-2 rounded-lg border bg-slate-100 hover:bg-slate-200">Cancelar</button>
            <button onClick={handleCrear} className="px-5 py-2 rounded-lg bg-[#4b7f5e] hover:bg-[#3b654d] text-white">Crear Ticket</button>
          </div>

        </div>
      </div>
    </div>
  );
}
