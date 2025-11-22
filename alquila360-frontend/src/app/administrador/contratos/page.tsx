"use client";

import React, { useState } from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador";

const activeLabel = "Contratos";

type EstadoContrato = "Vigente" | "Finalizado";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  propietario: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  montoAlquiler: string;   // solo número, ej: "85000"
  montoGarantia: string;   // solo número
  frecuenciaCobro: string; // Mensual / Trimestral / Anual
  numeroCuotas: string;
  diaVencimiento: string;
  penalidades: string;
  clausulas: string;
  estado: EstadoContrato;
};

const contratosIniciales: Contrato[] = [
  {
    id: "C-001",
    propiedad: "Av. Principal 123, Piso 5",
    inquilino: "María González",
    propietario: "Juan Carlos Martínez",
    fechaInicio: "2024-01-01",
    fechaFin: "2024-12-31",
    montoAlquiler: "85000",
    montoGarantia: "170000",
    frecuenciaCobro: "Mensual",
    numeroCuotas: "12",
    diaVencimiento: "10",
    penalidades:
      "Mora del 2% por día de atraso en el pago. El locatario será responsable de los costos de reparación por daños causados.",
    clausulas:
      "El locatario se compromete a mantener la propiedad en buen estado. No se permiten modificaciones estructurales sin autorización escrita. Los gastos de servicios públicos correrán por cuenta del locatario.",
    estado: "Vigente",
  },
];

function formatearFechaBonita(fecha: string) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatearMoneda(valor: string) {
  if (!valor) return "$0";
  const num = Number(valor);
  if (isNaN(num)) return `$${valor}`;
  return `$${num.toLocaleString("es-AR")}`;
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>(contratosIniciales);

  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(
    null
  );

  const [openFormModal, setOpenFormModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formMode, setFormMode] = useState<"crear" | "editar" | null>(null);

  // --- STATE DEL FORM ---
  const [formPropiedad, setFormPropiedad] = useState("");
  const [formInquilino, setFormInquilino] = useState("");
  const [formPropietario, setFormPropietario] = useState("");

  const [formFechaInicio, setFormFechaInicio] = useState("");
  const [formFechaFin, setFormFechaFin] = useState("");

  const [formMontoAlquiler, setFormMontoAlquiler] = useState("85000");
  const [formMontoGarantia, setFormMontoGarantia] = useState("170000");

  const [formFrecuenciaCobro, setFormFrecuenciaCobro] = useState("Mensual");
  const [formNumeroCuotas, setFormNumeroCuotas] = useState("12");
  const [formDiaVencimiento, setFormDiaVencimiento] = useState("10");

  const [formPenalidades, setFormPenalidades] = useState(
    "Ej: Mora del 2% por día de atraso. Costo de reparaciones por daños..."
  );
  const [formClausulas, setFormClausulas] = useState(
    "Agregue cualquier cláusula adicional del contrato..."
  );

  // ---- HELPERS PARA FORM ----
  const resetForm = () => {
    setFormPropiedad("");
    setFormInquilino("");
    setFormPropietario("");
    setFormFechaInicio("");
    setFormFechaFin("");
    setFormMontoAlquiler("85000");
    setFormMontoGarantia("170000");
    setFormFrecuenciaCobro("Mensual");
    setFormNumeroCuotas("12");
    setFormDiaVencimiento("10");
    setFormPenalidades(
      "Ej: Mora del 2% por día de atraso. Costo de reparaciones por daños..."
    );
    setFormClausulas(
      "Agregue cualquier cláusula adicional del contrato..."
    );
  };

  const cargarFormDesdeContrato = (c: Contrato) => {
    setFormPropiedad(c.propiedad);
    setFormInquilino(c.inquilino);
    setFormPropietario(c.propietario);
    setFormFechaInicio(c.fechaInicio);
    setFormFechaFin(c.fechaFin);
    setFormMontoAlquiler(c.montoAlquiler);
    setFormMontoGarantia(c.montoGarantia);
    setFormFrecuenciaCobro(c.frecuenciaCobro);
    setFormNumeroCuotas(c.numeroCuotas);
    setFormDiaVencimiento(c.diaVencimiento);
    setFormPenalidades(c.penalidades);
    setFormClausulas(c.clausulas);
  };

  // ---- ABRIR / CERRAR MODALES ----
  const abrirModalNuevo = () => {
    setFormMode("crear");
    setSelectedContrato(null);
    resetForm();
    setOpenFormModal(true);
  };

  const abrirModalVer = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setOpenViewModal(true);
  };

  const cerrarModalForm = () => {
    setOpenFormModal(false);
    setFormMode(null);
  };

  const cerrarModalVer = () => {
    setOpenViewModal(false);
  };

  const abrirEditorDesdeVista = () => {
    if (!selectedContrato) return;
    setFormMode("editar");
    cargarFormDesdeContrato(selectedContrato);
    setOpenViewModal(false);
    setOpenFormModal(true);
  };

  // ---- GUARDAR CONTRATO (CREAR / EDITAR) ----
  const guardarContrato = () => {
    if (!formPropiedad || !formInquilino) {
      alert("Completa al menos Propiedad e Inquilino para guardar el contrato.");
      return;
    }

    if (formMode === "crear") {
      const nextNumber = contratos.length + 1;
      const nuevoId = `C-${String(nextNumber).padStart(3, "0")}`;

      const nuevoContrato: Contrato = {
        id: nuevoId,
        propiedad: formPropiedad,
        inquilino: formInquilino,
        propietario: formPropietario || "Propietario sin definir",
        fechaInicio: formFechaInicio,
        fechaFin: formFechaFin,
        montoAlquiler: formMontoAlquiler,
        montoGarantia: formMontoGarantia,
        frecuenciaCobro: formFrecuenciaCobro,
        numeroCuotas: formNumeroCuotas,
        diaVencimiento: formDiaVencimiento,
        penalidades: formPenalidades,
        clausulas: formClausulas,
        estado: "Vigente",
      };

      setContratos((prev) => [...prev, nuevoContrato]);
      setSelectedContrato(nuevoContrato);
    }

    if (formMode === "editar" && selectedContrato) {
      const actualizado: Contrato = {
        ...selectedContrato,
        propiedad: formPropiedad,
        inquilino: formInquilino,
        propietario: formPropietario,
        fechaInicio: formFechaInicio,
        fechaFin: formFechaFin,
        montoAlquiler: formMontoAlquiler,
        montoGarantia: formMontoGarantia,
        frecuenciaCobro: formFrecuenciaCobro,
        numeroCuotas: formNumeroCuotas,
        diaVencimiento: formDiaVencimiento,
        penalidades: formPenalidades,
        clausulas: formClausulas,
      };

      setContratos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
      setSelectedContrato(actualizado);
    }

    setOpenFormModal(false);
    setFormMode(null);
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4flex justify-between items-start flex mb-4 justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Contratos
            </h1>
            <p className="text-sm text-slate-500">
              Historial de contratos de alquiler
            </p>
          </div>

          <button
            onClick={abrirModalNuevo}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Nuevo Contrato
          </button>
        </header>

        {/* TABLA CONTRATOS VIGENTES */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">N°</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Inquilino</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Fecha Fin</th>
                <th className="p-3">Cuota Mensual</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.propiedad}</td>
                  <td className="p-3">{c.inquilino}</td>
                  <td className="p-3">{formatearFechaBonita(c.fechaInicio)}</td>
                  <td className="p-3">{formatearFechaBonita(c.fechaFin)}</td>
                  <td className="p-3">{formatearMoneda(c.montoAlquiler)}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModalVer(c)}
                        className="px-3 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200"
                      >
                        👁️
                      </button>
                      <button className="px-3 py-1 rounded-lg text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                        Renovar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contratos.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-400">
                    No hay contratos vigentes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* HISTORIAL CONTRATOS FINALIZADOS */}
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-[#123528] mb-2">
            Historial de Contratos Finalizados
          </h2>
          <p className="text-sm text-slate-500">
            No hay contratos finalizados para mostrar.
          </p>
        </div>
      </section>

      {/* MODAL VER CONTRATO (👁️) */}
      {openViewModal && selectedContrato && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-8">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-slate-500">Contrato de Alquiler</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#123528] text-center md:text-left">
                  CONTRATO DE LOCACIÓN
                </h2>
              </div>
              <button
                onClick={cerrarModalVer}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* NUMERO CONTRATO */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <span>📄</span>
                <span>Contrato N° {selectedContrato.id}</span>
              </div>
            </div>

            {/* PARTES DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">
                PARTES DEL CONTRATO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Locador */}
                <div className="border border-emerald-900/40 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">
                    👤 LOCADOR (Propietario)
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedContrato.propietario}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    DNI: 28.456.789
                    <br />
                    propietario@example.com
                  </p>
                </div>

                {/* Locatario */}
                <div className="border border-emerald-900/40 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">
                    👤 LOCATARIO (Inquilino)
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedContrato.inquilino}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    DNI: 32.654.987
                    <br />
                    inquilino@example.com
                  </p>
                </div>
              </div>
            </section>

            {/* INMUEBLE */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">INMUEBLE</h3>
              <div className="rounded-2xl bg-[#f9f3e7] px-4 py-3 border border-emerald-900/30">
                <p className="font-semibold text-amber-800 flex items-center gap-2 mb-1">
                  <span>🏠</span> Dirección de la Propiedad
                </p>
                <p className="text-slate-800">{selectedContrato.propiedad}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Tipo: Casa · Superficie: 120 m² · Ambientes: 3
                </p>
              </div>
            </section>

            {/* PLAZO DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">
                PLAZO DEL CONTRATO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-900/40 rounded-2xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    📅 Fecha de Inicio
                  </p>
                  <p className="text-slate-800">
                    {formatearFechaBonita(selectedContrato.fechaInicio)}
                  </p>
                </div>
                <div className="border border-emerald-900/40 rounded-2xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    📅 Fecha de Finalización
                  </p>
                  <p className="text-slate-800">
                    {formatearFechaBonita(selectedContrato.fechaFin)}
                  </p>
                </div>
              </div>
            </section>

            {/* CONDICIONES ECONÓMICAS */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">
                CONDICIONES ECONÓMICAS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#f9f3e7] px-4 py-3 border border-emerald-900/20">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    💲 Alquiler Mensual
                  </p>
                  <p className="text-2xl font-bold text-[#123528]">
                    {formatearMoneda(selectedContrato.montoAlquiler)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f9f3e7] px-4 py-3 border border-emerald-900/20">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    💲 Garantía
                  </p>
                  <p className="text-2xl font-bold text-[#123528]">
                    {formatearMoneda(selectedContrato.montoGarantia)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f9f3e7] px-4 py-3 border border-emerald-900/20">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Vencimiento
                  </p>
                  <p className="text-xl font-semibold text-[#123528]">
                    Día {selectedContrato.diaVencimiento}
                  </p>
                </div>
              </div>
            </section>

            {/* DETALLE DE CUOTAS */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">
                DETALLE DE CUOTAS
              </h3>
              <div className="border border-emerald-900/40 rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Frecuencia
                    </p>
                    <p className="text-slate-800">
                      {selectedContrato.frecuenciaCobro}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Número de Cuotas
                    </p>
                    <p className="text-slate-800">
                      {selectedContrato.numeroCuotas} cuotas
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Valor por Cuota
                    </p>
                    <p className="text-slate-800">
                      {formatearMoneda(selectedContrato.montoAlquiler)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 text-center mt-2">
                  Todas las cuotas tendrán el mismo valor mensual sin
                  variación.
                </p>
              </div>
            </section>

            {/* PENALIDADES */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">PENALIDADES</h3>
              <div className="border border-emerald-900/40 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-line">
                {selectedContrato.penalidades}
              </div>
            </section>

            {/* CLAUSULAS ADICIONALES */}
            <section className="mb-6">
              <h3 className="font-semibold text-[#123528] mb-3">
                CLÁUSULAS ADICIONALES
              </h3>
              <div className="border border-emerald-900/40 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-line">
                {selectedContrato.clausulas}
              </div>
            </section>

            {/* FIRMAS */}
            <section className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div className="text-center">
                  <div className="border-t border-slate-300 pt-4">
                    <p className="font-semibold text-[#123528]">
                      {selectedContrato.propietario}
                    </p>
                    <p className="text-sm text-slate-600">Firma del Locador</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-300 pt-4">
                    <p className="font-semibold text-[#123528]">
                      {selectedContrato.inquilino}
                    </p>
                    <p className="text-sm text-slate-600">
                      Firma del Locatario
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* BOTONES ABAJO */}
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium">
                Imprimir
              </button>
              <button
                onClick={abrirEditorDesdeVista}
                className="px-4 py-2 rounded-lg border border-emerald-500 bg-white hover:bg-emerald-50 text-sm font-medium text-emerald-700"
              >
                Editar
              </button>
              <button
                onClick={cerrarModalVer}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO (CREAR / EDITAR) */}
      {openFormModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-6">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
            {/* HEADER MODAL */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                {formMode === "editar"
                  ? "Editar Contrato"
                  : "Crear Nuevo Contrato"}
              </h2>
              <button
                onClick={cerrarModalForm}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* PARTES DEL CONTRATO */}
            <section className="mb-6 border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
              <h3 className="font-semibold text-[#123528] text-lg mb-1">
                Partes del Contrato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Propiedad
                  </p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formPropiedad}
                    onChange={(e) => setFormPropiedad(e.target.value)}
                  >
                    <option value="">Seleccionar propiedad</option>
                    <option>Av. Principal 123, Piso 5</option>
                    <option>Calle Secundaria 456</option>
                    <option>Plaza Central 789, Apto 12</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Inquilino
                  </p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formInquilino}
                    onChange={(e) => setFormInquilino(e.target.value)}
                  >
                    <option value="">Seleccionar inquilino</option>
                    <option>María González</option>
                    <option>Carlos Rodríguez</option>
                    <option>Ana Martínez</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Propietario
                  </p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formPropietario}
                    onChange={(e) => setFormPropietario(e.target.value)}
                  >
                    <option value="">Seleccionar propietario</option>
                    <option>Juan Carlos Martínez</option>
                    <option>Empresa Inmobiliaria SRL</option>
                  </select>
                </div>
              </div>
            </section>

            {/* DURACIÓN DEL CONTRATO */}
            <section className="mb-6 border border-emerald-900/40 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-[#123528] text-lg">
                Duración del Contrato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Fecha de Inicio
                  </p>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formFechaInicio}
                    onChange={(e) => setFormFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Fecha de Finalización
                  </p>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formFechaFin}
                    onChange={(e) => setFormFechaFin(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* INFORMACIÓN FINANCIERA */}
            <section className="mb-6 border border-emerald-900/40 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-[#123528] text-lg">
                Información Financiera
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Monto del Alquiler ($/mes)
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formMontoAlquiler}
                    onChange={(e) => setFormMontoAlquiler(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Monto de la Garantía ($)
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formMontoGarantia}
                    onChange={(e) => setFormMontoGarantia(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* DETALLE DE CUOTAS */}
            <section className="mb-6 border border-emerald-900/40 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-[#123528] text-lg">
                Detalle de Cuotas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Frecuencia de Cobro
                  </p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formFrecuenciaCobro}
                    onChange={(e) => setFormFrecuenciaCobro(e.target.value)}
                  >
                    <option>Mensual</option>
                    <option>Trimestral</option>
                    <option>Anual</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Número de Cuotas
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formNumeroCuotas}
                    onChange={(e) => setFormNumeroCuotas(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Día de Vencimiento
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formDiaVencimiento}
                    onChange={(e) => setFormDiaVencimiento(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Nota: Todas las cuotas tendrán el mismo valor mensual.
              </p>
            </section>

            {/* PENALIDADES */}
            <section className="mb-6 space-y-3">
              <h3 className="font-semibold text-[#123528] text-lg">
                Penalidades por Incumplimiento
              </h3>
              <textarea
                className="w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-20"
                value={formPenalidades}
                onChange={(e) => setFormPenalidades(e.target.value)}
              />
            </section>

            {/* CLÁUSULAS ADICIONALES */}
            <section className="mb-6 space-y-3">
              <h3 className="font-semibold text-[#123528] text-lg">
                Cláusulas Adicionales
              </h3>
              <textarea
                className="w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-20"
                value={formClausulas}
                onChange={(e) => setFormClausulas(e.target.value)}
              />
            </section>

            {/* BOTONES FINALES */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={cerrarModalForm}
                className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardarContrato}
                className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold"
              >
                Guardar Contrato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
