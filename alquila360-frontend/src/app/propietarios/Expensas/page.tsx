"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "../../components/sideBarPropietario";

type Expensa = {
  id: string;
  propiedad: string;
  tipo: string;
  descripcion: string;
  monto: number; // guardamos como número
  fecha: string; // aquí guardaremos el "Mes"
  estado: string;
};

const expensasIniciales: Expensa[] = [
  {
    id: "exp1",
    propiedad: "Calle Secundaria 456",
    tipo: "Agua",
    descripcion: "Factura de agua del mes de noviembre",
    monto: 45,
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp2",
    propiedad: "Calle Secundaria 456",
    tipo: "Luz",
    descripcion: "Factura de electricidad del mes de noviembre",
    monto: 120,
    fecha: "2024-11-15",
    estado: "No pagado",
  },
  {
    id: "exp3",
    propiedad: "Calle Secundaria 456",
    tipo: "Gas",
    descripcion: "Factura de gas del mes de noviembre",
    monto: 35,
    fecha: "2024-11-15",
    estado: "Pagado",
  },
  {
    id: "exp4",
    propiedad: "Calle Secundaria 456",
    tipo: "Mantenimiento",
    descripcion: "Mantenimiento general del edificio",
    monto: 200,
    fecha: "2024-11-10",
    estado: "Pagado",
  },
];

export default function ExpensasPage() {
  const [expensas, setExpensas] = useState<Expensa[]>(expensasIniciales);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // formulario de nueva expensa
  const [nuevaExpensa, setNuevaExpensa] = useState({
    propiedad: "",
    tipo: "Agua",
    mes: "",
    monto: "",
    estado: "No pagado",
    descripcion: "",
  });

  // resumen calculado a partir de las expensas
  const resumen = expensas.reduce(
    (acc, e) => {
      acc.total += e.monto;
      if (e.estado === "Pagado") acc.pagadas += e.monto;
      else acc.noPagadas += e.monto;
      return acc;
    },
    { total: 0, pagadas: 0, noPagadas: 0 }
  );

  const getEstadoBadge = (estado: string) => {
    if (estado === "Pagado") {
      return "bg-[#d3f7e8] text-[#1b7c4b]";
    }
    return "bg-[#ffd9dd] text-[#d8454f]";
  };

  // ------- MODAL ---------
  const abrirModal = () => {
    setNuevaExpensa({
      propiedad: "",
      tipo: "Agua",
      mes: "",
      monto: "",
      estado: "No pagado",
      descripcion: "",
    });
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevaExpensa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nuevoId = `exp${expensas.length + 1}`;

    const montoNumber = parseFloat(nuevaExpensa.monto || "0");

    const expensaAInsertar: Expensa = {
      id: nuevoId,
      propiedad: nuevaExpensa.propiedad || "Sin propiedad",
      tipo: nuevaExpensa.tipo || "Otro",
      descripcion:
        nuevaExpensa.descripcion || "Sin descripción adicional...",
      monto: isNaN(montoNumber) ? 0 : montoNumber,
      // usamos el campo "mes" como fecha mostrada en la tabla
      fecha: nuevaExpensa.mes || "Sin mes",
      estado: nuevaExpensa.estado,
    };

    setExpensas((prev) => [...prev, expensaAInsertar]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Título + botón */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Gestión de Expensas</h2>
            <p className="text-sm text-gray-600">Gastos por inmueble</p>
          </div>

          <button
            className="bg-[#f4b000] text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-[#d89c00] text-sm transition"
            onClick={abrirModal}
          >
            Registrar Expensa
          </button>
        </header>

        {/* TARJETAS RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Expensas */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#e4ecff] flex items-center justify-center text-[#3b5fb4] text-xl">
                💲
              </div>
              <span className="text-sm text-gray-700">Total Expensas</span>
            </div>
            <p className="text-2xl font-bold text-[#3b5fb4]">
              ${resumen.total}
            </p>
          </div>

          {/* Pagadas */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#d3f7e8] flex items-center justify-center text-[#1b7c4b] text-xl">
                💲
              </div>
              <span className="text-sm text-gray-700">Pagadas</span>
            </div>
            <p className="text-2xl font-bold text-[#1b7c4b]">
              ${resumen.pagadas}
            </p>
          </div>

          {/* No Pagadas */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#ffd9dd] flex items-center justify-center text-[#d8454f] text-xl">
                💲
              </div>
              <span className="text-sm text-gray-700">No Pagadas</span>
            </div>
            <p className="text-2xl font-bold text-[#d8454f]">
              ${resumen.noPagadas}
            </p>
          </div>
        </section>

        {/* TABLA DE EXPENSAS */}
        <section>
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Propiedad</th>
                  <th className="py-4 px-4">Tipo</th>
                  <th className="py-4 px-4">Descripción</th>
                  <th className="py-4 px-4">Monto</th>
                  <th className="py-4 px-4">Fecha / Mes</th>
                  <th className="py-4 px-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {expensas.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">{exp.id}</td>
                    <td className="py-3 px-4 text-sm">{exp.propiedad}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-xs">💲</span>
                        <span>{exp.tipo}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{exp.descripcion}</td>
                    <td className="py-3 px-4 text-sm">${exp.monto}</td>
                    <td className="py-3 px-4 text-sm">{exp.fecha}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getEstadoBadge(
                          exp.estado
                        )}`}
                      >
                        {exp.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL REGISTRAR EXPENSA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            {/* Header modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Registrar Nueva Expensa</h2>
              <button
                className="text-2xl leading-none px-2"
                onClick={cerrarModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primera fila: Propiedad y Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Propiedad</label>
                  <select
                    name="propiedad"
                    value={nuevaExpensa.propiedad}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                  >
                    <option value="">Seleccionar propiedad</option>
                    <option value="Calle Secundaria 456">
                      Calle Secundaria 456
                    </option>
                    <option value="Av. Principal 123, Piso 5">
                      Av. Principal 123, Piso 5
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Tipo de Expensa</label>
                  <select
                    name="tipo"
                    value={nuevaExpensa.tipo}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                  >
                    <option value="Agua">Agua</option>
                    <option value="Luz">Luz</option>
                    <option value="Gas">Gas</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Otro">Otros</option>
                  </select>
                </div>
              </div>

              {/* Segunda fila: Mes y Monto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Mes</label>
                  <input
                    type="text"
                    name="mes"
                    placeholder="Ej: Noviembre 2024"
                    value={nuevaExpensa.mes}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Monto</label>
                  <input
                    type="number"
                    name="monto"
                    placeholder="Ej: 5000"
                    value={nuevaExpensa.monto}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm mb-1">Estado</label>
                <select
                  name="estado"
                  value={nuevaExpensa.estado}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                >
                  <option value="No pagado">No pagado</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="descripcion"
                  value={nuevaExpensa.descripcion}
                  onChange={handleChange}
                  placeholder="Detalles adicionales sobre la expensa..."
                  className="w-full h-24 rounded-lg border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#f4b000] text-white hover:bg-[#d89c00] transition"
                >
                  Registrar Expensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
