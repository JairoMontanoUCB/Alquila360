"use client";

import React, { useState } from "react";
import SidebarAdministrador from "../../components/sideBarAdministrador";

const activeLabel = "Expensas";

type EstadoExpensa = "Pagado" | "No pagado" | "Pendiente";
type TipoPago = "Cuotas" | "Expensas";

type Expensa = {
  id: string;
  propiedad: string;
  tipoPago: TipoPago;         // 🔥 NUEVO CAMPO
  tipo: string;
  descripcion: string;
  monto: string;
  fecha: string;
  estado: EstadoExpensa;
};

// Datos iniciales
const expensasIniciales: Expensa[] = [

  
];

export default function ExpensasPage() {
  const [lista, setLista] = useState<Expensa[]>(expensasIniciales);

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const [expensaEditar, setExpensaEditar] = useState<Expensa | null>(null);

  const [formEditar, setFormEditar] = useState({
    propiedad: "",
    tipoPago: "Expensas" as TipoPago,
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

  // === EDITAR ===
  const handleClickEditar = (exp: Expensa) => {
    setExpensaEditar(exp);
    setFormEditar({
      propiedad: exp.propiedad,
      tipoPago: exp.tipoPago,
      tipo: exp.tipo,
      descripcion: exp.descripcion,
      monto: exp.monto.replace(/[^0-9.-]/g, ""),
      fecha: exp.fecha,
      estado: exp.estado,
    });
    setMostrarModalEditar(true);
  };

  const handleGuardarEdicion = () => {
    if (!expensaEditar) return;
    setLista((prev) =>
      prev.map((e) =>
        e.id === expensaEditar.id
          ? {
              ...e,
              propiedad: formEditar.propiedad,
              tipoPago: formEditar.tipoPago,
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

  const handleEliminar = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta expensa?")) return;
    setLista((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen flex bg-[#0b3b2c] text-slate-900">
      <SidebarAdministrador />

      <section className="flex-1 bg-[#f7f5ee] px-10 py-8 overflow-y-auto">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-[#123528]">
              Gestión de Expensas
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

        {/* RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ResumenCard titulo="Total Expensas" valor={`$${total}`} />
          <ResumenCard titulo="Pagadas" valor={`$${pagadas}`} color="emerald" />
          <ResumenCard
            titulo="No Pagadas"
            valor={`$${noPagadas}`}
            color="red"
          />
        </section>

        {/* TABLA */}
        <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Propiedad</th>
                <th className="p-3">Tipo Pago</th> {/* 🔥 NUEVA COLUMNA */}
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
                  <td className="p-3">{e.tipoPago}</td>
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
                  <td colSpan={9} className="p-4 text-center text-slate-400">
                    No hay expensas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* === MODAL EDITAR === */}
        {mostrarModalEditar && expensaEditar && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Editar Expensa</h2>
                <button onClick={() => setMostrarModalEditar(false)}>✕</button>
              </div>

              <div className="px-6 py-4 space-y-4 text-sm">

                {/* Tipo Pago */}
                <div>
                  <label className="block text-xs mb-1">Tipo Pago</label>
                  <select
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.tipoPago}
                    onChange={(e) =>
                      setFormEditar((f) => ({
                        ...f,
                        tipoPago: e.target.value as TipoPago,
                      }))
                    }
                  >
                    <option value="Expensas">Expensas</option>
                    <option value="Cuotas">Cuotas</option>
                  </select>
                </div>

                {/* Propiedad */}
                <div>
                  <label className="block text-xs mb-1">Propiedad</label>
                  <input
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.propiedad}
                    onChange={(e) =>
                      setFormEditar((f) => ({ ...f, propiedad: e.target.value }))
                    }
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-xs mb-1">Tipo</label>
                  <input
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.tipo}
                    onChange={(e) =>
                      setFormEditar((f) => ({ ...f, tipo: e.target.value }))
                    }
                  />
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-xs mb-1">Fecha</label>
                  <input
                    type="date"
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.fecha}
                    onChange={(e) =>
                      setFormEditar((f) => ({ ...f, fecha: e.target.value }))
                    }
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.descripcion}
                    onChange={(e) =>
                      setFormEditar((f) => ({
                        ...f,
                        descripcion: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-xs mb-1">Monto</label>
                  <input
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
                    value={formEditar.monto}
                    onChange={(e) =>
                      setFormEditar((f) => ({ ...f, monto: e.target.value }))
                    }
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-xs mb-1">Estado</label>
                  <select
                    className="w-full border bg-slate-50 px-3 py-2 rounded-md"
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

                {/* Guardar */}
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 border rounded-lg"
                    onClick={() => setMostrarModalEditar(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="px-4 py-2 bg-yellow-400 rounded-lg text-black"
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

/* ---- CARD ---- */

function ResumenCard({
  titulo,
  valor,
  color,
}: {
  titulo: string;
  valor: string;
  color?: "emerald" | "red";
}) {
  const colorClasses =
    color === "emerald"
      ? "text-emerald-600"
      : color === "red"
      ? "text-red-600"
      : "text-slate-800";

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <span className="text-xs text-slate-500">{titulo}</span>
      <span className={`text-2xl font-bold mt-2 ${colorClasses}`}>
        {valor}
      </span>
    </div>
  );
}
