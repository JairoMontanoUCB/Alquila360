"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SidebarAdministrador from "../../components/sideBarAdministrador";
import { propiedadService, PropiedadBackend, CreatePropiedadDto } from "../../../services/PropiedadService";

// Tipo para el frontend
type Propiedad = {
  id: number;
  img: string;
  direccion: string;
  estado: "Disponible" | "Ocupada" | "Mantenimiento" | "Inactiva";
  precio: string;
  descripcion: string;
  tipo: string;
  ciudad: string;
  superficie: string;
  ambientes: string;
  garantia: string;
  servicios: string[];
  propietario: string;
  rating?: number;
};

export default function PropiedadesPage() {
  const [listaPropiedades, setListaPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [selectedProp, setSelectedProp] = useState<Propiedad | null>(null);

  // --- STATE DEL FORMULARIO CORREGIDO ---
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipoProp, setTipoProp] = useState("casa");
  const [estadoProp, setEstadoProp] = useState("disponible");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [propietarioId, setPropietarioId] = useState("1");
  const [superficie, setSuperficie] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [serviciosTexto, setServiciosTexto] = useState("");

  // Cargar propiedades al iniciar
  useEffect(() => {
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Cargando propiedades del backend...");
      
      const propiedadesData = await propiedadService.getPropiedades();
      console.log("✅ Propiedades recibidas del backend:", propiedadesData);

      // Transformar datos del backend al formato del frontend
      const propiedadesTransformadas: Propiedad[] = propiedadesData.map(prop => {
        const estadoFrontend = 
          prop.estado === "disponible" ? "Disponible" :
          prop.estado === "alquilada" ? "Ocupada" :
          prop.estado === "mantenimiento" ? "Mantenimiento" : "Inactiva";

        const primeraImagen = prop.fotos && prop.fotos.length > 0 
          ? `http://localhost:3001/storage/propiedades/${prop.fotos[0].url}`
          : "/propiedad.png";

        return {
          id: prop.id,
          img: primeraImagen,
          direccion: prop.direccion,
          estado: estadoFrontend,
          precio: `$${prop.precio_referencia}/mes`,
          descripcion: prop.descripcion || "Sin descripción",
          tipo: prop.tipo,
          ciudad: prop.ciudad || "Sin ciudad",
          superficie: prop.superficie ? `${prop.superficie} m²` : "No especificado",
          ambientes: prop.ambientes ? `${prop.ambientes} ambientes` : "No especificado",
          garantia: `$${prop.precio_referencia * 2}`,
          servicios: prop.servicios || ["Básicos"],
          propietario: `${prop.propietario.nombre} ${prop.propietario.apellido}`,
          rating: prop.ratingPromedio
        };
      });

      setListaPropiedades(propiedadesTransformadas);
      
    } catch (err: any) {
      console.error("❌ Error cargando propiedades:", err);
      setError(`Error cargando propiedades: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDireccion("");
    setCiudad("");
    setTipoProp("casa");
    setEstadoProp("disponible");
    setPrecio("");
    setDescripcion("");
    setPropietarioId("1");
    setSuperficie("");
    setAmbientes("");
    setServiciosTexto("");
  };

  const abrirReporte = (prop: Propiedad) => {
    setSelectedProp(prop);
    setOpenReport(true);
  };

  const cerrarReporte = () => {
    setOpenReport(false);
    setSelectedProp(null);
  };

  const cerrarModalAdd = () => {
    setOpenAdd(false);
    resetForm();
  };

  const guardarPropiedad = async () => {
    if (!direccion || !precio || !ciudad) {
      alert("Completa al menos Dirección, Ciudad y Precio.");
      return;
    }

    try {
      const serviciosArray = serviciosTexto
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const propiedadData: CreatePropiedadDto = {
        direccion,
        ciudad,
        tipo: tipoProp,
        estado: estadoProp,
        descripcion: descripcion || "Propiedad sin descripción detallada",
        precio_referencia: Number(precio.replace('$', '').replace('/mes', '')),
        propietarioId: Number(propietarioId),
        superficie: superficie ? Number(superficie) : undefined,
        ambientes: ambientes ? Number(ambientes) : undefined,
        servicios: serviciosArray.length > 0 ? serviciosArray : undefined
      };

      console.log("📤 Enviando propiedad al backend:", propiedadData);
      
      await propiedadService.crearPropiedad(propiedadData);
      await cargarPropiedades();
      
      cerrarModalAdd();
      alert("Propiedad creada exitosamente");
      
    } catch (error: any) {
      console.error("❌ Error creando propiedad:", error);
      alert(`Error al crear la propiedad: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      {/* CORREGIDO: Sin activeLabel */}
      <SidebarAdministrador />

      {/* CONTENIDO PRINCIPAL */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestión de Propiedades
            </h1>
            <p className="text-sm text-slate-500">
              Administra todas las propiedades del sistema
            </p>
          </div>

          <button
            onClick={() => setOpenAdd(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Agregar Propiedad
          </button>
        </header>

        {loading && <p className="text-center py-4">Cargando propiedades...</p>}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {/* TABLA */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Dirección</th>
                <th className="p-3">Ciudad</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Propietario</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaPropiedades.map((prop) => (
                <tr key={prop.id} className="border-t">
                  <td className="p-3">
                    <Image
                      src={prop.img}
                      width={80}
                      height={80}
                      alt="propiedad"
                      className="rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3">{prop.direccion}</td>
                  <td className="p-3">{prop.ciudad}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        prop.estado === "Disponible"
                          ? "bg-emerald-100 text-emerald-700"
                          : prop.estado === "Ocupada"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {prop.estado}
                    </span>
                  </td>
                  <td className="p-3">{prop.precio}</td>
                  <td className="p-3">{prop.propietario}</td>
                  <td className="p-3">
                    <span className="text-yellow-500 font-semibold">
                      {prop.rating ? prop.rating.toFixed(1) : "N/A"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirReporte(prop)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => abrirReporte(prop)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {listaPropiedades.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-400">
                    No hay propiedades para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL AGREGAR PROPIEDAD - FORMULARIO CORREGIDO */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-300 p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={cerrarModalAdd}
              className="absolute top-4 right-4 text-slate-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Agregar Nueva Propiedad</h2>

            <div className="space-y-6">
              {/* DIRECCIÓN Y CIUDAD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Dirección *</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Ciudad *</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* TIPO Y ESTADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={tipoProp}
                    onChange={(e) => setTipoProp(e.target.value)}
                  >
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="local">Local</option>
                    <option value="oficina">Oficina</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={estadoProp}
                    onChange={(e) => setEstadoProp(e.target.value)}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="alquilada">Alquilada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>

              {/* PRECIO Y PROPIETARIO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Precio Mensual *</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Ej: 150000"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Propietario ID *</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={propietarioId}
                    onChange={(e) => setPropietarioId(e.target.value)}
                    placeholder="ID del propietario"
                    required
                  />
                </div>
              </div>

              {/* SUPERFICIE Y AMBIENTES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Superficie (m²)</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={superficie}
                    onChange={(e) => setSuperficie(e.target.value)}
                    placeholder="Ej: 120"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Ambientes</label>
                  <input
                    className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                    value={ambientes}
                    onChange={(e) => setAmbientes(e.target.value)}
                    placeholder="Ej: 3"
                  />
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100 h-24"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción de la propiedad..."
                />
              </div>

              {/* SERVICIOS */}
              <div>
                <label className="text-sm font-medium">Servicios</label>
                <input
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                  placeholder="Ej: WiFi, Gas, Agua, Luz, Cable"
                  value={serviciosTexto}
                  onChange={(e) => setServiciosTexto(e.target.value)}
                />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={cerrarModalAdd}
                  className="px-4 py-2 border rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                  Cancelar
                </button>

                <button
                  onClick={guardarPropiedad}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold"
                >
                  Guardar Propiedad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTE COMPLETO - CON FECHA FUNCIONAL */}
{openReport && selectedProp && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-12">
    <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl border border-slate-300 overflow-y-auto max-h-[90vh] relative">
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-[#f8f9fa]">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#123528]">
            Reporte Completo de Propiedad
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Información detallada de la propiedad y su propietario
          </p>
        </div>
        <button
          onClick={cerrarReporte}
          className="text-slate-600 hover:text-black text-xl bg-white rounded-full p-2 hover:bg-slate-100 transition"
        >
          ✕
        </button>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* INFORMACIÓN BÁSICA DE LA PROPIEDAD */}
        <section>
          <h3 className="text-lg font-semibold text-[#123528] mb-4 flex items-center gap-2">
            <span className="text-amber-600">🏠</span>
            Información de la Propiedad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Dirección</p>
              <p className="text-sm font-medium text-[#123528]">{selectedProp.direccion}</p>
            </div>
            <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Ciudad</p>
              <p className="text-sm font-medium text-[#123528]">{selectedProp.ciudad}</p>
            </div>
            <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Tipo</p>
              <p className="text-sm font-medium text-[#123528] capitalize">{selectedProp.tipo}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Estado Actual</p>
              <span className={`inline-flex px-4 py-1 rounded-full text-xs font-semibold ${
                selectedProp.estado === "Disponible"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : selectedProp.estado === "Ocupada"
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}>
                {selectedProp.estado}
              </span>
            </div>
            <div className="border border-slate-300 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Precio Mensual</p>
              <p className="text-lg font-bold text-[#123528]">{selectedProp.precio}</p>
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS TÉCNICAS */}
        <section>
          <h3 className="text-lg font-semibold text-[#123528] mb-4 flex items-center gap-2">
            <span className="text-amber-600">📐</span>
            Características Técnicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-300 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Superficie</p>
              <p className="text-sm font-medium text-[#123528]">{selectedProp.superficie}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Ambientes</p>
              <p className="text-sm font-medium text-[#123528]">{selectedProp.ambientes}</p>
            </div>
            <div className="border border-slate-300 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-semibold">
                  {selectedProp.rating ? selectedProp.rating.toFixed(1) : "N/A"}
                </span>
                {selectedProp.rating && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(selectedProp.rating!) 
                            ? "text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* INFORMACIÓN DEL PROPIETARIO */}
        <section>
          <h3 className="text-lg font-semibold text-[#123528] mb-4 flex items-center gap-2">
            <span className="text-amber-600">👤</span>
            Información del Propietario
          </h3>
          <div className="border border-emerald-200 rounded-xl bg-emerald-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-emerald-800 mb-3">Datos Personales</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-emerald-600 mb-1">Nombre Completo</p>
                    <p className="text-sm font-medium text-emerald-900">{selectedProp.propietario}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 mb-1">ID de Propiedad</p>
                    <p className="text-sm font-medium text-emerald-900">#{selectedProp.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 mb-1">Rol en el Sistema</p>
                    <p className="text-sm font-medium text-emerald-900">Propietario</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-emerald-800 mb-3">Información de Contacto</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-emerald-600 mb-1">Email de Contacto</p>
                    <p className="text-sm font-medium text-emerald-900">
                      {selectedProp.propietario.toLowerCase().replace(/\s+/g, '.')}@email.com
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 mb-1">Estado de Cuenta</p>
                    <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICIOS INCLUIDOS */}
        <section>
          <h3 className="text-lg font-semibold text-[#123528] mb-4 flex items-center gap-2">
            <span className="text-amber-600">⚡</span>
            Servicios Incluidos
          </h3>
          <div className="border border-slate-300 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedProp.servicios.map((servicio, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-3 px-4 rounded-lg bg-white border border-slate-200 hover:border-amber-300 transition"
                >
                  <span className="text-amber-600 text-sm">✓</span>
                  <span className="text-sm font-medium text-slate-700">{servicio}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DESCRIPCIÓN DETALLADA */}
        <section>
          <h3 className="text-lg font-semibold text-[#123528] mb-4 flex items-center gap-2">
            <span className="text-amber-600">📝</span>
            Descripción Detallada
          </h3>
          <div className="border border-slate-300 rounded-xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-700">Acerca de esta propiedad</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedProp.descripcion}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER CON ACCIONES */}
      <div className="flex justify-between items-center px-8 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
        <div className="text-sm text-slate-500">
          Propiedad ID: <span className="font-semibold">#{selectedProp.id}</span> | 
          Reporte generado: <span className="font-semibold">{new Date().toLocaleDateString('es-AR')}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={cerrarReporte}
            className="px-5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium text-slate-700 transition"
          >
            Cerrar
          </button>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition"
          >
            Imprimir Reporte
          </button>
          <button className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition">
            Contactar Propietario
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </main>
  );
}