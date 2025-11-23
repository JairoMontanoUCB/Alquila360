"use client";

import Sidebar from "../../components/sideBarPropietario"; // O "../../components/SidebarPropietario"

export default function ExpensasPage() {
  const resumen = {
    total: 400,
    pagadas: 280,
    noPagadas: 120,
  };

  const expensas = [
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
      monto: "$200",
      fecha: "2024-11-10",
      estado: "Pagado",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    if (estado === "Pagado") {
      return "bg-[#d3f7e8] text-[#1b7c4b]";
    }
    return "bg-[#ffd9dd] text-[#d8454f]";
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

          <button className="bg-[#f4b000] text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-[#d89c00] text-sm transition">
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
                  <th className="py-4 px-4">Fecha</th>
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
                    <td className="py-3 px-4 text-sm">{exp.monto}</td>
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
    </div>
  );
}
