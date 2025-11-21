"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarAdministrador from "../../components/sideBarAdministrador";

const activeLabel = "Expensas";

type EstadoExpensa = "Pagado" | "No pagado" | "Pendiente";

type Expensa = {
  id: string;
  propiedad: string;
  tipo: string;
  descripcion: string;
  monto: string; // ej: "$45"
  fecha: string; // "2024-11-15"
  estado: EstadoExpensa;
};

const expensasIniciales: Expensa[] = [
  {
    id: "exp1",
    propiedad: "Calle Secundaria 456",
    tipo: "Agua",
    descripcion: "Factura de agua del mes de noviembre",
    monto: "$45",
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp2",
    propiedad: "Calle Secundaria 456",
    tipo: "Luz",
    descripcion: "Factura de electricidad del mes de noviembre",
    monto: "$120",
    fecha: "2024-11-15",
    estado: "No pagado",
  },
  {
    id: "exp3",
    propiedad: "Calle Secundaria 456",
    tipo: "Gas",
    descripcion: "Factura de gas del mes de noviembre",
    monto: "$35",
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp4",
    propiedad: "Calle Secundaria 456",
    tipo: "Mantenimiento",
    descripcion: "Mantenimiento general del edificio",
    monto: "$90",
    fecha: "2024-11-10",
    estado: "Pagado",
  },
];

export default function ExpensasPage() {
  // lista editable
  const [lista, setLista] = useState<Expensa[]>(expensasIniciales);

  // modal crear
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);

  // modal editar
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [expensaEditar, setExpensaEditar] = useState<Expensa | null>(null);
  const [formEditar, setFormEditar] = useState({
    propiedad: "",
    tipo: "",
    descripcion: "",
    monto: "",
    fecha: "",
    estado: "Pendiente" as EstadoExpensa,
  });

  const parseMonto = (monto: string) => {
    const num = Number(monto.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const total = lista.reduce((acc, e) => acc + parseMonto(e.monto), 0);
  const pagadas = lista
    .filter((e) => e.estado === "Pagado")
    .reduce((acc, e) => acc + parseMonto(e.monto), 0);
  const noPagadas = lista
    .filter((e) => e.estado === "No pagado")
    .reduce((acc, e) => acc + parseMonto(e.monto), 0);

  const getEstadoClasses = (estado: EstadoExpensa) => {
    if (estado === "Pagado")
      return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    if (estado === "No pagado")
      return "bg-red-100 text-red-700 border border-red-300";
    return "bg-amber-100 text-amber-700 border border-amber-300";
  };

  // abrir modal editar
  const handleClickEditar = (exp: Expensa) => {
    setExpensaEditar(exp);
    setFormEditar({
      propiedad: exp.propiedad,
      tipo: exp.tipo,
      descripcion: exp.descripcion,
      monto: exp.monto.replace(/[^0-9.-]/g, ""),
      fecha: exp.fecha,
      estado: exp.estado,
    });
    setMostrarModalEditar(true);
  };

  // guardar cambios de edicion
  const handleGuardarEdicion = () => {
    if (!expensaEditar) return;
    setLista((prev) =>
      prev.map((e) =>
        e.id === expensaEditar.id
          ? {
              ...e,
              propiedad: formEditar.propiedad,
              tipo: formEditar.tipo,
              descripcion: formEditar.descripcion,
              monto: `$${formEditar.monto}`,
              fecha: formEditar.fecha,
              estado: formEditar.estado,
            }
          : e
      )
    );
    setMostrarModalEditar(false);
  };

  // eliminar expensa
  const handleEliminar = (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta expensa?")) return;
    setLista((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      {/* contenido */}
      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestion de Expensas
            </h1>
            <p className="text-sm text-slate-500">Gastos por inmueble</p>
          </div>

          <button
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold text-sm"
            onClick={() => setMostrarModalCrear(true)}
          >
            + Registrar Expensa
          </button>
        </header>

        {/* resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResumenCard titulo="Total Expensas" valor={`$${total}`} />
          <ResumenCard titulo="Pagadas" valor={`$${pagadas}`} color="emerald" />
          <ResumenCard
            titulo="No Pagadas"
            valor={`$${noPagadas}`}
            color="red"
          />
        </section>

        {/* tabla */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descripcion</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.id}</td>
                  <td className="p-3">{e.propiedad}</td>
                  <td className="p-3">{e.tipo}</td>
                  <td className="p-3">{e.descripcion}</td>
                  <td className="p-3">{e.monto}</td>
                  <td className="p-3">{e.fecha}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoClasses(
                        e.estado
                      )}`}
                    >
                      {e.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-emerald-100 rounded-lg hover:bg-emerald-200"
                        onClick={() => handleClickEditar(e)}
                      >
                        ✏️
                      </button>
                      <button
                        className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                        onClick={() => handleEliminar(e.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-slate-400 text-sm"
                  >
                    No hay expensas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL REGISTRAR NUEVA EXPENSA (maqueta, sin guardar en lista) */}
        {mostrarModalCrear && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-[#123528]">
                  Registrar Nueva Expensa
                </h2>
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setMostrarModalCrear(false)}
                >
                  ✕
                </button>
              </div>

              {/* cuerpo */}
              <div className="px-6 py-4 space-y-4 text-sm">
                {/* propiedad */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Propiedad
                  </label>
                  <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                    <option>Seleccionar propiedad</option>
                    <option>Calle Secundaria 456</option>
                    <option>San Isidro 1234</option>
                  </select>
                </div>

                {/* tipo / mes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Tipo de Expensa
                    </label>
                    <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                      <option>Agua</option>
                      <option>Luz</option>
                      <option>Gas</option>
                      <option>Mantenimiento</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Mes Correspondiente
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      placeholder="Noviembre 2024"
                    />
                  </div>
                </div>

                {/* monto / estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Monto ($)
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Estado
                    </label>
                    <select className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
                      <option>Pendiente</option>
                      <option>Pagado</option>
                      <option>No pagado</option>
                    </select>
                  </div>
                </div>

                {/* comentarios */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Comentarios
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm resize-none"
                    placeholder="Informacion adicional sobre la expensa..."
                  />
                </div>

                {/* footer */}
                <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
                    onClick={() => setMostrarModalCrear(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black"
                    onClick={() => setMostrarModalCrear(false)}
                  >
                    Guardar Expensa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR EXPENSA */}
        {mostrarModalEditar && expensaEditar && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-[#123528]">
                  Editar Expensa
                </h2>
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setMostrarModalEditar(false)}
                >
                  ✕
                </button>
              </div>

              {/* cuerpo */}
              <div className="px-6 py-4 space-y-4 text-sm">
                {/* propiedad */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Propiedad
                  </label>
                  <input
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                    value={formEditar.propiedad}
                    onChange={(e) =>
                      setFormEditar((f) => ({
                        ...f,
                        propiedad: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* tipo / fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Tipo de Expensa
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      value={formEditar.tipo}
                      onChange={(e) =>
                        setFormEditar((f) => ({ ...f, tipo: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      value={formEditar.fecha}
                      onChange={(e) =>
                        setFormEditar((f) => ({ ...f, fecha: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* descripcion */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Descripcion
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm resize-none"
                    value={formEditar.descripcion}
                    onChange={(e) =>
                      setFormEditar((f) => ({
                        ...f,
                        descripcion: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* monto / estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Monto ($)
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      value={formEditar.monto}
                      onChange={(e) =>
                        setFormEditar((f) => ({ ...f, monto: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Estado
                    </label>
                    <select
                      className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      value={formEditar.estado}
                      onChange={(e) =>
                        setFormEditar((f) => ({
                          ...f,
                          estado: e.target.value as EstadoExpensa,
                        }))
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="No pagado">No pagado</option>
                    </select>
                  </div>
                </div>

                {/* footer */}
                <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
                    onClick={() => setMostrarModalEditar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm font-semibold text-black"
                    onClick={handleGuardarEdicion}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---- componentes auxiliares ---- */

type ResumenCardProps = {
  titulo: string;
  valor: string;
  color?: "emerald" | "red";
};

function ResumenCard({ titulo, valor, color }: ResumenCardProps) {
  const colorClasses =
    color === "emerald"
      ? "text-emerald-600"
      : color === "red"
      ? "text-red-600"
      : "text-slate-800";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <span className="text-xs text-slate-500">{titulo}</span>
      <span className={`text-2xl font-bold mt-2 ${colorClasses}`}>{valor}</span>
    </div>
  );
}
