"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function InquilinoDashboard() {
  const [contratoActivo] = useState({
    estado: "Vigente",
    fechaInicio: "31/12/2023",
    fechaFin: "31/12/2024",
    cuotaMensual: 2500,
  });

  const [proximoPago] = useState({
    monto: 2500,
    fecha: "Diciembre 2024",
    vencimiento: "2024-12-10",
  });

  const [tickets] = useState({
    abiertos: 3,
    pendientes: 1,
  });

  // ---- MODAL REPORTAR PROBLEMA ----
  const [openReport, setOpenReport] = useState(false);

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
          <Link
            href="/inquilino/contratos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm"
          >
            <span>📄</span>
            <span>Contrato</span>
          </Link>
          <Link
            href="/inquilino/pagos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm"
          >
            <span>💳</span>
            <span>Pagos</span>
          </Link>
          <Link
            href="/inquilino/ticket"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm"
          >
            <span>🔧</span>
            <span>Tickets</span>
          </Link>
          <Link
            href="/inquilino/expensas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm"
          >
            <span>📊</span>
            <span>Expensas</span>
          </Link>
          <Link
            href="/inquilino/perfil"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#164332] text-sm"
          >
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
          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e2f3ea] flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <p className="text-xs text-[#4a5a52]">Contrato Activo</p>
              <p className="text-2xl font-bold text-[#1b7c4b]">
                {contratoActivo.estado}
              </p>
            </div>
          </div>

          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fff2cf] flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <p className="text-xs text-[#4a5a52]">Próximo Pago</p>
              <p className="text-2xl font-bold text-[#f4a000]">
                ${proximoPago.monto.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ffe7df] flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <p className="text-xs text-[#4a5a52]">Tickets Abiertos</p>
              <p className="text-2xl font-bold text-[#f59a1b]">
                {tickets.abiertos}
              </p>
            </div>
          </div>

          <div className="bg-[#fdfaf3] rounded-2xl p-5 border border-[#d2ccb9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ffe3e3] flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <p className="text-xs text-[#4a5a52]">Expensas Pendientes</p>
              <p className="text-2xl font-bold text-[#c0392b]">
                {tickets.pendientes}
              </p>
            </div>
          </div>
        </div>

        {/* BLOQUE REPORTAR PROBLEMA (verde claro) */}
        <div className="bg-[#f4f0e4] border border-[#cfc7b4] rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#123528]">
              ¿Tienes algún problema?
            </p>
            <p className="text-sm text-slate-600">
              Reporta cualquier inconveniente en tu vivienda y lo resolveremos
              pronto.
            </p>
          </div>
          <button
            onClick={() => setOpenReport(true)}
            className="px-5 py-2 rounded-lg bg-[#4b7f5e] hover:bg-[#3b654d] text-white text-sm font-semibold flex items-center gap-2"
          >
            <span>➕</span>
            <span>Reportar Problema</span>
          </button>
        </div>

        {/* CONTRATO ACTUAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d2ccb9] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123528]">
              Mi Contrato Actual
            </h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Detalle Completo
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Fecha Inicio</p>
              <p className="font-semibold text-[#123528]">
                {contratoActivo.fechaInicio}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Fecha Fin</p>
              <p className="font-semibold text-[#123528]">
                {contratoActivo.fechaFin}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Cuota Mensual</p>
              <p className="font-semibold text-[#123528]">
                ${contratoActivo.cuotaMensual.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Estado</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#d3f7e8] text-[#1b7c4b]">
                {contratoActivo.estado}
              </span>
            </div>
          </div>
        </div>

        {/* PRÓXIMO PAGO IMPORTANTE */}
        <div className="bg-[#fff7e3] border-2 border-[#f4b000] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f4b000] flex items-center justify-center">
                <span className="text-2xl text-white">⚠️</span>
              </div>
              <div>
                <p className="font-semibold text-[#123528]">Próximo Pago</p>
                <p className="text-sm text-slate-700">
                  {proximoPago.fecha} - Vence el {proximoPago.vencimiento}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-[#123528]">
                ${proximoPago.monto.toLocaleString()}
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
            <h3 className="text-lg font-semibold text-[#123528]">
              Mis Tickets Recientes
            </h3>
            <button className="px-4 py-2 rounded-full border border-[#1e4633] text-sm text-[#1e4633] hover:bg-[#f0ece0]">
              Ver Todos
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <TicketRow
              id="TKT-001"
              desc="Fuga de agua en el baño principal"
              fecha="2024-11-18"
              estado="Abierto"
              color="blue"
            />
            <TicketRow
              id="TKT-002"
              desc="La puerta de entrada no cierra correctamente"
              fecha="2024-11-15"
              estado="En proceso"
              color="amber"
            />
            <TicketRow
              id="TKT-003"
              desc="Pintura descascarada en la pared del dormitorio"
              fecha="2024-11-10"
              estado="Abierto"
              color="blue"
            />
          </div>
        </div>
      </main>

      {/* MODAL REPORTAR PROBLEMA */}
      {openReport && <ReportarProblemaModal onClose={() => setOpenReport(false)} />}
    </div>
  );
}

/* ----------------- COMPONENTES AUXILIARES ----------------- */

function TicketRow({
  id,
  desc,
  fecha,
  estado,
  color,
}: {
  id: string;
  desc: string;
  fecha: string;
  estado: "Abierto" | "En proceso";
  color: "blue" | "amber";
}) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center";
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
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("Media (Atención en 24-48 horas)");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [comentarios, setComentarios] = useState("");

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const handleCrear = () => {
    // acá iría la lógica real de envío
    console.log({
      propiedad,
      descripcion,
      prioridad,
      imagenes,
      comentarios,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-[#d2ccb9] max-h-[92vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#d2ccb9]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border border-[#f4b000] flex items-center justify-center text-[#f4b000]">
              ⚠️
            </span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
              Reportar Problema
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* AVISO AMARILLO */}
          <section>
            <div className="rounded-2xl bg-[#fff4c7] px-6 py-4 text-sm text-[#555222]">
              Describe el problema de forma clara y detallada. Un técnico será
              asignado para revisar tu solicitud.
            </div>
          </section>

          {/* PROPIEDAD / DESCRIPCIÓN / PRIORIDAD */}
          <section className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">
                Propiedad Asociada <span className="text-red-500">*</span>
              </p>
              <select
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700"
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

            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">
                Descripción del Problema <span className="text-red-500">*</span>
              </p>
              <textarea
                className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700 h-24"
                placeholder="Describe detalladamente el problema que estás experimentando..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <p className="mt-2 text-xs text-slate-600">
                Incluye ubicación específica, síntomas y cualquier detalle
                relevante.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#123528] mb-1">
                Prioridad <span className="text-red-500">*</span>
              </p>
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
          </section>

          {/* ADJUNTAR IMÁGENES */}
          <section className="space-y-3">
            <p className="text-sm font-semibold text-[#123528]">
              Adjuntar Imágenes (Opcional)
            </p>
            <label className="block rounded-2xl border-2 border-[#1e4633] border-dashed bg-white px-4 py-10 text-center text-sm text-[#1e4633] cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">⬆️</span>
                <p>Haz clic para seleccionar imágenes</p>
                <p className="text-xs text-slate-500">PNG, JPG hasta 5MB</p>
              </div>
            </label>
          </section>

          {/* COMENTARIOS ADICIONALES */}
          <section className="space-y-2">
            <p className="text-sm font-semibold text-[#123528]">
              Comentarios Adicionales (Opcional)
            </p>
            <textarea
              className="w-full rounded-xl bg-[#e3e3e3] px-4 py-3 text-sm text-slate-700 h-20"
              placeholder="Agrega información adicional que consideres relevante..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </section>

          {/* RESUMEN DEL REPORTE */}
          <section className="border border-[#1e4633] rounded-2xl p-4">
            <p className="text-sm font-semibold text-[#123528] mb-3">
              Resumen del Reporte
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <p className="text-slate-600">Estado inicial:</p>
                <p className="font-semibold text-[#123528]">Abierto</p>
              </div>
              <div className="text-right">
                <p className="text-slate-600">Prioridad:</p>
                <p className="font-semibold text-[#f4a000]">
                  {prioridad.startsWith("Alta")
                    ? "Alta"
                    : prioridad.startsWith("Baja")
                    ? "Baja"
                    : "Media"}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Imágenes adjuntas:</p>
                <p className="font-semibold text-[#123528]">
                  {imagenes.length}
                </p>
              </div>
            </div>
          </section>

          {/* NOTA */}
          <section>
            <div className="rounded-2xl bg-[#fff4c7] px-6 py-3 text-xs text-[#555222]">
              <span className="font-semibold">Nota: </span>
              Al crear este ticket, el estado inicial será{" "}
              <span className="font-semibold">“Abierto”</span>. Asegúrate de
              incluir toda la información necesaria para una atención más
              rápida.
            </div>
          </section>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#d2ccb9] mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrear}
              className="px-5 py-2 rounded-lg bg-[#4b7f5e] hover:bg-[#3b654d] text-white text-sm font-semibold"
            >
              Crear Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
