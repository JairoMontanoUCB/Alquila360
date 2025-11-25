"use client";

import { useEffect, useState } from "react";
import { contratoService, ContratoBackend, CreateContratoDto, PropiedadBackend, InquilinoBackend } from "../../../services/ContratoService";
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
  // Datos dinamicos
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
  
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Cargar todos los datos
      const [contratosData, propiedadesData, inquilinosData] = await Promise.all([
        contratoService.getContratos(),
        contratoService.getPropiedadesDisponibles(),
        contratoService.getInquilinos()        
      ]);
  
      // Asegurar que sean arrays
      const contratosArray = Array.isArray(contratosData) ? contratosData : [];
      const propiedadesArray = Array.isArray(propiedadesData) ? propiedadesData as PropiedadBackend[] : [];
      const inquilinosArray = Array.isArray(inquilinosData) ? inquilinosData as InquilinoBackend[] : [];
  
      // CONVERTIR CONTRATOS - SOLUCIÓN TEMPORAL
      let contratosFrontend: Contrato[] = [];
      
      if (contratosArray.length > 0) {
        contratosFrontend = contratosArray.map((contrato, index) => {
          // BUSCAR PROPIEDAD
          const propiedadEncontrada = propiedadesArray.find(p => p.id === contrato.id_propiedad);

          const inquilinoEncontrado = inquilinosArray[index] || inquilinosArray[0];
  
          return {
            id: `C-${String(contrato.id).padStart(3, "0")}`,
            propiedad: propiedadEncontrada?.direccion || `Propiedad ID: ${contrato.id_propiedad}`,
            inquilino: inquilinoEncontrado ? 
              `${inquilinoEncontrado.nombre} ${inquilinoEncontrado.apellido}` : 
              'Inquilino no disponible',
            propietario: propiedadEncontrada?.propietario ?
              `${propiedadEncontrada.propietario.nombre} ${propiedadEncontrada.propietario.apellido}` :
              'Propietario no disponible',
            fechaInicio: contrato.fecha_inicio,
            fechaFin: contrato.fecha_fin,
            montoAlquiler: contrato.monto_mensual?.toString() || "0",
            montoGarantia: contrato.garantia?.toString() || "0",
            frecuenciaCobro: "Mensual",
            numeroCuotas: "12", 
            diaVencimiento: "10",
            penalidades: "Mora del 2% por día de atraso...",
            clausulas: "El locatario se compromete...",
            estado: contrato.estado === 'activo' ? 'Vigente' : 'Finalizado' as EstadoContrato 
          };
        });
      }
      
      setContratos(contratosFrontend);
      setPropiedades(propiedadesArray);
      setInquilinos(inquilinosArray);
      
    } catch (err: any) {
      setError(`Error cargando datos: ${err.message}`);
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
    if (!formPropiedad || !formInquilino || !formFechaInicio || !formFechaFin) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Encontrar los IDs basados en la selección
    const propiedadSeleccionada = propiedades.find(p => 
      p.direccion === formPropiedad
    );
    const inquilinoSeleccionado = inquilinos.find(i => 
      `${i.nombre} ${i.apellido}` === formInquilino
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
      fecha_fin: formFechaFin
    };
    
    // Llamar al servicio para crear en el backend
    const nuevoContrato = await contratoService.registrarContrato(contratoData);

    // Recargar datos
    await cargarDatosIniciales();
    
    setOpenFormModal(false);
    resetForm();
    
  } catch (error: any) {
    alert(`Error al crear el contrato: ${error.response?.data?.message || error.message}`);
  }
};

// ---- GUARDAR CONTRATO (CREAR / EDITAR) ----
const guardarContrato = async () => {

  // Validaciones
  if (!formPropiedad || !formInquilino || !formFechaInicio || !formFechaFin) {
    alert("Completa todos los campos obligatorios: Propiedad, Inquilino, Fechas de inicio y fin.");
    return;
  }

  try {
    // SOLO para crear - llamar a la función del backend
    if (formMode === "crear") {
      await crearContratoBackend();
    } else {
      // Para editar, por ahora mensaje temporal
      alert("La edición de contratos estará disponible pronto");
      setOpenFormModal(false);
      setFormMode(null);
    }
  } catch (error: any) {
    console.error(" Error en guardarContrato:", error);
    alert(`Error: ${error.response?.data?.message || error.message}`);
  }
};

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
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

        {loading && <p className="text-center py-4">Cargando contratos...</p>}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      c.estado === 'Vigente' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
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
              
              {contratos.length === 0 && !loading &&(
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
            <div
                className="border border-emerald-900/40 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-line"

              >
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

            {/* PARTES DEL CONTRATO - ACTUALIZADO CON DATOS DINÁMICOS */}
            <section className="mb-6 border border-emerald-900/40 rounded-2xl bg-[#f9f6ef] p-5 space-y-4">
              <h3 className="font-semibold text-[#123528] text-lg mb-1">
                Partes del Contrato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Propiedad - DINÁMICO */}
                <div>
                  <p className="text-sm font-medium text-slate-700">Propiedad *</p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formPropiedad}
                    onChange={(e) => {
                      setFormPropiedad(e.target.value);
                      // Auto-completar propietario cuando se selecciona propiedad
                      const propiedad = propiedades.find(p => p.direccion === e.target.value);
                      if (propiedad) {
                        setFormPropietario(`${propiedad.propietario.nombre} ${propiedad.propietario.apellido}`);
                      }
                    }}
                    required
                  >
                    <option value="">Seleccionar propiedad</option>
                    {propiedades.map(propiedad => (
                      <option key={propiedad.id} value={propiedad.direccion}>
                        {propiedad.direccion} - {propiedad.tipo}
                      </option>
                    ))}
                  </select>
                  {propiedades.length === 0 && !loading && (
                    <p className="text-xs text-red-500 mt-1">No hay propiedades disponibles</p>
                  )}
                </div>

                {/* Inquilino - DINÁMICO */}
                <div>
                  <p className="text-sm font-medium text-slate-700">Inquilino *</p>
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formInquilino}
                    onChange={(e) => setFormInquilino(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar inquilino</option>
                    {inquilinos.map(inquilino => (
                      <option 
                        key={inquilino.id} 
                        value={`${inquilino.nombre} ${inquilino.apellido}`}
                      >
                        {inquilino.nombre} {inquilino.apellido}
                      </option>
                    ))}
                  </select>
                  {inquilinos.length === 0 && !loading && (
                    <p className="text-xs text-red-500 mt-1">No hay inquilinos disponibles</p>
                  )}
                </div>

                {/* Propietario (auto-completado) - DINÁMICO */}
                <div>
                  <p className="text-sm font-medium text-slate-700">Propietario</p>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formPropietario}
                    readOnly
                    placeholder="Se auto-completa al seleccionar propiedad"
                  />
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
                    Fecha de Inicio *
                  </p>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formFechaInicio}
                    onChange={(e) => setFormFechaInicio(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Fecha de Finalización *
                  </p>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={formFechaFin}
                    onChange={(e) => setFormFechaFin(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

          {/* INFORMACIÓN FINANCIERA */}
          <section className="mb-6 border border-emerald-900/40 rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-[#123528] text-lg">
              Información Financiera
            </h3>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Monto del Alquiler ($/mes) *
              </p>
              <input
                className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                value={formMontoAlquiler}
                onChange={(e) => setFormMontoAlquiler(e.target.value)}
                required
              />
            </div>
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
                readOnly
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
                {formMode === "crear" ? "Crear Contrato" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}