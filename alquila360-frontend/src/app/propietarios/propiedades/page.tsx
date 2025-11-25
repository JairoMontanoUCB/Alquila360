"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "../../components/sideBarPropietario";
import { propiedadService, PropiedadBackend } from "../../../services/PropiedadService";

// Tipo actualizado para usar datos reales
type Propiedad = {
  id: number;
  img: string;
  nombre: string;
  tipo: string;
  direccion: string;
  superficie: string;
  ambientes: string;
  estado: "Disponible" | "Ocupada" | "Mantenimiento" | "Inactiva";
  precioAlquiler: string;
  precioGarantia: string;
  descripcion: string;
  servicios: string;
  fotos: any[];
};

export default function MisPropiedades() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  // Estado del formulario CREAR
  const [nombrePropiedad, setNombrePropiedad] = useState("");
  const [tipoPropiedad, setTipoPropiedad] = useState("Casa");
  const [direccionExacta, setDireccionExacta] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [ambientes, setAmbientes] = useState("");
  const [estadoActual, setEstadoActual] = useState("Disponible");
  const [precioAlquiler, setPrecioAlquiler] = useState("");
  const [precioGarantia, setPrecioGarantia] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [servicios, setServicios] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);

  // Estado del formulario EDITAR
  const [editNombrePropiedad, setEditNombrePropiedad] = useState("");
  const [editTipoPropiedad, setEditTipoPropiedad] = useState("Casa");
  const [editDireccionExacta, setEditDireccionExacta] = useState("");
  const [editSuperficie, setEditSuperficie] = useState("");
  const [editAmbientes, setEditAmbientes] = useState("");
  const [editEstadoActual, setEditEstadoActual] = useState("Disponible");
  const [editPrecioAlquiler, setEditPrecioAlquiler] = useState("");
  const [editPrecioGarantia, setEditPrecioGarantia] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editServicios, setEditServicios] = useState("");
  const [editImagenes, setEditImagenes] = useState<File[]>([]);

  // ID del propietario logueado (esto debería venir de tu sistema de autenticación)
  const [propietarioId, setPropietarioId] = useState<number>(1); // Temporal - reemplaza con el ID real

  // Cargar propiedades del propietario
  useEffect(() => {
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Cargando propiedades del propietario...");
      
      // Obtener solo las propiedades del propietario logueado
      const propiedadesData = await propiedadService.getPropiedadesPorPropietario(propietarioId);
      console.log("✅ Propiedades del propietario recibidas:", propiedadesData);

      // Transformar datos del backend al formato del frontend
      const propiedadesTransformadas: Propiedad[] = propiedadesData.map(prop => {
        // Obtener imagen
        const primeraImagen = prop.fotos && prop.fotos.length > 0 && prop.fotos[0].url
          ? `http://localhost:3001${prop.fotos[0].url}`
          : "/propiedad.png";

        // Mapear estado
        const estadoFrontend = 
          prop.estado === "disponible" ? "Disponible" :
          prop.estado === "alquilada" ? "Ocupada" :
          prop.estado === "mantenimiento" ? "Mantenimiento" : "Inactiva";

        return {
          id: prop.id,
          img: primeraImagen,
          nombre: prop.direccion, // Usar dirección como nombre
          tipo: prop.tipo,
          direccion: prop.direccion,
          superficie: prop.superficie ? `${prop.superficie} m²` : "No especificado",
          ambientes: prop.ambientes ? `${prop.ambientes} ambientes` : "No especificado",
          estado: estadoFrontend,
          precioAlquiler: `$${prop.precio_referencia}`,
          precioGarantia: `$${prop.precio_referencia * 2}`,
          descripcion: prop.descripcion || "Sin descripción",
          servicios: "Básicos", // Temporal - ajusta según tus datos
          fotos: prop.fotos || []
        };
      });

      setPropiedades(propiedadesTransformadas);
      
    } catch (err: any) {
      console.error("❌ Error cargando propiedades:", err);
      setError(`Error cargando propiedades: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const stateColor = (estado: string) => {
    if (estado === "Disponible") return "bg-[#d3f7e8] text-[#1b7c4b]";
    if (estado === "Ocupada") return "bg-[#dbe7ff] text-[#3b5fb4]";
    return "bg-[#f0f0f0] text-[#666]";
  };

  // Función para crear propiedad - CONECTADA AL BACKEND
  const handleGuardarPropiedad = async () => {
    if (!nombrePropiedad || !direccionExacta || !precioAlquiler) {
      alert("Completa al menos nombre, dirección y precio de alquiler.");
      return;
    }

    try {
      const propiedadData = {
        direccion: direccionExacta,
        ciudad: "Ciudad por defecto", // Ajusta según tu formulario
        tipo: tipoPropiedad.toLowerCase(),
        estado: estadoActual.toLowerCase(),
        descripcion: descripcion || "Sin descripción",
        precio_referencia: Number(precioAlquiler),
        propietarioId: propietarioId, // Usar el ID del propietario logueado
        // Agrega otros campos según necesites
      };

      console.log("📤 Creando propiedad:", propiedadData);
      
      await propiedadService.crearPropiedad(propiedadData);
      await cargarPropiedades(); // Recargar la lista
      
      resetForm();
      setOpenCreate(false);
      alert("Propiedad creada exitosamente");
      
    } catch (error: any) {
      console.error("❌ Error creando propiedad:", error);
      alert(`Error al crear la propiedad: ${error.message}`);
    }
  };

  // Función para editar propiedad - CONECTADA AL BACKEND
  const handleGuardarEdicion = async () => {
    if (editIndex === null) return;

    try {
      const propiedad = propiedades[editIndex];
      
      const propiedadData = {
        direccion: editDireccionExacta,
        ciudad: "Ciudad por defecto", // Ajusta según tu formulario
        tipo: editTipoPropiedad.toLowerCase(),
        estado: editEstadoActual.toLowerCase(),
        descripcion: editDescripcion || "Sin descripción",
        precio_referencia: Number(editPrecioAlquiler),
        // Agrega otros campos según necesites
      };

      console.log("📤 Actualizando propiedad:", propiedad.id, propiedadData);
      
      await propiedadService.actualizarPropiedad(propiedad.id, propiedadData);
      await cargarPropiedades(); // Recargar la lista
      
      setOpenEdit(false);
      setEditIndex(null);
      alert("Propiedad actualizada exitosamente");
      
    } catch (error: any) {
      console.error("❌ Error actualizando propiedad:", error);
      alert(`Error al actualizar la propiedad: ${error.message}`);
    }
  };

  // Funciones de UI
  const handleOpenEdit = (index: number) => {
    const p = propiedades[index];
    setEditIndex(index);
    setEditNombrePropiedad(p.nombre);
    setEditTipoPropiedad(p.tipo);
    setEditDireccionExacta(p.direccion);
    setEditSuperficie(p.superficie.replace(' m²', ''));
    setEditAmbientes(p.ambientes.replace(' ambientes', ''));
    setEditEstadoActual(p.estado);
    setEditPrecioAlquiler(p.precioAlquiler.replace('$', ''));
    setEditPrecioGarantia(p.precioGarantia.replace('$', ''));
    setEditDescripcion(p.descripcion);
    setEditServicios(p.servicios);
    setEditImagenes([]);
    setOpenEdit(true);
  };

  const handleOpenView = (index: number) => {
    setViewIndex(index);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setViewIndex(null);
  };

  // Reset form
  const resetForm = () => {
    setNombrePropiedad("");
    setTipoPropiedad("Casa");
    setDireccionExacta("");
    setSuperficie("");
    setAmbientes("");
    setEstadoActual("Disponible");
    setPrecioAlquiler("");
    setPrecioGarantia("");
    setDescripcion("");
    setServicios("");
    setImagenes([]);
  };

  // Handlers para imágenes
  const handleImagenesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes(Array.from(e.target.files));
    }
  };

  const handleEditImagenesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditImagenes(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#1c3c2b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Mis Propiedades</h2>
            <p className="text-sm text-gray-600">
              Gestiona todas tus propiedades ({propiedades.length} propiedades)
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="bg-[#f4b000] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#e0a000] transition"
          >
            Agregar Propiedad
          </button>
        </header>

        {loading && (
          <div className="text-center py-8">
            <p>Cargando tus propiedades...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* TABLA */}
        <div className="bg-white border border-[#cfc7b4] rounded-2xl overflow-hidden">
          {propiedades.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tienes propiedades registradas</p>
              <button
                onClick={() => setOpenCreate(true)}
                className="bg-[#f4b000] text-white px-4 py-2 rounded-lg hover:bg-[#e0a000] transition"
              >
                Agregar tu primera propiedad
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">Imagen</th>
                  <th className="py-4 px-4">Dirección</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Precio</th>
                  <th className="py-4 px-4">Descripción</th>
                  <th className="py-4 px-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {propiedades.map((p, index) => (
                  <tr key={p.id} className="border-t border-[#ded7c7]">
                    <td className="py-3 px-4">
                      <img
                        src={p.img}
                        className="h-16 w-24 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/propiedad.png';
                        }}
                      />
                    </td>

                    <td className="py-3 px-4">{p.direccion}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${stateColor(
                          p.estado
                        )}`}
                      >
                        {p.estado}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {p.precioAlquiler}/mes
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      {p.descripcion}
                    </td>

                    <td className="py-3 px-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(index)}
                        className="border border-[#1e4633] rounded-lg p-2 hover:bg-gray-100"
                        title="Editar propiedad"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleOpenView(index)}
                        className="border border-[#1e4633] rounded-lg p-2 hover:bg-gray-100"
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL AGREGAR PROPIEDAD */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                Agregar Nueva Propiedad
              </h2>
              <button
                onClick={() => {
                  setOpenCreate(false);
                  resetForm();
                }}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="px-8 py-6 space-y-6">
              {/* Primera parte */}
              <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Nombre de la Propiedad
                    </p>
                    <input
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Casa en San Isidro"
                      value={nombrePropiedad}
                      onChange={(e) => setNombrePropiedad(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Tipo de Propiedad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={tipoPropiedad}
                      onChange={(e) => setTipoPropiedad(e.target.value)}
                    >
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Local comercial</option>
                      <option>Oficina</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Dirección Exacta
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Calle 123, San Isidro, Buenos Aires"
                    value={direccionExacta}
                    onChange={(e) => setDireccionExacta(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Superficie (m²)
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={superficie}
                      onChange={(e) => setSuperficie(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Número de Ambientes
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={ambientes}
                      onChange={(e) => setAmbientes(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Estado Actual
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={estadoActual}
                      onChange={(e) => setEstadoActual(e.target.value)}
                    >
                      <option>Disponible</option>
                      <option>Ocupada</option>
                      <option>Reservada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Precio del Alquiler ($/mes)
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={precioAlquiler}
                      onChange={(e) => setPrecioAlquiler(e.target.value)}
                    />
                  </div>
   
                </div>
              </section>

              {/* Segunda parte */}
              <section className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Descripción
                  </p>
                  <textarea
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-24"
                    placeholder="Describe las características de la propiedad..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>

      
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Imágenes de la Propiedad
                  </p>
                  <div className="w-full rounded-2xl border-2 border-dashed border-[#1e4633] bg-white px-4 py-10 flex flex-col items-center justify-center text-sm text-slate-500">
                    <p className="mb-4 text-center">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <label className="inline-block">
                      <span className="px-5 py-2 rounded-lg border border-[#1e4633] hover:bg-slate-100 cursor-pointer">
                        Seleccionar Imágenes
                      </span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleImagenesChange}
                      />
                    </label>
                    {imagenes.length > 0 && (
                      <p className="mt-3 text-xs text-slate-500">
                        {imagenes.length} imagen(es) seleccionada(s)
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setOpenCreate(false);
                    resetForm();
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarPropiedad}
                  className="px-5 py-2 rounded-lg bg-[#f4b000] hover:bg-[#e0a000] text-white text-sm font-semibold"
                >
                  Guardar Propiedad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PROPIEDAD */}
      {openEdit && editIndex !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
              <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                Editar Propiedad
              </h2>
              <button
                onClick={() => {
                  setOpenEdit(false);
                  setEditIndex(null);
                }}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="px-8 py-6 space-y-6">
              {/* Primera parte */}
              <section className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Nombre de la Propiedad
                    </p>
                    <input
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editNombrePropiedad}
                      onChange={(e) =>
                        setEditNombrePropiedad(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Tipo de Propiedad
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editTipoPropiedad}
                      onChange={(e) => setEditTipoPropiedad(e.target.value)}
                    >
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Local comercial</option>
                      <option>Oficina</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Dirección Exacta
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    value={editDireccionExacta}
                    onChange={(e) => setEditDireccionExacta(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Superficie (m²)
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editSuperficie}
                      onChange={(e) => setEditSuperficie(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Número de Ambientes
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editAmbientes}
                      onChange={(e) => setEditAmbientes(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Estado Actual
                    </p>
                    <select
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editEstadoActual}
                      onChange={(e) => setEditEstadoActual(e.target.value)}
                    >
                      <option>Disponible</option>
                      <option>Ocupada</option>
                      <option>Reservada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Precio del Alquiler ($/mes)
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editPrecioAlquiler}
                      onChange={(e) =>
                        setEditPrecioAlquiler(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Precio de la Garantía ($)
                    </p>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                      value={editPrecioGarantia}
                      onChange={(e) =>
                        setEditPrecioGarantia(e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Segunda parte */}
              <section className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Descripción
                  </p>
                  <textarea
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm h-24"
                    placeholder="Describe las características de la propiedad..."
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Servicios Incluidos
                  </p>
                  <input
                    className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Ej: WiFi, Gas, Agua, Luz, Cable, Estacionamiento"
                    value={editServicios}
                    onChange={(e) => setEditServicios(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Imágenes de la Propiedad
                  </p>
                  <div className="w-full rounded-2xl border-2 border-dashed border-[#1e4633] bg-white px-4 py-10 flex flex-col items-center justify-center text-sm text-slate-500">
                    <p className="mb-4 text-center">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <label className="inline-block">
                      <span className="px-5 py-2 rounded-lg border border-[#1e4633] hover:bg-slate-100 cursor-pointer">
                        Seleccionar Imágenes
                      </span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleEditImagenesChange}
                      />
                    </label>
                    {editImagenes.length > 0 && (
                      <p className="mt-3 text-xs text-slate-500">
                        {editImagenes.length} imagen(es) seleccionada(s)
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => {
                    setOpenEdit(false);
                    setEditIndex(null);
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarEdicion}
                  className="px-5 py-2 rounded-lg bg-[#f4b000] hover:bg-[#e0a000] text-white text-sm font-semibold"
                >
                  Guardar Propiedad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER REPORTE COMPLETO (OJO) */}
      {openView && viewIndex !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-10">
          {(() => {
            const p = propiedades[viewIndex];
            if (!p) return null;

            const serviciosArray = p.servicios
              ? p.servicios.split(",").map((s) => s.trim())
              : [];

            return (
              <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl border border-slate-300 max-h-[92vh] overflow-y-auto relative">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200">
                  <h2 className="text-xl md:text-2xl font-semibold text-[#123528]">
                    Reporte Completo de Propiedad
                  </h2>
                  <button
                    onClick={handleCloseView}
                    className="text-slate-600 hover:text-black text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Imagen grande */}
                <div className="px-8 pt-6">
                  <div className="rounded-2xl overflow-hidden border border-[#1e4633]/20 bg-slate-100">
                    <img
                      src={p.img}
                      className="w-full max-h-[420px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/propiedad.png';
                      }}
                    />
                  </div>
                </div>

                {/* Info principal */}
                <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-[#fbf8f1] border border-[#e6decc] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Dirección
                      </p>
                      <p className="text-sm text-slate-800">{p.direccion}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fbf8f1] border border-[#e6decc] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Tipo de Propiedad
                      </p>
                      <p className="text-sm text-slate-800">{p.tipo}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fbf8f1] border border-[#e6decc] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Precio Mensual
                      </p>
                      <p className="text-sm text-slate-900">
                        {p.precioAlquiler}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#1e4633] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Estado Actual
                      </p>
                      <span
                        className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold ${stateColor(
                          p.estado
                        )}`}
                      >
                        {p.estado}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-[#1e4633] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Superficie
                      </p>
                      <p className="text-sm text-slate-800">
                        {p.superficie}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#1e4633] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Ambientes
                      </p>
                      <p className="text-sm text-slate-800">
                        {p.ambientes}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#1e4633] px-5 py-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Garantía
                      </p>
                      <p className="text-sm text-slate-800">
                        {p.precioGarantia}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descripción y servicios */}
                <div className="px-8 pb-6 space-y-6">
                  <section className="rounded-2xl border border-[#1e4633] px-5 py-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Descripción
                    </p>
                    <p className="text-sm text-slate-800">{p.descripcion}</p>
                  </section>

                  <section className="rounded-2xl border border-[#1e4633] px-5 py-4">
                    <p className="text-sm font-semibold text-slate-700 mb-4">
                      Servicios Incluidos
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {serviciosArray.length > 0 ? (
                        serviciosArray.map((serv, i) => (
                          <span
                            key={i}
                            className="px-6 py-2 rounded-2xl bg-[#fbf8f1] border border-[#e6decc] text-sm text-[#1e4633]"
                          >
                            {serv}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">
                          No se registraron servicios.
                        </p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-8 py-4 border-t border-slate-200">
                  <button
                    onClick={handleCloseView}
                    className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      handleCloseView();
                      handleOpenEdit(viewIndex);
                    }}
                    className="px-5 py-2 rounded-lg bg-[#f4b000] hover:bg-[#e0a000] text-white text-sm font-semibold"
                  >
                    Editar Propiedad
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}