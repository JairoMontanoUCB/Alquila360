    "use client";

import Sidebar from "../../components/sideBarPropietario"; // ajusta la ruta/nombre según tu proyecto

export default function PagosPage() {
  const resumen = {
    recibidos: 2500,
    pendientes: 2500,
    enMora: 2500,
  };

  const pagos = [
    {
      id: "pay1",
      mes: "Noviembre 2024",
      monto: "$250",
      fechaLimite: "2024-11-10",
      fechaPago: "2024-11-01",
      estado: "Pagado",
    },
    {
      id: "pay2",
      mes: "Diciembre 2024",
      monto: "$250",
      fechaLimite: "2024-12-10",
      fechaPago: "-",
      estado: "Pendiente",
    },
    {
      id: "pay3",
      mes: "Octubre 2024",
      monto: "$250",
      fechaLimite: "2024-10-10",
      fechaPago: "-",
      estado: "En mora",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    if (estado === "Pagado") {
      return "bg-[#d3f7e8] text-[#1b7c4b]";
    }
    if (estado === "Pendiente") {
      return "bg-[#ffeac0] text-[#d18b1a]";
    }
    return "bg-[#ffd9dd] text-[#d8454f]";
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Título + botón descargar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[32px] font-bold">Gestión de Pagos</h2>
            <p className="text-sm text-gray-600">
              Historial de cuotas y pagos
            </p>
          </div>

          <button className="flex items-center gap-2 border border-[#15352b] rounded-lg px-4 py-2 text-sm hover:bg-[#eae4d7] transition">
            <span>⬇️</span>
            <span>Descargar Historial</span>
          </button>
        </header>

        {/* TARJETAS RESUMEN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pagos recibidos */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#d3f7e8] flex items-center justify-center text-[#1b7c4b] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">Pagos</p>
            <p className="text-sm text-gray-700 mb-1">Recibidos</p>
            <p className="text-2xl font-bold text-[#1b7c4b]">
              ${resumen.recibidos}
            </p>
          </div>

          {/* Pagos pendientes */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#fff4d9] flex items-center justify-center text-[#e4a526] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">Pagos</p>
            <p className="text-sm text-gray-700 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-[#e4a526]">
              ${resumen.pendientes}
            </p>
          </div>

          {/* En mora */}
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl px-8 py-6 flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#ffd9dd] flex items-center justify-center text-[#d8454f] text-xl mb-3">
              💳
            </div>
            <p className="text-sm text-gray-700 mb-1">En Mora</p>
            <p className="text-2xl font-bold text-[#d8454f]">
              ${resumen.enMora}
            </p>
          </div>
        </section>

        {/* TABLA PAGOS */}
        <section>
          <div className="bg-[#f7f3e8] border border-[#cfc7b4] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#f7f3e8] text-left text-sm text-gray-700">
                <tr>
                  <th className="py-4 px-4">ID</th>
                  <th className="py-4 px-4">Mes</th>
                  <th className="py-4 px-4">Monto</th>
                  <th className="py-4 px-4">Fecha Límite</th>
                  <th className="py-4 px-4">Fecha de Pago</th>
                  <th className="py-4 px-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {pagos.map((pago) => (
                  <tr
                    key={pago.id}
                    className="border-t border-[#ded7c7] hover:bg-[#f1ede4]"
                  >
                    <td className="py-3 px-4 text-sm">{pago.id}</td>
                    <td className="py-3 px-4 text-sm">{pago.mes}</td>
                    <td className="py-3 px-4 text-sm">{pago.monto}</td>
                    <td className="py-3 px-4 text-sm">{pago.fechaLimite}</td>
                    <td className="py-3 px-4 text-sm">{pago.fechaPago}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getEstadoBadge(
                          pago.estado
                        )}`}
                      >
                        {pago.estado}
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
