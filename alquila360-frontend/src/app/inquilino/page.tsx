"use client";

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
    <div className="min-h-screen bg-[#f3efe3] flex">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0b3b2c] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wide">ALQUILA 360</h1>
        </div>

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

        <div className="p-4 border-t border-white/10 text-xs">
          <p className="text-slate-300 mb-2">Inquilino</p>
          <button className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-[#164332]">
            <span>↪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-64 flex-1 px-10 py-8">
        {/* HEADER */}
        <header className="mb-6">
          <h2 className="text-3xl font-extrabold text-[#123528]">Mi Dashboard</h2>
          <p className="text-sm text-slate-600">Resumen de tu alquiler</p>
        </header>

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

        {/* BLOQUE REPORTAR */}
        <div className="bg-[#f4f0e4] border border-[#cfc7b4] rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#123528]">¿Tienes algún problema?</p>
            <p className="text-sm text-slate-600">Reporta cualquier inconveniente en tu vivienda.</p>
          </div>
          <button
            onClick={() => setOpenReport(true)}
            className="px-5 py-2 rounded-lg bg-[#4b7f5e] hover:bg-[#3b654d] text-white text-sm font-semibold flex items-center gap-2"
          >
            <span>➕</span> <span>Reportar Problema</span>
          </button>
        </div>

        {/* CONTRATO ACTUAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123528]">Mi Contrato Actual</h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Detalle Completo
            </button>
          </div>
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
        </div>

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

        {/* TICKETS RECIENTES */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123528]">Mis Tickets Recientes</h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Todos
            </button>
          </div>

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
        </div>
      </main>

      {/* MODAL REPORTAR PROBLEMA */}
      {openReport && <ReportarProblemaModal onClose={() => setOpenReport(false)} />}
    </div>
  );
}

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
  const [prioridad, setPrioridad] = useState("Media (Atención en 24-48 horas)");
  const [imagenes, setImagenes] = useState<File[]>([]);
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

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

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

            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">Descripción *</p>
              <textarea
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700 h-24"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

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
