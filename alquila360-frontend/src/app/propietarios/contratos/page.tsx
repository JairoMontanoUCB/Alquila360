"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../../components/sideBarPropietario";
import {
  contratoService,
  PropiedadBackend,
  InquilinoBackend,
  CreateContratoDto,
} from "../../../services/ContratoService";

import { useRouter } from "next/navigation";

const activeLabel = "Contratos";

type EstadoContrato = "Vigente" | "Finalizado";

type Contrato = {
  id: string;
  propiedad: string;
  inquilino: string;
  propietario: string;
  fechaInicio: string;
  fechaFin: string;
  montoAlquiler: string;
  montoGarantia: string;
  frecuenciaCobro: string;
  numeroCuotas: string;
  diaVencimiento: string;
  penalidades: string;
  clausulas: string;
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

export default function ContratosPage() {
  const router = useRouter();
  
  // Estados de autenticación
  const [propietarioId, setPropietarioId] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Datos dinámicos
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [propiedades, setPropiedades] = useState<PropiedadBackend[]>([]);
  const [inquilinos, setInquilinos] = useState<InquilinoBackend[]>([]);

  // Estados para UI
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formMode, setFormMode] = useState<"crear" | "editar" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ===== VERIFICACIÓN DE USUARIO =====
  useEffect(() => {
    const obtenerUsuarioLogueado = () => {
      try {
        const usuarioStorage = localStorage.getItem('usuario');
        const role = localStorage.getItem('role');

        if (usuarioStorage && role === 'propietario') {
          const usuario = JSON.parse(usuarioStorage);
          
          if (usuario && usuario.id) {
            setPropietarioId(usuario.id);
          } else {
            console.error("Usuario no tiene ID");
            router.push('/login');
          }
        } else {
          console.error("No es propietario o no hay usuario:", { role });
          router.push('/login');
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
        router.push('/login');
      } finally {
        setUserLoading(false);
      }
    };

    obtenerUsuarioLogueado();
  }, [router]);

  // ===== CARGA DE DATOS =====
  useEffect(() => {
    if (propietarioId) {
      cargarDatosIniciales();
    }
  }, [propietarioId]);


  const cargarDatosIniciales = async () => {
    if (!propietarioId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Cargar datos
      const [contratosData, propiedadesData, inquilinosData] = await Promise.all([
        contratoService.getContratosPorPropietario(propietarioId),
        contratoService.getPropiedadesDisponibles(),
        contratoService.getInquilinos(),
      ]);

      // Mapear CONTRATOS 
      const contratosFrontend: Contrato[] = contratosData.map((contrato: any) => {
        // Buscar propiedad
        const propiedad = propiedadesData.find(p => p.id === contrato.id_propiedad);
        
        // Buscar inquilino - múltiples estrategias
        let inquilino = null;
        
        // Estrategia 1: Si el contrato ya trae el inquilino completo
        if (contrato.inquilino && contrato.inquilino.id) {
          inquilino = contrato.inquilino;
        }

        return {
          id: `C-${String(contrato.id).padStart(3, "0")}`,
          propiedad: propiedad?.direccion || `Propiedad ${contrato.id_propiedad}`,
          inquilino: inquilino 
            ? `${inquilino.nombre} ${inquilino.apellido}`
            : "Inquilino no disponible",
          propietario: propiedad?.propietario
            ? `${propiedad.propietario.nombre} ${propiedad.propietario.apellido}`
            : "Propietario no disponible",
          fechaInicio: contrato.fecha_inicio || "",
          fechaFin: contrato.fecha_fin || "",
          montoAlquiler: contrato.monto_mensual?.toString() || "0",
          montoGarantia: contrato.garantia?.toString() || "0",
          frecuenciaCobro: "Mensual",
          numeroCuotas: "12",
          diaVencimiento: "10",
          penalidades: "Mora del 2% por día de atraso...",
          clausulas: "El locatario se compromete...",
          estado: (contrato.estado === "activo" || contrato.estado === "Vigente") ? "Vigente" : "Finalizado",
        };
      });

      setContratos(contratosFrontend);
      setPropiedades(propiedadesData);
      setInquilinos(inquilinosData);
      
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      "Mora del 2% por día de atraso. Costo de reparaciones por daños..."
    );
    setFormClausulas(`    1. El inquilino se compromete a pagar el monto mensual acordado en la fecha establecida.
    2. El propietario se compromete a mantener la propiedad en condiciones habitables.
    3. Cualquier daño a la propiedad será responsabilidad del inquilino, salvo desgaste por uso normal.
    4. El contrato podrá ser renovado previo acuerdo entre ambas partes.
    5. Cualquier disputa será resuelta conforme a las leyes vigentes.
    `);
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

  // handler generico de cambios del form
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "propiedad": {
        setFormPropiedad(value);
        const propiedadSel = propiedades.find((p) => p.direccion === value);
        if (propiedadSel && (propiedadSel as any).propietario) {
          const prop = (propiedadSel as any).propietario;
          setFormPropietario(`${prop.nombre} ${prop.apellido}`);
        } else {
          setFormPropietario("");
        }
        break;
      }
      case "inquilino":
        setFormInquilino(value);
        break;
      case "fechaInicio":
        setFormFechaInicio(value);
        break;
      case "fechaFin":
        setFormFechaFin(value);
        break;
      case "montoAlquiler":
        setFormMontoAlquiler(value);
        break;
      case "montoGarantia":
        setFormMontoGarantia(value);
        break;
      case "frecuenciaCobro":
        setFormFrecuenciaCobro(value);
        break;
      case "numeroCuotas":
        setFormNumeroCuotas(value);
        break;
      case "diaVencimiento":
        setFormDiaVencimiento(value);
        break;
      case "penalidades":
        setFormPenalidades(value);
        break;
      case "clausulas":
        setFormClausulas(value);
        break;
      default:
        break;
    }
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

  // Crear contrato en backend
  const crearContratoBackend = async () => {
    try {
      // Validaciones
      if (
        !formPropiedad ||
        !formInquilino ||
        !formFechaInicio ||
        !formFechaFin
      ) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }

      // Encontrar los IDs basados en la selección
      const propiedadSeleccionada = propiedades.find(
        (p) => p.direccion === formPropiedad
      );
      const inquilinoSeleccionado = inquilinos.find(
        (i) => `${i.nombre} ${i.apellido}` === formInquilino
      );

      if (!propiedadSeleccionada || !inquilinoSeleccionado) {
        alert("Por favor selecciona una propiedad e inquilino válidos");
        return;
      }

      const contratoData: CreateContratoDto = {
        propiedadId: propiedadSeleccionada.id,
        inquilinoId: inquilinoSeleccionado.id,
        monto_mensual: Number(formMontoAlquiler),
        fecha_inicio: formFechaInicio,
        fecha_fin: formFechaFin,
      };

      // Llamar al servicio para crear en el backend
      await contratoService.registrarContrato(contratoData);

      // Recargar datos
      await cargarDatosIniciales();

      setOpenFormModal(false);
      resetForm();
    } catch (error: any) {
      alert(
        `Error al crear el contrato: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // ---- GUARDAR CONTRATO (CREAR / EDITAR) ----
  const guardarContrato = async () => {
    if (
      !formPropiedad ||
      !formInquilino ||
      !formFechaInicio ||
      !formFechaFin
    ) {
      alert(
        "Completa todos los campos obligatorios: Propiedad, Inquilino, Fechas de inicio y fin."
      );
      return;
    }

    try {
      if (formMode === "crear") {
        await crearContratoBackend();
      } else {
        alert("La edición de contratos estará disponible pronto");
        setOpenFormModal(false);
        setFormMode(null);
      }
    } catch (error: any) {
      console.error(" Error en guardarContrato:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // handler de submit del <form>
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    await guardarContrato();
  };

  const descargarPDF = async (contratoId: string) => {
    try {
      const idNumerico = contratoId.replace('C-', '');
      
      await contratoService.descargarContratoPDF(Number(idNumerico));
    } catch (error: any) {
      console.error('Error completo:', error);
      alert(`Error al descargar el PDF: ${error.response?.data?.message || error.message}`);
    }
  };

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
            {loading && (
              <p className="text-xs text-gray-500 mt-1">
                Cargando propiedades e inquilinos...
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">Error: {error}</p>
            )}
          </div>

          {/* Botón Nuevo Contrato */}
          <button
            onClick={abrirModalNuevo}
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
                        onClick={() => abrirModalVer(c)}
                        className="border border-[#15352b] rounded-lg p-2 hover:bg-gray-100 transition"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
                {contratos.length === 0 && !loading && (
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

      {/* ========= MODAL NUEVO / EDITAR CONTRATO ========= */}
      {openFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">
            {/* Header modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {formMode === "editar"
                  ? "Editar Contrato"
                  : "Crear Nuevo Contrato"}
              </h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={cerrarModalForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
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
                      value={formPropiedad}
                      onChange={handleFormChange}
                      disabled={loading}
                      required
                    >
                      <option value="">
                        {loading
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
                    {propiedades.length === 0 && !loading && (
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
                      value={formInquilino}
                      onChange={handleFormChange}
                      disabled={loading}
                      required
                    >
                      <option value="">
                        {loading
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
                    {inquilinos.length === 0 && !loading && (
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
                      value={formPropietario}
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
                      value={formFechaInicio}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                      required
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
                      value={formFechaFin}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                      required
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
                      value={formMontoAlquiler}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Monto de la Garantía ($)
                    </label>
                    <input
                      type="number"
                      name="montoGarantia"
                      value={formMontoGarantia}
                      onChange={handleFormChange}
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
                      value={formFrecuenciaCobro}
                      onChange={handleFormChange}
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
                      value={formNumeroCuotas}
                      onChange={handleFormChange}
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
                      value={formDiaVencimiento}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Nota: Todas las cuotas tendrán el mismo valor mensual de{" "}
                  <strong>
                    {formatearMoneda(formMontoAlquiler || "0")}
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
                  value={formPenalidades}
                  onChange={handleFormChange}
                  placeholder="Detalle aquí las penalidades acordadas por incumplimiento..."
                  className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </section>

              {/* CLÁUSULAS ADICIONALES (modelo fijo de lectura) */}
              <section className="border border-[#e1dac8] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cláusulas Adicionales</h3>

                <textarea
                  name="clausulas"
                  value={formClausulas}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-700 whitespace-pre-line h-32"
                />
              </section>

              {/* Botones del modal */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModalForm}
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
      {openViewModal && selectedContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contrato de Alquiler</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={cerrarModalVer}
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
                <span>📄</span> Contrato N° {selectedContrato.id}
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
                    {selectedContrato.propietario || "Propietario"}
                  </p>
                </div>
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-xs font-semibold text-[#7aa278] mb-1">
                    👤 LOCATARIO (Inquilino)
                  </p>
                  <p className="font-semibold">{selectedContrato.inquilino}</p>
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
                  {selectedContrato.propiedad}
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
                    {formatearFechaBonita(selectedContrato.fechaInicio)}
                  </p>
                </div>
                <div className="border border-[#315c47] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                    📅 Fecha de Finalización
                  </p>
                  <p className="text-sm text-gray-700">
                    {formatearFechaBonita(selectedContrato.fechaFin)}
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
                    {formatearMoneda(selectedContrato.montoAlquiler)}
                  </p>
                </div>
                <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                    💲 Garantía
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatearMoneda(selectedContrato.montoGarantia)}
                  </p>
                </div>
                <div className="bg-[#fbf5ea] rounded-2xl px-5 py-4">
                  <p className="text-sm font-semibold mb-1">Vencimiento</p>
                  <p className="text-xl font-semibold">
                    {selectedContrato.diaVencimiento || "-"}
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
                      {selectedContrato.frecuenciaCobro}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Número de Cuotas</p>
                    <p className="text-sm text-gray-700">
                      {selectedContrato.numeroCuotas || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Valor por Cuota</p>
                    <p className="text-sm text-gray-700">
                      {formatearMoneda(selectedContrato.montoAlquiler)}
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
                {selectedContrato.penalidades
                  ? selectedContrato.penalidades
                  : "Las penalidades por incumplimiento se regirán por lo que las partes acuerden expresamente en el contrato."}
              </div>
            </section>

            {/* CLÁUSULAS ADICIONALES */}
            <section className="mb-10">
              <h3 className="text-sm font-semibold tracking-wide mb-3">
                CLÁUSULAS ADICIONALES
              </h3>
              <div className="border border-[#315c47] rounded-2xl px-5 py-4 text-sm text-gray-800 whitespace-pre-line">
                {selectedContrato.clausulas ||
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
                    {selectedContrato.propietario || "____________________"}
                  </p>
                  <p className="text-sm text-gray-700">Firma del Locador</p>
                </div>
                <div>
                  <div className="border-t border-[#d7cec0] pt-4" />
                  <p className="font-semibold">{selectedContrato.inquilino}</p>
                  <p className="text-sm text-gray-700">Firma del Locatario</p>
                </div>
              </div>
            </section>

            {/* Botones finales */}
            <div className="flex justify-end gap-3 mt-4">
            <button 
                  onClick={() => descargarPDF(selectedContrato.id)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
              >
                  Imprimir
              </button>
              <button
                onClick={abrirEditorDesdeVista}
                className="px-5 py-2 rounded-lg border border-[#315c47] text-[#315c47] hover:bg-gray-100 transition"
              >
                Editar
              </button>
              <button
                onClick={cerrarModalVer}
                className="px-5 py-2 rounded-lg bg-[#f4b000] text-white hover:bg-[#d89c00] transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
