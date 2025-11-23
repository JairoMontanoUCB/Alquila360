"use client";

import Sidebar from "../../components/sideBarPropietario";

export default function ContratosPage() {
  const contratosVigentes = [
    {
      id: "cont1",
      propiedad: "Calle Secundaria 456",
      inquilino: "María García",
      fechaInicio: "31/12/2023",
      fechaFin: "31/12/2024",
      cuotaMensual: "$2500",
      estado: "Vigente",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Titulo */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Contratos</h2>
            <p className="text-sm text-gray-600">
              Historial de contratos de alquiler
            </p>
          </div>

          {/* Botón Nuevo Contrato */}
          <button className="bg-[#f4b000] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#d89c00] transition">
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
                {contratosVigentes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">{c.id}</td>
                    <td className="py-3 px-4 text-sm">{c.propiedad}</td>
                    <td className="py-3 px-4 text-sm">{c.inquilino}</td>
                    <td className="py-3 px-4 text-sm">{c.fechaInicio}</td>
                    <td className="py-3 px-4 text-sm">{c.fechaFin}</td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      {c.cuotaMensual}
                    </td>

                    {/* ESTADO */}
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-[#d3f7e8] text-[#1b7c4b]">
                        {c.estado}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 flex gap-2 justify-center">
                      <button className="border border-[#15352b] rounded-lg p-2 hover:bg-gray-100 transition">
                        👁️
                      </button>
                      <button className="border border-[#15352b] rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                        Renovar
                      </button>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
