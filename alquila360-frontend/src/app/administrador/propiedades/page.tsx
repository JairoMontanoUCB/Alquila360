"use client";

import React, { useState } from "react";
import Image from "next/image";
import SidebarAdministrador from "../../components/sideBarAdministrador";

type Propiedad = {
  img: string;
  direccion: string;
  estado: "Disponible" | "Ocupada";
  precio: string;
  descripcion: string;
  tipo: string;
  superficie: string;
  ambientes: string;
  garantia: string;
  servicios: string[];
};

const propiedades: Propiedad[] = [
  {
    img: "/propiedad.png",
    direccion: "Av. Principal 123, Piso 5",
    estado: "Disponible",
    precio: "$1.200/mes",
    descripcion:
      "Moderno departamento de 2 habitaciones con vista panorámica, balcón amplio y amenities completos.",
    tipo: "Casa",
    superficie: "120 m²",
    ambientes: "3 ambientes",
    garantia: "$2.400",
    servicios: ["WiFi", "Gas", "Agua", "Luz", "Cable", "Estacionamiento"],
  },
  {
    img: "/propiedad.png",
    direccion: "Calle Secundaria 456",
    estado: "Ocupada",
    precio: "$2.500/mes",
    descripcion:
      "Casa de lujo con 4 habitaciones, jardín privado y estacionamiento para 3 vehículos.",
    tipo: "Casa",
    superficie: "180 m²",
    ambientes: "5 ambientes",
    garantia: "$3.000",
    servicios: ["WiFi", "Gas", "Agua", "Luz", "Cable"],
  },
];

export default function PropiedadesPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [selectedProp, setSelectedProp] = useState<Propiedad | null>(null);

  const abrirReporte = (prop: Propiedad) => {
    setSelectedProp(prop);
    setOpenReport(true);
  };

  const cerrarReporte = () => {
    setOpenReport(false);
    setSelectedProp(null);
  };

  return (
    <main className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
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

        {/* TABLA */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Dirección</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((prop, index) => (
                <tr key={index} className="border-t">
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
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        prop.estado === "Disponible"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {prop.estado}
                    </span>
                  </td>
                  <td className="p-3">{prop.precio}</td>
                  <td className="p-3 w-64">{prop.descripcion}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {/* LÁPIZ: REPORTE COMPLETO */}
                      <button
                        onClick={() => abrirReporte(prop)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 transition"
                        aria-label="Reporte / editar propiedad"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-emerald-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>

                      {/* OJO: mismo reporte por ahora */}
                      <button
                        onClick={() => abrirReporte(prop)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition"
                        aria-label="Ver detalle propiedad"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-slate-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL: AGREGAR PROPIEDAD */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-300 p-6 overflow-y-auto max-h-[90vh] relative">
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setOpenAdd(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Agregar Nueva Propiedad</h2>

            <div className="space-y-6">
              {/* NOMBRE / TIPO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Nombre de la Propiedad
                  </label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Tipo de Propiedad
                  </label>
                  <select className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100">
                    <option>Casa</option>
                    <option>Departamento</option>
                    <option>Local</option>
                  </select>
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div>
                <label className="text-sm font-medium">Dirección Exacta</label>
                <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
              </div>

              {/* SUPERFICIE - AMBIENTES - ESTADO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Superficie (m²)
                  </label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Número de Ambientes
                  </label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
                </div>

                <div>
                  <label className="text-sm font-medium">Estado Actual</label>
                  <select className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100">
                    <option>Disponible</option>
                    <option>Ocupada</option>
                  </select>
                </div>
              </div>

              {/* PRECIO / GARANTÍA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Precio del Alquiler
                  </label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Precio de la Garantía
                  </label>
                  <input className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100" />
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100 h-24" />
              </div>

              {/* SERVICIOS */}
              <div>
                <label className="text-sm font-medium">
                  Servicios Incluidos
                </label>
                <input
                  className="w-full mt-1 border rounded-md px-3 py-2 bg-slate-100"
                  placeholder="Ej: WiFi, Gas, Agua, Luz, Cable, Estacionamiento"
                />
              </div>

              {/* IMÁGENES */}
              <div>
                <label className="text-sm font-medium">
                  Imágenes de la Propiedad
                </label>

                <div className="mt-2 border-2 border-[#123528] rounded-xl p-6 text-center bg-slate-50">
                  <p className="text-slate-700 mb-3">
                    Arrastra imágenes aquí o haz clic para seleccionar
                  </p>

                  <button className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-100">
                    Seleccionar Imágenes
                  </button>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setOpenAdd(false)}
                  className="px-4 py-2 border rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                  Cancelar
                </button>

                <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold">
                  Guardar Propiedad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPORTE COMPLETO DE PROPIEDAD */}
      {openReport && selectedProp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 md:px-12">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl border border-slate-300 overflow-y-auto max-h-[90vh] relative">
            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
              <h2 className="text-lg md:text-xl font-bold">
                Reporte Completo de Propiedad
              </h2>
              <button
                onClick={cerrarReporte}
                className="text-slate-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* GRID SUPERIOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Dirección</p>
                    <p className="text-sm font-medium">
                      {selectedProp.direccion}
                    </p>
                  </div>

                  <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">
                      Tipo de Propiedad
                    </p>
                    <p className="text-sm font-medium">
                      {selectedProp.tipo}
                    </p>
                  </div>

                  <div className="bg-[#faf7f0] border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">
                      Precio Mensual
                    </p>
                    <p className="text-sm font-medium">
                      {selectedProp.precio.replace("/mes", "")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-emerald-300 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">
                      Estado Actual
                    </p>
                    <span className="inline-flex px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {selectedProp.estado}
                    </span>
                  </div>

                  <div className="border border-slate-300 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Superficie</p>
                    <p className="text-sm font-medium">
                      {selectedProp.superficie}
                    </p>
                  </div>

                  <div className="border border-slate-300 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Ambientes</p>
                    <p className="text-sm font-medium">
                      {selectedProp.ambientes}
                    </p>
                  </div>

                  <div className="border border-slate-300 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Garantía</p>
                    <p className="text-sm font-medium">
                      {selectedProp.garantia}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="border border-slate-300 rounded-xl">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                  <span className="text-amber-600 text-lg">📝</span>
                  <p className="text-sm font-semibold">Descripción</p>
                </div>
                <div className="px-4 py-3 text-sm text-slate-700">
                  {selectedProp.descripcion}
                </div>
              </div>

              {/* SERVICIOS */}
              <div className="border border-slate-300 rounded-xl">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-semibold">Servicios Incluidos</p>
                </div>
                <div className="px-4 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedProp.servicios.map((servicio) => (
                      <button
                        key={servicio}
                        type="button"
                        className="w-full py-3 rounded-lg bg-[#f9f5ec] border border-slate-200 text-sm font-medium text-slate-700"
                      >
                        {servicio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-8 py-4 border-t border-slate-200">
              <button
                onClick={cerrarReporte}
                className="px-5 py-2 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Cerrar
              </button>
              <button className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm">
                Editar Propiedad
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
