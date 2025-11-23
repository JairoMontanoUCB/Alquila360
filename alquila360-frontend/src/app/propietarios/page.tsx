"use client";

import Sidebar from "../components/sideBarPropietario"; // ajusta la ruta si tu carpeta es distinta

export default function DashboardPropietario() {
  // Datos de ejemplo (luego vendrán del backend)
  const resumen = {
    propiedadesActivas: 1,
    contratosVigentes: 1,
    pagosMes: 1,
    expensasMes: 4,
  };

  const tickets = {
    urgentes: 1,
    medios: 1,
    bajos: 1,
  };

  const actividadReciente = [
    {
      id: "TKT-001",
      titulo: "Fuga de agua en el baño principal",
      fecha: "2024-11-18",
      prioridad: "Urgente",
    },
    {
      id: "TKT-002",
      titulo: "La puerta de entrada no cierra correctamente",
      fecha: "2024-11-15",
      prioridad: "Media",
    },
    {
      id: "TKT-003",
      titulo: "Pintura descascarada en la pared del dormitorio",
      fecha: "2024-11-10",
      prioridad: "Baja",
    },
  ];

  const getBadgeStyles = (prioridad: string) => {
    if (prioridad === "Urgente") {
      return "bg-[#ffd9dd] text-[#d8454f]";
    }
    if (prioridad === "Media") {
      return "bg-[#ffeac0] text-[#d18b1a]";
    }
    return "bg-[#cdefdc] text-[#1b7c4b]";
  };

  return (
    <div className="min-h-screen flex bg-[#f3efe3] text-[#15352b]">
      {/* SIDEBAR REUTILIZABLE */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-10 py-10">
          {/* Título */}
          <header className="mb-6">
            <h2 className="text-[32px] font-bold leading-tight">
              Dashboard del Propietario
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Resumen de tu actividad
            </p>
          </header>

          {/* TARJETAS DE RESUMEN */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Propiedades Activas */}
            <div className="bg-[#f7f3e8] border border-[#d4d0c5] rounded-[18px] px-6 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700 font-medium">
                  Propiedades Activas
                </span>
                <span className="h-9 w-9 rounded-xl bg-[#dde4d8] flex items-center justify-center text-[#6b8168] text-xl">
                  🏢
                </span>
              </div>
              <span className="text-2xl font-bold text-[#1c7b3b]">
                {resumen.propiedadesActivas}
              </span>
            </div>

            {/* Contratos Vigentes */}
            <div className="bg-[#f7f3e8] border border-[#d4d0c5] rounded-[18px] px-6 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700 font-medium">
                  Contratos Vigentes
                </span>
                <span className="h-9 w-9 rounded-xl bg-[#ffe9cf] flex items-center justify-center text-[#d18e30] text-xl">
                  📄
                </span>
              </div>
              <span className="text-2xl font-bold text-[#e28a26]">
                {resumen.contratosVigentes}
              </span>
            </div>

            {/* Pagos del Mes */}
            <div className="bg-[#f7f3e8] border border-[#d4d0c5] rounded-[18px] px-6 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700 font-medium">
                  Pagos del Mes
                </span>
                <span className="h-9 w-9 rounded-xl bg-[#fff4d9] flex items-center justify-center text-[#e4a526] text-xl">
                  💳
                </span>
              </div>
              <span className="text-2xl font-bold text-[#e4a526]">
                {resumen.pagosMes}
              </span>
            </div>

            {/* Expensas del Mes */}
            <div className="bg-[#f7f3e8] border border-[#d4d0c5] rounded-[18px] px-6 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700 font-medium">
                  Expensas del Mes
                </span>
                <span className="h-9 w-9 rounded-xl bg-[#e6eaed] flex items-center justify-center text-[#4b5f67] text-xl">
                  💵
                </span>
              </div>
              <span className="text-2xl font-bold text-[#1c7b3b]">
                {resumen.expensasMes}
              </span>
            </div>
          </section>

          {/* TICKETS + ACTIVIDAD */}
          <section>
            <h3 className="text-[15px] font-semibold mb-4">
              Tickets Abiertos por Prioridad
            </h3>

            {/* TICKETS POR PRIORIDAD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* Urgentes */}
              <div className="bg-white rounded-[18px] border-[2px] border-[#f46a6a] px-6 py-5 flex flex-col">
                <div className="flex items-center justify-between mb-4 text-sm text-[#444]">
                  <span>Urgentes</span>
                  <span className="text-[#f46a6a] text-lg">🔧</span>
                </div>
                <span className="text-3xl font-semibold text-[#f04646] mb-3">
                  {tickets.urgentes}
                </span>
                <span className="text-xs text-gray-600">
                  Requieren atención inmediata
                </span>
              </div>

              {/* Medios */}
              <div className="bg-white rounded-[18px] border-[2px] border-[#f6b24a] px-6 py-5 flex flex-col">
                <div className="flex items-center justify-between mb-4 text-sm text-[#444]">
                  <span>Medios</span>
                  <span className="text-[#f6b24a] text-lg">🔧</span>
                </div>
                <span className="text-3xl font-semibold text-[#f29b26] mb-3">
                  {tickets.medios}
                </span>
                <span className="text-xs text-gray-600">
                  Necesitan seguimiento
                </span>
              </div>

              {/* Bajos */}
              <div className="bg-white rounded-[18px] border-[2px] border-[#4cd093] px-6 py-5 flex flex-col">
                <div className="flex items-center justify-between mb-4 text-sm text-[#444]">
                  <span>Bajos</span>
                  <span className="text-[#4cd093] text-lg">🔧</span>
                </div>
                <span className="text-3xl font-semibold text-[#2bab6e] mb-3">
                  {tickets.bajos}
                </span>
                <span className="text-xs text-gray-600">
                  Para resolver pronto
                </span>
              </div>
            </div>

            {/* ACTIVIDAD RECIENTE */}
            <h3 className="text-[15px] font-semibold mb-4">
              Actividad Reciente
            </h3>

            <div className="bg-[#f7f3e8] border border-[#d4d0c5] rounded-[18px] px-7 py-6">
              {actividadReciente.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p className="text-sm text-[#374046] mb-1">
                        {item.id} - {item.titulo}
                      </p>
                      <p className="text-xs text-gray-500">{item.fecha}</p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-[11px] font-semibold ${getBadgeStyles(
                        item.prioridad
                      )}`}
                    >
                      {item.prioridad}
                    </span>
                  </div>
                  {index < actividadReciente.length - 1 && (
                    <div className="h-px bg-[#c8c4b8] mt-1" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
