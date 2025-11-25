"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../../components/sideBarPropietario";
import {
  contratoService,
  PropiedadBackend,
  InquilinoBackend,
} from "../../../services/ContratoService";

type EstadoContrato = "Vigente" | "Finalizado";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  propietario: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  montoAlquiler: string; // solo número, ej: "85000"
  montoGarantia: string; // solo número
  frecuenciaCobro: string; // Mensual / Trimestral / Anual
  numeroCuotas: string;
  diaVencimiento: string;
  penalidades: string;
  clausulasAdicionales: string;
  estado: EstadoContrato;
};

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

const contratosIniciales: Contrato[] = [];

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>(contratosIniciales);

  // Datos desde backend
  const [propiedades, setPropiedades] = useState<PropiedadBackend[]>([]);
  const [inquilinos, setInquilinos] = useState<InquilinoBackend[]>([]);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [errorDatos, setErrorDatos] = useState<string | null>(null);

  // Modal crear contrato
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal ver contrato
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] =
    useState<Contrato | null>(null);

  // Modal editar contrato
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [idEditando, setIdEditando] = useState<string | null>(null);

  // Modal renovar contrato
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [contratoARenovar, setContratoARenovar] = useState<Contrato | null>(
    null
  );

  // Estado del formulario (crear / editar)
  const [nuevoContrato, setNuevoContrato] = useState({
    propiedad: "",
    inquilino: "",
    propietario: "",
    fechaInicio: "",
    fechaFin: "",
    montoAlquiler: "",
    montoGarantia: "",
    frecuenciaCobro: "Mensual",
    numeroCuotas: "",
    diaVencimiento: "",
    penalidades: "",
    clausulasAdicionales: "",
  });

  // Estado formulario de renovación
  const [datosRenovacion, setDatosRenovacion] = useState({
    nuevaFechaInicio: "",
    nuevaFechaFin: "",
    nuevoMontoAlquiler: "",
    nuevaGarantia: "",
    frecuenciaCobro: "Mensual",
    numeroCuotas: "",
    diaVencimiento: "",
    condicionesRenovacion: "",
    observaciones: "",
  });

  // ===== CARGA DE PROPIEDADES E INQUILINOS DESDE BACKEND =====
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingDatos(true);
        setErrorDatos(null);

        const [propiedadesData, inquilinosData] = await Promise.all([
          contratoService.getPropiedadesDisponibles(),
          contratoService.getInquilinos(),
        ]);

        const propiedadesArray = Array.isArray(propiedadesData)
          ? (propiedadesData as PropiedadBackend[])
          : [];
        const inquilinosArray = Array.isArray(inquilinosData)
          ? (inquilinosData as InquilinoBackend[])
          : [];

        setPropiedades(propiedadesArray);
        setInquilinos(inquilinosArray);
      } catch (err: any) {
        setErrorDatos(err.message || "Error cargando datos del backend");
      } finally {
        setLoadingDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const resetForm = () => {
    setNuevoContrato({
      propiedad: "",
      inquilino: "",
      propietario: "",
      fechaInicio: "",
      fechaFin: "",
      montoAlquiler: "",
      montoGarantia: "",
      frecuenciaCobro: "Mensual",
      numeroCuotas: "",
      diaVencimiento: "",
      penalidades: "",
      clausulasAdicionales: "",
    });
  };

  const resetRenovacion = () => {
    setDatosRenovacion({
      nuevaFechaInicio: "",
      nuevaFechaFin: "",
      nuevoMontoAlquiler: "",
      nuevaGarantia: "",
      frecuenciaCobro: "Mensual",
      numeroCuotas: "",
      diaVencimiento: "",
      condicionesRenovacion: "",
      observaciones: "",
    });
  };

  // ---------- MODAL NUEVO CONTRATO ----------
  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Si cambia la propiedad, auto-completamos propietario
    if (name === "propiedad") {
      const propiedadSel = propiedades.find((p) => p.direccion === value);
      let propietarioNombre = "";

      if (propiedadSel && (propiedadSel as any).propietario) {
        const propObj = (propiedadSel as any).propietario;
        propietarioNombre = `${propObj.nombre} ${propObj.apellido}`;
      }

      setNuevoContrato((prev) => ({
        ...prev,
        propiedad: value,
        propietario: propietarioNombre,
      }));
      return;
    }

    setNuevoContrato((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nuevoId = `C-${String(contratos.length + 1).padStart(3, "0")}`;

    const contratoAInsertar: Contrato = {
      id: nuevoId,
      propiedad: nuevoContrato.propiedad,
      inquilino: nuevoContrato.inquilino,
      propietario: nuevoContrato.propietario,
      fechaInicio: nuevoContrato.fechaInicio,
      fechaFin: nuevoContrato.fechaFin,
      montoAlquiler: nuevoContrato.montoAlquiler || "0",
      montoGarantia: nuevoContrato.montoGarantia || "0",
      frecuenciaCobro: nuevoContrato.frecuenciaCobro,
      numeroCuotas: nuevoContrato.numeroCuotas || "0",
      diaVencimiento: nuevoContrato.diaVencimiento,
      penalidades: nuevoContrato.penalidades,
      clausulasAdicionales: nuevoContrato.clausulasAdicionales,
      estado: "Vigente",
    };

    setContratos((prev) => [...prev, contratoAInsertar]);
    setIsModalOpen(false);
    resetForm();
  };

  // ---------- MODAL VER CONTRATO ----------
  const handleVerContrato = (contrato: Contrato) => {
    setContratoSeleccionado(contrato);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setContratoSeleccionado(null);
  };

  // ---------- MODAL EDITAR CONTRATO ----------
  const handleOpenEdit = (contrato: Contrato) => {
    setNuevoContrato({
      propiedad: contrato.propiedad,
      inquilino: contrato.inquilino,
      propietario: contrato.propietario,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin,
      montoAlquiler: contrato.montoAlquiler,
      montoGarantia: contrato.montoGarantia,
      frecuenciaCobro: contrato.frecuenciaCobro,
      numeroCuotas: contrato.numeroCuotas,
      diaVencimiento: contrato.diaVencimiento,
      penalidades: contrato.penalidades,
      clausulasAdicionales: contrato.clausulasAdicionales,
    });

    setIdEditando(contrato.id);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setIdEditando(null);
  };

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!idEditando) return;

    setContratos((prev) =>
      prev.map((c) =>
        c.id === idEditando
          ? {
              ...c,
              propiedad: nuevoContrato.propiedad || c.propiedad,
              inquilino: nuevoContrato.inquilino || c.inquilino,
              propietario: nuevoContrato.propietario || c.propietario,
              fechaInicio: nuevoContrato.fechaInicio || c.fechaInicio,
              fechaFin: nuevoContrato.fechaFin || c.fechaFin,
              montoAlquiler: nuevoContrato.montoAlquiler || c.montoAlquiler,
              montoGarantia: nuevoContrato.montoGarantia || c.montoGarantia,
              frecuenciaCobro:
                nuevoContrato.frecuenciaCobro || c.frecuenciaCobro,
              numeroCuotas: nuevoContrato.numeroCuotas || c.numeroCuotas,
              diaVencimiento: nuevoContrato.diaVencimiento || c.diaVencimiento,
              penalidades: nuevoContrato.penalidades || c.penalidades,
              clausulasAdicionales:
                nuevoContrato.clausulasAdicionales || c.clausulasAdicionales,
            }
          : c
      )
    );

    setIsEditOpen(false);
    setIdEditando(null);
  };

  // ---------- MODAL RENOVAR CONTRATO ----------
  const handleOpenRenew = (contrato: Contrato) => {
    setContratoARenovar(contrato);
    setDatosRenovacion({
      nuevaFechaInicio: "",
      nuevaFechaFin: "",
      nuevoMontoAlquiler: contrato.montoAlquiler,
      nuevaGarantia: contrato.montoGarantia,
      frecuenciaCobro: contrato.frecuenciaCobro || "Mensual",
      numeroCuotas: contrato.numeroCuotas || "",
      diaVencimiento: contrato.diaVencimiento || "",
      condicionesRenovacion: "",
      observaciones: "",
    });
    setIsRenewOpen(true);
  };

  const handleCloseRenew = () => {
    setIsRenewOpen(false);
    setContratoARenovar(null);
    resetRenovacion();
  };

  const handleChangeRenovacion = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDatosRenovacion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRenew = (e: FormEvent) => {
    e.preventDefault();
    if (!contratoARenovar) return;

    const {
      nuevaFechaInicio,
      nuevaFechaFin,
      nuevoMontoAlquiler,
      nuevaGarantia,
    } = datosRenovacion;

    setContratos((prev) =>
      prev.map((c) =>
        c.id === contratoARenovar.id
          ? {
              ...c,
              fechaInicio: nuevaFechaInicio || c.fechaInicio,
              fechaFin: nuevaFechaFin || c.fechaFin,
              montoAlquiler: nuevoMontoAlquiler || c.montoAlquiler,
              montoGarantia: nuevaGarantia || c.montoGarantia,
              frecuenciaCobro:
                datosRenovacion.frecuenciaCobro || c.frecuenciaCobro,
              numeroCuotas: datosRenovacion.numeroCuotas || c.numeroCuotas,
              diaVencimiento:
                datosRenovacion.diaVencimiento || c.diaVencimiento,
            }
          : c
      )
    );

    handleCloseRenew();
  };

  // Cálculos resumen renovación
  const montoAnteriorLimpio = contratoARenovar
    ? contratoARenovar.montoAlquiler || "0"
    : "0";

  const montoNuevoNum = Number(
    datosRenovacion.nuevoMontoAlquiler || montoAnteriorLimpio || "0"
  );
  const cuotasNum = Number(datosRenovacion.numeroCuotas || "0");
  const totalContrato = montoNuevoNum * cuotasNum;

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Título */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Contratos</h2>
            <p className="text-sm text-gray-600">
              Historial de contratos de alquiler
            </p>
            {loadingDatos && (
              <p className="text-xs text-gray-500 mt-1">
                Cargando propiedades e inquilinos...
              </p>
            )}
            {errorDatos && (
              <p className="text-xs text-red-600 mt-1">Error: {errorDatos}</p>
            )}
          </div>

          {/* Botón Nuevo Contrato */}
          <button
            onClick={handleOpenModal}
            className="bg-[#f4b000] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#d89c00] transition"
          >
            Nuevo Contrato
          </button>
        </header>

        {/* TABLA CONTRATOS VIGENTES */}
        <section className="mb-10">
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Propiedad</th>
                  <th className="py-4 px-4">Inquilino</th>
                  <th className="py-4 px-4">Fecha Inicio</th>
                  <th className="py-4 px-4">Fecha Fin</th>
                  <th className="py-4 px-4">Cuota Mensual</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {contratos.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">{c.id}</td>
                    <td className="py-3 px-4 text-sm">{c.propiedad}</td>
                    <td className="py-3 px-4 text-sm">{c.inquilino}</td>
                    <td className="py-3 px-4 text-sm">
                      {formatearFechaBonita(c.fechaInicio)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatearFechaBonita(c.fechaFin)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      {formatearMoneda(c.montoAlquiler)}
                    </td>

                    {/* ESTADO */}
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-[#d3f7e8] text-[#1b7c4b]">
                        {c.estado}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleVerContrato(c)}
                        className="border border-[#15352b] rounded-lg p-2 hover:bg-gray-100 transition"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleOpenRenew(c)}
                        className="border border-[#15352b] rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Renovar
                      </button>
                    </td>
                  </tr>
                ))}
                {contratos.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-4 px-4 text-sm text-center text-gray-500"
                    >
                      No hay contratos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* HISTORIAL DE CONTRATOS FINALIZADOS */}
        <section>
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-7 py-6">
            <h3 className="text-lg font-semibold mb-3">
              Historial de Contratos Finalizados
            </h3>

            <p className="text-sm text-gray-600">
              No hay contratos finalizados para mostrar.
            </p>
          </div>
        </section>
      </main>

      {/* ========= MODAL NUEVO CONTRATO ========= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">
            {/* Header modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Crear Nuevo Contrato</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PARTES DEL CONTRATO */}
              <section className="mb-6 border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg mb-1">
                  Partes del Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Propiedad - DINÁMICO */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propiedad *
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      name="propiedad"
                      value={nuevoContrato.propiedad}
                      onChange={handleChange}
                      disabled={loadingDatos}

                      required
                    >
                      <option value="">
                        {loadingDatos
                          ? "Cargando propiedades..."
                          : "Seleccionar propiedad"}
                      </option>
                      {propiedades.map((propiedad) => (
                        <option
                          key={propiedad.id}
                          value={propiedad.direccion}
                        >
                          {propiedad.direccion} - {propiedad.tipo}
                        </option>
                      ))}
                    </select>
                    {propiedades.length === 0 && !loadingDatos && (
                      <p className="text-xs text-red-500 mt-1">
                        No hay propiedades disponibles
                      </p>
                    )}
                  </div>

                  {/* Inquilino - DINÁMICO */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Inquilino *
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      name="inquilino"
                      value={nuevoContrato.inquilino}
                      onChange={handleChange}
                      disabled={loadingDatos}
                      required
                    >
                      <option value="">
                        {loadingDatos
                          ? "Cargando inquilinos..."
                          : "Seleccionar inquilino"}
                      </option>
                      {inquilinos.map((inquilino) => (
                        <option
                          key={inquilino.id}
                          value={`${inquilino.nombre} ${inquilino.apellido}`}
                        >
                          {inquilino.nombre} {inquilino.apellido}
                        </option>
                      ))}
                    </select>
                    {inquilinos.length === 0 && !loadingDatos && (
                      <p className="text-xs text-red-500 mt-1">
                        No hay inquilinos disponibles
                      </p>
                    )}
                  </div>

                  {/* Propietario (auto-completado) */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propietario
                    </p>
                    <input
                      type="text"
                      name="propietario"
                      value={nuevoContrato.propietario}
                      readOnly
                      placeholder="Se auto-completa al seleccionar propiedad"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm text-gray-500"
                    />
                  </div>
                </div>
              </section>

              {/* Duración del Contrato */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Duración del Contrato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={nuevoContrato.fechaInicio}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Fecha de Finalización{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={nuevoContrato.fechaFin}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>
              </section>

              {/* Información Financiera */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Información Financiera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Monto del Alquiler ($/mes){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="montoAlquiler"
                      value={nuevoContrato.montoAlquiler}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                  
                </div>
              </section>

             

              {/* CLÁUSULAS ADICIONALES (modelo fijo de lectura) */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cláusulas Adicionales</h3>

                <div className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-700 whitespace-pre-line">
                  {`1. El inquilino se compromete a pagar el monto mensual acordado en la fecha establecida.
2. El propietario se compromete a mantener la propiedad en condiciones habitables.
3. Cualquier daño a la propiedad será responsabilidad del inquilino, salvo desgaste por uso normal.
4. El contrato podrá ser renovado previo acuerdo entre ambas partes.
5. Cualquier disputa será resuelta conforme a las leyes vigentes.`}
                </div>
              </section>

              {/* Botones del modal */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#f4b000] text-white hover:bg-[#d89c00] transition"
                >
                  Guardar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========= MODAL VER CONTRATO ========= */}
      {isViewOpen && contratoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contrato de Alquiler</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={handleCloseView}
              >
                ×
              </button>
            </div>
            <hr className="border-[#315c47] mb-6" />

            {/* Título central */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold tracking-wide">
                CONTRATO DE LOCACIÓN
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Sistema de Gestión ALQUILA 360
              </p>
              <p className="mt-2 text-sm text-[#c9904a] flex items-center justify-center gap-2">
                <span>📄</span> Contrato N° {contratoSeleccionado.id}
              </p>
            </div>

            {/* PARTES DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                PARTES DEL CONTRATO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-xs font-semibold text-[#7aa278] mb-1">
                    👤 LOCADOR (Propietario)
                  </p>
                  <p className="font-semibold">
                    {contratoSeleccionado.propietario || "Propietario"}
                  </p>
                </div>
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-xs font-semibold text-[#7aa278] mb-1">
                    👤 LOCATARIO (Inquilino)
                  </p>
                  <p className="font-semibold">
                    {contratoSeleccionado.inquilino}
                  </p>
                </div>
              </div>
            </section>

            {/* INMUEBLE */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                INMUEBLE
              </h3>
              <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4 border border-[#e6dccb]">
                <p className="text-[#c9904a] text-sm font-semibold mb-1 flex items-center gap-2">
                  🏠 Dirección de la Propiedad
                </p>
                <p className="font-semibold mb-1">
                  {contratoSeleccionado.propiedad}
                </p>
              </div>
            </section>

            {/* PLAZO DEL CONTRATO */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                PLAZO DEL CONTRATO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                    📅 Fecha de Inicio
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatearFechaBonita(contratoSeleccionado.fechaInicio)}
                  </p>
                </div>
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                    📅 Fecha de Finalización
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatearFechaBonita(contratoSeleccionado.fechaFin)}
                  </p>
                </div>
              </div>
            </section>

            {/* CONDICIONES ECONÓMICAS */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                CONDICIONES ECONÓMICAS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                    💲 Alquiler Mensual
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatearMoneda(contratoSeleccionado.montoAlquiler)}
                  </p>
                </div>
                <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                    💲 Garantía
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatearMoneda(contratoSeleccionado.montoGarantia)}
                  </p>
                </div>
                <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold mb-1">Vencimiento</p>
                  <p className="text-xl font-semibold">
                    {contratoSeleccionado.diaVencimiento || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* DETALLE DE CUOTAS */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                DETALLE DE CUOTAS
              </h3>
              <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 text-center mb-3">
                  <div>
                    <p className="text-sm font-semibold">Frecuencia</p>
                    <p className="text-sm text-gray-700">
                      {contratoSeleccionado.frecuenciaCobro}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Número de Cuotas</p>
                    <p className="text-sm text-gray-700">
                      {contratoSeleccionado.numeroCuotas || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Valor por Cuota</p>
                    <p className="text-sm text-gray-700">
                      {formatearMoneda(contratoSeleccionado.montoAlquiler)}
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-700">
                  Todas las cuotas tendrán el mismo valor mensual sin variación,
                  según lo acordado por las partes.
                </p>
              </div>
            </section>

            {/* PENALIDADES */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                PENALIDADES
              </h3>
              <div className="border border-[#315c47] rounded-2xl px-5 py-4 text-sm text-gray-800">
                {contratoSeleccionado.penalidades
                  ? contratoSeleccionado.penalidades
                  : "Las penalidades por incumplimiento se regirán por lo que las partes acuerden expresamente en el contrato."}
              </div>
            </section>

            {/* CLÁUSULAS ADICIONALES */}
            <section className="mb-10">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                CLÁUSULAS ADICIONALES
              </h3>
              <div className="border border-[#315c47] rounded-2xl px-5 py-4 text-sm text-gray-800 whitespace-pre-line">
                {contratoSeleccionado.clausulasAdicionales ||
                  `1. El inquilino se compromete a pagar el monto mensual acordado en la fecha establecida.
2. El propietario se compromete a mantener la propiedad en condiciones habitables.
3. Cualquier daño a la propiedad será responsabilidad del inquilino, salvo desgaste por uso normal.
4. El contrato podrá ser renovado previo acuerdo entre ambas partes.
5. Cualquier disputa será resuelta conforme a las leyes vigentes.`}
              </div>
            </section>

            {/* FIRMAS */}
            <section className="mb-8">
              <hr className="border-[#d7cec0] mb-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                <div>
                  <div className="border-t border-[#d7cec0] pt-4" />
                  <p className="font-semibold">
                    {contratoSeleccionado.propietario || "____________________"}
                  </p>
                  <p className="text-sm text-gray-700">Firma del Locador</p>
                </div>
                <div>
                  <div className="border-t border-[#d7cec0] pt-4" />
                  <p className="font-semibold">
                    {contratoSeleccionado.inquilino}
                  </p>
                  <p className="text-sm text-gray-700">Firma del Locatario</p>
                </div>
              </div>
            </section>

            {/* Botones finales */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-5 py-2 rounded-lg border border-[#315c47] text-[#315c47] hover:bg-gray-100 transition">
                Imprimir
              </button>
              <button
                onClick={() =>
                  contratoSeleccionado && handleOpenEdit(contratoSeleccionado)
                }
                className="px-5 py-2 rounded-lg border border-[#315c47] text-[#315c47] hover:bg-gray-100 transition"
              >
                Editar
              </button>
              <button
                onClick={handleCloseView}
                className="px-5 py-2 rounded-lg bg-[#f4b000] text-white hover:bg-[#d89c00] transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========= MODAL EDITAR CONTRATO ========= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">
            {/* Header modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Editar Contrato</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={handleCloseEdit}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-6">
              {/* PARTES DEL CONTRATO */}
              <section className="mb-6 border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
                <h3 className="font-semibold text-[#123528] text-lg mb-1">
                  Partes del Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Propiedad - DINÁMICO */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propiedad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      name="propiedad"
                      value={nuevoContrato.propiedad}
                      onChange={handleChange}
                      disabled={loadingDatos || !!errorDatos}
                    >
                      <option value="">
                        {loadingDatos
                          ? "Cargando propiedades..."
                          : "Seleccionar propiedad"}
                      </option>
                      {propiedades.map((propiedad) => (
                        <option
                          key={propiedad.id}
                          value={propiedad.direccion}
                        >
                          {propiedad.direccion} - {propiedad.tipo}
                        </option>
                      ))}
                    </select>
                    {propiedades.length === 0 && !loadingDatos && (
                      <p className="text-xs text-red-500 mt-1">
                        No hay propiedades disponibles
                      </p>
                    )}
                  </div>

                  {/* Inquilino - DINÁMICO */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Inquilino
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      name="inquilino"
                      value={nuevoContrato.inquilino}
                      onChange={handleChange}
                      disabled={loadingDatos || !!errorDatos}
                    >
                      <option value="">
                        {loadingDatos
                          ? "Cargando inquilinos..."
                          : "Seleccionar inquilino"}
                      </option>
                      {inquilinos.map((inquilino) => (
                        <option
                          key={inquilino.id}
                          value={`${inquilino.nombre} ${inquilino.apellido}`}
                        >
                          {inquilino.nombre} {inquilino.apellido}
                        </option>
                      ))}
                    </select>
                    {inquilinos.length === 0 && !loadingDatos && (
                      <p className="text-xs text-red-500 mt-1">
                        No hay inquilinos disponibles
                      </p>
                    )}
                  </div>

                  {/* Propietario (auto-completado) */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Propietario
                    </p>
                    <input
                      type="text"
                      name="propietario"
                      value={nuevoContrato.propietario}
                      readOnly
                      placeholder="Se auto-completa al seleccionar propiedad"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm text-gray-500"
                    />
                  </div>
                </div>
              </section>

              {/* Duración del Contrato */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Duración del Contrato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={nuevoContrato.fechaInicio}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Fecha de Finalización
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={nuevoContrato.fechaFin}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>
              </section>

              {/* Información Financiera */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Información Financiera
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Monto del Alquiler ($/mes)
                    </label>
                    <input
                      type="number"
                      name="montoAlquiler"
                      value={nuevoContrato.montoAlquiler}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Monto de la Garantía ($)
                    </label>
                    <input
                      type="number"
                      name="montoGarantia"
                      value={nuevoContrato.montoGarantia}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>
              </section>

              {/* DETALLE DE CUOTAS */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Detalle de Cuotas</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Frecuencia de Cobro
                    </label>
                    <select
                      name="frecuenciaCobro"
                      value={nuevoContrato.frecuenciaCobro}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    >
                      <option value="Mensual">Mensual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Número de Cuotas
                    </label>
                    <input
                      type="number"
                      name="numeroCuotas"
                      value={nuevoContrato.numeroCuotas}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Día de Vencimiento
                    </label>
                    <input
                      type="number"
                      name="diaVencimiento"
                      value={nuevoContrato.diaVencimiento}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Nota: Todas las cuotas tendrán el mismo valor mensual de{" "}
                  <strong>
                    {formatearMoneda(nuevoContrato.montoAlquiler || "0")}
                  </strong>
                </p>
              </section>

              {/* PENALIDADES POR INCUMPLIMIENTO */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Penalidades por Incumplimiento
                </h3>
                <textarea
                  name="penalidades"
                  value={nuevoContrato.penalidades}
                  onChange={handleChange}
                  placeholder="Detalle aquí las penalidades acordadas por incumplimiento..."
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </section>

              {/* CLÁUSULAS ADICIONALES */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cláusulas Adicionales</h3>
                <textarea
                  name="clausulasAdicionales"
                  value={nuevoContrato.clausulasAdicionales}
                  onChange={handleChange}
                  placeholder="Agregue cualquier cláusula adicional del contrato..."
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </section>

              {/* Botones del modal */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#f4b000] text-white hover:bg-[#d89c00] transition"
                >
                  Guardar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========= MODAL RENOVAR CONTRATO ========= */}
      {isRenewOpen && contratoARenovar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Renovar Contrato de Alquiler
              </h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={handleCloseRenew}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitRenew} className="space-y-6">
              {/* CONTRATO ACTUAL */}
              <section className="bg-[#fbf8f1] border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-xl">📄</span> Contrato Actual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Contrato N°</p>
                    <p>{contratoARenovar.id}</p>
                    <p className="mt-2 font-semibold">Fecha de Finalización</p>
                    <p>{formatearFechaBonita(contratoARenovar.fechaFin)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Propiedad</p>
                    <p>{contratoARenovar.propiedad}</p>
                    <p className="mt-2 font-semibold">Monto Actual</p>
                    <p>
                      {formatearMoneda(contratoARenovar.montoAlquiler)}/mes
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Inquilino</p>
                    <p>{contratoARenovar.inquilino}</p>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <span className="px-4 py-1 rounded-full bg-[#d3f7e8] text-[#1b7c4b] text-sm font-semibold">
                      {contratoARenovar.estado}
                    </span>
                  </div>
                </div>
              </section>

              {/* NUEVA DURACIÓN DEL CONTRATO */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>📅</span> Nueva Duración del Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Nueva Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      name="nuevaFechaInicio"
                      value={datosRenovacion.nuevaFechaInicio}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Inicia automáticamente después del contrato actual
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Nueva Fecha de Finalización
                    </label>
                    <input
                      type="date"
                      name="nuevaFechaFin"
                      value={datosRenovacion.nuevaFechaFin}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Duración: {datosRenovacion.numeroCuotas || "-"} meses
                    </p>
                  </div>
                </div>
              </section>

              {/* INFORMACIÓN FINANCIERA ACTUALIZADA */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>💲</span> Información Financiera Actualizada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Nuevo Monto del Alquiler ($/mes)
                    </label>
                    <input
                      type="number"
                      name="nuevoMontoAlquiler"
                      value={datosRenovacion.nuevoMontoAlquiler}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Monto anterior:{" "}
                      {formatearMoneda(contratoARenovar.montoAlquiler)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Monto de la Garantía ($)
                    </label>
                    <input
                      type="number"
                      name="nuevaGarantia"
                      value={datosRenovacion.nuevaGarantia}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Valor anterior:{" "}
                      {formatearMoneda(contratoARenovar.montoGarantia)}
                    </p>
                  </div>
                </div>
              </section>

              {/* DETALLE DE CUOTAS */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Detalle de Cuotas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Frecuencia de Cobro
                    </label>
                    <select
                      name="frecuenciaCobro"
                      value={datosRenovacion.frecuenciaCobro}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    >
                      <option value="Mensual">Mensual</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Número de Cuotas
                    </label>
                    <input
                      type="number"
                      name="numeroCuotas"
                      value={datosRenovacion.numeroCuotas}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Día de Vencimiento
                    </label>
                    <input
                      type="number"
                      name="diaVencimiento"
                      value={datosRenovacion.diaVencimiento}
                      onChange={handleChangeRenovacion}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-[#fff7cf] px-4 py-3 text-sm text-gray-700">
                  <span className="font-semibold">Importante: </span>
                  Todas las cuotas tendrán el mismo valor mensual de{" "}
                  {formatearMoneda(
                    datosRenovacion.nuevoMontoAlquiler ||
                      montoAnteriorLimpio ||
                      "0"
                  )}
                </div>
              </section>

              {/* CONDICIONES DE RENOVACIÓN */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Condiciones de Renovación
                </h3>
                <textarea
                  name="condicionesRenovacion"
                  value={datosRenovacion.condicionesRenovacion}
                  onChange={handleChangeRenovacion}
                  placeholder="Especificar las condiciones y términos de la renovación del contrato..."
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-sm"
                />
                <p className="text-xs text-gray-500">
                  Incluir información sobre actualizaciones, modificaciones o
                  condiciones especiales.
                </p>
              </section>

              {/* OBSERVACIONES ADICIONALES */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Observaciones Adicionales (Opcional)
                </h3>
                <textarea
                  name="observaciones"
                  value={datosRenovacion.observaciones}
                  onChange={handleChangeRenovacion}
                  placeholder="Agregar cualquier observación o nota adicional sobre la renovación..."
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-sm"
                />
              </section>

              {/* RESUMEN DE LA RENOVACIÓN */}
              <section className="rounded-2xl bg-[#d5fae5] p-6 space-y-3 text-sm">
                <h3 className="text-lg font-semibold text-[#169257] mb-2">
                  Resumen de la Renovación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Contrato Original:</p>
                    <p>{contratoARenovar.id}</p>
                    <p className="mt-2 font-semibold">
                      Nuevo Monto Mensual:
                    </p>
                    <p>
                      {formatearMoneda(
                        datosRenovacion.nuevoMontoAlquiler ||
                          montoAnteriorLimpio ||
                          "0"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Nuevo Período:</p>
                    <p>
                      {datosRenovacion.nuevaFechaInicio || "?"} -{" "}
                      {datosRenovacion.nuevaFechaFin || "?"}
                    </p>
                    <p className="mt-2 font-semibold">Total del Contrato:</p>
                    <p>
                      {Number.isNaN(totalContrato)
                        ? "$0"
                        : formatearMoneda(String(totalContrato))}
                    </p>
                  </div>
                </div>
              </section>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseRenew}
                  className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2e7c4f] text-white hover:bg-[#256341] transition"
                >
                  Confirmar Renovación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
